import { useState, useEffect } from 'react';
import { FolderOpen, ListTodo, Tag, GitBranch, Clock } from 'lucide-react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { apiFetch } from '@/hooks/useApi';

echarts.use([BarChart, PieChart, GridComponent, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer]);

interface Stats {
  projectCount: number;
  taskCount: number;
  annotationCount: number;
  relationCount: number;
  projectProgress: { name: string; total: number; completed: number }[];
  categoryDistribution: { name: string; value: number }[];
  recentActivity: { id: number; term: string; action: string; time: string }[];
}

const defaultStats: Stats = {
  projectCount: 0,
  taskCount: 0,
  annotationCount: 0,
  relationCount: 0,
  projectProgress: [],
  categoryDistribution: [],
  recentActivity: [],
};

export default function AnnotationDashboard() {
  const [stats, setStats] = useState<Stats>(defaultStats);

  useEffect(() => {
    apiFetch<Stats>('/statistics').then(setStats).catch(() => {});
  }, []);

  // 柱状图配置
  const barOption = {
    backgroundColor: 'transparent',
    title: {
      text: '标注进度（按项目）',
      textStyle: { color: '#c9a96e', fontSize: 14, fontFamily: 'Noto Serif SC' },
      left: 'center',
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: '#252542',
      borderColor: '#c9a96e33',
      textStyle: { color: '#e0dcd4' },
    },
    legend: {
      data: ['已完成', '总任务'],
      textStyle: { color: '#e8e0d0' },
      bottom: 0,
    },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '18%', containLabel: true },
    xAxis: {
      type: 'category' as const,
      data: stats.projectProgress.map((p) => p.name),
      axisLabel: { color: '#e8e0d0', fontSize: 11 },
      axisLine: { lineStyle: { color: '#c9a96e33' } },
    },
    yAxis: {
      type: 'value' as const,
      axisLabel: { color: '#e8e0d0' },
      splitLine: { lineStyle: { color: '#c9a96e15' } },
    },
    series: [
      {
        name: '已完成',
        type: 'bar' as const,
        data: stats.projectProgress.map((p) => p.completed),
        itemStyle: { color: '#c9a96e' },
        barWidth: '30%',
      },
      {
        name: '总任务',
        type: 'bar' as const,
        data: stats.projectProgress.map((p) => p.total),
        itemStyle: { color: '#4a7c59' },
        barWidth: '30%',
      },
    ],
  };

  // 饼图配置
  const pieOption = {
    backgroundColor: 'transparent',
    title: {
      text: '术语类别分布',
      textStyle: { color: '#c9a96e', fontSize: 14, fontFamily: 'Noto Serif SC' },
      left: 'center',
    },
    tooltip: {
      trigger: 'item' as const,
      backgroundColor: '#252542',
      borderColor: '#c9a96e33',
      textStyle: { color: '#e0dcd4' },
    },
    legend: {
      orient: 'vertical' as const,
      right: '5%',
      top: 'center',
      textStyle: { color: '#e8e0d0', fontSize: 11 },
    },
    series: [
      {
        type: 'pie' as const,
        radius: ['40%', '65%'],
        center: ['40%', '55%'],
        avoidLabelOverlap: false,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 12, fontWeight: 'bold', color: '#c9a96e' },
        },
        data: stats.categoryDistribution.length > 0
          ? stats.categoryDistribution
          : [{ name: '暂无数据', value: 1 }],
        itemStyle: {
          borderColor: '#1a1a2e',
          borderWidth: 2,
        },
        color: ['#c9a96e', '#4a7c59', '#5a9469', '#d4b87e', '#a88a50', '#e8e0d0'],
      },
    ],
  };

  return (
    <div className="p-6">
      <PageHeader title="统计看板" subtitle="标注数据总览" />

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="项目数" value={stats.projectCount} icon={<FolderOpen className="w-5 h-5" />} />
        <StatCard label="任务数" value={stats.taskCount} icon={<ListTodo className="w-5 h-5" />} />
        <StatCard label="已标注术语" value={stats.annotationCount} icon={<Tag className="w-5 h-5" />} />
        <StatCard label="关系数" value={stats.relationCount} icon={<GitBranch className="w-5 h-5" />} />
      </div>

      {/* 中部：标注进度柱状图 */}
      <div className="bg-ink-light border border-bronze/15 rounded-lg p-4 mb-6">
        <ReactEChartsCore echarts={echarts} option={barOption} style={{ height: 280 }} />
      </div>

      {/* 底部两栏 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 术语类别分布饼图 */}
        <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
          <ReactEChartsCore echarts={echarts} option={pieOption} style={{ height: 280 }} />
        </div>

        {/* 最近标注活动 */}
        <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
          <h3 className="font-serif text-base text-bronze font-semibold mb-3">最近标注活动</h3>
          {stats.recentActivity.length > 0 ? (
            <ul className="space-y-3">
              {stats.recentActivity.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-bronze/50 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-paper truncate">
                      <span className="text-bronze font-serif">{item.term}</span>
                      <span className="text-paper-dark/60 ml-2">{item.action}</span>
                    </p>
                    <p className="text-xs text-paper-dark/40 mt-0.5">
                      {item.time ? new Date(item.time).toLocaleString('zh-CN') : '-'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-10 text-paper-dark/40 text-sm">
              暂无活动记录
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
