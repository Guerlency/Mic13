'use client';
import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  // --- SYSTÈME DE NAVIGATION ---
  const [space, setSpace] = useState('auth'); // auth, donor, doctor, admin, community
  
  // --- ÉTATS COMPTE ET SESSIONS DONNEURS ---
  const [donorProfile, setDonorProfile] = useState({
    lastName: 'Guerlency', firstName: 'Mic13', birthDate: '2002-05-14', postalCode: '6000', phone: '0470123456', bloodGroup: 'O+', pastDonations: 5
  });
  
  // --- MODULE 1 : TEST RAPIDE D'ÉLIGIBILITÉ INITIAL ---
  const [quickTestAnswers, setQuickTestAnswers] = useState({ age: 24, weight: 68, ironDeficient: 'NON' });
  const [quickTestResult, setQuickTestResult] = useState(null);

  // --- MODULE 2 : VRAI QUESTIONNAIRE PRÉ-DON INTERACTIF (PAS-À-PAS) ---
  const [qIdx, setQIdx] = useState(0);
  const [currentAns, setCurrentAns] = useState(null);
  const [currentComment, setCurrentComment] = useState('');
  const [questionnaireResponses, setQuestionnaireAnswers] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [signature, setSignature] = useState('');

  // Base réglementaire officielle V9 de l'ETS de Charleroi
  const questionsETS = [
    { id: 'Q1', text: "Au cours de votre vie, avez-vous déjà été transfusé(e) ou reçu une greffe ?" },
    { id: 'Q2', text: "Au cours de votre vie, avez-vous eu une intervention chirurgicale lourde (cerveau, cœur) ?" },
    { id: 'Q3', text: "Suivez-vous un traitement médical quotidien pour un diabète insulinodépendant ?" },
    { id: 'Q4', text: "Avez-vous séjourné ou voyagé en dehors de la Belgique au cours des 6 derniers mois ?" }
  ];

  // --- MODULE 3 : INTERFACE MÉDECIN & MOTEUR DE RECHERCHE PAR MOT-CLÉ ---
  const [activeSessions, setActiveSessions] = useState({}); // Stockage des jetons de 12h
  const [searchCode, setSearchCode] = useState('');
  const [loadedSession, setLoadedSession] = useState(null);
  const [docKeyword, setDocKeyword] = useState('');
  
  const documentsETS = [
    { title: "GEN-DOC-FO-01A : Protocole d'Hémovigilance ETS Charleroi", text: "Le médecin de collecte effectue une anamnèse transfusionnelle obligatoire. En cas de suspicion de paludisme ou d'antécédent de voyage hors Belgique, un écartement temporaire de sécurité doit être immédiatement encodé dans le registre informatique." },
    { title: "REG-MED-V9 : Guide d'Éligibilité Clinique au Sang Total", text: "Le prélèvement de sang total nécessite un poids minimal de 50 kg et un taux d'hémoglobine conforme. Les patients sous insuline ou ayant des antécédents de greffe sont exclus définitivement pour protéger le donneur et le receveur." }
  ];

  // --- MODULE 4 : CONSOLE ADMINISTRATEUR & COMMUNAUTÉ ---
  const [adminMessages, setAdminMessages] = useState([
    { id: 1, target: '6000', text: "Urgence O+ : Les stocks à la Maison du Don de Loverval sont critiques.", date: '26/09/2026' }
  ]);
  const [newAdminMsg, setNewAdminMsg] = useState('');
  const [targetPostal, setTargetPostal] = useState('6000');

  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, author: "Guerlency M.", text: "Fier d'avoir validé mon 5ème don aujourd'hui à Loverval ! Équipe médicale super douce. 🩸", likes: 14 }
  ]);
  const [newPostText, setNewPostText] = useState('');

  // --- LOGIQUES APPLICATIVES ---
  const runQuickEligibility = (e) => {
    e.preventDefault();
    if (quickTestAnswers.weight < 50) {
      setQuickTestResult({ eligible: false, reason: "Écartement Médical Légis : Le poids minimum requis en Belgique pour un prélèvement de sang total est de 50 kg pour garantir votre volume sanguin circulant." });
    } else if (quickTestAnswers.ironDeficient === 'OUI') {
      setQuickTestResult({ eligible: false, reason: "Écartement Temporaire : Une carence en fer non régularisée empêche la régénération rapide de votre taux d'hémoglobine après le prélèvement." });
    } else {
      setQuickTestResult({ eligible: true, reason: "Félicitations ! Vos critères morphologiques de base sont validés. Vous êtes autorisé à compléter le questionnaire pré-don officiel." });
    }
  };

  const handleNextQuestion = () => {
    if (!currentAns) return;
    setQuestionnaireAnswers({ ...questionnaireResponses, [questionsETS[qIdx].id]: { value: currentAns, comment: currentComment } });
    setCurrentAns(null); setCommentText('');
    if (qIdx < questionsETS.length - 1) { setQIdx(qIdx + 1); } 
    else { setQIdx(questionsETS.length); }
  };

  const handleFinalizeQuestionnaire = () => {
    if (!signature.trim()) return;
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionPayload = {
      profile: { ...donorProfile },
      answers: { ...questionnaireResponses },
      signature: signature,
      timestamp: new Date().toLocaleTimeString(),
      doctorLogs: []
    };
    setActiveSessions({ ...activeSessions, [token]: sessionPayload });
    setGeneratedCode(token);
  };

  const loadDonorSession = (e) => {
    e.preventDefault();
    const found = activeSessions[searchCode];
    if (!found) { alert("Code introuvable ou expiré (Validité stricte de 12 heures)."); return; }
    setLoadedSession(found);
  };

  const handleDoctorCorrection = (qId, field, value) => {
    if (!loadedSession) return;
    const updated = { ...loadedSession };
    updated.answers[qId][field] = value;
    updated.doctorLogs.push(`Correction médicale [${qId}] - ${field} changé en "${value}" par le médecin le ${new Date().toLocaleTimeString()}`);
    setLoadedSession(updated);
    setActiveSessions({ ...activeSessions, [searchCode]: updated });
  };

  const filteredDocs = useMemo(() => {
    if (!docKeyword.trim()) return [];
    return documentsETS.filter(doc => doc.text.toLowerCase().includes(docKeyword.toLowerCase()) || doc.title.toLowerCase().includes(docKeyword.toLowerCase()));
  }, [docKeyword]);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh', color: '#111111', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* HEADER ULTRA-MINIMALISTE STYLE APPLE */}
      <header style={{ width: '100%', maxWidth: '440px', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', border: '1px solid #eeeeee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', marginBottom: '24px', boxShadow: '0 1px 2px rgba(0,0,0,0.01)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setSpace('auth')}>
          <span style={{ fontSize: '18px' }}>🩸</span>
          <span style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.4px' }}>BloodPass</span>
        </div>
        {space !== 'auth' && (
          <button onClick={() => { setSpace('auth'); setGeneratedCode(''); setQIdx(0); setQuickTestResult(null); setLoadedSession(null); }} style={{ padding: '6px 14px', backgroundColor: '#f5f5f7', color: '#555555', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Menu</button>
        )}
      </header>

      {/* --- 1. PORTAIL DE SELECTION DES ESPACES --- */}
      {space === 'auth' && (
        <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeIn 0.2s ease' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.6px', marginBottom: '6px', textAlign: 'center' }}>Hémovigilance de Charleroi</h2>
          <p style={{ fontSize: '13px', color: '#666666', marginBottom: '32px', textAlign: 'center' }}>Sélectionnez votre espace applicatif réglementaire.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setSpace('donor')} style={{ width: '100%', backgroundColor: '#ffffff', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#fff5f5', padding: '8px', borderRadius: '12px' }}>👤</span>
                <div><p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Espace Candidat Donneur</p><span style={{ fontSize: '12px', color: '#666666' }}>Test d'éligibilité et questionnaire pas-à-pas</span></div>
              </div>
              <span style={{ color: '#aaaaaa' }}>➔</span>
            </button>

            <button onClick={() => setSpace('doctor')} style={{ width: '100%', backgroundColor: '#ffffff', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#f0f7ff', padding: '8px', borderRadius: '12px' }}>🩺</span>
                <div><p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Médecin de Collecte</p><span style={{ fontSize: '12px', color: '#666666' }}>Moteur de recherche de documents & rectification</span></div>
              </div>
              <span style={{ color: '#aaaaaa' }}>➔</span>
            </button>

            <button onClick={() => setSpace('admin')} style={{ width: '100%', backgroundColor: '#ffffff', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
