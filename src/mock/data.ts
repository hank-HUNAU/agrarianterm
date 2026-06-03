// Mock 数据 - 与 api/db.ts 种子数据完全一致
// 用于 GitHub Pages 纯静态部署时替代后端 API

export const mockProjects = [
  { id: 1, name: '齐民要术', description: '北魏贾思勰所著，中国现存最早最完整的农学著作', source_text: '《齐民要术》为北魏贾思勰所著，全书十卷九十二篇，系统地总结了六世纪以前黄河中下游地区农畜牧业生产经验，是中国现存最早最完整的农学著作。', status: 'active', created_at: '2026-01-01' },
  { id: 2, name: '农政全书', description: '明代徐光启所著，集中国古代农学之大成的农学巨著', source_text: '《农政全书》为明代徐光启所著，全书六十卷，分农本、田制、农事、水利、农器、树艺、蚕桑、蚕桑广类、种植、牧养、制造、荒政等十二目，集中国古代农学之大成。', status: 'active', created_at: '2026-01-02' },
];

export const mockTasks = [
  { id: 1, project_id: 1, annotator_id: 1, segment: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。', segment_index: 0, status: 'completed', created_at: '2026-01-01' },
  { id: 2, project_id: 1, annotator_id: 1, segment: '春耕寻手劳，秋耕待白背劳。', segment_index: 1, status: 'completed', created_at: '2026-01-01' },
  { id: 3, project_id: 1, annotator_id: 1, segment: '耕而不劳，不如作暴。', segment_index: 2, status: 'in_progress', created_at: '2026-01-01' },
  { id: 4, project_id: 1, annotator_id: 1, segment: '凡秋耕掩地者为上，至春而更耕之。', segment_index: 3, status: 'pending', created_at: '2026-01-01' },
  { id: 5, project_id: 2, annotator_id: 1, segment: '凡治田之法，犁耕为先。', segment_index: 0, status: 'completed', created_at: '2026-01-02' },
  { id: 6, project_id: 2, annotator_id: 1, segment: '水利之利，莫大于沟洫。', segment_index: 1, status: 'completed', created_at: '2026-01-02' },
  { id: 7, project_id: 2, annotator_id: 1, segment: '粪田之法，得宜则益，失宜则损。', segment_index: 2, status: 'in_progress', created_at: '2026-01-02' },
];

export const mockAnnotations = [
  // 任务1: "凡耕之本，在于趣时，和土，务粪泽，早锄早获。"
  { id: 1, task_id: 1, term_text: '耕', start_pos: 1, end_pos: 2, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 4, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'plow', enhanced: 'plow (primary tillage operation in traditional Chinese agriculture)' }, modern_def: '翻土整地，为播种做准备的基本农事操作', english_equiv: 'plow/tillage', note: '耕为农事之首，古籍中常与耘、种并列' },
  { id: 2, task_id: 1, term_text: '粪', start_pos: 13, end_pos: 14, category: '农事操作', semantics: { literalMeaning: 5, extendedMeaning: 4, culturalLoad: 4 }, context_dim: { temporalContext: 4, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'manure', enhanced: 'manure/fertilize (application of organic fertilizer in traditional farming)' }, modern_def: '施肥，以有机肥改良土壤', english_equiv: 'manure/fertilize', note: '粪字在古农书中兼指肥料与施肥操作' },
  { id: 3, task_id: 1, term_text: '泽', start_pos: 14, end_pos: 15, category: '土壤', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 3 }, context_dim: { temporalContext: 3, spatialContext: 4, technicalContext: 4 }, translation: { baseline: 'moisture', enhanced: 'soil moisture (adequate water content in soil for crop growth)' }, modern_def: '土壤水分充足，润泽', english_equiv: 'moisture/wetness', note: '务粪泽指既施肥又保持土壤湿润' },
  { id: 4, task_id: 1, term_text: '锄', start_pos: 18, end_pos: 19, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 5, spatialContext: 3, technicalContext: 4 }, translation: { baseline: 'hoe', enhanced: 'hoe (weeding and soil loosening with a hand hoe)' }, modern_def: '用锄除草松土', english_equiv: 'hoe/weed', note: '早锄指及早进行中耕除草' },
  { id: 5, task_id: 1, term_text: '获', start_pos: 20, end_pos: 21, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 5, spatialContext: 2, technicalContext: 4 }, translation: { baseline: 'harvest', enhanced: 'harvest (timely reaping of crops at maturity)' }, modern_def: '收割庄稼', english_equiv: 'harvest/reap', note: '早获指及时收获以免损失' },

  // 任务2: "春耕寻手劳，秋耕待白背劳。"
  { id: 6, task_id: 2, term_text: '耕', start_pos: 1, end_pos: 2, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 4, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'plow', enhanced: 'plow (spring plowing followed immediately by harrowing)' }, modern_def: '翻土整地', english_equiv: 'plow/tillage', note: '春耕后需随即耢地保墒' },
  { id: 7, task_id: 2, term_text: '劳', start_pos: 4, end_pos: 5, category: '农具', semantics: { literalMeaning: 3, extendedMeaning: 4, culturalLoad: 5 }, context_dim: { temporalContext: 4, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'harrow', enhanced: 'harrow/lǎo (a drag harrow for breaking clods and leveling soil)' }, modern_def: '耢，一种碎土平地的农具，也指用耢碎土平地', english_equiv: 'harrow/drag', note: '劳通耢，春耕后随即劳以保墒' },

  // 任务3: "耕而不劳，不如作暴。"
  { id: 8, task_id: 3, term_text: '耕', start_pos: 0, end_pos: 1, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 3, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'plow', enhanced: 'plow (tillage without subsequent harrowing wastes effort)' }, modern_def: '翻土整地', english_equiv: 'plow/tillage', note: '耕后不劳则土壤失墒' },

  // 任务4: "凡秋耕掩地者为上，至春而更耕之。"
  { id: 9, task_id: 4, term_text: '耕', start_pos: 2, end_pos: 3, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 5, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'plow', enhanced: 'autumn plowing (turning under crop residues before winter)' }, modern_def: '秋耕掩青，将残茬翻入土中', english_equiv: 'autumn plowing', note: '秋耕掩地可改良土壤' },

  // 任务5: "凡治田之法，犁耕为先。"
  { id: 10, task_id: 5, term_text: '犁', start_pos: 6, end_pos: 7, category: '农具', semantics: { literalMeaning: 5, extendedMeaning: 4, culturalLoad: 5 }, context_dim: { temporalContext: 3, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'plow', enhanced: 'plow (primary tillage implement with iron share and wooden beam)' }, modern_def: '翻土的农具，由犁铧和犁壁组成', english_equiv: 'plow', note: '犁为耕田首要农具' },
  { id: 11, task_id: 5, term_text: '耕', start_pos: 7, end_pos: 8, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 3, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'tillage', enhanced: 'tillage (the fundamental soil preparation operation)' }, modern_def: '用犁翻土整地', english_equiv: 'tillage/plowing', note: '犁耕并称，犁为工具，耕为操作' },

  // 任务6: "水利之利，莫大于沟洫。"
  { id: 12, task_id: 6, term_text: '沟', start_pos: 8, end_pos: 9, category: '水利', semantics: { literalMeaning: 4, extendedMeaning: 4, culturalLoad: 4 }, context_dim: { temporalContext: 3, spatialContext: 5, technicalContext: 5 }, translation: { baseline: 'ditch', enhanced: 'ditch/channel (irrigation and drainage channel in field systems)' }, modern_def: '田间灌溉排水渠道', english_equiv: 'ditch/channel', note: '沟洫为古代农田水利系统核心' },
  { id: 13, task_id: 6, term_text: '洫', start_pos: 9, end_pos: 10, category: '水利', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 3, spatialContext: 5, technicalContext: 5 }, translation: { baseline: 'drain', enhanced: 'xù (large drainage channel between fields, part of the well-field system)' }, modern_def: '田间大排水沟，井田制中的沟渠系统', english_equiv: 'drain/moat', note: '沟洫并称，沟为小渠，洫为大渠' },

  // 任务7: "粪田之法，得宜则益，失宜则损。"
  { id: 14, task_id: 7, term_text: '粪', start_pos: 0, end_pos: 1, category: '农事操作', semantics: { literalMeaning: 5, extendedMeaning: 4, culturalLoad: 4 }, context_dim: { temporalContext: 4, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'manure', enhanced: 'manure (proper application of fertilizer is crucial for crop yield)' }, modern_def: '施肥于田', english_equiv: 'manure/fertilize', note: '粪田强调施肥需合时宜' },
  { id: 15, task_id: 7, term_text: '亩', start_pos: 2, end_pos: 3, category: '土壤', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 2, spatialContext: 5, technicalContext: 4 }, translation: { baseline: 'acre', enhanced: 'mǔ (traditional Chinese land area unit, also refers to raised field ridges)' }, modern_def: '田亩，也指田间的垄', english_equiv: 'acre/mǔ', note: '亩在古农书中兼指面积单位与田垄' },

  // 额外术语标注 - 补充更多类别
  { id: 16, task_id: 1, term_text: '种', start_pos: 0, end_pos: 1, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 5, spatialContext: 3, technicalContext: 4 }, translation: { baseline: 'sow', enhanced: 'sow/plant (seed sowing as a core agricultural operation)' }, modern_def: '播种，将种子植入土中', english_equiv: 'sow/plant', note: '耕种收为农事三大环节' },
  { id: 17, task_id: 2, term_text: '耘', start_pos: 0, end_pos: 1, category: '农事操作', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 4, spatialContext: 3, technicalContext: 4 }, translation: { baseline: 'weed', enhanced: 'weed/cultivate (inter-row cultivation to remove weeds and loosen soil)' }, modern_def: '除草培土，中耕作业', english_equiv: 'weed/cultivate', note: '耘耨并称，均为中耕除草' },
  { id: 18, task_id: 5, term_text: '耙', start_pos: 0, end_pos: 1, category: '农具', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 3, spatialContext: 3, technicalContext: 5 }, translation: { baseline: 'harrow', enhanced: 'harrow/pá (iron-toothed implement for breaking clods and leveling soil)' }, modern_def: '碎土平地的农具，铁齿耙', english_equiv: 'harrow', note: '犁后用耙碎土整地' },
  { id: 19, task_id: 6, term_text: '垄', start_pos: 0, end_pos: 1, category: '土壤', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 4 }, context_dim: { temporalContext: 3, spatialContext: 5, technicalContext: 4 }, translation: { baseline: 'ridge', enhanced: 'ridge (raised soil strip between furrows for planting crops)' }, modern_def: '田间的土垄，高出地面的种植行', english_equiv: 'ridge/furrow', note: '垄作法是中国传统耕作方式' },
  { id: 20, task_id: 7, term_text: '畎', start_pos: 0, end_pos: 1, category: '水利', semantics: { literalMeaning: 4, extendedMeaning: 3, culturalLoad: 5 }, context_dim: { temporalContext: 2, spatialContext: 5, technicalContext: 4 }, translation: { baseline: 'furrow', enhanced: 'quǎn (small drainage furrow between field ridges in the well-field system)' }, modern_def: '田间小沟，垄间排水沟', english_equiv: 'furrow/drain', note: '畎浍沟洫构成古代排水体系' },
];

export const mockRelations = [
  { id: 1, source_term_id: 1, target_term_id: 6, relation_type: '同义词', confidence: 0.95 },
  { id: 2, source_term_id: 1, target_term_id: 11, relation_type: '同义词', confidence: 0.9 },
  { id: 3, source_term_id: 2, target_term_id: 14, relation_type: '同义词', confidence: 0.95 },
  { id: 4, source_term_id: 7, target_term_id: 18, relation_type: '关联术语', confidence: 0.85 },
  { id: 5, source_term_id: 12, target_term_id: 13, relation_type: '关联术语', confidence: 0.9 },
  { id: 6, source_term_id: 12, target_term_id: 20, relation_type: '上位词', confidence: 0.85 },
  { id: 7, source_term_id: 1, target_term_id: 10, relation_type: '关联术语', confidence: 0.9 },
  { id: 8, source_term_id: 4, target_term_id: 17, relation_type: '同义词', confidence: 0.8 },
  { id: 9, source_term_id: 1, target_term_id: 16, relation_type: '关联术语', confidence: 0.9 },
  { id: 10, source_term_id: 1, target_term_id: 5, relation_type: '关联术语', confidence: 0.85 },
  { id: 11, source_term_id: 19, target_term_id: 15, relation_type: '关联术语', confidence: 0.8 },
  { id: 12, source_term_id: 2, target_term_id: 3, relation_type: '关联术语', confidence: 0.85 },
  { id: 13, source_term_id: 10, target_term_id: 18, relation_type: '关联术语', confidence: 0.8 },
  { id: 14, source_term_id: 13, target_term_id: 20, relation_type: '上位词', confidence: 0.8 },
  { id: 15, source_term_id: 1, target_term_id: 8, relation_type: '同义词', confidence: 0.9 },
];

export const mockComparisons = [
  {
    id: 1,
    term_text: '耕',
    source: '齐民要术',
    context: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。',
    baseline_translation: 'The root of farming lies in timing, harmonizing soil, applying manure and moisture, early weeding and early harvesting.',
    enhanced_translation: 'The essence of plowing lies in seizing the right season, conditioning the soil, ensuring adequate manuring and moisture, early hoeing and timely harvesting.',
    improvement: '将"farming"精确化为"plowing"，准确传达翻土整地的农事操作；"timing"增强为"seizing the right season"，体现古人对农时的重视；"weeding"改为"hoeing"，更符合古农具操作语境。',
  },
  {
    id: 2,
    term_text: '劳',
    source: '齐民要术',
    context: '春耕寻手劳，秋耕待白背劳。',
    baseline_translation: 'Spring plowing is followed by immediate harrowing, autumn plowing waits for the white back to harrow.',
    enhanced_translation: 'After spring plowing, harrow immediately to preserve soil moisture; after autumn plowing, wait until the soil surface dries white before harrowing.',
    improvement: '"劳"译为"harrow to preserve soil moisture"，补充了劳（耢）的保墒功能；"白背"从字面"white back"修正为"soil surface dries white"，准确描述土壤表面干燥发白的农学现象。',
  },
  {
    id: 3,
    term_text: '作暴',
    source: '齐民要术',
    context: '耕而不劳，不如作暴。',
    baseline_translation: 'Plowing without harrowing is worse than doing nothing.',
    enhanced_translation: 'Plowing without subsequent harrowing is worse than leaving the land untilled, as it wastes the effort and loses soil moisture.',
    improvement: '"作暴"从"doing nothing"修正为"leaving the land untilled"，准确传达"不如不耕"的农学含义；补充了"loses soil moisture"说明不耢的后果。',
  },
  {
    id: 4,
    term_text: '犁',
    source: '农政全书',
    context: '凡治田之法，犁耕为先。',
    baseline_translation: 'The method of managing fields, plowing comes first.',
    enhanced_translation: 'Among all methods of field management, plowing with a plowshare is the foremost operation.',
    improvement: '"犁"从泛指"plowing"精确化为"plowing with a plowshare"，强调使用犁具的耕作方式；"comes first"增强为"foremost operation"，突出犁耕在农事体系中的首要地位。',
  },
  {
    id: 5,
    term_text: '沟洫',
    source: '农政全书',
    context: '水利之利，莫大于沟洫。',
    baseline_translation: 'The benefit of water management, nothing is greater than ditches and drains.',
    enhanced_translation: 'Among all benefits of water management, none surpasses the system of irrigation channels and drainage ditches.',
    improvement: '"沟洫"从"ditches and drains"提升为"system of irrigation channels and drainage ditches"，体现古代沟洫作为系统性水利工程的本质。',
  },
  {
    id: 6,
    term_text: '粪田',
    source: '农政全书',
    context: '粪田之法，得宜则益，失宜则损。',
    baseline_translation: 'The method of manuring fields, if appropriate it benefits, if inappropriate it harms.',
    enhanced_translation: 'The art of fertilizing fields: proper application enhances crop yield, while improper application causes damage.',
    improvement: '"粪田"从"manuring"提升为"fertilizing"，更符合现代农学术语；"得宜/失宜"从简单对错判断增强为"proper/improper application"，强调施肥技术的精准性。',
  },
];

export const mockStatistics = {
  totalTerms: 20,
  totalRelations: 15,
  coveredBooks: 2,
  categoryDistribution: [
    { category: '农事操作', count: 10 },
    { category: '农具', count: 3 },
    { category: '土壤', count: 3 },
    { category: '水利', count: 4 },
  ],
  dynastyTrend: [
    { dynasty: '先秦', count: 3 },
    { dynasty: '汉代', count: 5 },
    { dynasty: '魏晋', count: 8 },
    { dynasty: '唐宋', count: 4 },
    { dynasty: '明代', count: 6 },
  ],
  relationTypeDistribution: [
    { type: '同义词', count: 5 },
    { type: '关联术语', count: 7 },
    { type: '上位词', count: 2 },
    { type: '下位词', count: 1 },
  ],
  translationQuality: {
    baselineBleu: 32.1,
    enhancedBleu: 41.7,
  },
  projectStats: [
    { projectId: 1, projectName: '齐民要术', totalTasks: 4, completedTasks: 2 },
    { projectId: 2, projectName: '农政全书', totalTasks: 3, completedTasks: 2 },
  ],
};
