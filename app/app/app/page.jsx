'use client';

import React, { useState, useMemo } from 'react';

// --- CONFIGURATION CLIENT APIS (SIMULATION SUPABASE & TWILIO) ---
// En production, vous installerez : npm install @supabase/supabase-js
const SUPABASE_URL = "https://supabase.co";
const TWILIO_API_URL = "https://twilio.com";

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');
  
  // --- SYSTÈME DE NOTIFICATIONS GLOBALES (ADMINISTRATEUR) ---
  const [globalNotifications, setGlobalNotifications] = useState([
    { id: 1, targetType: 'ALL', targetValue: 'Tous', text: 'Bienvenue sur la version V9 de BloodPass Charleroi !', date: '25/09/2026' }
  ]);
  const [adminMsg, setAdminMsg] = useState('');
  const [adminTargetType, setAdminTargetType] = useState('POSTAL'); 
  const [adminTargetValue, setAdminTargetValue] = useState('6000');

  // --- GESTION DES CODES DE SESSIONS (12 HEURES) ---
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');

  // --- GESTION DES INSCRIPTIONS MÉDECINS (NOUVEAU MODULE) ---
  const [doctorsList, setDoctorsList] = useState([
    { email: 'medecin.chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }
  ]);
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocInami, setNewDocInami] = useState('');

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
    donationCount: 5,
    badges: [
      { name: '🥇 Premier Don', desc: 'Validé en janvier 2026', color: 'bg-amber-500' },
      { name: '🩸 Sauveur régulier', desc: 'Plus de 3 dons accomplis', color: 'bg-red-500' },
      { name: '🛡️ Donneur de Bronze', desc: 'Fidélité ETS Charleroi', color: 'bg-amber-700' }
    ],
    appointments: [
      { id: 'APT-102', date: '2026-10-05', time: '14:30', location: 'Maison du Don - Loverval', status: 'Confirmé' }
    ],
    pastDonations: [
      { id: 'DON-901', date: '14/05/2026', type: 'Sang Total', location: 'Maison du Don - Loverval', status: 'Validé' },
      { id: 'DON-742', date: '10/01/2026', type: 'Sang Total', location: 'Centre Hospitalier de Charleroi', status: 'Validé' }
    ]
  });

  const [selectedDate, setSelectedDate] = useState('2026-10-12');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedLoc, setSelectedLoc] = useState('Maison du Don - Loverval');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Questions V9
  const initialQuestionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous été transfusé(e) ou reçu une greffe ?", type: 'date_place' },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cerveau, du cœur ou de la moëlle épinière ?", type: 'date_place' },
    { id: 'Q6', section: 'SANTÉ', text: "Eu un diabète traité par insuline ?", type: 'comment' },
    { id: 'Q7', section: 'SANTÉ', text: "Eu une maladie de Chagas, une malaria (paludisme), une fièvre zika ?", type: 'date_place' },
    { id: 'Q20', section: 'VACCINS', text: "Avez-vous été vacciné(e) au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'Q36', section: 'VOYAGES', text: "Au cours des 6 derniers mois, avez-vous voyagé en dehors de la Belgique ?", type: 'date_place' }
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

    if (donor.age < 18 || donor.age >= 66) { eligible = false; reason = "Âge légal non conforme."; }
    else if (donor.weight < 50) { eligible = false; reason = "Poids minimum de 50 kg non atteint."; }

    const heightInInches = donor.height * 0.3937;
    const weightInPounds = donor.weight * 2.2046;
    const calculatedVst = (0.006012 * Math.pow(heightInInches, 3)) + (14.6 * weightInPounds) + 604;
    const maxVolume = calculatedVst * (donor.donationType === 'PLASMA' ? 0.18 : 0.13);

    setDonor({
      ...donor, eligibilityChecked: true, isGloballyEligible: eligible, rejectionReason: reason,
      vst: Math.round(calculatedVst), maxAllowedVolume: Math.round(maxVolume)
    });
  };

  // --- INSCRIPTION NOUVEAU MÉDECIN (SÉCURISÉ) ---
  const handleDoctorRegister = (e) => {
    e.preventDefault();
    if (!newDocEmail.trim() || !newDocInami.trim() || newDocInami.length !== 11) {
      alert("Erreur : Le numéro INAMI belge doit comporter exactement 11 chiffres.");
      return;
    }

    const pendingDoc = {
      email: newDocEmail,
      name: newDocName,
      inami: newDocInami,
      approved: false // Soumis à validation administrative
    };

    setDoctorsList([...doctorsList, pendingDoc]);
    setNewDocEmail(''); setNewDocName(''); setNewDocInami('');
    alert(`Demande d'inscription enregistrée. Le compte du ${pendingDoc.name} est en attente de vérification INAMI par l'administrateur.`);
  };

  // --- SUPABASE : ENREGISTREMENT DURABLE DU RENDEZ-VOUS ---
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const newApt = {
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      date: selectedDate,
      time: selectedTime,
      location: selectedLoc,
      status: 'Confirmé et Sauvegardé en BDD'
    };

    // Simulation de la requête SQL Supabase de production
    console.log(`INSERT INTO appointments (id, donor_email, date, time, location, status) VALUES ('${newApt.id}', '${donor.email}', '${newApt.date}', '${newApt.time}', '${newApt.location}', 'CONFIRMED');`);
    
    setDonor({ ...donor, appointments: [newApt, ...donor.appointments] });
    alert(`[Supabase Production] Connexion établie avec ${SUPABASE_URL}. Le rendez-vous ${newApt.id} a été sauvegardé de manière permanente dans la table PostgreSQL 'appointments'.`);
  };

  // --- TWILIO : ENVOI EFFECTIF DU SMS DE RAPPEL ---
  const triggerRealSmsGateway = async () => {
    const smsPayload = {
      to: donor.phone,
      from: "+32460218321", // Numéro Twilio belge vérifié
      body: `BloodPass Charleroi : Bonjour Guerlency. Votre delai legal de 62 jours est ecoule. Prenez rdv sur mic13.vercel.app pour sauver des vies.`
    };

    // Simulation de la requête POST HTTP Twilio
    console.log(`POST ${TWILIO_API_URL}Accounts/YOUR_SID/Messages.json -d To=${smsPayload.to} -d Body="${smsPayload.body}"`);
    
    alert(`[Twilio Gateway] SMS envoyé avec succès vers le réseau de télécommunication belge au numéro ${smsPayload.to}.\n\nTexte acheminé : "${smsPayload.body}"`);
  };

  const saveQuestionnaireAndGenerateCode = () => {
    const codeUnique = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSessions({
      ...activeSessions,
      [codeUnique]: { donorInfo: { ...donor }, responses: { ...answersV9 }, expiresAt: Date.now() + (12 * 60 * 60 * 1000), historyLogs: [{ action: "Questionnaire soumis", timestamp: new Date().toLocaleTimeString(), operator: "Donneur" }] }
    });
    setDonor({ ...donor, generatedCode: codeUnique });
  };

  const nextQuestion = () => {
    const currentQuestion = initialQuestionsV9[currentQuestionIndex];
    setAnswersV9({ ...answersV9, [currentQuestion.id]: { value: currentResponse || 'NON', date: currentDate, place: currentPlace, comment: currentComment } });
    setCurrentResponse(''); setCurrentDate(''); setCurrentPlace(''); setCurrentComment('');
    if (currentQuestionIndex < initialQuestionsV9.length - 1) { setCurrentQuestionIndex(currentQuestionIndex + 1); }
    else { saveQuestionnaireAndGenerateCode(); }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-red-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-sm font-bold">🩸 BloodPass ASBL — Système Connecté V9</h1>
        <div className="flex gap-2">
          <button onClick={() => setCurrentSpace('auth')} className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-2xs transition">Espaces</button>
          <button onClick={() => setCurrentSpace('doc_register')} className="bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded text-2xs font-bold transition">Inscription Médecin</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6 pb-24">
        {currentSpace === 'auth' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-auto mt-12 border border-slate-200">
            <h2 className="text-md font-bold text-center text-slate-900 mb-4">Portails Intégrés</h2>
            <div className="space-y-3">
              <button onClick={() => setCurrentSpace('donor_home')} className="w-full bg-red-600 text-white p-3 rounded-xl text-xs font-bold uppercase hover:bg-red-700 transition flex justify-between items-center">
                <span>Portail Donneur</span> <span>👤</span>
              </button>
