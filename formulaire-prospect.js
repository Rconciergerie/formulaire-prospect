/* ============================================================
   FORMULAIRE PROSPECT — R Conciergerie
   Logique : collecte des réponses, envoi email, copie presse-papier
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
      return cb.closest('label').querySelector('span').textContent.trim();
    }).join(', ') : '—';
  };
  return {
    nom:           get('f-nom')            || '—',
    tel:           get('f-tel')            || '—',
    email:         get('f-email')          || '—',
    ville:         get('f-ville')          || '—',
    cp:            get('f-cp')             || '—',
    type:          getSel('f-type'),
    surface:       get('f-surface') ? get('f-surface') + ' m²' : '—',
    couchages:     get('f-couchages') ? get('f-couchages') + ' personnes' : '—',
    etat:          getSel('f-etat'),
    photos:        getSel('f-photos'),
    annonce:       getSel('f-annonce'),
    experience:    getRadio('experience'),
    objectifs:     getChecks('obj'),
    declencheur:   get('f-declencheur')    || '—',
    criteres:      getChecks('critere'),
    criteresAutre: get('f-criteres-autre') || '—',
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

/* ── ENVOI PAR EMAIL ── */
function sendByEmail() {
  var btn      = document.getElementById('btn-send');
  var btnIcon  = document.getElementById('btn-icon');
  var btnTitle = document.getElementById('btn-title');
  var btnSub   = document.getElementById('btn-sub');

  /* Empêche les doubles clics */
  btn.disabled = true;

  var d       = collectAnswers();
  var subject = 'Mon projet de location — ' + d.nom;
  var text    = formatEmail(d);
  var encodedSubject = encodeURIComponent(subject);

  /* Prépare les liens messagerie */
  document.getElementById('link-mailto').href =
    'mailto:vroy.conciergerie@gmail.com?subject=' + encodedSubject;
  document.getElementById('link-gmail').href =
    'https://mail.google.com/mail/?view=cm&to=vroy.conciergerie@gmail.com&su=' + encodedSubject;

  function onSuccess() {
    /* Bouton → état succès */
    btn.classList.remove('btn-action-primary');
    btn.classList.add('btn-action-success');
    btnIcon.textContent  = '✅';
    btnTitle.textContent = 'Réponses copiées !';
    btnSub.textContent   = 'Ouvrez votre messagerie ci-dessous et collez vos réponses (Ctrl+V ou ⌘+V).';

    /* Affiche les liens */
    document.getElementById('panel-links').style.display = 'block';
  }

  function onFailure() {
    /* Bouton → état échec */
    btn.classList.remove('btn-action-primary');
    btn.classList.add('btn-action-warning');
    btnIcon.textContent  = '⚠️';
    btnTitle.textContent = 'La copie automatique n\'a pas fonctionné';
    btnSub.textContent   = 'Sélectionnez et copiez le texte ci-dessous, puis ouvrez votre messagerie.';

    /* Affiche le texte à copier manuellement */
    var ta = document.getElementById('fallback-text');
    ta.value = text;
    document.getElementById('panel-failure').style.display = 'block';
    ta.focus();
    ta.select();

    /* Affiche les liens */
    document.getElementById('panel-links').style.display = 'block';
  }

  /* Tentative copie presse-papier */
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch(onFailure);
  } else {
    onFailure();
  }
}
