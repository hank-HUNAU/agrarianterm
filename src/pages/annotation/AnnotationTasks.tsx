import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit3, Trash2, ChevronDown, ChevronRight, FolderOpen } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { apiFetch } from '@/hooks/useApi';

interface Task {
  id: number;
  projectId: number;
  segment: string;
  status: string;
}

interface Project {
  id: number;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'completed';
  createdAt: string;
  tasks: Task[];
}

const statusConfig = {
  draft: { label: '草稿', cls: 'bg-paper-dark/20 text-paper-dark' },
  active: { label: '进行中', cls: 'bg-bamboo/20 text-bamboo-light' },
  completed: { label: '已完成', cls: 'bg-bronze/20 text-bronze' },
};

export default function AnnotationTasks() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', text: '' });

  useEffect(() => {
    apiFetch<Project[]>('/projects').then(setProjects).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    setShowModal(false);
    setForm({ name: '', description: '', text: '' });
    apiFetch<Project[]>('/projects').then(setProjects);
  };

  const handleDelete = async (id: number) => {
    await apiFetch(`/projects/${id}`, { method: 'DELETE' });
    apiFetch<Project[]>('/projects').then(setProjects);
  };

  const getProgress = (project: Project) => {
    if (!project.tasks?.length) return { done: 0, total: 0 };
    const done = project.tasks.filter((t) => t.status === 'completed').length;
    return { done, total: project.tasks.length };
  };

  return (
    <div className="p-6">
      <PageHeader
        title="任务管理"
        subtitle="管理标注项目与任务"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-bronze text-ink rounded-md
              text-sm font-medium hover:bg-bronze-light transition-colors"
          >
            <Plus className="w-4 h-4" />
            新建项目
          </button>
        }
      />

      {/* 项目卡片网格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {projects.map((project) => {
          const { done, total } = getProgress(project);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const sc = statusConfig[project.status] || statusConfig.draft;
          const expanded = expandedId === project.id;

          return (
            <div
              key={project.id}
              className="bg-ink-light border-l-4 border-l-bronze border border-bronze/15
                rounded-lg overflow-hidden"
            >
              {/* 卡片主体 */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-serif text-lg text-bronze font-semibold">
                    {project.name}
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sc.cls}`}>
                    {sc.label}
                  </span>
                </div>
                <p className="text-sm text-paper-dark mb-3 line-clamp-2">
                  {project.description || '暂无描述'}
                </p>
                <p className="text-xs text-paper-dark/60 mb-3">
                  创建时间：{project.createdAt ? new Date(project.createdAt).toLocaleDateString('zh-CN') : '-'}
                </p>

                {/* 进度条 */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-paper-dark mb-1">
                    <span>任务进度</span>
                    <span>{done}/{total} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-ink-lighter rounded-full overflow-hidden">
                    <div
                      className="h-full bg-bronze rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedId(expanded ? null : project.id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-paper-dark
                      hover:text-bronze-light transition-colors rounded bg-ink-lighter"
                  >
                    {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    任务列表
                  </button>
                  <Link
                    to={`/annotation/workspace/${project.id}`}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-ink
                      bg-bronze hover:bg-bronze-light transition-colors rounded"
                  >
                    <FolderOpen className="w-3 h-3" />
                    进入标注
                  </Link>
                  <button
                    className="p-1.5 text-paper-dark hover:text-bronze-light transition-colors"
                    title="编辑"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 text-paper-dark hover:text-red-400 transition-colors"
                    title="删除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 展开的任务列表 */}
              {expanded && (
                <div className="border-t border-bronze/10 px-4 py-3 bg-ink/40">
                  {project.tasks?.length ? (
                    <ul className="space-y-2">
                      {project.tasks.map((task) => (
                        <li key={task.id} className="flex items-center justify-between text-sm">
                          <span className="text-paper-dark truncate flex-1 mr-2">
                            {task.segment?.slice(0, 50) || `任务 #${task.id}`}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                task.status === 'completed'
                                  ? 'bg-bronze/20 text-bronze'
                                  : 'bg-bamboo/20 text-bamboo-light'
                              }`}
                            >
                              {task.status === 'completed' ? '已完成' : '进行中'}
                            </span>
                            <Link
                              to={`/annotation/workspace/${task.id}`}
                              className="text-xs text-bronze hover:text-bronze-light"
                            >
                              标注
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-paper-dark/60">暂无任务</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16 text-paper-dark/60">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>暂无项目，点击"新建项目"开始</p>
        </div>
      )}

      {/* 新建项目弹窗 */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-ink-light border border-bronze/20 rounded-lg w-full max-w-lg p-6">
            <h2 className="font-serif text-xl text-bronze mb-4">新建项目</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-paper-dark mb-1">项目名</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm
                    text-paper focus:outline-none focus:border-bronze"
                  placeholder="输入项目名称"
                />
              </div>
              <div>
                <label className="block text-sm text-paper-dark mb-1">描述</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm
                    text-paper focus:outline-none focus:border-bronze resize-none"
                  placeholder="项目描述"
                />
              </div>
              <div>
                <label className="block text-sm text-paper-dark mb-1">古籍原文</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  rows={5}
                  className="w-full px-3 py-2 bg-ink border border-bronze/20 rounded text-sm
                    text-paper focus:outline-none focus:border-bronze resize-none font-serif"
                  placeholder="粘贴古籍原文文本..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-paper-dark hover:text-bronze-light transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-bronze text-ink text-sm font-medium rounded
                  hover:bg-bronze-light transition-colors"
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
