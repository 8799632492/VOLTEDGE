/* Custom Animations */
@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.5); opacity: 1; }
}

@keyframes flow {
    0% { width: 0; opacity: 0; }
    50% { opacity: 1; }
    100% { width: 100%; opacity: 0; }
}

@keyframes sparkle {
    0% { transform: scale(0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}

.animate-pulse { animation: pulse 1.5s infinite; }
.animate-flow { animation: flow 1.5s infinite; }

.gradient-text {
    background: linear-gradient(90deg, #3b82f6, #ef4444);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 5s ease infinite;
    background-size: 200%;
}

@keyframes gradient {
    0% { background-position: 0%; }
    50% { background-position: 100%; }
    100% { background-position: 0%; }
}

/* Circuit Paths */
.circuit-paths {
    position: absolute;
    width: 100%;
    height: 100%;
}

.circuit-path {
    position: absolute;
    height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    animation: flow 3s infinite;
}

/* Sparks */
.spark {
    position: absolute;
    width: 6px;
    height: 6px;
    background: #3b82f6;
    border-radius: 50%;
    animation: sparkle 1s ease-out forwards;
}

/* Button Sparks */
.spark-container .spark {
    width: 4px;
    height: 4px;
    background: white;
    position: absolute;
    animation: spark 0.5s ease-out;
}

@keyframes spark {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}

/* Tabs */
.tab-btn.active {
    background: #3b82f6 !important;
    color: white !important;
}

/* Navigation */
.nav-link {
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #3b82f6;
    transition: width 0.3s;
}

.nav-link:hover::after {
    width: 100%;
}

/* Dropdown */
.dropdown-menu.active {
    display: block;
}

/* PDF Canvas */
#pdfCanvas {
    max-height: 70vh;
}

/* Admin Section */
.admin-section {
    display: none;
}

.is-admin .admin-section {
    display: block;
}

/* File Upload */
.file-upload {
    border: 2px dashed #3b82f6;
    padding: 1rem;
    text-align: center;
    cursor: pointer;
}

.file-upload:hover {
    background: rgba(59, 130, 246, 0.1);
}