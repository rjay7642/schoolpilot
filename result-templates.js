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

function buildMarksRows(subjectMarks) {
  return (subjectMarks || [])
    .map(
      (item) => `
      <tr>
        <td>${escapeHTML(item.subject)}</td>
        <td>${formatNumber(item.marks)}</td>
      </tr>
    `
    )
    .join("");
}

function buildStudentGrid(record) {
  return `
    <div class="student-grid student-grid-card">
      <p><strong>Student Name:</strong> ${escapeHTML(record.studentName || "")}</p>
      <p><strong>Father's Name:</strong> ${escapeHTML(record.fatherName || "")}</p>
      <p><strong>Mother's Name:</strong> ${escapeHTML(record.motherName || "")}</p>
      <p><strong>Class:</strong> ${escapeHTML(record.className || "")}</p>
      <p><strong>Roll Number:</strong> ${escapeHTML(record.rollNumber || "")}</p>
      <p><strong>Student Phone:</strong> ${escapeHTML(record.studentPhone || "N/A")}</p>
      <p><strong>Session:</strong> ${escapeHTML(record.session || "")}</p>
    </div>
  `;
}

function buildSummary(record) {
  return `
    <div class="summary-strip">
      <p><strong>Total Max</strong><br>${formatNumber(record.totalMax)}</p>
      <p><strong>Obtained</strong><br>${formatNumber(record.obtained)}</p>
      <p><strong>Percentage</strong><br>${Number(record.percent || 0).toFixed(2)}%</p>
      <p><strong>Grade</strong><br>${escapeHTML(record.grade || "")}</p>
    </div>
  `;
}

function buildFooter(record) {
  return `
    <div class="cert-foot">
      <p><strong>Result:</strong> <span class="result-pill ${record.result === "PASS" ? "pass" : "fail"}">${escapeHTML(record.result || "")}</span></p>
      <p><strong>Date:</strong> ${new Date(record.createdAt).toLocaleDateString()}</p>
      <p><strong>Signature:</strong> Principal</p>
    </div>
  `;
}

function templateOne(record, schoolTitle, logoHTML, marksRows) {
  return `
    <div class="certificate print-area template-certificate template-1" id="printable-${record.id}">
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

      ${buildStudentGrid(record)}

      <table class="marks-table">
        <thead><tr><th>Subject</th><th>Obtained Marks</th></tr></thead>
        <tbody>${marksRows}</tbody>
      </table>

      ${buildSummary(record)}
      ${buildFooter(record)}
    </div>
  `;
}

function templateTwo(record, schoolTitle, logoHTML, marksRows) {
  return `
    <div class="certificate print-area template-certificate template-2" id="printable-${record.id}">
      <div class="template-accent"></div>
      <div class="t2-head">
        <div class="t2-brand">
          ${logoHTML}
          <div>
            <p class="t2-kicker">Academic Excellence Document</p>
            <h2>${schoolTitle}</h2>
            <p>${escapeHTML(record.location || "")}</p>
          </div>
        </div>
        <div class="t2-meta">
          <p><strong>Session</strong><span>${escapeHTML(record.session || "")}</span></p>
          <p><strong>Principal</strong><span>${escapeHTML(record.principalName || "")}</span></p>
        </div>
      </div>

      <h3 class="template-title">Student Performance Statement</h3>
      ${buildStudentGrid(record)}

      <table class="marks-table">
        <thead><tr><th>Subject</th><th>Obtained Marks</th></tr></thead>
        <tbody>${marksRows}</tbody>
      </table>

      ${buildSummary(record)}
      ${buildFooter(record)}
    </div>
  `;
}

function templateThree(record, schoolTitle, logoHTML, marksRows) {
  return `
    <div class="certificate print-area template-certificate template-3" id="printable-${record.id}">
      <div class="t3-head">
        <div class="t3-left">
          ${logoHTML}
          <div>
            <p class="t3-kicker">Premium Result Ledger</p>
            <h2>${schoolTitle}</h2>
          </div>
        </div>
        <div class="t3-right">
          <p>${escapeHTML(record.location || "")}</p>
          <p>Principal: ${escapeHTML(record.principalName || "")}</p>
          <p>Mobile: ${escapeHTML(record.schoolMobile || "")}</p>
        </div>
      </div>

      <h3 class="template-title">Annual Academic Record</h3>
      ${buildStudentGrid(record)}

      <table class="marks-table">
        <thead><tr><th>Subject</th><th>Obtained Marks</th></tr></thead>
        <tbody>${marksRows}</tbody>
      </table>

      ${buildSummary(record)}
      ${buildFooter(record)}
    </div>
  `;
}

function templateFour(record, schoolTitle, logoHTML, marksRows) {
  return `
    <div class="certificate print-area template-certificate template-4" id="printable-${record.id}">
      <div class="t4-corner"></div>
      <div class="t4-head">
        <p class="t4-kicker">Institutional Certificate</p>
        <div class="t4-brand-row">
          ${logoHTML}
          <h2>${schoolTitle}</h2>
        </div>
        <p class="t4-sub">${escapeHTML(record.location || "")}</p>
      </div>

      <h3 class="template-title">Official Student Marksheet</h3>
      ${buildStudentGrid(record)}

      <table class="marks-table">
        <thead><tr><th>Subject</th><th>Obtained Marks</th></tr></thead>
        <tbody>${marksRows}</tbody>
      </table>

      ${buildSummary(record)}
      ${buildFooter(record)}
    </div>
  `;
}

function templateFive(record, schoolTitle, logoHTML, marksRows) {
  return `
    <div class="certificate print-area template-certificate template-5" id="printable-${record.id}">
      <div class="t5-band">
        <div class="t5-brand">
          ${logoHTML}
          <div>
            <h2>${schoolTitle}</h2>
            <p>Session ${escapeHTML(record.session || "")}</p>
          </div>
        </div>
        <p>${escapeHTML(record.location || "")}</p>
      </div>

      <h3 class="template-title">Consolidated Result Transcript</h3>
      ${buildStudentGrid(record)}

      <table class="marks-table">
        <thead><tr><th>Subject</th><th>Obtained Marks</th></tr></thead>
        <tbody>${marksRows}</tbody>
      </table>

      ${buildSummary(record)}
      ${buildFooter(record)}
    </div>
  `;
}

function createCertificateHTML(record, templateId) {
  const schoolTitle = escapeHTML((record.schoolName || "").toUpperCase());
  const logoSource = record.schoolLogo || "";
  const logoHTML = logoSource
    ? `<img class="cert-school-logo" src="${escapeHTML(logoSource)}" alt="School logo" />`
    : "";
  const marksRows = buildMarksRows(record.subjectMarks || []);

  if (templateId === "template-2") return templateTwo(record, schoolTitle, logoHTML, marksRows);
  if (templateId === "template-3") return templateThree(record, schoolTitle, logoHTML, marksRows);
  if (templateId === "template-4") return templateFour(record, schoolTitle, logoHTML, marksRows);
  if (templateId === "template-5") return templateFive(record, schoolTitle, logoHTML, marksRows);
  return templateOne(record, schoolTitle, logoHTML, marksRows);
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
  const templateId = document.body.dataset.templateId || "template-1";

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

  document.getElementById("previewContent").innerHTML = createCertificateHTML(record, templateId);
  document.title = `${record.studentName || "Result"} | ${templateId.toUpperCase()}`;

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
