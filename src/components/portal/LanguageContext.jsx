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
    tabSalary: 'Salary',
    tabHolidays: 'Holidays',
    tabTimeOff: 'Time Off',
    tabRaise: 'Raise/Review',
    tabGear: 'Gear',

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

    // Holidays
    holidaySchedule: `${new Date().getFullYear()} Holiday Schedule`,
    paidHolidays: 'Company-observed paid holidays',
    past: 'Past',
    summerHours: 'Summer Hours',
    summerHoursDesc: 'During June–August, Friday hours are 7 AM – 1 PM.',

    // Raise Request
    requestRaiseReview: 'Request Raise / Review',
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
    welcomeBack: 'Welcome back',
    projectsHappening: "Here's what's happening with your projects.",
    yourProjects: 'Your Projects',
    noProjectsYet: 'No projects assigned yet',
    noProjectsDesc: 'Your projects will appear here once assigned by the team.',
    needHelp: 'Need Help?',

    // Language
    language: 'Language',
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
    tabSalary: 'Salario',
    tabHolidays: 'Festivos',
    tabTimeOff: 'Días Libres',
    tabRaise: 'Aumento',
    tabGear: 'Equipo',

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

    holidaySchedule: `Calendario de Festivos ${new Date().getFullYear()}`,
    paidHolidays: 'Días festivos pagados de la empresa',
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

    welcomeBack: 'Bienvenido de nuevo',
    projectsHappening: 'Esto es lo que está pasando con tus proyectos.',
    yourProjects: 'Tus Proyectos',
    noProjectsYet: 'Aún no hay proyectos asignados',
    noProjectsDesc: 'Tus proyectos aparecerán aquí una vez asignados por el equipo.',
    needHelp: '¿Necesitas Ayuda?',

    language: 'Idioma',
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