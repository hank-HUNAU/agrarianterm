import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  ListTodo,
  PenLine,
  ShieldCheck,
  BarChart3,
  ArrowLeft,
  User,
} from "lucide-react";

const sidebarItems = [
  { to: "/annotation", label: "任务管理", icon: ListTodo, end: true },
  { to: "/annotation/workspace/0", label: "标注工作台", icon: PenLine, end: false },
  { to: "/annotation/review", label: "质量审核", icon: ShieldCheck, end: false },
  { to: "/annotation/dashboard", label: "统计看板", icon: BarChart3, end: false },
];

const breadcrumbMap: Record<string, string> = {
  "/annotation": "任务管理",
  workspace: "标注工作台",
  review: "质量审核",
  dashboard: "统计看板",
};

export default function AnnotationLayout() {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((seg, idx) => {
    const path = "/" + pathSegments.slice(0, idx + 1).join("/");
    const label = breadcrumbMap[seg] || seg;
    return { path, label };
  });

  return (
    <div className="min-h-screen flex">
      {/* 左侧边栏 */}
      <aside className="w-56 bg-ink-light border-r border-bronze/15 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center gap-2 px-4 border-b border-bronze/15">
          <BookOpen className="w-5 h-5 text-bronze" />
          <span className="font-serif text-base font-semibold text-bronze tracking-wider">
            标注平台
          </span>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 py-3 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? "bg-bronze/15 text-bronze"
                    : "text-paper-dark hover:bg-ink-lighter hover:text-bronze-light"
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* 返回展示平台 */}
        <div className="p-3 border-t border-bronze/15">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-paper-dark
              hover:text-bronze-light transition-colors rounded-md
              hover:bg-ink-lighter"
          >
            <ArrowLeft className="w-4 h-4" />
            返回展示平台
          </Link>
        </div>
      </aside>

      {/* 右侧主区域 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-50 h-12 bg-ink-light/95 backdrop-blur border-b border-bronze/15 flex items-center justify-between px-5">
          {/* 面包屑 */}
          <nav className="flex items-center gap-1 text-sm text-paper-dark">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.path} className="flex items-center gap-1">
                {idx > 0 && <span className="text-bronze/40">/</span>}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-bronze">{crumb.label}</span>
                ) : (
                  <Link to={crumb.path} className="hover:text-bronze-light transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* 当前用户信息 */}
          <div className="flex items-center gap-2 text-sm text-paper-dark">
            <User className="w-4 h-4" />
            <span>标注员</span>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
