/**
 * FitClub — Главный модуль приложения
 */

let currentUser = null;
let currentSection = 'dashboard';

/* ===== Авторизация ===== */
function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const role = document.getElementById('login-role').value;
  if (!email || !password) { showToast('Заполните все поля', 'error'); return; }
  const user = USERS.find(u => u.email === email && u.password === password && u.role === role);
  if (!user) { showToast('Неверные данные для входа', 'error'); return; }
  currentUser = user;
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  initApp();
  showToast('Добро пожаловать, ' + user.fullName.split(' ')[0] + '!', 'success');
}

function logout() {
  currentUser = null;
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

/* ===== Инициализация ===== */
function initApp() {
  document.getElementById('user-avatar').textContent = currentUser.avatar;
  document.getElementById('user-name-display').textContent = currentUser.fullName.split(' ').slice(0,2).join(' ');
  const roles = {client:'Клиент',coach:'Тренер',admin:'Администратор'};
  document.getElementById('user-role-display').textContent = roles[currentUser.role];
  buildNav();
  navigateTo('dashboard');
}

function buildNav() {
  const nav = document.getElementById('sidebar-nav');
  let items = [];
  if (currentUser.role === 'client') {
    items = [
      {id:'dashboard',icon:'📊',label:'Главная'},
      {id:'schedule',icon:'📅',label:'Расписание'},
      {id:'subscriptions',icon:'🎫',label:'Абонементы'},
      {id:'history',icon:'📋',label:'История'},
      {id:'profile',icon:'👤',label:'Профиль'}
    ];
  } else if (currentUser.role === 'coach') {
    items = [
      {id:'dashboard',icon:'📊',label:'Главная'},
      {id:'my-schedule',icon:'📅',label:'Моё расписание'},
      {id:'attendance',icon:'✅',label:'Посещаемость'},
      {id:'profile',icon:'👤',label:'Профиль'}
    ];
  } else {
    items = [
      {id:'dashboard',icon:'📊',label:'Главная'},
      {id:'manage-schedule',icon:'📅',label:'Расписание'},
      {id:'manage-subs',icon:'🎫',label:'Абонементы'},
      {id:'reports',icon:'📈',label:'Отчёты'},
      {id:'users',icon:'👥',label:'Пользователи'}
    ];
  }
  items.push({id:'logout',icon:'🚪',label:'Выйти'});
  nav.innerHTML = items.map(i =>
    `<button class="nav-item${i.id==='dashboard'?' active':''}" data-section="${i.id}" onclick="${i.id==='logout'?'logout()':'navigateTo(\''+i.id+'\')'}">
      <span class="nav-icon">${i.icon}</span><span>${i.label}</span>
    </button>`
  ).join('');
}

function navigateTo(section) {
  currentSection = section;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === section);
  });
  renderSection(section);
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

/* ===== Рендеринг секций ===== */
function renderSection(section) {
  const main = document.getElementById('main-content');
  const r = currentUser.role;
  if (section === 'dashboard') main.innerHTML = r === 'client' ? clientDashboard() : r === 'coach' ? coachDashboard() : adminDashboard();
  else if (section === 'schedule') main.innerHTML = clientSchedule();
  else if (section === 'subscriptions') main.innerHTML = clientSubscriptions();
  else if (section === 'history') main.innerHTML = clientHistory();
  else if (section === 'profile') main.innerHTML = profilePage();
  else if (section === 'my-schedule') main.innerHTML = coachSchedulePage();
  else if (section === 'attendance') main.innerHTML = coachAttendance();
  else if (section === 'manage-schedule') main.innerHTML = adminSchedule();
  else if (section === 'manage-subs') main.innerHTML = adminSubs();
  else if (section === 'reports') main.innerHTML = adminReports();
  else if (section === 'users') main.innerHTML = adminUsers();
}

/* ===== Клиент: Главная ===== */
function clientDashboard() {
  const sub = SUBSCRIPTIONS.find(s => s.clientId === currentUser.id && s.status === 'active');
  const myBookings = BOOKINGS.filter(b => b.clientId === currentUser.id && b.status === 'active');
  const upcoming = TRAININGS.filter(t => myBookings.some(b => b.trainingId === t.id));
  return `
    <div class="page-header"><h2>Добро пожаловать!</h2><p>Ваш персональный кабинет фитнес-клуба</p></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">🎫</div><div class="stat-value">${sub ? sub.remainingSessions : 0}</div><div class="stat-label">Осталось занятий</div></div>
      <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-value">${myBookings.length}</div><div class="stat-label">Активных записей</div></div>
      <div class="stat-card"><div class="stat-icon">✅</div><div class="stat-value">${VISIT_HISTORY.filter(v=>v.status==='attended').length}</div><div class="stat-label">Посещено</div></div>
      <div class="stat-card"><div class="stat-icon">📊</div><div class="stat-value">${sub ? Math.round((1 - sub.remainingSessions/sub.totalSessions)*100) : 0}%</div><div class="stat-label">Использовано</div></div>
    </div>
    ${sub ? `<div class="my-sub-widget"><div class="widget-title">🎫 Мой абонемент — ${sub.type}</div>
      <div class="my-sub-details">
        <div class="my-sub-detail"><div class="detail-value" style="color:var(--accent-green)">${sub.remainingSessions}</div><div class="detail-label">Осталось</div></div>
        <div class="my-sub-detail"><div class="detail-value">${sub.totalSessions}</div><div class="detail-label">Всего</div></div>
        <div class="my-sub-detail"><div class="detail-value">${sub.endDate}</div><div class="detail-label">Действует до</div></div>
        <div class="my-sub-detail"><div class="detail-value"><span class="badge badge-active">Активен</span></div><div class="detail-label">Статус</div></div>
      </div></div>` : '<div class="my-sub-widget"><div class="widget-title">🎫 У вас нет абонемента</div><p style="color:var(--text-secondary)">Перейдите в раздел «Абонементы» для покупки</p></div>'}
    <div class="page-header" style="margin-top:8px"><h2>Ближайшие тренировки</h2></div>
    <div class="training-grid">${upcoming.length ? upcoming.map(t => trainingCard(t, true)).join('') : '<p style="color:var(--text-secondary)">Нет предстоящих тренировок. Запишитесь в разделе «Расписание»!</p>'}</div>`;
}

/* ===== Клиент: Расписание ===== */
function clientSchedule() {
  return `
    <div class="page-header"><h2>Расписание тренировок</h2><p>Выберите тренировку и запишитесь в один клик</p></div>
    <div class="training-grid">${TRAININGS.filter(t=>t.status==='scheduled').map(t => trainingCard(t, false)).join('')}</div>`;
}

function trainingCard(t, isBooked) {
  const pct = Math.round((t.currentBookings / t.maxCapacity) * 100);
  const full = t.currentBookings >= t.maxCapacity;
  const color = pct > 80 ? 'var(--accent-red)' : pct > 50 ? 'var(--accent-orange)' : 'var(--accent-green)';
  const booked = BOOKINGS.some(b => b.trainingId === t.id && b.clientId === currentUser.id && b.status === 'active');
  return `<div class="training-card">
    <div class="card-header">
      <div class="card-icon">${t.icon}</div>
      <div><div class="card-title">${t.title}</div><div class="card-coach">${t.coachName}</div></div>
    </div>
    <div class="card-details">
      <div class="detail-item"><span class="icon">📅</span>${t.date}</div>
      <div class="detail-item"><span class="icon">🕐</span>${t.time}</div>
      <div class="detail-item"><span class="icon">⏱️</span>${t.duration} мин</div>
      <div class="detail-item"><span class="icon">👥</span>${t.type}</div>
    </div>
    <div class="capacity-bar"><div class="capacity-fill" style="width:${pct}%;background:${color}"></div></div>
    <div class="capacity-text">${t.currentBookings} / ${t.maxCapacity} мест занято ${full ? '<span class="badge badge-full">Мест нет</span>' : ''}</div>
    ${currentUser.role === 'client' ? (booked
      ? `<button class="btn btn-danger btn-full" onclick="cancelBooking(${t.id})">Отменить запись</button>`
      : (full ? `<button class="btn btn-outline btn-full" disabled>Мест нет</button>`
        : `<button class="btn btn-success btn-full" onclick="bookTraining(${t.id})">Записаться</button>`))
    : ''}
  </div>`;
}

/* ===== Запись/отмена ===== */
function bookTraining(id) {
  const t = TRAININGS.find(x => x.id === id);
  if (!t || t.currentBookings >= t.maxCapacity) { showToast('Нет свободных мест', 'error'); return; }
  const sub = SUBSCRIPTIONS.find(s => s.clientId === currentUser.id && s.status === 'active');
  if (!sub || sub.remainingSessions <= 0) { showToast('Нет активного абонемента', 'error'); return; }
  if (BOOKINGS.some(b => b.trainingId === id && b.clientId === currentUser.id && b.status === 'active')) {
    showToast('Вы уже записаны', 'info'); return;
  }
  BOOKINGS.push({id: BOOKINGS.length+1, trainingId: id, clientId: currentUser.id, bookingDate: new Date().toISOString().split('T')[0], status: 'active'});
  t.currentBookings++;
  sub.remainingSessions--;
  showToast('Вы записаны на «' + t.title + '»!', 'success');
  renderSection(currentSection);
}

function cancelBooking(trainingId) {
  const b = BOOKINGS.find(x => x.trainingId === trainingId && x.clientId === currentUser.id && x.status === 'active');
  if (!b) return;
  b.status = 'cancelled';
  const t = TRAININGS.find(x => x.id === trainingId);
  if (t) t.currentBookings = Math.max(0, t.currentBookings - 1);
  const sub = SUBSCRIPTIONS.find(s => s.clientId === currentUser.id && s.status === 'active');
  if (sub) sub.remainingSessions++;
  showToast('Запись отменена', 'info');
  renderSection(currentSection);
}

/* ===== Клиент: Абонементы ===== */
function clientSubscriptions() {
  const sub = SUBSCRIPTIONS.find(s => s.clientId === currentUser.id && s.status === 'active');
  return `<div class="page-header"><h2>Абонементы</h2><p>Выберите подходящий тариф</p></div>
    ${sub ? `<div class="my-sub-widget"><div class="widget-title">🎫 Текущий абонемент — ${sub.type}</div>
      <div class="my-sub-details">
        <div class="my-sub-detail"><div class="detail-value" style="color:var(--accent-green)">${sub.remainingSessions}</div><div class="detail-label">Осталось</div></div>
        <div class="my-sub-detail"><div class="detail-value">${sub.totalSessions}</div><div class="detail-label">Всего</div></div>
        <div class="my-sub-detail"><div class="detail-value">${sub.endDate}</div><div class="detail-label">Действует до</div></div>
        <div class="my-sub-detail"><div class="detail-value">${sub.price} ₽</div><div class="detail-label">Стоимость</div></div>
      </div></div>` : ''}
    <div class="subs-grid">${SUBSCRIPTION_TYPES.map((s,i) => `<div class="sub-card${i===1?' popular':''}">
      <div class="sub-icon">${s.icon}</div><div class="sub-name">${s.name}</div>
      <div class="sub-price">${s.price.toLocaleString()} ₽</div>
      <div class="sub-info">${s.sessions} занятий / ${s.duration}</div>
      <button class="btn btn-primary btn-full" onclick="buySub('${s.id}')">Купить</button>
    </div>`).join('')}</div>`;
}

function buySub(typeId) {
  const type = SUBSCRIPTION_TYPES.find(s => s.id === typeId);
  if (!type) return;
  const existing = SUBSCRIPTIONS.find(s => s.clientId === currentUser.id && s.status === 'active');
  if (existing) { showToast('У вас уже есть активный абонемент', 'info'); return; }
  const today = new Date();
  const end = new Date(today);
  end.setDate(end.getDate() + parseInt(type.duration));
  SUBSCRIPTIONS.push({
    id: SUBSCRIPTIONS.length + 1, clientId: currentUser.id, type: type.name,
    totalSessions: type.sessions, remainingSessions: type.sessions,
    startDate: today.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0],
    status: 'active', price: type.price
  });
  showToast('Абонемент «' + type.name + '» оформлен!', 'success');
  renderSection(currentSection);
}

/* ===== Клиент: История ===== */
function clientHistory() {
  return `<div class="page-header"><h2>История посещений</h2><p>Ваши прошедшие тренировки</p></div>
    <table class="data-table"><thead><tr><th>Дата</th><th>Тренировка</th><th>Статус</th></tr></thead>
    <tbody>${VISIT_HISTORY.map(v => `<tr><td>${v.date}</td><td>${v.training}</td>
      <td><span class="badge badge-${v.status}">${v.status === 'attended' ? '✅ Посещено' : '❌ Пропуск'}</span></td></tr>`).join('')}
    </tbody></table>`;
}

/* ===== Профиль ===== */
function profilePage() {
  return `<div class="page-header"><h2>Профиль</h2></div>
    <div class="my-sub-widget">
      <div style="text-align:center;margin-bottom:24px"><div style="font-size:64px">${currentUser.avatar}</div></div>
      <div class="my-sub-details">
        <div class="my-sub-detail"><div class="detail-value" style="font-size:18px">${currentUser.fullName}</div><div class="detail-label">ФИО</div></div>
        <div class="my-sub-detail"><div class="detail-value" style="font-size:18px">${currentUser.email}</div><div class="detail-label">Email</div></div>
        <div class="my-sub-detail"><div class="detail-value" style="font-size:18px">${currentUser.phone}</div><div class="detail-label">Телефон</div></div>
        <div class="my-sub-detail"><div class="detail-value" style="font-size:18px">${{client:'Клиент',coach:'Тренер',admin:'Администратор'}[currentUser.role]}</div><div class="detail-label">Роль</div></div>
      </div></div>`;
}

/* ===== Тренер: Главная ===== */
function coachDashboard() {
  const myTrainings = TRAININGS.filter(t => t.coachId === currentUser.id);
  const totalClients = myTrainings.reduce((s,t) => s + t.currentBookings, 0);
  return `<div class="page-header"><h2>Кабинет тренера</h2><p>${currentUser.specialization}</p></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-value">${myTrainings.length}</div><div class="stat-label">Тренировок</div></div>
      <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">${totalClients}</div><div class="stat-label">Записано клиентов</div></div>
      <div class="stat-card"><div class="stat-icon">⭐</div><div class="stat-value">${currentUser.experience}</div><div class="stat-label">Лет опыта</div></div>
      <div class="stat-card"><div class="stat-icon">💪</div><div class="stat-value">${currentUser.specialization.split(',').length}</div><div class="stat-label">Направлений</div></div>
    </div>
    <div class="page-header"><h2>Мои ближайшие занятия</h2></div>
    <div class="schedule-list">${myTrainings.map(t => `<div class="schedule-item">
      <div class="schedule-left"><div class="schedule-time">${t.time}</div>
        <div class="schedule-info"><h4>${t.icon} ${t.title}</h4><p>${t.date} / ${t.duration} мин / ${t.type}</p></div></div>
      <div><span class="badge badge-active">${t.currentBookings}/${t.maxCapacity}</span></div>
    </div>`).join('')}</div>`;
}

function coachSchedulePage() { return coachDashboard(); }

/* ===== Тренер: Посещаемость ===== */
function coachAttendance() {
  const myTrainings = TRAININGS.filter(t => t.coachId === currentUser.id);
  return `<div class="page-header"><h2>Отметка посещаемости</h2><p>Выберите тренировку и отметьте присутствующих</p></div>
    ${myTrainings.map(t => {
      const bookings = BOOKINGS.filter(b => b.trainingId === t.id && b.status === 'active');
      const clients = bookings.map(b => USERS.find(u => u.id === b.clientId)).filter(Boolean);
      return `<div class="chart-placeholder"><div class="chart-title">${t.icon} ${t.title} — ${t.date} ${t.time}</div>
        ${clients.length ? clients.map(c => `<div class="attendance-item">
          <div class="attendance-name">${c.avatar} ${c.fullName}</div>
          <div class="attendance-actions">
            <button class="attendance-btn present" onclick="markAttendance(${c.id},${t.id},'attended')" title="Присутствует">✅</button>
            <button class="attendance-btn absent" onclick="markAttendance(${c.id},${t.id},'missed')" title="Отсутствует">❌</button>
          </div></div>`).join('') : '<p style="color:var(--text-secondary)">Нет записавшихся</p>'}
      </div>`;
    }).join('')}`;
}

function markAttendance(clientId, trainingId, status) {
  const b = BOOKINGS.find(x => x.clientId === clientId && x.trainingId === trainingId);
  if (b) b.status = status;
  showToast(status === 'attended' ? 'Присутствие отмечено' : 'Отмечен пропуск', status === 'attended' ? 'success' : 'error');
  renderSection(currentSection);
}

/* ===== Админ: Главная ===== */
function adminDashboard() {
  const clients = USERS.filter(u => u.role === 'client');
  const activeSubs = SUBSCRIPTIONS.filter(s => s.status === 'active');
  const revenue = activeSubs.reduce((s, sub) => s + sub.price, 0);
  return `<div class="page-header"><h2>Панель администратора</h2><p>Обзор показателей фитнес-клуба</p></div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon">👥</div><div class="stat-value">${clients.length}</div><div class="stat-label">Клиентов</div></div>
      <div class="stat-card"><div class="stat-icon">🎫</div><div class="stat-value">${activeSubs.length}</div><div class="stat-label">Активных абонементов</div></div>
      <div class="stat-card"><div class="stat-icon">📅</div><div class="stat-value">${TRAININGS.length}</div><div class="stat-label">Тренировок</div></div>
      <div class="stat-card"><div class="stat-icon">💰</div><div class="stat-value">${(revenue/1000).toFixed(0)}K ₽</div><div class="stat-label">Выручка</div></div>
    </div>
    ${adminBarChart()}`;
}

function adminBarChart() {
  const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const vals = [45,62,38,71,55,82,30];
  const max = Math.max(...vals);
  return `<div class="chart-placeholder"><div class="chart-title">📊 Посещаемость за неделю</div>
    <div class="bar-chart">${days.map((d,i) => `<div class="bar-wrapper">
      <div class="bar-value">${vals[i]}</div>
      <div class="bar" style="height:${(vals[i]/max)*100}%;background:var(--gradient-1)"></div>
      <div class="bar-label">${d}</div></div>`).join('')}</div></div>`;
}

function adminSchedule() {
  return `<div class="page-header"><h2>Управление расписанием</h2></div>
    <table class="data-table"><thead><tr><th>Название</th><th>Тренер</th><th>Дата</th><th>Время</th><th>Места</th><th>Статус</th></tr></thead>
    <tbody>${TRAININGS.map(t => `<tr><td>${t.icon} ${t.title}</td><td>${t.coachName}</td><td>${t.date}</td><td>${t.time}</td>
      <td>${t.currentBookings}/${t.maxCapacity}</td><td><span class="badge badge-active">${t.status}</span></td></tr>`).join('')}</tbody></table>`;
}

function adminSubs() {
  return `<div class="page-header"><h2>Управление абонементами</h2></div>
    <table class="data-table"><thead><tr><th>Клиент</th><th>Тип</th><th>Остаток</th><th>Действует до</th><th>Статус</th></tr></thead>
    <tbody>${SUBSCRIPTIONS.map(s => {
      const u = USERS.find(x => x.id === s.clientId);
      return `<tr><td>${u ? u.fullName : '—'}</td><td>${s.type}</td><td>${s.remainingSessions}/${s.totalSessions}</td>
        <td>${s.endDate}</td><td><span class="badge badge-${s.status}">${s.status}</span></td></tr>`;
    }).join('')}</tbody></table>`;
}

function adminReports() {
  return `<div class="page-header"><h2>Отчёты</h2></div>${adminBarChart()}
    <div class="chart-placeholder"><div class="chart-title">💰 Продажи абонементов</div>
    <div class="bar-chart">${SUBSCRIPTION_TYPES.map(s => `<div class="bar-wrapper">
      <div class="bar-value">${Math.floor(Math.random()*20+5)}</div>
      <div class="bar" style="height:${Math.floor(Math.random()*60+30)}%;background:${s.color}"></div>
      <div class="bar-label">${s.name.substring(0,6)}</div></div>`).join('')}</div></div>`;
}

function adminUsers() {
  return `<div class="page-header"><h2>Пользователи</h2></div>
    <table class="data-table"><thead><tr><th>Имя</th><th>Email</th><th>Телефон</th><th>Роль</th></tr></thead>
    <tbody>${USERS.map(u => `<tr><td>${u.avatar} ${u.fullName}</td><td>${u.email}</td><td>${u.phone}</td>
      <td><span class="badge badge-active">${{client:'Клиент',coach:'Тренер',admin:'Админ'}[u.role]}</span></td></tr>`).join('')}</tbody></table>`;
}

/* ===== Уведомления ===== */
function showToast(msg, type) {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.innerHTML = `<span>${{success:'✅',error:'❌',info:'ℹ️'}[type] || 'ℹ️'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'slideOut 0.3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
}

/* ===== Enter для логина ===== */
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !currentUser) handleLogin();
});
