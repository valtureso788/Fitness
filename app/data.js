/**
 * Данные для приложения «Сервис фитнес-клуба».
 * Содержит пользователей, абонементы, тренировки и записи.
 */

const USERS = [
  {
    id: 1,
    fullName: 'Иванова Анна Сергеевна',
    email: 'anna@mail.ru',
    phone: '+7 (900) 123-45-67',
    role: 'client',
    password: '123456',
    avatar: '👩'
  },
  {
    id: 2,
    fullName: 'Петров Дмитрий Алексеевич',
    email: 'dmitry@mail.ru',
    phone: '+7 (900) 234-56-78',
    role: 'client',
    password: '123456',
    avatar: '👨'
  },
  {
    id: 3,
    fullName: 'Козлова Мария Игоревна',
    email: 'maria@mail.ru',
    phone: '+7 (900) 345-67-89',
    role: 'coach',
    password: '123456',
    specialization: 'Йога, Пилатес',
    experience: 5,
    avatar: '🧘'
  },
  {
    id: 4,
    fullName: 'Смирнов Алексей Владимирович',
    email: 'alexey@mail.ru',
    phone: '+7 (900) 456-78-90',
    role: 'coach',
    password: '123456',
    specialization: 'Силовые, Кроссфит',
    experience: 8,
    avatar: '💪'
  },
  {
    id: 5,
    fullName: 'Администратор Системы',
    email: 'admin@fitness.ru',
    phone: '+7 (900) 000-00-00',
    role: 'admin',
    password: 'admin',
    avatar: '⚙️'
  }
];

const SUBSCRIPTIONS = [
  {
    id: 1,
    clientId: 1,
    type: 'Месячный',
    totalSessions: 12,
    remainingSessions: 8,
    startDate: '2026-04-01',
    endDate: '2026-05-01',
    status: 'active',
    price: 3500
  },
  {
    id: 2,
    clientId: 2,
    type: 'Годовой',
    totalSessions: 150,
    remainingSessions: 142,
    startDate: '2026-01-15',
    endDate: '2027-01-15',
    status: 'active',
    price: 25000
  }
];

const TRAININGS = [
  {
    id: 1,
    title: 'Йога для начинающих',
    coachId: 3,
    coachName: 'Козлова М.И.',
    date: '2026-04-25',
    time: '10:00',
    maxCapacity: 15,
    currentBookings: 8,
    status: 'scheduled',
    type: 'Групповая',
    duration: 60,
    icon: '🧘'
  },
  {
    id: 2,
    title: 'Силовая тренировка',
    coachId: 4,
    coachName: 'Смирнов А.В.',
    date: '2026-04-25',
    time: '12:00',
    maxCapacity: 10,
    currentBookings: 10,
    status: 'scheduled',
    type: 'Групповая',
    duration: 90,
    icon: '🏋️'
  },
  {
    id: 3,
    title: 'Пилатес',
    coachId: 3,
    coachName: 'Козлова М.И.',
    date: '2026-04-25',
    time: '14:00',
    maxCapacity: 12,
    currentBookings: 5,
    status: 'scheduled',
    type: 'Групповая',
    duration: 60,
    icon: '🤸'
  },
  {
    id: 4,
    title: 'Кроссфит',
    coachId: 4,
    coachName: 'Смирнов А.В.',
    date: '2026-04-25',
    time: '16:00',
    maxCapacity: 8,
    currentBookings: 3,
    status: 'scheduled',
    type: 'Групповая',
    duration: 60,
    icon: '🔥'
  },
  {
    id: 5,
    title: 'Утренняя растяжка',
    coachId: 3,
    coachName: 'Козлова М.И.',
    date: '2026-04-26',
    time: '08:00',
    maxCapacity: 20,
    currentBookings: 12,
    status: 'scheduled',
    type: 'Групповая',
    duration: 45,
    icon: '🌅'
  },
  {
    id: 6,
    title: 'Функциональный тренинг',
    coachId: 4,
    coachName: 'Смирнов А.В.',
    date: '2026-04-26',
    time: '11:00',
    maxCapacity: 10,
    currentBookings: 7,
    status: 'scheduled',
    type: 'Групповая',
    duration: 75,
    icon: '⚡'
  },
  {
    id: 7,
    title: 'Индивидуальная тренировка',
    coachId: 4,
    coachName: 'Смирнов А.В.',
    date: '2026-04-26',
    time: '15:00',
    maxCapacity: 1,
    currentBookings: 0,
    status: 'scheduled',
    type: 'Индивидуальная',
    duration: 60,
    icon: '🎯'
  },
  {
    id: 8,
    title: 'Вечерняя йога',
    coachId: 3,
    coachName: 'Козлова М.И.',
    date: '2026-04-26',
    time: '19:00',
    maxCapacity: 15,
    currentBookings: 11,
    status: 'scheduled',
    type: 'Групповая',
    duration: 60,
    icon: '🌙'
  }
];

const BOOKINGS = [
  {
    id: 1,
    trainingId: 1,
    clientId: 1,
    bookingDate: '2026-04-24',
    status: 'active'
  },
  {
    id: 2,
    trainingId: 3,
    clientId: 1,
    bookingDate: '2026-04-24',
    status: 'active'
  },
  {
    id: 3,
    trainingId: 5,
    clientId: 2,
    bookingDate: '2026-04-24',
    status: 'active'
  }
];

const VISIT_HISTORY = [
  { date: '2026-04-20', training: 'Йога для начинающих', status: 'attended' },
  { date: '2026-04-18', training: 'Пилатес', status: 'attended' },
  { date: '2026-04-16', training: 'Силовая тренировка', status: 'missed' },
  { date: '2026-04-14', training: 'Утренняя растяжка', status: 'attended' },
  { date: '2026-04-12', training: 'Кроссфит', status: 'attended' }
];

const SUBSCRIPTION_TYPES = [
  {
    id: 'single',
    name: 'Разовое посещение',
    sessions: 1,
    duration: '1 день',
    price: 500,
    icon: '🎫',
    color: '#64748b'
  },
  {
    id: 'monthly',
    name: 'Месячный',
    sessions: 12,
    duration: '30 дней',
    price: 3500,
    icon: '📅',
    color: '#3b82f6'
  },
  {
    id: 'quarterly',
    name: 'Квартальный',
    sessions: 36,
    duration: '90 дней',
    price: 9000,
    icon: '📆',
    color: '#8b5cf6'
  },
  {
    id: 'yearly',
    name: 'Годовой',
    sessions: 150,
    duration: '365 дней',
    price: 25000,
    icon: '🏆',
    color: '#f59e0b'
  }
];
