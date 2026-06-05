function tag(label, cls) {
  return { label: label, cls: cls };
}

const EXERCISES = [
  {
    id: 'e01',
    phase: 1,
    mode: 'practice',
    name: '踝泵运动',
    icon: '🦶',
    gif: '',
    pose: '仰卧 / 坐位',
    goal: '促进血液循环',
    tags: [
      tag('预防血栓', 'tag-green'),
      tag('小腿肌群', 'tag-warm'),
      tag('每小时 1-2 组', 'tag-gray')
    ],
    purpose: '激活小腿肌肉泵，促进静脉回流，预防深静脉血栓（DVT）。无论顺产或剖宫产，术后当天即可在床上开始。',
    steps: [
      '脚尖向上勾起（背屈），保持 2 秒。',
      '脚尖向下绷直（跖屈），保持 2 秒。',
      '顺时针、逆时针缓慢画圆，各约 10 秒。'
    ],
    notes: [
      '剖宫产术后当天在床上即可开始。',
      '小腿出现明显肿痛、发热、发红时立即停止，警惕血栓。'
    ],
    freq: '每小时 1-2 组 · 各方向约 10 秒',
    practice: {
      totalSets: 2,
      rest: 10,
      steps: [
        { cue: '准备好了，我们开始踝泵运动', phase: '准备', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e01/01.m4a' },
        { cue: '脚尖向上勾起', phase: '背屈 · 保持 3 秒', dur: 3, hint: '每个动作保持 3 秒', audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e01/02.m4a' },
        { cue: '向下绷直', phase: '跖屈 · 保持 3 秒', dur: 3, hint: '每个动作保持 3 秒', audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e01/03.m4a' },
        { cue: '顺时针缓慢画圆', phase: '画圆 · 约 10 秒', dur: 10, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e01/04.m4a' },
        { cue: '逆时针缓慢画圆', phase: '画圆 · 约 10 秒', dur: 10, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e01/05.m4a' }
      ],
      repeatGroup: { from: 1, to: 2, times: 20 }
    }
  },
  {
    id: 'e02',
    phase: 1,
    mode: 'practice',
    name: '腹式呼吸',
    icon: '🌬️',
    gif: '',
    pose: '仰卧',
    goal: '恢复呼吸模式',
    tags: [
      tag('激活横膈膜', 'tag-green'),
      tag('核心内压', 'tag-warm'),
      tag('每天 2-3 次', 'tag-gray')
    ],
    purpose: '重建横膈膜-盆底协同机制，恢复核心内压调控，激活腹横肌，是产后最基础也最重要的康复练习之一。',
    steps: [
      '仰卧屈膝，双手轻放腹部。',
      '鼻子缓慢吸气 4 秒，感受腹部柔和扩张。',
      '用嘴缓慢呼气 6 秒，腹部温和内收，盆底随之上提。'
    ],
    notes: [
      '不要用力憋气或用力推腹。',
      '若头晕，减慢呼吸节奏或休息片刻。'
    ],
    freq: '每天 2-3 次 · 每次约 5 分钟',
    practice: {
      totalSets: 3,
      rest: 15,
      steps: [
        { cue: '双膝屈曲，双手轻放腹部，跟着我呼吸', phase: '准备', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e02/01.m4a' },
        { cue: '鼻子缓慢吸气……', phase: '吸气 · 4 秒', dur: 4, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e02/02.m4a' },
        { cue: '缓慢呼出……', phase: '呼气 · 6 秒', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e02/03.m4a' }
      ],
      repeatGroup: { from: 1, to: 2, times: 5 }
    }
  },
  {
    id: 'e03',
    phase: 1,
    mode: 'practice',
    name: '基础凯格尔',
    icon: '❤️',
    gif: '',
    pose: '仰卧',
    goal: '唤醒盆底肌',
    tags: [
      tag('唤醒盆底', 'tag-green'),
      tag('盆底肌群', 'tag-warm'),
      tag('每天 3 组', 'tag-gray')
    ],
    purpose: '唤醒盆底本体感觉，温和激活盆底肌，改善产后漏尿和盆腔器官支撑力。',
    steps: [
      '仰卧屈膝，全身放松，先感受盆底完全放松。',
      '缓慢收缩盆底，保持 5 秒。',
      '完全放松 5 秒，再进入快速收缩。'
    ],
    notes: [
      '不要同时收紧臀部、大腿或腹部。',
      '不要在排尿过程中练习憋尿。'
    ],
    freq: '每天 3 组 · 慢缩 × 10 + 快缩 × 10',
    practice: {
      totalSets: 3,
      rest: 15,
      steps: [
        { cue: '放松全身，感受盆底', phase: '准备', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e03/01.m4a' },
        { cue: '缓慢收缩……', phase: '收缩 · 5 秒', dur: 5, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e03/02.m4a' },
        { cue: '完全放松盆底——不要用力', phase: '放松 · 5 秒', dur: 5, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e03/03.m4a' },
        { cue: '快速收缩！', phase: '快速抽动', dur: 1, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e03/04.m4a' }
      ],
      repeatGroup: { from: 1, to: 2, times: 10 },
      repeatGroup2: { from: 3, to: 3, times: 10 }
    }
  },
  {
    id: 'e04',
    phase: 1,
    mode: 'practice',
    name: '腹横肌激活',
    icon: '💪',
    gif: '',
    pose: '仰卧',
    goal: '激活深层核心',
    tags: [
      tag('深层核心', 'tag-green'),
      tag('腹横肌', 'tag-warm'),
      tag('每天 2 次', 'tag-gray')
    ],
    purpose: '在最安全体位下激活最深层腹肌，避免增加腹内压，是修复腹直肌分离的基础练习。',
    steps: [
      '仰卧屈膝，先做一次腹式呼吸。',
      '呼气时轻轻将肚脐向脊柱方向内收。',
      '保持轻度内收，做 3-5 次自然呼吸后放松。'
    ],
    notes: [
      '千万不要憋气，应能在保持内收的同时正常呼吸。',
      '剖宫产若腹部切口有牵拉感，减小内收幅度。'
    ],
    freq: '每天 2 次 · 每次 8-10 个',
    practice: {
      totalSets: 2,
      rest: 20,
      steps: [
        { cue: '仰卧屈膝，先做一次腹式呼吸', phase: '准备', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e04/01.m4a' },
        { cue: '呼气，轻轻内收肚脐', phase: '内收', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e04/02.m4a' },
        { cue: '保持内收，正常呼吸', phase: '维持 10 秒', dur: 10, hint: '保持自然呼吸，不要憋气', audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e04/03.m4a' },
        { cue: '放松', phase: '放松 3 秒', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e04/04.m4a' }
      ],
      repeatGroup: { from: 1, to: 3, times: 10 }
    }
  },
  {
    id: 'e05',
    phase: 1,
    mode: 'guide',
    name: '翻身起床姿势',
    icon: '🛏️',
    gif: '',
    pose: '侧卧到坐起',
    goal: '保护腹压',
    tags: [
      tag('日常动作', 'tag-green'),
      tag('保护腹压', 'tag-gray')
    ],
    purpose: '减少腹压，保护腹直肌和盆底，防止剖宫产伤口在起床时受力撕裂。每次起床都应执行。',
    steps: [
      '先将双腿一起滚向侧方。',
      '用下方手肘和上方手掌撑床，将身体推起至坐位。',
      '坐稳后再慢慢起立。'
    ],
    notes: [
      '剖宫产妈妈尤其重要，每次起床都要使用此方法。',
      '坐起后先感受一下，无头晕再缓慢站立。'
    ],
    freq: '日常动作 · 每次起床时执行',
    practice: {
      totalSets: 1,
      rest: 0,
      mode: 'guide',
      steps: [
        { cue: '我们练习正确的翻身起床', phase: '准备', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e05/01.m4a' },
        { cue: '双腿一起滚向侧方', phase: '步骤一', dur: 4, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e05/02.m4a' },
        { cue: '手肘和手掌撑床', phase: '步骤二', dur: 4, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e05/03.m4a' },
        { cue: '推起身体至坐位', phase: '步骤三', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e05/04.m4a' },
        { cue: '坐稳，缓慢起立', phase: '步骤四', dur: 4, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e05/05.m4a' }
      ]
    }
  },
  {
    id: 'e06',
    phase: 1,
    mode: 'practice',
    name: '床上腿部运动',
    icon: '🦵',
    gif: '',
    pose: '仰卧',
    goal: '温和激活下肢',
    tags: [
      tag('下肢力量', 'tag-green'),
      tag('髋屈肌', 'tag-warm'),
      tag('每天 1-2 组', 'tag-gray')
    ],
    purpose: '在不增加腹内压的前提下，温和激活髋屈肌和下肢肌肉，改善血液循环，预防下肢无力。',
    steps: [
      '仰卧屈膝，双脚平踩床面。',
      '呼气时轻度激活腹横肌，缓慢将一条腿沿床面滑出。',
      '腿伸直后短暂停顿，再缓慢弯回，两侧交替。'
    ],
    notes: [
      '腿滑出时腰背不要拱起，保持脊柱中立。',
      '感觉腹部“撑起来”说明腹压过大，减小动作幅度。'
    ],
    freq: '每天 1-2 组 · 每侧 10 次',
    practice: {
      totalSets: 2,
      rest: 15,
      steps: [
        { cue: '仰卧屈膝，准备好了', phase: '准备', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/01.m4a' },
        { cue: '呼气，激活核心', phase: '核心激活', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/02.m4a' },
        { cue: '右腿缓慢沿床面滑出', phase: '右腿滑出', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/03.m4a' },
        { cue: '停顿', phase: '保持 2 秒', dur: 2, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/04.m4a' },
        { cue: '缓慢弯回', phase: '收腿', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/05.m4a' },
        { cue: '换左腿', phase: '换腿', dur: 2, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/06.m4a' },
        { cue: '左腿缓慢沿床面滑出', phase: '左腿滑出', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/07.m4a' },
        { cue: '停顿', phase: '保持 2 秒', dur: 2, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/04.m4a' },
        { cue: '缓慢弯回', phase: '收腿', dur: 3, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e06/05.m4a' }
      ],
      repeatGroup: { from: 2, to: 4, times: 10 },
      repeatGroup2: { from: 6, to: 8, times: 10 }
    }
  },
  {
    id: 'e07',
    phase: 1,
    mode: 'guide',
    name: '坐姿与站姿管理',
    icon: '🧘',
    gif: '',
    pose: '坐姿 / 站姿',
    goal: '姿势纠正',
    tags: [
      tag('姿势纠正', 'tag-green'),
      tag('日常指导', 'tag-gray')
    ],
    purpose: '纠正产后常见的腰椎过度前凸和圆肩驼背，减轻哺乳造成的颈肩疲劳，降低慢性腰痛风险。',
    steps: [
      '坐时坐骨均匀承重，不塌腰拱背。',
      '肩膀自然后落，哺乳时用哺乳枕垫高婴儿，避免低头弓背。',
      '站立时重心均匀分布在双脚，不习惯性偏重一侧。'
    ],
    notes: [
      '每隔 30 分钟提醒自己检查一次坐姿。',
      '长期弓背会加重颈肩不适。'
    ],
    freq: '日常意识 · 随时调整',
    practice: {
      totalSets: 1,
      rest: 0,
      mode: 'guide',
      steps: [
        { cue: '我们来做一次坐姿检查', phase: '开始', dur: 6, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e07/01.m4a' },
        { cue: '坐骨均匀承重，不塌腰', phase: '骨盆中立', dur: 8, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e07/02.m4a' },
        { cue: '肩膀自然后落，不耸肩', phase: '肩部放松', dur: 8, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e07/03.m4a' },
        { cue: '深呼吸，感受正确体态', phase: '放松感受', dur: 8, audio: 'cloud://cloud1-d1gp0f2s312426955.636c-cloud1-d1gp0f2s312426955-1420052148/audio/e07/04.m4a' }
      ]
    }
  },
  {
    id: 's01',
    phase: 2,
    mode: 'practice',
    name: '腹式呼吸进阶',
    icon: '🌬️',
    gif: '',
    pose: '仰卧',
    goal: '呼吸 + 盆底协同',
    tags: [
      tag('跟练', 'tag-green'),
      tag('呼吸协同', 'tag-warm'),
      tag('3 组训练', 'tag-gray')
    ],
    purpose: '在第一阶段腹式呼吸基础上，进一步建立盆底与呼气节奏的同步控制，帮助进入功能重建期。',
    steps: [
      '仰卧屈膝，回到熟悉的腹式呼吸姿势。',
      '吸气 5 秒，感受腹部和盆底同时向外扩张。',
      '呼气 6 秒，先轻柔上提盆底，再让腹部向内回收。'
    ],
    notes: [
      '保持肩颈放松，不要耸肩。',
      '如果出现头晕或腹部明显紧绷，先降低节奏。'
    ],
    freq: '3 组 · 每组 6 次呼吸循环',
    practice: {
      totalSets: 3,
      rest: 15,
      steps: [
        { cue: '回到熟悉的感觉，我们进阶呼吸', phase: '准备', dur: 6 },
        { cue: '吸气，感受腹部和盆底同时向外扩张……', phase: '吸气 · 5 秒', dur: 8 },
        {
          cue: '呼气，盆底先上提……腹部跟进内收',
          phase: '呼气 · 6 秒',
          dur: 8,
          ttsText: '慢慢呼气，盆底先上提，腹部跟进内收',
          ttsPrompt: '其中“呼气”的“呼”必须读作普通话 hu 第一声，不要读成 fu 或 hui。'
        }
      ],
      repeatGroup: { from: 1, to: 2, times: 6 }
    }
  },
  {
    id: 's02',
    phase: 2,
    mode: 'practice',
    name: '四点跪姿 TA 激活',
    icon: '🐾',
    gif: '',
    pose: '四点跪姿',
    goal: '抗重力核心激活',
    tags: [
      tag('跟练', 'tag-green'),
      tag('核心激活', 'tag-warm'),
      tag('2 组训练', 'tag-gray')
    ],
    purpose: '在四点跪姿下训练腹横肌与盆底协同，让核心在抗重力位开始稳定工作。',
    steps: [
      '四点跪姿，双手在肩下，双膝在髋下。',
      '吸气放松脊柱，呼气时上提盆底并轻收腹部。',
      '维持 5 秒，正常呼吸后放松。'
    ],
    notes: [
      '肩下压稳定，不要塌腰或含胸。',
      '动作过程中保持呼吸，不要屏气。'
    ],
    freq: '2 组 · 每组 10 次',
    practice: {
      totalSets: 2,
      rest: 20,
      steps: [
        { cue: '四点跪姿，双手在肩下，双膝在髋下', phase: '准备', dur: 7 },
        { cue: '吸气，脊柱放松下沉', phase: '吸气放松', dur: 5 },
        {
          cue: '呼气，盆底上提，腹部收向脊柱',
          phase: '呼气激活',
          dur: 9,
          ttsText: '慢慢呼气，盆底上提，腹部收向脊柱',
          ttsPrompt: '其中“呼气”的“呼”必须读作普通话 hu 第一声，不要读成 fu 或 hui。'
        },
        { cue: '保持收缩，正常呼吸', phase: '维持 · 5 秒', dur: 5 },
        { cue: '放松', phase: '放松 3 秒', dur: 3 }
      ],
      repeatGroup: { from: 1, to: 4, times: 10 }
    }
  },
  {
    id: 's03',
    phase: 2,
    mode: 'practice',
    name: '死虫式',
    icon: '🎯',
    gif: '',
    pose: '仰卧',
    goal: '动态核心稳定',
    tags: [
      tag('跟练', 'tag-green'),
      tag('核心稳定', 'tag-warm'),
      tag('2 组训练', 'tag-gray')
    ],
    purpose: '通过对侧肢体伸展训练腰盆控制能力，让核心稳定从静态进入动态。',
    steps: [
      '仰卧，双臂向上伸出，双腿抬起成桌面位。',
      '呼气激活核心，保持腰背贴地。',
      '一侧手臂和对侧腿缓慢伸展，再吸气还原后换侧。'
    ],
    notes: [
      '任何时刻都不要让腰背离地。',
      '如果腹部顶起明显，减小手脚伸展幅度。'
    ],
    freq: '2 组 · 每组左右交替 8 次',
    practice: {
      totalSets: 2,
      rest: 20,
      steps: [
        { cue: '仰卧，双臂向上伸出，双腿抬起成桌面', phase: '准备', dur: 7 },
        {
          cue: '呼气，激活核心，腰背贴地',
          phase: '核心激活',
          dur: 7,
          ttsText: '慢慢呼气，激活核心，腰背贴地',
          ttsPrompt: '其中“呼气”的“呼”必须读作普通话 hu 第一声，不要读成 fu 或 hui。'
        },
        { cue: '右臂向头顶延伸，左腿向地面延伸', phase: '对侧伸展', dur: 7 },
        { cue: '保持腰背贴地不动', phase: '保持 · 3 秒', dur: 4 },
        { cue: '吸气，回到起始位', phase: '还原', dur: 4 },
        { cue: '换侧：左臂右腿', phase: '换侧伸展', dur: 5 },
        { cue: '保持腰背贴地不动', phase: '保持 · 3 秒', dur: 4 },
        { cue: '吸气，回到起始位', phase: '还原', dur: 4 }
      ],
      repeatGroup: { from: 2, to: 7, times: 8 }
    }
  },
  {
    id: 's04',
    phase: 2,
    mode: 'practice',
    name: '桥式',
    icon: '🌉',
    gif: '',
    pose: '仰卧',
    goal: '臀部 + 盆底',
    tags: [
      tag('跟练', 'tag-green'),
      tag('臀桥发力', 'tag-warm'),
      tag('3 组训练', 'tag-gray')
    ],
    purpose: '通过桥式连接臀部、盆底和躯干稳定，让功能训练从床上动作逐渐升级。',
    steps: [
      '仰卧屈膝，双脚与髋同宽踩地。',
      '呼气时收紧盆底和臀部，逐节抬起脊柱。',
      '顶部保持 5 秒，再缓慢逐节放下。'
    ],
    notes: [
      '顶起时不要过度挺腰，发力来自臀部。',
      '如果腰部不适，降低抬起高度。'
    ],
    freq: '3 组 · 每组 12 次',
    practice: {
      totalSets: 3,
      rest: 20,
      steps: [
        { cue: '仰卧屈膝，双脚与髋同宽踩地', phase: '准备', dur: 6 },
        {
          cue: '呼气，盆底收缩，臀部收紧',
          phase: '启动',
          dur: 7,
          ttsText: '慢慢呼气，盆底收缩，臀部收紧',
          ttsPrompt: '其中“呼气”的“呼”必须读作普通话 hu 第一声，不要读成 fu 或 hui。'
        },
        { cue: '逐节抬起脊柱，直到肩髋膝成线', phase: '上抬', dur: 6 },
        { cue: '保持，正常呼吸', phase: '顶部保持 · 5 秒', dur: 11 },
        { cue: '缓慢逐节放下脊柱', phase: '下放', dur: 4 },
        { cue: '放松盆底', phase: '放松 · 3 秒', dur: 4 }
      ],
      repeatGroup: { from: 1, to: 5, times: 12 }
    }
  },
  {
    id: 's05',
    phase: 2,
    mode: 'practice',
    name: '鸟狗式',
    icon: '🧭',
    gif: '',
    pose: '四点跪姿',
    goal: '对侧协调稳定',
    tags: [
      tag('跟练', 'tag-green'),
      tag('协调稳定', 'tag-warm'),
      tag('2 组训练', 'tag-gray')
    ],
    purpose: '在抗重力位训练四肢对侧控制与骨盆稳定，是功能重建期的关键协调动作。',
    steps: [
      '四点跪姿保持脊柱中立。',
      '呼气激活核心，一侧手臂前伸、对侧腿后伸。',
      '保持骨盆水平，停留 3 秒后还原并换侧。'
    ],
    notes: [
      '避免骨盆歪斜或身体晃动。',
      '手脚不需要抬太高，稳定优先。'
    ],
    freq: '2 组 · 每组左右交替 8 次',
    practice: {
      totalSets: 2,
      rest: 20,
      steps: [
        { cue: '四点跪姿，脊柱中立', phase: '准备', dur: 6 },
        {
          cue: '呼气，激活核心',
          phase: '核心激活',
          dur: 6,
          ttsText: '慢慢呼气，激活核心',
          ttsPrompt: '其中“呼气”的“呼”必须读作普通话 hu 第一声，不要读成 fu 或 hui。'
        },
        { cue: '右臂前伸，左腿后伸，骨盆保持水平', phase: '对侧伸展', dur: 6 },
        { cue: '保持不动', phase: '保持 · 3 秒', dur: 3 },
        { cue: '缓慢收回', phase: '还原', dur: 3 },
        { cue: '换侧：左臂右腿', phase: '换侧', dur: 4 },
        { cue: '保持不动', phase: '保持 · 3 秒', dur: 3 },
        { cue: '缓慢收回', phase: '还原', dur: 3 }
      ],
      repeatGroup: { from: 2, to: 7, times: 8 }
    }
  },
  {
    id: 's06',
    phase: 2,
    mode: 'practice',
    name: '蚌式开合',
    icon: '🦪',
    gif: '',
    pose: '侧卧',
    goal: '臀中肌 + 髋稳定',
    tags: [
      tag('跟练', 'tag-green'),
      tag('髋稳定', 'tag-warm'),
      tag('2 组训练', 'tag-gray')
    ],
    purpose: '强化臀中肌与髋部稳定，有助于改善骨盆控制与站立步态稳定。',
    steps: [
      '侧卧，双膝弯曲约 45 度，双脚并拢。',
      '保持双脚贴合，上方膝盖向上打开。',
      '顶部停留 2 秒，再缓慢合拢。'
    ],
    notes: [
      '骨盆不要跟着向后翻。',
      '动作幅度不求大，重点感受臀部外侧发力。'
    ],
    freq: '2 组 · 每侧 15 次',
    practice: {
      totalSets: 2,
      rest: 15,
      steps: [
        {
          cue: '侧卧，双膝弯曲约 45 度，双脚并拢',
          phase: '准备',
          dur: 8,
          ttsText: '侧卧屈膝，双脚并拢，准备开始',
          ttsPrompt: '严格只读这一句，不要重复，不要补充额外词语，语速平稳。'
        },
        {
          cue: '保持双脚合并，上方膝盖向天花板打开',
          phase: '打开',
          dur: 6,
          ttsText: '保持双脚贴合，上方膝盖向上打开',
          ttsPrompt: '停顿自然，表达清楚，不要连读含混。'
        },
        {
          cue: '感受臀部外侧发力',
          phase: '保持 · 2 秒',
          dur: 10,
          ttsText: '停住，感受臀部外侧发力',
          ttsPrompt: '先短停顿再说动作感受，语速平稳。'
        },
        {
          cue: '缓慢放回',
          phase: '合拢',
          dur: 4,
          ttsText: '缓慢合拢，回到起始位置',
          ttsPrompt: '结尾清楚，不要吞字。'
        }
      ],
      repeatGroup: { from: 1, to: 3, times: 15 }
    }
  },
  {
    id: 's07',
    phase: 2,
    mode: 'practice',
    name: '站立深蹲',
    icon: '🦵',
    gif: '',
    pose: '站立',
    goal: '下肢功能力量',
    tags: [
      tag('跟练', 'tag-green'),
      tag('功能力量', 'tag-warm'),
      tag('3 组训练', 'tag-gray')
    ],
    purpose: '通过站立深蹲把核心控制迁移到日常站立与下肢功能动作，是进入第三阶段前的重要桥梁。',
    steps: [
      '站立，双脚与肩同宽。',
      '吸气时向后坐，下蹲到底部保持 2 秒。',
      '呼气时从脚掌发力站起，站直时感受臀部收缩。'
    ],
    notes: [
      '膝盖方向始终对齐脚尖，不要内扣。',
      '如果膝盖不适，减小下蹲幅度。'
    ],
    freq: '3 组 · 每组 12 次',
    practice: {
      totalSets: 3,
      rest: 20,
      steps: [
        { cue: '站立，双脚与肩同宽', phase: '准备', dur: 6 },
        { cue: '吸气，想象向后坐椅子', phase: '下蹲', dur: 5 },
        { cue: '膝盖对齐脚尖方向，不内扣', phase: '底部保持 · 2 秒', dur: 5 },
        {
          cue: '呼气，从脚掌发力站起',
          phase: '站起',
          dur: 5,
          ttsText: '慢慢呼气，从脚掌发力站起',
          ttsPrompt: '其中“呼气”的“呼”必须读作普通话 hu 第一声，不要读成 fu 或 hui。'
        },
        { cue: '站直时感受臀部收缩', phase: '顶部收缩 · 1 秒', dur: 5 }
      ],
      repeatGroup: { from: 1, to: 4, times: 12 }
    }
  },
  {
    id: 's08',
    phase: 2,
    mode: 'guide',
    name: '姿势矫正',
    icon: '🪴',
    gif: '',
    pose: '多体位',
    goal: '肩颈 + 胸椎 + 髋屈肌',
    tags: [
      tag('指导', 'tag-warm'),
      tag('拉伸放松', 'tag-green'),
      tag('4 段练习', 'tag-gray')
    ],
    purpose: '通过胸肌、肩颈、胸椎和髋屈肌的分段拉伸，改善产后常见的圆肩、颈肩紧张和久坐僵硬。',
    steps: [
      '门框胸肌拉伸：手臂成 90 度靠门框，身体前探。',
      '肩颈侧拉伸：一手轻压头部向侧面。',
      '坐姿胸椎旋转与弓步髋屈肌拉伸依次完成。'
    ],
    notes: [
      '拉伸以舒适牵拉感为宜，不追求极限幅度。',
      '若出现刺痛或头晕，立即停止。'
    ],
    freq: '指导模式 · 每段 30 秒',
    practice: {
      totalSets: 1,
      rest: 0,
      mode: 'guide',
      steps: [
        {
          cue: '我们来做一组姿势矫正练习',
          phase: '准备',
          dur: 9,
          ttsText: '我们来做一组姿势矫正练习，准备开始',
          ttsPrompt: '严格只说一遍，不要重复任何短语。'
        },
        { cue: '门框胸肌拉伸：手臂成 90 度靠门框，身体前探', phase: '胸肌拉伸', dur: 30 },
        { cue: '肩颈侧拉伸：轻压头部向侧面', phase: '肩颈拉伸', dur: 30 },
        { cue: '坐姿胸椎旋转：双臂抱肩，左右旋转', phase: '胸椎旋转', dur: 30 },
        { cue: '弓步髋屈肌拉伸：后膝跪地，身体竖直', phase: '髋屈肌拉伸', dur: 30 }
      ]
    }
  }
];

const PHASES = [
  {
    id: 1,
    name: '急性修复期',
    subtitle: '产后 0-6 周',
    desc: '产后第 1 天至第 42 天',
    bannerTitle: '7 个康复动作，建立产后早期恢复基础。',
    bannerCopy: '以呼吸、血液循环、盆底唤醒和床上安全活动为核心，帮助顺利度过产后最初阶段。',
    goals: [
      '促进血液循环，预防下肢血栓。',
      '温和激活盆底和深层核心。',
      '改善呼吸模式，恢复核心内压调控。',
      '缓解腰背疼痛和水肿。'
    ],
    exercises: ['e01', 'e02', 'e03', 'e04', 'e05', 'e06', 'e07'],
    locked: false
  },
  {
    id: 2,
    name: '功能重建期',
    subtitle: '产后 6-12 周',
    desc: '需通过产后 6 周医学检查',
    bannerTitle: '8 个训练动作，从呼吸协同推进到功能力量。',
    bannerCopy: '包含 7 个跟练动作与 1 组姿势矫正，帮助从床上康复升级到站立与功能性训练。',
    goals: [
      '建立盆底与呼吸、核心的协同工作。',
      '增强抗重力位下的核心与骨盆稳定。',
      '恢复臀部、髋部和下肢基础功能力量。',
      '改善圆肩、胸椎僵硬和久坐带来的姿势问题。'
    ],
    exercises: ['s01', 's02', 's03', 's04', 's05', 's06', 's07', 's08'],
    locked: true
  }
];

const ENCOURAGEMENTS = [
  '每一次小小的坚持，都是送给自己最好的礼物。你正在一步步找回那个强大的自己。',
  '今天的你，比昨天更稳一点。身体会记住每一次温和而持续的练习。',
  '产后康复不是赛跑，而是一段循序渐进的旅程。你今天做到的每一步都很重要。',
  '宝宝需要一个健康的妈妈，你也值得把照顾自己这件事放回日程里。',
  '休息是恢复的一部分，训练也是。你正在认真地和身体重新建立连接。'
];

function getExerciseById(id) {
  for (var i = 0; i < EXERCISES.length; i++) {
    if (EXERCISES[i].id === id) return EXERCISES[i];
  }
  return null;
}

function getPhaseById(id) {
  var phaseId = Number(id) || 1;
  for (var i = 0; i < PHASES.length; i++) {
    if (PHASES[i].id === phaseId) return PHASES[i];
  }
  return PHASES[0];
}

function getExercisesByPhase(phaseId) {
  return EXERCISES.filter(function(item) {
    return item.phase === Number(phaseId);
  });
}

module.exports = {
  EXERCISES: EXERCISES,
  PHASES: PHASES,
  ENCOURAGEMENTS: ENCOURAGEMENTS,
  getExerciseById: getExerciseById,
  getPhaseById: getPhaseById,
  getExercisesByPhase: getExercisesByPhase
};
