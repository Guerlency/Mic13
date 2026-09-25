'use client';

import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');
  
  // --- GESTION DES CODES DE SESSIONS (12 HEURES) ---
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');

  // --- ÉTAT DU DONNEUR & QUESTIONNAIRE DÉROULANT V9 ---
  const [donor, setDonor] = useState({
    email: '', postalCode: '', phone: '', age: 0, weight: 0, height: 0, gender: 'F',
    donationType: 'STHO', eligibilityChecked: false, isGloballyEligible: true, rejectionReason: '',
    vst: 0, maxAllowedVolume: 0, generatedCode: '',
    residueConsent: null, donorSignature: '', doctorSignature: '',
    medicalConclusion: '', exclusionType: 'Temporaire'
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Formulaire officiel complet GEN-DOC-FO-01A V9
  const initialQuestionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous été transfusé(e) ?", type: 'date_place' },
    { id: 'Q2', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une greffe (dure-mère, cornée) ?", type: 'date_place' },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cerveau (ou de la moëlle épinière) ?", type: 'date_place' },
    { id: 'Q4', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cœur ?", type: 'date_place' },
    { id: 'Q5', section: 'SANTÉ', text: "Eu une maladie neurologique: épilepsie, AVC-AIT, sclérose en plaque, ou autre maladie grave ?", type: 'date_place' },
    { id: 'Q6', section: 'SANTÉ', text: "Eu un diabète traité par insuline ?", type: 'comment' },
    { id: 'Q7', section: 'SANTÉ', text: "Eu une maladie de Chagas, une malaria (accès de paludisme), une fièvre zika ?", type: 'date_place' },
    { id: 'Q8', section: 'SANTÉ', text: "Eu un cancer, une maladie du sang ou une tendance anormale au saignement ?", type: 'date_place' },
    { id: 'Q13', section: 'MÉDICAMENTS', text: "Pris du Proscar, du Combodart, ou de l'Avodart au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'M16', section: 'MÉDICAMENTS', text: "Pris du Roaccutane au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'Q18', section: 'MÉDICAMENTS', text: "Consommé de la drogue par voie nasale (snif) au cours des 12 derniers mois ?", type: 'comment' },
    { id: 'Q24', section: 'EXPOSITION', text: "Au cours des 4 derniers mois, avez-vous fait un tatouage, un piercing ou un maquillage permanent ?", type: 'date_place' },
    { id: 'Q30', section: 'EXPOSITION', text: "Êtes-vous allé chez le dentiste il y a moins d'une semaine ?", type: 'date_place' }
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

  // --- SAUVEGARDE ET GÉNÉRATION DU CODE ---
  const saveQuestionnaireAndGenerateCode = () => {
    const codeUnique = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + (12 * 60 * 60 * 1000);

    const sessionPayload = {
      donorInfo: { ...donor },
      responses: { ...answersV9 },
      historyLogs: [
        { action: "Soumission du questionnaire avec choix de consentement résidus", timestamp: new Date().toLocaleTimeString(), operator: "Donneur" }
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
      setCurrentQuestionIndex(currentQuestionIndex + 1); // Déclenche l'écran de consentement
    }
  };

  // --- CONSOLE MÉDECIN SÉCURISÉE ---
  const handleDoctorAccess = (e) => {
    e.preventDefault();
    const targetSession = activeSessions[currentMedicalCode];
    if (!targetSession) { alert("Code invalide ou expiré (12h)."); return; }
    setActiveDoctorSession(targetSession);
  };

  const updateQuestionByDoctor = (qId, field, value) => {
    const updatedSession = { ...activeDoctorSession };
    const prev = updatedSession.responses[qId][field];
    updatedSession.responses[qId][field] = value;
    updatedSession.historyLogs.push({
      action: `Correction Question ${qId} -> champ [${field}] (Ancien: "${prev}" -> Nouveau: "${value}")`,
      timestamp: new Date().toLocaleTimeString(),
      operator: doctorName
    });
    setActiveDoctorSession(updatedSession);
    setActiveSessions({ ...activeSessions, [currentMedicalCode]: updatedSession });
  };

  const finalizeConclusionByDoctor = (field, value) => {
    const updatedSession = { ...activeDoctorSession };
    updatedSession.donorInfo[field] = value;
    updatedSession.historyLogs.push({
      action: `Mise à jour Conclusion Médicale -> [${field}] fixé à "${value}"`,
      timestamp: new Date().toLocaleTimeString(),
      operator: doctorName
    });
    setActiveDoctorSession(updatedSession);
    setActiveSessions({ ...activeSessions, [currentMedicalCode]: updatedSession });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-red-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-sm font-bold">🩸 BloodPass ASBL — Formulaire Révisé GEN-DOC-FO-01A</h1>
        {currentSpace !== 'auth' && (
          <button onClick={() => { setCurrentSpace('auth'); setActiveDoctorSession(null); }} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs transition">
            Menu Principal
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto p-4 md:p-6">
        {currentSpace === 'auth' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-auto mt-16 border border-slate-200">
            <h2 className="text-md font-bold text-center text-slate-900 mb-4">Portails Réglementaires</h2>
            <div className="space-y-3">
              <button onClick={() => setCurrentSpace('donor')} className="w-full bg-red-600 text-white p-3 rounded-xl text-xs font-bold uppercase hover:bg-red-700 transition flex justify-between items-center">
                <span>Espace Candidat Donneur</span> <span>👤</span>
              </button>
              <button onClick={() => setCurrentSpace('doctor')} className="w-full bg-blue-700 text-white p-3 rounded-xl text-xs font-bold uppercase hover:bg-blue-800 transition flex justify-between items-center">
                <span>Espace Médecin Référent</span> <span>🩺</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= ESPACE DONNEUR ================= */}
        {currentSpace === 'donor' && (
          <div className="space-y-6">
            {!donor.eligibilityChecked ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-md font-bold text-slate-900 mb-4 uppercase tracking-wide">1. Constantes Biométriques Administratives</h2>
                <form onSubmit={handlePhysicalCheck} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required type="email" placeholder="Adresse Email" onChange={e => setDonor({...donor, email: e.target.value})} className="p-2.5 text-xs border rounded-lg" />
                    <input type="text" placeholder="Code Postal" onChange={e => setDonor({...donor, postalCode: e.target.value})} className="p-2.5 text-xs border rounded-lg" />
                    <input type="tel" placeholder="Téléphone" onChange={e => setDonor({...donor, phone: e.target.value})} className="p-2.5 text-xs border rounded-lg" />
                    <select onChange={e => setDonor({...donor, donationType: e.target.value})} className="p-2.5 text-xs border rounded-lg bg-white">
                      <option value="STHO">Sang Total</option>
                      <option value="PLASMA">Plasma (Aphérèse)</option>
                    </select>
                  </div>
