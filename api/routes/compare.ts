import { Router, type Request, type Response } from 'express'

const router = Router()

// 预设的翻译对比数据
const compareData = [
  {
    id: 1,
    term_text: '耕',
    source: '齐民要术',
    context: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。',
    baseline_translation: 'plow',
    enhanced_translation: 'plow (primary tillage operation in traditional Chinese agriculture)',
    improvement: '增加了农业语境说明，明确了耕作类型和在中国传统农业中的地位',
  },
  {
    id: 2,
    term_text: '粪',
    source: '齐民要术',
    context: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。',
    baseline_translation: 'manure',
    enhanced_translation: 'manure/fertilize (application of organic fertilizer in traditional farming)',
    improvement: '补充了施肥操作的语义，明确有机肥的文化内涵',
  },
  {
    id: 3,
    term_text: '泽',
    source: '齐民要术',
    context: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。',
    baseline_translation: 'moisture',
    enhanced_translation: 'soil moisture (adequate water content in soil for crop growth)',
    improvement: '明确了土壤水分的农业语义，而非一般的水分含义',
  },
  {
    id: 4,
    term_text: '劳',
    source: '齐民要术',
    context: '春耕寻手劳，秋耕待白背劳。',
    baseline_translation: 'harrow',
    enhanced_translation: 'harrow/lǎo (a drag harrow for breaking clods and leveling soil)',
    improvement: '添加了拼音标注和农具功能描述，消除了与"劳动"的歧义',
  },
  {
    id: 5,
    term_text: '犁',
    source: '农政全书',
    context: '凡治田之法，犁耕为先。',
    baseline_translation: 'plow',
    enhanced_translation: 'plow (primary tillage implement with iron share and wooden beam)',
    improvement: '区分了犁作为农具与耕作为操作的差异，补充了构造描述',
  },
  {
    id: 6,
    term_text: '沟',
    source: '农政全书',
    context: '水利之利，莫大于沟洫。',
    baseline_translation: 'ditch',
    enhanced_translation: 'ditch/channel (irrigation and drainage channel in field systems)',
    improvement: '明确了灌溉排水的双重功能，补充了农田系统语境',
  },
  {
    id: 7,
    term_text: '洫',
    source: '农政全书',
    context: '水利之利，莫大于沟洫。',
    baseline_translation: 'drain',
    enhanced_translation: 'xù (large drainage channel between fields, part of the well-field system)',
    improvement: '添加拼音标注，关联井田制文化背景，区分大小沟渠',
  },
  {
    id: 8,
    term_text: '亩',
    source: '农政全书',
    context: '粪田之法，得宜则益，失宜则损。',
    baseline_translation: 'acre',
    enhanced_translation: 'mǔ (traditional Chinese land area unit, also refers to raised field ridges)',
    improvement: '使用拼音标注避免与英亩混淆，补充了田垄的语义',
  },
  {
    id: 9,
    term_text: '锄',
    source: '齐民要术',
    context: '凡耕之本，在于趣时，和土，务粪泽，早锄早获。',
    baseline_translation: 'hoe',
    enhanced_translation: 'hoe (weeding and soil loosening with a hand hoe)',
    improvement: '补充了中耕除草的具体操作含义',
  },
  {
    id: 10,
    term_text: '畎',
    source: '农政全书',
    context: '水利之利，莫大于沟洫。',
    baseline_translation: 'furrow',
    enhanced_translation: 'quǎn (small drainage furrow between field ridges in the well-field system)',
    improvement: '添加拼音标注，关联井田制排水体系的文化背景',
  },
]

// GET /api/compare - 获取翻译对比列表
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: compareData })
})

export default router
