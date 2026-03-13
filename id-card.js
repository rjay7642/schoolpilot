const STORAGE_KEYS = {
  users: "schoolpilot_users",
  session: "schoolpilot_session"
};

const els = {
  get idCardForm() { return document.getElementById("idCardForm"); },
  get idFront() { return document.getElementById("idFront"); },
  get idBack() { return document.getElementById("idBack"); },
  get idCardWrapper() { return document.getElementById("idCardWrapper"); },
  get photoInput() { return document.getElementById("photoInput"); },
  get generateBtn() { return document.getElementById("generateIdBtn"); }
};

let currentUser = null;
let studentPhoto = "";

function parseSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || "null");
}

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || "[]");
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function updatePreview() {
  if (!currentUser) return;

  const formData = new FormData(els.idCardForm);
  const data = Object.fromEntries(formData.entries());

  const schoolName = currentUser.schoolName || "SCHOOL NAME";
  const schoolLogo = currentUser.schoolLogo || "assets/logo.png";
  const schoolLocation = currentUser.location || "Location";
  const schoolMobile = currentUser.schoolMobile || "0000000000";

  const frontHTML = `
    <div class="id-header">
      <div class="id-hologram"></div>
      <img src="${schoolLogo}" alt="Logo" class="id-school-logo" />
      <div class="id-school-info">
         <h2>${escapeHTML(schoolName.toUpperCase())}</h2>
         <p>${escapeHTML(schoolLocation)}</p>
      </div>
    </div>
    <div class="id-body">
      <img src="${schoolLogo}" class="id-watermark" alt="Watermark" />
      <div class="id-photo-container">
        <img src="${studentPhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=student'}" alt="Student" class="id-student-photo" id="previewStudentPhoto" />
        <div class="id-photo-accent"></div>
      </div>
      <div class="id-name-area">
        <h3 class="id-student-name">${escapeHTML(data.studentName || "STUDENT NAME")}</h3>
        <span class="id-student-tag">STUDENT IDENTITY CARD</span>
      </div>
        
      <div class="id-detail-grid">
         <div class="id-item">
            <small>Admission No.</small>
            <strong>${escapeHTML(data.admissionNo || "-")}</strong>
         </div>
         <div class="id-item">
            <small>Roll Number</small>
            <strong>${escapeHTML(data.rollNo || "-")}</strong>
         </div>
         <div class="id-item">
            <small>Class / Sec</small>
            <strong>${escapeHTML(data.classSection || "-")}</strong>
         </div>
      </div>
    </div>
    <div class="id-footer">
       <div class="id-validity">VALID UP TO: ${escapeHTML(data.validity || "MARCH 2026")}</div>
    </div>
  `;

  const backHTML = `
    <div class="id-back-content">
      <img src="${schoolLogo}" class="id-watermark" alt="Watermark" />
      <div class="id-back-header">
        <h3>PERSONAL DETAILS</h3>
      </div>
      <div class="id-back-list">
        <div class="id-back-item">
          <span class="label">Father's Name</span>
          <span class="value">${escapeHTML(data.fatherName || "-")}</span>
        </div>
        <div class="id-back-item">
          <span class="label">Date of Birth</span>
          <span class="value">${escapeHTML(data.dob || "-")}</span>
        </div>
        <div class="id-back-item">
          <span class="label">Blood Group</span>
          <span class="value">${escapeHTML(data.bloodGroup || "-")}</span>
        </div>
        <div class="id-back-item">
          <span class="label">Contact No.</span>
          <span class="value">${escapeHTML(data.phone || "-")}</span>
        </div>
        <div class="id-back-item">
          <span class="label">Address</span>
          <span class="value address-value">${escapeHTML(data.address || "-")}</span>
        </div>
      </div>

      <div class="id-back-footer">
        <div class="id-signature-area">
          <div class="signature-line"></div>
          <small>Principal Signature</small>
        </div>
        <div class="id-contact-info">
          <p>If found, please return to office.</p>
          <small>Contact: ${schoolMobile}</small>
        </div>
      </div>
    </div>
  `;

  els.idFront.innerHTML = frontHTML;
  els.idBack.innerHTML = backHTML;
}

function init() {
  const session = parseSession();
  if (!session?.email) {
    alert("Please login from the dashboard first.");
    window.location.href = "index.html";
    return;
  }

  currentUser = getUsers().find(u => u.email.toLowerCase() === session.email.toLowerCase());
  if (!currentUser) {
    alert("School profile not found.");
    window.location.href = "index.html";
    return;
  }

  // Event Listeners
  const form = els.idCardForm;
  if (form) form.addEventListener("input", updatePreview);
  
  const photoInput = els.photoInput;
  if (photoInput) {
    photoInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        studentPhoto = await fileToDataURL(file);
        updatePreview();
      }
    });
  }

  const wrapper = els.idCardWrapper;
  if (wrapper) {
    wrapper.addEventListener("click", () => {
      wrapper.classList.toggle("flipped");
    });
  }

  const generateBtn = els.generateBtn;
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      try {
        const form = els.idCardForm;
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.studentName || !data.admissionNo || !data.classSection) {
          alert("Please fill all required student details (Name, Admission No, Class).");
          return;
        }

        const payload = {
          ...data,
          studentPhoto,
          schoolName: currentUser.schoolName,
          schoolLogo: currentUser.schoolLogo,
          schoolLocation: currentUser.location,
          schoolMobile: currentUser.schoolMobile
        };

        const json = JSON.stringify(payload);
        
        // Safety check for localStorage quota
        try {
          localStorage.setItem('temp_id_card_data', json);
          window.open('id-print.html', '_blank');
        } catch (e) {
          console.error("Storage error:", e);
          alert("Error: The data (possibly the photo) is too large to process. Please try a smaller photo or clear your browser data.");
        }
      } catch (err) {
        console.error("Generation error:", err);
        alert("An error occurred while generating the ID card.");
      }
    });
  }

  // Initial Preview
  updatePreview();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
