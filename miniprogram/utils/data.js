/**
 * utils/data.js — 内嵌运动数据
 * 数据来源：backend/exercises.json
 * 更新时需同步两处
 */
const EXERCISES = [
  {
    id: 'e01',
    name: '踝泵运动',
    icon: '🦶',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '预防血栓', cls: 'tag-green' },
      { label: '小腿肌群', cls: 'tag-warm' },
      { label: '每小时1-2组', cls: 'tag-gray' }
    ],
    purpose: '激活小腿肌肉泵，促进静脉回流，预防深静脉血栓（DVT）。无论顺产或剖宫产，术后当天即可在床上开始。',
    steps: [
      '脚尖向上勾起（背屈），保持 2 秒',
      '脚尖向下绷直（跖屈），保持 2 秒',
      '顺时针缓慢画圆约 10 秒，逆时针同'
    ],
    notes: [
      '剖宫产术后当天在床上即可开始',
      '小腿出现明显肿痛、发热、发红时立即停止，警惕血栓'
    ],
    freq: '每小时 1-2 组 · 各方向约 10 秒',
    practice: {
      totalSets: 2,
      rest: 10,
      steps: [
        { cue: '准备好了，我们开始踝泵运动', phase: '准备', dur: 6, audio: '/audio/e01/01.m4a' },
        { cue: '脚尖向上勾起', phase: '背屈 · 保持 3 秒', dur: 3, hint: '每个动作 3 秒', audio: '/audio/e01/02.m4a' },
        { cue: '向下绷直', phase: '跖屈 · 保持 3 秒', dur: 3, hint: '每个动作 3 秒', audio: '/audio/e01/03.m4a' },
        { cue: '顺时针缓慢画圆', phase: '画圆 · 约 10 秒', dur: 10, audio: '/audio/e01/04.m4a' },
        { cue: '逆时针缓慢画圆', phase: '画圆 · 约 10 秒', dur: 10, audio: '/audio/e01/05.m4a' }
      ],
      repeatGroup: { from: 1, to: 2, times: 20 }
    }
  },
  {
    id: 'e02',
    name: '腹式呼吸',
    icon: '🌬️',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '激活横膈膜', cls: 'tag-green' },
      { label: '核心内压', cls: 'tag-warm' },
      { label: '每天2-3次', cls: 'tag-gray' }
    ],
    purpose: '重建横膈膜-盆底协同机制，恢复核心内压调控，激活腹横肌。是产后最基础也最重要的康复练习之一。',
    steps: [
      '仰卧屈膝，双手轻放腹部',
      '鼻子缓慢吸气 4 秒，感受腹部向四周柔和扩张，盆底随之轻柔放松',
      '用嘴缓慢呼气 6 秒（可发"嘶"声），腹部温和内收，盆底随之上提',
      '共做 10-15 次为一组'
    ],
    notes: [
      '不要用力憋气或用力推腹',
      '剖宫产初期若切口有牵拉感属正常，不要因此屏住呼吸',
      '若头晕，减慢呼吸节奏或休息片刻'
    ],
    freq: '每天 2-3 次 · 每次约 5 分钟',
    practice: {
      totalSets: 3,
      rest: 15,
      steps: [
        { cue: '双膝屈曲，双手轻放腹部，跟着我呼吸', phase: '准备', dur: 6, audio: '/audio/e02/01.m4a' },
        { cue: '鼻子缓慢吸气……', phase: '吸气 · 4秒', dur: 4, audio: '/audio/e02/02.m4a' },
        { cue: '缓慢呼出……', phase: '呼气 · 6秒', dur: 6, audio: '/audio/e02/03.m4a' }
      ],
      repeatGroup: { from: 1, to: 2, times: 5 }
    }
  },
  {
    id: 'e03',
    name: '基础凯格尔',
    icon: '❤️',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '唤醒盆底', cls: 'tag-green' },
      { label: '盆底肌群', cls: 'tag-warm' },
      { label: '每天3组', cls: 'tag-gray' }
    ],
    purpose: '唤醒盆底本体感觉，温和激活盆底肌，改善产后漏尿和盆腔器官支撑力。',
    steps: [
      '仰卧屈膝，全身放松，先感受盆底完全放松（想象如一朵花打开）',
      '缓慢收缩盆底（想象用肌肉阻断排尿），保持 5 秒',
      '缓慢放松，完全松开，保持 5 秒',
      '快速收缩放松，1秒1次，共10次为一组'
    ],
    notes: [
      '顺产会阴伤口疼痛加剧时停止，待减轻后再尝试',
      '不要同时收紧臀部、大腿或腹部',
      '不要在排尿过程中练习憋尿'
    ],
    freq: '每天 3 组 · 慢缩×10 + 快缩×10',
    practice: {
      totalSets: 3,
      rest: 15,
      steps: [
        { cue: '放松全身，感受盆底', phase: '准备', dur: 6, audio: '/audio/e03/01.m4a' },
        { cue: '缓慢收缩……', phase: '收缩 · 5秒', dur: 5, audio: '/audio/e03/02.m4a' },
        { cue: '完全放松盆底——不要用力', phase: '放松 · 5秒', dur: 5, audio: '/audio/e03/03.m4a' },
        { cue: '快速收缩！', phase: '快速抽动', dur: 1, audio: '/audio/e03/04.m4a' }
      ],
      repeatGroup: { from: 1, to: 2, times: 10 },
      repeatGroup2: { from: 3, to: 3, times: 10 }
    }
  },
  {
    id: 'e04',
    name: '腹横肌激活',
    icon: '💪',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '深层核心', cls: 'tag-green' },
      { label: '腹横肌', cls: 'tag-warm' },
      { label: '每天2次', cls: 'tag-gray' }
    ],
    purpose: '在最安全体位下激活最深层腹肌，避免增加腹内压，是修复腹直肌分离的基础练习。',
    steps: [
      '仰卧屈膝，先做一次腹式呼吸',
      '呼气时，轻轻将肚脐向脊柱方向内收（像把肚皮从裤腰带上拿开）',
      '保持轻度内收，做 3-5 次正常呼吸后放松',
      '重复 8-10 次为一组'
    ],
    notes: [
      '千万不要憋气！应能在保持内收的同时正常呼吸',
      '剖宫产若腹部切口有牵拉感，减小内收幅度'
    ],
    freq: '每天 2 次 · 每次 8-10 个',
    practice: {
      totalSets: 2,
      rest: 20,
      steps: [
        { cue: '仰卧屈膝，先做一次腹式呼吸', phase: '准备', dur: 6, audio: '/audio/e04/01.m4a' },
        { cue: '呼气，轻轻内收肚脐', phase: '内收', dur: 6, audio: '/audio/e04/02.m4a' },
        { cue: '保持内收，正常呼吸', phase: '维持 10秒', dur: 10, hint: '保持自然呼吸，不要憋气', audio: '/audio/e04/03.m4a' },
        { cue: '放松', phase: '放松 3秒', dur: 3, audio: '/audio/e04/04.m4a' }
      ],
      repeatGroup: { from: 1, to: 3, times: 10 }
    }
  },
  {
    id: 'e05',
    name: '翻身起床姿势',
    icon: '🛏️',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '日常动作', cls: 'tag-green' },
      { label: '保护腹压', cls: 'tag-gray' }
    ],
    purpose: '减少腹压，保护腹直肌和盆底，防止剖宫产伤口在起床时受力撕裂。每次起床都应执行。',
    steps: [
      '先将双腿一起滚向侧方',
      '用下方手肘和上方手掌撑床，将身体推起至坐位',
      '坐稳后再慢慢起立',
      '【禁止】直接从仰卧坐起——这会极大增加腹内压'
    ],
    notes: [
      '剖宫产妈妈尤其重要，每次起床都要使用此方法',
      '坐起后先感受一下，无头晕再缓慢站立'
    ],
    freq: '日常动作 · 每次起床时执行',
    practice: {
      totalSets: 1,
      rest: 0,
      mode: 'guide',
      steps: [
        { cue: '我们练习正确的翻身起床', phase: '准备', dur: 6, audio: '/audio/e05/01.m4a' },
        { cue: '双腿一起滚向侧方', phase: '步骤一', dur: 4, audio: '/audio/e05/02.m4a' },
        { cue: '手肘和手掌撑床', phase: '步骤二', dur: 4, audio: '/audio/e05/03.m4a' },
        { cue: '推起身体至坐位', phase: '步骤三', dur: 3, audio: '/audio/e05/04.m4a' },
        { cue: '坐稳，缓慢起立', phase: '步骤四', dur: 4, audio: '/audio/e05/05.m4a' }
      ]
    }
  },
  {
    id: 'e06',
    name: '床上腿部运动',
    icon: '🦵',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '下肢力量', cls: 'tag-green' },
      { label: '髋屈肌', cls: 'tag-warm' },
      { label: '每天1-2组', cls: 'tag-gray' }
    ],
    purpose: '在不增加腹内压的前提下，温和激活髋屈肌和下肢肌肉，改善血液循环，预防下肢无力。',
    steps: [
      '仰卧屈膝，双脚平踩床面',
      '呼气，轻度激活腹横肌（轻轻内收肚脐）',
      '缓慢将一条腿沿床面向远端滑出，脚跟不离床',
      '腿伸直后停顿 1-2 秒，再缓慢弯回，两侧交替'
    ],
    notes: [
      '腿滑出时腰背不要拱起，保持脊柱中立',
      '感觉腹部"撑起来"说明腹压过大，减小动作幅度'
    ],
    freq: '每天 1-2 组 · 每侧 10 次',
    practice: {
      totalSets: 2,
      rest: 15,
      steps: [
        { cue: '仰卧屈膝，准备好了', phase: '准备', dur: 6, audio: '/audio/e06/01.m4a' },
        { cue: '呼气，激活核心', phase: '核心激活', dur: 3, audio: '/audio/e06/02.m4a' },
        { cue: '右腿缓慢沿床面滑出', phase: '右腿滑出', dur: 3, audio: '/audio/e06/03.m4a' },
        { cue: '停顿', phase: '保持 2秒', dur: 2, audio: '/audio/e06/04.m4a' },
        { cue: '缓慢弯回', phase: '收腿', dur: 3, audio: '/audio/e06/05.m4a' },
        { cue: '换左腿', phase: '换腿', dur: 2, audio: '/audio/e06/06.m4a' },
        { cue: '左腿缓慢沿床面滑出', phase: '左腿滑出', dur: 3, audio: '/audio/e06/07.m4a' },
        { cue: '停顿', phase: '保持 2秒', dur: 2, audio: '/audio/e06/04.m4a' },
        { cue: '缓慢弯回', phase: '收腿', dur: 3, audio: '/audio/e06/05.m4a' }
      ],
      repeatGroup: { from: 2, to: 4, times: 10 },
      repeatGroup2: { from: 6, to: 8, times: 10 }
    }
  },
  {
    id: 'e07',
    name: '坐姿与站姿管理',
    icon: '🧘',
    gif: '', // TODO: 待接入CDN后恢复
    tags: [
      { label: '姿势纠正', cls: 'tag-green' },
      { label: '日常指导', cls: 'tag-gray' }
    ],
    purpose: '纠正产后常见的腰椎过度前凸和圆肩驼背，减轻哺乳造成的颈肩疲劳，降低慢性腰痛风险。',
    steps: [
      '坐时坐骨均匀承重，不塌腰拱背',
      '肩膀自然后落，哺乳时用哺乳枕垫高婴儿，避免低头弓背',
      '站立时重心均匀分布在双脚，不习惯性偏重一侧',
      '抱婴儿时不要总用单侧髋部"托孩子"'
    ],
    notes: [
      '每隔 30 分钟提醒自己检查一次坐姿',
      '哺乳姿势非常关键，长期弓背会加重颈椎问题'
    ],
    freq: '日常意识 · 随时调整',
    practice: {
      totalSets: 1,
      rest: 0,
      mode: 'guide',
      steps: [
        { cue: '我们来做一次坐姿检查', phase: '开始', dur: 6, audio: '/audio/e07/01.m4a' },
        { cue: '坐骨均匀承重，不塌腰', phase: '骨盆中立', dur: 8, audio: '/audio/e07/02.m4a' },
        { cue: '肩膀自然后落，不耸肩', phase: '肩部放松', dur: 8, audio: '/audio/e07/03.m4a' },
        { cue: '深呼吸，感受正确体态', phase: '放松感受', dur: 8, audio: '/audio/e07/04.m4a' }
      ]
    }
  }
];

const ENCOURAGEMENTS = [
  '每一次小小的坚持，\n都是送给自己最好的礼物。\n你正在一步步找回那个强大的自己 💚',
  '今天的你，比昨天更好。\n身体正在悄悄记住每一次努力，\n继续加油！',
  '产后康复不是赛跑，是一段温柔的旅程。\n你今天做到了，就是胜利 🌸',
  '宝宝需要一个健康的妈妈，\n你正在为此努力，这很了不起！',
  '休息是恢复的一部分，运动也是。\n你在照顾好自己，这值得骄傲 ✨'
];

module.exports = { EXERCISES, ENCOURAGEMENTS };
