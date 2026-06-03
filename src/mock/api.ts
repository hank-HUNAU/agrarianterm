// Mock API 处理 - 模拟后端 API 的响应格式
// 处理筛选、分页等逻辑，使前端在无后端时也能正常工作

import { mockProjects, mockTasks, mockAnnotations, mockRelations, mockComparisons, mockStatistics } from './data';

// 模拟API响应格式
function success(data: unknown) {
  return { success: true, data };
}

// 从URL path和searchParams解析请求，返回mock数据
export function handleMockApi(path: string, searchParams: Record<string, string>): { success: boolean; data: unknown } {
  // /api/projects
  if (path === '/api/projects') return success(mockProjects);

  // /api/projects/:id
  const projectMatch = path.match(/^\/api\/projects\/(\d+)$/);
  if (projectMatch) {
    const project = mockProjects.find(p => p.id === Number(projectMatch[1]));
    return project ? success(project) : success(null);
  }

  // /api/tasks
  if (path === '/api/tasks') {
    let tasks = [...mockTasks];
    if (searchParams.projectId) tasks = tasks.filter(t => t.project_id === Number(searchParams.projectId));
    return success(tasks);
  }

  // /api/tasks/:id
  const taskMatch = path.match(/^\/api\/tasks\/(\d+)$/);
  if (taskMatch) {
    const task = mockTasks.find(t => t.id === Number(taskMatch[1]));
    if (task) {
      const annotations = mockAnnotations.filter(a => a.task_id === task.id);
      return success({ ...task, annotations });
    }
    return success(null);
  }

  // /api/annotations
  if (path === '/api/annotations') {
    let annotations = [...mockAnnotations];
    if (searchParams.taskId) annotations = annotations.filter(a => a.task_id === Number(searchParams.taskId));
    return success(annotations);
  }

  // /api/annotations/:id
  const annotationMatch = path.match(/^\/api\/annotations\/(\d+)$/);
  if (annotationMatch) {
    const annotation = mockAnnotations.find(a => a.id === Number(annotationMatch[1]));
    if (annotation) {
      const relations = mockRelations.filter(r => r.source_term_id === annotation.id || r.target_term_id === annotation.id);
      return success({ ...annotation, relations });
    }
    return success(null);
  }

  // /api/relations
  if (path === '/api/relations') {
    let relations = [...mockRelations];
    if (searchParams.termId) {
      const termId = Number(searchParams.termId);
      relations = relations.filter(r => r.source_term_id === termId || r.target_term_id === termId);
    }
    // 为关系添加术语名
    relations = relations.map(r => ({
      ...r,
      source_term_text: mockAnnotations.find(a => a.id === r.source_term_id)?.term_text || '',
      target_term_text: mockAnnotations.find(a => a.id === r.target_term_id)?.term_text || '',
    }));
    return success(relations);
  }

  // /api/graph
  if (path === '/api/graph') {
    let annotations = [...mockAnnotations];
    if (searchParams.category) annotations = annotations.filter(a => a.category === searchParams.category);

    const nodes = annotations.map(a => ({
      id: a.id,
      term_text: a.term_text,
      category: a.category,
      dynasty: a.task_id <= 4 ? '魏晋' : '明代',
      relationCount: mockRelations.filter(r => r.source_term_id === a.id || r.target_term_id === a.id).length,
      modern_def: a.modern_def,
      english_equiv: a.english_equiv,
    }));

    const nodeIds = new Set(nodes.map(n => n.id));
    const edges = mockRelations
      .filter(r => nodeIds.has(r.source_term_id) && nodeIds.has(r.target_term_id))
      .map(r => ({
        id: r.id,
        source: r.source_term_id,
        target: r.target_term_id,
        relation_type: r.relation_type,
        confidence: r.confidence,
      }));

    return success({ nodes, edges });
  }

  // /api/search
  if (path === '/api/search') {
    let items = [...mockAnnotations];
    if (searchParams.q) {
      const q = searchParams.q.toLowerCase();
      items = items.filter(a => a.term_text.toLowerCase().includes(q) || a.modern_def.toLowerCase().includes(q) || a.english_equiv.toLowerCase().includes(q));
    }
    if (searchParams.category) items = items.filter(a => a.category === searchParams.category);

    const page = Number(searchParams.page) || 1;
    const size = Number(searchParams.size) || 20;
    const start = (page - 1) * size;
    const pagedItems = items.slice(start, start + size);

    return success({ total: items.length, items: pagedItems });
  }

  // /api/compare
  if (path === '/api/compare') return success(mockComparisons);

  // /api/statistics
  if (path === '/api/statistics') return success(mockStatistics);

  return success(null);
}
