'use client';
import React, { useState } from 'react';

export default function App() {
  const [space, setSpace] = useState('auth');
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [comment, setComment] = useState('');
  const [code, setCode] = useState('');
  const [sig, setSig] = useState('');
  const [doctors, setDoctors] = useState([
    { email: 'chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }
  ]);

  const questions = [
    "Au cours de votre vie, avez-vous déjà été transfusé(e) ou reçu une greffe ?",
    "Au cours de votre vie, avez-vous eu une opération lourde (cœur, cerveau, moëlle) ?",
    "Prenez-vous un traitement par insuline pour un diabète ?",
    "Avez-vous voyagé ou séjourné en dehors de la Belgique ces 6 derniers mois ?"
  ];

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif', padding: '32px 16px', backgroundColor: '#fafafa', minHeight: '100vh', color: '#111111', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* BARRE DE NAVIGATION MINIMALISTE */}
      <header style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '14px 20px', borderRadius: '16px', border: '1px solid #eeeeee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🩸</span>
          <span style={{ fontSize: '15px', fontWeight: '700', letterSpacing: '-0.4px' }}>BloodPass</span>
        </div>
        {space !== 'auth' && (
          <button onClick={() => { setSpace('auth'); setCode(''); setQIdx(0); setSig(''); setAns(null); setComment(''); }} style={{ padding: '6px 12px', backgroundColor: '#f5f5f7', color: '#555555', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'background-color 0.2s' }}>Menu</button>
        )}
      </header>

      {/* 1. ÉCRAN D'ACCUEIL PORTAILS (STYLE SHADCN ACCENTUÉ) */}
      {space === 'auth' && (
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '6px', textAlign: 'center' }}>Espaces de Connexion</h2>
          <p style={{ fontSize: '13px', color: '#666666', marginBottom: '28px', textAlign: 'center' }}>ETS de Charleroi — Portail d'hémovigilance autonome.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => setSpace('donor_home')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#111111', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', transition: 'border-color 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#fff5f5', padding: '8px', borderRadius: '12px' }}>👤</span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Portail Candidat Donneur</p>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Consulter mes badges & faire le test V9</span>
                </div>
              </div>
              <span style={{ color: '#aaaaaa', fontSize: '14px' }}>➔</span>
            </button>

            <button onClick={() => setSpace('doctor_panel')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#111111', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#f0f7ff', padding: '8px', borderRadius: '12px' }}>🩺</span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Espace Médecin Référent</p>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Ouvrir et rectifier un questionnaire pré-don</span>
                </div>
              </div>
              <span style={{ color: '#aaaaaa', fontSize: '14px' }}>➔</span>
            </button>

            <button onClick={() => setSpace('admin_panel')} style={{ width: '100%', backgroundColor: '#ffffff', color: '#111111', padding: '18px', border: '1px solid #e5e5e5', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '20px', backgroundColor: '#f5f5f7', padding: '8px', borderRadius: '12px' }}>⚙️</span>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Gestion Administrateur</p>
                  <span style={{ fontSize: '12px', color: '#666666' }}>Habilitations médicales et validation 1-clic</span>
                </div>
              </div>
              <span style={{ color: '#aaaaaa', fontSize: '14px' }}>➔</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. ESPACE PERSONNEL DONNEUR */}
      {space === 'donor_home' && (
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* CARTE DIGITAL SOMBRE FINITION MATTE */}
          <div style={{ background: '#111111', color: '#ffffff', padding: '24px', borderRadius: '20px', border: '1px solid #222222' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666666' }}>Compte Donneur Officiel</p>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '15px', fontWeight: '600' }}>guerlency.mic13@charleroi.be</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888888' }}>5 dons validés à l'ETS</p>
              </div>
              <div style={{ background: '#222222', padding: '8px 14px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', color: '#ff4d4d' }}>O+</div>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #222222' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: '#666666' }}>Insignes</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ backgroundColor: '#222222', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '500' }}>🥇 Premier Don</span>
                <span style={{ backgroundColor: '#222222', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '500' }}>🩸 Sauveur</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e5e5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#333333' }}>Délai réglementaire de 62 jours</p>
              <span style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: '700' }}>Validé</span>
            </div>
            <p style={{ margin: '0 0 16px 0', fontSize: '12.5px', color: '#666666', lineHeight: '1.5' }}>Le délai d'attente légal est respecté. Vous devez maintenant soumettre votre questionnaire médical obligatoire.</p>
            <button onClick={() => setSpace('test')} style={{ width: '100%', backgroundColor: '#111111', color: '#ffffff', padding: '12px', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
              PASSER LE TEST D'ÉLIGIBILITÉ
            </button>
          </div>
        </div>
      )}

      {/* 3. TEST INTERACTIF QUESTION PAR QUESTION */}
      {space === 'test' && !code && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', padding: '20px', borderRadius: '20px', border: '1px solid #e5e5e5', boxSizing: 'border-box' }}>
          {qIdx < questions.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f5f5f7', paddingBottom: '10px' }}>
                <span style={{ fontSize: '10px', fontWeight: '700', color: '#ff4d4d', backgroundColor: '#fff5f5', padding: '3px 6px', borderRadius: '6px' }}>ANAMNÈSE</span>
                <span style={{ fontSize: '11px', fontWeight: '500', color: '#666666' }}>{qIdx + 1} / {questions.length}</span>
              </div>
              <p style={{ fontSize: '14.5px', fontWeight: '600', color: '#111111', margin: 0, lineHeight: '1.4' }}>{questions[qIdx]}</p>
              
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button onClick={() => setAns('OUI')} style={{ flex: 1, padding: '12px', border: ans === 'OUI' ? '1.5px solid #111111' : '1px solid #e5e5e5', backgroundColor: ans === 'OUI' ? '#f5f5f7' : '#ffffff', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>Oui</button>
