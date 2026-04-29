# Changelog

## 2026-04-12

### 修复：e02.gif 超包大小限制导致手机预览失败

**问题**：微信开发者工具中可正常预览，但手机扫码预览报 `Error: timeout`，同时代码质量检查提示"图片和音频资源大小不应超过200K"未通过。

**原因**：`miniprogram/images/exercises/e02.gif`（腹式呼吸）原始文件 **417K**，超过微信小程序包内静态资源 200K 上限。开发者工具读本地文件不受影响，手机预览需从微信服务器下载包，下载超时。

**处理方式**：用 Python Pillow 对 e02.gif 进行压缩：

| 参数 | 压缩前 | 压缩后 |
|------|--------|--------|
| 文件大小 | 417K | **86K** |
| 尺寸 | 550×400px | 320×232px |
| 颜色数 | 256色 | 32色 |
| 帧数 | 31帧 | 16帧（每帧 duration 加倍，速度不变） |

**压缩脚本**（可复现）：

```python
from PIL import Image, ImageSequence

img = Image.open('miniprogram/images/exercises/e02.gif')
frames_raw = [f.copy() for f in ImageSequence.Iterator(img)]
durations = [f.info.get('duration', 100) for f in ImageSequence.Iterator(img)]

sampled_frames = frames_raw[::2]
sampled_durations = [d * 2 for d in durations[::2]]

out_frames = []
for f in sampled_frames:
    frame = f.convert('RGBA').resize((320, 232), Image.LANCZOS)
    frame = frame.convert('P', palette=Image.ADAPTIVE, colors=32)
    out_frames.append(frame)

out_frames[0].save(
    'miniprogram/images/exercises/e02.gif',
    save_all=True, append_images=out_frames[1:],
    optimize=True, loop=0,
    duration=sampled_durations
)
```

**注意**：其他 GIF（e01/e03~e07）均在 60K 以下，无需处理。若后续重新生成 e02.gif，需确保输出文件 < 200K。
