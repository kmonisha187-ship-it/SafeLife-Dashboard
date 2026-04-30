export function initAuth() {
    const overlay = document.getElementById('login-overlay');
    const form = document.getElementById('login-form');
    const errorMsg = document.getElementById('login-error');

    // Check local storage for mock token
    const token = localStorage.getItem('safelife_iam_token');

    if (token) {
        // Already logged in
        overlay.style.display = 'none';
        overlay.classList.remove('active');
    } else {
        // Show login
        overlay.classList.add('active');
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        const btn = form.querySelector('.login-btn');

        errorMsg.style.display = 'none';

        // Mock Authentication (Admin/password)
        if (user === 'admin' && pass === 'password') {
            const originalText = btn.innerHTML;
            btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Authenticating...`;
            // Temporary re-create icons for the spinner
            if (window.lucide) window.lucide.createIcons();

            // Fake network delay for effect
            setTimeout(() => {
                localStorage.setItem('safelife_iam_token', 'mock-jwt-token-xyz');
                overlay.style.opacity = '0';

                setTimeout(() => {
                    overlay.classList.remove('active');
                    overlay.style.display = 'none';
                    btn.innerHTML = originalText;
                }, 500);
            }, 1200);
        } else {
            errorMsg.style.display = 'block';

            // Shake effect
            const card = document.querySelector('.login-card');
            card.style.transform = 'translateX(-10px)';
            setTimeout(() => card.style.transform = 'translateX(10px)', 100);
            setTimeout(() => card.style.transform = 'translateX(-10px)', 200);
            setTimeout(() => card.style.transform = 'translateY(0)', 300);
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('safelife_iam_token');
            overlay.style.display = 'flex';
            // slight delay for opacity transition if any
            setTimeout(() => {
                overlay.style.opacity = '1';
                overlay.classList.add('active');
            }, 10);
            // clear form fields
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        });
    }
}
