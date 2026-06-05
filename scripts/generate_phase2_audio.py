#!/usr/bin/env python3
"""Generate phase 2 rehab audio with Xiaomi MiMo voice clone."""

from __future__ import annotations

import argparse
import base64
import json
import os
import shutil
import ssl
import subprocess
import sys
import tempfile
import urllib.error
import urllib.request
import wave
from pathlib import Path


PROJECT_ROOT = Path("/Users/wanglijun/claude code projects/产后修复")
DATA_JS = PROJECT_ROOT / "miniprogram" / "utils" / "data.js"
AUDIO_ROOT = PROJECT_ROOT / "miniprogram" / "audio"
API_URL = "https://api.xiaomimimo.com/v1/chat/completions"
MODEL = "mimo-v2.5-tts-voiceclone"
STYLE_PROMPT = (
    "请严格复刻提供样本中的说话人音色。"
    "保持温柔、稳定、专业的产后康复指导语气。"
    "语速中等偏慢，咬字清晰，自然停顿，不要表演化，不要夸张情绪。"
    "每句像阶段一现有训练语音一样，简短、明确、可跟练。"
)

DEFAULT_REFERENCE_FILES = [
    AUDIO_ROOT / "e01" / "01.m4a",
    AUDIO_ROOT / "e01" / "02.m4a",
    AUDIO_ROOT / "e01" / "03.m4a",
    AUDIO_ROOT / "e02" / "01.m4a",
    AUDIO_ROOT / "e02" / "02.m4a",
    AUDIO_ROOT / "e02" / "03.m4a",
    AUDIO_ROOT / "e03" / "01.m4a",
    AUDIO_ROOT / "e03" / "02.m4a",
    AUDIO_ROOT / "e03" / "03.m4a",
    AUDIO_ROOT / "e04" / "01.m4a",
    AUDIO_ROOT / "e04" / "02.m4a",
    AUDIO_ROOT / "e04" / "03.m4a",
]


def run(cmd: list[str]) -> str:
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(
            "Command failed:\n{}\nstdout:\n{}\nstderr:\n{}".format(
                " ".join(cmd), result.stdout, result.stderr
            )
        )
    return result.stdout


def load_phase2_steps() -> list[dict]:
    node_script = """
const path = process.argv[1];
const { EXERCISES } = require(path);
const phase2 = EXERCISES
  .filter((item) => item.phase === 2)
  .map((item) => ({
    id: item.id,
    name: item.name,
    steps: item.practice.steps.map((step, index) => ({
      index: index + 1,
      cue: step.cue,
      ttsText: step.ttsText || step.cue,
      ttsPrompt: step.ttsPrompt || ''
    }))
  }));
process.stdout.write(JSON.stringify(phase2));
"""
    output = run(["node", "-e", node_script, str(DATA_JS)])
    return json.loads(output)


def to_wav(src: Path, dst: Path) -> None:
    run(
        [
            "afconvert",
            "-f",
            "WAVE",
            "-d",
            "LEI16@24000",
            str(src),
            str(dst),
        ]
    )


def to_m4a(src: Path, dst: Path) -> None:
    run(["afconvert", "-f", "m4af", "-d", "aac", str(src), str(dst)])


def build_reference_wav(reference_files: list[Path], out_path: Path) -> None:
    with tempfile.TemporaryDirectory(prefix="phase2_ref_") as tmp_dir:
        tmp_root = Path(tmp_dir)
        wav_paths: list[Path] = []
        for idx, src in enumerate(reference_files, start=1):
            if not src.exists():
                raise FileNotFoundError(f"Reference file not found: {src}")
            wav_path = tmp_root / f"ref_{idx:02d}.wav"
            to_wav(src, wav_path)
            wav_paths.append(wav_path)

        with wave.open(str(out_path), "wb") as combined:
            with wave.open(str(wav_paths[0]), "rb") as first:
                combined.setnchannels(first.getnchannels())
                combined.setsampwidth(first.getsampwidth())
                combined.setframerate(first.getframerate())

            for wav_path in wav_paths:
                with wave.open(str(wav_path), "rb") as current:
                    combined.writeframes(current.readframes(current.getnframes()))


def synthesize_wav(api_key: str, reference_wav: Path, text: str, out_path: Path, extra_prompt: str = "") -> None:
    voice_base64 = base64.b64encode(reference_wav.read_bytes()).decode("utf-8")
    user_prompt = STYLE_PROMPT if not extra_prompt else STYLE_PROMPT + extra_prompt
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "user", "content": user_prompt},
            {"role": "assistant", "content": text},
        ],
        "audio": {
            "format": "wav",
            "voice": f"data:audio/wav;base64,{voice_base64}",
        },
    }
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        headers={
            "api-key": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )

    response_body = None
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            response_body = resp.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"MiMo API request failed: HTTP {exc.code}\n{detail}") from exc
    except urllib.error.URLError as exc:
        if isinstance(exc.reason, ssl.SSLCertVerificationError) and shutil.which("curl"):
            response_body = request_with_curl(api_key, body)
        else:
            raise RuntimeError(f"MiMo API request failed: {exc}") from exc

    if response_body is None:
        raise RuntimeError("MiMo API request failed: empty response")

    data = json.loads(response_body)
    try:
        audio_b64 = data["choices"][0]["message"]["audio"]["data"]
    except (KeyError, IndexError, TypeError) as exc:
        raise RuntimeError(f"Unexpected MiMo response:\n{json.dumps(data, ensure_ascii=False, indent=2)}") from exc

    out_path.write_bytes(base64.b64decode(audio_b64))


def request_with_curl(api_key: str, body: bytes) -> str:
    result = subprocess.run(
        [
            "curl",
            "--silent",
            "--show-error",
            "--location",
            "--request",
            "POST",
            API_URL,
            "--header",
            f"api-key: {api_key}",
            "--header",
            "Content-Type: application/json",
            "--data-binary",
            "@-",
        ],
        input=body,
        capture_output=True,
    )
    if result.returncode != 0:
        stderr = result.stderr.decode("utf-8", errors="replace")
        raise RuntimeError(f"MiMo API request failed via curl:\n{stderr}")
    return result.stdout.decode("utf-8")


def resolve_reference_files(reference_arg: str | None) -> list[Path]:
    if not reference_arg:
        return DEFAULT_REFERENCE_FILES
    return [Path(item).expanduser() for item in reference_arg.split(",") if item.strip()]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate phase 2 rehab audio with MiMo voice clone.")
    parser.add_argument(
        "--exercise",
        help="Only generate one exercise, e.g. s01",
    )
    parser.add_argument(
        "--reference-files",
        help="Comma-separated list of phase 1 sample files for voice clone.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing audio files.",
    )
    parser.add_argument(
        "--keep-wav",
        action="store_true",
        help="Keep intermediate wav files next to generated m4a files.",
    )
    parser.add_argument(
        "--targets",
        help="Comma-separated step targets, e.g. s01:3,s03:2,s06:1",
    )
    return parser.parse_args()


def parse_targets(targets_arg: str | None) -> dict[str, set[int]]:
    if not targets_arg:
        return {}
    result: dict[str, set[int]] = {}
    for item in targets_arg.split(","):
        raw = item.strip()
        if not raw:
            continue
        try:
            ex_id, step_no = raw.split(":", 1)
            result.setdefault(ex_id.strip(), set()).add(int(step_no))
        except ValueError as exc:
            raise ValueError(f"Invalid target format: {raw}") from exc
    return result


def main() -> int:
    args = parse_args()
    api_key = os.environ.get("MIMO_API_KEY")
    if not api_key:
        print("MIMO_API_KEY is not set.", file=sys.stderr)
        return 1

    if not shutil.which("afconvert"):
        print("afconvert is required on macOS but was not found.", file=sys.stderr)
        return 1

    phase2 = load_phase2_steps()
    if args.exercise:
        phase2 = [item for item in phase2 if item["id"] == args.exercise]
        if not phase2:
            print(f"Exercise not found: {args.exercise}", file=sys.stderr)
            return 1
    target_map = parse_targets(args.targets)
    if target_map:
        phase2 = [item for item in phase2 if item["id"] in target_map]
        if not phase2:
            print("No matching exercise found for --targets.", file=sys.stderr)
            return 1

    reference_files = resolve_reference_files(args.reference_files)

    with tempfile.TemporaryDirectory(prefix="phase2_audio_") as tmp_dir:
        tmp_root = Path(tmp_dir)
        reference_wav = tmp_root / "reference.wav"
        build_reference_wav(reference_files, reference_wav)

        for exercise in phase2:
            exercise_dir = AUDIO_ROOT / exercise["id"]
            exercise_dir.mkdir(parents=True, exist_ok=True)
            print(f"Generating {exercise['id']} {exercise['name']}")
            allowed_steps = target_map.get(exercise["id"], set())

            for step in exercise["steps"]:
                if allowed_steps and step["index"] not in allowed_steps:
                    continue
                name = f"{step['index']:02d}"
                wav_path = exercise_dir / f"{name}.wav"
                m4a_path = exercise_dir / f"{name}.m4a"
                if m4a_path.exists() and not args.force:
                    print(f"  skip {m4a_path.name}")
                    continue

                print(f"  -> {name} {step['ttsText']}")
                synthesize_wav(api_key, reference_wav, step["ttsText"], wav_path, step["ttsPrompt"])
                to_m4a(wav_path, m4a_path)
                if not args.keep_wav:
                    wav_path.unlink(missing_ok=True)

    print("Phase 2 audio generation complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
