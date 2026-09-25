'use client';

import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');
  
  // --- BASE DE DONNÉES ET GESTION DES CODES PAR SESSIONS (12 HEURES) ---
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');

  // --- ÉTAT DU DONNEUR & QUESTIONNAIRE DÉROULANT V9 ---
  const [donor, setDonor] = useState({
    email: '', postalCode: '', phone: '', age: 0, weight: 0, height: 0, gender: 'F',
    donationType: 'STHO', eligibilityChecked: false, isGloballyEligible: true, rejectionReason: '',
    vst: 0, maxAllowedVolume: 0, generatedCode: ''
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Énoncé structurel intégral de la Partie 1 du formulaire officiel GEN-DOC-FO-01A
  const initialQuestionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous été transfusé(e) ?", type: 'date_place' },
    { id: 'Q2', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une greffe (dure-mère, cornée) ?", type: 'date_place' },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cerveau (ou de la moëlle épinière) ?", type: 'date_place' },
    { id: 'Q4', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cœur ?", type: 'date_place' },
    { id: 'Q5', section: 'SANTÉ', text: "Eu une maladie neurologique: épilepsie, AVC-AIT, sclérose en plaque, ou autre maladie grave ?", type: 'date_place' },
    { id: 'Q6', section: 'SANTÉ', text: "Eu un diabète traité par insuline ?", type: 'comment' },
    { id: 'Q7', section: 'SANTÉ', text: "Eu une maladie de Chagas, une malaria (accès de paludisme), une fièvre zika ?", type: 'date_place' },
    { id: 'Q8', section: 'SANTÉ', text: "Eu un cancer, une maladie du sang ou une tendance anormale au saignement ?", type: 'date_place' },
    { id: 'Q9', section: 'SANTÉ', text: "Eu une hémochromatose ou en êtes-vous porteur(se) ?", type: 'comment' },
    { id: 'Q10', section: 'SANTÉ', text: "Eu une maladie grave ou chronique: cardiaque, pulmonaire, rénale, digestive, RAA, sarcoïdose, tuberculose... ?", type: 'comment' },
    { id: 'Q13', section: 'MÉDICAMENTS', text: "Pris du Proscar (finastéride), du Combodart, ou de l'Avodart (dutastéride) au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'M16', section: 'MÉDICAMENTS', text: "Pris du Roaccutane au cours des 30 derniers jours ?", type: 'comment' },
    { id: 'Q18', section: 'MÉDICAMENTS', text: "Consommé de la drogue par voie nasale (snif) au cours des 12 derniers mois ?", type: 'comment' },
    { id: 'Q22', section: 'EXPOSITION', text: "Au cours des 4 derniers mois, avez-vous été hospitalisé(e) et/ou opéré(e) ?", type: 'date_place' },
    { id: 'Q24', section: 'EXPOSITION', text: "Au cours des 4 derniers mois, avez-vous fait un tatouage, un dé-tatouage, un maquillage permanent ou un piercing ?", type: 'date_place' },
    { id: 'Q30', section: 'EXPOSITION', text: "Êtes-vous allé chez le dentiste il y a moins d'une semaine ?", type: 'date_place' },
    { id: 'Q32', section: 'EXPOSITION', text: "Au cours des dernières semaines, avez-vous été mordu(e) par une tique ?", type: 'date_place' }
  ];

  // Variables dynamiques de saisies du donneur pour chaque question
  const [answersV9, setAnswersV9] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentPlace, setCurrentPlace] = useState('');
  const [currentComment, setCurrentComment] = useState('');

  // --- LOGIQUE MORPHOLOGIQUE (LOI & ENVELOPPE DE NADLER) ---
  const handlePhysicalCheck = (e) => {
    e.preventDefault();
    let eligible = true;
    let reason = "";

    if (donor.age < 18 || donor.age >= 66) {
      eligible = false;
      reason = "L'âge légal d'admissibilité à l'ETS doit être compris entre 18 ans et la veille du 66ème anniversaire.";
    } else if (donor.weight < 50) {
      eligible = false;
      reason = "Le poids minimum légal exigé pour l'extraction de PSL est de 50 kg.";
    }

    if (eligible && donor.donationType === 'PLASMA' && donor.gender === 'F' && donor.weight < 55) {
      eligible = false;
      reason = "Un poids minimal de 55 kg est requis chez la femme lors du premier prélèvement de plasma de 765 ml.";
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

  // --- SOUVEGARDE ET GÉNÉRATION DU CODE DE 12 HEURES ---
  const saveQuestionnaireAndGenerateCode = () => {
    // Génération d'un identifiant numérique unique à 6 chiffres
    const codeUnique = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + (12 * 60 * 60 * 1000); // Horodatage UNIX à +12 heures

    const sessionPayload = {
      donorInfo: { ...donor },
      responses: { ...answersV9 },
      historyLogs: [
        { action: "Soumission initiale par le donneur", timestamp: new Date().toLocaleTimeString(), operator: "Donneur" }
      ],
      expiresAt: expirationTime
    };

    setActiveSessions({ ...activeSessions, [codeUnique]: sessionPayload });
    setDonor({ ...donor, generatedCode: codeUnique });
  };

  // --- CARROUSEL : ENREGISTRER L'ÉTAPE ET PASSER À LA SUIVANTE ---
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

    // Réinitialisation des champs temporaires
    setCurrentResponse('');
    setCurrentDate('');
    setCurrentPlace('');
    setCurrentComment('');

    if (currentQuestionIndex < initialQuestionsV9.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      saveQuestionnaireAndGenerateCode();
    }
  };

  // --- ACCÈS SÉCURISÉ CÔTÉ MÉDECIN ---
  const handleDoctorAccess = (e) => {
    e.preventDefault();
    const targetSession = activeSessions[currentMedicalCode];

    if (!targetSession) {
      alert("Code invalide ou expiré (Validité de 12 heures maximale).");
      return;
    }
    if (Date.now() > targetSession.expiresAt) {
      alert("Ce code d'accès de 12 heures a expiré.");
      return;
    }

    setActiveDoctorSession(targetSession);
  };

  // --- MODIFICATION MÉDECIN AVEC TRAÇABILITÉ ———
  const updateQuestionByDoctor = (qId, field, value) => {
    const updatedSession = { ...activeDoctorSession };
    const previousValue = updatedSession.responses[qId][field];
    
    updatedSession.responses[qId][field] = value;
    updatedSession.historyLogs.push({
      action: `Modification du champ [${field}] pour la question ${qId} (Ancien: "${previousValue}" -> Nouveau: "${value}")`,
      timestamp: new Date().toLocaleTimeString(),
      operator: doctorName
    });

    setActiveDoctorSession(updatedSession);
    setActiveSessions({ ...activeSessions, [currentMedicalCode]: updatedSession });
  };

  // --- SIMULATION DU COMPILATEUR PDF IMPRIMABLE CÔTÉ CLIENT ---
  const generatePrintablePDF = () => {
    alert(`Génération du PDF d'interruption Transfusionnelle (ID: GEN-DOC-FO-01A V9) effectuée avec succès.\nOpérateur : ${doctorName}\nLe fichier est prêt pour l'impression.`);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-red-800 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-md font-bold tracking-wider">🩸 BloodPass ASBL — Système de Facilitation Clinique V9</h1>
        {currentSpace !== 'auth' && (
          <button onClick={() => { setCurrentSpace('auth'); setActiveDoctorSession(null); }} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg text-xs transition">
            Espaces Principaux
          </button>
        )}
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-6">
        
        {/* ================= GESTION DES ONGLETS DE SESSIONS ================= */}
        {currentSpace === 'auth' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-auto mt-16 border border-slate-200">
            <h2 className="text-lg font-bold text-center text-slate-900 mb-4">Portails Réglementaires</h2>
            <div className="space-y-3">
              <button onClick={() => setCurrentSpace('donor')} className="w-full bg-red-600 text-white p-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition flex justify-between items-center">
                <span>Espace Donneur (Questionnaire)</span> <span>👤</span>
              </button>
              <button onClick={() => setCurrentSpace('doctor')} className="w-full bg-blue-700 text-white p-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition flex justify-between items-center">
                <span>Espace Médecin (Consultation)</span> <span>BC</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= ESPACE DONNEUR (DÉFILÉ DU QUESTIONNAIRE) ================= */}
        {currentSpace === 'donor' && (
          <div className="space-y-6">
            {!donor.eligibilityChecked ? (
