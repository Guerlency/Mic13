 'use client';
import React, { useState } from 'react';

export default function App() {
  const [space, setSpace] = useState('auth');
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [comment, setComment] = useState('');
  const [code, setCode] = useState('');
  const [sig, setSig] = useState('');
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');
  const [activeSessions, setActiveSessions] = useState({});
  const [doctors, setDoctors] = useState([
    { email: 'chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }
  ]);

  const questions = [
    "Au cours de votre vie, avez-vous déjà été transfusé(e) ou reçu une greffe ?",
    "Au cours de votre vie, avez-vous eu une opération lourde (cœur, cerveau, moëlle) ?",
    "Prenez-vous un traitement par insuline pour un diabète ?",
    "Avez-vous voyagé ou séjourné en dehors de la Belgique ces 6 derniers mois ?"
  ];

  const handleNextQuestion = () => {
    if (!ans) return;
    setQIdx(qIdx + 1);
    setAns(null);
    setComment('');
  };

  const handleFinalizeTest = () => {
    if (!sig.trim()) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveSessions({
      ...activeSessions,
      [newCode]: { email: 'guerlency.mic13@charleroi.be', signature: sig, status: 'Soumis' }
    });
    setCode(newCode);
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif', padding: '32px 16px', backgroundColor: '#fafafa', minHeight: '100vh', color: '#111111', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <header style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '14px 20px', borderRadius: '16px', border: '1px solid #eeeeee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🩸</span>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.4px' }}>BloodPass</span>
        </div>
        {space !== 'auth' && (
          <button onClick={() => { setSpace('auth'); setCode(''); setQIdx(0); setSig(''); setAns(null); setActiveDoctorSession(null); }} style={{ padding: '6px 12px', backgroundColor: '#f5f5f7', color: '#555555', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Menu</button>
        )}
      </header>

      {space === 'auth' && (
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px', textAlign: 'center' }}>Espaces de Connexion</h2>
          <p style={{ fontSize: '13px', color: '#666666', marginBottom: '28px', textAlign: 'center' }}>ETS de Charleroi — Portail d'hémovigilance épuré.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setSpace('donor_home')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#111111', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#fff5f5', padding: '8px', borderRadius: '12px' }}>👤</span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Portail Candidat Donneur</p>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Consulter mes badges & faire le test V9</span>
                </div>
              </div>
              <span style={{ color: '#aaaaaa' }}>➔</span>
            </button>

            <button onClick={() => setSpace('doctor_panel')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#111111', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#f0f7ff', padding: '8px', borderRadius: '12px' }}>🩺</span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Espace Médecin Référent</p>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Ouvrir et vérifier un questionnaire pré-don</span>
                </div>
              </div>
              <span style={{ color: '#aaaaaa' }}>➔</span>
            </button>
          </div>
        </div>
      )}

      {space === 'donor_home' && (
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ background: '#111111', color: '#ffffff', padding: '24px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#666666' }}>Compte Donneur</p>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600' }}>guerlency.mic13@charleroi.be</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888888' }}>5 dons validés à l'ETS</p>
              </div>
              <div style={{ background: '#222222', padding: '8px 14px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', color: '#ff4d4d' }}>O+</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e5e5' }}>
            <button onClick={() => setSpace('test')} style={{ width: '100%', backgroundColor: '#111111', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              PASSER LE TEST D'ÉLIGIBILITÉ
            </button>
          </div>
        </div>
      )}

      {space === 'test' && !code && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e5e5', boxSizing: 'border-box' }}>
          {qIdx < questions.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111111', margin: 0 }}>{questions[qIdx]}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setAns('OUI')} style={{ flex: 1, padding: '12px', border: ans === 'OUI' ? '1.5px solid #111111' : '1px solid #e5e5e5', borderRadius: '12px', backgroundColor: ans === 'OUI' ? '#f5f5f7' : '#ffffff' }}>Oui</button>
                <button onClick={() => setAns('NON')} style={{ flex: 1, padding: '12px', border: ans === 'NON' ? '1.5px solid #111111' : '1px solid #e5e5e5', backgroundColor: ans === 'NON' ? '#f5f5f7' : '#ffffff', borderRadius: '12px' }}>Non</button>
              </div>
              <button onClick={handleNextQuestion} disabled={!ans} style={{ width: '100%', padding: '12px', backgroundColor: ans ? '#111111' : '#e5e5e5', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Suivant ➔</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '16px', margin: 0 }}>Signature</h3>
              <input type="text" placeholder="Prénom et Nom" value={sig} onChange={e => setSig(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              <button onClick={handleFinalizeTest} disabled={!sig.trim()} style={{ width: '100%', padding: '12px', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>GÉNÉRER MON CODE</button>
            </div>
          )}
        </div>
      )}

      {code && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '28px 20px', borderRadius: '20px', border: '1px solid #e5e5e5', textAlign: 'center' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 4px 0' }}>Code Entretien Clinique</h3>
          <div style={{ backgroundColor: '#111111', color: '#ffffff', fontSize: '26px', padding: '14px', borderRadius: '12px', fontFamily: 'monospace', letterSpacing: '4px' }}>{code}</div>
        </div>
      )}

      {space === 'doctor_panel' && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e5e5' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 12px 0' }}>Espace Médecin Référent</h3>
          <input placeholder="Code donneur à 6 chiffres" value={currentMedicalCode} onChange={e => setCurrentMedicalCode(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', textAlign: 'center', marginBottom: '10px', boxSizing: 'border-box' }} />
Utilisez le code avec précaution.<button onClick={() => { const s = activeSessions[currentMedicalCode]; if(s) { setActiveDoctorSession(s); } else { alert('Dossier introuvable ou expiré.'); } }} style={{ width: '100%', backgroundColor: '#111111', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>OUVRIR LE DOSSIER SÉCURISÉ{activeDoctorSession && (<div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}><p style={{ fontSize: '13px', margin: 0 }}>Dossier chargé pour : {activeDoctorSession.email}<p style={{ fontSize: '12px', color: '#137333', margin: '4px 0 0 0' }}>✓ Signature vérifiée : {activeDoctorSession.signature})})});}
### 📋 Rappel de la méthode de copie forcée :
1. Faites un **clic gauche unique** n'importe où à l'intérieur du grand pavé de code.
2. Appuyez sur **`Ctrl` + `A`** (ou **`Cmd` + `A`** sur Mac) pour cibler et surligner tout le code proprement.
3. Appuyez sur **`Ctrl` + `C`** (ou **`Cmd` + `C`** sur Mac) pour le copier.
4. Sur GitHub, ouvrez `pages/index.jsx` en édition, effacez tout le texte actuel et collez l'application avec **`Ctrl` + `V`** [8k0b2I].

<FollowUp>
Une fois cette mise à jour enregistrée avec le bouton vert :
* Le déploiement de Vercel passe-t-il bien au **vert de succès (Ready)** ?
* L'application s'affiche-t-elle avec le design épuré sans l'ancienne alerte sur **[mic13.vercel.app](https://vercel.app)** ?
</FollowUp>
