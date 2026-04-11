import React, { useMemo, useState } from 'react';
import { useStore, RESULT_TEMPLATES } from '../../store/useStore.js';
import Swal from 'sweetalert2';
import TemplatePicker from '../../components/TemplatePicker.jsx';
import { Eye, Printer, Search, Settings, Trash2 } from 'lucide-react';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

export default function HistoryTab() {
  const { currentUser, records, deleteRecord, updateRecord } = useStore();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [pickerRecordId, setPickerRecordId] = useState(null);

  const allRecords = useMemo(
    () => records.filter((item) => item.ownerEmail === currentUser?.email),
    [records, currentUser?.email]
  );

  const classes = [...new Set(allRecords.map((item) => item.className).filter(Boolean))].sort();

  const filtered = allRecords
    .filter((record) => {
      const byName = (record.studentName || '').toLowerCase().includes(search.toLowerCase());
      const byClass = !classFilter || record.className === classFilter;
      const byResult = !resultFilter || record.result === resultFilter;
      return byName && byClass && byResult;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function getTemplate(templateId) {
    return RESULT_TEMPLATES.find((item) => item.id === templateId) || RESULT_TEMPLATES[0];
  }

  async function handleDelete(record) {
    const result = await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'warning',
      title: 'Delete this record?',
      html: `<p style="margin:0;color:#475569">The saved record for <strong style="color:#0f172a">${
        record.studentName
      }</strong> will be removed permanently.</p>`,
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Delete Record',
    });

    if (!result.isConfirmed) return;

    await deleteRecord(record.id);
    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Record deleted',
      timer: 1200,
      showConfirmButton: false,
    });
  }

  async function handleTemplateSelect(recordId, templateId) {
    await updateRecord(recordId, { templateId });
    setPickerRecordId(null);
    localStorage.setItem('sp_preview_id', recordId);
    window.location.hash = '#preview';
  }

  return (
    <div>
      <div className="panel-header">
        <h2>History and print archive</h2>
        <p>Search saved records, reopen previews, change templates, or print again.</p>
      </div>

      <div className="history-toolbar">
        <div className="search-box search-box-wide">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by student name"
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="">All Classes</option>
          {classes.map((item) => (
            <option key={item} value={item}>
              Class {item}
            </option>
          ))}
        </select>

        <select className="form-select" value={resultFilter} onChange={(e) => setResultFilter(e.target.value)}>
          <option value="">All Results</option>
          <option value="PASS">Pass</option>
          <option value="FAIL">Fail</option>
        </select>
      </div>

      <div className="table-container fade-in">
        <div className="table-card-header">
          <div>
            <h3>Saved records</h3>
            <p>{filtered.length} record(s) match the current filters</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-title">No records match these filters</div>
            <p>Try another name, class, or result status.</p>
          </div>
        ) : (
          <table className="elite-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Result</th>
                <th>Template</th>
                <th>Percentage</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const template = getTemplate(record.templateId);

                return (
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
                      <div className="template-cell">
                        <span className="template-dot" style={{ background: template.swatch }} />
                        <span>{template.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-primary">{Number(record.percent || 0).toFixed(1)}%</div>
                      <div className="table-secondary">Grade {record.grade || '-'}</div>
                    </td>
                    <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setPickerRecordId(record.id)}
                          title="Change template"
                          type="button"
                        >
                          <Settings size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            localStorage.setItem('sp_preview_id', record.id);
                            window.location.hash = '#preview';
                          }}
                          title="Preview"
                          type="button"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            localStorage.setItem('sp_preview_id', record.id);
                            localStorage.setItem('sp_print_on_load', '1');
                            window.location.hash = '#preview';
                          }}
                          title="Print"
                          type="button"
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(record)}
                          title="Delete"
                          type="button"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {pickerRecordId && (
        <TemplatePicker
          recordId={pickerRecordId}
          onClose={() => setPickerRecordId(null)}
          onSelect={handleTemplateSelect}
        />
      )}
    </div>
  );
}
