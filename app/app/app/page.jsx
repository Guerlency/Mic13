'use client';

import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');
  
  // --- SYSTÈME DE NOTIFICATIONS GLOBALES (ADMINISTRATEUR) ---
  const [globalNotifications, setGlobalNotifications] = useState([
    { id: 1, targetType: 'ALL', targetValue: 'Tous', text: 'Bienvenue sur la version V9 de BloodPass Charleroi !', date: '25/09/2026' }
  ]);
  const [adminMsg, setAdminMsg] = useState('');
  const [adminTargetType, setAdminTargetType] = useState('POSTAL'); // POSTAL, BLOOD, ALL
  const [adminTargetValue, setAdminTargetValue] = useState('6000');

  // --- GESTION DES CODES DE SESSIONS (12 HEURES) ---
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');

  // --- ÉTAT DU DONNEUR, HISTORIQUE ET CALENDRIER ---
  const [donor, setDonor] = useState({
    email: 'guerlency.mic13@charleroi.be', 
    postalCode: '6000', 
    phone: '0470123456', 
    age: 24, 
    weight: 68, 
    height: 172, 
    gender: 'M',
    donationType: 'STHO', 
    bloodGroup: 'O+',
    eligibilityChecked: false, 
    isGloballyEligible: true, 
    rejectionReason: '',
    vst: 0, 
    maxAllowedVolume: 0, 
    generatedCode: '',
    residueConsent: null, 
    donorSignature: '', 
    doctorSignature: '',
    medicalConclusion: '', 
    exclusionType: 'Temporaire',
    // Compteur de badges et récompenses (Donneur régulier)
    donationCount: 5,
    badges: [
      { name: '🥇 Premier Don', desc: 'Validé en janvier 2026', color: 'bg-amber-500' },
      { name: '🩸 Sauveur régulier', desc: 'Plus de 3 dons accomplis', color: 'bg-red-500' },
      { name: '🛡️ Donneur de Bronze', desc: 'Fidélité ETS Charleroi', color: 'bg-amber-700' }
    ],
    // Calendrier et Rendez-vous
    appointments: [
      { id: 'APT-102', date: '2026-10-05', time: '14:30', location: 'Maison du Don - Loverval', status: 'Confirmé' }
    ],
    pastDonations: [
      { id: 'DON-901', date: '14/05/2026', type: 'Sang Total', location: 'Maison du Don - Loverval', status: 'Validé' },
      { id: 'DON-742', date: '10/01/2026', type: 'Sang Total', location: 'Centre Hospitalier de Charleroi', status: 'Validé' }
    ]
  });

  // États pour la prise de rendez-vous
  const [selectedDate, setSelectedDate] = useState('2026-10-12');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedLoc, setSelectedLoc] = useState('Maison du Don - Loverval');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Formulaire officiel complet GEN-DOC-FO-01A V9
  const initialQuestionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous été transfusé(e) ou reçu une greffe ?", type: 'date_place' },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cerveau, du cœur ou de la moëlle épinière ?", type: 'date_place' },
    { id: 'Q6', section: 'SANTÉ', text: "Eu un diabète traité par insuline ?", type: 'comment' },
    { id: 'Q7', section: 'SANTÉ', text: "Eu une maladie de Chagas, une malaria (paludisme), une fièvre zika ?", type: 'date_place' },
    { id: 'Q8', section: 'SANTÉ', text: "Eu un cancer, une maladie du sang ou une tendance anormale au saignement ?", type: 'date_place' },
    { id: 'Q13', section: 'MÉDICAMENTS', text: "Pris du Proscar, du Combodart, ou de l'Avodart au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'M16', section: 'MÉDICAMENTS', text: "Pris du Roaccutane au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'Q18', section: 'MÉDICAMENTS', text: "Consommé de la drogue par voie nasale (snif) au cours des 12 derniers mois ?", type: 'comment' },
    { id: 'Q20', section: 'VACCINS', text: "Avez-vous été vacciné(e) au cours des 30 derniers jours ou suivi une désensibilisation les 7 derniers jours ?", type: 'comment' },
    { id: 'Q24', section: 'EXPOSITION', text: "Au cours des 4 derniers mois, avez-vous fait un tatouage, un piercing ou un maquillage permanent ?", type: 'date_place' },
    { id: 'Q30', section: 'EXPOSITION', text: "Êtes-vous allé chez le dentiste il y a moins d'une semaine ?", type: 'date_place' },
    { id: 'Q36', section: 'VOYAGES', text: "Au cours des 6 derniers mois, avez-vous voyagé ou séjourné en dehors de la Belgique ?", type: 'date_place' }
  ];

  const [answersV9, setAnswersV9] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentPlace, setCurrentPlace] = useState('');
  const [currentComment, setCurrentComment] = useState('');

  // --- LOGIQUE MORPHOLOGIQUE (LOI & NADLER) ---
  const handlePhysicalCheck = (e) => {
    e.preventDefault();
    let eligible = true;
    let reason = "";

    if (donor.age < 18 || donor.age >= 66) {
      eligible = false;
      reason = "L'âge légal d'admissibilité à l'ETS doit être compris entre 18 ans et la veille du 66ème anniversaire.";
    } else if (donor.weight < 50) {
      eligible = false;
      reason = "Le poids minimum légal exigé pour le don est de 50 kg.";
    }

    const heightInInches = donor.height * 0.3937;
    const weightInPounds = donor.weight * 2.2046;
    const calculatedVst = (0.006012 * Math.pow(heightInInches, 3)) + (14.6 * weightInPounds) + 604;
    const maxVolume = calculatedVst * (donor.donationType === 'PLASMA' ? 0.18 : 0.13);

    setDonor({
      ...donor,
      eligibilityChecked: true,
      isGloballyEligible: eligible,
      rejectionReason: reason,
      vst: Math.round(calculatedVst),
      maxAllowedVolume: Math.round(maxVolume)
    });
  };

  const saveQuestionnaireAndGenerateCode = () => {
    const codeUnique = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + (12 * 60 * 60 * 1000);

    const sessionPayload = {
      donorInfo: { ...donor },
      responses: { ...answersV9 },
      historyLogs: [
        { action: "Soumission du questionnaire médical", timestamp: new Date().toLocaleTimeString(), operator: "Donneur" }
      ],
      expiresAt: expirationTime
    };

    setActiveSessions({ ...activeSessions, [codeUnique]: sessionPayload });
    setDonor({ ...donor, generatedCode: codeUnique });
  };

  const nextQuestion = () => {
    const currentQuestion = initialQuestionsV9[currentQuestionIndex];
    setAnswersV9({
      ...answersV9,
      [currentQuestion.id]: {
        value: currentResponse || 'NON',
        date: currentDate,
        place: currentPlace,
        comment: currentComment
      }
    });

    setCurrentResponse('');
    setCurrentDate('');
    setCurrentPlace('');
    setCurrentComment('');

    if (currentQuestionIndex < initialQuestionsV9.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Envoi notification ciblée par l'administrateur
  const handleSendAdminNotification = (e) => {
    e.preventDefault();
    if (!adminMsg.trim()) return;

    const newNotif = {
      id: Date.now(),
      targetType: adminTargetType,
      targetValue: adminTargetValue,
      text: adminMsg,
      date: '25/09/2026'
    };

    setGlobalNotifications([newNotif, ...globalNotifications]);
    setAdminMsg('');
    alert(`Notification groupée envoyée avec succès aux donneurs ciblés par ${adminTargetType} : ${adminTargetValue}.`);
  };

  // Simulation d'alerte SMS
  const triggerSmsAlertSim = () => {
    alert(`[Alerte SMS BloodPass] Envoyé au ${donor.phone} : "Cher Guerlency, votre délai légal de 62 jours est expiré. Les réserves de sang O+ à Charleroi sont basses, venez donner !"`);
  };

  // Demande de rendez-vous calendrier
  const handleBookAppointment = (e) => {
    e.preventDefault();
    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      date: selectedDate,
      time: selectedTime,
      location: selectedLoc,
      status: 'En attente de validation'
    };
    setDonor({
      ...donor,
      appointments: [newApt, ...donor.appointments]
    });
    alert("Votre demande de rendez-vous a bien été transmise à l'administration de l'ETS Charleroi.");
  };

  // Filtrage des notifications visibles par notre donneur test
  const filteredNotificationsForDonor = useMemo(() => {
    return globalNotifications.filter(n => {
      if (n.targetType === 'ALL') return true;
      if (n.targetType === 'POSTAL' && n.targetValue === donor.postalCode) return true;
      if (n.targetType === 'BLOOD' && n.targetValue === donor.bloodGroup) return true;
      return false;
    });
  }, [globalNotifications, donor]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-red-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">🩸 BloodPass — Charleroi</h1>
        {currentSpace !== 'auth' && (
          <button onClick={() => setCurrentSpace('auth')} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs transition">
            Espaces Principaux
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6 pb-24">
        {currentSpace === 'auth' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-auto mt-16 border border-slate-200">
            <h2 className="text-md font-bold text-center text-slate-900 mb-4">Accès Portails BloodPass</h2>
            <div className="space-y-3">
              <button onClick={() => setCurrentSpace('donor_home')} className="w-full bg-red-600 text-white p-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex justify-between items-center">
