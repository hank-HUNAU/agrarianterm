import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { apiFetch } from '@/hooks/useApi';
import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import { BookOpen, GitBranch, Library, TrendingUp } from 'lucide-react';

interface StatsData {
  termTotal: number;
  relationTotal: number;
  categoryDistribution: { category: string; count: number }[];
  dynastyTrend: { dynasty: string; project: string; termCount: number }[];
  relationTypeDistribution: { relation_type: string; count: number }[];
  translationQuality: {
    baseline: { averageScore: number; coverage: number; culturalAccuracy: number; contextAwareness: number };
    enhanced: { averageScore: number; coverage: number; culturalAccuracy: number; contextAwareness: number };
    improvement: { averageScore: number; coverage: number; culturalAccuracy: number; contextAwareness: number };
  };
  projectStats: { id: number; name: string; task_count: number; annotation_count: number }[];
}

const PIE_COLORS = ['#c9a96e', '#4a7c59', '#8b6914', '#6b4423', '#2d6a7a', '#8b5e3c'];
const RELATION_COLORS = ['#c9a96e', '#4a7c59', '#8b6914', '#666', '#2d6a7a'];

export default function StatisticsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    apiFetch<StatsData>('/statistics').then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="container py-6">
        <PageHeader title="数据统计" />
        <div className="flex items-center justify-center py-20 text-paper-dark/40">加载中...</div>
      </div>
    );
  }

  const bookCount = stats.projectStats?.length || 2;
  const improvementRate = stats.translationQuality.improvement.averageScore;

  // 类别分布饼图
  const categoryPieOption = {
    backgroundColor: 'transparent',
    title: { text: '类别分布', left: 'center', top: 0, textStyle: { color: '#c9a96e', fontSize: 14, fontFamily: 'Noto Serif SC' } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: PIE_COLORS,
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '55%'],
      label: { color: '#e8e0d0', fontSize: 11 },
      data: (stats.categoryDistribution || []).map((d) => ({ name: d.category, value: d.count })),
    }],
  };

  // 关系类型分布饼图
  const relationPieOption = {
    backgroundColor: 'transparent',
    title: { text: '关系类型分布', left: 'center', top: 0, textStyle: { color: '#c9a96e', fontSize: 14, fontFamily: 'Noto Serif SC' } },
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    color: RELATION_COLORS,
    series: [{
      type: 'pie', radius: ['40%', '70%'], center: ['50%', '55%'],
      label: { color: '#e8e0d0', fontSize: 11 },
      data: (stats.relationTypeDistribution || []).map((d) => ({ name: d.relation_type, value: d.count })),
    }],
  };

  // 朝代演变折线图
  const dynastyLineOption = {
    backgroundColor: 'transparent',
    title: { text: '朝代术语演变', left: 'center', top: 0, textStyle: { color: '#c9a96e', fontSize: 14, fontFamily: 'Noto Serif SC' } },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: (stats.dynastyTrend || []).map((d) => d.dynasty),
      axisLine: { lineStyle: { color: '#c9a96e33' } },
      axisLabel: { color: '#e8e0d0' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#c9a96e33' } },
      axisLabel: { color: '#e8e0d0' },
      splitLine: { lineStyle: { color: '#c9a96e15' } },
    },
    series: [{
      type: 'line', smooth: true,
      data: (stats.dynastyTrend || []).map((d) => d.termCount),
      lineStyle: { color: '#c9a96e', width: 2 },
      itemStyle: { color: '#c9a96e' },
      areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: '#c9a96e40' }, { offset: 1, color: '#c9a96e05' }] } },
    }],
  };

  // 翻译质量对比柱状图
  const qualityBarOption = {
    backgroundColor: 'transparent',
    title: { text: '翻译质量对比', left: 'center', top: 0, textStyle: { color: '#c9a96e', fontSize: 14, fontFamily: 'Noto Serif SC' } },
    tooltip: { trigger: 'axis' },
    legend: { data: ['基线', '增强'], top: 25, textStyle: { color: '#e8e0d0' } },
    xAxis: {
      type: 'category',
      data: ['综合评分', '覆盖率', '文化准确度', '语境感知'],
      axisLine: { lineStyle: { color: '#c9a96e33' } },
      axisLabel: { color: '#e8e0d0', fontSize: 11 },
    },
    yAxis: {
      type: 'value', max: 100,
      axisLine: { lineStyle: { color: '#c9a96e33' } },
      axisLabel: { color: '#e8e0d0' },
      splitLine: { lineStyle: { color: '#c9a96e15' } },
    },
    series: [
      {
        name: '基线', type: 'bar', barWidth: '30%',
        data: [stats.translationQuality.baseline.averageScore, stats.translationQuality.baseline.coverage, stats.translationQuality.baseline.culturalAccuracy, stats.translationQuality.baseline.contextAwareness],
        itemStyle: { color: '#666', borderRadius: [3, 3, 0, 0] },
      },
      {
        name: '增强', type: 'bar', barWidth: '30%',
        data: [stats.translationQuality.enhanced.averageScore, stats.translationQuality.enhanced.coverage, stats.translationQuality.enhanced.culturalAccuracy, stats.translationQuality.enhanced.contextAwareness],
        itemStyle: { color: '#c9a96e', borderRadius: [3, 3, 0, 0] },
      },
    ],
  };

  return (
    <div className="container py-6">
      <PageHeader title="数据统计" subtitle="农业古籍术语知识增强平台数据概览" />

      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="术语总量" value={stats.termTotal} icon={<BookOpen className="w-5 h-5" />} trend={`+${stats.termTotal}`} />
        <StatCard label="关系总量" value={stats.relationTotal} icon={<GitBranch className="w-5 h-5" />} trend={`+${stats.relationTotal}`} />
        <StatCard label="覆盖典籍" value={bookCount} icon={<Library className="w-5 h-5" />} />
        <StatCard label="翻译提升率" value={`${improvementRate}%`} icon={<TrendingUp className="w-5 h-5" />} trend={`+${improvementRate}%`} />
      </div>

      {/* 中部：两个饼图 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
          <ReactECharts option={categoryPieOption} style={{ height: 300 }} />
        </div>
        <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
          <ReactECharts option={relationPieOption} style={{ height: 300 }} />
        </div>
      </div>

      {/* 底部：折线图 + 柱状图 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
          <ReactECharts option={dynastyLineOption} style={{ height: 300 }} />
        </div>
        <div className="bg-ink-light border border-bronze/15 rounded-lg p-4">
          <ReactECharts option={qualityBarOption} style={{ height: 300 }} />
        </div>
      </div>
    </div>
  );
}
