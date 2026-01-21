const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDT1JtB9ec3y2qGXOL6q9Xxq8gbkmBj4spzVxPB8RSRy8DZxzZaUigMPqEEXIWDJN55g/exec'; 

// --- FETCH SUBMITTED PAIRS (DUPLICATE CHECK) ---
async function fetchSubmittedPairs() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) return [];
    try {
        const response = await fetch(`${SCRIPT_URL}?type=submitted`);
        const result = await response.json();
        return result.status === 'success' ? result.data : [];
    } catch (error) { return []; }
}

async function fetchEmployees() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) return [];
    try {
        const response = await fetch(`${SCRIPT_URL}?type=employees`);
        const result = await response.json();
        return result.status === 'success' ? result.data : [];
    } catch (error) { return []; }
}

async function fetchQuestionsFromSheet() {
    try { const response = await fetch(SCRIPT_URL); const result = await response.json(); return result.status === 'success' ? result.data : []; } catch (error) { return []; }
}

async function saveToGoogleSheet(payload) {
    payload.action = 'submit'; 
    const btn = document.querySelector('.btn-submit-final');
    if(btn) { btn.disabled = true; btn.innerText = "Submitting Review..."; }
    try {
        const response = await fetch(SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: JSON.stringify(payload), headers: { "Content-Type": "text/plain" } });
        return { status: 'success' };
    } catch (error) { return { status: 'error' }; } 
    finally { if(btn) { btn.disabled = false; btn.innerText = "View Results"; } }
}

async function fetchUserHistory(email, phone) {
    try {
        const payload = { action: 'get_history', email: email, phone: phone };
        const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), headers: { "Content-Type": "text/plain" } });
        return await response.json();
    } catch (error) { return { status: 'error' }; }
}

async function fetchSubmissionDetails(submissionId) {
    try {
        const payload = { action: 'get_submission_details', id: submissionId };
        const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), headers: { "Content-Type": "text/plain" } });
        return await response.json();
    } catch (error) { return { status: 'error' }; }
}

async function requestDownloadPdf(submissionId) {
    try {
        const payload = { action: 'download_pdf', id: submissionId };
        const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), headers: { "Content-Type": "text/plain" } });
        return await response.json();
    } catch (error) { return { status: 'error' }; }
}

async function requestResendEmail(submissionId) {
    try {
        const payload = { action: 'resend_email', id: submissionId };
        const response = await fetch(SCRIPT_URL, { method: 'POST', body: JSON.stringify(payload), headers: { "Content-Type": "text/plain" } });
        return await response.json();
    } catch (error) { return { status: 'error' }; }
}
