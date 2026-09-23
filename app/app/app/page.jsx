'use client';

import React, { useState, useMemo } from 'react';
import DOMPurify from 'dompurify';

// Le tableau des données initiales pour le suivi des flux de sang
const INITIAL_POCHES = [
  { id: "1", codeBarre: "BC-2026-001", groupeSanguin: "O-", statut: "STOCKÉ", emplacement: "Réfrigérateur Principal - Rangée A", volumeMl: 450, notes: "Donneur universel. Poche validée après analyses sérologiques complètes. Température stable à 4°C." },
  { id: "2", codeBarre: "BC-2026-002", groupeSanguin: "A+", statut: "ANALYSE", emplacement: "Laboratoire - Centrifugeuse 2", volumeMl: 480, notes: "Analyses de contrôle en cours. Vérification du taux d'hémoglobine requise." },
  { id: "3", codeBarre: "BC-2026-003", groupeSanguin: "B-", statut: "PRELEVE", emplacement: "Zone de Collecte mobile", volumeMl: 420, notes: "Poche prélevée ce matin. En attente de transfert logistique vers le centre de traitement." },
  { id: "4", codeBarre: "BC-2026-004", groupeSanguin: "AB+", statut: "DISTRIBUÉ", emplacement: "Bloc Opératoire - Urgences", volumeMl: 450, notes: "Délivrée en urgence pour transfusion suite à un traumatisme majeur." },
  { id: "5", codeBarre: "BC-2026-005", groupeSanguin: "O+", statut: "EXPIRED", emplacement: "Zone de Quarantaine", volumeMl: 460, notes: "Date limite de conservation des globules rouges dépassée (42 jours). Fiche d'élimination à remplir." }
];

export default function BloodTrackDashboard() {
  const [recherche, setRecherche] = useState("");
  const [pocheActive, setPocheActive] = useState(null);

  // Filtrage des poches en temps réel selon la saisie
  const pochesFiltrees = useMemo(() => {
    const terme = recherche.toLowerCase().trim();
    if (!terme) return INITIAL_POCHES;

    return INITIAL_POCHES.filter(poche => 
      poche.codeBarre.toLowerCase().includes(terme) ||
      poche.groupeSanguin.toLowerCase().includes(terme) ||
      poche.statut.toLowerCase().includes(terme) ||
      poche.notes.toLowerCase().includes(terme)
    );
  }, [recherche]);

  const obtenirCouleurStatut = (statut) => {
    const configs = {
      'PRELEVE': { bg: '#fff3cd', text: '#856404' },
      'ANALYSE': { bg: '#cce5ff', text: '#004085' },
      'STOCKÉ': { bg: '#d4edda', text: '#155724' },
      'DISTRIBUÉ': { bg: '#e2e3e5', text: '#383d41' },
      'EXPIRED': { bg: '#f8d7da', text: '#721c24' }
    };
    return configs[statut] || { bg: '#f8f9fa', text: '#212529' };
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* En-tête de la plateforme */}
      <header style={{ borderBottom: '2px solid #dc3545', paddingBottom: '15px', marginBottom: '30px' }}>
        <h1 style={{ margin: 0, color: '#dc3545', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🩸 BloodTrack
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>Mic13 — Plateforme de facilité Transfusion & Suivi des Flux Sanguins</p>
      </header>

      {/* Barre de Recherche Dynamique */}
      <div style={{ marginBottom: '25px' }}>
        <input
          type="text"
          placeholder="Rechercher par Code-barres, Groupe (ex: O-), Statut (ex: STOCKÉ) ou mot-clé..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          style={{
            width: '100%', padding: '14px 16px', fontSize: '16px', 
            borderRadius: '8px', border: '1px solid #ced4da', outline: 'none',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.075)'
          }}
        />
      </div>

      {/* État vide si aucun résultat */}
      {pochesFiltrees.length === 0 && (
        <p style={{ color: '#6c757d', textAlign: 'center', marginTop: '40px', fontStyle: 'italic' }}>
          Aucune poche de sang ne correspond à votre recherche "{recherche}".
        </p>
      )}

      {/* Grille des Poches de Sang */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {pochesFiltrees.map((poche) => {
          const badge = obtenirCouleurStatut(poche.statut);
          return (
            <div
              key={poche.id}
              onClick={() => setPocheActive(poche)}
              style={{
                backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '8px',
                padding: '20px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc3545' }}>{poche.groupeSanguin}</span>
                <span style={{
                  fontSize: '11px', fontWeight: 'bold', color: badge.text,
                  backgroundColor: badge.bg, padding: '4px 8px', borderRadius: '4px',
                  border: `1px solid ${badge.text}30`
                }}>{poche.statut}</span>
              </div>
              <div style={{ fontSize: '13px', color: '#495057' }}>
                <p style={{ margin: '0 0 6px 0' }}><strong>ID Transfusion:</strong> {poche.codeBarre}</p>
                <p style={{ margin: '0 0 6px 0' }}><strong>Volume:</strong> {poche.volumeMl} ml</p>
                <p style={{ margin: 0 }}><strong>Stockage:</strong> {poche.emplacement}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fenêtre Modale de Traçabilité */}
      {pocheActive && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', 
          alignItems: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => setPocheActive(null)}>
          <div style={{ 
            backgroundColor: '#fff', borderRadius: '8px', width: '100%', 
            maxWidth: '550px', padding: '25px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' 
          }} onClick={(e) => e.stopPropagation()}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#212529' }}>Fiche Médicale de Traçabilité</h3>
              <button onClick={() => setPocheActive(null)} style={{ border: 'none', background: 'transparent', fontSize: '20px', cursor: 'pointer', color: '#6c757d' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px' }}>
              <p><strong>Code Unique Identifiant :</strong> {pocheActive.codeBarre}</p>
              <p><strong>Groupe Sanguin :</strong> <span style={{ color: '#dc3545', fontWeight: 'bold' }}>{pocheActive.groupeSanguin}</span></p>
              <p><strong>Volume Collecté :</strong> {pocheActive.volumeMl} ml</p>
              <p><strong>Localisation en Temps Réel :</strong> {pocheActive.emplacement}</p>
              
              <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '6px', borderLeft: '4px solid #dc3545' }}>
                <strong>Historique Clinique & Remarques :</strong>
                <p 
                  style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#495057', lineHeight: '1.5' }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pocheActive.notes) }}
                />
              </div>
            </div>

            <button 
              onClick={() => setPocheActive(null)} 
              style={{ 
                marginTop: '25px', width: '100%', padding: '12px', border: 'none', 
                backgroundColor: '#dc3545', color: '#fff', borderRadius: '6px', 
                cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' 
              }}
            >
              Fermer le Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
