const STORAGE_KEYS = {
  session: "schoolpilot_session",
  records: "schoolpilot_records"
};

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function parseSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || "null");
}

function getRecords() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.records) || "[]");
}

function formatNumber(value) {
  return Number(value).toFixed(2).replace(/\.00$/, "");
}

function createCertificateHTML(record) {
  const schoolTitle = escapeHTML((record.schoolName || "").toUpperCase());
  const logoSource = record.schoolLogo || "";
  const logoHTML = logoSource
    ? `<img class="cert-school-logo" src="${escapeHTML(logoSource)}" alt="School logo" />`
    : "";

  const marksRows = (record.subjectMarks || [])
    .map(
      (item) => `
      <tr>
        <td>${escapeHTML(item.subject)}</td>
        <td>${formatNumber(item.marks)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <div class="certificate print-area" id="printable-${record.id}">
      <div class="cert-watermark">${schoolTitle}</div>
      <div class="cert-watermark wm-2">${schoolTitle}</div>
      <div class="cert-ribbon">Academic Session ${escapeHTML(record.session || "")}</div>

      <div class="cert-header">
        <div class="cert-branding">
          ${logoHTML}
          <div class="cert-brand-copy">
            <p class="cert-kicker">Certified Academic Transcript</p>
            <h2 class="cert-title">${schoolTitle}</h2>
          </div>
        </div>
        <p class="cert-sub">${escapeHTML(record.location || "")}</p>
        <p class="cert-sub">Principal: ${escapeHTML(record.principalName || "")} | School Mobile: ${escapeHTML(record.schoolMobile || "")}</p>
        <h3>Official Result-Certificate</h3>
      </div>

      <div class="student-grid student-grid-card">
        <p><strong>Student Name:</strong> ${escapeHTML(record.studentName || "")}</p>
        <p><strong>Father's Name:</strong> ${escapeHTML(record.fatherName || "")}</p>
        <p><strong>Mother's Name:</strong> ${escapeHTML(record.motherName || "")}</p>
        <p><strong>Class:</strong> ${escapeHTML(record.className || "")}</p>
        <p><strong>Roll Number:</strong> ${escapeHTML(record.rollNumber || "")}</p>
        <p><strong>Student Phone:</strong> ${escapeHTML(record.studentPhone || "N/A")}</p>
        <p><strong>Session:</strong> ${escapeHTML(record.session || "")}</p>
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
        <p><strong>Total Max</strong><br>${formatNumber(record.totalMax)}</p>
        <p><strong>Obtained</strong><br>${formatNumber(record.obtained)}</p>
        <p><strong>Percentage</strong><br>${Number(record.percent || 0).toFixed(2)}%</p>
        <p><strong>Grade</strong><br>${escapeHTML(record.grade || "")}</p>
      </div>

      <div class="cert-foot">
        <p><strong>Result:</strong> <span class="result-pill ${record.result === "PASS" ? "pass" : "fail"}">${escapeHTML(record.result || "")}</span></p>
        <p><strong>Date:</strong> ${new Date(record.createdAt).toLocaleDateString()}</p>
        <p><strong>Signature:</strong> Principal</p>
      </div>
    </div>
  `;
}

function showError(message) {
  const error = document.getElementById("previewError");
  const content = document.getElementById("previewContent");
  error.textContent = message;
  error.classList.remove("hidden");
  content.innerHTML = "";
  document.getElementById("printBtn").disabled = true;
}

function initPreview() {
  const params = new URLSearchParams(window.location.search);
  const recordId = params.get("id");
  const shouldPrint = params.get("print") === "1";
  const session = parseSession();

  if (!recordId) {
    showError("Missing record ID. Please open preview from history.");
    return;
  }

  if (!session?.email) {
    showError("Login session not found. Please login again from dashboard.");
    return;
  }

  const record = getRecords().find((item) => item.id === recordId && item.ownerEmail === session.email);
  if (!record) {
    showError("Result record not found for this school account.");
    return;
  }

  document.getElementById("previewContent").innerHTML = createCertificateHTML(record);

  if (shouldPrint) {
    window.setTimeout(() => window.print(), 250);
  }
}

function initEvents() {
  document.getElementById("printBtn").addEventListener("click", () => window.print());
  document.getElementById("openDashboardBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

initEvents();
initPreview();
