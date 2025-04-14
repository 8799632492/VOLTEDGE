// script.js
const supabase = supabase.createClient('https://roiwbbvstsqvbactegaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaXdiYnZzdHNxdmJhY3RlZ2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTMwMTksImV4cCI6MjA2MDE4OTAxOX0.nS252aJ5abaaH-Eged99uHjEmBxSzZuqqdxhqAkrNhU');

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
    }, 2000);
});

// Authentication
const authModal = document.getElementById('authModal');
const authBtn = document.getElementById('authBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const googleLogin = document.getElementById('googleLogin');
const userMenu = document.getElementById('userMenu');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

authBtn.addEventListener('click', () => {
    authModal.classList.remove('hidden');
});

closeAuthModal.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        document.getElementById('loginMessage').textContent = error.message;
    } else {
        authModal.classList.add('hidden');
        updateUserUI();
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
    });
    if (error) {
        document.getElementById('signupMessage').textContent = error.message;
    } else {
        document.getElementById('signupMessage').textContent = 'Check your email for confirmation.';
    }
});

googleLogin.addEventListener('click', async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
});

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    updateUserUI();
});

function updateUserUI() {
    const user = supabase.auth.user();
    if (user) {
        authBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userName.textContent = user.user_metadata.full_name || 'User';
        document.getElementById('dashboard').classList.toggle('hidden', !user.user_metadata.is_admin);
    } else {
        authBtn.classList.remove('hidden');
        userMenu.classList.add('hidden');
    }
}

supabase.auth.onAuthStateChange((event, session) => {
    updateUserUI();
});

// Mobile Menu
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
});

// Tab Navigation (Materials, Admin Dashboard)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.closest('section').querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
            if (content.id === `${tab}Tab` || content.id === `${tab}Content`) {
                content.classList.remove('hidden');
            }
        });
    });
});

// Ohm's Law Calculator
document.getElementById('ohmsLawForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const known = document.getElementById('knownQuantity').value;
    let result;
    if (known === 'voltage') {
        const current = parseFloat(document.getElementById('currentInput').value);
        const resistance = parseFloat(document.getElementById('resistanceInput').value);
        result = current * resistance;
        document.getElementById('ohmsLawResult').innerHTML = `<h4>Result:</h4><div class="text-xl">${result.toFixed(2)} V</div>`;
    } else if (known === 'current') {
        const voltage = parseFloat(document.getElementById('voltageInput1').value);
        const resistance = parseFloat(document.getElementById('resistanceInput1').value);
        result = voltage / resistance;
        document.getElementById('ohmsLawResult').innerHTML = `<h4>Result:</h4><div class="text-xl">${result.toFixed(2)} A</div>`;
    } else {
        const voltage = parseFloat(document.getElementById('voltageInput2').value);
        const current = parseFloat(document.getElementById('currentInput2').value);
        result = voltage / current;
        document.getElementById('ohmsLawResult').innerHTML = `<h4>Result:</h4><div class="text-xl">${result.toFixed(2)} Ω</div>`;
    }
});

document.getElementById('knownQuantity').addEventListener('change', (e) => {
    const value = e.target.value;
    document.querySelectorAll('.voltage-inputs, .current-inputs, .resistance-inputs').forEach(div => {
        div.classList.add('hidden');
    });
    document.querySelector(`.${value}-inputs`).classList.remove('hidden');
});

// PDF Viewer
let pdfDoc = null, pageNum = 1, pageRendering = false, pageNumPending = null;
const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        page.render({ canvasContext: ctx, viewport }).promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
        document.getElementById('pageInfo').textContent = `Page ${num} of ${pdfDoc.numPages}`;
    });
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (pageNum <= 1) return;
    pageNum--;
    renderPage(pageNum);
});

document.getElementById('nextPage').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    renderPage(pageNum);
});

document.getElementById('closePdf').addEventListener('click', () => {
    document.getElementById('pdfModal').classList.add('hidden');
});

// Sample content loading (replace with Supabase queries)
async function loadMaterials(subject) {
    // Mock data (replace with Supabase query)
    const materials = [
        { id: 1, title: `${subject} Basics`, url: 'sample.pdf', description: 'Introduction to concepts' }
    ];
    const contentDiv = document.getElementById(`${subject}Content`);
    contentDiv.innerHTML = materials.map(m => `
        <div class="bg-gray-700 p-4 rounded-lg">
            <h3 class="text-lg font-bold">${m.title}</h3>
            <p class="text-gray-400">${m.description}</p>
            <button onclick="openPdf('${m.url}', '${m.title}')" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">View</button>
        </div>
    `).join('');
}

function openPdf(url, title) {
    document.getElementById('pdfModal').classList.remove('hidden');
    document.getElementById('pdfTitle').textContent = title;
    pdfjsLib.getDocument(url).promise.then(doc => {
        pdfDoc = doc;
        pageNum = 1;
        renderPage(pageNum);
    }).catch(err => {
        console.error('PDF Load Error:', err);
    });
}

// Initialize
loadMaterials('ewec');