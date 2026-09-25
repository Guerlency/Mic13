'use client';

import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');

  // --- BASE GÉOGRAPHIQUE HÉRITÉE (MED-SEM-LI-02A) ---
  const countries = [
    { name: "AFGHANISTAN", stho: "4 mois", plas: "28 jours", plqt: "6 mois", risk: "Paludisme" },
    { name: "AFRIQUE DU SUD", stho: "4 mois", plas: "28 jours", plqt: "6 mois", risk: "Paludisme" },
    { name: "ANGOLA", stho: "4 mois", plas: "28 jours", plqt: "6 mois", risk: "Paludisme, Zika" },
    { name: "ARGENTINE (Plein air / précaire)", stho: "6 mois", plas: "6 mois", plqt: "6 mois", risk: "Chagas, Zika" },
    { name: "ARGENTINE (Hôtel / Standard)", stho: "28 jours", plas: "28 jours", plqt: "28 jours", risk: "Zika" },
    { name: "BELGIQUE", stho: "Ok", plas: "Ok", plqt: "Ok", risk: "Aucun" },
    { name: "BRESIL (Plein air / précaire)", stho: "6 mois", plas: "6 mois", plqt: "6 mois", risk: "Chagas, Paludisme, Zika" },
    { name: "FRANCE", stho: "Ok", plas: "Ok", plqt: "Ok", risk: "Aucun" },
  ];

  // --- ÉTAT DU DONNEUR ---
  const [donor, setDonor] = useState({
    email: '', postalCode: '', phone: '', age: 0, weight: 0, height: 0, gender: 'F',
    donationType: 'STHO',
    eligibilityChecked: false, isGloballyEligible: true, rejectionReason: '',
    vst: 0, maxAllowedVolume: 0,
    questionnaireAnswers: {},
    medicationAnswers: {},
    vaccineAnswers: {},
    questionnaireSubmitted: false
  });

  // --- SCRIPT D'ENTRETIEN RÉGLEMENTAIRE (Dossier Charleroi 1) ---
  const [questions, setQuestions] = useState({
    'Q1': "Au cours de votre vie, avez-vous déjà été transfusé ou reçu une greffe ?",
    'Q3': "Avez-vous subi une opération lourde du cœur, du cerveau ou de la moelle épinière ?",
    'Q18': "Au cours des 12 derniers mois, avez-vous consommé de la drogue par le nez (snif) ?",
    'Q24': "Au cours des 4 derniers mois, avez-vous fait un tatouage, un piercing ou du maquillage permanent ?",
    'Q28': "Avez-vous perdu plus de 5 kg sans raison récemment ?",
    'Q29': "Au cours des 2 dernières semaines, avez-vous eu la grippe ?",
    'Q30': "Ces 7 derniers jours, êtes-vous allé chez le dentiste (détartrage, extraction) ?",
    'Q32': "Ce mois-ci, avez-vous été mordu par une tique ?"
  });

  // --- LISTE DES MÉDICAMENTS (MED-SEM-LI-01G) ---
  const medicationsList = [
    { id: 'M1', name: "Chimiothérapie anti-cancéreuse", delay: "Définitive (À vie)" },
    { id: 'M2', name: "Insuline (pour Diabète insulinodépendant)", delay: "Définitive (À vie)" },
    { id: 'M3', name: "Acitrétine (Neotigason) / Étrétinate (Tegison)", delay: "3 ans" },
    { id: 'M4', name: "Léflunomide (Arava) / Tériflunomide (Aubagio)", delay: "2 ans" },
    { id: 'M5', name: "Dutastéride (Avodart, Combodart)", delay: "6 mois" },
    { id: 'M6', name: "Méthotrexate / Immunosuppresseurs (Imuran, CellCept...)", delay: "6 mois" },
    { id: 'M7', name: "Isotrétinoïne (Roaccutane) / Finastéride (Proscar)", delay: "1 mois (30 jours)" },
    { id: 'M8', name: "Anticoagulants oraux (Xarelto, Eliquis, Pradaxa)", delay: "1 mois (30 jours)" },
    { id: 'M9', name: "Cortisone (comprimés ou injection)", delay: "2 semaines (14 jours)" },
    { id: 'M10', name: "Antibiotiques (pour infection active)", delay: "7 jours" }
  ];

  // --- GRILLE DES VACCINATIONS RÉCENTES (Chapitre 4 Vaccination) ---
  const vaccinesList = [
    { id: 'V1', name: "Vaccin vivant atténué (Fièvre jaune, RRO, Varicelle, Dengue)", delay: "4 semaines / 1 mois" },
    { id: 'V2', name: "Vaccin obtenu par génie génétique (Hépatite B, Hépatite A+B)", delay: "1 mois" },
    { id: 'V3', name: "Vaccin bactérien (Tétanos, Diphatérie, Coqueluche, Pneumocoque)", delay: "48 heures" },
    { id: 'V4', name: "Vaccin COVID-19 (Avec symptômes immédiats post-vaccinaux)", delay: "7 jours" }
  ];

  // --- ÉTAT MÉDECIN (MANUELS INTERNES) ---
  const medicalManualDocs = useMemo(() => [
    { id: "MAN-01", title: "Sélection Médicale des Donneurs — Cadre Belge", content: "ETS La Transfusion du Sang de Charleroi (MED-SEM-SO-010). Basé sur la loi du 05/07/1994. Le poids minimum légal est de 50 kg. Une femme de 50 kg doit mesurer au moins 1m53. L'exclusion doit être définitive si la pathologie est grave ou active." },
    { id: "MAN-02", title: "Pharmacotoxicité et Contre-indications Spécifiques", content: "L'anamnèse médicamenteuse protège le receveur des risques tératogènes et d'embryotoxicité. Exclusions à vie : Insuline, chimiothérapie. Exclusions temporaires majeures : Rétinoïdes (Neotigason 3 ans), Arava (2 ans), Roaccutane (1 mois), Proscar (1 mois)." },
    { id: "MAN-03", title: "Risques Épidémiologiques Mondiaux (Voyages)", content: "Maladie de Chagas : Amérique Latine continentale. Écartement de 6 mois si séjour en plein air (camping, belle étoile) ou habitation précaire (briques d'adobe). Paludisme/Malaria : Écartement de 4 mois pour le sang total homologue (STHO) et 6 mois pour les plaquettes." }
  ], []);

  const [medicalSearch, setMedicalSearch] = useState('');

  // --- LOGIQUE MORPHOLOGIQUE (LOI & FORMULE DE NADLER) ---
  const handlePhysicalCheck = (e) => {
    e.preventDefault();
    let eligible = true;
    let reason = "";

    if (donor.age < 18 || donor.age >= 66) {
      eligible = false;
      reason = "L'âge légal doit être compris entre 18 ans et la veille du 66ème anniversaire pour un don homologue.";
    } else if (donor.weight < 50) {
      eligible = false;
      reason = "Le poids minimum légal absolu exigé est de 50 kg.";
    }

    if (eligible && donor.donationType === 'STHO' && donor.gender === 'F' && donor.weight === 50 && donor.height < 153) {
      eligible = false;
      reason = "Abaque Femme (Sang Total) : à 50 kg, la taille minimale requise est de 1m53 pour préserver le volume hémodynamique.";
    }

    if (eligible && donor.donationType === 'PLASMA' && donor.gender === 'F' && donor.weight < 55) {
      eligible = false;
      reason = "Don de Plasma : Un poids minimal de 55 kg est impérativement requis chez la femme lors du premier prélèvement aphérèse.";
    }

    const heightInInches = donor.height * 0.3937;
    const weightInPounds = donor.weight * 2.2046;
    const calculatedVst = (0.006012 * Math.pow(heightInInches, 3)) + (14.6 * weightInPounds) + 604;
    
    const percentage = donor.donationType === 'PLASMA' ? 0.18 : 0.13;
    const maxVolume = calculatedVst * percentage;

    setDonor({
      ...donor,
      eligibilityChecked: true,
      isGloballyEligible: eligible,
      rejectionReason: reason,
      vst: Math.round(calculatedVst),
      maxAllowedVolume: Math.round(maxVolume)
    });
  };

  // --- ANALYSEUR TRI-COLORÉ DU NIVEAU DE RISQUE CLINIQUE ---
  const alertStatus = useMemo(() => {
    const hasCriticalQuestion = ['Q1', 'Q3'].some(q => donor.questionnaireAnswers[q] === 'OUI');
    const hasMedicationExclusion = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'].some(m => donor.medicationAnswers[m] === 'OUI');
    
    if (!donor.isGloballyEligible || hasCriticalQuestion || hasMedicationExclusion) {
      return { level: 'RED', label: "Écartement Majeur Requis" };
    }
    
    const hasMinorWarning = ['Q18', 'Q24', 'Q28', 'Q29', 'Q30', 'Q32'].some(q => donor.questionnaireAnswers[q] === 'OUI') || 
                           ['M7', 'M8', 'M9', 'M10'].some(m => donor.medicationAnswers[m] === 'OUI') ||
                           ['V1', 'V2', 'V3', 'V4'].some(v => donor.vaccineAnswers[m] === 'OUI');
    if (hasMinorWarning) {
      return { level: 'ORANGE', label: "Alerte Vigilance (Écartement temporaire)" };
    }
    
    return { level: 'GREEN', label: "Dossier Conforme" };
  }, [donor]);

  const highlightMedicalText = (text, search) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) => 
          regex.test(part) ? <mark key={i} className="bg-yellow-300 text-black font-bold px-0.5 rounded">{part}</mark> : part
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-red-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wider flex items-center gap-2">🩸 BloodPass — Charleroi</h1>
        {currentSpace !== 'auth' && (
          <button onClick={() => setCurrentSpace('auth')} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold transition">
            Menu Principal
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
        {currentSpace === 'auth' && (
          <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md mx-auto mt-16 border border-slate-100">
            <h2 className="text-xl font-bold text-center text-slate-900 mb-2">Accès aux Espaces BloodPass</h2>
            <p className="text-xs text-slate-400 text-center mb-6">Application connectée et synchronisée sur Vercel.</p>
            <div className="space-y-3">
              <button onClick={() => setCurrentSpace('donor')} className="w-full bg-red-600 text-white p-3 rounded-xl font-medium hover:bg-red-700 transition flex justify-between items-center">
                <span>Espace Candidat Donneur</span> <span>👤</span>
              </button>
              <button onClick={() => setCurrentSpace('doctor')} className="w-full bg-blue-700 text-white p-3 rounded-xl font-medium hover:bg-blue-800 transition flex justify-between items-center">
                <span>Espace Médecin Référent</span> <span>🩺</span>
              </button>
              <button onClick={() => setCurrentSpace('admin')} className="w-full bg-slate-800 text-white p-3 rounded-xl font-medium hover:bg-slate-900 transition flex justify-between items-center">
                <span>Espace Gestion Administrative</span> <span>⚙️</span>
