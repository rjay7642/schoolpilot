import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import Swal from 'sweetalert2';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Mail,
  Search,
  Settings,
  User,
} from 'lucide-react';
import DashboardHome from './dashboard/DashboardHome.jsx';
import GenerateCertificate from './dashboard/GenerateCertificate.jsx';
import HistoryTab from './dashboard/HistoryTab.jsx';
import IDCardGenerator from './dashboard/IDCardGenerator.jsx';
import ProfileTab from './dashboard/ProfileTab.jsx';
import ContactDeveloper from './dashboard/ContactDeveloper.jsx';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', description: 'Daily summary and shortcuts', icon: LayoutDashboard },
  { id: 'generate', label: 'Generate Result', description: 'Create result certificates', icon: FileText },
  { id: 'history', label: 'History', description: 'Search and reprint records', icon: History },
  { id: 'idcard', label: 'ID Cards', description: 'Prepare student identity cards', icon: CreditCard },
  { id: 'profile', label: 'School Profile', description: 'Manage school settings', icon: User },
  { id: 'contact', label: 'Contact Developer', description: 'Support and collaboration', icon: Mail },
];

export default function DashboardLayout() {
  const {
    currentUser,
    sidebarCollapsed,
    setSidebarCollapsed,
    activeTab,
    setActiveTab,
    logout,
  } = useStore();
  const [search, setSearch] = useState('');

  const initials = (currentUser?.schoolName || 'SP')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const currentTab = NAV_ITEMS.find((item) => item.id === activeTab) || NAV_ITEMS[0];
  const todayLabel = new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  async function handleLogout() {
    const result = await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to sign out from your school workspace?',
      showCancelButton: true,
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Yes, Sign Out',
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Signed out',
      text: 'Session closed successfully. See you soon!',
      timer: 1500,
      showConfirmButton: false,
    });

    logout();
  }

  function renderContent() {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome search={search} />;
      case 'generate':
        return <GenerateCertificate />;
      case 'history':
        return <HistoryTab />;
      case 'idcard':
        return <IDCardGenerator />;
      case 'profile':
        return <ProfileTab />;
      case 'contact':
        return <ContactDeveloper />;
      default:
        return <DashboardHome search={search} />;
    }
  }

  return (
    <div className="dashboard-layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="school-logo-thumb brand-mark">
              <img
                src="/logo.png"
                alt="SchoolPilot"
              />
            </div>

            {!sidebarCollapsed && (
              <div className="sidebar-brand-text">
                <div className="sidebar-brand-name">SchoolPilot</div>
                <div className="sidebar-brand-sub">School Operations</div>
              </div>
            )}
          </div>

          <button className="sidebar-toggle" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} type="button">
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="sidebar-school">
          <div className="sidebar-school-card">
            <div className="school-logo-thumb">
              {currentUser?.schoolLogo ? <img src={currentUser.schoolLogo} alt="" /> : initials}
            </div>

            {!sidebarCollapsed && (
              <div className="sidebar-school-info">
                <div className="sidebar-school-name">{currentUser?.schoolName || 'School Workspace'}</div>
                <div className="sidebar-school-loc">{currentUser?.location || 'Location not set'}</div>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {!sidebarCollapsed && <div className="nav-group-label">Workspace</div>}

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                type="button"
              >
                <Icon size={18} />
                {!sidebarCollapsed && (
                  <>
                    <span className="nav-item-label">{item.label}</span>
                    {item.id === 'generate' && <span className="nav-item-badge">Live</span>}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={() => setActiveTab('profile')} type="button">
            <Settings size={18} />
            {!sidebarCollapsed && <span className="nav-item-label">Settings</span>}
          </button>

          <button className="nav-item nav-item-danger" onClick={handleLogout} type="button">
            <LogOut size={18} />
            {!sidebarCollapsed && <span className="nav-item-label">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <header className="dash-topbar">
          <div className="dash-topbar-copy">
            <div className="dash-topbar-title">{currentTab.label}</div>
            <div className="dash-topbar-subtitle">
              {currentTab.description} - {todayLabel}
            </div>
          </div>

          <div className="dash-topbar-right">
            <div className="search-box no-print">
              <Search size={16} />
              <input
                className="form-input"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Quick search"
              />
            </div>

            <button className="icon-button" type="button" aria-label="Notifications">
              <Bell size={18} />
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">
                {currentUser?.schoolLogo ? <img src={currentUser.schoolLogo} alt="" /> : <User size={18} />}
              </div>

              <div className="topbar-user-copy">
                <div className="topbar-user-name">{currentUser?.adminName || 'Admin User'}</div>
                <div className="topbar-user-meta">
                  <span className="online-dot" />
                  Workspace active
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="content-area fade-in">{renderContent()}</section>
      </main>
    </div>
  );
}
