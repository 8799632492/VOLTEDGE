// script.js
const supabase = supabase.createClient('https://roiwbbvstsqvbactegaj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvaXdiYnZzdHNxdmJhY3RlZ2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MTMwMTksImV4cCI6MjA2MDE4OTAxOX0.nS252aJ5abaaH-Eged99uHjEmBxSzZuqqdxhqAkrNhU');



// Initialize
window.addEventListener('load', async () => {
    try {
        await Promise.all([loadMaterials('ewec'), supabase.auth.getSession()]);
        hideLoader();
    } catch (err) {
        console.error('Load Error:', err);
        showLoaderError('Failed to load resources. Please try again.');
        setTimeout(hideLoader, 5000); // Fallback hide after 5s
    }
});

// GSAP Animations
// Header
gsap.from('.animate-header', { y: -50, opacity: 0, duration: 1, ease: 'power2.out' });
gsap.from('.animate-logo', { scale: 0.5, opacity: 0, duration: 1, delay: 0.2 });
gsap.from('.animate-nav', { x: 20, opacity: 0, duration: 0.8, stagger: 0.1, delay: 0.4 });
gsap.from('.animate-button', { scale: 0.8, opacity: 0, duration: 0.8, stagger: 0.2, delay: 0.6 });
gsap.from('.animate-user', { rotate: 360, opacity: 0, duration: 1, delay: 0.8 });

// Mobile Menu
gsap.from('.animate-mobile-menu', { height: 0, opacity: 0, duration: 0.5, ease: 'power2.out', paused: true });
document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
    if (!mobileMenu.classList.contains('hidden')) {
        gsap.fromTo('.animate-mobile-menu', { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.5 });
        gsap.from('.animate-mobile-menu .animate-nav', { x: -20, opacity: 0, stagger: 0.1, duration: 0.5 });
    }
});

// Hero Section
gsap.from('.animate-hero', { y: 50, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 1 });
gsap.from('.animate-hero h1', { scale: 0.8, opacity: 0, duration: 1, delay: 1.2 });
gsap.from('.animate-hero p', { y: 20, opacity: 0, duration: 1, delay: 1.4 });
gsap.from('.animate-hero .animate-button', { scale: 0.5, opacity: 0, stagger: 0.2, duration: 0.8, delay: 1.6 });

// Sections
gsap.utils.toArray('.animate-section').forEach(section => {
    gsap.from(section, {
        y: 50,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none'
        }
    });
    gsap.from(section.querySelectorAll('.animate-heading'), { x: -50, opacity: 0, duration: 0.8, delay: 0.2 });
    gsap.from(section.querySelectorAll('.animate-text'), { y: 20, opacity: 0, duration: 0.8, delay: 0.4 });
    gsap.from(section.querySelectorAll('.animate-button'), { scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.6, delay: 0.6 });
});

// Calculator
gsap.from('.animate-calculator', { scale: 0.9, opacity: 0, duration: 1 });
gsap.from('.animate-subheading', { x: -20, opacity: 0, duration: 0.8, stagger: 0.2 });
gsap.from('.animate-link', { y: 10, opacity: 0, duration: 0.6, stagger: 0.1 });
gsap.from('.animate-label', { x: -10, opacity: 0, duration: 0.5, stagger: 0.1 });
gsap.from('.animate-input, .animate-select', { scale: 0.95, opacity: 0, duration: 0.5, stagger: 0.1 });
gsap.from('.animate-result', { y: 20, opacity: 0, duration: 0.8 });

// Admin Dashboard
gsap.from('.animate-tab', { y: 30, opacity: 0, duration: 0.8, stagger: 0.2 });
gsap.from('.animate-table tr', { x: -30, opacity: 0, duration: 0.6, stagger: 0.1 });

// Footer
gsap.from('.animate-footer', { y: 50, opacity: 0, duration: 1, scrollTrigger: { trigger: '.animate-footer', start: 'top 90%' } });
gsap.from('.animate-footer-item', { scale: 0.9, opacity: 0, duration: 0.8, stagger: 0.2 });

// Modals
gsap.set('.animate-modal', { scale: 0.8, opacity: 0 });
function animateModalOpen(modal) {
    gsap.to(modal.querySelector('.animate-modal'), { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out' });
}
function animateModalClose(modal) {
    gsap.to(modal.querySelector('.animate-modal'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: () => modal.classList.add('hidden')
    });
}

// Sparks Animation
function createSpark(container) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    container.appendChild(spark);
    gsap.to(spark, {
        x: gsap.utils.random(-20, 20),
        y: gsap.utils.random(-20, 20),
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
            gsap.to(spark, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => spark.remove()
            });
        }
    });
}

document.querySelectorAll('.spark-container').forEach(container => {
    container.addEventListener('click', () => createSpark(container));
});

// Loader Animation
gsap.to('.circuit-loader div:nth-child(1), .circuit-loader div:nth-child(3)', {
    scale: 1.5,
    opacity: 0.5,
    duration: 0.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
});
gsap.to('.circuit-loader div:nth-child(2)', {
    backgroundPosition: '100px 0',
    duration: 2,
    repeat: -1,
    ease: 'none'
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
    animateModalOpen(authModal);
});

closeAuthModal.addEventListener('click', () => {
    animateModalClose(authModal);
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        animateModalClose(authModal);
        updateUserUI();
    } catch (error) {
        document.getElementById('loginMessage').textContent = error.message;
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    try {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
        });
        if (error) throw error;
        document.getElementById('signupMessage').textContent = 'Check your email for confirmation.';
    } catch (error) {
        document.getElementById('signupMessage').textContent = error.message;
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
    const { user } = supabase.auth.getUser();
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

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        btn.closest('section').querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
            if (content.id === `${tab}Tab` || content.id === `${tab}Content`) {
                content.classList.remove('hidden');
                gsap.from(content.children, { y: 20, opacity: 0, duration: 0.5, stagger: 0.1 });
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
    gsap.from('#ohmsLawResult', { y: 20, opacity: 0, duration: 0.5 });
});

document.getElementById('knownQuantity').addEventListener('change', (e) => {
    const value = e.target.value;
    document.querySelectorAll('.voltage-inputs, .current-inputs, .resistance-inputs').forEach(div => {
        div.classList.add('hidden');
    });
    const activeInputs = document.querySelector(`.${value}-inputs`);
    activeInputs.classList.remove('hidden');
    gsap.from(activeInputs.children, { x: -20, opacity: 0, duration: 0.5, stagger: 0.1 });
});

// Power Calculator
document.getElementById('powerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const voltage = parseFloat(document.getElementById('voltagePower').value);
    const current = parseFloat(document.getElementById('currentPower').value);
    const result = voltage * current;
    document.getElementById('powerResult').innerHTML = `<h4>Result:</h4><div class="text-xl">${result.toFixed(2)} W</div>`;
    gsap.from('#powerResult', { y: 20, opacity: 0, duration: 0.5 });
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
        gsap.from(canvas, { scale: 0.95, opacity: 0, duration: 0.5 });
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
    animateModalClose(document.getElementById('pdfModal'));
});

// Content Loading (Mock Data)
async function loadMaterials(subject) {
    const contentDiv = document.getElementById(`${subject}Content`);
    const mockData = [
        { id: 1, title: `${subject.toUpperCase()} Basics`, url: 'https://example.com/sample.pdf', description: 'Introduction to concepts' }
    ];
    contentDiv.innerHTML = mockData.map(m => `
        <div class="bg-gray-700 p-4 rounded-lg animate-card">
            <h3 class="text-lg font-bold">${m.title}</h3>
            <p class="text-gray-400">${m.description}</p>
            <button onclick="openPdf('${m.url}', '${m.title}')" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:scale-105 transition-transform animate-button">View</button>
        </div>
    `).join('');
    gsap.from(contentDiv.children, { y: 30, opacity: 0, duration: 0.6, stagger: 0.2 });
}

function openPdf(url, title) {
    const pdfModal = document.getElementById('pdfModal');
    pdfModal.classList.remove('hidden');
    document.getElementById('pdfTitle').textContent = title;
    animateModalOpen(pdfModal);
    pdfjsLib.getDocument(url).promise.then(doc => {
        pdfDoc = doc;
        pageNum = 1;
        renderPage(pageNum);
    }).catch(err => {
        console.error('PDF Load Error:', err);
        document.getElementById('pdfTitle').textContent = 'Failed to load PDF';
    });
}

// Initialize
loadMaterials('ewec');