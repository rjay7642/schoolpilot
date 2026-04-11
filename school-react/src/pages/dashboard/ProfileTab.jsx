import React, { useState } from 'react';
import { useStore, fileToDataURL } from '../../store/useStore.js';
import { db } from '../../store/db.js';
import { ShieldCheck } from 'lucide-react';
import Swal from 'sweetalert2';

const SWAL_LIGHT = {
  background: '#ffffff',
  color: '#0f172a',
  confirmButtonColor: '#0f766e',
};

export default function ProfileTab() {
  const { currentUser, updateCurrentUser, records, logout } = useStore();
  const [editing, setEditing] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: currentUser?.schoolName || '',
    adminName: currentUser?.adminName || '',
    phone: currentUser?.phone || '',
    location: currentUser?.location || '',
    principalName: currentUser?.principalName || '',
    schoolMobile: currentUser?.schoolMobile || '',
    passwordHint: currentUser?.passwordHint || '',
  });

  const [securityData, setSecurityData] = useState({
    password: currentUser?.password || '',
    passwordHint: currentUser?.passwordHint || '',
  });

  const allRecords = records.filter((item) => item.ownerEmail === currentUser?.email);
  const passRecords = allRecords.filter((item) => item.result === 'PASS').length;
  const passRate = allRecords.length ? ((passRecords / allRecords.length) * 100).toFixed(1) : '0.0';
  const joinedOn = currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A';
  const initials = (currentUser?.schoolName || 'SP')
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  async function handleSave(e) {
    e.preventDefault();
    const form = e.target;
    const file = form.elements.schoolLogoFile?.files?.[0];
    let schoolLogo = currentUser?.schoolLogo || '';

    if (file) {
      try {
        schoolLogo = await fileToDataURL(file);
      } catch {
        Swal.fire({
          ...SWAL_LIGHT,
          icon: 'error',
          title: 'Logo read error',
          text: 'The selected file could not be processed.',
        });
        return;
      }
    }

    await updateCurrentUser({ ...formData, schoolLogo });
    setEditing(false);

    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Profile updated',
      text: 'Your school profile has been saved successfully.',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  async function handleSecuritySave(e) {
    e.preventDefault();
    if (!securityData.password) {
      Swal.fire({ ...SWAL_LIGHT, icon: 'error', title: 'Error', text: 'Password cannot be empty.' });
      return;
    }

    await updateCurrentUser({ 
      password: securityData.password, 
      passwordHint: securityData.passwordHint 
    });
    
    setShowSecurity(false);
    
    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Security Updated',
      text: 'Your password and hints have been updated successfully. You remain logged in.',
      confirmButtonText: 'Great',
    });
  }

  async function handleResetData() {
    const result = await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'warning',
      title: 'Reset generated data?',
      text: 'This removes all saved result records for the current school.',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Reset Data',
    });

    if (!result.isConfirmed) return;

    await db.records.where('ownerEmail').equals(currentUser?.email).delete();
    await db.subjectPrefs.where('email').equals(currentUser?.email).delete();

    const updatedRecords = await db.records.toArray();
    useStore.setState({ records: updatedRecords });

    Swal.fire({
      ...SWAL_LIGHT,
      icon: 'success',
      title: 'Data reset complete',
      timer: 1200,
      showConfirmButton: false,
    });
  }

  async function handleDeleteProfile() {
    const result = await Swal.fire({
      ...SWAL_LIGHT,
      icon: 'error',
      title: 'Delete school profile?',
      text: 'This will permanently remove the school profile and all associated data.',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#cbd5e1',
      confirmButtonText: 'Delete Permanently',
      input: 'text',
      inputPlaceholder: 'Type DELETE to confirm',
      inputAttributes: { autocapitalize: 'off' },
      preConfirm: (value) => {
        if (value !== 'DELETE') {
          Swal.showValidationMessage('Please type DELETE to continue');
          return false;
        }
        return true;
      },
    });

    if (!result.isConfirmed) return;

    const email = currentUser?.email;
    await db.users.where('email').equals(email).delete();
    await db.records.where('ownerEmail').equals(email).delete();
    await db.subjectPrefs.where('email').equals(email).delete();

    const users = await db.users.toArray();
    const updatedRecords = await db.records.toArray();
    useStore.setState({ users, records: updatedRecords });
    logout();
  }

  const detailItems = [
    { label: 'Admin Name', value: currentUser?.adminName },
    { label: 'Email', value: currentUser?.email },
    { label: 'Phone', value: currentUser?.phone },
    { label: 'School Mobile', value: currentUser?.schoolMobile },
    { label: 'Principal', value: currentUser?.principalName },
    { label: 'Location', value: currentUser?.location },
    { label: 'Workspace Type', value: 'SchoolPilot Local Workspace' },
    { label: 'Joined On', value: joinedOn },
  ];

  return (
    <div>
      <div className="panel-header">
        <h2>School profile</h2>
        <p>Manage core school information, logo, credentials help, and data controls.</p>
      </div>

      <div className="profile-card-header">
        <div className="profile-avatar">
          {currentUser?.schoolLogo ? (
            <img src={currentUser.schoolLogo} alt="School logo" />
          ) : (
            <div className="profile-avatar-fallback">
              <ShieldCheck size={40} />
              <span>{initials}</span>
            </div>
          )}
        </div>

        <div className="profile-info">
          <h3>{currentUser?.schoolName}</h3>
          <p>
            {currentUser?.location || 'Location not set'} - Principal {currentUser?.principalName || '-'}
          </p>
          <div className="profile-badges">
            <span className="badge badge-accent">Joined {joinedOn}</span>
            <span className="badge badge-neutral">Records {allRecords.length}</span>
            <span className="badge badge-green">Pass Rate {passRate}%</span>
          </div>
        </div>
      </div>

      {!editing && (
        <div className="profile-details-grid">
          {detailItems.map((item) => (
            <div key={item.label} className="profile-detail-item">
              <div className="label">{item.label}</div>
              <div className="value">{item.value || '-'}</div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <form onSubmit={handleSave} className="card profile-form-card">
          <div className="form-section-title">Edit school profile</div>
          <div className="grid-2">
            {[
              { label: 'School Name', name: 'schoolName', required: true },
              { label: 'Admin Name', name: 'adminName', required: true },
              { label: 'Phone Number', name: 'phone', type: 'tel', required: true },
              { label: 'Location', name: 'location', required: true },
              { label: 'Principal Name', name: 'principalName', required: true },
              { label: 'School Mobile', name: 'schoolMobile', type: 'tel', required: true },
              { label: 'Password Hint', name: 'passwordHint', required: true },
            ].map((field) => (
              <div key={field.name} className="form-group">
                <label className="form-label">{field.label}</label>
                <input
                  className="form-input"
                  type={field.type || 'text'}
                  name={field.name}
                  required={field.required}
                  value={formData[field.name]}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                />
              </div>
            ))}

            <div className="form-group col-span-2">
              <label className="form-label">Update School Logo</label>
              <input type="file" name="schoolLogoFile" accept="image/*" />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="profile-actions">
        {!editing && !showSecurity && (
          <>
            <button className="btn btn-secondary" onClick={() => setEditing(true)} type="button">
              Edit Profile
            </button>
            <button className="btn btn-secondary" onClick={() => setShowSecurity(true)} type="button">
              Security & Password
            </button>
          </>
        )}
        {!editing && !showSecurity && (
          <>
            <button className="btn btn-ghost" onClick={handleResetData} type="button">
              Reset Generated Data
            </button>
            <button className="btn btn-danger" onClick={handleDeleteProfile} type="button">
              Delete Profile
            </button>
          </>
        )}
      </div>

      {showSecurity && (
        <form onSubmit={handleSecuritySave} className="card profile-form-card fade-in">
          <div className="form-section-title">Update Security Credentials</div>
          <p className="form-helper-text">Your password is stored locally on this machine and never shared with any server.</p>
          
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                required
                value={securityData.password}
                onChange={(e) => setSecurityData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password Hint (Optional)</label>
              <input
                className="form-input"
                type="text"
                value={securityData.passwordHint}
                onChange={(e) => setSecurityData(prev => ({ ...prev, passwordHint: e.target.value }))}
                placeholder="e.g. My childhood pet"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Update Credentials
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowSecurity(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
