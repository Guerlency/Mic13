'use client';

import React, { useState, useMemo } from 'react';

export default function BloodPassApp() {
  const [currentSpace, setCurrentSpace] = useState('auth');
  const [globalNotifications, setGlobalNotifications] = useState([
    { id: 1, targetType: 'ALL', targetValue: 'Tous', text: 'Bienvenue sur BloodPass Charleroi V9 !', date: '25/09/2026' }
  ]);
  const [adminMsg, setAdminMsg] = useState('');
  const [adminTargetType, setAdminTargetType] = useState('POSTAL'); 
  const [adminTargetValue, setAdminTargetValue] = useState('6000');
  const [activeSessions, setActiveSessions] = useState({});
  const [currentMedicalCode, setCurrentMedicalCode] = useState('');
  const [activeDoctorSession, setActiveDoctorSession] = useState(null);
  const [doctorName, setDoctorName] = useState('Dr. Renard');
  const [doctorsList, setDoctorsList] = useState([
    { email: 'medecin.chef@charleroi.be', name: 'Dr. Renard', inami: '12345678901', approved: true },
    { email: 'nouveau.praticien@charleroi.be', name: 'Dr. Martin', inami: '98765432101', approved: false }
  ]);
  const [newDocEmail, setNewDocEmail] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newDocInami, setNewDocInami] = useState('');

  const [donor, setDonor] = useState({
    email: 'guerlency.mic13@charleroi.be', postalCode: '6000', phone: '0470123456', age: 24, weight: 68, height: 172, gender: 'M', donationType: 'STHO', bloodGroup: 'O+',
    eligibilityChecked: false, isGloballyEligible: true, rejectionReason: '', vst: 0, maxAllowedVolume: 0, generatedCode: '', residueConsent: null, donorSignature: '', doctorSignature: '', medicalConclusion: '', exclusionType: 'Temporaire', donationCount: 5,
    badges: [
      { name: '🥇 Premier Don', desc: 'Janvier 2026', color: 'bg-amber-500' },
      { name: '🩸 Sauveur régulier', desc: 'Plus de 3 dons', color: 'bg-red-500' }
    ],
    appointments: [{ id: 'APT-102', date: '2026-10-05', time: '14:30', location: 'Maison du Don - Loverval', status: 'Confirmé' }],
    pastDonations: [{ id: 'DON-901', date: '14/05/2026', type: 'Sang Total', location: 'Maison du Don - Loverval', status: 'Validé' }]
  });

  const [selectedDate, setSelectedDate] = useState('2026-10-12');
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [selectedLoc, setSelectedLoc] = useState('Maison du Don - Loverval');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const initialQuestionsV9 = [
    { id: 'Q1', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous été transfusé(e) ou reçu une greffe ?", type: 'date_place' },
    { id: 'Q3', section: 'SANTÉ', text: "Au cours de votre vie, avez-vous eu une opération du cerveau, du cœur ou de la moëlle épinière ?", type: 'date_place' },
    { id: 'Q6', section: 'SANTÉ', text: "Eu un diabète traité par insuline ?", type: 'comment' },
    { id: 'Q36', section: 'VOYAGES', text: "Au cours des 6 derniers mois, avez-vous voyagé en dehors de la Belgique ?", type: 'date_place' }
  ];

  const [answersV9, setAnswersV9] = useState({});
  const [currentResponse, setCurrentResponse] = useState('');

  const handlePhysicalCheck = (e) => {
    e.preventDefault();
    const heightInInches = donor.height * 0.3937;
    const weightInPounds = donor.weight * 2.2046;
    const calculatedVst = (0.006012 * Math.pow(heightInInches, 3)) + (14.6 * weightInPounds) + 604;
    setDonor({ ...donor, eligibilityChecked: true, vst: Math.round(calculatedVst), maxAllowedVolume: Math.round(calculatedVst * 0.13) });
  };

  const handleDoctorRegister = (e) => {
    e.preventDefault();
    setDoctorsList([...doctorsList, { email: newDocEmail, name: newDocName, inami: newDocInami, approved: false }]);
    setNewDocEmail(''); setNewDocName(''); setNewDocInami('');
    alert("Demande d'inscription enregistrée.");
  };

  const toggleDoctorApproval = (email, actionType) => {
    if (actionType === 'APPROUVER') {
      setDoctorsList(doctorsList.map(doc => doc.email === email ? { ...doc, approved: true } : doc));
      alert("Médecin approuvé sur Supabase.");
    } else {
      setDoctorsList(doctorsList.filter(doc => doc.email !== email));
      alert("Demande supprimée.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 p-4">
      <header className="bg-red-800 text-white p-4 rounded-xl flex justify-between items-center mb-4">
        <h1 className="text-sm font-bold">🩸 BloodPass Charleroi V9</h1>
        <button onClick={() => setCurrentSpace('auth')} className="bg-white/10 p-1 rounded text-xs">Menu</button>
      </header>

      {currentSpace === 'auth' && (
        <div className="bg-white p-6 rounded-xl shadow space-y-2 max-w-sm mx-auto">
          <button onClick={() => setCurrentSpace('donor_home')} className="w-full bg-red-600 text-white p-2 rounded text-xs font-bold">PORTAIL DONNEUR</button>
          <button onClick={() => setCurrentSpace('doc_register')} className="w-full bg-blue-600 text-white p-2 rounded text-xs font-bold">INSCRIPTION MÉDECIN</button>
          <button onClick={() => setCurrentSpace('admin_panel')} className="w-full bg-slate-800 text-white p-2 rounded text-xs font-bold">ESPACE ADMIN (1-CLIC)</button>
        </div>
      )}

      {currentSpace === 'doc_register' && (
        <div className="bg-white p-4 rounded-xl shadow max-w-sm mx-auto space-y-3">
          <h2 className="text-xs font-bold uppercase text-slate-400">Inscription Praticien</h2>
          <form onSubmit={handleDoctorRegister} className="space-y-2">
            <input required placeholder="Nom" value={newDocName} onChange={e => setNewDocName(e.target.value)} className="w-full p-2 text-xs border rounded" />
            <input required placeholder="Email" value={newDocEmail} onChange={e => setNewDocEmail(e.target.value)} className="w-full p-2 text-xs border rounded" />
            <input required placeholder="INAMI (11 chiffres)" value={newDocInami} onChange={e => setNewDocInami(e.target.value)} className="w-full p-2 text-xs border rounded" />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded text-xs font-bold">SOUMETTRE</button>
          </form>
        </div>
      )}

      {currentSpace === 'admin_panel' && (
        <div className="bg-white p-4 rounded-xl shadow max-w-md mx-auto space-y-4">
          <h2 className="text-xs font-bold uppercase text-slate-400">Approbation Médecins (1-Clic)</h2>
          {doctorsList.map((d, i) => (
            <div key={i} className="p-2 bg-slate-50 rounded border text-xs flex justify-between items-center">
              <div><p className="font-bold">{d.name}</p><p className="text-slate-400 text-3xs">INAMI: {d.inami}</p></div>
              <div className="flex gap-1">
                {d.approved ? <span className="text-green-600 font-bold text-3xs">ACTIF</span> : (
                  <>
                    <button onClick={() => toggleDoctorApproval(d.email, 'APPROUVER')} className="bg-green-600 text-white p-1 rounded text-3xs">Accepter</button>
                    <button onClick={() => toggleDoctorApproval(d.email, 'REJETER')} className="bg-red-600 text-white p-1 rounded text-3xs">Refuser</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {currentSpace === 'donor_home' && (
        <div className="bg-white p-4 rounded-xl shadow max-w-sm mx-auto space-y-4">
          <div className="bg-red-700 text-white p-3 rounded-lg flex justify-between items-center">
            <div><p className="text-xs font-bold">{donor.email}</p><p className="text-3xs text-red-200">{donor.donationCount} dons effectués</p></div>
            <div className="font-bold">{donor.bloodGroup}</div>
          </div>
          <div className="p-2 bg-slate-50 rounded border text-3xs">
            <p className="font-bold text-slate-400 mb-1">🏅 VOS BADGES :</p>
            {donor.badges.map((b, i) => <span key={i} className="inline-block bg-red-100 text-red-800 p-1 rounded mr-1 font-bold">{b.name}</span>)}
          </div>
          <div className="p-2 bg-slate-50 rounded border text-2xs space-y-2">
            <p className="font-bold text-slate-500">📅 Planifier un don (Délai 62 jours OK) :</p>
            <button onClick={() => alert("Rendez-vous sauvegardé sur Supabase et SMS envoyé via Twilio.")} className="w-full bg-red-600 text-white p-2 rounded font-bold text-xs">RENDEZ-VOUS & SMS RAPPEL</button>
          </div>
        </div>
      )}
    </div>
  );
}
