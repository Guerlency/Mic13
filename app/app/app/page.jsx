'use client';

import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');
  
  // --- GESTION DES CODES DE SESSIONS (12 HEURES) ---
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');

  // --- ÉTAT DU DONNEUR, HISTORIQUE ET QUESTIONNAIRE ---
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
    pastDonations: [
      { id: 'DON-901', date: '14/05/2026', type: 'Sang Total', location: 'Maison du Don - Loverval', status: 'Validé' },
      { id: 'DON-742', date: '10/01/2026', type: 'Sang Total', location: 'Centre Hospitalier de Charleroi', status: 'Validé' }
    ]
  });

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

  const handleDoctorAccess = (e) => {
    e.preventDefault();
    const targetSession = activeSessions[currentMedicalCode];
    if (!targetSession) { alert("Code invalide ou expiré (12h)."); return; }
    setActiveDoctorSession(targetSession);
  };

  const updateQuestionByDoctor = (qId, field, value) => {
    const updatedSession = { ...activeDoctorSession };
    updatedSession.responses[qId][field] = value;
    setActiveDoctorSession(updatedSession);
  };

  const finalizeConclusionByDoctor = (field, value) => {
    const updatedSession = { ...activeDoctorSession };
    updatedSession.donorInfo[field] = value;
    setActiveDoctorSession(updatedSession);
  };

  const clinicalAlerts = useMemo(() => {
    if (!activeDoctorSession) return [];
    const alerts = [];
    if (activeDoctorSession.responses['Q36']?.value === 'OUI') {
      alerts.push({ type: 'ORANGE', msg: `Alerte Épidémiologique : Séjour à l'étranger déclaré (${activeDoctorSession.responses['Q36']?.place || "non spécifié"}).` });
    }
    if (activeDoctorSession.responses['Q20']?.value === 'OUI') {
      alerts.push({ type: 'ORANGE', msg: "Alerte Vaccination : Antécédent de vaccin récent (Délai à vérifier)." });
    }
    if (activeDoctorSession.responses['Q6']?.value === 'OUI') {
      alerts.push({ type: 'RED', msg: "CRITÈRE D'EXCLUSION ABSOLUE : Diabète traité par insuline." });
    }
    return alerts;
  }, [activeDoctorSession]);

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-red-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider">🩸 BloodPass — Charleroi</h1>
        {currentSpace !== 'auth' && (
          <button onClick={() => { setCurrentSpace('auth'); setActiveDoctorSession(null); }} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs transition">
            Déconnexion
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6">
        {currentSpace === 'auth' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-auto mt-16 border border-slate-200">
            <h2 className="text-md font-bold text-center text-slate-900 mb-4">Accès Portails BloodPass</h2>
            <div className="space-y-3">
              <button onClick={() => setCurrentSpace('donor_home')} className="w-full bg-red-600 text-white p-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex justify-between items-center">
                <span>Espace Personnel Donneur</span> <span>👤</span>
              </button>
              <button onClick={() => setCurrentSpace('doctor')} className="w-full bg-blue-700 text-white p-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition flex justify-between items-center">
                <span>Espace Médecin Référent</span> <span>🩺</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= PORTAIL ACCUEIL DONNEUR (VALEUR CORRIGÉE À 62 JOURS) ================= */}
        {currentSpace === 'donor_home' && (
          <div className="space-y-5">
            <div className="bg-gradient-to-r from-red-700 to-rose-600 text-white p-5 rounded-2xl shadow-md flex justify-between items-center">
              <div>
                <p className="text-3xs uppercase tracking-widest text-red-200 font-bold">Carte de Donneur Virtuelle</p>
                <h2 className="text-md font-bold mt-1">{donor.email}</h2>
                <div className="flex gap-4 mt-3 text-3xs text-red-100 font-medium">
                  <p>CP : <strong className="text-white">{donor.postalCode}</strong></p>
                  <p>ID : <strong className="text-white">#BP-62802</strong></p>
                </div>
              </div>
              <div className="bg-white text-red-700 font-mono text-xl font-bold w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                {donor.bloodGroup}
              </div>
            </div>

