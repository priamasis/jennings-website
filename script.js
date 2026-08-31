// --- 1. Dynamic Pricing Logic ---
const priceCards = document.querySelectorAll('.price-card');
const dynamicCta = document.getElementById('dynamic-cta');
const stickyTier = document.getElementById('sticky-tier');
const stickyPrice = document.getElementById('sticky-price');
let selectedPaymentUrl = "https://your-payment-link-tier-2.com"; // Default

priceCards.forEach(card => {
    card.addEventListener('click', () => {
        priceCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const price = card.getAttribute('data-price');
        const tierName = card.querySelector('h4').innerText;
        selectedPaymentUrl = card.getAttribute('data-url');

        dynamicCta.innerHTML = `PAY $${price} & BOOK LATER`;
        stickyTier.innerText = tierName;
        stickyPrice.innerText = `$${price}`;

        dynamicCta.style.transform = "scale(1.05)";
        setTimeout(() => { dynamicCta.style.transform = "scale(1)"; }, 200);
    });
});

function goToPayment() {
    window.location.href = selectedPaymentUrl;
}

// --- 2. Countdown Timer ---
let timeLeft = 15 * 60;
const countdownElement = document.getElementById('countdown');

function updateCountdown() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    countdownElement.innerText = `${minutes}:${seconds}`;

    if (timeLeft > 0) {
        timeLeft--;
    } else {
        timeLeft = 15 * 60;
    }
}
setInterval(updateCountdown, 1000);

// --- 3. Animated Counters ---
const counters = document.querySelectorAll('.counter');
const speed = 200;

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const increment = target / speed;
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    if (target > 1000) {
                        entry.target.innerText = "$" + Math.ceil(current).toLocaleString();
                    } else if (entry.target.innerText.includes('%')) {
                        entry.target.innerText = Math.ceil(current) + "%";
                    } else {
                        entry.target.innerText = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCount);
                } else {
                    if (target > 1000) entry.target.innerText = "$" + target.toLocaleString();
                }
            };
            updateCount();
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// --- 4. Interactive ROI Calculator ---
const slider = document.getElementById('expenseSlider');
const expenseDisplay = document.getElementById('expenseDisplay');
const lossAmount = document.getElementById('lossAmount');

slider.addEventListener('input', (e) => {
    const monthly = e.target.value;
    const annual = monthly * 12;
    const loss = annual * 0.18;

    expenseDisplay.innerText = `$${parseInt(monthly).toLocaleString()}`;
    lossAmount.innerText = `$${Math.round(loss).toLocaleString()}`;
});

// --- 5. Scroll Reveal & Sticky Nav ---
const reveals = document.querySelectorAll('.reveal');
const navbar = document.getElementById('navbar');
const mainCta = document.getElementById('main-cta');
const stickyBar = document.getElementById('sticky-cta-bar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');

    const ctaPosition = mainCta.getBoundingClientRect();
    if (ctaPosition.bottom < 0 || ctaPosition.top > window.innerHeight) {
        stickyBar.classList.add('show');
    } else {
        stickyBar.classList.remove('show');
    }
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));

// --- 6. FAQ Accordion ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// --- 7. Cursor Glow ---
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    setTimeout(() => {
        cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, 50);
});

// --- 8. Auth UI ---
const authModal = document.getElementById('authModal');
const loginTrigger = document.getElementById('loginTrigger');
const signupTrigger = document.getElementById('signupTrigger');
const closeAuthModal = document.getElementById('closeAuthModal');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = document.querySelectorAll('.auth-form');
const providerButtons = document.querySelectorAll('.provider-btn');
const userBadge = document.getElementById('userBadge');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

const AUTH_STORAGE_KEY = 'jbiAuthSession';

function setAuthMode(mode) {
    authTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.authTab === mode);
    });

    authForms.forEach(form => {
        form.classList.toggle('active', form.id === `${mode}Form`);
    });
}

function openAuthModal(mode = 'signin') {
    setAuthMode(mode);
    authModal.classList.remove('hidden');
    authModal.setAttribute('aria-hidden', 'false');
}

function closeAuthModalWindow() {
    authModal.classList.add('hidden');
    authModal.setAttribute('aria-hidden', 'true');
}

function saveUserSession(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    renderUserState(user);
    closeAuthModalWindow();
}

function renderUserState(user) {
    if (!user) {
        userBadge.classList.add('hidden');
        return;
    }

    userName.textContent = user.name || 'Member';
    userBadge.classList.remove('hidden');
}

function loadUserSession() {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedUser) {
        renderUserState(null);
        return;
    }

    try {
        const parsedUser = JSON.parse(storedUser);
        renderUserState(parsedUser);
    } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        renderUserState(null);
    }
}

loginTrigger.addEventListener('click', () => openAuthModal('signin'));
signupTrigger.addEventListener('click', () => openAuthModal('signup'));
closeAuthModal.addEventListener('click', closeAuthModalWindow);
authModal.addEventListener('click', (event) => {
    if (event.target.dataset.closeAuth === 'true') {
        closeAuthModalWindow();
    }
});

authTabs.forEach(tab => {
    tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab));
});

providerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const provider = button.dataset.provider;
        const user = { name: `${provider} User` };
        saveUserSession(user);
        alert(`${provider} sign-in successful. This is a demo auth flow.`);
    });
});

document.getElementById('signinForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    saveUserSession({ name: email.split('@')[0] || 'Signed in user' });
    alert('You have successfully signed in.');
});

document.getElementById('signupForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name');
    saveUserSession({ name: name || 'New member' });
    alert('Your account has been created.');
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    renderUserState(null);
    alert('You have been signed out.');
});

loadUserSession();