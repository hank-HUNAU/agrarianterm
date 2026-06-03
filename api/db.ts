import initSqlJs, { type Database } from 'sql.js'

let dbInstance: Database | null = null
let dbReady: Promise<Database> | null = null

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance
  if (dbReady) return dbReady

  dbReady = (async () => {
    const SQL = await initSqlJs()
    const db = new SQL.Database()

    // 创建表结构
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        source_text TEXT,
        status TEXT DEFAULT 'draft',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS annotation_tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(id),
        annotator_id INTEGER DEFAULT 1,
        segment TEXT NOT NULL,
        segment_index INTEGER DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now'))
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS term_annotations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL REFERENCES annotation_tasks(id),
        term_text TEXT NOT NULL,
        start_pos INTEGER NOT NULL,
        end_pos INTEGER NOT NULL,
        category TEXT,
        semantics TEXT,
        context_dim TEXT,
        translation TEXT,
        modern_def TEXT,
        english_equiv TEXT,
        note TEXT
      );
    `)

    db.run(`
      CREATE TABLE IF NOT EXISTS term_relations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        source_term_id INTEGER NOT NULL REFERENCES term_annotations(id),
        target_term_id INTEGER NOT NULL REFERENCES term_annotations(id),
        relation_type TEXT NOT NULL,
        confidence REAL DEFAULT 1.0
      );
    `)

    // 插入种子数据
    seedData(db)

    dbInstance = db
    return db
  })()

  return dbReady
}

function seedData(db: Database) {
  // 项目
  db.run(`INSERT INTO projects (id, name, description, source_text, status) VALUES (1, '齐民要术', '北魏贾思勰所著，中国现存最早最完整的农学著作', '《齐民要术》为北魏贾思勰所著，全书十卷九十二篇，系统地总结了六世纪以前黄河中下游地区农畜牧业生产经验，是中国现存最早最完整的农学著作。', 'active')`)
  db.run(`INSERT INTO projects (id, name, description, source_text, status) VALUES (2, '农政全书', '明代徐光启所著，集中国古代农学之大成的农学巨著', '《农政全书》为明代徐光启所著，全书六十卷，分农本、田制、农事、水利、农器、树艺、蚕桑、蚕桑广类、种植、牧养、制造、荒政等十二目，集中国古代农学之大成。', 'active')`)

  // 齐民要术任务段落
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (1, 1, 1, '凡耕之本，在于趣时，和土，务粪泽，早锄早获。', 0, 'completed')`)
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (2, 1, 1, '春耕寻手劳，秋耕待白背劳。', 1, 'completed')`)
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (3, 1, 1, '耕而不劳，不如作暴。', 2, 'in_progress')`)
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (4, 1, 1, '凡秋耕掩地者为上，至春而更耕之。', 3, 'pending')`)

  // 农政全书任务段落
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (5, 2, 1, '凡治田之法，犁耕为先。', 0, 'completed')`)
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (6, 2, 1, '水利之利，莫大于沟洫。', 1, 'completed')`)
  db.run(`INSERT INTO annotation_tasks (id, project_id, annotator_id, segment, segment_index, status) VALUES (7, 2, 1, '粪田之法，得宜则益，失宜则损。', 2, 'in_progress')`)

  // 齐民要术术语标注 - 任务1: "凡耕之本，在于趣时，和土，务粪泽，早锄早获。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (1, 1, '耕', 1, 2, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":4,"spatialContext":3,"technicalContext":5}', '{"baseline":"plow","enhanced":"plow (primary tillage operation in traditional Chinese agriculture)"}', '翻土整地，为播种做准备的基本农事操作', 'plow/tillage', '耕为农事之首，古籍中常与耘、种并列')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (2, 1, '粪', 13, 14, '农事操作', '{"literalMeaning":5,"extendedMeaning":4,"culturalLoad":4}', '{"temporalContext":4,"spatialContext":3,"technicalContext":5}', '{"baseline":"manure","enhanced":"manure/fertilize (application of organic fertilizer in traditional farming)"}', '施肥，以有机肥改良土壤', 'manure/fertilize', '粪字在古农书中兼指肥料与施肥操作')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (3, 1, '泽', 14, 15, '土壤', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":3}', '{"temporalContext":3,"spatialContext":4,"technicalContext":4}', '{"baseline":"moisture","enhanced":"soil moisture (adequate water content in soil for crop growth)"}', '土壤水分充足，润泽', 'moisture/wetness', '务粪泽指既施肥又保持土壤湿润')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (4, 1, '锄', 18, 19, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":5,"spatialContext":3,"technicalContext":4}', '{"baseline":"hoe","enhanced":"hoe (weeding and soil loosening with a hand hoe)"}', '用锄除草松土', 'hoe/weed', '早锄指及早进行中耕除草')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (5, 1, '获', 20, 21, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":5,"spatialContext":2,"technicalContext":4}', '{"baseline":"harvest","enhanced":"harvest (timely reaping of crops at maturity)"}', '收割庄稼', 'harvest/reap', '早获指及时收获以免损失')`)

  // 任务2: "春耕寻手劳，秋耕待白背劳。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (6, 2, '耕', 1, 2, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":4,"spatialContext":3,"technicalContext":5}', '{"baseline":"plow","enhanced":"plow (spring plowing followed immediately by harrowing)"}', '翻土整地', 'plow/tillage', '春耕后需随即耢地保墒')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (7, 2, '劳', 4, 5, '农具', '{"literalMeaning":3,"extendedMeaning":4,"culturalLoad":5}', '{"temporalContext":4,"spatialContext":3,"technicalContext":5}', '{"baseline":"harrow","enhanced":"harrow/lǎo (a drag harrow for breaking clods and leveling soil)"}', '耢，一种碎土平地的农具，也指用耢碎土平地', 'harrow/drag', '劳通耢，春耕后随即劳以保墒')`)

  // 任务3: "耕而不劳，不如作暴。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (8, 3, '耕', 0, 1, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":3,"spatialContext":3,"technicalContext":5}', '{"baseline":"plow","enhanced":"plow (tillage without subsequent harrowing wastes effort)"}', '翻土整地', 'plow/tillage', '耕后不劳则土壤失墒')`)

  // 任务4: "凡秋耕掩地者为上，至春而更耕之。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (9, 4, '耕', 2, 3, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":5,"spatialContext":3,"technicalContext":5}', '{"baseline":"plow","enhanced":"autumn plowing (turning under crop residues before winter)"}', '秋耕掩青，将残茬翻入土中', 'autumn plowing', '秋耕掩地可改良土壤')`)

  // 农政全书术语标注 - 任务5: "凡治田之法，犁耕为先。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (10, 5, '犁', 6, 7, '农具', '{"literalMeaning":5,"extendedMeaning":4,"culturalLoad":5}', '{"temporalContext":3,"spatialContext":3,"technicalContext":5}', '{"baseline":"plow","enhanced":"plow (primary tillage implement with iron share and wooden beam)"}', '翻土的农具，由犁铧和犁壁组成', 'plow', '犁为耕田首要农具')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (11, 5, '耕', 7, 8, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":3,"spatialContext":3,"technicalContext":5}', '{"baseline":"tillage","enhanced":"tillage (the fundamental soil preparation operation)"}', '用犁翻土整地', 'tillage/plowing', '犁耕并称，犁为工具，耕为操作')`)

  // 任务6: "水利之利，莫大于沟洫。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (12, 6, '沟', 8, 9, '水利', '{"literalMeaning":4,"extendedMeaning":4,"culturalLoad":4}', '{"temporalContext":3,"spatialContext":5,"technicalContext":5}', '{"baseline":"ditch","enhanced":"ditch/channel (irrigation and drainage channel in field systems)"}', '田间灌溉排水渠道', 'ditch/channel', '沟洫为古代农田水利系统核心')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (13, 6, '洫', 9, 10, '水利', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":3,"spatialContext":5,"technicalContext":5}', '{"baseline":"drain","enhanced":"xù (large drainage channel between fields, part of the well-field system)"}', '田间大排水沟，井田制中的沟渠系统', 'drain/moat', '沟洫并称，沟为小渠，洫为大渠')`)

  // 任务7: "粪田之法，得宜则益，失宜则损。"
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (14, 7, '粪', 0, 1, '农事操作', '{"literalMeaning":5,"extendedMeaning":4,"culturalLoad":4}', '{"temporalContext":4,"spatialContext":3,"technicalContext":5}', '{"baseline":"manure","enhanced":"manure (proper application of fertilizer is crucial for crop yield)"}', '施肥于田', 'manure/fertilize', '粪田强调施肥需合时宜')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (15, 7, '亩', 2, 3, '土壤', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":2,"spatialContext":5,"technicalContext":4}', '{"baseline":"acre","enhanced":"mǔ (traditional Chinese land area unit, also refers to raised field ridges)"}', '田亩，也指田间的垄', 'acre/mǔ', '亩在古农书中兼指面积单位与田垄')`)

  // 额外术语标注 - 补充更多类别
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (16, 1, '种', 0, 1, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":5,"spatialContext":3,"technicalContext":4}', '{"baseline":"sow","enhanced":"sow/plant (seed sowing as a core agricultural operation)"}', '播种，将种子植入土中', 'sow/plant', '耕种收为农事三大环节')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (17, 2, '耘', 0, 1, '农事操作', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":4,"spatialContext":3,"technicalContext":4}', '{"baseline":"weed","enhanced":"weed/cultivate (inter-row cultivation to remove weeds and loosen soil)"}', '除草培土，中耕作业', 'weed/cultivate', '耘耨并称，均为中耕除草')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (18, 5, '耙', 0, 1, '农具', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":3,"spatialContext":3,"technicalContext":5}', '{"baseline":"harrow","enhanced":"harrow/pá (iron-toothed implement for breaking clods and leveling soil)"}', '碎土平地的农具，铁齿耙', 'harrow', '犁后用耙碎土整地')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (19, 6, '垄', 0, 1, '土壤', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":4}', '{"temporalContext":3,"spatialContext":5,"technicalContext":4}', '{"baseline":"ridge","enhanced":"ridge (raised soil strip between furrows for planting crops)"}', '田间的土垄，高出地面的种植行', 'ridge/furrow', '垄作法是中国传统耕作方式')`)
  db.run(`INSERT INTO term_annotations (id, task_id, term_text, start_pos, end_pos, category, semantics, context_dim, translation, modern_def, english_equiv, note) VALUES (20, 7, '畎', 0, 1, '水利', '{"literalMeaning":4,"extendedMeaning":3,"culturalLoad":5}', '{"temporalContext":2,"spatialContext":5,"technicalContext":4}', '{"baseline":"furrow","enhanced":"quǎn (small drainage furrow between field ridges in the well-field system)"}', '田间小沟，垄间排水沟', 'furrow/drain', '畎浍沟洫构成古代排水体系')`)

  // 术语关系
  // 上位词关系
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (1, 1, 6, '同义词', 0.95)`)  // 耕(任务1) - 耕(任务2) 同义
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (2, 1, 11, '同义词', 0.9)`)  // 耕(齐民) - 耕(农政) 同义
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (3, 2, 14, '同义词', 0.95)`)  // 粪(任务1) - 粪(任务7) 同义
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (4, 7, 18, '关联术语', 0.85)`)  // 劳 - 耙 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (5, 12, 13, '关联术语', 0.9)`)  // 沟 - 洫 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (6, 12, 20, '上位词', 0.85)`)  // 沟 - 畎 上位
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (7, 1, 10, '关联术语', 0.9)`)  // 耕 - 犁 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (8, 4, 17, '同义词', 0.8)`)  // 锄 - 耘 近义
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (9, 1, 16, '关联术语', 0.9)`)  // 耕 - 种 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (10, 1, 5, '关联术语', 0.85)`)  // 耕 - 获 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (11, 19, 15, '关联术语', 0.8)`)  // 垄 - 亩 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (12, 2, 3, '关联术语', 0.85)`)  // 粪 - 泽 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (13, 10, 18, '关联术语', 0.8)`)  // 犁 - 耙 关联
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (14, 13, 20, '上位词', 0.8)`)  // 洫 - 畎 上位
  db.run(`INSERT INTO term_relations (id, source_term_id, target_term_id, relation_type, confidence) VALUES (15, 1, 8, '同义词', 0.9)`)  // 耕(任务1) - 耕(任务3) 同义
}

// 辅助函数：执行查询并返回对象数组
export function queryAll(db: Database, sql: string, params: unknown[] = []): Record<string, unknown>[] {
  const stmt = db.prepare(sql)
  stmt.bind(params as (string | number | null | Uint8Array)[])
  const results: Record<string, unknown>[] = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()
  return results
}

// 辅助函数：执行查询并返回单条记录
export function queryOne(db: Database, sql: string, params: unknown[] = []): Record<string, unknown> | null {
  const results = queryAll(db, sql, params)
  return results.length > 0 ? results[0] : null
}

// 辅助函数：执行写操作
export function run(db: Database, sql: string, params: unknown[] = []): void {
  db.run(sql, params as (string | number | null | Uint8Array)[])
}
