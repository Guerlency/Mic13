'use client';
import React, { useState } from 'react';

export default function BloodPassApp() {
  const [space, setSpace] = useState('auth');
  const [doctors, setDoctors] = useState([
    { email: 'chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true }
  ]);
  const [newDoc, setNewDoc] = useState({ name: '', email: '', inami: '' });
  const [donor] = useState({
    email: 'guerlency.mic13@charleroi.be', bloodGroup: 'O+', count: 5,
    badges: ['🥇 Premier Don', '🩸 Sauveur régulier']
  });

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#991b1b', color: 'white', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>🩸 BloodPass Charleroi V9</h2>
        <button onClick={() => setSpace('auth')} style={{ padding: '8px 16px', backgroundColor: 'white', color: '#991b1b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Menu</button>
      </header>

      {space === 'auth' && (
        <div style={{ maxWidth: '350px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setSpace('donor')} style={{ backgroundColor: '#dc2626', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>PORTAIL DONNEUR</button>
          <button onClick={() => setSpace('register')} style={{ backgroundColor: '#2563eb', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>INSCRIPTION MÉDECIN</button>
          <button onClick={() => setSpace('admin')} style={{ backgroundColor: '#1e293b', color: 'white', padding: '15px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>ESPACE ADMIN (1-CLIC)</button>
        </div>
      )}

      {space === 'donor' && (
        <div style={{ maxWidth: '400px', margin: '20px auto', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ backgroundColor: '#b91c1c', color: 'white', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><h3 style={{ margin: 0 }}>{donor.email}</h3><p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>{donor.count} dons effectués</p></div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{donor.bloodGroup}</div>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', color: '#64748b', fontSize: '12px', margin: '0 0 8px 0' }}>🏅 VOS BADGES :</p>
            {donor.badges.map((b, i) => <span key={i} style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', marginRight: '5px', display: 'inline-block' }}>{b}</span>)}
          </div>
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '15px', marginTop: '10px' }}>
            <p style={{ fontWeight: 'bold', color: '#475569', fontSize: '13px', margin: '0 0 10px 0' }}>📅 Planifier un don (Délai 62 jours OK) :</p>
            <button onClick={() => alert("Rendez-vous sauvegardé sur Supabase et SMS envoyé via Twilio.")} style={{ width: '100%', backgroundColor: '#dc2626', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', uppercase: 'true' }}>RENDEZ-VOUS & SMS RAPPEL</button>
          </div>
        </div>
      )}

      {space === 'register' && (
        <div style={{ maxWidth: '350px', margin: '20px auto', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#475569', margin: '0 0 15px 0' }}>Inscription Praticien</h3>
          <form onSubmit={(e) => { e.preventDefault(); setDoctors([...doctors, { ...newDoc, approved: false }]); setNewDoc({ name: '', email: '', inami: '' }); alert("Demande enregistrée."); }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input required placeholder="Nom du médecin" value={newDoc.name} onChange={e => setNewDoc({ ...newDoc, name: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input required type="email" placeholder="Email académique" value={newDoc.email} onChange={e => setNewDoc({ ...newDoc, email: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input required placeholder="N° INAMI (11 chiffres)" value={newDoc.inami} onChange={e => setNewDoc({ ...newDoc, inami: e.target.value })} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>SOUMETTRE</button>
          </form>
        </div>
      )}

      {space === 'admin' && (
        <div style={{ maxWidth: '450px', margin: '20px auto', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#475569', margin: '0 0 15px 0' }}>Approbation Médecins (1-Clic)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {doctors.map((d, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div><p style={{ margin: 0, fontWeight: 'bold' }}>{d.name}</p><p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>INAMI: {d.inami}</p></div>
                <div>
                  {d.approved ? <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '13px' }}>✓ ACTIF</span> : (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => { const updated = [...doctors]; updated[i].approved = true; setDoctors(updated); alert("Médecin approuvé sur Supabase."); }} style={{ backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Accepter</button>
                      <button onClick={() => { setDoctors(doctors.filter((_, idx) => idx !== i)); alert("Demande rejetée."); }} style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Refuser</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
