/**
 * API Handler - Production Version (Peer Assessment V14)
 * Worldwhite Enterprise
 * * Pastikan URL Script di bawah ini adalah URL '/exec' dari deployment terbaru.
 */

// GANTI URL DI BAWAH INI DENGAN URL DEPLOYMENT GOOGLE APPS SCRIPT ANDA
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzDT1JtB9ec3y2qGXOL6q9Xxq8gbkmBj4spzVxPB8RSRy8DZxzZaUigMPqEEXIWDJN55g/exec'; 

/**
 * 1. MENGAMBIL DATA KARYAWAN (Untuk Dropdown Assessor & Target)
 */
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

/**
 * 2. MENGAMBIL DATA PASANGAN YANG SUDAH DINILAI (Untuk Cek Duplikasi)
 */
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

/**
 * 3. MENGAMBIL DAFTAR PERTANYAAN
 */
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

/**
 * 4. MENYIMPAN DATA PENILAIAN (SUBMIT)
 * [RESTORED] Menggunakan mode: 'no-cors' agar data terkirim tanpa error di GitHub Pages.
 * Backend akan menangani pengiriman email secara otomatis setelah data diterima.
 */
async function saveToGoogleSheet(payload) {
    payload.action = 'submit'; 
    const btn = document.querySelector('.btn-submit-final');
    if(btn) { 
        btn.disabled = true; 
        btn.innerText = "Submitting Review..."; 
    }
    
    try {
        // Mode 'no-cors' mengirim request "opaque". Kita tidak bisa membaca respons JSON.
        // Tapi ini menjamin data terkirim meski lintas domain.
        await fetch(SCRIPT_URL, { 
            method: 'POST', 
            mode: 'no-cors', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        
        console.log("Submission sent (Blind Mode).");
        return { status: 'success' };
    } catch (error) { 
        console.error("Save Error:", error);
        // Alert error hanya jika benar-benar gagal koneksi
        alert("Gagal terhubung ke server. Cek koneksi internet Anda.");
        return { status: 'error' }; 
    } finally { 
        if(btn) { 
            btn.disabled = false; 
            btn.innerText = "View Results"; 
        } 
    }
}

/**
 * 5. MENCARI RIWAYAT (HISTORY CHECK)
 */
async function fetchUserHistory(email, phone) {
    try {
        const payload = { 
            action: 'get_history', 
            email: email, 
            phone: phone 
        };
        
        // Fetch History tetap butuh baca JSON, jadi gunakan standard fetch.
        // Google Apps Script 'Anyone' deployment mendukung CORS untuk ini.
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { 
        return { status: 'error', message: "Failed to fetch history." }; 
    }
}

/**
 * 6. MENGAMBIL DETAIL JAWABAN (DETAIL VIEW)
 */
async function fetchSubmissionDetails(submissionId) {
    try {
        const payload = { 
            action: 'get_submission_details', 
            id: submissionId 
        };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { 
        return { status: 'error', message: "Failed to load details." }; 
    }
}

/**
 * 7. DOWNLOAD PDF HASIL
 */
async function requestDownloadPdf(submissionId) {
    try {
        const payload = { 
            action: 'download_pdf', 
            id: submissionId 
        };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { 
        return { status: 'error', message: "Download failed." }; 
    }
}

/**
 * 8. KIRIM ULANG EMAIL (MANUAL RESEND)
 */
async function requestResendEmail(submissionId) {
    try {
        const payload = { 
            action: 'resend_email', 
            id: submissionId 
        };
        const response = await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: JSON.stringify(payload), 
            headers: { "Content-Type": "text/plain" } 
        });
        return await response.json();
    } catch (error) { 
        return { status: 'error', message: "Email resend failed." }; 
    }
}
