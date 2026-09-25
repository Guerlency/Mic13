'use client';
import React, { useState } from 'react';

export default function App() {
  const [space, setSpace] = useState('auth');
  const [qIdx, setQIdx] = useState(0);
  const [ans, setAns] = useState(null);
  const [code, setCode] = useState('');
  const [sig, setSig] = useState('');

  const questions = [
    "Au cours de votre vie, avez-vous déjà été transfusé(e) ou reçu une greffe ?",
    "Au cours de votre vie, avez-vous eu une opération lourde du cœur ou du cerveau ?",
    "Prenez-vous un traitement par insuline pour un diabète ?",
    "Avez-vous voyagé en dehors de la Belgique au cours des 6 derniers mois ?"
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', color: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', mb: '20px' }}>
        <h1 style={{ fontSize: '16px', margin: 0 }}>🩸 BloodPass <b>V9</b></h1>
        {space !== 'auth' && <button onClick={() => { setSpace('auth'); setCode(''); setQIdx(0); }} style={{ borderRadius: '8px', border: 'none', padding: '4px 10px', cursor: 'pointer' }}>Menu</button>}
      </header>

      {space === 'auth' && (
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '20px' }}>Bienvenue</h2>
          <button onClick={() => setSpace('donor')} style={{ width: '100%', padding: '16px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}>👤 PORTAIL DONNEUR</button>
          <button onClick={() => alert('Interface médecin active avec le code donneur.')} style={{ width: '100%', padding: '16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '16px', cursor: 'pointer', fontWeight: 'bold' }}>🩺 ESPACE MÉDECIN</button>
        </div>
      )}

      {space === 'donor' && !code && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: '#fff', padding: '20px', borderRadius: '16px', marginBottom: '16px' }}>
            <p style={{ margin: 0, fontSize: '11px', opacity: 0.6 }}>guerlency.mic13@charleroi.be</p>
            <h3 style={{ margin: '5px 0 0 0' }}>Groupe sanguin : O+</h3>
            <span style={{ fontSize: '11px', display: 'inline-block', marginTop: '8px', backgroundColor: '#16a34a', padding: '2px 8px', borderRadius: '10px' }}>Délai 62 jours OK</span>
          </div>
          <button onClick={() => setSpace('test')} style={{ width: '100%', padding: '14px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>LANCER LE TEST D'ÉLIGIBILITÉ</button>
        </div>
      )}

      {space === 'test' && !code && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '24px', border: '1px solid #e2e8f0' }}>
          {qIdx < questions.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '12px', color: '#dc2626', margin: 0, fontWeight: 'bold' }}>QUESTION {qIdx + 1} / {questions.length}</p>
              <p style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{questions[qIdx]}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setAns('OUI')} style={{ flex: 1, padding: '12px', border: ans === 'OUI' ? '2px solid #dc2626' : '1px solid #cbd5e1', borderRadius: '12px', backgroundColor: ans === 'OUI' ? '#fff5f5' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Oui</button>
                <button onClick={() => setAns('NON')} style={{ flex: 1, padding: '12px', border: ans === 'NON' ? '2px solid #0f172a' : '1px solid #cbd5e1', borderRadius: '12px', backgroundColor: ans === 'NON' ? '#f8fafc' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Non</button>
              </div>
              <button onClick={() => { setQIdx(qIdx + 1); setAns(null); }} disabled={!ans} style={{ width: '100%', padding: '12px', backgroundColor: ans ? '#0f172a' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Suivant ➔</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ margin: 0 }}>Signature de l'attestation</h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>« J'atteste avoir répondu avec sincérité. »</p>
              <input type="text" placeholder="Prénom et Nom" value={sig} onChange={e => setSig(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
              <button onClick={() => setCode(Math.floor(100000 + Math.random() * 900000).toString())} disabled={!sig.trim()} style={{ width: '100%', padding: '12px', backgroundColor: sig.trim() ? '#16a34a' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>OBTENIR MON CODE (12H)</button>
            </div>
          )}
        </div>
      )}

      {code && (
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', padding: '30px 20px', borderRadius: '24px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Code Entretien Médecin</h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Donnez ce code au médecin de prélèvement à Charleroi.</p>
          <div style={{ backgroundColor: '#0f172a', color: '#fff', fontSize: '32px', padding: '12px', borderRadius: '12px', fontFamily: 'monospace', letterSpacing: '4px', display: 'inline-block', width: '100%', boxSizing: 'border-box' }}>{code}</div>
        </div>
      )}
    </div>
  );
}
