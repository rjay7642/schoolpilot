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
  profileCard: document.getElementById("profileCard"),
  certificateForm: document.getElementById("certificateForm"),
  totalMarks: document.getElementById("totalMarks"),
  percentage: document.getElementById("percentage"),
  resultPreview: document.getElementById("resultPreview"),
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
  deleteProfileBtn: document.getElementById("deleteProfileBtn"),
  profileEditForm: document.getElementById("profileEditForm"),
  cancelProfileEditBtn: document.getElementById("cancelProfileEditBtn")
};

let currentUser = null;
let selectedSubjects = [];

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

  els.profileCard.innerHTML = `
    <p><strong>School Name:</strong> ${escapeHTML(currentUser.schoolName)}</p>
    <p><strong>Admin Name:</strong> ${escapeHTML(currentUser.adminName)}</p>
    <p><strong>Phone:</strong> ${escapeHTML(currentUser.phone)}</p>
    <p><strong>Location:</strong> ${escapeHTML(currentUser.location)}</p>
    <p><strong>Principal:</strong> ${escapeHTML(currentUser.principalName)}</p>
    <p><strong>School Mobile:</strong> ${escapeHTML(currentUser.schoolMobile)}</p>
    <p><strong>Email:</strong> ${escapeHTML(currentUser.email)}</p>
  `;

  if (els.profileEditForm) {
    els.profileEditForm.elements.schoolName.value = currentUser.schoolName || "";
    els.profileEditForm.elements.adminName.value = currentUser.adminName || "";
    els.profileEditForm.elements.phone.value = currentUser.phone || "";
    els.profileEditForm.elements.location.value = currentUser.location || "";
    els.profileEditForm.elements.principalName.value = currentUser.principalName || "";
    els.profileEditForm.elements.schoolMobile.value = currentUser.schoolMobile || "";
    els.profileEditForm.elements.passwordHint.value = currentUser.passwordHint || "";
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

  return {
    obtained,
    totalMax,
    percent
  };
}

function createCertificateHTML(record) {
  const marksRows = record.subjectMarks
    .map(
      (item) => `
      <tr>
        <td>${escapeHTML(item.subject)}</td>
        <td>${Number(item.marks).toFixed(2).replace(/\.00$/, "")}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="certificate print-area" id="printable-${record.id}">
      <div class="cert-watermark">${escapeHTML(record.schoolName)}</div>
      <div class="cert-watermark wm-2">${escapeHTML(record.schoolName)}</div>
      <div class="cert-ribbon">Academic Session ${escapeHTML(record.session)}</div>
      <div class="cert-header">
        <p class="cert-kicker">Certified Academic Transcript</p>
        <h2 class="cert-title">${escapeHTML(record.schoolName)}</h2>
        <p class="cert-sub">${escapeHTML(record.location)}</p>
        <p class="cert-sub">Principal: ${escapeHTML(record.principalName)} | School Mobile: ${escapeHTML(record.schoolMobile)}</p>
        <h3>Official Result-Certificate</h3>
      </div>

      <div class="student-grid student-grid-card">
        <p><strong>Student Name:</strong> ${escapeHTML(record.studentName)}</p>
        <p><strong>Father's Name:</strong> ${escapeHTML(record.fatherName)}</p>
        <p><strong>Class:</strong> ${escapeHTML(record.className)}</p>
        <p><strong>Roll Number:</strong> ${escapeHTML(record.rollNumber)}</p>
        <p><strong>Student Phone:</strong> ${escapeHTML(record.studentPhone || "N/A")}</p>
        <p><strong>Session:</strong> ${escapeHTML(record.session)}</p>
      </div>

      <table class="marks-table">
        <thead>
          <tr><th>Subject</th><th>Obtained Marks</th></tr>
        </thead>
        <tbody>
          ${marksRows}
        </tbody>
      </table>

      <div class="summary-strip">
        <p><strong>Total Max</strong><br>${Number(record.totalMax).toFixed(2).replace(/\.00$/, "")}</p>
        <p><strong>Obtained</strong><br>${Number(record.obtained).toFixed(2).replace(/\.00$/, "")}</p>
        <p><strong>Percentage</strong><br>${record.percent.toFixed(2)}%</p>
        <p><strong>Grade</strong><br>${escapeHTML(record.grade)}</p>
      </div>

      <div class="cert-foot">
        <p><strong>Result:</strong> <span class="result-pill ${record.result === "PASS" ? "pass" : "fail"}">${escapeHTML(record.result)}</span></p>
        <p><strong>Date:</strong> ${new Date(record.createdAt).toLocaleDateString()}</p>
        <p><strong>Signature:</strong> Principal</p>
      </div>
    </div>
  `;
}

function downloadRecord(record) {
  const fullDoc = `<!doctype html><html><head><meta charset="UTF-8"><title>${escapeHTML(
    record.studentName
  )} Result</title><link rel="stylesheet" href="styles.css"></head><body>${createCertificateHTML(record)}</body></html>`;
  const blob = new Blob([fullDoc], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${record.studentName.replace(/\s+/g, "_")}_result.html`;
  link.click();
  URL.revokeObjectURL(url);
}

function renderPreview(record) {
  els.resultPreview.classList.remove("hidden");
  els.resultPreview.innerHTML = `${createCertificateHTML(record)}
    <div class="result-actions">
      <button type="button" class="btn btn-primary" id="printBtn">Print</button>
      <button type="button" class="btn btn-soft" id="downloadBtn">Download</button>
    </div>
  `;

  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("downloadBtn").addEventListener("click", () => downloadRecord(record));
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
  els.dashTotalRecords.textContent = String(all.length);
  els.dashTodayRecords.textContent = String(todayCount);
}

function buildHistoryCard(record) {
  return `
    <div class="history-item">
      <div>
        <strong>${escapeHTML(record.studentName)}</strong> (${escapeHTML(record.className)}) - Roll ${escapeHTML(record.rollNumber)}<br>
        <small>${new Date(record.createdAt).toLocaleString()} | ${record.percent.toFixed(2)}% | ${escapeHTML(record.result)}</small>
      </div>
      <div class="history-actions">
        <button class="btn btn-soft" data-action="preview" data-id="${record.id}">Preview</button>
        <button class="btn btn-primary" data-action="print" data-id="${record.id}">Print</button>
        <button class="btn btn-ghost" data-action="download" data-id="${record.id}">Download</button>
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
  const all = getRecords().filter((record) => record.ownerEmail === currentUser?.email);
  populateClassFilter(all);

  const filtered = all.filter((record) => {
    const byName = record.studentName.toLowerCase().includes(nameFilter.toLowerCase());
    const byClass = !classFilter || record.className === classFilter;
    const byResult = !resultFilter || record.result === resultFilter;
    return byName && byClass && byResult;
  });

  if (!filtered.length) {
    els.historyList.innerHTML = "<p>No records found.</p>";
    return;
  }

  els.historyList.innerHTML = filtered
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(buildHistoryCard)
    .join("");
}

function handleHistoryActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const record = getRecords().find((item) => item.id === button.dataset.id);
  if (!record) return;

  if (button.dataset.action === "preview") {
    setActiveTab("generateTab");
    renderPreview(record);
  }

  if (button.dataset.action === "print") {
    setActiveTab("generateTab");
    renderPreview(record);
    window.print();
  }

  if (button.dataset.action === "download") {
    downloadRecord(record);
  }
}

function showDashboard() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("features").classList.add("hidden");
  document.getElementById("authArea").classList.add("hidden");
  els.dashboard.classList.remove("hidden");
  renderProfile();
  applySavedSubjectsForCurrentUser();
  renderDashboardStats();
  renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
}

function showLanding() {
  document.getElementById("home").classList.remove("hidden");
  document.getElementById("features").classList.remove("hidden");
  document.getElementById("authArea").classList.remove("hidden");
  els.dashboard.classList.add("hidden");
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

  els.registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.target).entries());
    registerUser(payload);
    event.target.reset();
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
      studentName: formData.studentName,
      fatherName: formData.fatherName,
      className: formData.className,
      rollNumber: formData.rollNumber,
      studentPhone: formData.studentPhone,
      session: formData.session,
      totalMax,
      obtained,
      percent,
      grade,
      result,
      subjectMarks,
      createdAt: new Date().toISOString()
    };

    upsertRecord(record);
    renderDashboardStats();
    renderPreview(record);
    renderHistory(els.historySearch.value || "", els.classFilter.value || "", els.resultFilter.value || "");
    alert("Certificate generated and saved in history.");
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

  els.profileEditForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!currentUser) return;

    const updates = Object.fromEntries(new FormData(event.target).entries());
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
    els.resultPreview.classList.add("hidden");
    els.resultPreview.innerHTML = "";
    alert("Profile deleted successfully.");
  });

  els.historyList.addEventListener("click", handleHistoryActions);

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
    els.resultPreview.classList.add("hidden");
    els.resultPreview.innerHTML = "";
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
initLandingEffects();
