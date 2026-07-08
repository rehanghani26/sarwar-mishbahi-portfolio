import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FileText,
  Bookmark,
  HelpCircle,
  BookOpen,
  Mic,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  ChevronRight,
  Globe,
  ChevronLeft,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { logout } from '@/store/slices/authSlice';
import { logoutUser } from '@/services';
import toast from 'react-hot-toast';


const NAV_LINKS = [
  { to: '/', label: 'عوامی ویب سائٹ', icon: Globe },
  { to: '/admin/dashboard', label: 'ڈیش بورڈ', icon: LayoutDashboard },
  { to: '/admin/articles', label: 'مقالات', icon: FileText },
  { to: '/admin/fatwas', label: 'فتاویٰ', icon: Bookmark },
  { to: '/admin/questions', label: 'سوالات', icon: HelpCircle },
  { to: '/admin/publications', label: 'مطبوعات', icon: BookOpen },
  { to: '/admin/lectures', label: 'بیانات', icon: Mic },
  { to: '/admin/events', label: 'پروگرامات', icon: CalendarDays },
  { to: '/admin/users', label: 'صارفین', icon: Users },
  { to: '/admin/settings', label: 'ترتیبات', icon: Settings },
];

// Premium gradient sidebar palette
const SB = {
  bg: 'linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #312e81 100%)',
  border: 'rgba(129,140,248,0.15)',
  active: 'rgba(251,191,36,0.18)',
  activeBorder: '#fbbf24',
  activeText: '#fde68a',
  hoverBg: 'rgba(255,255,255,0.07)',
  icon: '#818cf8',
  iconActive: '#fbbf24',
  text: '#c7d2fe',
  textMuted: '#6d7fc7',
  divider: 'rgba(129,140,248,0.12)',
};

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedInUser } = useSelector((state) => state.auth);

  const [collapsed, setCollapsed] = useState(false); // desktop collapse
  const [mobileOpen, setMobileOpen] = useState(false); // mobile slide-over

  const [notifications, setNotifications] = useState([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);



  const handleNotificationClick = (notif) => {
    // Remove from notification list
    setNotifications((prev) => prev.filter((n) => n._id !== notif._id));
    setShowNotifDropdown(false);

    // Route to corresponding management section
    if (notif.contentType === 'article') {
      navigate('/admin/articles');
    } else if (notif.contentType === 'fatwa') {
      navigate('/admin/fatwas');
    } else if (notif.contentType === 'book') {
      navigate('/admin/publications');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    toast.success('کامیابی سے لاگ آؤٹ ہو گئے');
    navigate('/admin/login');
  };

  const sidebarW = collapsed ? 'w-[68px]' : 'w-64';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f1f5f9' }}>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(2px)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ══════════════ SIDEBAR ══════════════ */}
      <aside
        style={{ background: SB.bg, borderRight: `1px solid ${SB.border}` }}
        className={`
          fixed inset-y-0 left-0 z-30 flex flex-col
          ${sidebarW}
          transition-[width] duration-300 ease-in-out
          shadow-[4px_0_32px_rgba(0,0,0,0.35)]
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Brand header ── */}
        <div
          className="flex items-center flex-shrink-0 px-3 py-4"
          style={{ borderBottom: `1px solid ${SB.divider}`, gap: collapsed ? '0' : '10px' }}
        >
          {/* Shield logo — always visible */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)', boxShadow: '0 4px 12px rgba(251,191,36,0.35)' }}
          >
            <Shield className="w-4 h-4 text-white" />
          </div>

          {/* Brand text — hidden when collapsed */}
          {!collapsed && (
            <div className="min-w-0 flex-1 text-right overflow-hidden" dir="rtl">
              <p className="text-sm font-bold text-white truncate">جامعہ بنوری ٹاؤن</p>
              <p className="text-[10px] font-medium" style={{ color: SB.textMuted }}>ایڈمن پینل</p>
            </div>
          )}

          {/* ── Collapse toggle — ALWAYS visible on desktop ── */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
            style={{
              marginLeft: collapsed ? 'auto' : undefined,
              marginRight: collapsed ? 'auto' : undefined,
              background: 'rgba(255,255,255,0.10)',
              color: SB.text,
            }}
            title={collapsed ? 'سائیڈبار کھولیں' : 'سائیڈبار بند کریں'}
          >
            {collapsed
              ? <ChevronRight className="w-3.5 h-3.5" />
              : <ChevronLeft className="w-3.5 h-3.5" />
            }
          </button>

          {/* Mobile close — only on mobile */}
          <button
            className="lg:hidden ml-auto text-indigo-300"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" dir="rtl">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : ''}
              className="block"
            >
              {({ isActive }) => (
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer relative"
                  style={{
                    background: isActive ? SB.active : 'transparent',
                    borderLeft: isActive ? `3px solid ${SB.activeBorder}` : '3px solid transparent',
                    color: isActive ? SB.activeText : SB.text,
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = SB.hoverBg; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <Icon
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: isActive ? SB.iconActive : SB.icon }}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium flex-1 leading-none">{label}</span>
                  )}
                </div>
              )}
            </NavLink>
          ))}
        </nav>



        {/* ── User + Logout ── */}
        <div style={{ borderTop: `1px solid ${SB.divider}` }} className="px-3 py-3 space-y-2">
          {!collapsed && (
            <div className="flex items-center gap-2 px-1" dir="rtl">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(129,140,248,0.2)', color: '#818cf8' }}
              >
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 text-right">
                <p className="text-sm font-semibold text-white truncate">{loggedInUser?.name || 'ایڈمنسٹریٹر'}</p>
                <p className="text-xs truncate" style={{ color: SB.textMuted }}>{loggedInUser?.loginEmail || ''}</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={collapsed ? 'لاگ آؤٹ' : ''}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm font-medium"
            style={{
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
            }}
            dir="rtl"
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>لاگ آؤٹ</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Top bar */}
        <header
          className="flex items-center gap-3 h-14 px-5 flex-shrink-0"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            boxShadow: '0 1px 12px rgba(15,23,42,0.06)',
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-slate-500 hover:text-slate-900"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm" dir="rtl">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline text-slate-400">ایڈمن</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 rotate-180" />
            <span className="font-semibold text-slate-800">مینجمنٹ کنسول</span>
          </div>

          <div className="ml-auto flex items-center gap-4 relative">

            {/* Profile badge */}
            <span
              className="hidden sm:inline text-xs font-bold px-3 py-1.5 rounded-full"
              style={{
                background: 'linear-gradient(90deg,#4f46e5,#7c3aed)',
                color: '#fff',
                boxShadow: '0 2px 8px rgba(79,70,229,0.3)',
              }}
            >
              {loggedInUser?.role === 'admin' ? '⚙ سپر ایڈمن' : '👤 ' + (loggedInUser?.name || 'صارف')}
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors relative cursor-pointer flex items-center justify-center"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 left-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {showNotifDropdown && (
                <div
                  style={{ zIndex: 99999 }}
                  className="absolute left-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-3 px-4 transition-all"
                  dir="rtl"
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-800">تبصرے کے نوٹیفیکیشنز</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[10px] text-red-500 hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        تمام صاف کریں
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <p className="text-center py-6 text-xs text-slate-400 font-bold">کوئی نیا نوٹیفیکیشن نہیں ہے</p>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {notifications.map((n, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleNotificationClick(n)}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex flex-col gap-1 text-right cursor-pointer hover:bg-slate-100 transition-colors"
                        >
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="font-bold text-primary">{n.user?.name || 'صارف'}</span>
                            <span className="text-slate-400 font-light">{n.contentType === 'article' ? 'مضمون' : n.contentType === 'fatwa' ? 'فتویٰ' : 'کتاب'}</span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium leading-relaxed">"{n.text}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
