'use client';

import React, { useState, useMemo } from 'react';

// Base de données des critères officiels DondeSang.be pour la recherche médicale
const CRITERES_MEDICAUX = [
  { id: "C1", nom: "Insuline / Diabète insulinodépendant", categorie: "Médicaments", type: "DEFINITIF", note: "Contre-indication définitive au don de sang total et de composants sanguins." },
  { id: "C2", nom: "Chimiothérapie anti-cancéreuse", categorie: "Médicaments", type: "DEFINITIF", note: "Contre-indication définitive. Ajournement à vie suite à une pathologie maligne sous-jacente." },
  { id: "C3", nom: "Acitrétine (Neotigason) / Étrétinate (Tegison)", categorie: "Médicaments", type: "TEMPORAIRE", delai: "3 ans", note: "Risque tératogène élevé. L'écartement commence après la dernière prise." },
  { id: "C4", nom: "Léflunomide (Arava) / Tériflunomide (Aubagio)", categorie: "Médicaments", type: "TEMPORAIRE", delai: "2 ans", note: "Élimination extrêmement lente de la molécule. Risque de tératogénicité." },
  { id: "C5", nom: "Dutastéride (Avodart, Combodart)", categorie: "Médicaments", type: "TEMPORAIRE", delai: "6 mois", note: "Traitement de l'hypertrophie bénigne de la prostate. Effets tératogènes." },
  { id: "C6", nom: "Méthotrexate (Metoject, Ledertrexate)", categorie: "Médicaments", type: "TEMPORAIRE", delai: "6 mois", note: "Utilisé pour les maladies auto-immunes ou rhumatismes. Attention aux pathologies sous-jacentes." },
  { id: "C7", nom: "Isotrétinoïne (Roaccutane, Isosupra, Isocural)", categorie: "Médicaments", type: "TEMPORAIRE", delai: "1 mois (30 jours)", note: "Traitement de l'acné sévère. Hautement tératogène. Vérifier la date de dernière prise." },
  { id: "C8", nom: "Anticoagulants oraux (Xarelto, Eliquis, Pradaxa)", categorie: "Médicaments", type: "TEMPORAIRE", delai: "1 à 6 mois", note: "Écartement variable selon la gravité de la thrombose veineuse (superficielle ou profonde)." },
  { id: "C9", nom: "Asaflow / Aspirine / Anti-inflammatoires", categorie: "Médicaments", type: "PLAQUETTES", delai: "3 à 5 jours", note: "Contre-indication UNIQUE pour le don de plaquettes. Le don de sang total reste autorisé." },
  { id: "C10", nom: "Tatouage / Piercing / Maquillage permanent", categorie: "Interventions", type: "TEMPORAIRE", delai: "4 mois", note: "Délai de sécurité critique lié au risque d'infections transmissibles par le sang." },
  { id: "C11", nom: "Soins dentaires / Détartrage", categorie: "Alertes récentes", type: "TEMPORAIRE", delai: "7 jours", note: "Délai nécessaire suite au risque de bactériémie transitoire après manipulation bucco-dentaire." },
  { id: "C12", nom: "Voyage en dehors de la Belgique", categorie: "Voyages", type: "TEMPORAIRE", delai: "6 mois", note: "Vérifier les zones endémiques (ex: Paludisme, Virus du Nil Occidental) selon le protocole de voyage." }
];

const QUESTIONS_ELIGIBILITE = [
  { id: 1, texte: "Avez-vous entre 18 et 70 ans ?", reponseRequise: "oui", messageErreur: "Pour donner votre sang, vous devez être majeur et avoir moins de 71 ans." },
  { id: 2, texte: "Pesez-vous au moins 50 kg ?", reponseRequise: "oui", messageErreur: "Le don de sang standard requiert un poids minimal de 50 kg pour votre sécurité." },
  { id: 3, texte: "Avez-vous mangé ou bu de l'eau au cours des dernières heures ?", reponseRequise: "oui", messageErreur: "Il est fortement déconseillé de donner son sang à jeun. Veuillez vous restaurer avant le don." },
  { id: 4, texte: "Avez-vous eu de la fièvre, des frissons ou été malade ces 2 dernières semaines ?", reponseRequise: "non", messageErreur: "Un délai d'attente est nécessaire après un épisode infectieux pour protéger les receveurs." }
];

export default function NouSangoDashboard() {
  const [ongletActif, setOngletActif] = useState("medecin");
  const [rechercheCritere, setRechercheCritere] = useState("");
  
  // États pour le test donneur simplifié
  const [etapeDonneur, setEtapeDonneur] = useState(0);
  const [resultatDonneur, setResultatDonneur] = useState(null);

  // États pour la création de profils médecins
  const [medecins, setMedecins] = useState([
    { id: "MED-01", nom: "Martin", prenom: "Pierre", specialite: "Hématologue", identifiant: "1870942" },
    { id: "MED-02", nom: "Dubois", prenom: "Sophie", specialite: "Généraliste / Collecte", identifiant: "1954321" }
  ]);
  const [nouveauMedecin, setNouveauMedecin] = useState({ nom: "", prenom: "", specialite: "Hématologue", identifiant: "" });

  // Filtrage dynamique des critères médicaux pour la console médecin
  const criteresFiltrés = useMemo(() => {
    const terme = rechercheCritere.toLowerCase().trim();
    if (!terme) return [];
    return CRITERES_MEDICAUX.filter(c => 
      c.nom.toLowerCase().includes(terme) || 
      c.categorie.toLowerCase().includes(terme) ||
      c.note.toLowerCase().includes(terme)
    );
  }, [rechercheCritere]);

  const ajouterProfilMedecin = (e) => {
    e.preventDefault();
    if (!nouveauMedecin.nom || !nouveauMedecin.prenom || !nouveauMedecin.identifiant) return;
    
    const med = {
      id: `MED-${Date.now().toString().slice(-2)}`,
      ...nouveauMedecin
    };
    setMedecins([...medecins, med]);
    setNouveauMedecin({ nom: "", prenom: "", specialite: "Hématologue", identifiant: "" });
  };

  const gererReponseDonneur = (choix) => {
    const questionActuelle = QUESTIONS_ELIGIBILITE[etapeDonneur];
    if (choix !== questionActuelle.reponseRequise) {
      setResultatDonneur({ eligible: false, raison: questionActuelle.messageErreur });
      return;
    }
    if (etapeDonneur < QUESTIONS_ELIGIBILITE.length - 1) {
      setEtapeDonneur(etapeDonneur + 1);
    } else {
      setResultatDonneur({ eligible: true, raison: "Félicitations ! Vous semblez éligible au don de sang d'après ce premier test." });
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ borderBottom: '3px solid #dc3545', paddingBottom: '12px', marginBottom: '25px' }}>
        <h1 style={{ margin: 0, color: '#dc3545', fontSize: '28px' }}>🩸 Nou SanGO</h1>
        <p style={{ margin: '4px 0 0 0', color: '#6c757d', fontSize: '14px' }}>L'écosystème connecté de l'éligibilité transfusionnelle</p>
      </header>

      {/* Barre d'onglets principale */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '1px solid #dee2e6', paddingBottom: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setOngletActif("medecin")}
          style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: ongletActif === "medecin" ? "#dc3545" : "#e9ecef", color: ongletActif === "medecin" ? "#fff" : "#495057" }}
        >
          🎛️ Espace Administration & Médecins
        </button>
        <button 
          onClick={() => setOngletActif("console")}
          style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: ongletActif === "console" ? "#dc3545" : "#e9ecef", color: ongletActif === "console" ? "#fff" : "#495057" }}
        >
          🔎 Console de Recherche Médicale (Staff)
        </button>
        <button 
          onClick={() => setOngletActif("donneur")}
          style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: ongletActif === "donneur" ? "#dc3545" : "#e9ecef", color: ongletActif === "donneur" ? "#fff" : "#495057" }}
        >
          📋 Test Éligibilité (Donneurs)
        </button>
      </div>

      {/* CONTENU : ESPACE ADMINISTRATION MÉDECIN */}
      {ongletActif === "medecin" && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {/* Formulaire */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h3 style={{ marginTop: 0, color: '#212529', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>Créer un profil Médecin</h3>
            <form onSubmit={ajouterProfilMedecin} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              <input type="text" placeholder="Nom" value={nouveauMedecin.nom} onChange={e => setNouveauMedecin({...nouveauMedecin, nom: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }} required />
              <input type="text" placeholder="Prénom" value={nouveauMedecin.prenom} onChange={e => setNouveauMedecin({...nouveauMedecin, prenom: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }} required />
              <input type="text" placeholder="Identifiant Médical / INAMI" value={nouveauMedecin.identifiant} onChange={e => setNouveauMedecin({...nouveauMedecin, identifiant: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }} required />
              <select value={nouveauMedecin.specialite} onChange={e => setNouveauMedecin({...nouveauMedecin, specialite: e.target.value})} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced4da' }}>
                <option value="Hématologue">Hématologue</option>
                <option value="Généraliste / Collecte">Généraliste / Collecte</option>
                <option value="Médecin Responsable">Médecin Responsable</option>
              </select>
              <button type="submit" style={{ padding: '12px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Enregistrer le Médecin</button>
            </form>
          </div>

          {/* Liste */}
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
