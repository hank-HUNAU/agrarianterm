import { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: number;
  term_text: string;
  category: string;
  modern_def: string;
  english_equiv: string;
  relationCount?: number;
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
  id: number;
  relation_type: string;
  confidence: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  '农事操作': '#c9a96e',
  '农具': '#4a7c59',
  '作物': '#8b6914',
  '土壤': '#6b4423',
  '水利': '#2d6a7a',
};

const RELATION_COLORS: Record<string, string> = {
  '上位词': '#c9a96e',
  '下位词': '#4a7c59',
  '同义词': '#8b6914',
  '关联术语': '#666',
};

interface UseForceGraphOptions {
  nodes: GraphNode[];
  edges: GraphEdge[];
  selectedId: number | null;
  onSelectNode: (id: number | null) => void;
  width: number;
  height: number;
}

export function useForceGraph(options: UseForceGraphOptions) {
  const { nodes, edges, selectedId, onSelectNode, width, height } = options;
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getNodeRadius = useCallback((node: GraphNode) => {
    const count = node.relationCount ?? 1;
    return Math.max(15, Math.min(40, 15 + count * 3));
  }, []);

  const getCategoryColor = useCallback((category: string) => {
    return CATEGORY_COLORS[category] || '#c9a96e';
  }, []);

  const getRelationColor = useCallback((type: string) => {
    return RELATION_COLORS[type] || '#666';
  }, []);

  useEffect(() => {
    if (!svgRef.current || width === 0 || height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // 准备数据 - 深拷贝避免d3修改原始数据
    const simNodes: GraphNode[] = nodes.map((n) => ({ ...n }));
    // 计算每个节点的关联数
    const countMap: Record<number, number> = {};
    edges.forEach((e) => {
      const s = typeof e.source === 'number' ? e.source : (e.source as GraphNode).id;
      const t = typeof e.target === 'number' ? e.target : (e.target as GraphNode).id;
      countMap[s] = (countMap[s] || 0) + 1;
      countMap[t] = (countMap[t] || 0) + 1;
    });
    simNodes.forEach((n) => { n.relationCount = countMap[n.id] || 0; });

    const simEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      source: typeof e.source === 'object' ? (e.source as GraphNode).id : e.source,
      target: typeof e.target === 'object' ? (e.target as GraphNode).id : e.target,
    }));

    const g = svg.append('g');

    // 缩放平移
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on('zoom', (event) => g.attr('transform', event.transform));
    svg.call(zoom);

    // 力仿真
    const simulation = d3.forceSimulation<GraphNode>(simNodes)
      .force('link', d3.forceLink<GraphNode, GraphEdge>(simEdges).id((d) => d.id).distance(120))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius((d) => getNodeRadius(d) + 5));
    simulationRef.current = simulation;

    // 边
    const link = g.append('g').selectAll('line')
      .data(simEdges).join('line')
      .attr('stroke', (d) => getRelationColor(d.relation_type))
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6);

    // 边标签
    const linkLabel = g.append('g').selectAll('text')
      .data(simEdges).join('text')
      .text((d) => d.relation_type)
      .attr('font-size', 9)
      .attr('fill', '#999')
      .attr('text-anchor', 'middle')
      .attr('dy', -4);

    // 节点组
    const node = g.append('g').selectAll<SVGGElement, GraphNode>('g')
      .data(simNodes).join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      );

    // 节点圆
    node.append('circle')
      .attr('r', (d) => getNodeRadius(d))
      .attr('fill', (d) => getCategoryColor(d.category))
      .attr('fill-opacity', 0.85)
      .attr('stroke', (d) => getCategoryColor(d.category))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.4);

    // 节点文字
    node.append('text')
      .text((d) => d.term_text)
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', 11)
      .attr('fill', '#f5f0e8')
      .attr('pointer-events', 'none');

    // 点击事件
    node.on('click', (_event, d) => {
      onSelectNode(d.id === selectedId ? null : d.id);
    });

    // 悬停tooltip
    node.on('mouseenter', (event, d) => {
      if (tooltipRef.current) {
        tooltipRef.current.style.display = 'block';
        tooltipRef.current.style.left = `${event.pageX + 12}px`;
        tooltipRef.current.style.top = `${event.pageY - 12}px`;
        tooltipRef.current.innerHTML = `<strong>${d.term_text}</strong><br/><span style="color:#999">${d.category}</span>`;
      }
    }).on('mouseleave', () => {
      if (tooltipRef.current) tooltipRef.current.style.display = 'none';
    });

    // tick更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as GraphNode).x!)
        .attr('y1', (d) => (d.source as GraphNode).y!)
        .attr('x2', (d) => (d.target as GraphNode).x!)
        .attr('y2', (d) => (d.target as GraphNode).y!);

      linkLabel
        .attr('x', (d) => ((d.source as GraphNode).x! + (d.target as GraphNode).x!) / 2)
        .attr('y', (d) => ((d.source as GraphNode).y! + (d.target as GraphNode).y!) / 2);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [nodes, edges, width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  // 高亮选中节点
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const nodeGroups = svg.selectAll<SVGGElement, GraphNode>('g > g > g');

    if (selectedId === null) {
      nodeGroups.select('circle').attr('stroke-width', 2).attr('stroke-opacity', 0.4).attr('fill-opacity', 0.85);
      svg.selectAll('line').attr('stroke-opacity', 0.6);
      return;
    }

    // 找出关联节点
    const relatedIds = new Set<number>([selectedId]);
    edges.forEach((e) => {
      const s = typeof e.source === 'object' ? (e.source as GraphNode).id : Number(e.source);
      const t = typeof e.target === 'object' ? (e.target as GraphNode).id : Number(e.target);
      if (s === selectedId) relatedIds.add(t);
      if (t === selectedId) relatedIds.add(s);
    });

    nodeGroups.select('circle')
      .attr('stroke-width', (d) => d.id === selectedId ? 4 : relatedIds.has(d.id) ? 3 : 1)
      .attr('stroke-opacity', (d) => relatedIds.has(d.id) ? 0.9 : 0.15)
      .attr('fill-opacity', (d) => relatedIds.has(d.id) ? 1 : 0.2);

    svg.selectAll<SVGLineElement, GraphEdge>('line')
      .attr('stroke-opacity', (d) => {
        const s = typeof d.source === 'object' ? (d.source as GraphNode).id : d.source;
        const t = typeof d.target === 'object' ? (d.target as GraphNode).id : d.target;
        return (s === selectedId || t === selectedId) ? 0.9 : 0.1;
      });
  }, [selectedId, edges]);

  return { svgRef, tooltipRef, getNodeRadius, getCategoryColor, getRelationColor };
}
