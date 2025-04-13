// script.js
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('main-container');
    const sparksContainer = document.getElementById('sparks');
    const currentFollower = document.getElementById('current-follower');
    const circuitPaths = document.querySelector('.circuit-paths');
    const featureCards = document.querySelectorAll('.feature-card');

    // Create sparks
    setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            const size = Math.random() * 3 + 1;
            spark.style.width = `${size}px`;
            spark.style.height = `${size}px`;
            spark.style.boxShadow = `0 0 ${size * 2}px ${size / 2}px rgba(59, 130, 246, 0.7)`;
            spark.style.animationDuration = `${Math.random() * 3 + 2}s`;
            spark.style.animationDelay = `${Math.random() * 2}s`;
            sparksContainer.appendChild(spark);

            setTimeout(() => spark.remove(), 5000);
        }
    }, 300);

    // Mouse/touch follower
    const updateFollower = (x, y) => {
        currentFollower.style.left = `calc(${x}% - clamp(3rem, 7.5vw, 4rem))`;
        currentFollower.style.top = `calc(${y}% - clamp(3rem, 7.5vw, 4rem))`;
    };

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        updateFollower(x, y);
    });

    container.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 100;
        const y = ((touch.clientY - rect.top) / rect.height) * 100;
        updateFollower(x, y);
    }, { passive: false });

    // Circuit paths
    for (let i = 0; i < 10; i++) {
        const path = document.createElement('div');
        path.className = 'path';
        const top = 20 + Math.random() * 60;
        const left = Math.random() * 100;
        const width = 30 + Math.random() * 40;
        path.style.top = `${top}%`;
        path.style.left = `${left}%`;
        path.style.width = `${width}%`;
        path.style.animation = `flowPath ${3 + Math.random() * 4}s linear ${Math.random() * 5}s infinite`;
        circuitPaths.appendChild(path);
    }

    // Feature card effects
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const shimmer = document.createElement('div');
            shimmer.className = 'shimmer';
            shimmer.style.position = 'absolute';
            shimmer.style.inset = '0';
            shimmer.style.background = 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.1), transparent)';
            shimmer.style.animation = 'shimmer 2s infinite';
            card.appendChild(shimmer);

            for (let i = 0; i < 15; i++) {
                const node = document.createElement('div');
                node.className = 'circuit-node';
                const size = 1 + Math.random() * 2;
                node.style.width = `${size}px`;
                node.style.height = `${size}px`;
                node.style.left = `${Math.random() * 100}%`;
                node.style.top = `${Math.random() * 100}%`;
                node.style.boxShadow = `0 0 ${size * 2}px ${size}px rgba(59, 130, 246, 0.5)`;
                node.style.animation = `fadeInOut ${1 + Math.random() * 3}s ease-in-out ${Math.random() * 0.5}s infinite alternate`;
                card.appendChild(node);
            }
        });

        card.addEventListener('mouseleave', () => {
            card.querySelectorAll('.shimmer, .circuit-node').forEach(el => el.remove());
        });

        // Touch support for mobile
        card.addEventListener('touchstart', () => {
            const shimmer = document.createElement('div');
            shimmer.className = 'shimmer';
            shimmer.style.position = 'absolute';
            shimmer.style.inset = '0';
            shimmer.style.background = 'linear-gradient(to right, transparent, rgba(59, 130, 246, 0.1), transparent)';
            shimmer.style.animation = 'shimmer 2s infinite';
            card.appendChild(shimmer);

            for (let i = 0; i < 15; i++) {
                const node = document.createElement('div');
                node.className = 'circuit-node';
                const size = 1 + Math.random() * 2;
                node.style.width = `${size}px`;
                node.style.height = `${size}px`;
                node.style.left = `${Math.random() * 100}%`;
                node.style.top = `${Math.random() * 100}%`;
                node.style.boxShadow = `0 0 ${size * 2}px ${size}px rgba(59, 130, 246, 0.5)`;
                node.style.animation = `fadeInOut ${1 + Math.random() * 3}s ease-in-out ${Math.random() * 0.5}s infinite alternate`;
                card.appendChild(node);
            }

            setTimeout(() => {
                card.querySelectorAll('.shimmer, .circuit-node').forEach(el => el.remove());
            }, 2000);
        });
    });

    // Add sparks to primary button
    const primaryButton = document.querySelector('.button.primary');
    primaryButton.addEventListener('mouseenter', () => {
        for (let i = 0; i < 5; i++) {
            const spark = document.createElement('span');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            spark.style.animationDelay = `${i * 0.1}s`;
            primaryButton.appendChild(spark);
            setTimeout(() => spark.remove(), 600);
        }
    });

    // Touch support for primary button
    primaryButton.addEventListener('touchstart', () => {
        for (let i = 0; i < 5; i++) {
            const spark = document.createElement('span');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            spark.style.animationDelay = `${i * 0.1}s`;
            primaryButton.appendChild(spark);
            setTimeout(() => spark.remove(), 600);
        }
    });
});