import React, { useState } from 'react';
import { useStore } from '../../store/useStore.js';
import { ChevronRight, CreditCard, Printer } from 'lucide-react';

function IDCardFront({ data, schoolName, schoolLogo, schoolLocation }) {
  const photo =
    data.studentPhoto ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.studentName || 'student')}`;

  return (
    <div className="crystal-id-face">
      <div className="crystal-pattern" />
      <div className="crystal-watermark">
        <img src={schoolLogo} alt="" onError={(e) => (e.target.style.display = 'none')} />
      </div>

      <div className="crystal-header">
        <div className="crystal-logo-box">
          <img src={schoolLogo || ''} alt="" onError={(e) => (e.target.style.display = 'none')} />
        </div>
        <div className="crystal-school-info">
          <div className="school-name">{(schoolName || 'School Name').toUpperCase()}</div>
          <div className="school-loc">{schoolLocation || 'School campus'}</div>
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
    </div>
  );
}

function IDCardBack({ data, schoolLogo, schoolMobile, principalName }) {
  const detailItems = [
    { short: 'P', label: 'Parent Name', value: data.fatherName },
    { short: 'D', label: 'Date of Birth', value: data.dob },
    { short: 'B', label: 'Blood Group', value: data.bloodGroup },
    { short: 'C', label: 'Contact No', value: data.phone },
    { short: 'A', label: 'Address', value: data.address },
  ];

  return (
    <div className="crystal-id-face">
      <div className="crystal-pattern" />
      <div className="crystal-watermark">
        <img src={schoolLogo} alt="" onError={(e) => (e.target.style.display = 'none')} />
      </div>

      <div className="crystal-back-header">
        <h3>School Protocol</h3>
        <span className="protocol-code">SP-ID-2.0</span>
      </div>

      <div className="crystal-back-content">
        {detailItems.map((item) => (
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
            <div className="auth-name">{principalName || 'Principal'}</div>
            <div className="auth-title">Principal</div>
          </div>
          <div className="return-side-note">
            If found, please return to the school office.
            <strong> Call: {schoolMobile || 'N/A'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function IDCardGenerator() {
  const { currentUser } = useStore();
  const [formData, setFormData] = useState({
    studentName: '',
    admissionNo: '',
    rollNo: '',
    classSection: '',
    validity: '2025-26',
    fatherName: '',
    dob: '',
    bloodGroup: '',
    phone: '',
    address: '',
    studentPhoto: '',
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, studentPhoto: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function handlePrint() {
    const printData = {
      ...formData,
      schoolName: currentUser?.schoolName || currentUser?.name,
      schoolLogo: currentUser?.schoolLogo || currentUser?.logo,
      schoolLocation: currentUser?.location,
      schoolMobile: currentUser?.schoolMobile || currentUser?.mobile,
      principal: currentUser?.principalName || 'Principal',
    };

    localStorage.setItem('sp_id_card_data', JSON.stringify(printData));
    window.location.hash = '#id-print';
  }

  return (
    <div className="id-workspace">
      <style>{`
        .crystal-id-face {
          width: 320px;
          height: 500px;
          background: #ffffff !important;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-radius: 24px;
          border: 1px solid #dbe4ea;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.12);
          transform-origin: top left;
        }

        .crystal-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: radial-gradient(#0f766e 1px, transparent 1px);
          background-size: 15px 15px;
          z-index: 0;
        }

        .crystal-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          opacity: 0.05;
          pointer-events: none;
        }

        .crystal-watermark img {
          width: 220px;
          height: 220px;
          object-fit: contain;
          filter: grayscale(1);
        }

        .crystal-header {
          position: relative;
          z-index: 5;
          padding: 16px 18px;
          background: linear-gradient(135deg, #eff8f6, #eef5ff) !important;
          border-bottom: 1px solid #cfe5df;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .crystal-logo-box {
          width: 44px;
          height: 44px;
          background: #fff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #b9d6d0;
          flex-shrink: 0;
        }

        .crystal-logo-box img {
          width: 34px;
          height: 34px;
          object-fit: contain;
        }

        .school-name {
          font-weight: 800;
          font-size: 0.85rem;
          color: #0f172a !important;
          line-height: 1.1;
        }

        .school-loc {
          font-size: 0.62rem;
          color: #475569;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 4px;
        }

        .crystal-profile {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px 0;
        }

        .crystal-photo-ring {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          padding: 4px;
          background: #fff;
          border: 2px dashed #0f766e;
          margin-bottom: 12px;
        }

        .crystal-photo-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #f8fafc;
          overflow: hidden;
          border: 5px solid #fff;
        }

        .crystal-photo-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .crystal-name-area {
          text-align: center;
          width: 100%;
          padding: 0 18px;
          margin-bottom: 8px;
        }

        .student-name {
          font-weight: 900;
          font-size: 1.2rem;
          color: #0f172a !important;
          line-height: 1.2;
        }

        .student-tag {
          display: inline-block;
          font-size: 0.65rem;
          color: #ffffff;
          background: linear-gradient(135deg, #0f766e, #155e75);
          padding: 5px 18px;
          border-radius: 999px;
          font-weight: 700;
          text-transform: uppercase;
          margin-top: 8px;
        }

        .crystal-details-area {
          padding: 10px 18px;
        }

        .crystal-details-grid {
          background: #f8fafc;
          border-radius: 18px;
          padding: 12px;
          border: 1px solid #e2e8f0;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .field {
          padding: 6px 8px;
        }

        .field.border-l {
          border-left: 1px solid #e2e8f0;
        }

        .field label {
          font-size: 0.55rem;
          color: #64748b;
          font-weight: 800;
          text-transform: uppercase;
          display: block;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .field .val {
          font-size: 0.85rem;
          color: #0f172a !important;
          font-weight: 800;
          display: block;
        }

        .field.full {
          grid-column: 1 / -1;
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          margin-top: 6px;
        }

        .crystal-footer {
          position: relative;
          z-index: 5;
          padding: 10px 18px 16px;
          background: #fff;
          border-top: 1px solid #edf2f7;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .validity {
          font-size: 0.75rem;
          color: #64748b;
        }

        .validity strong {
          color: #0f766e;
        }

        .sig-line {
          width: 68px;
          height: 1.5px;
          background: #0f172a;
          margin-bottom: 4px;
          margin-left: auto;
        }

        .sig-label {
          font-size: 0.55rem;
          color: #64748b;
          font-weight: 800;
          text-align: right;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .crystal-back-header {
          padding: 16px 18px;
          background: linear-gradient(135deg, #eff8f6, #eef5ff);
          border-bottom: 1px solid #cfe5df;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .crystal-back-header h3 {
          font-size: 0.88rem;
          margin: 0;
          font-weight: 900;
          color: #0f172a;
        }

        .protocol-code {
          font-size: 0.7rem;
          font-weight: 800;
          color: #475569;
          letter-spacing: 0.08em;
        }

        .crystal-back-content {
          flex: 1;
          padding: 20px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .info-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          background: #edf7f4;
          color: #0f766e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
        }

        .info-pair label {
          font-size: 0.55rem;
          color: #64748b;
          font-weight: 900;
          text-transform: uppercase;
          display: block;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }

        .info-val {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        }

        .crystal-back-footer {
          padding: 18px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .auth-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
        }

        .auth-box .sig-line {
          width: 110px;
          height: 1.5px;
          background: #0f172a;
          margin-bottom: 4px;
        }

        .auth-name {
          font-size: 0.8rem;
          font-weight: 900;
          color: #0f172a;
          text-transform: uppercase;
        }

        .auth-title {
          font-size: 0.55rem;
          font-weight: 900;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .return-side-note {
          max-width: 120px;
          text-align: right;
          font-size: 0.58rem;
          font-weight: 700;
          color: #64748b;
          line-height: 1.5;
        }

        .return-side-note strong {
          color: #0f172a;
        }
      `}</style>

      <div className="panel-header">
        <h2>ID card workspace</h2>
        <p>Fill student details on the left and review the live front-back card preview on the right.</p>
      </div>

      <div className="info-strip">
        <div>
          <strong>Live preview</strong>
          <span>Every update appears immediately on the card layout.</span>
        </div>
        <div>
          <strong>Print flow</strong>
          <span>Open the dedicated print view once the card details are ready.</span>
        </div>
        <div>
          <strong>School branding</strong>
          <span>The current school logo and details are used automatically.</span>
        </div>
      </div>

      <div className="grid-2 id-layout">
        <div className="card">
          <div className="id-form-header">
            <div>
              <div className="section-kicker">Student inputs</div>
              <h3>ID information</h3>
            </div>
            <div className="id-form-icon">
              <CreditCard size={20} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Student Name</label>
                <input type="text" name="studentName" value={formData.studentName} onChange={handleInputChange} className="form-input" placeholder="Student name" />
              </div>
              <div className="form-group">
                <label className="form-label">Admission No</label>
                <input type="text" name="admissionNo" value={formData.admissionNo} onChange={handleInputChange} className="form-input" placeholder="ADM-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Roll No</label>
                <input type="text" name="rollNo" value={formData.rollNo} onChange={handleInputChange} className="form-input" placeholder="01" />
              </div>
              <div className="form-group">
                <label className="form-label">Class & Section</label>
                <input type="text" name="classSection" value={formData.classSection} onChange={handleInputChange} className="form-input" placeholder="X - B" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Session</label>
                <input type="text" name="validity" value={formData.validity} onChange={handleInputChange} className="form-input" placeholder="2025-26" />
              </div>
              <div className="form-group">
                <label className="form-label">Student Photo</label>
                <input type="file" onChange={handlePhotoUpload} className="form-input" accept="image/*" />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Parent Name</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="form-input" placeholder="Parent name" />
              </div>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input type="text" name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className="form-input" placeholder="O+" />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="text" name="dob" value={formData.dob} onChange={handleInputChange} className="form-input" placeholder="DD/MM/YYYY" />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="form-input" placeholder="+91 99999 00000" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" className="form-textarea" placeholder="Full residential address" />
            </div>

            <button onClick={handlePrint} className="btn btn-primary btn-lg w-full" type="button">
              <Printer size={18} />
              Open Print View
            </button>
          </div>
        </div>

        <div className="id-preview-column">
          <div className="card id-preview-header">
            <div>
              <div className="section-kicker">Live card preview</div>
              <h3>Front and back review</h3>
              <p>Hover over the card to inspect both sides before printing.</p>
            </div>
            <div className="preview-chip">Preview</div>
          </div>

          <div className="card id-preview-stage">
            <div className="id-flip-container">
              <div className="id-flip-card">
                <div className="id-flip-face id-flip-front">
                  <IDCardFront
                    data={formData}
                    schoolName={currentUser?.schoolName || currentUser?.name}
                    schoolLogo={currentUser?.schoolLogo || currentUser?.logo}
                    schoolLocation={currentUser?.location}
                  />
                </div>
                <div className="id-flip-face id-flip-back">
                  <IDCardBack
                    data={formData}
                    schoolLogo={currentUser?.schoolLogo || currentUser?.logo}
                    schoolMobile={currentUser?.schoolMobile || currentUser?.mobile}
                    principalName={currentUser?.principalName || 'Principal'}
                  />
                </div>
              </div>
            </div>

            <div className="preview-note">
              Hover to rotate preview <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
