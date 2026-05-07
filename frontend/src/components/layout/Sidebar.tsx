import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
  Cpu,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "Build History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout, sidebarOpen, toggleSidebar, currency, setCurrency } = useStore();
  const navigate = useNavigate();
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg glass-card"
        id="sidebar-toggle"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40
          bg-surface-950/90 backdrop-blur-xl
          border-r border-brand-500/10
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-brand-500/10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Cpu size={22} className="text-surface-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">SmartBuild AI</h1>
            <p className="text-xs text-surface-400">PC Budget Optimizer</p>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="px-4 pt-4">
          <div className="relative">
            <button
              onClick={() => setCurrencyOpen(!currencyOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg glass-card text-sm"
              id="currency-switcher"
            >
              <span className="text-surface-300">Currency</span>
              <span className="flex items-center gap-1 text-brand-400 font-medium">
                {SUPPORTED_CURRENCIES.find((c) => c.code === currency)?.symbol} {currency}
                <ChevronDown size={14} />
              </span>
            </button>
            {currencyOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 glass-card p-1 z-50">
                {SUPPORTED_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setCurrencyOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                      ${currency === c.code ? "bg-brand-500/20 text-brand-400" : "hover:bg-surface-800 text-surface-300"}
                    `}
                  >
                    {c.symbol} {c.code} — {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 mt-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => useStore.getState().sidebarOpen && toggleSidebar()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-brand-500/15 text-brand-400 border border-brand-500/20"
                    : "text-surface-400 hover:text-white hover:bg-surface-800/50"
                }`
              }
              end={item.to === "/"}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-4 py-4 border-t border-brand-500/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-sm font-bold text-surface-950">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "User"}</p>
              <p className="text-xs text-surface-400 truncate">{user?.email || ""}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors"
              title="Logout"
              id="logout-btn"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
