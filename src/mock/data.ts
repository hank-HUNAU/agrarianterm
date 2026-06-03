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
    source: '齐民要术',
    sourceText: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。',
    baselineTranslation: 'The root of farming lies in timing, harmonizing soil, applying manure and moisture, early weeding and early harvesting.',
    enhancedTranslation: 'The essence of plowing lies in seizing the right season, conditioning the soil, ensuring adequate manuring and moisture, early hoeing and timely harvesting.',
    differences: [
      { term: '耕', baseline: 'farming', enhanced: 'plowing' },
      { term: '趣时', baseline: 'timing', enhanced: 'seizing the right season' },
      { term: '粪泽', baseline: 'applying manure and moisture', enhanced: 'ensuring adequate manuring and moisture' },
      { term: '锄', baseline: 'weeding', enhanced: 'hoeing' },
      { term: '获', baseline: 'harvesting', enhanced: 'timely harvesting' },
    ],
  },
  {
    id: 2,
    source: '齐民要术',
    sourceText: '春耕寻手劳，秋耕待白背劳。',
    baselineTranslation: 'Spring plowing is followed by immediate harrowing, autumn plowing waits for the white back to harrow.',
    enhancedTranslation: 'After spring plowing, harrow immediately to preserve soil moisture; after autumn plowing, wait until the soil surface dries white before harrowing.',
    differences: [
      { term: '劳', baseline: 'harrowing', enhanced: 'harrow to preserve soil moisture' },
      { term: '白背', baseline: 'white back', enhanced: 'soil surface dries white' },
    ],
  },
  {
    id: 3,
    source: '齐民要术',
    sourceText: '耕而不劳，不如作暴。',
    baselineTranslation: 'Plowing without harrowing is worse than doing nothing.',
    enhancedTranslation: 'Plowing without subsequent harrowing is worse than leaving the land untilled, as it wastes the effort and loses soil moisture.',
    differences: [
      { term: '劳', baseline: 'harrowing', enhanced: 'subsequent harrowing' },
      { term: '作暴', baseline: 'doing nothing', enhanced: 'leaving the land untilled' },
    ],
  },
  {
    id: 4,
    source: '农政全书',
    sourceText: '凡治田之法，犁耕为先。',
    baselineTranslation: 'The method of managing fields, plowing comes first.',
    enhancedTranslation: 'Among all methods of field management, plowing with a plowshare is the foremost operation.',
    differences: [
      { term: '犁', baseline: 'plowing', enhanced: 'plowing with a plowshare' },
      { term: '治田', baseline: 'managing fields', enhanced: 'field management' },
    ],
  },
  {
    id: 5,
    source: '农政全书',
    sourceText: '水利之利，莫大于沟洫。',
    baselineTranslation: 'The benefit of water management, nothing is greater than ditches and drains.',
    enhancedTranslation: 'Among all benefits of water management, none surpasses the system of irrigation channels and drainage ditches.',
    differences: [
      { term: '沟洫', baseline: 'ditches and drains', enhanced: 'system of irrigation channels and drainage ditches' },
      { term: '水利', baseline: 'water management', enhanced: 'water management' },
    ],
  },
  {
    id: 6,
    source: '农政全书',
    sourceText: '粪田之法，得宜则益，失宜则损。',
    baselineTranslation: 'The method of manuring fields, if appropriate it benefits, if inappropriate it harms.',
    enhancedTranslation: 'The art of fertilizing fields: proper application enhances crop yield, while improper application causes damage.',
    differences: [
      { term: '粪田', baseline: 'manuring fields', enhanced: 'fertilizing fields' },
      { term: '得宜', baseline: 'appropriate', enhanced: 'proper application' },
      { term: '失宜', baseline: 'inappropriate', enhanced: 'improper application' },
    ],
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
