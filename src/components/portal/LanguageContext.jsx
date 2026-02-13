import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Portal Header
    portalCustomer: 'Customer Portal',
    portalEmployee: 'Employee Portal',

    // Employee Portal
    welcome: 'Welcome',
    employeeHub: 'Your employee hub — everything in one place.',
    completeProfile: 'Complete Your Employee Profile',
    completeProfileDesc: 'Set up your profile to access all portal features.',
    createProfile: 'Create Profile',
    createProfileHere: 'Create your profile above to see it here.',

    // Tabs
    tabProfile: 'Profile',
    tabFeedback: 'Feedback',
    tabFinances: 'Finances',
    tabSalary: 'Salary',
    tabFinance: 'Finance',
    tabHolidays: 'Holidays',
    tabTimeOff: 'Time Off',
    tabRaise: 'Raise/Review',
    tabGear: 'Gear',
    tabNews: 'News',

    // Profile Setup
    editProfile: 'Edit Your Profile',
    setupProfile: 'Set Up Your Profile',
    keepInfoUpdated: 'Keep your info up to date',
    completeToGetStarted: 'Complete your employee profile to get started',
    position: 'Position / Job Title',
    department: 'Department',
    startDate: 'Start Date',
    phone: 'Phone Number',
    emergencyName: 'Emergency Contact Name',
    emergencyPhone: 'Emergency Contact Phone',
    skills: 'Skills & Certifications',
    shortBio: 'Short Bio',
    saveChanges: 'Save Changes',
    profileUpdated: 'Profile updated',
    profileCreated: 'Profile created',

    // Feedback
    shareFeedback: 'Share Feedback',
    category: 'Category',
    yourFeedback: 'Your Feedback',
    feedbackPlaceholder: 'Share your thoughts on the working environment...',
    submitAnonymously: 'Submit anonymously',
    submit: 'Submit',
    feedbackSubmitted: 'Feedback submitted — thank you!',
    pastFeedback: 'Your Past Feedback',
    safety: 'Safety',
    culture: 'Culture',
    tools: 'Tools & Equipment',
    management: 'Management',
    other: 'Other',
    anonymous: 'Anonymous',

    // Salary
    yourCompensation: 'Your Compensation',
    perHour: '/ hour',
    rateNotSet: "Your hourly rate hasn't been set yet. Contact your manager.",
    waysToIncrease: 'Ways to Increase Your Wage',
    osha: 'Get OSHA 30 Certified',
    oshaDesc: 'Safety certifications often lead to $2–5/hr increases.',
    leadProject: 'Lead a Project',
    leadProjectDesc: 'Taking on project lead responsibilities demonstrates value for a raise.',
    learnSkill: 'Learn a New Trade Skill',
    learnSkillDesc: 'Cross-training in plumbing, electrical, or HVAC expands your value.',
    attendance: 'Consistent Attendance',
    attendanceDesc: 'Reliability and punctuality are key factors in performance reviews.',

    // Salary Growth Chart
    salaryGrowth: 'Salary Growth',
    yoyGrowthLabel: '% Growth',
    annualPayLabel: 'Annual Pay',
    pastYears: 'Past Years',
    currentYear: 'Current Year',
    yoyTooltip: 'Year-over-Year Growth',
    annualSalaryTooltip: 'Annual Salary',

    // Path to Success
    pathToSuccess: 'Your Path to Success',
    pathToSuccessDesc: 'What top earners do differently',
    hitGoals: 'Hit Your Goals',
    hitGoalsDesc: 'Complete assigned projects on time and within budget to earn performance bonuses.',
    goAboveBeyond: 'Go Above & Beyond',
    goAboveBeyondDesc: 'Taking initiative on extra tasks and helping teammates gets noticed by management.',
    buildReputation: 'Build Your Reputation',
    buildReputationDesc: 'Consistent quality work leads to promotions, better projects, and higher pay.',
    mentorOthers: 'Mentor Others',
    mentorOthersDesc: 'Training new team members shows leadership and qualifies you for foreman roles.',
    didYouKnow: 'Did you know?',
    didYouKnowText: 'Employees who complete certifications and take on leadership roles earn on average 25-40% more within 3 years. Your growth is in your hands!',

    // Bonus Tracker
    bonusTracker: 'Bonus Tracker',
    bonusSimpleExplain: 'When the company makes more money, you earn a bonus. Here\'s how it\'s going this year.',
    estimatedBonus: 'Your Estimated Bonus',
    bonusCalcExplain: '0.1% of company revenue so far',
    bonusTotalMade: 'Company Made So Far',
    bonusGoalLabel: 'Goal',
    bonusProgressLabel: 'How close are we to our goal?',
    bonusQuarterlyBreakdown: 'Revenue by Quarter',
    bonusQ1: 'Q1',
    bonusQ2: 'Q2',
    bonusQ3: 'Q3',
    bonusQ4: 'Q4',
    bonusHit: 'Hit!',
    bonusMiss: 'Close',
    bonusAboveGoal: 'Hit quarterly goal',
    bonusBelowGoal: 'Below quarterly goal',
    bonusGoalLine: 'Quarterly goal',
    bonusNow: 'Now',
    bonusAsOf: 'as of',
    bonusNote: 'Your bonus is a small percentage of the company\'s total revenue. The more the company earns, the bigger your bonus. Bonuses are paid every 3 months.',

    // Holidays
    holidaySchedule: `${new Date().getFullYear()} Holiday Schedule`,
    paidHolidays: 'Company-observed holidays',
    past: 'Past',
    summerHours: 'Summer Hours',
    summerHoursDesc: 'During June–August, Friday hours are 7 AM – 1 PM.',

    // Raise Request
    requestRaiseReview: 'Request a Raise or a Performance Review',
    newRequest: 'New Request',
    requestType: 'Request Type',
    requestRaise: 'Request a Raise',
    requestReview: 'Request a Performance Review',
    currentRate: 'Current Rate',
    requestedRate: 'Requested Rate ($/hr)',
    reason: 'Reason / Justification',
    raisePlaceholder: 'Describe why you deserve a raise...',
    reviewPlaceholder: 'Why would you like a performance review?',
    cancel: 'Cancel',
    submitRequest: 'Submit Request',
    requestSubmitted: 'Request submitted successfully',
    yourRequests: 'Your Requests',
    response: 'Response',

    // Gear
    employeeGear: 'Employee Gear',
    gearDesc: 'Get official Dancoby gear — hoodies, hats, tees and more. As a team member, your gear is on us.',
    employeeCode: 'Your Employee Code',
    freeGear: '100% off — completely free gear',
    browseShop: 'Browse the Shop',
    codeCopied: 'Discount code copied!',

    // Customer Portal
    finances: 'Finances',
    welcomeBack: 'Welcome back',
    projectsHappening: "Here's what's happening with your projects.",
    yourProjects: 'Your Projects',
    noProjectsYet: 'No projects assigned yet',
    noProjectsDesc: 'Your projects will appear here once assigned by the team.',
    needHelp: 'Need Help?',

    // JobTread
    tabJobTread: 'JobTread',
    jobtreadTitle: 'JobTread Tutorials',
    jobtreadDesc: 'Learn how to use JobTread with these video guides.',
    jobtreadMoreHelp: 'Need more help? Visit the official JobTread website.',

    // Notifications
    notifications: 'Notifications',
    notificationDesc: 'Stay updated with your latest alerts and messages.',
    markAllRead: 'Mark all read',
    viewDetails: 'View Details',

    // News
    companyNews: 'Company News',
    noNewsYet: 'No news yet. Check back later!',

    // Language
    language: 'Language',
    more: 'More',

    // Onboarding
    onboardWelcomeTitle: 'Welcome to the team',
    onboardWelcomeDesc: 'You\'re now part of the Dancoby Construction family. This portal is your one-stop hub for pay info, time off, company updates, and more.',
    onboardQuickStart: 'Quick start guide:',
    onboardStep1: 'Set up your employee profile',
    onboardStep2: 'Explore your salary & benefits',
    onboardStep3: 'Check the holiday schedule',
    onboardResourcesTitle: 'What\'s Available for You',
    onboardResourcesDesc: 'Here\'s what you can access from your portal:',
    onboardSalaryDesc: 'View your pay, growth chart & bonus tracker',
    onboardHolidaysDesc: 'See all company holidays & days off',
    onboardFeedbackDesc: 'Share ideas & feedback with management',
    onboardTimeOffDesc: 'Request vacation & personal days',
    onboardProfileTitle: 'Let\'s Set Up Your Profile',
    onboardProfileDesc: 'Add your details so your manager knows your role, skills, and emergency contacts. It only takes a minute.',
    onboardProfileHint: 'Tip: Employees with complete profiles get access to all portal features faster!',
    onboardSkip: 'Skip for now',
    onboardNext: 'Next',
    onboardSetupProfile: 'Set Up Profile',
    firstName: 'First Name',

    // Quarterly Share
    quarterlyShare: 'Quarterly Share',
    quarterlyShareDesc: 'Your share of company growth',
    inProgress: 'In Progress',
    earningsFromGrowth: 'Earnings from growth',
    ytdTotal: 'Year-to-date total',
    updated: 'Updated',
    paidViaPayroll: 'Paid via payroll',
    keepItUp: "You're growing with the company — keep up the great work! 💪",
    stayTuned: 'Revenue is building — your share is on its way!',
    growingStrong: 'Growing strong this quarter!',
    pastQuarters: 'Past Quarters',

    // Standards
    companyStandards: 'Standards',
    standardsDesc: 'Reference images showing the right and wrong way to do things.',
    noStandards: 'No standards have been added yet.',
    allFilter: 'All',

    // Profile Setup
    profileSettings: 'Profile Settings',
    profileSettingsDesc: 'Manage your personal information and account security.',
    personalInfo: 'Personal Information',
    personalInfoDesc: 'Update your personal details and contact information.',
    general: 'General',
    workDetails: 'Work Details',
    security: 'Security',
    lastName: 'Last Name',
    contactEmail: 'Contact Email',
    emergencyContact: 'Emergency Contact',
    contactName: 'Contact Name',
    contactPhone: 'Contact Phone',
    employmentDetails: 'Employment Details',
    employmentDetailsDesc: 'View and manage your role information.',
    positionTitle: 'Position / Title',
    accountSecurity: 'Account Security',
    accountSecurityDesc: 'Manage your login credentials.',
    loginEmail: 'Login Email',
    loginEmailManaged: 'This email is managed by your organization administrator.',
    passwordReset: 'Password Reset',
    passwordResetDesc: 'Receive an email with instructions to reset your password.',
    sendResetInstructions: 'Send Reset Instructions',
    sendingEmail: 'Sending Email...',
    saving: 'Saving...',
    saved: 'Saved',
    noPosition: 'No Position Set',
    joined: 'Joined',
    tellAboutYourself: 'Tell us about yourself...',

    // Time Off
    requestTimeOff: 'Request Time Off',
    endDate: 'End Date',
    notes: 'Notes (optional)',
    additionalDetails: 'Any additional details...',
    timeOffSubmitted: 'Time off request submitted',
    noTimeOffRequests: 'No time off requests yet.',
    businessDays: 'business days',
    businessDay: 'business day',
    vacation: 'Vacation',
    personal: 'Personal',
    sick: 'Sick',
    family: 'Family',
    manager: 'Manager',

    // Notifications
    noNotifications: 'No notifications yet',
    loading: 'Loading...',

    // JobTread
    noTutorials: 'No tutorials available yet.',

    // Feedback
    feedbackPrivate: 'Messages are private and only shared with your supervisor.',

    // Holidays
    noHolidays: 'No holidays configured yet.',

    // Daily Check-In
    checkInTitle: 'How are you feeling today?',
    checkInSubtitle: 'Your daily mood check-in',
    checkInNotePlaceholder: 'Want to share more? (optional)',
    checkInSkip: 'Skip',
    checkInSubmit: 'Submit',
    checkInThanks: 'Thanks for checking in!',
    checkInThanksDesc: 'Have a great day!',
    checkInTodayDone: "You've checked in today!",
    checkInHistory: 'Recent Check-Ins',
    tabCheckIn: 'Check-In',

    // More sheet / Sidebar
    openJobTread: 'Open JobTread',
    external: 'External',
  },
  es: {
    portalCustomer: 'Portal del Cliente',
    portalEmployee: 'Portal del Empleado',

    welcome: 'Bienvenido',
    employeeHub: 'Tu centro de empleado — todo en un solo lugar.',
    completeProfile: 'Completa Tu Perfil de Empleado',
    completeProfileDesc: 'Configura tu perfil para acceder a todas las funciones del portal.',
    createProfile: 'Crear Perfil',
    createProfileHere: 'Crea tu perfil arriba para verlo aquí.',

    tabProfile: 'Perfil',
    tabFeedback: 'Comentarios',
    tabFinances: 'Finanzas',
    tabSalary: 'Salario',
    tabFinance: 'Finanzas',
    tabHolidays: 'Festivos',
    tabTimeOff: 'Días Libres',
    tabRaise: 'Aumento',
    tabGear: 'Equipo',
    tabNews: 'Noticias',

    editProfile: 'Editar Tu Perfil',
    setupProfile: 'Configura Tu Perfil',
    keepInfoUpdated: 'Mantén tu información actualizada',
    completeToGetStarted: 'Completa tu perfil de empleado para comenzar',
    position: 'Puesto / Título',
    department: 'Departamento',
    startDate: 'Fecha de Inicio',
    phone: 'Número de Teléfono',
    emergencyName: 'Contacto de Emergencia',
    emergencyPhone: 'Teléfono de Emergencia',
    skills: 'Habilidades y Certificaciones',
    shortBio: 'Biografía Corta',
    saveChanges: 'Guardar Cambios',
    profileUpdated: 'Perfil actualizado',
    profileCreated: 'Perfil creado',

    shareFeedback: 'Compartir Comentarios',
    category: 'Categoría',
    yourFeedback: 'Tus Comentarios',
    feedbackPlaceholder: 'Comparte tus opiniones sobre el ambiente de trabajo...',
    submitAnonymously: 'Enviar anónimamente',
    submit: 'Enviar',
    feedbackSubmitted: '¡Comentarios enviados — gracias!',
    pastFeedback: 'Tus Comentarios Anteriores',
    safety: 'Seguridad',
    culture: 'Cultura',
    tools: 'Herramientas y Equipo',
    management: 'Gerencia',
    other: 'Otro',
    anonymous: 'Anónimo',

    yourCompensation: 'Tu Compensación',
    perHour: '/ hora',
    rateNotSet: 'Tu tarifa por hora aún no se ha establecido. Contacta a tu gerente.',
    waysToIncrease: 'Formas de Aumentar Tu Salario',
    osha: 'Obtener Certificación OSHA 30',
    oshaDesc: 'Las certificaciones de seguridad a menudo resultan en aumentos de $2–5/hr.',
    leadProject: 'Liderar un Proyecto',
    leadProjectDesc: 'Asumir responsabilidades de liderazgo demuestra valor para un aumento.',
    learnSkill: 'Aprender una Nueva Habilidad',
    learnSkillDesc: 'Capacitación cruzada en plomería, electricidad o HVAC amplía tu valor.',
    attendance: 'Asistencia Constante',
    attendanceDesc: 'La confiabilidad y puntualidad son factores clave en las evaluaciones.',

    salaryGrowth: 'Crecimiento Salarial',
    yoyGrowthLabel: '% Crecimiento',
    annualPayLabel: 'Pago Anual',
    pastYears: 'Años Anteriores',
    currentYear: 'Año Actual',
    yoyTooltip: 'Crecimiento Interanual',
    annualSalaryTooltip: 'Salario Anual',

    pathToSuccess: 'Tu Camino al Éxito',
    pathToSuccessDesc: 'Lo que hacen diferente los mejores',
    hitGoals: 'Cumple Tus Metas',
    hitGoalsDesc: 'Completa proyectos asignados a tiempo y dentro del presupuesto para ganar bonos.',
    goAboveBeyond: 'Da Más de Lo Esperado',
    goAboveBeyondDesc: 'Tomar la iniciativa en tareas adicionales y ayudar a compañeros es notado por la gerencia.',
    buildReputation: 'Construye Tu Reputación',
    buildReputationDesc: 'Trabajo consistente de calidad lleva a ascensos, mejores proyectos y mejor paga.',
    mentorOthers: 'Guía a Otros',
    mentorOthersDesc: 'Entrenar a nuevos miembros del equipo demuestra liderazgo y te califica para roles de capataz.',
    didYouKnow: '¿Sabías que?',
    didYouKnowText: 'Los empleados que completan certificaciones y asumen roles de liderazgo ganan en promedio 25-40% más en 3 años. ¡Tu crecimiento está en tus manos!',

    bonusTracker: 'Rastreador de Bonos',
    bonusSimpleExplain: 'Cuando la empresa gana más dinero, tú recibes un bono. Así va este año.',
    estimatedBonus: 'Tu Bono Estimado',
    bonusCalcExplain: '0.1% de los ingresos de la empresa hasta ahora',
    bonusTotalMade: 'La Empresa Ha Ganado',
    bonusGoalLabel: 'Meta',
    bonusProgressLabel: '¿Qué tan cerca estamos de nuestra meta?',
    bonusQuarterlyBreakdown: 'Ingresos por Trimestre',
    bonusQ1: 'T1',
    bonusQ2: 'T2',
    bonusQ3: 'T3',
    bonusQ4: 'T4',
    bonusHit: '¡Sí!',
    bonusMiss: 'Cerca',
    bonusAboveGoal: 'Meta trimestral alcanzada',
    bonusBelowGoal: 'Debajo de la meta trimestral',
    bonusGoalLine: 'Meta trimestral',
    bonusNow: 'Ahora',
    bonusAsOf: 'al',
    bonusNote: 'Tu bono es un pequeño porcentaje de los ingresos totales de la empresa. Cuanto más gane la empresa, mayor será tu bono. Los bonos se pagan cada 3 meses.',

    holidaySchedule: `Calendario de Festivos ${new Date().getFullYear()}`,
    paidHolidays: 'Días festivos de la empresa',
    past: 'Pasado',
    summerHours: 'Horario de Verano',
    summerHoursDesc: 'Durante junio–agosto, los viernes son de 7 AM a 1 PM.',

    requestRaiseReview: 'Solicitar Aumento / Evaluación',
    newRequest: 'Nueva Solicitud',
    requestType: 'Tipo de Solicitud',
    requestRaise: 'Solicitar un Aumento',
    requestReview: 'Solicitar una Evaluación',
    currentRate: 'Tarifa Actual',
    requestedRate: 'Tarifa Solicitada ($/hr)',
    reason: 'Razón / Justificación',
    raisePlaceholder: 'Describe por qué mereces un aumento...',
    reviewPlaceholder: '¿Por qué te gustaría una evaluación de desempeño?',
    cancel: 'Cancelar',
    submitRequest: 'Enviar Solicitud',
    requestSubmitted: 'Solicitud enviada exitosamente',
    yourRequests: 'Tus Solicitudes',
    response: 'Respuesta',

    employeeGear: 'Equipo para Empleados',
    gearDesc: 'Obtén equipo oficial de Dancoby — sudaderas, gorras, camisetas y más. Como miembro del equipo, es gratis.',
    employeeCode: 'Tu Código de Empleado',
    freeGear: '100% de descuento — equipo completamente gratis',
    browseShop: 'Ver la Tienda',
    codeCopied: '¡Código de descuento copiado!',

    finances: 'Finanzas',
    welcomeBack: 'Bienvenido de nuevo',
    projectsHappening: 'Esto es lo que está pasando con tus proyectos.',
    yourProjects: 'Tus Proyectos',
    noProjectsYet: 'Aún no hay proyectos asignados',
    noProjectsDesc: 'Tus proyectos aparecerán aquí una vez asignados por el equipo.',
    needHelp: '¿Necesitas Ayuda?',

    tabJobTread: 'JobTread',
    jobtreadTitle: 'Tutoriales de JobTread',
    jobtreadDesc: 'Aprende a usar JobTread con estas guías en video.',
    jobtreadMoreHelp: 'Necesitas más ayuda? Visita el sitio oficial de JobTread.',

    // Notifications
    notifications: 'Notificaciones',
    notificationDesc: 'Mantente actualizado con tus últimas alertas y mensajes.',
    markAllRead: 'Marcar todo como leído',
    viewDetails: 'Ver Detalles',

    companyNews: 'Noticias de la Empresa',
    noNewsYet: 'No hay noticias por ahora.',

    language: 'Idioma',
    more: 'Más',

    // Onboarding
    onboardWelcomeTitle: 'Bienvenido al equipo',
    onboardWelcomeDesc: 'Ahora eres parte de la familia Dancoby Construction. Este portal es tu centro para información de pago, días libres, actualizaciones y más.',
    onboardQuickStart: 'Guía rápida:',
    onboardStep1: 'Configura tu perfil de empleado',
    onboardStep2: 'Explora tu salario y beneficios',
    onboardStep3: 'Revisa el calendario de festivos',
    onboardResourcesTitle: 'Lo Que Está Disponible Para Ti',
    onboardResourcesDesc: 'Esto es lo que puedes acceder desde tu portal:',
    onboardSalaryDesc: 'Ve tu pago, gráfico de crecimiento y bonos',
    onboardHolidaysDesc: 'Ve todos los días festivos de la empresa',
    onboardFeedbackDesc: 'Comparte ideas y comentarios con la gerencia',
    onboardTimeOffDesc: 'Solicita vacaciones y días personales',
    onboardProfileTitle: 'Configuremos Tu Perfil',
    onboardProfileDesc: 'Agrega tus datos para que tu gerente conozca tu rol, habilidades y contactos de emergencia. Solo toma un minuto.',
    onboardProfileHint: '¡Consejo: Los empleados con perfiles completos acceden a todas las funciones del portal más rápido!',
    onboardSkip: 'Saltar por ahora',
    onboardNext: 'Siguiente',
    onboardSetupProfile: 'Configurar Perfil',
    firstName: 'Nombre',

    // Quarterly Share
    quarterlyShare: 'Participación Trimestral',
    quarterlyShareDesc: 'Tu parte del crecimiento de la empresa',
    inProgress: 'En Progreso',
    earningsFromGrowth: 'Ganancias del crecimiento',
    ytdTotal: 'Total del año hasta la fecha',
    updated: 'Actualizado',
    paidViaPayroll: 'Pagado por nómina',
    keepItUp: '¡Estás creciendo con la empresa — sigue así! 💪',
    stayTuned: 'Los ingresos están creciendo — ¡tu parte viene en camino!',
    growingStrong: '¡Creciendo fuerte este trimestre!',
    pastQuarters: 'Trimestres Anteriores',

    // Standards
    companyStandards: 'Estándares',
    standardsDesc: 'Imágenes de referencia que muestran la forma correcta e incorrecta de hacer las cosas.',
    noStandards: 'Aún no se han agregado estándares.',
    allFilter: 'Todos',

    // Profile Setup
    profileSettings: 'Configuración del Perfil',
    profileSettingsDesc: 'Administra tu información personal y seguridad de la cuenta.',
    personalInfo: 'Información Personal',
    personalInfoDesc: 'Actualiza tus datos personales y de contacto.',
    general: 'General',
    workDetails: 'Detalles del Trabajo',
    security: 'Seguridad',
    lastName: 'Apellido',
    contactEmail: 'Correo de Contacto',
    emergencyContact: 'Contacto de Emergencia',
    contactName: 'Nombre del Contacto',
    contactPhone: 'Teléfono del Contacto',
    employmentDetails: 'Detalles del Empleo',
    employmentDetailsDesc: 'Ve y administra la información de tu puesto.',
    positionTitle: 'Puesto / Título',
    accountSecurity: 'Seguridad de la Cuenta',
    accountSecurityDesc: 'Administra tus credenciales de acceso.',
    loginEmail: 'Correo de Acceso',
    loginEmailManaged: 'Este correo es administrado por el administrador de tu organización.',
    passwordReset: 'Restablecer Contraseña',
    passwordResetDesc: 'Recibe un correo con instrucciones para restablecer tu contraseña.',
    sendResetInstructions: 'Enviar Instrucciones',
    sendingEmail: 'Enviando Correo...',
    saving: 'Guardando...',
    saved: 'Guardado',
    noPosition: 'Sin Puesto Asignado',
    joined: 'Se unió',
    tellAboutYourself: 'Cuéntanos sobre ti...',

    // Time Off
    requestTimeOff: 'Solicitar Tiempo Libre',
    endDate: 'Fecha de Fin',
    notes: 'Notas (opcional)',
    additionalDetails: 'Detalles adicionales...',
    timeOffSubmitted: 'Solicitud de tiempo libre enviada',
    noTimeOffRequests: 'Aún no hay solicitudes de tiempo libre.',
    businessDays: 'días hábiles',
    businessDay: 'día hábil',
    vacation: 'Vacaciones',
    personal: 'Personal',
    sick: 'Enfermedad',
    family: 'Familia',
    manager: 'Gerente',

    // Notifications
    noNotifications: 'Aún no hay notificaciones',
    loading: 'Cargando...',

    // JobTread
    noTutorials: 'Aún no hay tutoriales disponibles.',

    // Feedback
    feedbackPrivate: 'Los mensajes son privados y solo se comparten con tu supervisor.',

    // Holidays
    noHolidays: 'Aún no se han configurado festivos.',

    // Daily Check-In
    checkInTitle: '¿Cómo te sientes hoy?',
    checkInSubtitle: 'Tu check-in diario de ánimo',
    checkInNotePlaceholder: '¿Quieres compartir más? (opcional)',
    checkInSkip: 'Omitir',
    checkInSubmit: 'Enviar',
    checkInThanks: '¡Gracias por registrarte!',
    checkInThanksDesc: '¡Que tengas un gran día!',
    checkInTodayDone: '¡Ya hiciste tu check-in hoy!',
    checkInHistory: 'Check-Ins Recientes',
    tabCheckIn: 'Check-In',

    // More sheet / Sidebar
    openJobTread: 'Abrir JobTread',
    external: 'Externo',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('portalLang') || 'en');

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('portalLang', newLang);
  };

  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}