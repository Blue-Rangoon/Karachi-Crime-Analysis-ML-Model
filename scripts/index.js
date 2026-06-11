/* ============================================================
   CrimeIQ — Landing Page Logic
   - Modal handling (login/signup tabs)
   - LocalStorage-based auth simulation
   - Form validation
   - Animated counters
   - Mobile menu, navbar scroll, smooth UX
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- AOS ----------
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });
  }

  // ---------- Year ----------
  document.getElementById('year').textContent = new Date().getFullYear();

  // ---------- Navbar scroll ----------
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // ---------- Mobile menu ----------
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => navLinks.classList.toggle('active'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
  });

  // ---------- Smooth active link on scroll ----------
  const sections = ['home', 'features', 'about', 'contact'].map(id => document.getElementById(id));
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    let active = 'home';
    sections.forEach(sec => { if (sec && sec.offsetTop <= scrollPos) active = sec.id; });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + active);
    });
  });

  // ---------- Modal ----------
  const modal = document.getElementById('authModal');
  const tabs = document.querySelectorAll('.modal-tab');
  const forms = { login: document.getElementById('loginForm'), signup: document.getElementById('signupForm') };

  const openModal = (tab = 'login') => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    switchTab(tab);
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearFormMessages();
  };
  const switchTab = (tab) => {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    Object.entries(forms).forEach(([name, form]) => form.classList.toggle('active', name === tab));
    clearFormMessages();
  };

  document.getElementById('openLoginBtn').addEventListener('click', () => openModal('login'));
  document.getElementById('openSignupBtn').addEventListener('click', () => openModal('signup'));
  document.getElementById('heroStartBtn').addEventListener('click', () => openModal('signup'));
  document.getElementById('ctaSignupBtn').addEventListener('click', () => openModal('signup'));
  document.getElementById('ctaLoginBtn').addEventListener('click', () => openModal('login'));
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });

  tabs.forEach(t => t.addEventListener('click', () => switchTab(t.dataset.tab)));
  document.querySelectorAll('.switch-to').forEach(a => {
    a.addEventListener('click', (e) => { e.preventDefault(); switchTab(a.dataset.tab); });
  });

  // ---------- Toggle password visibility ----------
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('i');
      if (target.type === 'password') { target.type = 'text'; icon.className = 'bi bi-eye-slash'; }
      else { target.type = 'password'; icon.className = 'bi bi-eye'; }
    });
  });

  // ---------- Auth (localStorage) ----------
  const USERS_KEY = 'crimeiq_users';
  const SESSION_KEY = 'crimeiq_session';

  const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const showMessage = (formId, text, type = 'error') => {
    const el = document.getElementById(formId);
    el.textContent = text;
    el.className = `form-msg show ${type}`;
  };
  const clearFormMessages = () => {
    document.querySelectorAll('.form-msg').forEach(el => { el.textContent = ''; el.className = 'form-msg'; });
  };

  const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Signup
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (!name || name.length < 2) return showMessage('signupMsg', 'Please enter your full name.');
    if (!validEmail(email)) return showMessage('signupMsg', 'Please enter a valid email address.');
    if (password.length < 6) return showMessage('signupMsg', 'Password must be at least 6 characters.');
    if (password !== confirm) return showMessage('signupMsg', 'Passwords do not match.');

    const users = getUsers();
    if (users.find(u => u.email === email)) return showMessage('signupMsg', 'An account with this email already exists.');

    const newUser = { name, email, password, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, email, loginAt: new Date().toISOString() }));

    showMessage('signupMsg', 'Account created! Redirecting to dashboard...', 'success');
    showToast(`Welcome, ${name}! 🎉`);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  });

  // Login
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (!validEmail(email)) return showMessage('loginMsg', 'Please enter a valid email address.');
    if (!password) return showMessage('loginMsg', 'Please enter your password.');

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return showMessage('loginMsg', 'Invalid email or password.');

    localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, loginAt: new Date().toISOString() }));
    showMessage('loginMsg', 'Login successful! Redirecting...', 'success');
    showToast(`Welcome back, ${user.name}!`);
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1000);
  });

  // ---------- Toast ----------
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type === 'error' ? 'error' : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // ---------- Animated counters ----------
  const counters = document.querySelectorAll('.stat-num');
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const duration = 1800;
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(animate);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(animate);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObserver.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  // ---------- Auto-redirect if already logged in (optional convenience) ----------
  // Commented out so user can revisit landing; uncomment for auto-redirect.
  // const session = localStorage.getItem(SESSION_KEY);
  // if (session) window.location.href = 'dashboard.html';
});
