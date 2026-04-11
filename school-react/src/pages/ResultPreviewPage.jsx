import React, { useEffect, useState } from 'react';
import { db } from '../store/db.js';
import Swal from 'sweetalert2';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

function escapeText(value) {
  return String(value || '');
}

function fmt(value) {
  return Number(value || 0).toFixed(2).replace(/\.00$/, '');
}

function buildResultHTML(record) {
  const schoolTitle = (record.schoolName || '').toUpperCase();
  const logoSrc = record.schoolLogo || '';
  const logoHTML = logoSrc
    ? `<img src="${logoSrc}" style="width:85px;height:85px;border-radius:12px;object-fit:cover;border:3px solid #fff;box-shadow:0 4px 15px rgba(0,0,0,0.1);" />`
    : `<div style="width:85px;height:85px;border-radius:12px;background:linear-gradient(135deg,#0f766e,#155e75);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:2rem;border:3px solid #fff;box-shadow:0 4px 15px rgba(0,0,0,0.1);">S</div>`;

  const marksRows = (record.subjectMarks || [])
    .map((item, index) => {
      const subjectName = item.subject || item.name || item.subjectName || 'N/A';
      return `
    <tr style="background:${index % 2 === 0 ? '#ffffff' : '#f9fafb'}">
      <td style="padding:14px 20px;text-align:left;border-bottom:1px solid #edf2f7;font-size:0.95rem;color:#1e293b;font-weight:500">${escapeText(subjectName)}</td>
      <td style="padding:14px 20px;text-align:center;font-weight:700;border-bottom:1px solid #edf2f7;font-size:1rem;color:#1e40af;background:${index % 2 === 0 ? '#f8faff' : '#f3f6ff'}">${fmt(item.marks)}</td>
    </tr>
  `;
    })
    .join('');

  const resultColor = record.result === 'PASS' ? '#059669' : '#dc2626';
  const borderColor =
    record.templateId === 'template-2'
      ? '#065f46'
      : record.templateId === 'template-3'
        ? '#1e1b4b'
        : record.templateId === 'template-4'
          ? '#831843'
          : record.templateId === 'template-5'
            ? '#1f2937'
            : '#1e3a8a';

  const headerBg =
    record.templateId === 'template-2'
      ? 'linear-gradient(135deg,#065f46,#059669)'
      : record.templateId === 'template-3'
        ? 'linear-gradient(135deg,#1e1b4b,#312e81)'
        : record.templateId === 'template-4'
          ? 'linear-gradient(135deg,#831843,#be185d)'
          : record.templateId === 'template-5'
            ? 'linear-gradient(135deg,#1f2937,#4b5563)'
            : 'linear-gradient(135deg,#1e3a8a,#3b82f6)';

  const accentColor =
    record.templateId === 'template-3'
      ? '#d97706'
      : record.templateId === 'template-4'
        ? '#db2777'
        : record.templateId === 'template-2'
          ? '#10b981'
          : '#6366f1';

  return `
<div id="certificate-print" style="
  width:210mm; height:296.5mm; background:white;
  border:16px solid ${borderColor}; padding:4px;
  box-sizing:border-box; font-family:'Manrope',sans-serif;
  position:relative; overflow:hidden;
">
  <div style="border:1px solid ${borderColor}44; height:100%; box-sizing:border-box;">
    <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-15deg);width:450px;height:450px;opacity:0.035;pointer-events:none;z-index:0">
       ${logoSrc ? `<img src="${logoSrc}" style="width:100%;height:100%;object-fit:contain" />` : ''}
    </div>

    <div style="position:relative;z-index:1;padding:32px 42px">
      <div style="background:${headerBg};border-radius:14px;padding:24px 28px;margin-bottom:24px;box-shadow:0 8px 24px rgba(0,0,0,0.1);color:white">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
          <div style="display:flex;align-items:center;gap:16px">
            ${logoHTML}
            <div>
              <h1 style="margin:0;font-size:2rem;font-weight:900;font-family:'DM Serif Display',serif;letter-spacing:-0.02em;line-height:1.1">${schoolTitle}</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.9);font-weight:500;font-size:0.875rem;display:flex;align-items:center;gap:6px">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                ${escapeText(record.location)}
              </p>
            </div>
          </div>
          <div style="text-align:right">
            <div style="background:rgba(255,255,255,0.15);backdrop-filter:blur(5px);padding:4px 14px;border-radius:6px;font-weight:800;font-size:0.75rem;letter-spacing:0.1em;border:1px solid rgba(255,255,255,0.2)">${escapeText(record.examType || 'ANNUAL EXAMINATION')}</div>
            <div style="margin-top:10px;font-weight:700;color:rgba(255,255,255,0.7);font-size:0.75rem">CERTIFICATE ID: ${String(record.id).slice(-10).toUpperCase()}</div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.2);font-size:0.875rem">
          <div><strong style="color:rgba(255,255,255,0.7);text-transform:uppercase;font-size:0.65rem;display:block;margin-bottom:2px">Principal</strong> ${escapeText(record.principalName)}</div>
          <div><strong style="color:rgba(255,255,255,0.7);text-transform:uppercase;font-size:0.65rem;display:block;margin-bottom:2px">Session Period</strong> ${escapeText(record.session)}</div>
          <div style="text-align:right"><strong style="color:rgba(255,255,255,0.7);text-transform:uppercase;font-size:0.65rem;display:block;margin-bottom:2px">Contact Details</strong> ${escapeText(record.schoolMobile)}</div>
        </div>
      </div>

      <div style="text-align:center;margin-bottom:24px">
        <h2 style="font-family:'DM Serif Display',serif;color:${borderColor};font-size:1.6rem;margin:0;font-style:italic">Achievement and Evaluation Certificate</h2>
        <div style="width:50px;height:3px;background:${accentColor};margin:10px auto"></div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(2, 1fr);gap:14px;margin-bottom:24px">
        <div style="background:#f8faff;border-left:4px solid ${borderColor};padding:16px 20px;border-radius:0 12px 12px 0">
           <div style="margin-bottom:8px">
             <span style="font-size:0.68rem;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:0.05em">Student Full Name</span>
             <div style="font-size:1.1rem;font-weight:800;color:#1e293b;margin-top:1px">${escapeText(record.studentName)}</div>
           </div>
           <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
             <div>
               <span style="font-size:0.65rem;font-weight:800;color:#64748b;text-transform:uppercase">Father's Name</span>
               <div style="font-size:0.9rem;font-weight:600;color:#1e293b">${escapeText(record.fatherName)}</div>
             </div>
             <div>
               <span style="font-size:0.65rem;font-weight:800;color:#64748b;text-transform:uppercase">Mother's Name</span>
               <div style="font-size:0.9rem;font-weight:600;color:#1e293b">${escapeText(record.motherName || 'N/A')}</div>
             </div>
           </div>
        </div>
        <div style="background:#f8faff;border-left:4px solid ${accentColor};padding:20px;border-radius:0 12px 12px 0;display:grid;grid-template-columns:1fr 1fr;gap:12px;align-content:center">
           <div>
             <span style="font-size:0.65rem;font-weight:800;color:#64748b;text-transform:uppercase">Enrolled Class</span>
             <div style="font-size:1rem;font-weight:700;color:#1e293b">${escapeText(record.className)}</div>
           </div>
           <div>
             <span style="font-size:0.65rem;font-weight:800;color:#64748b;text-transform:uppercase">Roll Number</span>
             <div style="font-size:1rem;font-weight:700;color:#1e293b">${escapeText(record.rollNumber)}</div>
           </div>
           <div>
             <span style="font-size:0.65rem;font-weight:800;color:#64748b;text-transform:uppercase">Session</span>
             <div style="font-size:1rem;font-weight:700;color:#1e293b">${escapeText(record.session)}</div>
           </div>
           <div>
             <span style="font-size:0.65rem;font-weight:800;color:#64748b;text-transform:uppercase">Result Date</span>
             <div style="font-size:1rem;font-weight:700;color:#1e293b">${new Date(record.createdAt).toLocaleDateString()}</div>
           </div>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;border-radius:12px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.05);border:1px solid #edf2f7">
        <thead>
          <tr style="background:${headerBg};color:white">
            <th style="padding:14px 20px;text-align:left;font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em">Subject Information</th>
            <th style="padding:14px 20px;text-align:center;font-size:0.8rem;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;width:140px">Marks Scored</th>
          </tr>
        </thead>
        <tbody>
          ${marksRows}
        </tbody>
      </table>

      <div style="display:flex;gap:16px;margin-bottom:28px">
        <div style="flex:2.2;background:linear-gradient(to right,#f8fafc,#ffffff);border:1px solid #e2e8f0;border-radius:14px;padding:18px 24px;display:grid;grid-template-columns:repeat(4, 1fr);gap:16px;position:relative">
          ${[
            ['Grand Total', fmt(record.totalMax), '#64748b'],
            ['Total Obtained', fmt(record.obtained), borderColor],
            ['Percentage (%)', `${Number(record.percent || 0).toFixed(1)}%`, accentColor],
            ['Final Grade', record.grade, '#b45309'],
          ]
            .map(
              ([label, value, color]) => `
            <div style="text-align:center">
              <div style="font-size:0.62rem;color:#94a3b8;font-weight:800;text-transform:uppercase;margin-bottom:6px;letter-spacing:0.05em">${label}</div>
              <div style="font-size:1.35rem;font-weight:900;color:${color}">${escapeText(value)}</div>
            </div>
          `
            )
            .join('')}
        </div>

        <div style="flex:0.8;background:${resultColor};border-radius:14px;padding:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:white;text-align:center;box-shadow:0 8px 16px ${resultColor}33">
          <div style="font-size:0.65rem;text-transform:uppercase;font-weight:800;margin-bottom:2px;opacity:0.9;letter-spacing:0.1em">Decision</div>
          <div style="font-size:2.4rem;font-weight:900;font-family:'DM Serif Display',serif;line-height:1;margin:2px 0">${record.result}</div>
        </div>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:20px">
        <div style="text-align:left">
          <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:6px">Verification Signature</div>
          <div style="width:180px;height:40px;border-bottom:2px solid #e2e8f0"></div>
          <div style="font-size:0.7rem;font-weight:700;color:#64748b;margin-top:8px;text-transform:uppercase">Authorized Controller</div>
        </div>

        <div style="text-align:center;background:#fff;padding:8px;border:1px dashed #cbd5e1;border-radius:8px">
          <div style="font-size:0.6rem;color:#94a3b8;margin-bottom:4px">OFFICIAL SEAL</div>
          <div style="width:60px;height:60px;border:2px solid #e2e8f0;border-radius:50%;margin:0 auto"></div>
        </div>

        <div style="text-align:right">
          <div style="font-size:0.75rem;color:#94a3b8;margin-bottom:6px">Principal Endorsement</div>
          <div style="width:180px;height:40px;border-bottom:2px solid ${borderColor}"></div>
          <div style="font-size:0.7rem;font-weight:700;color:#1e3a8a;margin-top:8px;text-transform:uppercase">${escapeText(record.principalName)}</div>
        </div>
      </div>

      <div style="position:absolute;bottom:20px;left:0;right:0;text-align:center;font-size:0.65rem;color:#cbd5e1;text-transform:uppercase;letter-spacing:0.15em">
        SchoolPilot verified digital transcript
      </div>
    </div>
  </div>
</div>
  `;
}

export default function ResultPreviewPage() {
  const [record, setRecord] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const recordId = localStorage.getItem('sp_preview_id');
    const sessionStr = localStorage.getItem('schoolpilot_session');
    const shouldPrint = localStorage.getItem('sp_print_on_load') === '1';

    if (!recordId) {
      setError('No record ID found.');
      return;
    }

    if (!sessionStr) {
      setError('Session expired. Please log in again.');
      return;
    }

    const session = JSON.parse(sessionStr);

    async function fetchRecord() {
      try {
        let found = await db.records.get(recordId);

        if (!found && !isNaN(Number(recordId))) {
          found = await db.records.get(Number(recordId));
        }

        if (!found || found.ownerEmail !== session.email) {
          setError('Result record not found or access denied.');
          return;
        }

        setRecord(found);

        if (shouldPrint) {
          localStorage.removeItem('sp_print_on_load');
          setTimeout(() => window.print(), 800);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Database error: ' + err.message);
      }
    }

    fetchRecord();
  }, []);

  async function handleDownloadPDF() {
    const element = document.getElementById('certificate-print');

    if (!element) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Preview unavailable',
        text: 'Certificate element not found. Please refresh.',
      });
      return;
    }

    const safeName = (record.studentName || 'Student').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const button = document.getElementById('pdfBtn');
    if (button) button.textContent = 'Preparing PDF...';
    setLoading(true);

    try {
      await new Promise((resolve, reject) => {
        if (window.html2canvas && window.jspdf) {
          resolve();
          return;
        }

        const scriptOne = document.createElement('script');
        scriptOne.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        const scriptTwo = document.createElement('script');
        scriptTwo.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

        let loaded = 0;
        const check = () => {
          loaded += 1;
          if (loaded === 2) resolve();
        };

        scriptOne.onload = check;
        scriptOne.onerror = reject;
        scriptTwo.onload = check;
        scriptTwo.onerror = reject;
        document.head.appendChild(scriptOne);
        document.head.appendChild(scriptTwo);
      });

      if (button) button.textContent = 'Capturing...';
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
      });

      if (button) button.textContent = 'Formatting...';
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${safeName}_result.pdf`);
    } catch (err) {
      console.error('Manual PDF error:', err);
      window.print();
    } finally {
      setLoading(false);
      if (button) button.textContent = 'Download PDF';
    }
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f7f8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'white', borderRadius: 24, padding: '42px 48px', textAlign: 'center', boxShadow: '0 20px 50px rgba(15,23,42,0.08)', border: '1px solid #dce6eb' }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 16px', borderRadius: 20, background: 'rgba(220,38,38,0.08)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>!</div>
          <h2 style={{ color: '#0f172a', marginBottom: 8, fontFamily: 'Fraunces, serif' }}>Unable to open preview</h2>
          <p style={{ color: '#64748b', marginBottom: 24 }}>{error}</p>
          <button onClick={() => window.close()} style={{ background: 'linear-gradient(135deg,#0f766e,#155e75)', color: 'white', border: 'none', borderRadius: 999, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  if (!record) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f7f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 18, background: 'rgba(15,118,110,0.08)', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>SP</div>
          <p style={{ color: '#64748b' }}>Loading record preview...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        body {
          margin: 0;
          padding: 0;
          background:
            radial-gradient(circle at top left, rgba(15,118,110,0.1), transparent 28%),
            linear-gradient(180deg, #fbfcfd 0%, #f2f5f7 100%);
          font-family: 'Manrope', sans-serif;
        }
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-wrap { margin: 0 !important; padding: 0 !important; }
          #certificate-print {
            width: 210mm !important;
            margin: 0 auto !important;
            box-shadow: none !important;
            page-break-after: always;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 28px',
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #dce6eb',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 12px 28px rgba(15,23,42,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="/logo.png"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              objectFit: 'contain',
              padding: 6,
              background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(21,94,117,0.08))',
            }}
            alt="SchoolPilot"
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Result Preview Workspace</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {record.studentName} - {record.examType || 'Result Certificate'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => (window.location.hash = '#')}
            style={{
              background: '#f8fbfc',
              color: '#0f172a',
              border: '1px solid #dce6eb',
              borderRadius: 999,
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.875rem',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Dashboard
          </button>
          <button
            id="pdfBtn"
            disabled={loading}
            onClick={handleDownloadPDF}
            style={{
              background: '#f8fbfc',
              border: '1px solid #dce6eb',
              borderRadius: 999,
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: '#0f172a',
            }}
          >
            {loading ? 'Generating...' : 'Download PDF'}
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(135deg,#0f766e,#155e75)',
              color: 'white',
              border: 'none',
              borderRadius: 999,
              padding: '10px 24px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Print A4
          </button>
        </div>
      </div>

      <div className="print-wrap" style={{ maxWidth: 980, margin: '40px auto', padding: '0 20px 60px' }}>
        <div dangerouslySetInnerHTML={{ __html: buildResultHTML(record) }} />
      </div>
    </>
  );
}
