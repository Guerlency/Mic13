'use client';

import React, { useMemo, useState } from 'react';

const MANUELS = [
  {
    id: 'charleroi',
    titre: 'Manuel de sélection médicale des donneurs — ETS Charleroi',
    texte: `DOCUMENT 1 — MANUEL DE SÉLECTION MÉDICALE DES DONNEURS (ETS CHARLEROI)

PREAMBULE
Ce manuel est destiné aux personnes formées et habilitées au poste de « Sélection Médicale des Donneurs » de l’ETS La Transfusion du Sang de Charleroi, dont la procédure est décrite dans MED-SEM-SO-010. L’expression « Médecin habilité au poste de sélection médicale » désigne le médecin ayant suivi la formation spécifique à l’évaluation médicale des donneurs. L’expression générale « Personnel qualifié habilité à la sélection médicale » englobe à la fois ce médecin habilité et les autres professionnels de santé autorisés et formés à ce poste (infirmiers, sage-femmes, dentistes, psychologues et ergothérapeutes). Ce manuel est basé sur la loi du 05/07/1994, l’arrêté Royal du 04/04/1996 et les bonnes pratiques. À la fin de l’entretien médical, le personnel habilité décide si le donneur est éligible, temporairement ou définitivement écarté, ou si seuls des échantillons sont prélevés. Les listes de pays à risques infectieux et de médicaments sont référencées respectivement par MED-SEM-LI-02A et MED-SEM-LI-01G.

CRITERES GENERAUX D’ACCEPTATION (ÉLIGIBILITE)
Codes ETS : STHO — Sang total homologue ; PLAS — Plasma ; PQPL — Plaquettes.
Tout donneur doit être informé que le don est bénévole et volontaire, fournir son consentement éclairé, que le don dirigé est interdit par la Loi et que le don est anonyme.

ÂGE
Le don de sang est autorisé à partir de 18 ans. Un premier don ne peut s’effectuer que jusqu’à la veille du 66ème anniversaire. Les donneurs réguliers peuvent être prolongés après 66 ans si leur dernier don ne remonte pas à plus de 3 ans et si leur état de santé est satisfaisant. Le système EdgeBlood ajoute l’antécédent 0AGE lorsque ces critères ne sont pas respectés. Don de cellules souches hématopoïétiques : inscription de 18 à 39 ans inclus (40 ans non inclus) ; don de 18 à 60 ans.

POIDS
Le poids minimum légal est de 50 kg. Chez la femme, une femme de 50 kg doit mesurer minimum 1m53 pour être éligible selon l’abaque poids/taille et le volume sanguin total. Chez l’homme, 450 ml peuvent être prélevés si la taille est >= 1m50 et 420 ml si la taille est <= 1m50. Un prélèvement inférieur peut être choisi en cas de stress, anxiété, tension artérielle faible ou régime.

SANG TOTAL (STHO)
Un don est accepté si l’hémoglobine du dernier don datant de moins de 3 ans est >= 12,5 g/dl pour les femmes et >= 13,5 g/dl pour les hommes. Fréquence maximale : 4 fois par an. Délai entre deux dons : 2 mois minimum ; EdgeBlood rend le donneur inéligible pendant 62 jours. Le volume ne peut dépasser 500 ml, et reste inférieur à 32 ml/kg par an et à 13 % du volume sanguin total estimé ; les prélèvements sont paramétrés à 420 ou 450 ml.

PLASMA ET PLAQUETTES EN APHERESE
Le premier don de plasma ou de plaquettes est accepté si le donneur a déjà fait un don de STHO. Les protéines totales sont contrôlées chaque année et doivent être entre 60 et 100 g/l. Les plaquettes doivent être entre 100 et 450 µl sans signe clinique associé (hématome, ecchymose ou saignement). Les dons sont techniquement impossibles jusqu’à normalisation du taux. Références : LAB-GEN-SO-04M et LAB-GEN-LI-04M.

QUESTIONS D’ELIGIBILITE
Q1 à Q47 : les questions et réponses doivent être consultées dans la version réglementaire validée du manuel avant toute décision clinique.`,
  },
  {
    id: 'medicaments',
    titre: 'Liste médicaments et contre-indications aux dons de PSL — DonDeSang.be',
    texte: `DOCUMENT 2 — LISTE DES MÉDICAMENTS ET DURÉES D’EXCLUSION

Aspirine / Asaflow : exclusion du don de plaquettes pendant 3 jours après la prise. Les durées d’exclusion doivent être appliquées selon la version réglementaire validée de DonDeSang.be et confirmées par le personnel habilité.`,
  },
  {
    id: 'pays',
    titre: 'Pays à risques infectieux et délais d’écartement',
    texte: `DOCUMENT 3 — GRILLE DES PAYS

La grille exhaustive des pays et les délais d’écartement pour le paludisme, la maladie de Chagas et le virus West Nile doivent être importés depuis la version réglementaire validée MED-SEM-LI-02A. Ne pas déduire un délai à partir de cette interface : la décision relève du personnel médical habilité.`,
  },
];

const normaliser = (s) => s.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
const echapper = (s) => s.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');

function Surligner({ texte, terme }) {
  if (!terme) return <>{texte}</>;
  return texte.split(new RegExp(`(${echapper(terme)})`, 'ig')).map((partie, i) => normaliser(partie) === normaliser(terme) ? <mark key={i}>{partie}</mark> : <React.Fragment key={i}>{partie}</React.Fragment>);
}

export default function SanPassDashboard() {
  const [recherche, setRecherche] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const resultats = useMemo(() => {
    const terme = normaliser(recherche.trim());
    if (!terme) return [];
    return MANUELS.flatMap((manuel) => manuel.texte.split(/\\n\\s*\\n/).map((texte, index) => ({ manuel, texte, index })))
      .filter(({ manuel, texte }) => (filtre === 'tous' || manuel.id === filtre) && normaliser(texte).includes(terme));
  }, [recherche, filtre]);

  return <main style={{ maxWidth: 1100, margin: '32px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
    <header style={{ borderBottom: '3px solid #dc3545', paddingBottom: 14, marginBottom: 24 }}>
      <h1 style={{ color: '#dc3545', margin: 0 }}>🩸 SanPass</h1>
      <p>L’écosystème connecté de l’éligibilité transfusionnelle</p>
    </header>
    <section>
      <h2>Console Médicale</h2>
      <p>Recherche plein texte dans les paragraphes des manuels indexés ; les occurrences sont surlignées dans le paragraphe exact.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher hémoglobine, 50 kg, Asaflow, paludisme…" style={{ flex: 1, minWidth: 280, padding: 11 }} />
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)} style={{ padding: 11 }}><option value="tous">Tous les documents</option>{MANUELS.map((m) => <option key={m.id} value={m.id}>{m.titre}</option>)}</select>
      </div>
      {recherche.trim() && <p><strong>{resultats.length}</strong> paragraphe(s) trouvé(s).</p>}
      {resultats.map(({ manuel, texte, index }) => <article key={`${manuel.id}-${index}`} style={{ marginTop: 14, padding: 18, border: '1px solid #dee2e6', borderRadius: 8 }}><small>{manuel.titre}</small><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}><Surligner texte={texte} terme={recherche.trim()} /></p></article>)}
      {recherche.trim() && !resultats.length && <p>Aucun paragraphe correspondant.</p>}
    </section>
    <footer style={{ marginTop: 30, color: '#6c757d' }}>SanPass — outil de consultation. Toute décision clinique doit être prise par un professionnel habilité sur la base des versions réglementaires validées.</footer>
  </main>;
}
