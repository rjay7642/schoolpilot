import React, { useEffect, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import Swal from 'sweetalert2';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

function IDCardFaceHTML({ data, type, innerRef }) {
  const photo =
    data.studentPhoto ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.studentName || 'student')}`;

  const schoolName = data.schoolName || data.name || 'School Name';
  const schoolLogo = data.schoolLogo || data.logo || '';
  const schoolLocation = data.schoolLocation || data.location || 'Campus';
  const principal = data.principal || 'Principal';
  const schoolMobile = data.schoolMobile || data.mobile || 'N/A';
  const isFront = type === 'front';

  const backItems = [
    { short: 'P', label: 'Parent Name', value: data.fatherName },
    { short: 'D', label: 'Date of Birth', value: data.dob },
    { short: 'B', label: 'Blood Group', value: data.bloodGroup },
    { short: 'C', label: 'Contact No', value: data.phone },
    { short: 'A', label: 'Address', value: data.address },
  ];

  return (
    <div className={`crystal-id-face ${isFront ? 'front-face' : 'back-face'}`} ref={innerRef}>
      <div className="crystal-pattern" />
      <div className="crystal-watermark">
        <img src={schoolLogo} alt="" onError={(e) => (e.target.style.display = 'none')} />
      </div>

      {isFront ? (
        <>
          <div className="crystal-header">
            <div className="crystal-logo-box">
              <img src={schoolLogo} alt="" onError={(e) => (e.target.style.display = 'none')} />
            </div>
            <div className="crystal-school-info">
              <div className="school-name">{schoolName.toUpperCase()}</div>
              <div className="school-loc">{schoolLocation}</div>
            </div>
          </div>

          <div className="crystal-profile">
            <div className="crystal-photo-ring">
              <div className="crystal-photo-inner">
                <img src={photo} alt="" />
              </div>
            </div>
            <div className="crystal-name-area">
              <div className="student-name">{data.studentName || 'Student Name'}</div>
              <div className="student-tag">Student ID</div>
            </div>
          </div>

          <div className="crystal-details-area">
            <div className="crystal-details-grid">
              <div className="field">
                <label>Admission No</label>
                <span className="val">{data.admissionNo || 'ADM-001'}</span>
              </div>
              <div className="field border-l">
                <label>Roll No</label>
                <span className="val">{data.rollNo || '01'}</span>
              </div>
              <div className="field full">
                <label>Class & Section</label>
                <span className="val">{data.classSection || 'Class - Section'}</span>
              </div>
            </div>
          </div>

          <div className="crystal-footer">
            <div className="validity">
              Session: <strong>{data.validity || '2025-26'}</strong>
            </div>
            <div className="sig-wrap">
              <div className="sig-line" />
              <div className="sig-label">Registrar</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="crystal-back-header">
            <h3>School Protocol</h3>
            <span className="protocol-code">SP-ID-2.0</span>
          </div>

          <div className="crystal-back-content">
            {backItems.map((item) => (
              <div key={item.label} className="info-item">
                <div className="info-icon">{item.short}</div>
                <div className="info-pair">
                  <label>{item.label}</label>
                  <div className="info-val">{item.value || '-'}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="crystal-back-footer">
            <div className="auth-section">
              <div className="auth-box">
                <div className="sig-line" />
                <div className="auth-name">{principal}</div>
                <div className="auth-title">Principal</div>
              </div>
              <div className="return-side-note">
                If found, please return to the school office.
                <strong> Call: {schoolMobile}</strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function IDPrintPage() {
  const [data, setData] = useState(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem('sp_id_card_data');
    if (!raw) return;

    try {
      setData(JSON.parse(raw));
    } catch {
      setData(null);
    }
  }, []);

  async function handleDownloadHQ() {
    if (!frontRef.current || !backRef.current) return;

    Swal.fire({
      ...SWAL_LIGHT,
      title: 'Preparing print sheet',
      text: 'Rendering both sides at high quality.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const frontDataUrl = await toPng(frontRef.current, { pixelRatio: 4 });
      const backDataUrl = await toPng(backRef.current, { pixelRatio: 4 });

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(8);
      pdf.text('SchoolPilot Identity Sheet', 105, 10, { align: 'center' });
      pdf.addImage(frontDataUrl, 'PNG', 20, 30, 72, 112);
      pdf.addImage(backDataUrl, 'PNG', 105, 30, 72, 112);
      pdf.save(`ID_Card_${data.studentName || 'Student'}.pdf`);

      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'success',
        title: 'PDF ready',
        text: 'The identity sheet has been exported.',
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Export failed',
        text: 'Please try again or use the browser print option.',
      });
    }
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f7f8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 14px', borderRadius: 18, background: 'rgba(15,118,110,0.08)', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>SP</div>
          <p style={{ color: '#64748b' }}>Loading ID print view...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Manrope', sans-serif;
          background:
            radial-gradient(circle at top left, rgba(15,118,110,0.1), transparent 28%),
            linear-gradient(180deg, #fbfcfd 0%, #f2f5f7 100%);
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .print-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 28px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #dce6eb;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 12px 28px rgba(15,23,42,0.06);
        }

        .crystal-id-face {
          width: 72mm;
          height: 112mm;
          background: #ffffff !important;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 5mm;
          border: 0.15mm solid #cbd5e1;
          box-shadow: 0 16px 40px rgba(15,23,42,0.14);
        }

        .crystal-pattern { position: absolute; inset: 0; opacity: 0.05; background-image: radial-gradient(#0f766e 0.4mm, transparent 0.4mm) !important; background-size: 5mm 5mm; z-index: 0; }
        .crystal-watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; opacity: 0.06; pointer-events: none; }
        .crystal-watermark img { width: 50mm; height: 50mm; object-fit: contain; filter: grayscale(1); }

        .crystal-header { position: relative; z-index: 5; padding: 3mm 4mm; background: linear-gradient(135deg, #eff8f6, #eef5ff) !important; border-bottom: 0.5mm solid #0f766e; display: flex; gap: 3.5mm; align-items: center; }
        .crystal-logo-box { width: 10mm; height: 10mm; background: #fff !important; border-radius: 2.5mm; display: flex; align-items: center; justify-content: center; border: 0.3mm solid #0f766e; flex-shrink: 0; }
        .crystal-logo-box img { width: 8.5mm; height: 8.5mm; object-fit: contain; }
        .school-name { font-weight: 900; font-size: 9.3pt; color: #000 !important; line-height: 1.1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .school-loc { font-size: 6pt; color: #475569 !important; font-weight: 800; text-transform: uppercase; margin-top: 0.5mm; letter-spacing: 0.08em; }

        .crystal-profile { position: relative; z-index: 5; padding: 2mm 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .crystal-photo-ring { width: 32mm; height: 32mm; border-radius: 50%; padding: 0.6mm; background: #fff !important; border: 0.4mm dashed #0f766e; margin-bottom: 2mm; }
        .crystal-photo-inner { width: 100%; height: 100%; border-radius: 50%; background: #f1f5f9 !important; overflow: hidden; border: 1.2mm solid #fff; }
        .crystal-photo-inner img { width: 100%; height: 100%; object-fit: cover; }
        .student-name { font-weight: 900; font-size: 14pt; color: #000 !important; line-height: 1.1; text-align: center; width: 100%; padding: 0 4mm; }
        .student-tag { display: inline-block; font-size: 7.2pt; color: #fff !important; background: linear-gradient(135deg, #0f766e, #155e75) !important; padding: 0.8mm 4mm; border-radius: 6mm; font-weight: 700; text-transform: uppercase; margin-top: 1.5mm; }

        .crystal-details-area { padding: 1.5mm 4.5mm; }
        .crystal-details-grid { background: #f8fafc !important; border-radius: 3.5mm; padding: 3.5mm; border: 0.35mm solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; }
        .field { padding: 1mm 2.5mm; }
        .field.border-l { border-left: 0.3mm solid #e2e8f0; }
        .field label { font-size: 5.5pt; color: #64748b !important; font-weight: 900; text-transform: uppercase; margin-bottom: 0.2mm; display: block; }
        .field .val { font-size: 10pt; color: #000 !important; font-weight: 850; display: block; }
        .field.full { grid-column: 1/-1; border-top: 0.15mm solid #eef2f6; padding-top: 1.5mm; margin-top: 1mm; }

        .crystal-footer { position: relative; z-index: 5; padding: 2.5mm 4.5mm 4mm; background: #fff !important; border-top: 0.2mm solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-end; }
        .validity { font-size: 8pt; color: #64748b !important; }
        .validity strong { color: #0f766e !important; }
        .sig-wrap { text-align: right; }
        .sig-line { width: 18mm; height: 0.4mm; background: #000 !important; margin-bottom: 1.2mm; margin-left: auto; }
        .sig-label { font-size: 6pt; color: #64748b !important; font-weight: 850; letter-spacing: 0.05em; }

        .crystal-back-header { padding: 4mm; background: linear-gradient(135deg, #eff8f6, #eef5ff) !important; border-bottom: 0.5mm solid #0f766e; display: flex; justify-content: space-between; align-items: center; }
        .crystal-back-header h3 { font-size: 9.5pt; margin: 0; font-weight: 900; color: #000; }
        .protocol-code { font-size: 7.2pt; font-weight: 800; color: #475569; }
        .crystal-back-content { flex: 1; padding: 5mm 4mm; display: flex; flex-direction: column; gap: 3.5mm; }
        .info-item { display: flex; align-items: flex-start; gap: 4mm; }
        .info-icon { width: 8.5mm; height: 8.5mm; border-radius: 2.5mm; background: #edf7f4 !important; color: #0f766e; display: flex; align-items: center; justify-content: center; font-size: 7pt; font-weight: 800; flex-shrink: 0; }
        .info-pair label { font-size: 6pt; color: #64748b !important; font-weight: 900; text-transform: uppercase; display: block; margin-bottom: 0.4mm; }
        .info-val { font-size: 9.5pt; font-weight: 700; color: #000 !important; line-height: 1.2; }

        .crystal-back-footer { padding: 5mm; background: #f8fafc !important; border-top: 0.2mm solid #e2e8f0; }
        .auth-section { display: flex; justify-content: space-between; align-items: flex-end; gap: 4mm; }
        .auth-box .sig-line { width: 28mm; height: 0.5mm; background: #000 !important; margin-bottom: 1.2mm; }
        .auth-name { font-size: 9pt; font-weight: 800; color: #000 !important; text-transform: uppercase; }
        .auth-title { font-size: 6pt; font-weight: 900; color: #64748b !important; margin-top: 0.5mm; }
        .return-side-note { max-width: 32mm; font-size: 5.5pt; color: #64748b !important; font-weight: 800; text-align: right; line-height: 1.3; }
        .return-side-note strong { color: #0f172a; }

        @media print {
          body { background: white !important; }
          .print-navbar { display: none !important; }
          .print-view { display: block !important; width: 100%; text-align: center; padding-top: 30mm; }
          .crystal-id-face {
            display: inline-block !important;
            vertical-align: top;
            margin: 6mm;
            box-shadow: none !important;
            border: 0.2mm solid #e2e8f0;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      <div className="print-navbar no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img
            src="logo.png"
            alt="SchoolPilot"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              objectFit: 'contain',
              padding: 6,
              background: 'linear-gradient(135deg, rgba(15,118,110,0.08), rgba(21,94,117,0.08))',
            }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>ID Card Print Workspace</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Front and back sheet for {data.studentName || 'Student'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.location.hash = '#'}
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
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5m7-7l-7 7 7 7" />
            </svg>
            Dashboard
          </button>
          <button
            onClick={handleDownloadHQ}
            style={{
              background: '#f8fbfc',
              color: '#0f172a',
              border: '1px solid #dce6eb',
              borderRadius: 999,
              padding: '10px 18px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(135deg,#0f766e,#155e75)',
              color: 'white',
              border: 'none',
              borderRadius: 999,
              padding: '10px 22px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Print
          </button>
        </div>
      </div>

      <div className="preview-view" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 40, fontStyle: 'italic' }}>
          Side-by-side A4 preview for final print review
        </p>
        <div style={{ display: 'inline-flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
          <IDCardFaceHTML data={data} type="front" innerRef={frontRef} />
          <IDCardFaceHTML data={data} type="back" innerRef={backRef} />
        </div>
      </div>

      <div className="print-view" style={{ display: 'none' }}>
        <IDCardFaceHTML data={data} type="front" />
        <IDCardFaceHTML data={data} type="back" />
      </div>
    </>
  );
}
