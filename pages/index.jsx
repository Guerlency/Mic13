'use client';
import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [space, setSpace] = useState('auth');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [answersV9, setAnswersV9] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [signatureName, setSignatureName] = useState('');

  const [doctors, setDoctors] = useState([
    { email: 'chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }
  ]);
  const [newDoc, setNewDoc] = useState({ name: '', email: '', inami: '' });
  const [donor] = useState({
    email: 'guerlency.mic13@charleroi.be', bloodGroup: 'O+', count: 5,
    badges: ['🥇 Premier Don', '🩸 Sauveur régulier']
  });

  // Questionnaire officiel abrégé V9 de l'ETS de Charleroi
  const questionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous déjà été transfusé(e) ou reçu une greffe ?" },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous subi une opération lourde du cœur, du cerveau ou de la moëlle épinière ?" },
    { id: 'Q6', section: 'MÉDICAMENTS', text: "Prenez-vous un traitement pour un diabète insulinodépendant (Insuline) ?" },
    { id: 'Q20', section: 'VACCINS', text: "Avez-vous reçu un vaccin ou un rappel de vaccination au cours des 30 derniers jours ?" },
    { id: 'Q36', section: 'VOYAGES', text: "Au cours des 6 derniers mois, avez-vous voyagé ou séjourné en dehors de la Belgique ?" }
  ];

  const handleNextQuestion = () => {
    if (!selectedResponse) return;
    
    setAnswersV9({
      ...answersV9,
      [questionsV9[currentQuestionIndex].id]: {
        value: selectedResponse,
        comment: commentText
      }
    });

    setSelectedResponse(null);
    setCommentText('');

    if (currentQuestionIndex < questionsV9.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questionsV9.length); // Passe à l'écran de signature
    }
  };

  const handleFinalizeTest = () => {
    if (!signatureName.trim()) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '16px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      
      {/* HEADER MINIMALISTE ET ÉPURÉ */}
      <header style={{ maxWidth: '480px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🩸</span>
          <h1 style={{ fontSize: '16px', fontWeight: '700', margin: 0, letterSpacing: '-0.3px', color: '#1e293b' }}>BloodPass <span style={{ color: '#dc2626', fontWeight: '800' }}>V9</span></h1>
        </div>
        {space !== 'auth' && (
          <button onClick={() => { setSpace('auth'); setGeneratedCode(''); setCurrentQuestionIndex(0); }} style={{ padding: '6px 14px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s' }}>Quitter</button>
        )}
      </header>

      {/* 1. ÉCRAN D'ACCUEIL PORTAILS (DESIGN APPLE/SHADCN) */}
      {space === 'auth' && (
        <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.6px', marginBottom: '8px', color: '#0f172a' }}>Espaces de Connexion</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px' }}>Sélectionnez votre portail applicatif pour l'ETS Charleroi.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setSpace('donor_home')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', backgroundColor: '#fee2e2', padding: '8px', borderRadius: '14px' }}>👤</span>
                <div>
                  <p style={{ margin: 0 }}>Portail Personnel Donneur</p>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Consulter mes badges & faire le test</span>
                </div>
              </div>
              <span style={{ color: '#cbd5e1', fontSize: '18px' }}>➔</span>
            </button>

            <button onClick={() => setSpace('register')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', backgroundColor: '#dbeafe', padding: '8px', borderRadius: '14px' }}>🩺</span>
                <div>
                  <p style={{ margin: 0 }}>Inscription Praticien</p>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Enregistrer un nouveau médecin médecin</span>
                </div>
              </div>
              <span style={{ color: '#cbd5e1', fontSize: '18px' }}>➔</span>
            </button>

            <button onClick={() => setSpace('admin')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', backgroundColor: '#f1f5f9', padding: '8px', borderRadius: '14px' }}>⚙️</span>
                <div>
                  <p style={{ margin: 0 }}>Espace Admin Référent</p>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Contrôle et validation INAMI 1-clic</span>
                </div>
              </div>
              <span style={{ color: '#cbd5e1', fontSize: '18px' }}>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ESPACE PERSONNEL DONNEUR */}
      {space === 'donor_home' && (
        <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Carte de donneur technologique moderne */}
          <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '24px', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(15,23,42,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Carte Digitale Transfusionnelle</p>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.4px' }}>{donor.email}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>{donor.count} prélèvements validés</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '10px 16px', borderRadius: '16px', fontSize: '22px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.1)' }}>
                {donor.bloodGroup}
              </div>
            </div>
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6 }}>Mérites & Fidélité</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                {donor.badges.map((b, i) => <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.08)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>{b}</span>)}
              </div>
            </div>
          </div>

          {/* Statut temporel et bouton de lancement du TEST */}
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '14px', color: '#475569' }}>Délai réglementaire de 62 jours</p>
              <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>Conforme</span>
            </div>
