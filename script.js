// Global State
let currentUser = null;
let isAdmin = false;

// Initialize Supabase
const supabase = window.supabase;

document.addEventListener('DOMContentLoaded', () => initializeApp());

async function initializeApp() {
    try {
        console.log('Initializing app...');
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        if (session) {
            currentUser = session.user;
            isAdmin = session.user.email === 'jalukarmdeep696@gmail.com';
            updateUIAfterAuth();
        }

        await loadContent();
        gsap.to('#loader', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                document.getElementById('loader').style.display = 'none';
                console.log('Loader hidden');
            }
        });

        setupNavigation();
        setupAuth();
        setupTabs();
        setupCalculator();
        setupAdminDashboard();
        setupPDFViewer();
        setupAnimations();
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Initialization failed:', error);
        document.getElementById('loaderError').classList.remove('hidden');
        setTimeout(() => document.getElementById('loader').style.display = 'none', 5000);
    }
}

// Navigation
function setupNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileAuthBtn = document.getElementById('mobileAuthBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        gsap.to(mobileMenu, { height: mobileMenu.classList.contains('hidden') ? 0 : 'auto', duration: 0.3 });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(link.getAttribute('href').substring(1)).scrollIntoView({ behavior: 'smooth' });
            mobileMenu.classList.add('hidden');
        });
    });

    mobileAuthBtn.addEventListener('click', showAuthModal);
    mobileLogoutBtn.addEventListener('click', logout);
}

// Authentication
function setupAuth() {
    const authBtn = document.getElementById('authBtn');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const otpForm = document.getElementById('otpForm');
    const googleLogin = document.getElementById('googleLogin');
    const requestOtp = document.getElementById('requestOtp');
    const tabButtons = document.querySelectorAll('.auth-container .tab-btn');
    const userBtn = document.getElementById('userBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    authBtn.addEventListener('click', showAuthModal);
    closeAuthModal.addEventListener('click', hideAuthModal);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            document.getElementById(`${btn.dataset.tab}Tab`).classList.remove('hidden');
            gsap.from(`#${btn.dataset.tab}Tab`, { opacity: 0, y: 20, duration: 0.5 });
        });
    });

    googleLogin.addEventListener('click', async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'https://<your-github-username>.github.io/<your-repo-name>/' // Update with your GitHub Pages URL
            }
        });
        if (error) {
            document.getElementById('loginMessage').textContent = error.message;
            document.getElementById('loginMessage').classList.add('text-red-500');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            document.getElementById('loginMessage').textContent = error.message;
            document.getElementById('loginMessage').classList.add('text-red-500');
        } else {
            currentUser = data.user;
            isAdmin = email === 'jalukarmdeep696@gmail.com';
            updateUIAfterAuth();
            hideAuthModal();
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: name } }
        });
        if (error) {
            document.getElementById('signupMessage').textContent = error.message;
            document.getElementById('signupMessage').classList.add('text-red-500');
        } else {
            currentUser = data.user;
            isAdmin = false;
            updateUIAfterAuth();
            hideAuthModal();
        }
    });

    requestOtp.addEventListener('click', async () => {
        const email = document.getElementById('loginEmail').value;
        if (!email) {
            document.getElementById('loginMessage').textContent = 'Please enter your email';
            document.getElementById('loginMessage').classList.add('text-red-500');
            return;
        }
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            document.getElementById('loginMessage').textContent = error.message;
            document.getElementById('loginMessage').classList.add('text-red-500');
        } else {
            document.getElementById('loginMessage').textContent = 'OTP sent to your email!';
            document.getElementById('loginMessage').classList.remove('text-red-500');
            document.getElementById('loginMessage').classList.add('text-green-500');
            document.querySelector('.tab-btn[data-tab="otp"]').click();
        }
    });

    otpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const token = document.getElementById('otpCode').value;
        const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
        if (error) {
            document.getElementById('otpMessage').textContent = error.message;
            document.getElementById('otpMessage').classList.add('text-red-500');
        } else {
            currentUser = data.user;
            isAdmin = email === 'jalukarmdeep696@gmail.com';
            updateUIAfterAuth();
            hideAuthModal();
        }
    });

    userBtn.addEventListener('click', () => {
        document.querySelector('.dropdown-menu').classList.toggle('active');
    });

    logoutBtn.addEventListener('click', logout);

    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            isAdmin = session.user.email === 'jalukarmdeep696@gmail.com';
            updateUIAfterAuth();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            isAdmin = false;
            updateUIAfterAuth();
        }
    });
}

function showAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
    gsap.from('#authModal .bg-gray-800', { scale: 0.8, opacity: 0, duration: 0.5 });
}

function hideAuthModal() {
    gsap.to('#authModal .bg-gray-800', { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => {
        document.getElementById('authModal').classList.add('hidden');
    }});
}

async function logout() {
    await supabase.auth.signOut();
    document.querySelector('.dropdown-menu').classList.remove('active');
}

function updateUIAfterAuth() {
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const authBtn = document.getElementById('authBtn');
    const body = document.body;

    if (currentUser) {
        body.classList.add('is-authenticated');
        if (isAdmin) body.classList.add('is-admin');
        userMenu.classList.remove('hidden');
        authBtn.classList.add('hidden');
        userName.textContent = currentUser.user_metadata.full_name || currentUser.email.split('@')[0];
        loadContent();
    } else {
        body.classList.remove('is-authenticated', 'is-admin');
        userMenu.classList.add('hidden');
        authBtn.classList.remove('hidden');
    }
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const parent = btn.closest('.flex, .container');
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            parent.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
            const content = document.getElementById(`${btn.dataset.tab}Content`) || document.getElementById(`${btn.dataset.tab}Tab`);
            content.classList.remove('hidden');
            gsap.from(content, { opacity: 0, y: 20, duration: 0.5 });
        });
    });
}

async function loadContent() {
    try {
        const { data: materials, error: materialsError } = await supabase.from('materials').select('*');
        if (materialsError) throw materialsError;

        ['ewec', 'dedi', 'duep', 'acm'].forEach(subject => {
            const grid = document.getElementById(`${subject}Content`);
            grid.innerHTML = '';
            materials.filter(m => m.subject === subject).forEach(m => {
                const card = document.createElement('div');
                card.className = 'bg-gray-700 p-4 rounded-lg hover:scale-105 transition-transform';
                card.innerHTML = `
                    <img src="${m.thumbnail || 'https://via.placeholder.com/150'}" alt="${m.title}" class="w-full h-40 object-cover rounded mb-4">
                    <h3 class="text-lg font-semibold">${m.title}</h3>
                    <p class="text-gray-400">${m.description}</p>
                    <button class="mt-4 text-blue-500 view-material" data-file="${m.file}">View <i class="fas fa-eye"></i></button>
                `;
                grid.appendChild(card);
                gsap.from(card, { opacity: 0, y: 20, duration: 0.5, delay: grid.children.length * 0.1 });
            });
        });

        const assignmentsGrid = document.querySelector('#assignments .grid');
        const { data: assignments, error: assignmentsError } = await supabase.from('assignments').select('*');
        if (assignmentsError) throw assignmentsError;
        assignmentsGrid.innerHTML = '';
        assignments.forEach(a => {
            const card = document.createElement('div');
            card.className = 'bg-gray-700 p-4 rounded-lg hover:scale-105 transition-transform';
            card.innerHTML = `
                <h3 class="text-lg font-semibold">${a.title}</h3>
                <span class="text-sm bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">${a.subject}</span>
                <p class="text-gray-400 mt-2">${a.description}</p>
                <p class="text-gray-400 mt-2"><i class="fas fa-calendar"></i> Due: ${a.due_date}</p>
                <button class="mt-4 text-blue-500 view-assignment" data-file="${a.file}">View <i class="fas fa-eye"></i></button>
            `;
            assignmentsGrid.appendChild(card);
            gsap.from(card, { opacity: 0, y: 20, duration: 0.5, delay: assignmentsGrid.children.length * 0.1 });
        });

        const papersGrid = document.querySelector('#papers .grid');
        const subjectFilter = document.getElementById('subjectFilter');
        const yearFilter = document.getElementById('yearFilter');
        const typeFilter = document.getElementById('typeFilter');

        async function renderPapers() {
            papersGrid.innerHTML = '';
            let query = supabase.from('papers').select('*');
            if (subjectFilter.value !== 'all') query = query.eq('subject', subjectFilter.value);
            if (yearFilter.value !== 'all') query = query.eq('year', yearFilter.value);
            if (typeFilter.value !== 'all') query = query.eq('type', typeFilter.value);
            const { data: papers, error: papersError } = await query;
            if (papersError) throw papersError;
            papers.forEach(p => {
                const card = document.createElement('div');
                card.className = 'bg-gray-700 p-4 rounded-lg hover:scale-105 transition-transform';
                card.innerHTML = `
                    <h3 class="text-lg font-semibold">${p.title}</h3>
                    <p class="text-gray-400"><i class="fas fa-book"></i> ${p.subject.toUpperCase()}</p>
                    <p class="text-gray-400"><i class="fas fa-calendar"></i> ${p.year}</p>
                    <span class="text-sm bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">${p.type}</span>
                    <div class="mt-4 flex gap-2">
                        <button class="text-blue-500 view-paper" data-file="${p.file}">View <i class="fas fa-eye"></i></button>
                        <button class="text-blue-500 download-paper" data-file="${p.file}">Download <i class="fas fa-download"></i></button>
                    </div>
                `;
                papersGrid.appendChild(card);
                gsap.from(card, { opacity: 0, y: 20, duration: 0.5, delay: papersGrid.children.length * 0.1 });
            });

            document.querySelectorAll('.view-material, .view-assignment, .view-paper').forEach(btn => {
                btn.addEventListener('click', () => openPDF(btn.dataset.file));
            });

            document.querySelectorAll('.download-paper').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const { data } = supabase.storage.from('content').getPublicUrl(btn.dataset.file);
                    window.open(data.publicUrl, '_blank');
                });
            });
        }

        renderPapers();
        subjectFilter.addEventListener('change', renderPapers);
        yearFilter.addEventListener('change', renderPapers);
        typeFilter.addEventListener('change', renderPapers);
    } catch (error) {
        console.error('Content loading error:', error);
        alert('Failed to load content. Check console for details.');
    }
}

function setupPDFViewer() {
    const pdfModal = document.getElementById('pdfModal');
    const pdfCanvas = document.getElementById('pdfCanvas');
    const pdfTitle = document.getElementById('pdfTitle');
    const pageInfo = document.getElementById('pageInfo');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const downloadPdf = document.getElementById('downloadPdf');
    const closePdf = document.getElementById('closePdf');

    let pdfDoc = null;
    let pageNum = 1;
    let pageCount = 1;

    function renderPage(num) {
        pdfDoc.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: 1.5 });
            pdfCanvas.height = viewport.height;
            pdfCanvas.width = viewport.width;
            page.render({ canvasContext: pdfCanvas.getContext('2d'), viewport });
            pageInfo.textContent = `Page ${num} of ${pageCount}`;
        });
    }

    window.openPDF = async function(file) {
        pdfTitle.textContent = file.split('/').pop();
        pdfModal.classList.remove('hidden');
        gsap.from('#pdfModal .bg-gray-800', { scale: 0.8, opacity: 0, duration: 0.5 });
        const { data } = supabase.storage.from('content').getPublicUrl(file);
        pdfDoc = await pdfjsLib.getDocument(data.publicUrl).promise;
        pageCount = pdfDoc.numPages;
        pageNum = 1;
        renderPage(pageNum);
    };

    prevPage.addEventListener('click', () => {
        if (pageNum > 1) renderPage(--pageNum);
    });

    nextPage.addEventListener('click', () => {
        if (pageNum < pageCount) renderPage(++pageNum);
    });

    downloadPdf.addEventListener('click', () => {
        const { data } = supabase.storage.from('content').getPublicUrl(pdfTitle.textContent);
        window.open(data.publicUrl, '_blank');
    });

    closePdf.addEventListener('click', () => {
        gsap.to('#pdfModal .bg-gray-800', { scale: 0.8, opacity: 0, duration: 0.3, onComplete: () => {
            pdfModal.classList.add('hidden');
            pdfCanvas.getContext('2d').clearRect(0, 0, pdfCanvas.width, pdfCanvas.height);
        }});
    });
}

function setupCalculator() {
    const calcCategories = document.querySelectorAll('.calc-category');
    const ohmsLawForm = document.getElementById('ohmsLawForm');
    const knownQuantity = document.getElementById('knownQuantity');

    calcCategories.forEach(cat => {
        cat.addEventListener('click', (e) => {
            e.preventDefault();
            calcCategories.forEach(c => c.classList.remove('active'));
            cat.classList.add('active');
            document.querySelectorAll('.calculator-content').forEach(c => c.classList.add('hidden'));
            const content = document.getElementById(`${cat.dataset.category}Calc`);
            content.classList.remove('hidden');
            gsap.from(content, { opacity: 0, x: 20, duration: 0.5 });
        });
    });

    knownQuantity.addEventListener('change', () => {
        const value = knownQuantity.value;
        document.querySelectorAll('.voltage-inputs, .current-inputs, .resistance-inputs').forEach(row => {
            row.classList.add('hidden');
        });
        document.querySelector(`.${value}-inputs`).classList.remove('hidden');
        gsap.from(`.${value}-inputs`, { opacity: 0, y: 20, duration: 0.5 });
    });

    ohmsLawForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quantity = knownQuantity.value;
        const resultDiv = document.getElementById('ohmsLawResult');
        let result = null;

        if (quantity === 'voltage') {
            const current = parseFloat(document.getElementById('currentInput').value);
            const resistance = parseFloat(document.getElementById('resistanceInput').value);
            if (current && resistance) result = current * resistance;
        } else if (quantity === 'current') {
            const voltage = parseFloat(document.getElementById('voltageInput1').value);
            const resistance = parseFloat(document.getElementById('resistanceInput1').value);
            if (voltage && resistance) result = voltage / resistance;
        } else if (quantity === 'resistance') {
            const voltage = parseFloat(document.getElementById('voltageInput2').value);
            const current = parseFloat(document.getElementById('currentInput2').value);
            if (voltage && current) result = voltage / current;
        }

        resultDiv.innerHTML = result
            ? `<h4 class="text-lg">Result:</h4><div class="text-xl">${result.toFixed(2)} ${quantity === 'voltage' ? 'V' : quantity === 'current' ? 'A' : 'Ω'}</div>`
            : `<h4 class="text-lg">Result:</h4><div class="text-xl">Invalid inputs</div>`;
        gsap.from(resultDiv, { opacity: 0, scale: 0.8, duration: 0.5 });
    });
}

function setupAdminDashboard() {
    const uploadForm = document.getElementById('uploadForm');
    const contentType = document.getElementById('contentType');
    const paperOptions = document.querySelector('.paper-options');
    const contentTable = document.getElementById('contentTable');
    const userTable = document.getElementById('userTable');

    contentType.addEventListener('change', () => {
        paperOptions.classList.toggle('hidden', contentType.value !== 'paper');
    });

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('contentTitle').value;
        const type = document.getElementById('contentType').value;
        const subject = document.getElementById('contentSubject').value;
        const description = document.getElementById('contentDescription').value;
        const file = document.getElementById('contentFile').files[0];
        const status = document.getElementById('uploadStatus');

        if (!file || !title || !type || !subject || !description) {
            status.textContent = 'Please fill all fields';
            status.classList.add('text-red-500', 'block');
            return;
        }

        const filePath = `content/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('content').upload(filePath, file);
        if (uploadError) {
            status.textContent = uploadError.message;
            status.classList.add('text-red-500', 'block');
            return;
        }

        const table = type === 'material' ? 'materials' : type === 'assignment' ? 'assignments' : 'papers';
        const data = { title, subject, description, file: filePath };
        if (type === 'paper') {
            data.year = document.getElementById('paperYear').value;
            data.type = document.getElementById('paperType').value;
        } else if (type === 'assignment') {
            data.due_date = new Date().toISOString().split('T')[0];
        }

        const { error } = await supabase.from(table).insert([data]);
        if (error) {
            status.textContent = error.message;
            status.classList.add('text-red-500', 'block');
        } else {
            status.textContent = 'Content uploaded successfully!';
            status.classList.add('text-green-500', 'block');
            uploadForm.reset();
            paperOptions.classList.add('hidden');
            loadContent();
            loadAdminTables();
            gsap.from(status, { opacity: 0, duration: 0.5 });
            setTimeout(() => status.classList.remove('block'), 3000);
        }
    });

    async function loadAdminTables() {
        contentTable.innerHTML = '';
        const tables = ['materials', 'assignments', 'papers'];
        for (const table of tables) {
            const { data, error } = await supabase.from(table).select('*');
            if (error) continue;
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${item.title}</td>
                    <td class="p-4">${table}</td>
                    <td class="p-4">${item.subject.toUpperCase()}</td>
                    <td class="p-4">
                        <button class="text-blue-500 delete-content" data-id="${item.id}" data-table="${table}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                contentTable.appendChild(row);
            });
        }

        userTable.innerHTML = '';
        const { data: users, error: usersError } = await supabase.from('users').select('*');
        if (!usersError) {
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="p-4">${user.full_name || user.email}</td>
                    <td class="p-4">${user.email}</td>
                    <td class="p-4">${user.role || 'user'}</td>
                    <td class="p-4">
                        <button class="text-blue-500 delete-user" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                userTable.appendChild(row);
            });
        }

        document.querySelectorAll('.delete-content').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const table = btn.dataset.table;
                await supabase.from(table).delete().eq('id', id);
                loadContent();
                loadAdminTables();
            });
        });

        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                await supabase.from('users').delete().eq('id', id);
                loadAdminTables();
            });
        });

        gsap.from('#contentTable tr, #userTable tr', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5 });
    }

    loadAdminTables();
}

function setupAnimations() {
    const circuitPaths = document.querySelector('.circuit-paths');
    for (let i = 0; i < 5; i++) {
        const path = document.createElement('div');
        path.className = 'circuit-path';
        path.style.top = `${Math.random() * 100}%`;
        circuitPaths.appendChild(path);
    }

    const sparksContainer = document.querySelector('.sparks-container');
    function createSpark() {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = `${Math.random() * 100}%`;
        spark.style.top = `${Math.random() * 100}%`;
        sparksContainer.appendChild(spark);
        setTimeout(() => spark.remove(), 1000);
    }
    setInterval(createSpark, 500);

    document.getElementById('getStartedBtn').addEventListener('click', () => {
        const sparkContainer = document.querySelector('.spark-container');
        for (let i = 0; i < 5; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            sparkContainer.appendChild(spark);
            setTimeout(() => spark.remove(), 500);
        }
    });

    gsap.from('.hero-section h1, .hero-section p, .hero-section button', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 1,
        delay: 2.5
    });
}