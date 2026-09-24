'use client';

import React, { useMemo, useState } from 'react';

const MANUELS = [
  {
    id: 'charleroi',
    titre: 'Manuel de sélection médicale des donneurs — ETS Charleroi',
    texte: `DOCUMENT 1 — QUESTIONS DE SÉLECTION (Q1 À Q47)

Q1: Transfusé au cours de votre vie? (Ajournement temporaire ou définitif selon ligne)
Q2: Reçu une greffe/allogreffe au cours de votre vie? (Définitif si SNC, cornée, dure-mère, organes)
Q3: Subi une opération lourde du cerveau ou de la moelle épinière? (Définitif - Prions)
Q4: Subi une opération lourde du cœur? (Définitif - Protection donneur)
Q5: Troubles cardiaques sévères ou cardiopathie symptomatique? (Définitif)
Q6: Diabète sous insuline / insulinodépendant? (Définitif)
Q7: Souffrez-vous d'une affection thyroïdienne (hyperthyïdie avec goitre/nodules, thyroïdite) ? (Ajournement 1 mois après guérison ou arrêt antithyroïdiens / iode radioactif)
Q8: Cancer, pathologie maligne ou maladie du sang (Leucémie, Lymphome)? (Définitif)
Q9: Hémochromatose? (Autorisé sous protocole MED-SEM-FO-04A/B, max 6x/an)
Q10: Troubles neurologiques ou psychiatriques sévères? (Définitif - Consentement non fiable)
Q11: Souffrez-vous d'asthme ? (Écartement 1 semaine après la dernière crise et rétablissement complet)
Q12: Souffrez-vous de bronchite aiguë ? (Écartement 2 semaines selon l'état général et l'étiologie)
Q13: Avez-vous des antécédents d'embolie pulmonaire isolée sans séquelles ? (Écartement 6 mois après arrêt de tout R/)
Q14: Êtes-vous suivi pour une sarcoïdose pulmonaire ? (Autorisé si attestation de guérison complète sans R/, DEFINITIF si récidives)
Q15: Pris des hormones de croissance humaines avant 1989? (Définitif - Maladie de Creutzfeldt-Jakob)
Q16: Avez-vous eu un épisode de gastro-entérite récente ? (48h après fin des symptômes si non fébrile, 2 semaines si fébrile)
Q17: Présentez-vous ou avez-vous présenté un ictère (jaunisse) non documenté ? (Provisoire, attente bilan, lookback 1 an)
Q18: Consommé de la drogue par voie nasale (snif) les 12 derniers mois? (Ajournement 12 mois)
Q19: Êtes-vous traité pour une colite néphrétique ? (15 jours en période de crise, autorisé si asymptomatique)
Q20: Reçu un vaccin ou débuté une désensibilisation ce mois-ci? (Inactivé: OK, Atténué: 4 semaines, Covid avec symptômes: 7 jours)
Q21: Souffrez-vous de migraines ou céphalées ? (Autorisé en dehors des crises si R/ non contre-indiqué)
Q22: Hospitalisé ou opéré au cours des 4 derniers mois? (Ajournement 4 mois)
Q23: Avez-vous des antécédents de convulsions fébriles dans l'enfance ? (Autorisé si convulsions dues à l'hyperthermie dans l'enfance)
Q24: Fait un tatouage, piercing, maquillage permanent ou dé-tatouage les 4 derniers mois? (Ajournement 4 mois)
Q25: Reçu des soins d'acupuncture par un non-médecin ou avec aiguilles réutilisables les 4 derniers mois? (Ajournement 4 mois)
Q26: Avez-vous subi une infiltration intra-articulaire ou une péridurale antalgique ? (Infiltration: autorisé selon étiologie. Péridurale: 15 jours)
Q27: Souffrez-vous d'une maladie osseuse comme la maladie de Paget ? (Autorisé si asymptomatique, DEFINITIF si complications)
Q28: Perdu plus de 5 kg sans raison récemment (perte de poids inexpliquée)? (Écartement temporaire, bilan requis)
Q29: Eu la grippe ou un état fébrile > 38° au cours des 2 dernières semaines? (Ajournement 2 semaines)
Q30: Allé chez le dentiste au cours des 7 derniers jours (Détartrage, extraction)? (Ajournement 7 jours pour soins majeurs, 24h pour carie)
Q31: Êtes-vous sujet à des crises d'épistaxis (saignements de nez) répétitives ? (Autorisé, vigilance taux d'hémoglobine)
Q32: Été mordu par une tique ce mois-ci? (Ajournement 3 mois si érythème migrant, 30 jours si morsure < 15 jours)
Q33: Présentez-vous des lésions d'herpès labial (bouton de fièvre) ou génital ? (Labial: jusqu'à assèchement. Génital: 2 semaines après guérison)
Q34: Êtes-vous atteint d'une dermatose étendue (Eczéma étendu, Psoriasis étendu) ? (Temporaire jusqu'à guérison pour éviter le risque de surinfection)
Q35: Séjourné plus de 6 mois cumulés au Royaume-Uni entre 1980 et 1996? (Définitif - Variante de la maladie de Creutzfeldt-Jakob)
Q36: Voyagé ou séjourné en dehors de la Belgique (minimum 48h) au cours des 6 derniers mois? (Délai selon zone: Malaria 4 mois, Chagas 6 mois/28j, Zika 28j)
Q37: Nouveau partenaire sexuel ou partenaire occasionnel au cours des 4 derniers mois? (Ajournement 4 mois)
Q38: Rapport sexuel avec une personne touchée par une IST (Syphilis, Gonococcie, Chlamydia)? (Ajournement 4 mois)
Q39: Avez-vous des antécédents de Rhumatismes Articulaires Aigus (RAA) ? (2 ans après guérison si sans atteinte cardiaque, DEFINITIF si atteinte cardiaque)
Q40: Avez-vous récemment fait l'objet d'une biopsie ? (Superficielle: 1 semaine en attente anapath. Profonde: 4 mois, lookback infectieux)
Q41: Rapports sexuels tarifés (échange d'argent/biens/services) les 12 derniers mois? (Ajournement 12 mois)
Q42: Partenaires sexuels multiples sur une même période au cours des 12 derniers mois? (Ajournement 12 mois)
Q43: Participation à du sexe en groupe au cours des 12 derniers mois? (Ajournement 12 mois)
Q44: Avez-vous une allergie aiguë active (Urticaire, œdème de Quincke) ? (1 semaine accomplie après la fin des symptômes. DEFINITIF si angioedème héréditaire)
Q45: Pour les femmes, accouché au cours des 6 derniers mois ou allaitement en cours? (Ajournement 6 mois après accouchement, temporaire si allaitement exclusif)
Q46: Pour les femmes, fait une fausse couche ou une IVG au cours des 6 derniers mois? (Ajournement 6 mois)
Q47: Pour les femmes, rapport sexuel avec un homme qui a des rapports sexuels avec des hommes (HSH)? (Ajournement 4 mois)

CRITÈRES GÉNÉRAUX
Âge minimum: 18 ans. Premier don jusqu'à la veille du 66ème anniversaire. Poids minimum légal: 50 kg. Hémoglobine STHO: >= 12,5 g/dl pour les femmes et >= 13,5 g/dl pour les hommes. Délai entre deux dons de sang total: 2 mois minimum, paramétré à 62 jours.`,
  },
  {
    id: 'medicaments',
    titre: 'Liste complète des médicaments et durées d’exclusion — DonDeSang.be',
    texte: `DOCUMENT 2 — MÉDICAMENTS ET CONTRE-INDICATIONS

Les délais commencent le jour suivant la dernière dose. Contre-indication au don de plaquettes pendant 3 jours pour Asaflow, Aspirine, Cardio-aspirine, Anti-inflammatoires non stéroïdiens (AINS) systémiques. Exclusion définitive pour Insuline, Chimiothérapie antitumorale, Hormone de croissance humaine avant 1989. Exclusion de 3 ans pour Acitrétine (Neotigason), Étrétinate (Tegison) et antiépileptiques prescrits pour épilepsie (Acide valproïque/Dépakine, carbamazépine/Tegretol, topiramate/Topamax). Exclusion de 2 ans pour Léflunomide (Arava), Tériflunomide (Aubagio) et Rituximab. Exclusion de 6 mois pour Dutastéride (Avodart, Combodart, Prostatex), Méthotrexate, Azathioprine (Imuran, Imurel), Ciclosporine (Néoral, Sandimmun), Tacrolimus (Prograf), Sirolimus, Évérolimus, Mycophénolate mofétil (CellCept) et Anticorps monoclonaux (Aimovig, Repatha, Humira). Exclusion de 3 mois pour Hydroxychloroquine (Plaquenil) et Clomifène (Clomid). Exclusion de 1 mois pour Isotrétinoïne (Roaccutane, Isosupra, Isocural), Finastéride (Proscar, Propecia), Lithium, Camcolit, Maniprex, Priadel, Strumazol, Thyrozol. Exclusion de 2 semaines pour Cortisone per os/injection (Jorveza, budésonide). Exclusion de 7 jours pour les Antibiotiques (guérison complète requise). Exclusion de 12h pour Vermox.`,
  },
  {
    id: 'pays',
    titre: 'Grille géographique des pays et délais d’écartement',
    texte: `DOCUMENT 3 — PAYS À RISQUES INFECTIEUX

Séjour de minimum 48 heures. Risque Chagas (Amérique Latine continentale): 6 mois si plein air/camping/habitation précaire ou durée > 3 mois; 28 jours si hôtel ou courte durée < 3 mois. Risque West Nile Virus (WNV): du 1er juillet au 30 novembre, écartement de 28 jours après le retour. Grille fixe: AFGHANISTAN, AFRIQUE DU SUD, ANGOLA, BANGLADESH, BENIN, BHOUTAN, BIRMANIE, BOTSWANA, BURKINA FASO, BURUNDI, CAMBODGE, CAMEROUN, COMORES, CONGO, COREE NORD, COREE SUD, DJIBOUTI, DOMINICAINE (Rép), EGYPTE (El Fayoum), ERYTHREE, ETHIOPIE, GABON, GAMBIE, GHANA, GUINEE, GUINEE EQUATORIALE, GUINEE BISSAU, HAITI, HAUTE-VOLTA, HAWAI, INDE, INDONESIE, IRAK, IRAN, KENYA, LAOS, LESOTHO, LIBERIA, MADAGASCAR, MALAISIE, MALAWI, MALI, MAURITANIE, MOZAMBIQUE, NAMIBIE, NEPAL, NIGER, NIGERIA, OUGANDA, PAKISTAN, PAPOUASIE, PHILIPPINES, RDC, RWANDA, SENEGAL, SIERRA LEONE, SOMALIE, SOUDAN, TANZANIE, TCHAD, THAILANDE, TOGO, TURQUIE (sud-est), VIETNAM, YEMEN, ZAMBIE, ZIMBABWE (Risque Paludisme: STHO = 4 mois, PLASMA = 28j, PLQT = 6 mois). ARGENTINE, BOLIVIE, BRESIL, COLOMBIE, COSTA RICA, EQUATEUR, GUATEMALA, GUYANE, HONDURAS, MEXIQUE, NICARAGUA, PANAMA, PARAGUAY, PEROU, SALVADOR, VENEZUELA (Risque Chagas, voir critères). ANGUILLA, BAHAMAS, BARBADE, CARAIBES, CUBA, CURACAO, GUADELOUPE, MARTINIQUE, REUNION, SAINT MARTIN, SINGAPOUR, TAHITI, TAIWAN (Risque Tropical/Zika/Dengue: 28 jours). CANADA, ETATS-UNIS, USA, RUSSIE, UKRAINE (Risque WNV: 28 jours).`,
  },
];

const normaliser = (texte) => texte.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase();
const echapperRegex = (texte) => texte.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');

function Surligner({ texte, terme }) {
  if (!terme) return <>{texte}</>;
  return texte.split(new RegExp(`(${echapperRegex(terme)})`, 'ig')).map((partie, index) => normaliser(partie) === normaliser(terme) ? <mark key={index}>{partie}</mark> : <React.Fragment key={index}>{partie}</React.Fragment>);
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
      <p>Recherche plein texte dans les paragraphes bruts des trois documents ; les occurrences sont surlignées dans le paragraphe exact.</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input value={recherche} onChange={(e) => setRecherche(e.target.value)} placeholder="Rechercher hémoglobine, Asaflow, paludisme, Q47…" style={{ flex: 1, minWidth: 280, padding: 11 }} />
        <select value={filtre} onChange={(e) => setFiltre(e.target.value)} style={{ padding: 11 }}><option value="tous">Tous les documents</option>{MANUELS.map((manuel) => <option key={manuel.id} value={manuel.id}>{manuel.titre}</option>)}</select>
      </div>
      {recherche.trim() && <p><strong>{resultats.length}</strong> paragraphe(s) trouvé(s).</p>}
      {resultats.map(({ manuel, texte, index }) => <article key={`${manuel.id}-${index}`} style={{ marginTop: 14, padding: 18, border: '1px solid #dee2e6', borderRadius: 8 }}><small>{manuel.titre}</small><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}><Surligner texte={texte} terme={recherche.trim()} /></p></article>)}
      {recherche.trim() && !resultats.length && <p>Aucun paragraphe correspondant.</p>}
    </section>
    <footer style={{ marginTop: 30, color: '#6c757d' }}>SanPass — outil de consultation. Toute décision clinique doit être prise par un professionnel habilité sur la base des versions réglementaires validées.</footer>
  </main>;
}
