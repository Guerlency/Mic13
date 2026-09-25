 'use client';
import React, { useState } from 'react';

export default function BloodPassApp() {
  const [space, setSpace] = useState('auth');
  
  // --- ÉTATS DU QUESTIONNAIRE INTERACTIF ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [answersV9, setAnswersV9] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [signatureName, setSignatureName] = useState('');

  // --- ÉTATS MÉDECINS ET ADMIN ---
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');
  const [doctors, setDoctors] = useState([
    { email: 'chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }
  ]);
  const [newDoc, setNewDoc] = useState({ name: '', email: '', inami: '' });
  const [donor] = useState({
    email: 'guerlency.mic13@charleroi.be', bloodGroup: 'O+', count: 5,
    badges: ['🥇 Premier Don', '🩸 Sauveur régulier']
  });

  // Questionnaire officiel V9 révisé de l'ETS de Charleroi
  const questionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous déjà été transfusé(e) ou reçu une greffe ?" },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous subi une opération lourde du cœur, du cerveau ou de la moëlle épinière ?" },
    { id: 'Q6', section: 'MÉDICAMENTS', text: "Prenez-vous un traitement pour un diabète insulinodépendant (Insuline) ?" },
    { id: 'Q20', section: 'VACCINS', text: "Avez-vous reçu un vaccin ou un rappel de vaccination au cours des 30 derniers jours ?" },
    { id: 'Q36', section: 'VOYAGES', text: "Au cours des 6 derniers mois, avez-vous voyagé ou séjourné en dehors de la Belgique ?" }
  ];

  const handleNextQuestion = () => {
    if (!selectedResponse) return;
    setAnswersV9({ ...answersV9, [questionsV9[currentQuestionIndex].id]: { value: selectedResponse, comment: commentText } });
    setSelectedResponse(null);
    setCommentText('');
    if (currentQuestionIndex < questionsV9.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentQuestionIndex(questionsV9.length); // Écran de signature
    }
  };

  const handleFinalizeTest = () => {
    if (!signatureName.trim()) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSessions({
      ...activeSessions,
      [code]: {
        donorInfo: { ...donor },
        responses: { ...answersV9 },
        signature: signatureName,
        time: new Date().toLocaleTimeString(),
        historyLogs: [{ action: "Questionnaire pré-don signé", operator: "Donneur", time: new Date().toLocaleTimeString() }]
      }
    });
    setGeneratedCode(code);
  };

  const handleUpdateByDoctor = (qId, field, value) => {
    if (!activeDoctorSession) return;
    const updated = { ...activeDoctorSession };
    updated.responses[qId][field] = value;
    updated.historyLogs.push({ action: `Modification ${qId} (${field}: ${value})`, operator: doctorName, time: new Date().toLocaleTimeString() });
    setActiveDoctorSession(updated);
    setActiveSessions({ ...activeSessions, [currentMedicalCode]: updated });
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: '24px 16px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* BARRE DE NAVIGATION FINE ET PREMIUM */}
      <header style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', boxSizing: 'border-box', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🩸</span>
          <h1 style={{ fontSize: '16px', fontWeight: '700', margin: 0, letterSpacing: '-0.3px' }}>BloodPass <span style={{ color: '#dc2626', fontWeight: '800' }}>V9</span></h1>
        </div>
        {space !== 'auth' && (
          <button onClick={() => { setSpace('auth'); setGeneratedCode(''); setCurrentQuestionIndex(0); setActiveDoctorSession(null); }} style={{ padding: '6px 14px', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Menu</button>
        )}
      </header>

      {/* 1. ÉCRAN D'ACCUEIL DES PORTAILS STYLE "SHADCN" */}
      {space === 'auth' && (
        <div style={{ width: '100%', maxWidth: '440px', animation: 'fadeIn 0.3s ease' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.6px', marginBottom: '6px', textAlign: 'center' }}>Portails Établissement</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px', textAlign: 'center' }}>ETS de Charleroi — Outils de suivi d'hémovigilance.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button onClick={() => setSpace('donor_home')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '24px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.01)', textAlign: 'left', transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '22px', backgroundColor: '#fee2e2', padding: '10px', borderRadius: '16px' }}>👤</span>
                <div><p style={{ margin: 0, fontWeight: '700' }}>Portail Candidat Donneur</p><span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Consulter mes badges & faire le test V9</span></div>
              </div>
              <span style={{ color: '#94a3b8' }}>➔</span>
            </button>

            <button onClick={() => setSpace('doctor_auth')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '24px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '22px', backgroundColor: '#e0f2fe', padding: '10px', borderRadius: '16px' }}>🩺</span>
                <div><p style={{ margin: 0, fontWeight: '700' }}>Espace Médecin Référent</p><span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Ouvrir et rectifier un questionnaire pré-don</span></div>
              </div>
              <span style={{ color: '#94a3b8' }}>➔</span>
            </button>

            <button onClick={() => setSpace('admin')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#0f172a', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '24px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '22px', backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '16px' }}>⚙️</span>
                <div><p style={{ margin: 0, fontWeight: '700' }}>Gestion Administrateur</p><span style={{ fontSize: '12px', color: '#64748b', fontWeight: '400' }}>Habilitations médicales et validation 1-clic</span></div>
              </div>
              <span style={{ color: '#94a3b8' }}>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ESPACE PERSONNEL DU DONNEUR */}
      {space === 'donor_home' && (
        <div style={{ width: '100%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* CARTE VIRTUELLE DESIGN NOKIA TECH/APPLE */}
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '24px', borderRadius: '28px', boxShadow: '0 10px 25px -5px rgba(15,23,42,0.12)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.5 }}>Donneur Enregistré</p>
                <h3 style={{ margin: '6px 0 0 0', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>{donor.email}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.8 }}>{donor.count} dons effectués à l'ETS</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '16px', fontSize: '22px', fontWeight: '800', border: '1px solid rgba(255,255,255,0.1)' }}>{donor.bloodGroup}</div>
            </div>
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', opacity: 0.5 }}>Insignes obtenus</p>
              <div style={{ display: 'flex', gap: '6px' }}>
