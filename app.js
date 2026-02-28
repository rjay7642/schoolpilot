const STORAGE_KEYS = {
  users: "schoolpilot_users",
  session: "schoolpilot_session",
  records: "schoolpilot_records",
  subjectPrefs: "schoolpilot_subject_prefs"
};

const SUBJECT_LIBRARY = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Science",
  "Computer Science",
  "Sanskrit",
  "General Knowledge",
  "Drawing",
  "Physical Education",
  "Economics",
  "Biology",
  "Chemistry",
  "Physics",
  "Accountancy",
  "Business Studies"
];

const RESULT_TEMPLATES = [
  { id: "template-1", name: "Royal Horizon", page: "result-template-1.html", swatch: "linear-gradient(130deg, #0f4f86, #2b8abd)" },
  { id: "template-2", name: "Emerald Luxe", page: "result-template-2.html", swatch: "linear-gradient(130deg, #0a6247, #34a57a)" },
  { id: "template-3", name: "Midnight Gold", page: "result-template-3.html", swatch: "linear-gradient(130deg, #1b2448, #b68a3b)" },
  { id: "template-4", name: "Rose Quartz", page: "result-template-4.html", swatch: "linear-gradient(130deg, #7a3c52, #d48da5)" },
  { id: "template-5", name: "Platinum Slate", page: "result-template-5.html", swatch: "linear-gradient(130deg, #2b3d52, #7b96b3)" }
];

const els = {
  registerCard: document.getElementById("registerCard"),
  loginCard: document.getElementById("loginCard"),
  dashboard: document.getElementById("dashboard"),
  registerForm: document.getElementById("registerForm"),
  loginForm: document.getElementById("loginForm"),
  forgotPassBtn: document.getElementById("forgotPassBtn"),
  hintText: document.getElementById("hintText"),
  dashSchoolName: document.getElementById("dashSchoolName"),
  dashMeta: document.getElementById("dashMeta"),
  dashSchoolLogo: document.getElementById("dashSchoolLogo"),
  profileCard: document.getElementById("profileCard"),
  certificateForm: document.getElementById("certificateForm"),
  totalMarks: document.getElementById("totalMarks"),
  percentage: document.getElementById("percentage"),
  historyList: document.getElementById("historyList"),
  historySearch: document.getElementById("historySearch"),
  classFilter: document.getElementById("classFilter"),
  resultFilter: document.getElementById("resultFilter"),
  subjectCheckboxGrid: document.getElementById("subjectCheckboxGrid"),
  loadSubjectsBtn: document.getElementById("loadSubjectsBtn"),
  selectAllSubjectsBtn: document.getElementById("selectAllSubjectsBtn"),
  clearSubjectsBtn: document.getElementById("clearSubjectsBtn"),
  loadSubjectHint: document.getElementById("loadSubjectHint"),
  selectedSubjectsText: document.getElementById("selectedSubjectsText"),
  dynamicSubjectInputs: document.getElementById("dynamicSubjectInputs"),
  totalMaxMarks: document.getElementById("totalMaxMarks"),
  dashTotalRecords: document.getElementById("dashTotalRecords"),
  dashTodayRecords: document.getElementById("dashTodayRecords"),
  editProfileBtn: document.getElementById("editProfileBtn"),
  resetStorageBtn: document.getElementById("resetStorageBtn"),
  deleteProfileBtn: document.getElementById("deleteProfileBtn"),
  profileEditForm: document.getElementById("profileEditForm"),
  cancelProfileEditBtn: document.getElementById("cancelProfileEditBtn"),
  templatePickerModal: document.getElementById("templatePickerModal"),
  templatePickerGrid: document.getElementById("templatePickerGrid"),
  closeTemplatePickerBtn: document.getElementById("closeTemplatePickerBtn"),
  liveResultPreview: document.getElementById("liveResultPreview"),
  faqList: document.getElementById("faqList"),
  ctaRegisterBtn: document.getElementById("ctaRegisterBtn"),
  ctaLoginBtn: document.getElementById("ctaLoginBtn"),
  floatingHelpBtn: document.getElementById("floatingHelpBtn")
};

let currentUser = null;
let selectedSubjects = [];
let historyRenderVersion = 0;

const parse = (key) => JSON.parse(localStorage.getItem(key) || "[]");
const parseSession = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || "null");

function setSession(email) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ email }));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getUsers() {
  return parse(STORAGE_KEYS.users);
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getRecords() {
  return parse(STORAGE_KEYS.records);
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
}

function getSubjectPrefMap() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.subjectPrefs) || "{}");
}

function saveSubjectPrefMap(map) {
  localStorage.setItem(STORAGE_KEYS.subjectPrefs, JSON.stringify(map));
}

function getSavedSubjects(email) {
  const map = getSubjectPrefMap();
  const saved = map[email];
  return Array.isArray(saved) ? saved : [];
}

function saveSavedSubjects(email, subjects) {
  const map = getSubjectPrefMap();
  map[email] = subjects;
  saveSubjectPrefMap(map);
}

function clearSavedSubjects(email) {
  const map = getSubjectPrefMap();
  delete map[email];
  saveSubjectPrefMap(map);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatNumber(value) {
  return Number(value || 0).toFixed(2).replace(/\.00$/, "");
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read logo file."));
    reader.readAsDataURL(file);
  });
}

async function readSchoolLogoFromForm(form, preserveIfEmpty = "") {
  const fileInput = form.elements.schoolLogoFile;
  const file = fileInput?.files?.[0];
  if (!file) return preserveIfEmpty;
  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file for school logo.");
    return preserveIfEmpty;
  }
  try {
    return await fileToDataURL(file);
  } catch (error) {
    alert("School logo could not be read. Please try another image.");
    return preserveIfEmpty;
  }
}

function showAuthCard(type) {
  els.registerCard.classList.toggle("hidden", type !== "register");
  els.loginCard.classList.toggle("hidden", type !== "login");
  window.scrollTo({ top: document.getElementById("authArea").offsetTop - 16, behavior: "smooth" });
}

function bindTopButtons() {
  const openRegister = () => showAuthCard("register");
  const openLogin = () => showAuthCard("login");

  document.getElementById("openRegister").addEventListener("click", openRegister);
  document.getElementById("heroRegister").addEventListener("click", openRegister);
  document.getElementById("openLogin").addEventListener("click", openLogin);
  document.getElementById("heroLogin").addEventListener("click", openLogin);
}

function initLandingEnhancements() {
  if (els.faqList) {
    els.faqList.addEventListener("click", (event) => {
      const button = event.target.closest(".faq-q");
      if (!button) return;
      const item = button.closest(".faq-item");
      if (!item) return;
      item.classList.toggle("open");
    });
  }
}

function registerUser(data) {
  const users = getUsers();
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    alert("Email already registered. Please login.");
    return false;
  }

  users.push({ ...data, createdAt: new Date().toISOString() });
  saveUsers(users);
  alert("Registration successful. Please login now.");
  showAuthCard("login");
  return true;
}

function loginUser(email, password) {
  const user = getUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    alert("Invalid email or password.");
    return false;
  }

  currentUser = user;
  setSession(user.email);
  showDashboard();
  return true;
}

function gradeFromPercentage(percent) {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B+";
  if (percent >= 60) return "B";
  if (percent >= 50) return "C";
  if (percent >= 33) return "D";
  return "F";
}

function renderProfile() {
  if (!currentUser) return;
  els.dashSchoolName.textContent = currentUser.schoolName;
  els.dashMeta.textContent = `${currentUser.location} | Principal: ${currentUser.principalName} | Mobile: ${currentUser.schoolMobile}`;
  if (els.dashSchoolLogo) {
    els.dashSchoolLogo.src = currentUser.schoolLogo || "assets/logo.png";
  }

  const schoolRecords = getRecords().filter((record) => record.ownerEmail === currentUser.email);
  const totalRecords = schoolRecords.length;
  const passRecords = schoolRecords.filter((record) => record.result === "PASS").length;
  const passRate = totalRecords ? ((passRecords / totalRecords) * 100).toFixed(1) : "0.0";
  const joinedOn = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : "N/A";
  const profileInitials = (currentUser.schoolName || "SP")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const profileLogo = currentUser.schoolLogo
    ? `<div class="profile-logo-wrap"><img class="profile-logo" src="${escapeHTML(currentUser.schoolLogo)}" alt="School logo" /></div>`
    : `<div class="profile-logo-wrap"><div class="profile-logo profile-logo-fallback">${escapeHTML(profileInitials || "SP")}</div></div>`;

  els.profileCard.innerHTML = `
    <div class="profile-head">
      ${profileLogo}
      <div class="profile-identity">
        <h4>${escapeHTML(currentUser.schoolName)}</h4>
        <p>${escapeHTML(currentUser.location)} | Principal: ${escapeHTML(currentUser.principalName)}</p>
        <div class="profile-badges">
          <span class="profile-badge">Joined: ${escapeHTML(joinedOn)}</span>
          <span class="profile-badge">Records: ${totalRecords}</span>
          <span class="profile-badge">Pass Rate: ${passRate}%</span>
        </div>
      </div>
    </div>

    <div class="profile-grid">
      <div class="profile-item"><span>Admin Name</span><strong>${escapeHTML(currentUser.adminName)}</strong></div>
      <div class="profile-item"><span>Email</span><strong>${escapeHTML(currentUser.email)}</strong></div>
      <div class="profile-item"><span>Phone</span><strong>${escapeHTML(currentUser.phone)}</strong></div>
      <div class="profile-item"><span>School Mobile</span><strong>${escapeHTML(currentUser.schoolMobile)}</strong></div>
      <div class="profile-item"><span>Principal</span><strong>${escapeHTML(currentUser.principalName)}</strong></div>
      <div class="profile-item"><span>Workspace</span><strong>SchoolPilot Pro</strong></div>
    </div>
  `;

  if (els.profileEditForm) {
    els.profileEditForm.elements.schoolName.value = currentUser.schoolName || "";
    els.profileEditForm.elements.adminName.value = currentUser.adminName || "";
    els.profileEditForm.elements.phone.value = currentUser.phone || "";
    els.profileEditForm.elements.location.value = currentUser.location || "";
    els.profileEditForm.elements.principalName.value = currentUser.principalName || "";
    els.profileEditForm.elements.schoolMobile.value = currentUser.schoolMobile || "";
    els.profileEditForm.elements.passwordHint.value = currentUser.passwordHint || "";
    if (els.profileEditForm.elements.schoolLogoFile) {
      els.profileEditForm.elements.schoolLogoFile.value = "";
    }
  }
}

function readSelectedSubjects() {
  return Array.from(document.querySelectorAll(".subject-check:checked"))
    .map((input) => input.value.trim())
    .filter(Boolean);
}

function renderSelectedSubjectInputs(subjects) {
  selectedSubjects = subjects;
  if (currentUser) {
    saveSavedSubjects(currentUser.email, subjects);
  }

  if (!subjects.length) {
    els.dynamicSubjectInputs.innerHTML = "";
    els.selectedSubjectsText.textContent = "No subjects selected yet.";
    els.loadSubjectHint.classList.add("hidden");
    calculateMarks();
    return;
  }

  els.selectedSubjectsText.textContent = `Selected ${subjects.length} subjects: ${subjects.join(", ")}`;
  els.loadSubjectHint.classList.add("hidden");
  els.dynamicSubjectInputs.innerHTML = subjects
    .map(
      (subject) => `
      <label>${escapeHTML(subject)} Marks
        <input class="mark-input" required type="number" min="0" step="0.01" data-subject="${escapeHTML(subject)}" placeholder="Enter obtained marks" />
      </label>
    `
    )
    .join("");

  els.dynamicSubjectInputs.querySelectorAll(".mark-input").forEach((input) => {
    input.addEventListener("input", calculateMarks);
  });

  calculateMarks();
}

function updateLoadHintVisibility() {
  const checkedCount = document.querySelectorAll(".subject-check:checked").length;
  const hasLoadedSubjects = selectedSubjects.length > 0;
  const shouldShow = checkedCount > 0 && !hasLoadedSubjects;
  els.loadSubjectHint.classList.toggle("hidden", !shouldShow);
}

function applySavedSubjectsForCurrentUser() {
  if (!currentUser) return;
  const saved = getSavedSubjects(currentUser.email);
  document.querySelectorAll(".subject-check").forEach((input) => {
    input.checked = saved.includes(input.value);
  });
  renderSelectedSubjectInputs(saved);
}

function calculateMarks() {
  const totalMax = Number(els.totalMaxMarks.value || 0);
  const obtained = Array.from(els.dynamicSubjectInputs.querySelectorAll(".mark-input"))
    .map((input) => Number(input.value || 0))
    .reduce((sum, mark) => sum + mark, 0);

  const percent = totalMax > 0 ? (obtained / totalMax) * 100 : 0;
  els.totalMarks.textContent = obtained.toFixed(2).replace(/\.00$/, "");
  els.percentage.textContent = `${percent.toFixed(2)}%`;
  updateLivePreview({ obtained, totalMax, percent });

  return {
    obtained,
    totalMax,
    percent
  };
}

function updateLivePreview(metrics = null) {
  if (!els.certificateForm || !els.liveResultPreview) return;
  const formData = Object.fromEntries(new FormData(els.certificateForm).entries());
  const computed = metrics || calculateMarks();
  const grade = gradeFromPercentage(computed.percent || 0);
  const result = computed.percent >= 33 ? "PASS" : "FAIL";
  const schoolTitle = escapeHTML((currentUser?.schoolName || "SCHOOL NAME").toUpperCase());
  const location = escapeHTML(currentUser?.location || "Location");
  const principalName = escapeHTML(currentUser?.principalName || "Principal");
  const schoolMobile = escapeHTML(currentUser?.schoolMobile || "0000000000");
  const logoHtml = currentUser?.schoolLogo
    ? `<img class="cert-school-logo" src="${escapeHTML(currentUser.schoolLogo)}" alt="School logo" />`
    : "";

  const markMap = Object.fromEntries(
    Array.from(els.dynamicSubjectInputs.querySelectorAll(".mark-input")).map((input) => [
      input.dataset.subject,
      Number(input.value || 0)
    ])
  );

  const rows = (selectedSubjects.length ? selectedSubjects : ["Subject 1", "Subject 2"])
    .slice(0, 6)
    .map(
      (subject) => `
      <tr>
        <td>${escapeHTML(subject)}</td>
        <td>${formatNumber(markMap[subject] ?? 0)}</td>
      </tr>
    `
    )
    .join("");

  els.liveResultPreview.innerHTML = `
    <div class="certificate template-certificate template-1 mini-certificate">
      <div class="cert-header">
        <div class="cert-branding">
          ${logoHtml}
          <div class="cert-brand-copy">
            <p class="cert-kicker">Certified Academic Transcript</p>
            <h2 class="cert-title">${schoolTitle}</h2>
          </div>
        </div>
        <p class="cert-sub">${location}</p>
        <p class="cert-sub">Principal: ${principalName} | School Mobile: ${schoolMobile}</p>
        <h3>Official Result-Certificate</h3>
      </div>

      <div class="student-grid student-grid-card">
        <p><strong>Student Name:</strong> ${escapeHTML(formData.studentName || "Student Name")}</p>
        <p><strong>Father's Name:</strong> ${escapeHTML(formData.fatherName || "-")}</p>
        <p><strong>Mother's Name:</strong> ${escapeHTML(formData.motherName || "-")}</p>
        <p><strong>Class:</strong> ${escapeHTML(formData.className || "-")}</p>
        <p><strong>Roll Number:</strong> ${escapeHTML(formData.rollNumber || "-")}</p>
        <p><strong>Student Phone:</strong> ${escapeHTML(formData.studentPhone || "-")}</p>
        <p><strong>Session:</strong> ${escapeHTML(formData.session || "-")}</p>
      </div>

      <table class="marks-table">
        <thead><tr><th>Subject</th><th>Obtained Marks</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <div class="summary-strip">
        <p><strong>Total Max</strong><br>${formatNumber(computed.totalMax || 0)}</p>
        <p><strong>Obtained</strong><br>${formatNumber(computed.obtained || 0)}</p>
        <p><strong>Percentage</strong><br>${Number(computed.percent || 0).toFixed(2)}%</p>
        <p><strong>Grade</strong><br>${grade}</p>
      </div>

      <div class="cert-foot">
        <p><strong>Result:</strong> <span class="result-pill ${result === "PASS" ? "pass" : "fail"}">${result}</span></p>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Signature:</strong> Principal</p>
      </div>
    </div>
  `;
}

function getTemplateConfig(templateId) {
  return RESULT_TEMPLATES.find((item) => item.id === templateId) || RESULT_TEMPLATES[0];
}

function setRecordTemplate(recordId, templateId) {
  const records = getRecords();
  const idx = records.findIndex((item) => item.id === recordId);
  if (idx < 0) return;
  records[idx].templateId = getTemplateConfig(templateId).id;
  saveRecords(records);
}

function buildTemplatePickerCards(selectedTemplateId = RESULT_TEMPLATES[0].id) {
  return RESULT_TEMPLATES.map((template) => {
    const activeClass = template.id === selectedTemplateId ? "active" : "";
    return `
      <button type="button" class="template-option ${activeClass}" data-template-id="${template.id}">
        <span class="template-swatch" style="background:${template.swatch};"></span>
        <span class="template-copy">
          <strong>${escapeHTML(template.name)}</strong>
          <small>${escapeHTML(template.id.replace("template-", "Template "))}</small>
        </span>
      </button>
    `;
  }).join("");
}

function openTemplatePicker(recordId) {
  const record = getRecords().find((item) => item.id === recordId);
  if (!record || !els.templatePickerModal || !els.templatePickerGrid) return;
  const selectedTemplateId = getTemplateConfig(record.templateId).id;
  els.templatePickerModal.dataset.recordId = recordId;
  els.templatePickerGrid.innerHTML = buildTemplatePickerCards(selectedTemplateId);
  els.templatePickerModal.classList.remove("hidden");
}

function closeTemplatePicker() {
  if (!els.templatePickerModal) return;
  els.templatePickerModal.classList.add("hidden");
  delete els.templatePickerModal.dataset.recordId;
}

function openPreviewPage(recordId, shouldPrint = false, templateId = RESULT_TEMPLATES[0].id) {
  const template = getTemplateConfig(templateId);
  const query = new URLSearchParams({ id: String(recordId) });
  if (shouldPrint) query.set("print", "1");
  const url = `${template.page}?${query.toString()}`;
  window.location.href = url;
}

function upsertRecord(record) {
  const records = getRecords();
  records.push(record);
  saveRecords(records);
}

function renderDashboardStats() {
  const all = getRecords().filter((record) => record.ownerEmail === currentUser?.email);
  const today = new Date().toDateString();
  const todayCount = all.filter((record) => new Date(record.createdAt).toDateString() === today).length;
  animateDashboardStat(els.dashTotalRecords, all.length);
  animateDashboardStat(els.dashTodayRecords, todayCount);
}

function animateDashboardStat(el, nextValue) {
  if (!el) return;
  const target = Number(nextValue) || 0;
  const current =
    Number(el.dataset.currentValue || el.textContent.replace(/[^\d.-]/g, "")) || 0;

  if (el._counterFrameId) {
    cancelAnimationFrame(el._counterFrameId);
  }

  if (current === target) {
    el.textContent = String(target);
    el.dataset.currentValue = String(target);
    return;
  }

  const start = performance.now();
  const duration = 650;

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(current + (target - current) * eased);
    el.textContent = String(value);
    if (progress < 1) {
      el._counterFrameId = requestAnimationFrame(tick);
      return;
    }
    el.textContent = String(target);
    el.dataset.currentValue = String(target);
    el._counterFrameId = 0;
  };

  el._counterFrameId = requestAnimationFrame(tick);
}

function buildHistoryCard(record) {
  const template = getTemplateConfig(record.templateId);
  return `
    <div class="history-item">
      <div>
        <strong>${escapeHTML(record.studentName)}</strong> (${escapeHTML(record.className)}) - Roll ${escapeHTML(record.rollNumber)}<br>
        <small>${new Date(record.createdAt).toLocaleString()} | ${record.percent.toFixed(2)}% | ${escapeHTML(record.result)} | ${escapeHTML(template.name)}</small>
      </div>
      <div class="history-actions">
        <button class="btn btn-ghost" data-action="templates" data-id="${record.id}">Templates</button>
        <button class="btn btn-soft" data-action="preview" data-id="${record.id}">Preview</button>
        <button class="btn btn-primary" data-action="print" data-id="${record.id}">Print</button>
      </div>
    </div>
  `;
}

function populateClassFilter(records) {
  const classes = [...new Set(records.map((r) => r.className).filter(Boolean))].sort();
  const previous = els.classFilter.value;
  els.classFilter.innerHTML = `<option value="">All Classes</option>${classes
    .map((className) => `<option value="${escapeHTML(className)}">${escapeHTML(className)}</option>`)
    .join("")}`;
  els.classFilter.value = classes.includes(previous) ? previous : "";
}

function renderHistory(nameFilter = "", classFilter = "", resultFilter = "") {
  const renderId = ++historyRenderVersion;
  els.historyList.classList.add("is-loading");
  els.historyList.innerHTML = createHistorySkeleton();

  const all = getRecords().filter((record) => record.ownerEmail === currentUser?.email);
  populateClassFilter(all);

  const filtered = all.filter((record) => {
    const byName = record.studentName.toLowerCase().includes(nameFilter.toLowerCase());
    const byClass = !classFilter || record.className === classFilter;
    const byResult = !resultFilter || record.result === resultFilter;
    return byName && byClass && byResult;
  });

  const historyMarkup = !filtered.length
    ? `<p class="history-empty">No records found.</p>`
    : filtered
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(buildHistoryCard)
      .join("");

  window.setTimeout(() => {
    if (renderId !== historyRenderVersion) return;
    els.historyList.classList.remove("is-loading");
    els.historyList.innerHTML = historyMarkup;
  }, 140);
}

function createHistorySkeleton(items = 3) {
  return Array.from({ length: items })
    .map(
      () => `
      <div class="history-item history-skeleton" aria-hidden="true">
        <div class="history-skeleton-left">
          <span class="skeleton-line w-70"></span>
          <span class="skeleton-line w-50"></span>
        </div>
        <div class="history-skeleton-actions">
          <span class="skeleton-pill"></span>
          <span class="skeleton-pill"></span>
        </div>
      </div>
    `
    )
    .join("");
}

function handleHistoryActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const record = getRecords().find((item) => item.id === button.dataset.id);
  if (!record) return;

  if (button.dataset.action === "templates") {
    openTemplatePicker(record.id);
  }

  if (button.dataset.action === "preview") {
    openPreviewPage(record.id, false, getTemplateConfig(record.templateId).id);
  }

  if (button.dataset.action === "print") {
    openPreviewPage(record.id, true, getTemplateConfig(record.templateId).id);
  }

}

function showDashboard() {
  [
    "home",
    "features",
    "showcase",
    "processSection",
    "mediaBandSection",
    "templateShowcaseSection",
    "testimonialsSection",
    "workflowVisualSection",
    "comparisonSection",
    "securitySection",
    "faqSection",
    "ctaSplitSection",
    "authArea",
    "floatingHelpBtn"
  ].forEach((id) => document.getElementById(id)?.classList.add("hidden"));
  els.dashboard.classList.remove("hidden");
  renderProfile();
  applySavedSubjectsForCurrentUser();
  renderDashboardStats();
  renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
}

function showLanding() {
  [
    "home",
    "features",
    "showcase",
    "processSection",
    "mediaBandSection",
    "templateShowcaseSection",
    "testimonialsSection",
    "workflowVisualSection",
    "comparisonSection",
    "securitySection",
    "faqSection",
    "ctaSplitSection",
    "authArea",
    "floatingHelpBtn"
  ].forEach((id) => document.getElementById(id)?.classList.remove("hidden"));
  els.dashboard.classList.add("hidden");
  closeTemplatePicker();
}

function setActiveTab(id) {
  document.querySelectorAll(".tab-btn[data-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === id);
  });

  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === id);
  });
}

function restoreSession() {
  const session = parseSession();
  if (!session?.email) return;

  const found = getUsers().find((user) => user.email === session.email);
  if (!found) {
    clearSession();
    return;
  }

  currentUser = found;
  showDashboard();
}

function resetGeneratorForm() {
  selectedSubjects = [];
  els.certificateForm.reset();
  document.querySelectorAll(".subject-check").forEach((input) => {
    input.checked = false;
  });
  els.dynamicSubjectInputs.innerHTML = "";
  els.selectedSubjectsText.textContent = "No subjects selected yet.";
  els.loadSubjectHint.classList.add("hidden");
  calculateMarks();
}

function hideProfileEditForm() {
  els.profileEditForm.classList.add("hidden");
}

function initEvents() {
  bindTopButtons();

  if (els.certificateForm) {
    els.certificateForm.addEventListener("input", (event) => {
      const target = event.target;
      if (target.classList.contains("mark-input") || target.id === "totalMaxMarks") return;
      updateLivePreview();
    });
  }

  if (els.ctaRegisterBtn) {
    els.ctaRegisterBtn.addEventListener("click", () => showAuthCard("register"));
  }

  if (els.ctaLoginBtn) {
    els.ctaLoginBtn.addEventListener("click", () => showAuthCard("login"));
  }

  els.registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target;
    const payload = Object.fromEntries(new FormData(form).entries());
    payload.schoolLogo = await readSchoolLogoFromForm(form, "");
    delete payload.schoolLogoFile;
    registerUser(payload);
    form.reset();
  });

  els.loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    loginUser(formData.get("email"), formData.get("password"));
  });

  els.forgotPassBtn.addEventListener("click", () => {
    const email = els.loginForm.elements.email.value?.trim();
    if (!email) {
      els.hintText.textContent = "Please enter your email first.";
      return;
    }

    const user = getUsers().find((item) => item.email.toLowerCase() === email.toLowerCase());
    els.hintText.textContent = user ? `Password hint: ${user.passwordHint}` : "No account found for this email.";
  });

  els.loadSubjectsBtn.addEventListener("click", () => {
    const chosen = readSelectedSubjects();
    if (chosen.length < 4 || chosen.length > 8) {
      alert("Please select minimum 4 and maximum 8 subjects.");
      return;
    }
    renderSelectedSubjectInputs(chosen);
  });

  els.selectAllSubjectsBtn.addEventListener("click", () => {
    document.querySelectorAll(".subject-check").forEach((input) => {
      input.checked = true;
    });
    selectedSubjects = [];
    updateLoadHintVisibility();
  });

  els.clearSubjectsBtn.addEventListener("click", () => {
    document.querySelectorAll(".subject-check").forEach((input) => {
      input.checked = false;
    });
    renderSelectedSubjectInputs([]);
  });

  els.subjectCheckboxGrid.addEventListener("change", (event) => {
    if (!event.target.classList.contains("subject-check")) return;
    selectedSubjects = [];
    updateLoadHintVisibility();
  });

  els.totalMaxMarks.addEventListener("input", calculateMarks);

  els.certificateForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!currentUser) return;

    const formData = Object.fromEntries(new FormData(event.target).entries());
    const markInputs = Array.from(els.dynamicSubjectInputs.querySelectorAll(".mark-input"));
    if (!markInputs.length || !selectedSubjects.length) {
      alert("Please select subjects and click 'Load Selected Subjects' before generating certificate.");
      return;
    }

    const subjectMarks = markInputs.map((input) => ({
      subject: input.dataset.subject,
      marks: Number(input.value || 0)
    }));

    if (subjectMarks.some((item) => Number.isNaN(item.marks))) {
      alert("Please fill valid marks for all selected subjects.");
      return;
    }

    const { obtained, totalMax, percent } = calculateMarks();
    if (!totalMax || totalMax <= 0) {
      alert("Please enter valid total maximum marks.");
      return;
    }

    if (obtained > totalMax) {
      alert("Obtained marks cannot be greater than total maximum marks.");
      return;
    }

    const result = percent >= 33 ? "PASS" : "FAIL";
    const grade = gradeFromPercentage(percent);

    const record = {
      id: `${Date.now()}`,
      ownerEmail: currentUser.email,
      schoolName: currentUser.schoolName,
      location: currentUser.location,
      principalName: currentUser.principalName,
      schoolMobile: currentUser.schoolMobile,
      schoolLogo: currentUser.schoolLogo || "",
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      motherName: formData.motherName,
      className: formData.className,
      rollNumber: formData.rollNumber,
      studentPhone: formData.studentPhone,
      session: formData.session,
      totalMax,
      obtained,
      percent,
      grade,
      result,
      templateId: RESULT_TEMPLATES[0].id,
      subjectMarks,
      createdAt: new Date().toISOString()
    };

    upsertRecord(record);
    renderDashboardStats();
    renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
    openTemplatePicker(record.id);
  });

  els.historySearch.addEventListener("input", (event) => {
    renderHistory(event.target.value, els.classFilter.value || "", els.resultFilter.value || "");
  });

  els.classFilter.addEventListener("change", () => {
    renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
  });

  els.resultFilter.addEventListener("change", () => {
    renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
  });

  els.editProfileBtn.addEventListener("click", () => {
    els.profileEditForm.classList.remove("hidden");
    renderProfile();
  });

  els.cancelProfileEditBtn.addEventListener("click", () => {
    hideProfileEditForm();
  });

  els.resetStorageBtn.addEventListener("click", () => {
    if (!currentUser) return;
    const approved = window.confirm(
      "Reset generated data? This will delete all generated result records for this school account."
    );
    if (!approved) return;

    saveRecords(getRecords().filter((record) => record.ownerEmail !== currentUser.email));
    clearSavedSubjects(currentUser.email);
    resetGeneratorForm();
    renderDashboardStats();
    renderHistory("", "", "");
    els.historySearch.value = "";
    els.classFilter.value = "";
    els.resultFilter.value = "";
    setActiveTab("historyTab");
    alert("Generated data reset successfully.");
  });

  els.profileEditForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;

    const form = event.target;
    const updates = Object.fromEntries(new FormData(form).entries());
    updates.schoolLogo = await readSchoolLogoFromForm(form, currentUser.schoolLogo || "");
    delete updates.schoolLogoFile;
    const users = getUsers();
    const idx = users.findIndex((u) => u.email === currentUser.email);
    if (idx < 0) return;

    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
    currentUser = users[idx];
    renderProfile();
    hideProfileEditForm();
    alert("School profile updated.");
  });

  els.deleteProfileBtn.addEventListener("click", () => {
    if (!currentUser) return;
    const approved = window.confirm(
      "Delete profile permanently? This will also delete all generated records for this school."
    );
    if (!approved) return;

    const email = currentUser.email;
    saveUsers(getUsers().filter((u) => u.email !== email));
    saveRecords(getRecords().filter((r) => r.ownerEmail !== email));
    clearSavedSubjects(email);

    currentUser = null;
    clearSession();
    showLanding();
    showAuthCard("login");
    resetGeneratorForm();
    hideProfileEditForm();
    alert("Profile deleted successfully.");
  });

  els.historyList.addEventListener("click", handleHistoryActions);

  if (els.templatePickerGrid) {
    els.templatePickerGrid.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-template-id]");
      if (!button) return;
      const recordId = els.templatePickerModal?.dataset.recordId;
      if (!recordId) return;
      const templateId = button.dataset.templateId;
      setRecordTemplate(recordId, templateId);
      renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
      closeTemplatePicker();
      openPreviewPage(recordId, false, templateId);
    });
  }

  if (els.closeTemplatePickerBtn) {
    els.closeTemplatePickerBtn.addEventListener("click", closeTemplatePicker);
  }

  if (els.templatePickerModal) {
    els.templatePickerModal.addEventListener("click", (event) => {
      if (event.target === els.templatePickerModal) {
        closeTemplatePicker();
      }
    });
  }

  document.querySelectorAll(".tab-btn[data-tab]").forEach((button) => {
    button.addEventListener("click", () => setActiveTab(button.dataset.tab));
  });

  document.getElementById("logoutBtn").addEventListener("click", () => {
    const email = currentUser?.email;
    currentUser = null;
    if (email) {
      clearSavedSubjects(email);
    }
    clearSession();
    showLanding();
    showAuthCard("login");
    resetGeneratorForm();
    hideProfileEditForm();
  });
}

function initSubjectPool() {
  if (els.subjectCheckboxGrid.children.length) return;
  els.subjectCheckboxGrid.innerHTML = SUBJECT_LIBRARY
    .map(
      (subject) => `
      <label class="subject-chip">
        <input type="checkbox" class="subject-check" value="${escapeHTML(subject)}" />
        <span>${escapeHTML(subject)}</span>
      </label>
    `
    )
    .join("");
}

function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  if (!target) return;
  const duration = 1300;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.floor(target * eased));
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = String(target);
    }
  }

  requestAnimationFrame(tick);
}

function initLandingEffects() {
  const revealNodes = document.querySelectorAll(".reveal");
  const counters = document.querySelectorAll(".count-up");
  const runCounters = () => counters.forEach((el) => animateCount(el));

  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("visible"));
    runCounters();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealNodes.forEach((node) => revealObserver.observe(node));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );
  counters.forEach((node) => counterObserver.observe(node));
}

initSubjectPool();
initEvents();
restoreSession();
showAuthCard("login");
updateLivePreview({ obtained: 0, totalMax: 0, percent: 0 });
initLandingEffects();
initLandingEnhancements();
