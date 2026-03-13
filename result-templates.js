const STORAGE_KEYS = {
  session: "schoolpilot_session",
  records: "schoolpilot_records"
};

function escapeHTML(value) {
  return String(value || "")
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
  return Number(value || 0).toFixed(2).replace(/\.00$/, "");
}

// Global Elite Print Styling Bridge
const PRINT_STYLES = `
  style="
    display: flex; 
    align-items: center; 
    justify-content: flex-start; 
    text-align: left; 
    gap: 20px;
    margin-bottom: 15px;
  "
`;

function buildMarksRows(subjectMarks) {
  return (subjectMarks || [])
    .map(
      (item) => `
      <tr>
        <td style="text-align: left; padding-left: 15px;">${escapeHTML(item.subject)}</td>
        <td style="font-weight: 700;">${formatNumber(item.marks)}</td>
      </tr>
    `
    )
    .join("");
}

function buildStudentGrid(record) {
  return `
    <div class="student-grid student-grid-card" style="margin-bottom: 15px;">
      <p><strong>Student Name:</strong> ${escapeHTML(record.studentName)}</p>
      <p><strong>Father's Name:</strong> ${escapeHTML(record.fatherName)}</p>
      <p><strong>Mother's Name:</strong> ${escapeHTML(record.motherName || "N/A")}</p>
      <p><strong>Class:</strong> ${escapeHTML(record.className)}</p>
      <p><strong>Roll Number:</strong> ${escapeHTML(record.rollNumber)}</p>
      <p><strong>Session:</strong> ${escapeHTML(record.session)}</p>
    </div>
  `;
}

function templateOne(record) {
  const schoolTitle = escapeHTML(record.schoolName).toUpperCase();
  const logoSource = record.schoolLogo || "";
  const logoHTML = logoSource 
    ? `<img src="${escapeHTML(logoSource)}" style="width: 85px; height: 85px; border-radius: 12px; object-fit: cover; border: 3px solid #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />`
    : "";
  const marksRows = buildMarksRows(record.subjectMarks);

  return `
    <div class="certificate print-area" id="printable-${record.id}">
      <div style="padding: 40px; background: white; min-height: 297mm; border: 15px solid #0f5a95; box-sizing: border-box;">
        <!-- Header -->
        <div style="background: #f0f7ff; padding: 25px; border-radius: 8px; border: 1px solid #d1e2f5; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
             <span style="background: #0f5a95; color: white; padding: 4px 12px; border-radius: 4px; font-weight: 800; font-size: 0.75rem;">${escapeHTML(record.examType || "OFFICIAL TRANSCRIPT")}</span>
             <span style="font-weight: 800; color: #0f5a95; font-size: 0.7rem;">REF: ${record.id.slice(-8).toUpperCase()}</span>
          </div>

          <div style="display: flex; align-items: center; gap: 20px;">
            ${logoHTML}
            <div>
              <h2 style="margin: 0; font-size: 2rem; color: #0a3f70; font-family: 'DM Serif Display', serif;">${schoolTitle}</h2>
              <p style="margin: 5px 0 0; color: #476a8a; font-weight: 600;">${escapeHTML(record.location)}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #d1e2f5; display: flex; gap: 25px; font-size: 0.85rem; color: #2a4e6e;">
            <span><strong>Principal:</strong> ${escapeHTML(record.principalName)}</span>
            <span><strong>School Mobile:</strong> ${escapeHTML(record.schoolMobile)}</span>
          </div>
        </div>

        <h3 style="text-align: center; font-family: 'DM Serif Display', serif; color: #0f5a95; font-size: 1.5rem; margin-bottom: 25px;">Academic Performance Ledger</h3>

        ${buildStudentGrid(record)}

        <table style="width: 100%; border-collapse: collapse; margin: 25px 0; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background: #0f5a95; color: white;">
              <th style="padding: 12px; text-align: left; padding-left: 20px;">Subject Details</th>
              <th style="padding: 12px; width: 100px; text-align: center;">Marks</th>
            </tr>
          </thead>
          <tbody>
            ${marksRows}
          </tbody>
        </table>

        <div style="display: flex; gap: 20px; margin-top: 30px;">
          <div style="flex: 1.5; background: #f8fbff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div><small>Max Marks</small><br><span style="font-size: 1.2rem; color: #0f5a95;">${formatNumber(record.totalMax)}</span></div>
            <div><small>Obtained</small><br><span style="font-size: 1.2rem; color: #0f5a95;">${formatNumber(record.obtained)}</span></div>
            <div><small>Percentage</small><br><span style="font-size: 1.2rem; color: #0f5a95;">${Number(record.percent || 0).toFixed(2)}%</span></div>
            <div><small>Grade</small><br><span style="font-size: 1.2rem; color: #0f5a95;">${escapeHTML(record.grade)}</span></div>
          </div>
          <div style="flex: 1; border: 2px solid #0f5a95; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 15px;">
            <p style="margin: 0; font-size: 0.75rem; text-transform: uppercase;">Final Status</p>
            <h2 style="margin: 5px 0; font-size: 2rem; color: ${record.result === "PASS" ? "#059669" : "#dc2626"}; font-family: 'DM Serif Display', serif;">${record.result}</h2>
            <p style="margin: 0; font-size: 0.75rem;">Session ${record.session}</p>
          </div>
        </div>

        <div style="margin-top: 50px; display: flex; justify-content: space-between; align-items: flex-end;">
          <div style="font-size: 0.8rem; color: #64748b;">
            Issued on: ${new Date(record.createdAt).toLocaleDateString()}<br>
            System Generated Academic Transcript
          </div>
          <div style="text-align: center; border-top: 1.5px solid #0f172a; min-width: 180px; padding-top: 5px;">
            <strong style="font-size: 0.75rem; text-transform: uppercase;">Principal Signature</strong>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function downloadAsPDF(record) {
  const element = document.getElementById(`printable-${record.id}`);
  if (!element) return;

  const btn = document.getElementById("downloadPdfBtn");
  if (btn) btn.innerText = "Generating...";

  try {
    const opt = {
      margin: 0,
      filename: `${record.studentName}_Result.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        scrollX: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Create a worker to handle the conversion
    const worker = html2pdf().set(opt).from(element);
    await worker.save();
    
  } catch (err) {
    console.error("PDF Export failed:", err);
    alert("PDF generation failed. Using browser print instead.");
    window.print();
  } finally {
    if (btn) btn.innerText = "Download PDF";
  }
}

function initPreview() {
  const params = new URLSearchParams(window.location.search);
  const recordId = params.get("id");
  const shouldPrint = params.get("print") === "1";
  const session = parseSession();

  if (!recordId) {
    document.getElementById("previewError").classList.remove("hidden");
    document.getElementById("errorMsg").textContent = "No Record ID found.";
    return;
  }

  if (!session?.email) {
    document.getElementById("previewError").classList.remove("hidden");
    document.getElementById("errorMsg").textContent = "Session expired. Please login.";
    return;
  }

  const record = getRecords().find(r => r.id === recordId && r.ownerEmail === session.email);
  if (!record) {
    document.getElementById("previewError").classList.remove("hidden");
    document.getElementById("errorMsg").textContent = "Result record not found.";
    return;
  }

  // Inject Template 1 (Professional Side-Logo Engine)
  document.getElementById("previewContent").innerHTML = templateOne(record);
  document.title = `${record.studentName} - Official Result`;

  // Setup PDF button
  document.getElementById("downloadPdfBtn")?.addEventListener("click", () => downloadAsPDF(record));

  if (shouldPrint) {
    setTimeout(() => window.print(), 500);
  }
}

document.getElementById("printBtn")?.addEventListener("click", () => window.print());

initPreview();
