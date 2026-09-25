'use client';
import React, { useState } from 'react';

export default function BloodPassApp() {
  const [space, setSpace] = useState('auth');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [answersV9, setAnswersV9] = useState({});
  const [generatedCode, setGeneratedCode] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');
  const [doctors, setDoctors] = useState([{ email: 'chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }]);
  const [newDoc, setNewDoc] = useState({ name: '', email: '', inami: '' });
  const [donor] = useState({ email: 'guerlency.mic13@charleroi.be', bloodGroup: 'O+', count: 5, badges: ['🥇 Premier Don', '🩸 Sauveur régulier'] });

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
    setSelectedResponse(null); setCommentText('');
    if (currentQuestionIndex < questionsV9.length - 1) { setCurrentQuestionIndex(currentQuestionIndex + 1); }
    else { setCurrentQuestionIndex(questionsV9.length); }
  };

  const handleFinalizeTest = () => {
    if (!signatureName.trim()) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSessions({ ...activeSessions, [code]: { donorInfo: { ...donor }, responses: { ...answersV9 }, signature: signatureName, time: new Date().toLocaleTimeString(), historyLogs: [{ action: "Questionnaire soumis", operator: "Donneur", time: new Date().toLocaleTimeString() }] } });
    setGeneratedCode(code);
  };

  const handleUpdateByDoctor = (qId, field, value) => {
    if (!activeDoctorSession) return;
    const updated = { ...activeDoctorSession };
    updated.responses[qId][field] = value;
    updated.historyLogs.push({ action: `Modif ${qId} -> ${field}: "${value}"`, operator: doctorName, time: new Date().toLocaleTimeString() });
    setActiveDoctorSession(updated); setActiveSessions({ ...activeSessions, [currentMedicalCode]: updated });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '16px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a' }}>
      <header style={{ maxWidth: '480px', margin: '0 auto 24px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
        <h1 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>🩸 BloodPass Charleroi V9</h1>
        {space !== 'auth' && <button onClick={() => { setSpace('auth'); setGeneratedCode(''); setCurrentQuestionIndex(0); setActiveDoctorSession(null); }} style={{ padding: '6px 14px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>Menu</button>}
      </header>

      {space === 'auth' && (
        <div style={{ maxWidth: '400px', margin: '40px auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => setSpace('donor_home')} style={{ width: '100%', backgroundColor: '#ffffff', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', textAlign: 'left' }}>👤 Portail Personnel Donneur</button>
          <button onClick={() => setSpace('doctor_auth')} style={{ width: '100%', backgroundColor: '#ffffff', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', textAlign: 'left' }}>🩺 Espace Médecin Référent</button>
          <button onClick={() => setSpace('admin')} style={{ width: '100%', backgroundColor: '#ffffff', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer', fontWeight: '700', textAlign: 'left' }}>⚙️ Gestion Administrateur (1-Clic)</button>
        </div>
      )}

      {space === 'donor_home' && (
        <div style={{ maxWidth: '440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', padding: '24px', borderRadius: '24px' }}>
            <h3 style={{ margin: 0 }}>{donor.email}</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800' }}>Groupe : {donor.bloodGroup}</p>
            <button onClick={() => setSpace('eligibility_test')} style={{ width: '100%', backgroundColor: '#dc2626', color: 'white', padding: '14px', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: '700', marginTop: '15px' }}>PASSER LE TEST D'ÉLIGIBILITÉ V9</button>
          </div>
        </div>
      )}

      {space === 'eligibility_test' && !generatedCode && (
        <div style={{ maxWidth: '440px', margin: '20px auto', backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          {currentQuestionIndex < questionsV9.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <p style={{ fontSize: '16px', fontWeight: '700' }}>{questionsV9[currentQuestionIndex].id}. {questionsV9[currentQuestionIndex].text}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setSelectedResponse('OUI')} style={{ flex: 1, padding: '12px', border: selectedResponse === 'OUI' ? '2px solid #dc2626' : '1px solid #e2e8f0', borderRadius: '12px' }}>Oui</button>
                <button onClick={() => setSelectedResponse('NON')} style={{ flex: 1, padding: '12px', border: selectedResponse === 'NON' ? '2px solid #0f172a' : '1px solid #e2e8f0', borderRadius: '12px' }}>Non</button>
              </div>
              {selectedResponse === 'OUI' && <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Précisions obligatoires (Dates, lieux...)" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />}
              <button onClick={handleNextQuestion} disabled={!selectedResponse} style={{ width: '100%', backgroundColor: '#0f172a', color: 'white', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>Suivant ➔</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3>Signature de l'attestation</h3>
              <input type="text" value={signatureName} onChange={e => setSignatureName(e.target.value)} placeholder="Prénom et Nom" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <button onClick={handleFinalizeTest} disabled={!signatureName.trim()} style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', padding: '12px', borderRadius: '12px' }}>OBTENIR MON CODE CONFIDENTIEL</button>
            </div>
          )}
        </div>
      )}

      {space === 'eligibility_test' && generatedCode && (
        <div style={{ maxWidth: '400px', margin: '40px auto', backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <h3>Code Entretien Médecin (Valable 12h)</h3>
          <div style={{ backgroundColor: '#0f172a', color: '#ffffff', fontSize: '32px', padding: '16px', borderRadius: '16px', fontFamily: 'monospace', letterSpacing: '4px' }}>{generatedCode}</div>
        </div>
      )}

      {space === 'doctor_auth' && (
        <div style={{ maxWidth: '440px', margin: '0 auto', backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          {!activeDoctorSession ? (
            <form onSubmit={handleDoctorAccess} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input required placeholder="Entrer le code à 6 chiffres" value={currentMedicalCode} onChange={e => setCurrentMedicalCode(e.target.value)} style={{ padding: '12px', textAlign: 'center', fontSize: '16px' }} />
              <button type="submit" style={{ backgroundColor: '#0284c7', color: 'white', padding: '12px', borderRadius: '12px' }}>OUVRIR DOSSIER</button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <h3>Examen : {activeDoctorSession.donorInfo.email}</h3>
              {questionsV9.map(q => {
                const ans = activeDoctorSession.responses[q.id] || { value: 'NON', comment: '' };
                return (
                  <div key={q.id} style={{ padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                    <p style={{ margin: 0 }}><strong>[{q.id}]</strong> {q.text}</p>
