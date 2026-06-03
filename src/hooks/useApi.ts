import { handleMockApi } from '@/mock/api';

const API_BASE = '/api';

// 是否已确认使用mock模式（后端不可用时自动切换）
let useMock = false;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  // 如果已确认使用mock，直接返回mock数据
  if (useMock) {
    return getMockData<T>(path);
  }

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.error || '请求失败');
    return json.data as T;
  } catch {
    // 后端不可用，切换到mock模式
    useMock = true;
    console.info('后端API不可用，使用内置示例数据');
    return getMockData<T>(path);
  }
}

function getMockData<T>(path: string): T {
  // 解析searchParams，补全 /api 前缀
  const fullPath = path.startsWith('/api') ? path : `/api${path}`;
  const url = new URL(fullPath, 'http://localhost');
  const searchParams: Record<string, string> = {};
  url.searchParams.forEach((value, key) => { searchParams[key] = value; });

  const result = handleMockApi(url.pathname, searchParams);
  return result.data as T;
}
