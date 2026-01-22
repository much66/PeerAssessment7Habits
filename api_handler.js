/**
 * API Handler - Production Version (Peer Assessment V14)
 * Worldwhite Enterprise
 * * Pastikan URL Script di bawah ini adalah URL '/exec' dari deployment terbaru.
 */

// GANTI URL DI BAWAH INI DENGAN URL DEPLOYMENT GOOGLE APPS SCRIPT ANDA
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyIn9PYBizOntMkDumCKf4oAhejp03pRCNqzcbq6xvYGMOPui0qUyBqMQcGhdWmJ5FQ/exec'; 

async function fetchEmployees() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) return [];
    try {
        const response = await fetch(`${SCRIPT_URL}?type=employees`);
        const result = await response.json();
        return result.status === 'success' ? result.data : [];
    } catch (error) {
        console.error("Load Employees Error:", error);
        return [];
    }
}

async function fetchSubmittedPairs() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) return [];
    try {
        const response = await fetch(`${SCRIPT_URL}?type=submitted`);
        const result = await response.json();
        return result.status === 'success' ? result.data : [];
    } catch (error) {
        return [];
    }
}

async function fetchQuestionsFromSheet() {
    if (!SCRIPT_URL || SCRIPT_URL.includes('/dev')) return [];
    try { 
        const response = await fetch(SCRIPT_URL); 
        const result = await response.json(); 
        return result.status === 'success' ? result.data : []; 
    } catch (error) { 
        return []; 
    }
}

async function saveToGoogleSheet(payload) {
    payload.action = 'submit'; 
    const btn = document.querySelector('.btn-submit-final');
    if(btn) { 
        btn.disabled = true; 
        btn.innerText = "Submitting Review..."; 
    }
    
    try {
        // [PERBAIKAN] Menggunakan fetch standar (tanpa no-cors)
        // Agar kita bisa mendapatkan balasan 'id' dari server untuk tombol Download PDF
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        
        const result = await response.json();
        console.log("Submission sent. ID:", result.id);
        return result; 

    } catch (error) { 
        console.error("Save Error:", error);
        alert("Gagal terhubung. Pastikan script dideploy sebagai 'Anyone'.");
        return { status: 'error' }; 
    } finally { 
        if(btn) { 
            btn.disabled = false; 
            btn.innerText = "View Results"; 
        } 
    }
}

async function fetchUserHistory(email, phone) {
    try {
        const payload = { action: 'get_history', email: email, phone: phone };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { return { status: 'error', message: "Failed to fetch history." }; }
}

async function fetchSubmissionDetails(submissionId) {
    try {
        const payload = { action: 'get_submission_details', id: submissionId };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { return { status: 'error', message: "Failed to load details." }; }
}

async function requestDownloadPdf(submissionId) {
    try {
        const payload = { action: 'download_pdf', id: submissionId };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { return { status: 'error', message: "Download failed." }; }
}

async function requestResendEmail(submissionId) {
    try {
        const payload = { action: 'resend_email', id: submissionId };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { return { status: 'error', message: "Email resend failed." }; }
}
