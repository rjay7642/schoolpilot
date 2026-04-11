import React, { useEffect, useState } from 'react';
import { useStore, SUBJECT_LIBRARY, RESULT_TEMPLATES, gradeFromPercentage } from '../../store/useStore.js';
import { db } from '../../store/db.js';
import Swal from 'sweetalert2';
import TemplatePicker from '../../components/TemplatePicker.jsx';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

const emptyForm = {
  studentName: '',
  fatherName: '',
  motherName: '',
  className: '',
  rollNumber: '',
  session: '',
  examType: '',
  studentPhone: '',
};

export default function GenerateCertificate() {
  const { currentUser, getSavedSubjects, saveSavedSubjects, setActiveTab, updateRecord } = useStore();

  const [checkedSubjects, setCheckedSubjects] = useState({});
  const [loadedSubjects, setLoadedSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [totalMax, setTotalMax] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [showPicker, setShowPicker] = useState(false);
  const [newRecordId, setNewRecordId] = useState(null);

  useEffect(() => {
    if (!currentUser?.email) return;

    async function load() {
      const saved = await getSavedSubjects(currentUser.email);
      setLoadedSubjects(saved);

      const map = {};
      SUBJECT_LIBRARY.forEach((subject) => {
        map[subject] = saved.includes(subject);
      });
      setCheckedSubjects(map);
    }

    load();
  }, [currentUser, getSavedSubjects]);

  const obtained = loadedSubjects.reduce((sum, subject) => sum + (Number(marks[subject]) || 0), 0);
  const totalMaxNum = Number(totalMax) || 0;
  const percent = totalMaxNum > 0 ? (obtained / totalMaxNum) * 100 : 0;
  const grade = gradeFromPercentage(percent);
  const selectedCount = SUBJECT_LIBRARY.filter((subject) => checkedSubjects[subject]).length;

  function toggleSubject(subject) {
    setCheckedSubjects((prev) => ({ ...prev, [subject]: !prev[subject] }));
  }

  function selectAll() {
    setCheckedSubjects(Object.fromEntries(SUBJECT_LIBRARY.map((subject) => [subject, true])));
  }

  async function clearAll() {
    setCheckedSubjects(Object.fromEntries(SUBJECT_LIBRARY.map((subject) => [subject, false])));
    setLoadedSubjects([]);
    setMarks({});
    await saveSavedSubjects(currentUser?.email, []);
  }

  async function loadSubjects() {
    const chosen = SUBJECT_LIBRARY.filter((subject) => checkedSubjects[subject]);

    if (chosen.length < 4 || chosen.length > 8) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'warning',
        title: 'Select 4 to 8 subjects',
        text: 'Please choose a practical subject set before continuing.',
      });
      return;
    }

    setLoadedSubjects(chosen);
    await saveSavedSubjects(currentUser?.email, chosen);
    setMarks({});

    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Subjects loaded',
      text: `${chosen.length} subjects are now ready for marks entry.`,
      timer: 1200,
      showConfirmButton: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;

    if (!loadedSubjects.length) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'warning',
        title: 'Load subjects first',
        text: 'Select the subject set before creating the result certificate.',
      });
      return;
    }

    if (!totalMaxNum || totalMaxNum <= 0) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'warning',
        title: 'Enter maximum marks',
        text: 'Please provide a valid total maximum marks value.',
      });
      return;
    }

    if (obtained > totalMaxNum) {
      Swal.fire({
        ...SWAL_LIGHT,
        icon: 'error',
        title: 'Marks exceed maximum',
        text: 'Obtained marks cannot be greater than the maximum marks.',
      });
      return;
    }

    const subjectMarks = loadedSubjects.map((subject) => ({
      subject,
      marks: Number(marks[subject] || 0),
    }));

    const result = percent >= 33 ? 'PASS' : 'FAIL';

    const record = {
      ownerEmail: currentUser.email,
      schoolName: currentUser.schoolName,
      location: currentUser.location,
      principalName: currentUser.principalName,
      schoolMobile: currentUser.schoolMobile,
      schoolLogo: currentUser.schoolLogo || '',
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      className: formData.className,
      rollNumber: formData.rollNumber,
      studentPhone: formData.studentPhone,
      session: formData.session,
      examType: formData.examType || 'Annual Examination',
      totalMax: totalMaxNum,
      obtained,
      percent,
      grade,
      result,
      templateId: RESULT_TEMPLATES[0].id,
      subjectMarks,
      createdAt: new Date().toISOString(),
    };

    const id = await db.records.add(record);
    const finalRecord = { ...record, id: String(id) };
    const { records } = useStore.getState();
    useStore.setState({ records: [...records, finalRecord] });

    setNewRecordId(String(id));

    await Swal.fire({
      ...SWAL_LIGHT,
      icon: result === 'PASS' ? 'success' : 'warning',
      title: 'Result generated',
      html: `<div style="color:#475569;line-height:1.7">
        <strong style="color:#0f172a">${record.studentName}</strong><br />
        Percentage: <strong style="color:#0f766e">${percent.toFixed(2)}%</strong><br />
        Grade: <strong style="color:#1d4ed8">${grade}</strong>
      </div>`,
      confirmButtonText: 'Choose Template',
    });

    setShowPicker(true);
  }

  async function handleReset() {
    setFormData(emptyForm);
    setMarks({});
    setTotalMax('');
    setLoadedSubjects([]);
    setCheckedSubjects(Object.fromEntries(SUBJECT_LIBRARY.map((subject) => [subject, false])));
    await saveSavedSubjects(currentUser?.email, []);
  }

  return (
    <div>
      <div className="panel-header">
        <h2>Generate result certificate</h2>
        <p>Enter student details, select subjects, and create a print-ready result record.</p>
      </div>

      <div className="info-strip">
        <div>
          <strong>Subject policy</strong>
          <span>Choose between 4 and 8 subjects for each certificate.</span>
        </div>
        <div>
          <strong>Current template</strong>
          <span>The first template is applied now and can be changed after save.</span>
        </div>
        <div>
          <strong>Auto calculation</strong>
          <span>Total, percentage, grade, and pass/fail update as you type.</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="gen-form">
        <div className="card">
          <div className="form-section-title">Student details</div>
          <div className="grid-3">
            {[
              { label: 'Student Name', name: 'studentName', required: true },
              { label: "Father's Name", name: 'fatherName', required: true },
              { label: "Mother's Name", name: 'motherName' },
              { label: 'Class', name: 'className', required: true },
              { label: 'Roll Number', name: 'rollNumber', required: true },
              { label: 'Session', name: 'session', placeholder: '2025-26', required: true },
              { label: 'Exam Type', name: 'examType', placeholder: 'Annual Examination' },
              { label: 'Student Phone', name: 'studentPhone', type: 'tel' },
            ].map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label">
                  {field.label}
                  {field.required ? ' *' : ''}
                </label>
                <input
                  className="form-input"
                  type={field.type || 'text'}
                  required={field.required}
                  placeholder={field.placeholder || ''}
                  value={formData[field.name]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="form-section-title">Subject setup</div>
          <div className="grid-2 compact-grid">
            <div className="form-group">
              <label className="form-label">Total Maximum Marks *</label>
              <input
                className="form-input"
                type="number"
                min="1"
                value={totalMax}
                onChange={(e) => setTotalMax(e.target.value)}
                placeholder="Example: 500"
                required
              />
            </div>

            <div className="selection-summary">
              <div className="selection-summary-label">Selected subjects</div>
              <div className="selection-summary-value">{selectedCount}</div>
              <div className="selection-summary-note">
                Load the selected set before entering marks.
              </div>
            </div>
          </div>

          <div className="subject-toolbar">
            <button type="button" className="btn btn-ghost btn-sm" onClick={selectAll}>
              Select All
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearAll}>
              Clear All
            </button>
          </div>

          <div className="subject-chip-grid">
            {SUBJECT_LIBRARY.map((subject) => (
              <button
                type="button"
                key={subject}
                className={`subject-chip ${checkedSubjects[subject] ? 'checked' : ''}`}
                onClick={() => toggleSubject(subject)}
              >
                <span className="chip-tick">{checkedSubjects[subject] ? 'Yes' : 'No'}</span>
                <span>{subject}</span>
              </button>
            ))}
          </div>

          <div className="subject-actions">
            <button type="button" className="btn btn-secondary" onClick={loadSubjects}>
              Load Selected Subjects
            </button>

            {loadedSubjects.length > 0 && (
              <div className="loaded-subjects">
                Loaded: {loadedSubjects.join(', ')}
              </div>
            )}
          </div>
        </div>

        {loadedSubjects.length > 0 && (
          <div className="card">
            <div className="form-section-title">Marks entry</div>
            <div className="grid-3">
              {loadedSubjects.map((subject) => (
                <div key={subject} className="form-group">
                  <label className="form-label">{subject}</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Obtained marks"
                    value={marks[subject] || ''}
                    onChange={(e) => setMarks((prev) => ({ ...prev, [subject]: e.target.value }))}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="calc-summary">
              <div>
                <span>Obtained</span>
                <strong>{obtained.toFixed(2).replace(/\.00$/, '')}</strong>
              </div>
              <div>
                <span>Maximum</span>
                <strong>{totalMax || 0}</strong>
              </div>
              <div>
                <span>Percentage</span>
                <strong className={percent >= 33 ? 'text-success' : 'text-danger'}>
                  {percent.toFixed(2)}%
                </strong>
              </div>
              <div>
                <span>Grade</span>
                <strong>{grade}</strong>
              </div>
              <div className="calc-summary-badge">
                <span className={`badge ${percent >= 33 ? 'badge-green' : 'badge-red'}`}>
                  {percent >= 33 ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            Generate Certificate
          </button>
          <button type="button" className="btn btn-ghost btn-lg" onClick={handleReset}>
            Reset Form
          </button>
        </div>
      </form>

      {showPicker && newRecordId && (
        <TemplatePicker
          recordId={newRecordId}
          onClose={() => {
            Swal.close();
            setShowPicker(false);
          }}
          onSelect={async (recordId, templateId) => {
            await updateRecord(recordId, { templateId });
            Swal.close();
            setShowPicker(false);
            setActiveTab('history');
            localStorage.setItem('sp_preview_id', recordId);
            window.location.hash = '#preview';
          }}
        />
      )}
    </div>
  );
}
