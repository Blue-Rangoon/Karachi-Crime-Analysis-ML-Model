/* ============================================================
   CrimeIQ — Dashboard Logic
   - Section navigation, sidebar (mobile), dropdowns
   - Chart.js initialization
   - Prediction simulation (placeholder for backend)
   - News rendering (placeholder for API integration)
   - Breaking news ticker
   - Logout
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============= SESSION =============
  const SESSION_KEY = 'crimeiq_session';
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');

  if (!session) {
    // Not logged in -> bounce to landing
    window.location.href = 'index.html';
    return;
  }

  // Populate user UI
  const initials = session.name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  document.getElementById('userName').textContent = session.name;
  document.getElementById('userAvatar').textContent = initials;
  const settingsAvatar = document.getElementById('settingsAvatar');
  if (settingsAvatar) settingsAvatar.textContent = initials;
  const setName = document.getElementById('setName');
  const setEmail = document.getElementById('setEmail');
  if (setName) setName.value = session.name;
  if (setEmail) setEmail.value = session.email;

  // ============= SIDEBAR / NAVIGATION =============
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const menuToggle = document.getElementById('menuToggle');
  const sidebarClose = document.getElementById('sidebarClose');

  const openSidebar = () => { sidebar.classList.add('active'); sidebarBackdrop.classList.add('active'); };
  const closeSidebar = () => { sidebar.classList.remove('active'); sidebarBackdrop.classList.remove('active'); };

  menuToggle?.addEventListener('click', openSidebar);
  sidebarClose?.addEventListener('click', closeSidebar);
  sidebarBackdrop?.addEventListener('click', closeSidebar);

  // Section switching
  const sideLinks = document.querySelectorAll('.side-link[data-section]');
  const sections = document.querySelectorAll('.page-section');
  const topTitle = document.getElementById('topbarTitle');
  const topSub = document.getElementById('topbarSub');

  const titles = {
    overview: { t: 'Dashboard', s: `Welcome back, ${session.name.split(' ')[0]}! Here's what's happening.` },
    analytics: { t: 'Crime Analytics', s: 'Detailed metrics across all categories' },
    prediction: { t: 'Crime News', s: 'Recent incidents & updates' },
    trends: { t: 'Trends & Insights', s: 'Pattern detection over time' },
    news: { t: 'Live News', s: 'Real-time crime news & breaking alerts' },
    settings: { t: 'Settings', s: 'Manage your profile & preferences' },
  };

  sideLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.section;
      sideLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById('section-' + target)?.classList.add('active');
      if (titles[target]) {
        topTitle.textContent = titles[target].t;
        topSub.textContent = titles[target].s;
      }
      // Init charts on-demand for sections beyond overview
      initSectionCharts(target);
      // Scroll to top of content & close sidebar on mobile
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.innerWidth <= 860) closeSidebar();
    });
  });

  // ============= LOGOUT =============
  const doLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    showToast('Logged out successfully', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 700);
  };
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => { e.preventDefault(); doLogout(); });
  document.getElementById('dropdownLogout')?.addEventListener('click', (e) => { e.preventDefault(); doLogout(); });

  // ============= DROPDOWNS =============
  const notifBtn = document.getElementById('notifBtn');
  const notifDropdown = document.getElementById('notifDropdown');
  const userChip = document.getElementById('userChip');
  const userDropdown = document.getElementById('userDropdown');

  const toggleDropdown = (dd, e) => {
    e.stopPropagation();
    // close others
    document.querySelectorAll('.dropdown').forEach(d => { if (d !== dd) d.classList.remove('active'); });
    dd.classList.toggle('active');
  };
  notifBtn?.addEventListener('click', (e) => toggleDropdown(notifDropdown, e));
  userChip?.addEventListener('click', (e) => toggleDropdown(userDropdown, e));
  document.addEventListener('click', () => document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active')));

  // ============= NOTIFICATIONS =============
  const notifList = document.getElementById('notifList');

  window.renderNotifications = function(items) {
    if (!notifList) return;
    
    const validItems = items.filter(n => n.tag !== 'ERROR');
    
    if (validItems.length > 0) {
      notifList.innerHTML = validItems.slice(0, 4).map(n => {
        // Dynamically style each notification based on title content for premium feel
        let type = 'blue';
        let icon = 'bi-newspaper';
        
        const titleLower = n.title.toLowerCase();
        if (titleLower.includes('kill') || titleLower.includes('murder') || titleLower.includes('dead') || titleLower.includes('terror') || titleLower.includes('extortion')) {
          type = 'red';
          icon = 'bi-exclamation-octagon-fill';
        } else if (titleLower.includes('arrest') || titleLower.includes('patrol') || titleLower.includes('police') || titleLower.includes('cops')) {
          type = 'green';
          icon = 'bi-shield-check';
        } else if (titleLower.includes('theft') || titleLower.includes('burglary') || titleLower.includes('robbery') || titleLower.includes('stolen') || titleLower.includes('lost')) {
          type = 'orange';
          icon = 'bi-bell-fill';
        }
        
        return `
          <div class="notif-item">
            <div class="notif-icon ${type}"><i class="bi ${icon}"></i></div>
            <div class="notif-body">
              <strong>${n.title}</strong>
              <p>${n.desc}</p>
              <small>${n.time}</small>
            </div>
          </div>
        `;
      }).join('');
      
      const notifDot = document.querySelector('.notif-dot');
      if (notifDot) notifDot.style.display = 'block';
    } else {
      // Fallback/Initial placeholders
      const notifications = [
        { type: 'red', icon: 'bi-exclamation-octagon-fill', title: 'High-risk area detected', text: 'Korangi shows 23% spike in burglary reports.', time: '5 min ago' },
        { type: 'blue', icon: 'bi-graph-up', title: 'Prediction completed', text: 'Your forecast for District East Gulshan-e-Iqbal is ready.', time: '32 min ago' },
        { type: 'green', icon: 'bi-shield-check', title: 'Weekly report ready', text: 'Your weekly analytics digest is available.', time: '2 hr ago' },
        { type: 'orange', icon: 'bi-bell-fill', title: 'New alert subscription', text: 'You subscribed to "Vehicle Crime" alerts.', time: '1 day ago' },
      ];
      notifList.innerHTML = notifications.map(n => `
        <div class="notif-item">
          <div class="notif-icon ${n.type}"><i class="bi ${n.icon}"></i></div>
          <div class="notif-body">
            <strong>${n.title}</strong>
            <p>${n.text}</p>
            <small>${n.time}</small>
          </div>
        </div>
      `).join('');
    }
  };

  // Initial load with default notifications
  window.renderNotifications([]);

  // ============= CHARTS =============
  if (window.Chart) {
    // Global theme tweaks
    Chart.defaults.color = '#94A3B8';
    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
  }

  const gradientFill = (ctx, color1, color2) => {
    const g = ctx.createLinearGradient(0, 0, 0, 280);
    g.addColorStop(0, color1);
    g.addColorStop(1, color2);
    return g;
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#94A3B8', boxWidth: 12, padding: 12, font: { size: 12 } } },
      tooltip: {
        backgroundColor: 'rgba(11,18,32,0.95)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#64748B', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748B', font: { size: 11 } } }
    }
  };

  const chartInstances = {};

  function initOverviewCharts() {
    // Trend chart
    const trendEl = document.getElementById('trendChart');
    if (trendEl && !chartInstances.trend) {
      const ctx = trendEl.getContext('2d');
      chartInstances.trend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Reported',
              data: [3200, 3500, 3300, 3800, 4100, 4400, 4200, 4600, 4900, 5200, 5500, 5800],
              borderColor: '#3B82F6',
              backgroundColor: gradientFill(ctx, 'rgba(59,130,246,0.35)', 'rgba(59,130,246,0)'),
              fill: true, tension: 0.4, borderWidth: 2.5,
              pointBackgroundColor: '#3B82F6', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 6
            },
            {
              label: 'Resolved',
              data: [2200, 2400, 2300, 2700, 2900, 3100, 3000, 3300, 3500, 3700, 3900, 4100],
              borderColor: '#10B981',
              backgroundColor: gradientFill(ctx, 'rgba(16,185,129,0.25)', 'rgba(16,185,129,0)'),
              fill: true, tension: 0.4, borderWidth: 2.5,
              pointBackgroundColor: '#10B981', pointBorderColor: '#fff', pointBorderWidth: 2, pointRadius: 0, pointHoverRadius: 6
            }
          ]
        },
        options: baseOptions
      });
    }

    // Category doughnut
    const catEl = document.getElementById('categoryChart');
    if (catEl && !chartInstances.cat) {
      chartInstances.cat = new Chart(catEl, {
        type: 'doughnut',
        data: {
          labels: ['Theft', 'Burglary', 'Assault', 'Fraud', 'Vandalism', 'Other'],
          datasets: [{
            data: [32, 18, 14, 16, 12, 8],
            backgroundColor: ['#3B82F6', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981', '#64748B'],
            borderWidth: 0,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { position: 'bottom', labels: { color: '#94A3B8', boxWidth: 10, padding: 12, font: { size: 11 } } },
            tooltip: baseOptions.plugins.tooltip
          }
        }
      });
    }

    // Monthly bar
    const monEl = document.getElementById('monthlyChart');
    if (monEl && !chartInstances.mon) {
      chartInstances.mon = new Chart(monEl, {
        type: 'bar',
        data: {
          labels: ['Wk1', 'Wk2', 'Wk3', 'Wk4'],
          datasets: [
            { label: 'Reports', data: [320, 410, 380, 460], backgroundColor: '#3B82F6', borderRadius: 6, barThickness: 18 },
            { label: 'Resolved', data: [220, 280, 260, 340], backgroundColor: '#10B981', borderRadius: 6, barThickness: 18 }
          ]
        },
        options: baseOptions
      });
    }

    // Region horizontal bar
    const regEl = document.getElementById('regionChart');
    if (regEl && !chartInstances.reg) {
      chartInstances.reg = new Chart(regEl, {
        type: 'bar',
        data: {
          labels: ['Clifton', 'Nazimabad', 'Gulshan-e-Iqbal', 'Gulistan-e-Johar', 'Korangi', 'Landhi', 'Orangi Town', 'Liaquatabad', 'Defence', 'Saddar'],
          datasets: [{
            label: 'Incidents',
            data: [8200, 6500, 5800, 5200, 4700, 3900],
            backgroundColor: ['#6366F1', '#3B82F6', '#0EA5E9', '#06B6D4', '#10B981', '#84CC16'],
            borderRadius: 6, barThickness: 18
          }]
        },
        options: {
          ...baseOptions,
          indexAxis: 'y',
          plugins: { ...baseOptions.plugins, legend: { display: false } }
        }
      });
    }

    // Handle Trend Chart chip clicks (Year, Quarter, Month)
    const trendChips = document.querySelectorAll('.charts-grid .chart-card:first-child .chip');
    trendChips.forEach(chip => {
      chip.addEventListener('click', () => {
        trendChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        const view = chip.textContent.trim();
        const chart = chartInstances.trend;
        if (!chart) return;
        
        if (view === 'Year') {
          chart.data.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          chart.data.datasets[0].data = [3200, 3500, 3300, 3800, 4100, 4400, 4200, 4600, 4900, 5200, 5500, 5800];
          chart.data.datasets[1].data = [2200, 2400, 2300, 2700, 2900, 3100, 3000, 3300, 3500, 3700, 3900, 4100];
        } else if (view === 'Quarter') {
          chart.data.labels = ['Q1 (Jan-Mar)', 'Q2 (Apr-Jun)', 'Q3 (Jul-Sep)', 'Q4 (Oct-Dec)'];
          chart.data.datasets[0].data = [10000, 12300, 13700, 16500];
          chart.data.datasets[1].data = [6900, 8700, 9800, 11700];
        } else if (view === 'Month') {
          chart.data.labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
          chart.data.datasets[0].data = [820, 910, 880, 990];
          chart.data.datasets[1].data = [600, 680, 640, 710];
        }
        
        chart.update();
      });
    });
  }

  function initSectionCharts(section) {
    if (!window.Chart) return;
    if (section === 'analytics') {
      const el = document.getElementById('analyticsChart');
      if (el && !chartInstances.ana) {
        const ctx = el.getContext('2d');
        chartInstances.ana = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
              { label: 'Theft', data: [820, 900, 880, 950, 1020, 1100, 1080, 1150, 1200, 1280, 1340, 1420], borderColor: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.05)', tension: 0.4, fill: true, borderWidth: 2.5, pointRadius: 0 },
              { label: 'Burglary', data: [420, 460, 440, 500, 540, 580, 560, 600, 640, 680, 720, 760], borderColor: '#8B5CF6', backgroundColor: 'rgba(139,92,246,0.05)', tension: 0.4, fill: true, borderWidth: 2.5, pointRadius: 0 },
              { label: 'Assault', data: [320, 340, 320, 360, 380, 400, 390, 420, 440, 460, 480, 500], borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.05)', tension: 0.4, fill: true, borderWidth: 2.5, pointRadius: 0 },
              { label: 'Fraud', data: [220, 250, 240, 280, 310, 340, 330, 360, 390, 420, 450, 480], borderColor: '#F59E0B', backgroundColor: 'rgba(245,158,11,0.05)', tension: 0.4, fill: true, borderWidth: 2.5, pointRadius: 0 }
            ]
          },
          options: baseOptions
        });
      }
      const sev = document.getElementById('severityChart');
      if (sev && !chartInstances.sev) {
        chartInstances.sev = new Chart(sev, {
          type: 'polarArea',
          data: {
            labels: ['Critical', 'High', 'Medium', 'Low', 'Minor'],
            datasets: [{
              data: [12, 24, 38, 18, 8],
              backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(59,130,246,0.7)', 'rgba(16,185,129,0.7)', 'rgba(100,116,139,0.7)'],
              borderColor: 'rgba(255,255,255,0.08)', borderWidth: 1
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { color: '#94A3B8', boxWidth: 10, padding: 10, font: { size: 11 } } }, tooltip: baseOptions.plugins.tooltip },
            scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { display: false }, angleLines: { color: 'rgba(255,255,255,0.05)' } } }
          }
        });
      }
      const tod = document.getElementById('todChart');
      if (tod && !chartInstances.tod) {
        chartInstances.tod = new Chart(tod, {
          type: 'radar',
          data: {
            labels: ['12am', '4am', '8am', '12pm', '4pm', '8pm'],
            datasets: [{
              label: 'Incidents',
              data: [42, 28, 60, 80, 95, 110],
              backgroundColor: 'rgba(59,130,246,0.2)',
              borderColor: '#3B82F6',
              borderWidth: 2,
              pointBackgroundColor: '#3B82F6'
            }]
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: baseOptions.plugins.tooltip },
            scales: { r: { grid: { color: 'rgba(255,255,255,0.06)' }, angleLines: { color: 'rgba(255,255,255,0.06)' }, pointLabels: { color: '#94A3B8' }, ticks: { display: false } } }
          }
        });
      }
    }

    if (section === 'trends') {
      const el = document.getElementById('insightsChart');
      if (el && !chartInstances.ins) {
        const ctx = el.getContext('2d');
        chartInstances.ins = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({ length: 24 }, (_, i) => `W${i + 1}`),
            datasets: [
              {
                label: 'Crime Index',
                data: [42, 45, 44, 48, 52, 55, 53, 58, 62, 60, 65, 68, 72, 70, 75, 78, 80, 82, 85, 83, 88, 90, 92, 95],
                borderColor: '#6366F1',
                backgroundColor: gradientFill(ctx, 'rgba(99,102,241,0.35)', 'rgba(99,102,241,0)'),
                tension: 0.4, fill: true, borderWidth: 2.5, pointRadius: 0
              },
              {
                label: 'Prediction Index',
                data: [40, 43, 46, 48, 50, 54, 55, 58, 60, 62, 66, 68, 70, 73, 75, 78, 80, 82, 85, 87, 89, 91, 93, 96],
                borderColor: '#A78BFA', borderDash: [6, 4],
                backgroundColor: 'transparent', tension: 0.4, borderWidth: 2, pointRadius: 0
              }
            ]
          },
          options: baseOptions
        });
      }
    }
  }

  // Init overview by default
  initOverviewCharts();

  // ============= PREDICTION & MODEL INTEGRATION =============
  const BASE_API_URL = window.location.origin.startsWith('file') || !window.location.port || window.location.port !== '5000'
    ? 'http://127.0.0.1:5000'
    : '';

  function renderPredictionResult(targetId, result, payload) {
    const el = document.getElementById(targetId);
    if (!el) return;
    
    const riskClass = result.risk_level === 'High' ? 'badge-high' 
      : result.risk_level === 'Moderate' ? 'badge-mid' 
      : 'badge-low';
      
    const alternativesHTML = result.top_predictions.slice(1, 4).map(alt => {
      const altProb = (alt.probability * 100).toFixed(1);
      return `
        <div class="result-row" style="flex-direction:column; align-items:stretch; gap:4px; padding: 6px 0;">
          <div style="display:flex; justify-content:space-between; font-size:12px;">
            <span>${alt.category}</span>
            <span>${altProb}%</span>
          </div>
          <div class="result-bar" style="height:5px;"><div style="width:${altProb}%; background:var(--muted);"></div></div>
        </div>
      `;
    }).join('');

    // Generate AI recommendations based on predicted category
    let recommendationHTML = '';
    const categoryLower = result.prediction.toLowerCase();
    
    if (categoryLower.includes('robbery') || categoryLower.includes('assault') || categoryLower.includes('homicide') || categoryLower.includes('weapon') || categoryLower.includes('kidnapping') || categoryLower.includes('copulation') || categoryLower.includes('threats')) {
      recommendationHTML = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; animation: fadeUp 0.5s ease;">
          <strong style="color:#F87171; display:flex; align-items:center; gap:6px; font-size:12.5px; margin-bottom:4px;">
            <i class="bi bi-shield-fill-exclamation"></i> AI Recommended Actions:
          </strong>
          <p style="font-size:12px; line-height:1.4; color:var(--muted); margin:0;">
            <strong>High priority warning.</strong> Recommend immediate deployment of active police patrols in ${payload['Karachi Area']}, establishing checkpoints at primary exits, and setting up community emergency alarm systems.
          </p>
        </div>
      `;
    } else if (categoryLower.includes('theft') || categoryLower.includes('burglary') || categoryLower.includes('shoplifting') || categoryLower.includes('stolen') || categoryLower.includes('pickpocket') || categoryLower.includes('drunk roll') || categoryLower.includes('prowler') || categoryLower.includes('trespassing')) {
      recommendationHTML = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 8px; animation: fadeUp 0.5s ease;">
          <strong style="color:#FBBF24; display:flex; align-items:center; gap:6px; font-size:12.5px; margin-bottom:4px;">
            <i class="bi bi-bell-fill"></i> AI Recommended Actions:
          </strong>
          <p style="font-size:12px; line-height:1.4; color:var(--muted); margin:0;">
            <strong>Property security alert.</strong> Recommend deploying municipal CCTV surveillance networks, launching neighborhood watch programs in ${payload['Karachi Area']}, and distributing security locks/smart alarms to local businesses.
          </p>
        </div>
      `;
    } else if (categoryLower.includes('fraud') || categoryLower.includes('forgery') || categoryLower.includes('identity') || categoryLower.includes('worthless') || categoryLower.includes('embezzlement')) {
      recommendationHTML = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; animation: fadeUp 0.5s ease;">
          <strong style="color:#60A5FA; display:flex; align-items:center; gap:6px; font-size:12.5px; margin-bottom:4px;">
            <i class="bi bi-shield-lock-fill"></i> AI Recommended Actions:
          </strong>
          <p style="font-size:12px; line-height:1.4; color:var(--muted); margin:0;">
            <strong>Financial / Identity alert.</strong> Recommend enforcing multi-factor verification protocols, checking identity details using NADRA Verisys database, and raising digital literacy awareness to prevent phishing.
          </p>
        </div>
      `;
    } else {
      recommendationHTML = `
        <div style="margin-top: 16px; padding: 12px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 8px; animation: fadeUp 0.5s ease;">
          <strong style="color:#34D399; display:flex; align-items:center; gap:6px; font-size:12.5px; margin-bottom:4px;">
            <i class="bi bi-check-circle-fill"></i> AI Recommended Actions:
          </strong>
          <p style="font-size:12px; line-height:1.4; color:var(--muted); margin:0;">
            <strong>Routine check.</strong> Recommend regular community policing, reporting monthly situational crime indexes for ${payload['Karachi Area']}, and keeping neighborhood patrols at normal frequencies.
          </p>
        </div>
      `;
    }
    
    el.innerHTML = `
      <div class="result-content" style="animation: fadeUp 0.4s ease;">
        <div class="result-header">
          <div>
            <h4 style="font-family:'Space Grotesk'; font-size:14px; color:var(--text);">${result.prediction}</h4>
            <span style="font-size:11px; color:var(--muted);">${payload['Karachi Area']} · ${payload['Month']} (${payload['Model']})</span>
          </div>
          <span class="badge ${riskClass}">${result.risk_level} Risk</span>
        </div>
        
        <div class="result-row">
          <span>Primary Likelihood</span>
          <strong>${result.confidence}%</strong>
        </div>
        
        <div class="result-row" style="flex-direction:column; align-items:stretch; gap:6px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
          <div class="result-bar"><div style="width:${result.confidence}%"></div></div>
        </div>
        
        <div style="margin-top:14px; padding-bottom: 12px; border-bottom: 1px solid var(--border);">
          <h5 style="font-size:12px; color:var(--text); margin-bottom:8px; font-weight:600;">Top Alternatives:</h5>
          ${alternativesHTML || '<p style="font-size:12px; color:var(--muted)">No other categories predicted.</p>'}
        </div>
        
        ${recommendationHTML}
      </div>
    `;
  }

  const handlePredictSubmit = (formId, resultId) => {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());
      payload['Crime Count'] = 1.0;
      
      const fields = [
        'Month', 'Karachi Area', 
        'Suspect_Age', 'Suspect_Gender', 
        'Occupation', 'Education_Level', 'Crime_Motive'
      ];
      
      for (const field of fields) {
        if (!payload[field]) {
          showToast(`Please select a value for ${field.replace('_', ' ')}`, 'error');
          return;
        }
      }
      
      const resEl = document.getElementById(resultId);
      resEl.innerHTML = `<div class="result-placeholder"><div class="spinner"></div><p>Running model...</p></div>`;
      
      try {
        const response = await fetch(`${BASE_API_URL}/api/predict`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Prediction request failed');
        }
        
        const result = await response.json();
        renderPredictionResult(resultId, result, payload);
        showToast('Prediction generated successfully!');
        
      } catch (err) {
        console.error("Prediction error:", err);
        resEl.innerHTML = `
          <div class="result-placeholder error">
            <i class="bi bi-exclamation-triangle-fill" style="color:var(--danger)"></i>
            <p>Error running model: ${err.message}</p>
          </div>
        `;
        showToast('Error running prediction model', 'error');
      }
    });
  };

  // ============= CLEAR BUTTON HANDLERS =============
  const handleClearForm = (formId, resultId, placeholderText) => {
    const form = document.getElementById(formId);
    const resultEl = document.getElementById(resultId);
    if (form) {
      form.reset();
      form.querySelectorAll('select').forEach(sel => sel.value = "");
    }
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="result-placeholder">
          <i class="bi bi-graph-up-arrow"></i>
          <p>${placeholderText}</p>
        </div>
      `;
    }
    showToast('Form and results cleared');
  };


  // ============= DYNAMIC FORM POPULATION =============
  async function loadFeatures() {
    try {
      const response = await fetch(`${BASE_API_URL}/api/features`);
      if (!response.ok) throw new Error("Failed to load feature values");
      const features = await response.json();
      
      for (const [colName, values] of Object.entries(features)) {
        const selects = document.querySelectorAll(`select[name="${colName}"]`);
        selects.forEach(select => {
          const displayCol = colName.replace('_', ' ');
          select.innerHTML = `<option value="">Select ${displayCol}</option>`;
          values.forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.textContent = val;
            select.appendChild(opt);
          });
        });
      }
    } catch (err) {
      console.error("Error loading features:", err);
      showToast("Error loading prediction form features", "error");
    }
  }
  loadFeatures();

  // ============= NEWS API INTEGRATION =============
  const API_URL = `${BASE_API_URL}/api/news`;

async function fetchNews() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const articles = await response.json();

    return articles.map(article => ({
      icon: 'bi-newspaper',
      color: 'blue',
      tag: 'CRIME',
      title: article.title,
      desc: article.description || 'No description available.',
      time: new Date(article.published).toLocaleString()
    }));

  } catch (error) {
    console.error('News fetch error:', error);

    return [{
      icon: 'bi-exclamation-triangle-fill',
      color: 'red',
      tag: 'ERROR',
      title: 'Unable to load crime news',
      desc: 'Please check your connection or API configuration.',
      time: 'Now'
    }];
  }
}

  function renderNewsList(targetId, items) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = items.map(n => `
      <div class="news-item">
        <div class="news-thumb ${n.color}"><i class="bi ${n.icon}"></i></div>
        <div class="news-body">
          <h5>${n.title}</h5>
          <p>${n.desc}</p>
          <div class="news-meta"><span class="tag">${n.tag}</span><span>${n.time}</span></div>
        </div>
      </div>
    `).join('');
  }

  function renderNewsGrid(targetId, items) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = items.map(n => `
      <div class="news-card-full">
        <div class="ncf-img" style="background: var(--g-${n.color}, linear-gradient(135deg, #3B82F6, #6366F1));"><i class="bi ${n.icon}"></i></div>
        <div class="ncf-body">
          <h5>${n.title}</h5>
          <p>${n.desc}</p>
          <div class="ncf-meta"><span class="tag">${n.tag}</span><span>${n.time}</span></div>
        </div>
      </div>
    `).join('');
    // Apply gradient colors per type
    el.querySelectorAll('.ncf-img').forEach((img, i) => {
      const c = items[i].color;
      const map = {
        red: 'linear-gradient(135deg, #EF4444, #DC2626)',
        orange: 'linear-gradient(135deg, #F59E0B, #D97706)',
        green: 'linear-gradient(135deg, #10B981, #059669)',
        purple: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        blue: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      };
      img.style.background = map[c] || map.blue;
    });
  }

  function renderBreaking(targetId, items) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.innerHTML = items.slice(0, 4).map(n => `
      <div class="breaking-item">
        <i class="bi ${n.icon}"></i>
        <div>
          <h5>${n.title}</h5>
          <p>${n.desc}</p>
        </div>
      </div>
    `).join('');
  }

  const MOCK_CRIME_NEWS = [
    {
      icon: 'bi-newspaper',
      color: 'blue',
      tag: 'CRIME',
      title: 'Arrested suspect reveals alleged terror crime nexus in Karachi, police claim',
      desc: 'During interrogation, the suspect confessed to multiple targeted crimes and revealed connections to an active extortion network operating across District Central.',
      time: '5 min ago'
    },
    {
      icon: 'bi-shield-check',
      color: 'green',
      tag: 'SECURITY',
      title: 'In a first, police in Pakistan’s Karachi arrest suspect using facial recognition technology',
      desc: 'The suspect, wanted in multiple street crime cases, was intercepted near Clifton using the newly integrated smart surveillance network.',
      time: '32 min ago'
    },
    {
      icon: 'bi-cpu-fill',
      color: 'purple',
      tag: 'TECHNOLOGY',
      title: 'Karachi police launch AI-powered missing persons facial recognition system',
      desc: 'A new tracking module has been deployed at major police help desks to match unidentified public records with missing person databases.',
      time: '1 hour ago'
    },
    {
      icon: 'bi-exclamation-octagon-fill',
      color: 'red',
      tag: 'ALERT',
      title: 'Karachi in Fear: Rs 1 Billion Lost in Street Crime in Just 90 Days',
      desc: 'A recent security audit highlights a significant rise in mobile and vehicle snatches, urging municipal authorities to increase police patrolling frequencies.',
      time: '2 hours ago'
    },
    {
      icon: 'bi-newspaper',
      color: 'orange',
      tag: 'CRIME',
      title: "64-Year-Old Karachi Man Confesses to Wife's Murder in Korangi",
      desc: 'Local police arrested the suspect within hours of the incident. Personal disputes are cited as the primary motive behind the crime.',
      time: '4 hours ago'
    },
    {
      icon: 'bi-shield-exclamation',
      color: 'red',
      tag: 'SECURITY',
      title: 'Malir police on Thursday claimed to have arrested a suspected suicide attacker',
      desc: 'Acting on intelligence reports, law enforcement agencies conducted a raid near Malir and recovered weapons and electronic devices.',
      time: '6 hours ago'
    },
    {
      icon: 'bi-newspaper',
      color: 'green',
      tag: 'ARREST',
      title: 'Karachi police arrest eight suspects involved in Nazimabad extortion network',
      desc: 'The suspects were caught red-handed while threatening local shopkeepers. Cash, cellphones, and demand letters were recovered from their possession.',
      time: '1 day ago'
    }
  ];

  async function loadAllNews(showLoader = false) {
    if (showLoader) {
      const newsGrid = document.getElementById('newsGrid');
      if (newsGrid) newsGrid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Loading latest news...</p></div>`;
    }
    let items = await fetchNews();
    const hasError = items.length === 1 && items[0].tag === 'ERROR';
    if (hasError) {
      items = [items[0], ...MOCK_CRIME_NEWS];
    } else {
      items = [...items, ...MOCK_CRIME_NEWS];
    }
    renderNewsList('newsList', items.slice(0, 8));
    renderNewsList('newsListPrediction', items.slice(0, 8));
    renderNewsGrid('newsGrid', items);
    renderBreaking('breakingGrid', items);
    renderTicker(items);
    if (window.renderNotifications) {
      window.renderNotifications(items);
    }
  }
  loadAllNews();

  document.getElementById('refreshNewsBtn')?.addEventListener('click', async () => {
    showToast('Refreshing news...');
    await loadAllNews();
  });
  document.getElementById('refreshNewsBtn2')?.addEventListener('click', async () => {
    showToast('Refreshing news...');
    await loadAllNews(true);
  });
  document.getElementById('refreshNewsBtn3')?.addEventListener('click', async () => {
    showToast('Refreshing news...');
    await loadAllNews();
  });

  // ============= BREAKING NEWS TICKER =============
  const tickerEl = document.getElementById('tickerContent');

  function renderTicker(items) {
    if (!tickerEl) return;
    const validItems = items.filter(n => n.tag !== 'ERROR');
    
    // Map articles to tickers, or fallback to the standard list of relevant crime events if none/error loaded
    const tickerTexts = validItems.length > 0
      ? validItems.map(n => `➤ ${n.title}`)
      : [
          '➤ Arrested suspect reveals alleged terror crime nexus in Karachi, police claim',
          '➤ In a first, police in Pakistan’s Karachi arrest suspect using facial recognition technology',
          '➤ Karachi police launch AI-powered missing persons facial recognition system',
          '➤ Karachi in Fear: Rs 1 Billion Lost in Street Crime in Just 90 Days',
          "➤ 64-Year-Old Karachi Man Confesses to Wife's Murder in Korangi",
          '➤ Malir police on Thursday claimed to have arrested a suspected suicide attacker',
          '➤ Karachi police said on Sunday that eight suspects, “involved in running an extortion network” were arrested during a raid in Nazimabad.',
        ];
        
    const tickerHTML = tickerTexts.map(t => `<span>${t}</span>`).join('');
    // Duplicate for smooth loop
    tickerEl.innerHTML = tickerHTML + tickerHTML;
  }

  const pauseBtn = document.getElementById('tickerPause');
  let paused = false;
  pauseBtn?.addEventListener('click', () => {
    paused = !paused;
    tickerEl.classList.toggle('paused', paused);
    pauseBtn.innerHTML = paused ? '<i class="bi bi-play-fill"></i>' : '<i class="bi bi-pause-fill"></i>';
  });

  // Function to dynamically insert ticker items (future API hook)
  window.addTickerItem = (text) => {
    const span = document.createElement('span');
    span.textContent = text;
    tickerEl.appendChild(span);
  };

  // ============= SETTINGS =============
  document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = document.getElementById('setName').value.trim();
    const newEmail = document.getElementById('setEmail').value.trim();
    if (!newName || !newEmail) { showToast('Please fill all required fields', 'error'); return; }
    const updated = { ...session, name: newName, email: newEmail };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    document.getElementById('userName').textContent = newName;
    const newInitials = newName.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = newInitials;
    settingsAvatar.textContent = newInitials;
    showToast('Profile updated successfully!');
  });

  // ============= TOAST =============
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ============= KEYBOARD SHORTCUTS =============
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('.search-bar input')?.focus();
    }
  });

  // ============= THEME SWITCHER =============
  const THEME_KEY = 'crimeiq_theme';
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';

  const applyTheme = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.getElementById('themeLightBtn')?.classList.add('active');
      document.getElementById('themeDarkBtn')?.classList.remove('active');
      const switchEl = document.querySelector('#section-settings .pref-item:first-child input');
      if (switchEl) switchEl.checked = false;
    } else {
      document.body.classList.remove('light-theme');
      document.getElementById('themeDarkBtn')?.classList.add('active');
      document.getElementById('themeLightBtn')?.classList.remove('active');
      const switchEl = document.querySelector('#section-settings .pref-item:first-child input');
      if (switchEl) switchEl.checked = true;
    }
    localStorage.setItem(THEME_KEY, theme);
  };

  document.getElementById('themeDarkBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    applyTheme('dark');
    showToast('Dark mode activated');
  });

  document.getElementById('themeLightBtn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    applyTheme('light');
    showToast('Light mode activated');
  });

  const themeSwitch = document.querySelector('#section-settings .pref-item:first-child input');
  if (themeSwitch) {
    themeSwitch.checked = savedTheme === 'dark';
    themeSwitch.addEventListener('change', () => {
      applyTheme(themeSwitch.checked ? 'dark' : 'light');
      showToast(`${themeSwitch.checked ? 'Dark' : 'Light'} mode activated`);
    });
  }

  // Apply saved theme at startup
  applyTheme(savedTheme);

  // Link navigation helper from dropdown to sections
  const navigateToSection = (sectionName) => {
    const sectionLink = document.querySelector(`.side-link[data-section="${sectionName}"]`);
    if (sectionLink) {
      sectionLink.click();
    }
  };

  document.getElementById('topbarSettingsLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToSection('settings');
  });

  document.getElementById('topbarProfileLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToSection('settings');
  });

  // Welcome toast
  setTimeout(() => showToast(`Welcome back, ${session.name.split(' ')[0]}!`), 600);
});
