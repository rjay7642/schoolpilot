import React, { useEffect, useMemo, useRef } from 'react';
import { useStore } from '../../store/useStore.js';
import {
  Calendar,
  CreditCard,
  FileText,
  History,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

function animateStat(el, target) {
  if (!el) return;
  const start = performance.now();
  const duration = 700;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    el.textContent = String(target);
  };

  requestAnimationFrame(tick);
}

const quickActions = [
  {
    tab: 'generate',
    title: 'Result Studio',
    desc: 'Generate new result certificates with live marks calculation.',
    icon: FileText,
  },
  {
    tab: 'idcard',
    title: 'ID Card Desk',
    desc: 'Prepare student ID cards and open the print view in one flow.',
    icon: CreditCard,
  },
  {
    tab: 'history',
    title: 'Archive History',
    desc: 'Search older records, switch templates, and print again.',
    icon: History,
  },
];

export default function DashboardHome({ search = '' }) {
  const { currentUser, records, setActiveTab } = useStore();
  const totalRef = useRef(null);
  const todayRef = useRef(null);
  const passRef = useRef(null);
  const failRef = useRef(null);

  const allRecords = useMemo(
    () => records.filter((item) => item.ownerEmail === currentUser?.email),
    [records, currentUser?.email]
  );

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allRecords;
    return allRecords.filter(
      (item) =>
        (item.studentName || '').toLowerCase().includes(term) ||
        (item.className || '').toLowerCase().includes(term) ||
        (item.rollNumber || '').toLowerCase().includes(term)
    );
  }, [allRecords, search]);

  const today = new Date().toDateString();
  const todayCount = allRecords.filter((item) => new Date(item.createdAt).toDateString() === today).length;
  const passCount = allRecords.filter((item) => item.result === 'PASS').length;
  const failCount = allRecords.filter((item) => item.result === 'FAIL').length;
  const passRate = allRecords.length ? ((passCount / allRecords.length) * 100).toFixed(1) : '0.0';
  const initials = (currentUser?.schoolName || 'SP')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  useEffect(() => {
    animateStat(totalRef.current, allRecords.length);
    animateStat(todayRef.current, todayCount);
    animateStat(passRef.current, passCount);
    animateStat(failRef.current, failCount);
  }, [allRecords.length, todayCount, passCount, failCount]);

  return (
    <div>
      <div className="welcome-banner">
        <div className="welcome-banner-copy">
          <div className="section-kicker">School workspace</div>
          <h1>{currentUser?.schoolName || 'School Dashboard'}</h1>
          <p>
            Manage result generation, archive review, and ID card printing from one clean dashboard.
          </p>
        </div>

        <div className="welcome-banner-summary">
          <div className="school-logo-thumb large">
            {currentUser?.schoolLogo ? <img src={currentUser.schoolLogo} alt="" /> : initials}
          </div>
          <div>
            <div className="summary-label">Current pass rate</div>
            <div className="summary-value">{passRate}%</div>
            <div className="summary-note">
              {currentUser?.location || 'Location not set'} - {currentUser?.adminName || 'Administrator'}
            </div>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon soft-teal">
            <FileText size={20} />
          </div>
          <div>
            <div className="stat-value" ref={totalRef}>
              0
            </div>
            <div className="stat-label">Total records</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon soft-blue">
            <Calendar size={20} />
          </div>
          <div>
            <div className="stat-value" ref={todayRef}>
              0
            </div>
            <div className="stat-label">Created today</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon soft-green">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value" ref={passRef}>
              0
            </div>
            <div className="stat-label">Passed students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon soft-amber">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="stat-value" ref={failRef}>
              0
            </div>
            <div className="stat-label">Need attention</div>
          </div>
        </div>
      </div>

      <div className="panel-header">
        <h2>Quick actions</h2>
        <p>Open the module you need without leaving the main dashboard flow.</p>
      </div>

      <div className="quick-grid">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.tab}
              className="card quick-action-card"
              onClick={() => setActiveTab(item.tab)}
              type="button"
            >
              <div className="quick-action-icon">
                <Icon size={20} />
              </div>
              <div className="quick-action-title">{item.title}</div>
              <div className="quick-action-desc">{item.desc}</div>
              <div className="quick-action-link">Open module</div>
            </button>
          );
        })}
      </div>

      <div className="table-container fade-in">
        <div className="table-card-header">
          <div>
            <h3>Recent student records</h3>
            <p>
              {search ? `Showing matches for "${search}"` : 'Latest saved records from this school workspace'}
            </p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('history')} type="button">
            Open History
          </button>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No records found</div>
            <p>
              {search
                ? 'Try another search term or open the history page for more filters.'
                : 'Generate your first result certificate to start building the archive.'}
            </p>
          </div>
        ) : (
          <table className="elite-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Status</th>
                <th>Percentage</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 6)
                .map((record) => (
                  <tr key={record.id}>
                    <td>
                      <div className="table-primary">{record.studentName}</div>
                      <div className="table-secondary">
                        Class {record.className || '-'} - Roll {record.rollNumber || '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${record.result === 'PASS' ? 'badge-green' : 'badge-red'}`}>
                        {record.result}
                      </span>
                    </td>
                    <td>
                      <div className="table-primary">{Number(record.percent || 0).toFixed(1)}%</div>
                      <div className="table-secondary">Grade {record.grade || '-'}</div>
                    </td>
                    <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          localStorage.setItem('sp_preview_id', record.id);
                          window.open(`${window.location.pathname}#preview`, '_blank');
                        }}
                        type="button"
                      >
                        Preview
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
