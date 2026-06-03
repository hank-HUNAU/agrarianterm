import { NavLink, Outlet, Link } from "react-router-dom";
import { BookOpen, PenLine } from "lucide-react";

const navItems = [
  { to: "/", label: "知识图谱" },
  { to: "/search", label: "术语检索" },
  { to: "/compare", label: "翻译对比" },
  { to: "/statistics", label: "数据统计" },
];

export default function DisplayLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 bg-ink-light/95 backdrop-blur border-b border-bronze/20">
        <div className="container flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-bronze" />
            <span className="font-serif text-lg font-semibold text-bronze tracking-wider">
              古籍术语
            </span>
          </Link>

          {/* 导航链接 */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm rounded-md transition-colors ${
                    isActive
                      ? "text-bronze border-b-2 border-bronze"
                      : "text-paper-dark hover:text-bronze-light"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* 标注平台入口 */}
          <Link
            to="/annotation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md
              bg-bronze/10 text-bronze border border-bronze/30
              hover:bg-bronze/20 transition-colors"
          >
            <PenLine className="w-4 h-4" />
            标注平台
          </Link>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
