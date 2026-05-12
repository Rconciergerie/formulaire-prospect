/* ============================================================
   FORMULAIRE PROSPECT — R Conciergerie
   Logique : collecte des réponses, validation, envoi email
   ============================================================ */

/* ── COLLECTE DES RÉPONSES ── */
function collectAnswers() {
  var get = function(id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };
  var getSel = function(id) {
    var el = document.getElementById(id);
    return (el && el.value) ? el.options[el.selectedIndex].text : '—';
  };
  var getRadio = function(name) {
    var el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.closest('label').querySelector('span').textContent.trim() : '—';
  };
  var getChecks = function(name) {
    var els = document.querySelectorAll('input[name="' + name + '"]:checked');
    return els.length ? Array.from(els).map(function(cb) {
      var span = cb.closest('label').querySelector('span');
      return span ? span.textContent.trim() : cb.value;
    }).join(', ') : '—';
  };
  return {
    nom:           get('f-nom')              || '—',
    tel:           get('f-tel')              || '—',
    email:         get('f-email')            || '—',
    ville:         get('f-ville')            || '—',
    cp:            get('f-cp')               || '—',
    type:          getSel('f-type'),
    surface:       get('f-surface')   ? get('f-surface')   + ' m²'      : '—',
    couchages:     get('f-couchages') ? get('f-couchages') + ' personnes': '—',
    etat:          getSel('f-etat'),
    photos:        getSel('f-photos'),
    annonce:       getSel('f-annonce'),
    experience:    getRadio('experience'),
    objectifs:     getChecks('obj'),
    declencheur:   get('f-declencheur')      || '—',
    criteres:      getChecks('critere'),
    criteresAutre: get('f-criteres-autre')   || '—',
    statut:        getRadio('statut'),
    copro:         getRadio('copro'),
    numero:        getRadio('numero'),
    jours:         getChecks('jour'),
    tranches:      getChecks('tranche'),
  };
}

/* ── FORMATAGE DU MESSAGE ── */
function formatEmail(d) {
  return 'Bonjour Vincent,\n\n'
    + 'Veuillez trouver ci-dessous mes réponses au formulaire R Conciergerie.\n\n'
    + '═══════════════════════════════\n'
    + '  COORDONNÉES\n'
    + '═══════════════════════════════\n'
    + 'Nom / Prénom    : ' + d.nom + '\n'
    + 'Téléphone       : ' + d.tel + '\n'
    + 'Email           : ' + d.email + '\n\n'
    + '═══════════════════════════════\n'
    + '  LE LOGEMENT\n'
    + '═══════════════════════════════\n'
    + 'Ville           : ' + d.ville + ' (' + d.cp + ')\n'
    + 'Type            : ' + d.type + '\n'
    + 'Surface         : ' + d.surface + '\n'
    + 'Capacité        : ' + d.couchages + '\n'
    + 'État            : ' + d.etat + '\n'
    + 'Photos          : ' + d.photos + '\n'
    + 'Déjà en ligne   : ' + d.annonce + '\n\n'
    + '═══════════════════════════════\n'
    + '  MON PROJET\n'
    + '═══════════════════════════════\n'
    + 'Situation actuelle   : ' + d.experience + '\n'
    + 'Motivations          : ' + d.objectifs + '\n'
    + 'Pourquoi maintenant  : ' + d.declencheur + '\n\n'
    + '═══════════════════════════════\n'
    + '  CE QUI COMPTE POUR MOI\n'
    + '═══════════════════════════════\n'
    + 'Mes priorités    : ' + d.criteres + '\n'
    + 'Autre            : ' + d.criteresAutre + '\n\n'
    + '═══════════════════════════════\n'
    + '  POINTS ADMINISTRATIFS\n'
    + '═══════════════════════════════\n'
    + 'Statut logement      : ' + d.statut + '\n'
    + 'Copropriété          : ' + d.copro + '\n'
    + 'Déclaration mairie   : ' + d.numero + '\n\n'
    + '═══════════════════════════════\n'
    + '  DISPONIBILITÉS POUR L\'ÉCHANGE\n'
    + '═══════════════════════════════\n'
    + 'Jours disponibles  : ' + d.jours + '\n'
    + 'Tranches horaires  : ' + d.tranches + '\n\n'
    + '─────────────────────────────\n'
    + 'Envoyé via le formulaire R Conciergerie\n';
}

/* ── VALIDATION ── */
function valider() {
  var manquants = [];

  /* Efface les erreurs précédentes */
  document.querySelectorAll('.field-error').forEach(function(el) {
    el.classList.remove('field-error');
  });
  document.querySelectorAll('.group-error').forEach(function(el) {
    el.classList.remove('group-error');
  });

  /* Vérifie un champ texte/select et le marque en rouge si vide */
  function checkField(id, label) {
    var el = document.getElementById(id);
    if (!el || !el.value.trim()) {
      manquants.push(label);
      if (el) el.classList.add('field-error');
    }
  }

  /* Vérifie un groupe radio et encadre en rouge si aucun coché */
  function checkRadio(name, label) {
    if (!document.querySelector('input[name="' + name + '"]:checked')) {
      manquants.push(label);
      var first = document.querySelector('input[name="' + name + '"]');
      if (first) first.closest('.badge-row').classList.add('group-error');
    }
  }

  /* Vérifie un groupe checkbox et encadre en rouge si aucun coché */
  function checkCheckboxes(name, label) {
    if (!document.querySelector('input[name="' + name + '"]:checked')) {
      manquants.push(label);
      var first = document.querySelector('input[name="' + name + '"]');
      if (first) {
        var row = first.closest('.badge-row')
               || first.closest('.days-row')
               || first.closest('.slots-row');
        if (row) row.classList.add('group-error');
      }
    }
  }

  /* Champs texte / select */
  checkField('f-nom',         'Prénom et nom');
  checkField('f-tel',         'Téléphone');
  checkField('f-email',       'Adresse email');
  checkField('f-ville',       'Ville');
  checkField('f-cp',          'Code postal');
  checkField('f-type',        'Type de logement');
  checkField('f-surface',     'Surface');
  checkField('f-couchages',   'Capacité d\'accueil');
  checkField('f-etat',        'État du logement');
  checkField('f-photos',      'Photos du logement');
  checkField('f-annonce',     'Logement déjà en ligne');
  checkField('f-declencheur', 'Pourquoi maintenant');

  /* Groupes radio */
  checkRadio('experience', 'Situation actuelle');
  checkRadio('statut',     'Statut du logement');
  checkRadio('copro',      'Copropriété');
  checkRadio('numero',     'Déclaration mairie');

  /* Groupes cases à cocher (au moins une requise) */
  checkCheckboxes('obj',     'Motivations principales');
  checkCheckboxes('critere', 'Priorités de choix');
  checkCheckboxes('jour',    'Jours disponibles');
  checkCheckboxes('tranche', 'Tranches horaires');

  /* "Autre critère" : toujours facultatif */

  return manquants;
}

/* ── EFFACEMENT DU ROUGE EN TEMPS RÉEL ── */
function initClearOnFix() {

  /* Champs texte / select : efface l'erreur dès qu'une valeur est saisie */
  var champIds = ['f-nom','f-tel','f-email','f-ville','f-cp','f-type',
                  'f-surface','f-couchages','f-etat','f-photos','f-annonce','f-declencheur'];
  champIds.forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  function() { el.classList.remove('field-error'); });
    el.addEventListener('change', function() { el.classList.remove('field-error'); });
  });

  /* Radios : efface le contour rouge du groupe dès qu'un choix est fait */
  ['experience','statut','copro','numero'].forEach(function(name) {
    document.querySelectorAll('input[name="' + name + '"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        var row = radio.closest('.badge-row');
        if (row) row.classList.remove('group-error');
      });
    });
  });

  /* Cases à cocher : efface le contour rouge du groupe dès qu'une case est cochée */
  ['obj','critere','jour','tranche'].forEach(function(name) {
    document.querySelectorAll('input[name="' + name + '"]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        if (document.querySelector('input[name="' + name + '"]:checked')) {
          var row = cb.closest('.badge-row')
                 || cb.closest('.days-row')
                 || cb.closest('.slots-row');
          if (row) row.classList.remove('group-error');
        }
      });
    });
  });
}

/* Lance les écouteurs au chargement de la page */
document.addEventListener('DOMContentLoaded', initClearOnFix);

/* ── ENVOI PAR EMAIL ── */
function sendByEmail() {
  var btn      = document.getElementById('btn-send');
  var btnIcon  = document.getElementById('btn-icon');
  var btnTitle = document.getElementById('btn-title');
  var btnSub   = document.getElementById('btn-sub');
  var panelVal = document.getElementById('panel-validation');
  var listeEl  = document.getElementById('validation-liste');

  /* Validation — marque les champs vides en rouge */
  var manquants = valider();
  if (manquants.length > 0) {
    if (panelVal) {
      listeEl.textContent = manquants.join(' · ');
      panelVal.style.display = 'block';
      panelVal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  if (panelVal) panelVal.style.display = 'none';

  /* Empêche les doubles clics */
  btn.disabled = true;

  var d              = collectAnswers();
  var subject        = 'Mon projet de location — ' + d.nom;
  var text           = formatEmail(d);
  var encodedSubject = encodeURIComponent(subject);

  /* Prépare les liens messagerie */
  document.getElementById('link-mailto').href =
    'mailto:vroy.conciergerie@gmail.com?subject=' + encodedSubject;
  document.getElementById('link-gmail').href =
    'https://mail.google.com/mail/?view=cm&to=vroy.conciergerie@gmail.com&su=' + encodedSubject;

  function onSuccess() {
    btn.classList.remove('btn-action-primary');
    btn.classList.add('btn-action-success');
    btnIcon.textContent  = '✅';
    btnTitle.textContent = 'Réponses copiées !';
    btnSub.textContent   = 'Ouvrez votre messagerie ci-dessous et collez vos réponses (Ctrl+V ou ⌘+V).';
    document.getElementById('panel-links').style.display = 'block';
  }

  function onFailure() {
    btn.classList.remove('btn-action-primary');
    btn.classList.add('btn-action-warning');
    btnIcon.textContent  = '⚠️';
    btnTitle.textContent = 'La copie automatique n\'a pas fonctionné';
    btnSub.textContent   = 'Sélectionnez et copiez le texte ci-dessous, puis ouvrez votre messagerie.';
    var ta = document.getElementById('fallback-text');
    ta.value = text;
    document.getElementById('panel-failure').style.display = 'block';
    ta.focus();
    ta.select();
    document.getElementById('panel-links').style.display = 'block';
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(onFailure);
  } else {
    onFailure();
  }
}
