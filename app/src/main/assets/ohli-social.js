/* OHLI Social shell. Uses the existing authenticated RKM runtime through window.ohliRuntime. */
(function () {
  'use strict';

  var rt = window.ohliRuntime;
  if (!rt) { console.error('OHLI Social runtime bridge is unavailable.'); return; }

  var soundOn = true, reelCommentsId = null, reelMode = 'foryou', needGesture = false, avatarVer = Date.now();
  var icons = {
    play: '<path d="M7 4.5v15l13-7.5Z"/>', sound: '<path d="M4 9.5v5h4l5 4v-13l-5 4Z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>', mute: '<path d="M4 9.5v5h4l5 4v-13l-5 4Z"/><path d="m17 9.5 5 5M22 9.5l-5 5"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    video: '<rect x="3" y="5" width="13" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3Z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    story: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.3"/><circle cx="12" cy="12" r="1.5"/>',
    search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
    live: '<circle cx="12" cy="12" r="2.5"/><path d="M7 7a7 7 0 0 0 0 10M17 7a7 7 0 0 1 0 10M4 4a11.3 11.3 0 0 0 0 16M20 4a11.3 11.3 0 0 1 0 16"/>',
    chat: '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l.9-4.9A8.5 8.5 0 1 1 21 11.5Z"/><path d="M8 10h8M8 13.5h5"/>',
    contacts: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.3-3.2 2.4-5 6-5s5.7 1.8 6 5M17 8h4M19 6v4M17 15c2.1.4 3.4 1.8 3.7 4"/>',
    groups: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M2.8 20c.3-3.7 2.4-5.5 6.2-5.5s5.9 1.8 6.2 5.5M16 14.5c3.1.1 4.8 1.8 5.2 4.7"/>',
    channel: '<path d="M4 9v6M8 6l12-3v18L8 18M8 6v12M4 9H2v6h2M8 18l2 4h4l-3-4"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
    profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 2.4-2.4 2.4-2.5-1.4a7.9 7.9 0 0 1-2 .8l-.7 2.7h-3.4l-.7-2.7a7.9 7.9 0 0 1-2-.8l-2.5 1.4-2.4-2.4 1.4-2.5a7.9 7.9 0 0 1-.8-2L1.2 12v-3.4l2.7-.7a7.9 7.9 0 0 1 .8-2L3.3 3.4 5.7 1 8.2 2.4a7.9 7.9 0 0 1 2-.8L10.9-1h3.4l.7 2.7a7.9 7.9 0 0 1 2 .8l2.5-1.4 2.4 2.4-1.4 2.5a7.9 7.9 0 0 1 .8 2l2.7.7V12l-2.7.7a7.9 7.9 0 0 1-.9 2.3Z"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="8.5" cy="9" r="1.5"/><path d="m4 17 5-4 3.2 2.5 3.1-3 4.7 4"/>',
    send: '<path d="m21 3-7 18-4-7-7-4Z"/><path d="M21 3 10 14"/>',
    heart: '<path d="M20.8 8.8c0 5.1-8.8 11-8.8 11s-8.8-5.9-8.8-11A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.6Z"/>',
    comment: '<path d="M21 11.5a8.5 8.5 0 0 1-12.3 7.6L4 20l.9-4.9A8.5 8.5 0 1 1 21 11.5Z"/>',
    bookmark: '<path d="M6 4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4-6 4Z"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2"/>',
    arrow: '<path d="M5 12h14M13 5l7 7-7 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 14.1A8.5 8.5 0 0 1 9.9 3.5 8.6 8.6 0 1 0 20.5 14.1Z"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    userPlus: '<circle cx="9" cy="8" r="3"/><path d="M3 20c.3-3.5 2.3-5 6-5s5.7 1.5 6 5M19 8v6M16 11h6"/>',
    refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 6l2 1M4 17l2-1a7 7 0 0 0 12.5-3"/>',
    shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>'
  };
  function ico(name) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (icons[name] || icons.home) + '</svg>'; }
  function esc(value) { return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]); }); }
  function shortDate(value) { var d = new Date(Number(value) || value); if (isNaN(d.getTime())) return ''; var delta = Date.now() - d.getTime(); if (delta < 60000) return 'baru saja'; if (delta < 3600000) return Math.max(1, Math.floor(delta / 60000)) + ' mnt'; if (delta < 86400000) return Math.floor(delta / 3600000) + ' jam'; return d.toLocaleDateString('id-ID', {day:'numeric',month:'short'}); }
  function initial(name) { var words = String(name || 'OHLI').trim().split(/\s+/); return ((words[0] || 'O').charAt(0) + (words.length > 1 ? words[words.length - 1].charAt(0) : '')).toUpperCase(); }
  function avatar(name, phone, sizeClass) { var img = (phone && rt && rt.getToken && rt.getToken()) ? '<img src="/api/avatar?phone=' + encodeURIComponent(phone) + '&token=' + encodeURIComponent(rt.getToken()) + '&v=' + avatarVer + '" alt="" loading="lazy" onerror="this.remove()">' : ''; return '<span class="ohli-avatar ' + (sizeClass || '') + '" aria-hidden="true"><b>' + esc(initial(name || phone)) + '</b>' + img + '</span>'; }
  function empty(icon, title, description, actionLabel, action) { return '<div class="ohli-empty"><div class="ohli-empty-icon">' + ico(icon || 'home') + '</div><h3>' + esc(title) + '</h3><p>' + esc(description) + '</p>' + (actionLabel ? '<div style="margin-top:16px"><button type="button" class="ohli-btn ohli-btn-primary" data-action="' + esc(action || '') + '">' + esc(actionLabel) + '</button></div>' : '') + '</div>'; }

  var shell, pageContent, pageTitle, pageDescription, pageActions, nav, searchInput, toastBox, overlay, overlayContent;
  var page = 'home', lastSocialPage = 'home', pageQuery = '', archiveMode = 'archive', posts = [], nextBefore = 0, hasMore = false, users = [], statusList = [], groupItems = [], channelItems = [], notificationItems = [], profileTarget = '', profileData = null, openComments = {}, selectedFile = null, selectedStatusFile = null, videoObserver = null, storyIndex = 0, storyItems = [], theme = 'dark';
  var pageTitles = {create:['Buat konten','Pilih foto atau video, edit, lalu bagikan.'],home:['Beranda','Temukan kabar, video, dan percakapan dari orang yang kamu ikuti.'],videos:['Video pendek','Tonton satu per satu; video dijeda saat keluar dari layar.'],story:['Story & pembaruan','Cerita yang masih aktif dari akun yang boleh kamu lihat.'],explore:['Jelajahi','Cari pengguna dan postingan publik dari server.'],live:['Live','Siaran langsung yang sedang aktif di server.'],contacts:['Kontak','Temukan orang dan lanjutkan percakapan pribadi.'],groups:['Grup & komunitas','Temukan ruang komunitas dan kelola keanggotaan.'],channels:['Channels','Ikuti kanal pengumuman satu-ke-banyak.'],notifications:['Notifikasi','Aktivitas akun yang tersimpan di server.'],profile:['Profil','Informasi akun dan postingan yang dapat kamu lihat.'],settings:['Pengaturan','Kelola tampilan, akun, privasi, dan koneksi.'],archive:['Arsip & tersimpan','Kelola postingan yang diarsipkan dan koleksi pribadi.']};
  var navItems = [
    ['home','Beranda','home'],['videos','Video pendek','video'],['create','Buat konten','plus'],['story','Story','story'],['explore','Jelajahi','search'],['live','Live','live'],['chat','Chat','chat'],['contacts','Kontak','contacts'],['groups','Grup & komunitas','groups'],['channels','Channels','channel'],['notifications','Notifikasi','bell'],['archive','Arsip & tersimpan','bookmark'],['profile','Profil','profile'],['settings','Pengaturan','settings']
  ];

  function makeShell() {
    shell = document.createElement('section'); shell.id = 'ohliSocialShell'; shell.hidden = true; shell.setAttribute('aria-label','OHLI Social');
    shell.innerHTML = '<header class="ohli-topbar"><button type="button" class="ohli-brand" data-action="home" aria-label="OHLI Social, beranda"><span class="ohli-logo"></span><span><strong>OHLI Social</strong><span>Satu aplikasi, banyak cerita.</span></span></button><form class="ohli-global-search" id="ohliGlobalSearch" role="search">' + ico('search') + '<input id="ohliSearchInput" type="search" placeholder="Cari orang, postingan, topik…" aria-label="Pencarian global"><span class="ohli-sr-only">Tekan Enter untuk mencari</span></form><div class="ohli-topbar-spacer"></div><div class="ohli-status-pill"><span class="ohli-status-dot"></span><span id="ohliConnectionLabel">Menghubungkan…</span></div><button type="button" class="ohli-mobile-menu" data-action="more-menu" aria-label="Menu lain">' + ico('menu') + '</button><button type="button" class="ohli-user-top" data-action="my-profile" aria-label="Buka profil">' + avatar('OHLI','') + '<span class="ohli-user-label"><strong id="ohliTopName">Akun OHLI</strong><small id="ohliTopPhone"></small></span></button></header><aside class="ohli-sidebar" id="ohliGlobalNav" aria-label="Navigasi OHLI"><div class="ohli-nav-caption">Menu utama</div><div id="ohliPrimaryNav"></div><div class="ohli-nav-caption">Ruang sosial</div><div id="ohliCommunityNav"></div><div class="ohli-nav-spacer"></div><button type="button" class="ohli-theme-button" id="ohliThemeToggle">' + ico('sun') + '<span>Ganti tema</span></button><div class="ohli-nav-foot">OHLI Social<br><span>Komunikasi dan komunitas, dalam satu ruang.</span></div></aside><main class="ohli-stage"><div class="ohli-stage-head"><button type="button" class="ohli-internal-back" data-action="internal-back" aria-label="Kembali ke beranda">‹</button><div><h1 id="ohliPageTitle">Beranda</h1><p id="ohliPageDescription"></p></div><div class="ohli-stage-actions" id="ohliPageActions"></div></div><div id="ohliPageContent" class="ohli-page-content"></div></main><div class="ohli-modal-backdrop" id="ohliModalBackdrop" hidden><section class="ohli-modal" role="dialog" aria-modal="true" aria-labelledby="ohliModalTitle"><div class="ohli-modal-head"><h2 id="ohliModalTitle">OHLI Social</h2><button class="ohli-modal-close" type="button" data-action="close-modal" aria-label="Tutup">×</button></div><div id="ohliModalContent"></div></section></div><div class="ohli-story-viewer" id="ohliStoryViewer" hidden><section class="ohli-story-screen"><div class="ohli-story-progress"><span></span></div><div class="ohli-story-owner" id="ohliStoryOwner"></div><div class="ohli-story-media" id="ohliStoryMedia"></div><div class="ohli-story-foot" id="ohliStoryFoot"></div></section></div><div class="ohli-toast" id="ohliToast" hidden role="status" aria-live="polite"></div><input id="ohliPostFile" class="ohli-composer-file" type="file" accept="image/*,video/*"><input id="ohliStatusFile" class="ohli-composer-file" type="file" accept="image/*,video/*">';
    document.body.insertBefore(shell, document.getElementById('modalBackdrop'));
    pageContent = shell.querySelector('#ohliPageContent'); pageTitle = shell.querySelector('#ohliPageTitle'); pageDescription = shell.querySelector('#ohliPageDescription'); pageActions = shell.querySelector('#ohliPageActions'); nav = shell.querySelector('#ohliGlobalNav'); searchInput = shell.querySelector('#ohliSearchInput'); toastBox = shell.querySelector('#ohliToast'); overlay = shell.querySelector('#ohliModalBackdrop'); overlayContent = shell.querySelector('#ohliModalContent');
    var pnav = shell.querySelector('#ohliPrimaryNav'), cnav = shell.querySelector('#ohliCommunityNav');
    navItems.forEach(function (item) {
      var button = document.createElement('button'); button.type = 'button'; button.className = 'ohli-nav-link'; button.dataset.page = item[0]; button.dataset.action = 'navigate'; button.innerHTML = ico(item[2]) + '<span>' + esc(item[1]) + '</span>';
      if (['home','videos','create','story','chat','profile'].indexOf(item[0]) >= 0) button.setAttribute('data-mobile-primary','true');
      if (['home','videos','create','story','explore','live','chat'].indexOf(item[0]) >= 0) pnav.appendChild(button); else cnav.appendChild(button);
    });
    shell.querySelector('#ohliGlobalSearch').addEventListener('submit', function (event) { event.preventDefault(); pageQuery = searchInput.value.trim(); setPage('explore'); });
    shell.querySelector('#ohliThemeToggle').addEventListener('click', toggleTheme);
    shell.addEventListener('click', handleClick);
    shell.addEventListener('submit', handleSubmit);
    shell.addEventListener('change', handleChange);
    shell.querySelector('#ohliStoryViewer').addEventListener('click', function (event) { if (event.target.id === 'ohliStoryViewer') closeStory(); });
    shell.querySelector('#ohliModalBackdrop').addEventListener('click', function (event) { if (event.target === overlay) closeModal(); });
    addLegacyReturnButton();
    theme = localStorage.getItem('ohli:social-theme') || 'dark'; applyTheme();
  }

  function addLegacyReturnButton() {
    var sideHead = document.querySelector('#app .side-head'); if (!sideHead || sideHead.querySelector('#ohliBackSocial')) return;
    var button = document.createElement('button'); button.type = 'button'; button.id = 'ohliBackSocial'; button.className = 'ohli-legacy-return'; button.innerHTML = ico('arrow') + '<span>OHLI Social</span>'; button.title = 'Kembali ke OHLI Social';
    button.addEventListener('click', function () { showShell(lastSocialPage || 'home'); }); sideHead.insertBefore(button, sideHead.firstChild);
  }

  function setShellVisible(visible) {
    shell.hidden = !visible;
    var app = document.getElementById('app'); if (app) app.hidden = visible;
    if (visible) { var me = rt.getMe(); if (me) { shell.querySelector('#ohliTopName').textContent = me.name || 'Akun OHLI'; shell.querySelector('#ohliTopPhone').textContent = me.phone || ''; } }
  }
  function showShell(targetPage, extra) { setShellVisible(true); setPage(targetPage || page || 'home', extra); }
  function goLegacy(which) {
    shell.hidden = true; var app = document.getElementById('app'); app.hidden = false; app.classList.remove('page-open','chat-open');
    if (which === 'contacts') rt.openContacts(); else if (which === 'calls') rt.openCalls(); else rt.openChat();
    var returnBtn = document.getElementById('ohliBackSocial'); if (returnBtn) returnBtn.style.display = '';
  }
  function setPage(next, extra) {
    if (next === 'chat') { lastSocialPage = (page === 'chat' || page === 'contacts' || page === 'calls') ? lastSocialPage : page; page = 'chat'; goLegacy('chat'); return; }
    if (next === 'contacts') { lastSocialPage = (page === 'chat' || page === 'contacts' || page === 'calls') ? lastSocialPage : page; page = 'contacts'; goLegacy('contacts'); return; }
    if (next === 'calls') { lastSocialPage = (page === 'chat' || page === 'contacts' || page === 'calls') ? lastSocialPage : page; page = 'calls'; goLegacy('calls'); return; }
    page = next || 'home';
    if (page === 'profile') profileTarget = (extra && extra.phone) ? extra.phone : ((rt.getMe() || {}).phone || '');
    else if (extra && extra.phone) profileTarget = extra.phone;
    setShellVisible(true);
    var backControl = shell.querySelector('.ohli-internal-back'); if (backControl) backControl.hidden = (page === 'home');
    shell.querySelectorAll('.ohli-nav-link').forEach(function (button) { button.classList.toggle('active', button.dataset.page === page || (page === 'profile' && button.dataset.page === 'profile')); });
    var meta = pageTitles[page] || pageTitles.home; pageTitle.textContent = meta[0]; pageDescription.textContent = meta[1]; pageActions.innerHTML = '';
    if (page === 'profile') pageActions.innerHTML = '<button class="ohli-btn" type="button" data-action="edit-profile">' + ico('settings') + ' Edit profil</button>';
    renderPage();
  }
  function applyTheme() { if (!shell) return; shell.classList.toggle('ohli-dark', theme !== 'light'); var btn = shell.querySelector('#ohliThemeToggle'); if (btn) btn.innerHTML = ico(theme === 'light' ? 'moon' : 'sun') + '<span>' + (theme === 'light' ? 'Mode gelap' : 'Mode terang') + '</span>'; }
  function toggleTheme() { theme = theme === 'light' ? 'dark' : 'light'; localStorage.setItem('ohli:social-theme', theme); applyTheme(); }
  var toastTimeout = null;
  function toast(message) { toastBox.textContent = String(message || 'Selesai'); toastBox.hidden = false; if (toastTimeout) clearTimeout(toastTimeout); toastTimeout = setTimeout(function () { toastBox.hidden = true; }, 3300); }
  function apiError(error) { return (error && error.message) ? error.message : 'Permintaan belum berhasil. Periksa koneksi server dan coba lagi.'; }
  function showLoading() { pageContent.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div></div>'; }
  function showError(message, retryAction) { pageContent.innerHTML = '<div class="ohli-error"><strong>Belum dapat memuat data.</strong><div style="margin:6px 0 12px">' + esc(message) + '</div><button type="button" class="ohli-btn" data-action="' + esc(retryAction || 'retry') + '">' + ico('refresh') + ' Coba lagi</button></div>'; }
  function renderPage() {
    if (shell) shell.setAttribute('data-page', page);
    var stg = shell && shell.querySelector('.ohli-stage'); if (stg) { stg.classList.toggle('is-reels', page === 'videos'); stg.scrollTop = 0; }
    if (videoObserver) { videoObserver.disconnect(); videoObserver = null; }
    if (page === 'home') return renderHome(true);
    if (page === 'create') return renderCreate();
    if (page === 'videos') return renderVideos();
    if (page === 'story') return renderStories();
    if (page === 'explore') return renderExplore();
    if (page === 'live') return renderLive();
    if (page === 'groups') return renderCommunities('group');
    if (page === 'channels') return renderCommunities('channel');
    if (page === 'notifications') return renderNotifications();
    if (page === 'archive') return renderArchives();
    if (page === 'profile') return renderProfile(profileTarget || (rt.getMe() && rt.getMe().phone));
    if (page === 'settings') return renderSettings();
    pageContent.innerHTML = empty('home','Selamat datang di OHLI Social','Mulai dengan membuat postingan, mencari orang, atau masuk ke chat.', 'Buat postingan','compose-focus');
  }

  function composeCard() {
    var me = rt.getMe() || {};
    return '<form class="ohli-card ohli-compose" id="ohliComposeForm"><div class="ohli-compose-top">' + avatar(me.name,me.phone) + '<textarea id="ohliPostText" name="text" maxlength="2000" placeholder="Apa yang ingin kamu bagikan?" aria-label="Isi postingan"></textarea></div><div class="ohli-compose-divider"></div><div class="ohli-compose-bottom"><select id="ohliAudience" class="ohli-audience" aria-label="Audiens postingan"><option value="public">Publik</option><option value="followers">Pengikut</option><option value="private">Pribadi</option></select><button type="button" class="ohli-btn" data-action="pick-post-media">' + ico('image') + ' Foto / video</button><span class="ohli-hint" id="ohliSelectedFileLabel"></span><div class="ohli-compose-actions"><button class="ohli-btn ohli-btn-primary" type="submit" id="ohliPostSubmit">' + ico('send') + ' Posting</button></div></div></form>';
  }

  function homeBase() {
    return '<div class="ohli-home-grid"><div class="ohli-feed-column"><div class="ohli-feed-tabs"><button type="button" class="ohli-feed-tab active" data-action="feed-mode" data-mode="public">Untuk Kamu</button><button type="button" class="ohli-feed-tab" data-action="feed-mode" data-mode="following">Mengikuti</button></div><div id="ohliStoryStrip" class="ohli-story-flat"><div id="ohliStoryStripContent"></div></div><div id="ohliFeedList" class="ohli-feed-column"></div><div id="ohliFeedMore" style="text-align:center"></div></div><aside class="ohli-rail-column"><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title"><span>Orang yang mungkin kamu kenal</span><small>akun</small></div><div id="ohliSuggestions"></div></div><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title"><span>Jelajahi topik</span><small>14 hari terakhir</small></div><div id="ohliTrendingList"><p class="ohli-hint">Memuat topik yang sedang ramai…</p></div></div><div class="ohli-rail-footer">OHLI Social · Privasi dan keamanan tetap menjadi bagian dari pengalaman sosial.<br>Konten pada feed berasal dari server; bukan contoh/demo.</div></aside></div>';
  }

  var currentFeedMode = 'public';
  async function renderHome(reset) {
    pageContent.innerHTML = homeBase();
    var list = pageContent.querySelector('#ohliFeedList'); list.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div></div>';
    if (reset) nextBefore = 0;
    pageContent.querySelectorAll('.ohli-feed-tab').forEach(function (b) { b.classList.toggle('active', b.dataset.mode === currentFeedMode); });
    var feedPath = '/api/feed?mode=' + encodeURIComponent(currentFeedMode) + (reset || !nextBefore ? '' : '&before=' + encodeURIComponent(nextBefore));
    try {
      var data = await rt.request(feedPath); var newPosts = data.posts || [];
      if (reset || !nextBefore) posts = newPosts; else { var seen = {}; posts.forEach(function (p) { seen[p.id] = true; }); newPosts.forEach(function (p) { if (!seen[p.id]) posts.push(p); }); }
      nextBefore = Number(data.nextBefore) || 0; hasMore = !!data.hasMore;
      list.innerHTML = posts.length ? posts.map(postCard).join('') : empty('home', currentFeedMode === 'following' ? 'Feed Mengikuti masih kosong' : 'Belum ada postingan', currentFeedMode === 'following' ? 'Ikuti akun lain untuk melihat postingannya di sini.' : 'Jadilah orang pertama yang membagikan cerita di OHLI Social.', 'Buat postingan','compose-focus');
      var more = pageContent.querySelector('#ohliFeedMore'); more.innerHTML = hasMore ? '<button type="button" class="ohli-btn" data-action="load-more">Muat postingan lainnya</button>' : (posts.length ? '<p class="ohli-hint">Kamu sudah melihat postingan yang tersedia untuk halaman ini.</p>' : '');
      var stories = await rt.request('/api/status'); statusList = stories.statuses || []; renderStoryStrip(pageContent.querySelector('#ohliStoryStripContent'), statusList);
      try { var ud = await rt.request('/api/users'); users = ud.users || []; renderSuggestions(pageContent.querySelector('#ohliSuggestions')); } catch (ignoreUsers) { }
      try { var trendData=await rt.request('/api/trending'), trendTarget=pageContent.querySelector('#ohliTrendingList'), topics=trendData.topics||[]; if(trendTarget) trendTarget.innerHTML=topics.length?topics.map(function(t,i){var tag=String(t.tag||'').replace(/^#/,'');return '<button type="button" class="ohli-trend" data-action="search-topic" data-query="'+esc('#'+tag)+'"><small>Topik #'+(i+1)+' · '+Number(t.uses||0)+' postingan</small><strong>#'+esc(tag)+'</strong><span>Jelajahi postingan dengan tagar ini</span></button>';}).join(''):'<p class="ohli-hint">Belum ada tagar ramai. Tambahkan #topik pada postingan agar muncul di Jelajahi.</p>'; } catch(ignoreTrends) { var trendTargetFallback=pageContent.querySelector('#ohliTrendingList'); if(trendTargetFallback)trendTargetFallback.innerHTML='<p class="ohli-hint">Topik belum bisa dimuat. Coba lagi nanti.</p>'; }
    } catch (e) { list.innerHTML = ''; showError(apiError(e), 'retry'); }
  }

  function groupStoriesByPhone(list) {
    var groups = {}, order = [];
    (list || []).filter(function(s){return s && s.id && s.phone;}).forEach(function(s){
      if(!groups[s.phone]){groups[s.phone]=[];order.push(s.phone);} groups[s.phone].push(s);
    });
    return order.map(function(phone){var items=groups[phone].sort(function(a,b){return Number(a.time||0)-Number(b.time||0);});return {phone:phone,items:items,latest:items[items.length-1]};})
      .sort(function(a,b){return Number(b.latest.time||0)-Number(a.latest.time||0);});
  }
  function renderStoryStrip(target, list) {
    if (!target) return;
    var me = rt.getMe() || {}, groups = groupStoriesByPhone(list), ownGroup = null;
    groups.forEach(function(g){ if(g.phone===me.phone) ownGroup=g; });
    var html = '<div class="ohli-story-row">';
    if (ownGroup) {
      var ownLatest=ownGroup.latest;
      html += '<button type="button" class="ohli-story-item" data-action="view-story" data-story-id="'+esc(ownLatest.id)+'" data-story-phone="'+esc(me.phone)+'"><div class="ohli-story-ring ohli-story-own"><span>'+avatar(ownLatest.name||me.name,me.phone)+'</span><i>+</i></div><strong>Story kamu</strong><small>'+ownGroup.items.length+' Story</small></button>';
    } else {
      html += '<button type="button" class="ohli-story-item" data-action="navigate" data-page="story"><div class="ohli-story-ring ohli-story-add"><span>+</span></div><strong>Story kamu</strong><small>Tambah</small></button>';
    }
    groups.forEach(function(g){ if(g.phone===me.phone)return; var latest=g.latest;
      html += '<button type="button" class="ohli-story-item" data-action="view-story" data-story-id="'+esc(latest.id)+'" data-story-phone="'+esc(g.phone)+'"><div class="ohli-story-ring"><span>'+avatar(latest.name||latest.phone,latest.phone)+'</span></div><strong>'+esc(latest.name||latest.phone)+'</strong><small>'+g.items.length+' Story</small></button>';
    });
    html += '</div>'; target.innerHTML = html;
  }


  function renderSuggestions(target) {
    if (!target) return; var me = rt.getMe() || {}, list = (users || []).filter(function (u) { return u.phone !== me.phone; }).slice(0, 5);
    target.innerHTML = list.length ? list.map(function (u) { var following=!!u.isFollowing, requested=!!u.followRequested; return '<div class="ohli-user-suggestion">' + avatar(u.name,u.phone) + '<div class="ohli-user-copy"><strong>' + esc(u.name || u.phone) + '</strong><small>' + esc(u.about || 'Pengguna OHLI') + '</small></div><button class="ohli-follow-mini" type="button" data-action="follow" data-phone="' + esc(u.phone) + '" data-following="'+(following?'1':'0')+'" data-requested="'+(requested?'1':'0')+'">'+(following?'Mengikuti':(requested?'Diminta':'Ikuti'))+'</button></div>'; }).join('') : '<p class="ohli-hint">Akun lain akan muncul di sini saat tersedia.</p>';
  }

  function postCard(p) {
    var me = rt.getMe() || {}, isMine = p.author === me.phone, isVideo = p.mediaType === 'video' || (p.mimeType && p.mimeType.indexOf('video/') === 0), media = '';
    if (p.mediaId) media = isVideo ? '<div class="ohli-vwrap paused"' + vStyle(p) + '><video class="ohli-post-media" src="' + esc(rt.mediaUrl(p.mediaId)) + '#t=0.1" playsinline muted loop preload="metadata" data-ohli-video="true"' + vAttrs(p) + ' aria-label="Video postingan"></video>' + mediaOverlay(p) + '<span class="ohli-vplay">' + ico('play') + '</span><button type="button" class="ohli-vsound" data-action="toggle-sound" aria-label="Suara">' + ico(soundOn ? 'sound' : 'mute') + '</button></div>' : '<img class="ohli-post-media" src="' + esc(rt.mediaUrl(p.mediaId)) + '" alt="Media postingan" loading="lazy">';
    var comments = openComments[p.id] ? '<div class="ohli-post-comments">' + ((p.comments || []).map(function (c) { return '<div class="ohli-comment">' + avatar(c.name,c.phone) + '<div class="ohli-comment-copy"><strong>' + esc(c.name || c.phone) + '</strong><p>' + esc(c.text) + '</p></div></div>'; }).join('') || '<p class="ohli-hint">Belum ada komentar.</p>') + '<form class="ohli-comment-form" data-comment-post="' + esc(p.id) + '"><input name="comment" maxlength="500" placeholder="Tulis komentar…" aria-label="Tulis komentar" required><button type="submit" aria-label="Kirim komentar">' + ico('send') + '</button></form></div>' : '';
    return '<article class="ohli-card ohli-post" data-post-card="' + esc(p.id) + '"><div class="ohli-post-head"><button type="button" class="ohli-post-author" data-action="profile" data-phone="' + esc(p.author) + '">' + avatar(p.authorName,p.author) + '<span class="ohli-post-author-copy"><strong>' + esc(p.authorName || p.author) + '</strong><small>@' + esc(p.author) + ' · ' + esc(shortDate(p.createdAt)) + ' · ' + esc(p.audience || 'public') + '</small></span></button>' + (isMine ? '<button type="button" class="ohli-post-menu" data-action="post-menu" data-post-id="' + esc(p.id) + '" data-archived="' + (p.archived ? '1' : '0') + '" aria-label="Kelola postingan">⋯</button>' : '') + '</div>' + (p.text ? '<p class="ohli-post-text">' + esc(p.text) + '</p>' : '') + media + '<div class="ohli-post-stats"><span>' + ico('heart') + ' ' + Number(p.likesCount || 0) + ' suka</span><span>' + Number(p.commentsCount || 0) + ' komentar</span><span>' + Number(p.repostsCount || 0) + ' posting ulang</span><span>' + Number(p.sharesCount || 0) + ' dibagikan</span></div><div class="ohli-post-actions"><button type="button" class="ohli-btn ' + (p.liked ? 'is-active is-liked' : '') + '" data-action="like" data-post-id="' + esc(p.id) + '">' + ico('heart') + ' ' + (p.liked ? 'Disukai' : 'Suka') + '</button><button type="button" class="ohli-btn" data-action="comments" data-post-id="' + esc(p.id) + '">' + ico('comment') + ' Komentar</button><button type="button" class="ohli-btn ' + (p.saved ? 'is-active' : '') + '" data-action="bookmark" data-post-id="' + esc(p.id) + '">' + ico('bookmark') + ' Simpan</button><button type="button" class="ohli-btn ' + (p.reposted ? 'is-active' : '') + '" data-action="repost" data-post-id="' + esc(p.id) + '">' + ico('refresh') + ' Posting ulang</button><button type="button" class="ohli-btn" data-action="share-post" data-post-id="' + esc(p.id) + '">' + ico('share') + ' Bagikan</button></div>' + comments + '</article>';
  }

  function isVid(p) { return p.mediaType === 'video' || (p.mimeType || '').indexOf('video/') === 0; }
  function reelCard(p) {
    var id = esc(p.id);
    function b(a, ic, n, extra) { return '<button type="button" class="ohli-reel-btn' + (extra || '') + '" data-action="' + a + '" data-post-id="' + id + '">' + ico(ic) + (n == null ? '' : '<small>' + n + '</small>') + '</button>'; }
    return '<article class="ohli-reel" data-post-card="' + id + '"><div class="ohli-vwrap paused"><video src="' + esc(rt.mediaUrl(p.mediaId)) + '" muted playsinline loop preload="metadata" data-ohli-video="true"' + vAttrs(p) + '></video>' + mediaOverlay(p) + '<span class="ohli-vplay">' + ico('play') + '</span></div><div class="ohli-reel-shade"></div>'
      + '<div class="ohli-reel-info"><button type="button" class="ohli-reel-author" data-action="profile" data-phone="' + esc(p.author) + '">@' + esc(p.authorName || p.author) + '</button><p>' + esc(p.text || '') + '</p></div>'
      + '<div class="ohli-reel-side"><button type="button" class="ohli-reel-av" data-action="profile" data-phone="' + esc(p.author) + '" aria-label="Profil">' + avatar(p.authorName, p.author) + '</button>'
      + b('like', 'heart', Number(p.likesCount || 0), p.liked ? ' is-liked' : '') + b('reel-comments', 'comment', Number(p.commentsCount || 0)) + b('bookmark', 'bookmark', null, p.saved ? ' is-liked' : '')
      + b('repost', 'refresh', Number(p.repostsCount || 0), p.reposted ? ' is-on' : '') + b('share-post', 'share', Number(p.sharesCount || 0))
      + '<button type="button" class="ohli-reel-btn" data-action="toggle-sound" aria-label="Suara">' + ico(soundOn ? 'sound' : 'mute') + '</button></div><div class="ohli-reel-bar"><i></i></div></article>';
  }
  function syncReels() {
    (posts || []).forEach(function (p) {
      var r = pageContent.querySelector('.ohli-reel[data-post-card="' + p.id + '"]'); if (!r) return;
      function set(a, n, on, cls) { var b = r.querySelector('[data-action="' + a + '"]'); if (!b) return; if (on != null) b.classList.toggle(cls || 'is-liked', !!on); var sm = b.querySelector('small'); if (sm && n != null) sm.textContent = n; }
      set('like', Number(p.likesCount || 0), p.liked); set('reel-comments', Number(p.commentsCount || 0)); set('bookmark', null, p.saved); set('repost', Number(p.repostsCount || 0), p.reposted, 'is-on'); set('share-post', Number(p.sharesCount || 0));
    });
  }
  function openMedia(p) {
    var u = esc(rt.mediaUrl(p.mediaId));
    showModal('', (isVid(p) ? '<div class="ohli-vwrap paused"><video src="' + u + '" playsinline loop data-ohli-video="true" style="width:100%;max-height:70vh;border-radius:12px;background:#000"></video><span class="ohli-vplay">' + ico('play') + '</span></div>' : '<img src="' + u + '" alt="" style="width:100%;border-radius:12px">') + (p.text ? '<p class="ohli-post-text">' + esc(p.text) + '</p>' : ''), '', null);
    var v = overlayContent.querySelector('video'); if (v) { v.muted = !soundOn; var pr = v.play(); if (pr && pr.catch) pr.catch(function () { v.muted = true; v.play().catch(function () {}); }); }
  }
  function mediaGrid(ps) {
    if (!ps.length) return empty('profile', 'Belum ada media', 'Foto dan video yang diposting akan tampil di sini.');
    return '<div class="ohli-media-grid">' + ps.map(function (p) { var u = esc(rt.mediaUrl(p.mediaId)); return '<button type="button" class="ohli-media-tile" data-action="open-media" data-post-id="' + esc(p.id) + '">' + (isVid(p) ? '<video src="' + u + '#t=0.1" muted playsinline preload="metadata"></video><span class="ohli-tile-badge">' + ico('play') + '</span>' : '<img src="' + u + '" alt="" loading="lazy">') + '</button>'; }).join('') + '</div>';
  }
  async function renderVideos() {
    showLoading();
    try {
      var data = await rt.request('/api/feed?mode=' + (reelMode === 'following' ? 'following' : 'public')); posts = data.posts || []; var vs = posts.filter(function (p) { return p.mediaId && isVid(p); });
      var top = '<div class="ohli-reels-top"><button type="button" class="ohli-reel-live" data-action="navigate" data-page="live" aria-label="Live">' + ico('live') + '<span>LIVE</span></button><div class="ohli-reels-tabs"><button type="button" class="' + (reelMode === 'following' ? 'on' : '') + '" data-action="reel-mode" data-mode="following">Mengikuti</button><button type="button" class="' + (reelMode !== 'following' ? 'on' : '') + '" data-action="reel-mode" data-mode="foryou">Untuk Kamu</button></div><button type="button" class="ohli-reel-search" data-action="navigate" data-page="explore" aria-label="Cari">' + ico('search') + '</button></div>';
      pageContent.innerHTML = '<div class="ohli-reels-wrap">' + top + (vs.length ? '<div class="ohli-reels">' + vs.map(reelCard).join('') + '</div>' : '<div class="ohli-reels-empty">' + empty('video', reelMode === 'following' ? 'Belum ada video dari akun yang kamu ikuti' : 'Belum ada video pendek', 'Unggah video lewat tombol + di bawah.', 'Buat konten', 'compose-focus') + '</div>') + '</div>';
      initVideoObserver();
    } catch (e) { showError(apiError(e), 'retry'); }
  }
  function wantMuted(v) { return !soundOn || v.dataset.mute === '1'; }
  function playVid(v) {
    v.muted = wantMuted(v); var pr = v.play();
    if (pr && pr.catch) pr.catch(function () { if (!v.muted) { v.muted = true; if (soundOn && !needGesture) { needGesture = true; toast('Ketuk video sekali untuk menyalakan suara.'); } v.play().catch(function () {}); } });
  }
  function initVideoObserver() {
    if (!pageContent || !('IntersectionObserver' in window)) return;
    var vids = pageContent.querySelectorAll('video[data-ohli-video="true"]:not([data-ohli-obs])'); if (!vids.length) return;
    if (!videoObserver) videoObserver = new IntersectionObserver(function (es) { es.forEach(function (en) {
      var v = en.target;
      if (en.isIntersecting && en.intersectionRatio >= 0.6) { pageContent.querySelectorAll('video[data-ohli-video="true"]').forEach(function (o) { if (o !== v) o.pause(); }); playVid(v); } else v.pause();
    }); }, {threshold: [0, 0.6, 1]});
    vids.forEach(function (v) { v.setAttribute('data-ohli-obs', '1'); videoObserver.observe(v); });
  }

  async function renderStories() {
    pageContent.innerHTML = '<div class="ohli-home-grid"><div class="ohli-feed-column"><form class="ohli-card ohli-compose" id="ohliStoryForm"><div class="ohli-compose-top">' + avatar((rt.getMe() || {}).name,(rt.getMe() || {}).phone) + '<textarea id="ohliStoryText" name="text" maxlength="240" placeholder="Bagikan pembaruan singkat…" aria-label="Teks Story"></textarea></div><div class="ohli-compose-divider"></div><div class="ohli-compose-bottom"><button type="button" class="ohli-btn" data-action="pick-story-media">' + ico('image') + ' Foto / video</button><span id="ohliStoryFileLabel" class="ohli-hint"></span><div class="ohli-compose-actions"><button type="submit" id="ohliStorySubmit" class="ohli-btn ohli-btn-primary">Bagikan Story</button></div></div><p class="ohli-hint">Story aktif hingga 24 jam. Penonton dan replay dihitung di server; kamu bisa melihat statistik serta menyimpan Story ke Sorotan.</p></form><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Story yang tersedia</div><div id="ohliAllStories"></div></div></div><aside class="ohli-rail-column"><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Privasi Story</div><p class="ohli-hint">Pada server sumber, Story hanya dibagikan ke akun yang menyimpan pembuatnya sebagai kontak. Pengaturan Close Friends dan pengecualian per akun belum tersedia pada backend ini.</p><button type="button" class="ohli-btn" data-action="legacy-settings">Lihat pengaturan</button></div></aside></div>';
    var target = pageContent.querySelector('#ohliAllStories'); target.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div></div>';
    try { var data = await rt.request('/api/status'); statusList = data.statuses || []; var me=rt.getMe()||{},storyGroups=groupStoriesByPhone(statusList); target.innerHTML = storyGroups.length ? storyGroups.map(function(g){var s=g.latest;return '<button type="button" class="ohli-list-card ohli-card" style="width:100%;text-align:left" data-action="view-story" data-story-id="'+esc(s.id)+'">'+avatar(s.name||s.phone,s.phone)+'<span class="ohli-list-copy"><strong>'+(s.phone===me.phone?'Story saya':esc(s.name||s.phone))+'</strong><p>'+esc(s.text||(s.mediaType==='video'?'Video Story':'Story foto'))+'</p><span class="ohli-list-meta">'+g.items.length+' Story · terbaru '+esc(shortDate(s.time))+'</span></span>'+ico('arrow')+'</button>';}).join('') : empty('story','Belum ada Story','Story yang baru dibuat oleh kamu atau kontakmu akan muncul di sini.'); } catch(e) { target.innerHTML = '<div class="ohli-error">' + esc(apiError(e)) + '</div>'; }
  }

  async function viewStory(status) {
    var me = rt.getMe() || {}, viewer = shell.querySelector('#ohliStoryViewer');
    storyItems = statusList.filter(function(s){return s && s.phone===status.phone;}).sort(function(a,b){return Number(a.time||0)-Number(b.time||0);});
    storyIndex = Math.max(0, storyItems.findIndex(function(s){return s.id===status.id;}));
    viewer.hidden = false;
    await renderStoryFrame();
  }
  async function renderStoryFrame(){
    var me=rt.getMe()||{},status=storyItems[storyIndex];if(!status)return closeStory();
    var owner=shell.querySelector('#ohliStoryOwner'),media=shell.querySelector('#ohliStoryMedia'),foot=shell.querySelector('#ohliStoryFoot');
    if(status.phone!==me.phone){try{await rt.request('/api/status/view',{method:'POST',body:{statusId:status.id}});}catch(ignore){}}
    owner.innerHTML='<button type="button" class="ohli-story-owner-profile" data-action="story-owner-profile" data-phone="'+esc(status.phone)+'">'+avatar(status.name||status.phone,status.phone)+'<span><strong>'+esc(status.phone===me.phone?'Story kamu':(status.name||status.phone))+'</strong><small>'+esc(shortDate(status.time))+'</small></span></button><button type="button" class="ohli-modal-close ohli-story-close" data-action="close-story" aria-label="Tutup">×</button>';
    var mediaUrl=status.mediaId?((status.fileSize||status.mimeType)?rt.mediaUrl(status.mediaId):('/api/image?token='+encodeURIComponent(rt.getToken())+'&id='+encodeURIComponent(status.mediaId))):'';
    media.innerHTML=(status.mediaId?(status.mediaType==='video'||(status.mimeType||'').indexOf('video/')===0?'<video src="'+esc(mediaUrl)+'" controls playsinline autoplay></video>':'<img src="'+esc(mediaUrl)+'" alt="Media Story">'):'')+(status.text?'<p class="ohli-story-text">'+esc(status.text)+'</p>':'');
    var own=status.phone===me.phone;
    foot.innerHTML='<button type="button" class="ohli-story-step" data-action="story-prev" '+(storyIndex===0?'disabled':'')+'>‹</button><span class="ohli-story-stats">'+(storyIndex+1)+' / '+storyItems.length+' · '+Number(status.likesCount||0)+' suka</span>'+(own?'<button type="button" class="ohli-btn" data-action="story-viewers" data-story-id="'+esc(status.id)+'">Penonton</button><button type="button" class="ohli-btn" data-action="story-highlight" data-story-id="'+esc(status.id)+'">+ Sorotan</button>':'<button type="button" class="ohli-btn '+(status.liked?'is-active is-liked':'')+'" data-action="like-story" data-story-id="'+esc(status.id)+'">'+(status.liked?'♥ Disukai':'♡ Suka')+'</button>')+'<button type="button" class="ohli-story-step" data-action="story-next" '+(storyIndex>=storyItems.length-1?'disabled':'')+'>›</button>';
    if(own){try{var stats=await rt.request('/api/status/views?statusId='+encodeURIComponent(status.id));var statEl=foot.querySelector('.ohli-story-stats');if(statEl)statEl.textContent=(storyIndex+1)+' / '+storyItems.length+' · '+Number(status.likesCount||0)+' suka · '+stats.uniqueViewers+' penonton · '+stats.totalViews+' tayangan';}catch(e){}}
  }
  async function stepStory(delta){var next=storyIndex+delta;if(next<0||next>=storyItems.length)return;storyIndex=next;await renderStoryFrame();}

  function closeStory() { var viewer = shell.querySelector('#ohliStoryViewer'); if (viewer) { viewer.hidden = true; shell.querySelector('#ohliStoryMedia').innerHTML = ''; } }

  async function renderExplore() {
    var q = pageQuery || searchInput.value.trim(); pageQuery = q;
    pageContent.innerHTML = '<div class="ohli-card" style="padding:17px"><form id="ohliExploreForm" class="ohli-comment-form" style="margin:0"><input name="q" value="' + esc(q) + '" maxlength="80" placeholder="Cari nama, username, atau kata di postingan…" aria-label="Cari di OHLI"><button type="submit" aria-label="Cari">' + ico('search') + '</button></form></div><section class="ohli-result-section"><h2>Topik yang sedang ramai</h2><div id="ohliExploreTrending" class="ohli-trending-grid"><p class="ohli-hint">Memuat tagar aktif…</p></div></section><div id="ohliSearchResults"></div>';
    var trendingTarget=pageContent.querySelector('#ohliExploreTrending');
    try { var td=await rt.request('/api/trending'),topics=td.topics||[]; trendingTarget.innerHTML=topics.length?topics.map(function(t,i){var tag=String(t.tag||'').replace(/^#/,'');return '<button type="button" class="ohli-trend" data-action="search-topic" data-query="'+esc('#'+tag)+'"><small>Topik #'+(i+1)+' · '+Number(t.uses||0)+' postingan</small><strong>#'+esc(tag)+'</strong><span>Buka postingan dengan tagar ini</span></button>';}).join(''):'<p class="ohli-hint">Belum ada tagar ramai. Gunakan #tagar pada postingan agar topiknya muncul di sini.</p>'; } catch(e) { trendingTarget.innerHTML='<p class="ohli-hint">Topik belum tersedia saat ini.</p>'; }
    var target = pageContent.querySelector('#ohliSearchResults');
    if (!q) { target.innerHTML = empty('search','Mulai pencarian','Masukkan nama pengguna atau kata kunci. Pilih tagar di atas untuk membuka topik populer.'); return; }
    target.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div><div class="ohli-skeleton"></div></div>';
    try { var data = await rt.request('/api/search?q=' + encodeURIComponent(q)); var userHtml = (data.users || []).map(function (u) { var following=!!u.isFollowing,requested=!!u.followRequested; return '<div class="ohli-card ohli-list-card"><button type="button" class="ohli-post-author" data-action="profile" data-phone="' + esc(u.phone) + '">' + avatar(u.name,u.phone) + '<span class="ohli-list-copy"><strong>' + esc(u.name || u.phone) + '</strong><p>' + esc(u.about || 'Pengguna OHLI') + '</p></span></button><button type="button" class="ohli-btn ' + (following?'':'ohli-btn-primary') + '" data-action="follow" data-phone="' + esc(u.phone) + '" data-following="'+(following?'1':'0')+'" data-requested="'+(requested?'1':'0')+'">'+(following?'Mengikuti':(requested?'Diminta':'Ikuti'))+'</button></div>'; }).join(''); var postHtml = (data.posts || []).map(postCard).join(''); target.innerHTML = (userHtml ? '<section class="ohli-result-section"><h2>Pengguna (' + data.users.length + ')</h2><div class="ohli-result-list">' + userHtml + '</div></section>' : '') + (postHtml ? '<section class="ohli-result-section"><h2>Postingan (' + data.posts.length + ')</h2><div class="ohli-feed-column">' + postHtml + '</div></section>' : '') + (!userHtml && !postHtml ? empty('search','Tidak ada hasil','Coba kata kunci yang berbeda atau cek ejaan nama akun.') : ''); posts = (data.posts || []); }
    catch (e) { target.innerHTML = '<div class="ohli-error">' + esc(apiError(e)) + '</div>'; }
  }


  async function renderLive() {
    showLoading();
    try { var data = await rt.request('/api/live'); var lives = data.lives || []; pageContent.innerHTML = '<div style="display:flex;gap:9px;flex-wrap:wrap;margin-bottom:16px"><button type="button" class="ohli-btn ohli-btn-primary" data-action="start-live">' + ico('live') + ' Buka Studio LIVE</button><button type="button" class="ohli-btn" data-action="retry">' + ico('refresh') + ' Perbarui daftar</button></div>' + (lives.length ? '<div class="ohli-feed-column">' + lives.map(function (l) { return '<div class="ohli-card ohli-list-card">' + avatar(l.hostName,l.host) + '<div class="ohli-list-copy"><strong>' + esc(l.title || 'Siaran Live') + '</strong><p>' + esc(l.hostName || l.host) + '</p><div class="ohli-list-meta">' + Number(l.viewerCount || 0) + ' penonton saat ini · koneksi peer-to-peer</div></div><button type="button" class="ohli-btn ohli-btn-primary" data-action="join-live" data-live-id="' + esc(l.id) + '">Tonton</button></div>'; }).join('') + '</div>' : empty('live','Tidak ada Live aktif','Ketika seseorang memulai Live dari browser yang mendukung WebRTC, siaran akan muncul di sini. Server ini hanya menyediakan signaling peer-to-peer, bukan SFU relay.')) + '<p class="ohli-hint" style="margin-top:15px">Live dapat memerlukan HTTPS, izin kamera/mikrofon, STUN/TURN, koneksi host yang stabil, dan kapasitas upload yang cukup. Menutup tab host dapat mengakhiri aliran media.</p>'; }
    catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderCommunities(kind) {
    var label = kind === 'group' ? 'grup' : 'channel', endpoint = kind === 'group' ? '/api/groups' : '/api/channels'; showLoading();
    try {
      var data = await rt.request(endpoint); var items = data.items || []; if (kind === 'group') groupItems = items; else channelItems = items;
      pageContent.innerHTML = '<div style="display:flex;justify-content:flex-end;margin-bottom:14px"><button type="button" class="ohli-btn ohli-btn-primary" data-action="create-community" data-kind="' + kind + '">' + ico('plus') + ' Buat ' + (kind === 'group' ? 'grup' : 'channel') + '</button></div>' + (items.length ? '<div class="ohli-feed-column">' + items.map(function (item) { var joined = kind === 'group' ? item.joined : item.following; var action = kind === 'group' ? 'join-community' : 'follow-channel'; return '<div class="ohli-card ohli-list-card"><div class="ohli-avatar">' + ico(kind === 'group' ? 'groups' : 'channel') + '</div><div class="ohli-list-copy"><strong>' + esc(item.name) + '</strong><p>' + esc(item.description || (kind === 'group' ? 'Komunitas OHLI' : 'Channel OHLI')) + '</p><span class="ohli-list-meta">' + Number(item.memberCount || 0) + ' anggota · ' + esc(item.privacy || 'public') + '</span></div>' + (joined ? '<button type="button" class="ohli-btn ohli-btn-primary" data-action="' + (kind === 'group' ? 'open-group' : 'open-channel') + '" data-id="' + esc(item.id) + '">' + (kind === 'group' ? 'Buka chat' : 'Buka') + '</button>' : '') + '<button type="button" class="ohli-btn ' + (joined ? '' : 'ohli-btn-primary') + '" data-action="' + action + '" data-id="' + esc(item.id) + '" data-joined="' + (joined ? '1' : '0') + '">' + (joined ? (kind === 'group' ? 'Keluar' : 'Diikuti') : (kind === 'group' ? 'Gabung' : 'Ikuti')) + '</button></div>'; }).join('') + '</div>' : empty(kind === 'group' ? 'groups' : 'channel', 'Belum ada ' + label, 'Buat ' + label + ' pertama atau buka halaman lagi ketika akun lain sudah membuat ruang publik.', 'Buat ' + label, 'create-community:' + kind));
    } catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderProfile(targetPhone) {
    var me = rt.getMe() || {}; targetPhone = targetPhone || me.phone; profileTarget = targetPhone; showLoading();
    try {
      var data = await rt.request('/api/profile?phone=' + encodeURIComponent(targetPhone)); profileData = data;
      var u = data.user || {}, self = u.phone === me.phone, locked = !!data.locked, hi = data.highlights || [];
      var followText = data.isFollowing ? 'Mengikuti' : (data.followRequested ? 'Diminta' : 'Ikuti');
      var hero = '<section class="ohli-card ohli-profile-hero"><div class="ohli-cover" style="background-image:url(/api/cover?phone=' + encodeURIComponent(u.phone) + '&token=' + encodeURIComponent(rt.getToken()) + '&v=' + avatarVer + '),linear-gradient(135deg,#243b7a,#8b5cf6)">' + (self ? '<button type="button" class="ohli-cover-menu" data-action="navigate" data-page="settings" aria-label="Pengaturan OHLI Social">' + ico('menu') + '</button>' : '') + '</div><div class="ohli-profile-summary"><button type="button" class="ohli-profile-avatar-button" data-action="profile-avatar" data-phone="' + esc(u.phone) + '" data-name="' + esc(u.name || u.phone) + '" aria-label="Lihat foto profil">' + avatar(u.name,u.phone) + '</button><div class="ohli-profile-title"><div><h2>' + esc(u.name || u.phone) + (u.privateAccount ? ' <small class="ohli-private-tag">PRIVAT</small>' : '') + '</h2><p>@' + esc(u.phone) + (self ? ' · Profil kamu' : '') + '</p></div><div style="display:flex;gap:7px;flex-wrap:wrap">' + (self ? '<button type="button" class="ohli-btn ohli-btn-primary" data-action="edit-profile">Edit profil</button>' : '<button type="button" class="ohli-btn ' + (data.isFollowing ? '' : 'ohli-btn-primary') + '" data-action="follow" data-phone="' + esc(u.phone) + '" data-following="' + (data.isFollowing ? '1' : '0') + '" data-requested="' + (data.followRequested ? '1' : '0') + '">' + esc(followText) + '</button><button type="button" class="ohli-btn" data-action="open-chat-user" data-phone="' + esc(u.phone) + '">Chat</button>') + '</div></div><p class="ohli-profile-bio">' + esc(u.about || 'Belum menambahkan bio.') + '</p><div class="ohli-profile-stats"><button type="button" data-action="profile-stat" data-type="posts"><strong>' + Number(data.postsCount || 0) + '</strong><small>Postingan</small></button><button type="button" data-action="show-follow-list" data-type="followers" data-phone="' + esc(u.phone) + '" ' + (!data.canSeeFollowers ? 'disabled title="Daftar dibatasi"' : '') + '><strong>' + Number(data.followersCount || 0) + '</strong><small>Pengikut</small></button><button type="button" data-action="show-follow-list" data-type="following" data-phone="' + esc(u.phone) + '" ' + (!data.canSeeFollowing ? 'disabled title="Daftar dibatasi"' : '') + '><strong>' + Number(data.followingCount || 0) + '</strong><small>Mengikuti</small></button>' + (self ? '<button type="button" data-action="profile-views"><strong>' + Number(data.profileViewsCount || 0) + '</strong><small>Tayangan profil</small></button>' : '') + '</div><div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap"><button class="ohli-btn" data-action="copy-profile" type="button">' + ico('share') + ' Salin ID profil</button>' + (self ? '<button class="ohli-btn" data-action="contact-qr" data-phone="' + esc(u.phone) + '" type="button">▦ QR kontak</button>' : '<button class="ohli-btn ohli-btn-danger" data-action="block-user" data-phone="' + esc(u.phone) + '" type="button">Blokir</button>') + (self ? '<button class="ohli-btn" data-action="profile-privacy" type="button">' + ico('shield') + ' Privasi</button>' : '') + '</div></div></section>';
      var tabs = locked ? '<div class="ohli-tab-strip"><button class="active" type="button" data-action="profile-tab" data-tab="about">Tentang</button></div>' : '<div class="ohli-tab-strip"><button class="active" type="button" data-action="profile-tab" data-tab="posts">Postingan</button><button type="button" data-action="profile-tab" data-tab="media">Media</button><button type="button" data-action="profile-tab" data-tab="highlights">Sorotan</button>' + (data.canSeeLikes ? '<button type="button" data-action="profile-tab" data-tab="liked">Disukai</button>' : '') + '<button type="button" data-action="profile-tab" data-tab="reposted">Posting ulang</button>' + (self ? '<button type="button" data-action="profile-tab" data-tab="saved">Disimpan</button>' : (data.canSeeSaved ? '<button type="button" data-action="profile-tab" data-tab="saved">Disimpan</button>' : '')) + '<button type="button" data-action="profile-tab" data-tab="about">Tentang</button></div>';
      var lockedHtml = locked ? '<div class="ohli-card ohli-privacy-lock"><div class="ohli-privacy-lock-icon">' + ico('shield') + '</div><strong>Akun ini privat</strong><p>Ikuti akun ini dan tunggu persetujuan untuk melihat postingan serta Sorotan.</p></div>' : '';
      pageContent.innerHTML = hero + tabs + '<div id="ohliProfileContent" class="ohli-feed-column">' + (locked ? lockedHtml : ((data.posts || []).map(postCard).join('') || empty('profile','Belum ada postingan','Postingan yang dapat dilihat pada profil ini akan ditampilkan di sini.'))) + '</div>';
    } catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderArchives() {
    showLoading();
    var endpoint = archiveMode === 'saved' ? '/api/posts/saved' : '/api/posts/archive';
    try {
      var data = await rt.request(endpoint); posts = data.posts || [];
      pageContent.innerHTML = '<div class="ohli-feed-tabs"><button type="button" class="ohli-feed-tab ' + (archiveMode === 'archive' ? 'active' : '') + '" data-action="archive-mode" data-mode="archive">Arsip postingan</button><button type="button" class="ohli-feed-tab ' + (archiveMode === 'saved' ? 'active' : '') + '" data-action="archive-mode" data-mode="saved">Tersimpan</button></div>' + (posts.length ? '<div class="ohli-feed-column">' + posts.map(postCard).join('') + '</div>' : empty('bookmark', archiveMode === 'saved' ? 'Belum ada postingan tersimpan' : 'Arsip masih kosong', archiveMode === 'saved' ? 'Tekan Simpan pada postingan untuk mengumpulkannya secara pribadi.' : 'Arsip menyembunyikan postingan milikmu dari feed dan profil tanpa menghapusnya.'));
    } catch (e) { showError(apiError(e), 'retry'); }
  }

  async function renderSettings() {
    var me = rt.getMe() || {}, connection = 'Memeriksa server…';
    pageContent.innerHTML = '<div class="ohli-home-grid"><div class="ohli-feed-column"><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Akun dan identitas</div><div class="ohli-list-card" style="padding:0 0 14px">' + avatar(me.name,me.phone) + '<div class="ohli-list-copy"><strong>' + esc(me.name || 'Akun OHLI') + '</strong><p>Nomor akun: ' + esc(me.phone || '-') + '</p></div><button class="ohli-btn" data-action="edit-profile">Edit</button></div><div class="ohli-settings-tools"><button type="button" class="ohli-btn" data-action="contact-qr" data-phone="' + esc(me.phone || '') + '">▦ QR kontak saya</button><button type="button" class="ohli-btn" data-action="scan-contact-qr">Pindai QR teman</button></div></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Privasi & keamanan</div><p class="ohli-hint">Atur akun privat, siapa yang boleh melihat daftar pengikut, akun yang diikuti, postingan disukai, dan koleksi tersimpan.</p><button type="button" class="ohli-btn ohli-btn-primary" data-action="profile-privacy">Atur privasi akun</button><button type="button" class="ohli-btn" data-action="follow-requests" style="margin-left:7px">Permintaan mengikuti</button><button type="button" class="ohli-btn" data-action="blocked-list" style="margin-left:7px">Daftar diblokir</button><div class="ohli-settings-sub"><h3>Ganti kata sandi</h3><label class="ohli-field">Kata sandi saat ini<input id="ohliCurrentPassword" type="password" autocomplete="current-password" minlength="6"></label><label class="ohli-field">Kata sandi baru<input id="ohliNewPassword" type="password" autocomplete="new-password" minlength="6" maxlength="100"></label><button type="button" class="ohli-btn ohli-btn-primary" data-action="change-password">Simpan kata sandi baru</button></div></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Tampilan</div><p class="ohli-hint">Tema halaman OHLI disimpan pada perangkat ini. Preferensi ini tidak mengubah tema pengguna lain.</p><button type="button" class="ohli-btn" data-action="toggle-theme">' + ico(theme === 'dark' ? 'sun' : 'moon') + ' Ganti tema</button></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Chat & perangkat</div><p class="ohli-hint">Pengaturan chat lama, arsip, ekspor, dan sebagian preferensi masih dikelola pada halaman chat.</p><button type="button" class="ohli-btn" data-action="legacy-settings">Buka pengaturan chat</button></section><section class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Server dan keamanan</div><p class="ohli-hint">Server Android menyimpan data di perangkat host. Gunakan HTTPS/tunnel tepercaya dan cadangan di luar perangkat.</p><div id="ohliHealthState" class="ohli-hint">' + esc(connection) + '</div><button type="button" class="ohli-btn" data-action="check-health">Periksa koneksi</button></section></div><aside class="ohli-rail-column"><div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Fitur sosial aktif</div><div class="ohli-trend"><small>Fitur yang sudah memiliki alur server</small><strong>Privasi akun, pengikut, tayangan profil, Sorotan, Story, LIVE, chat grup, Channel, QR kontak, Disukai, Posting Ulang</strong></div><div class="ohli-trend"><small>Batas infrastruktur</small><strong>Backend masih satu perangkat Android; Live P2P dibatasi untuk uji kecil. SQL, TURN/SFU, push notification, backup off-device dan OTP tetap memerlukan layanan tambahan.</strong></div></div></aside></div>';
    checkHealth();
  }

  async function checkHealth() { var target = shell.querySelector('#ohliHealthState'); if (!target) return; try { var r = await fetch('/health', {cache:'no-store'}); var d = await r.json(); target.textContent = r.ok && d.ok ? 'Server menjawab · ' + (d.users || 0) + ' akun · ' + (d.messages || 0) + ' pesan' : 'Server memberikan respons yang tidak valid.'; shell.querySelector('#ohliConnectionLabel').textContent = r.ok ? 'Server tersambung' : 'Server bermasalah'; } catch (e) { target.textContent = 'Server tidak dapat dijangkau dari browser ini.'; shell.querySelector('#ohliConnectionLabel').textContent = 'Server tidak terjangkau'; } }

  function showModal(title, body, submitLabel, onSubmit) {
    shell.querySelector('#ohliModalTitle').textContent = title; overlayContent.innerHTML = body + (submitLabel ? '<div class="ohli-modal-actions"><button type="button" class="ohli-btn" data-action="close-modal">Batal</button><button type="button" class="ohli-btn ohli-btn-primary" id="ohliModalSubmit">' + esc(submitLabel) + '</button></div>' : ''); overlay.hidden = false;
    var submit = shell.querySelector('#ohliModalSubmit'); if (submit && onSubmit) submit.addEventListener('click', async function () { submit.disabled = true; try { await onSubmit(overlayContent); } catch (e) { toast(apiError(e)); } finally { submit.disabled = false; } });
    var first = overlayContent.querySelector('input,textarea,select,button'); if (first) setTimeout(function () { first.focus(); }, 25);
  }
  function closeModal() { stopQrScanner(); overlay.hidden = true; overlayContent.innerHTML = ''; }

  async function handleClick(event) {
    var button = event.target.closest('[data-action]'); if (!button || !shell.contains(button)) return; var action = button.dataset.action;
    try {
      if (action === 'navigate') { event.preventDefault(); if (!overlay.hidden) closeModal(); setPage(button.dataset.page || 'home'); }
      else if (action === 'internal-back') { if (page === 'profile' || page === 'settings' || page === 'explore' || page === 'story' || page === 'videos' || page === 'live' || page === 'groups' || page === 'channels' || page === 'notifications' || page === 'archive') setPage('home'); else setPage(lastSocialPage || 'home'); }
      else if (action === 'home') setPage('home');
      else if (action === 'more-menu') { var menuHtml = '<div class="ohli-nav-picker">' + navItems.filter(function () { return true; }).map(function (it) { return '<button type="button" class="ohli-btn" data-action="navigate" data-page="' + esc(it[0]) + '">' + ico(it[2]) + esc(it[1]) + '</button>'; }).join('') + '</div>'; showModal('Menu OHLI Social', menuHtml, '', null); }
      else if (action === 'my-profile') { profileTarget = (rt.getMe()||{}).phone || ''; setPage('profile', {phone:profileTarget}); }
      else if (action === 'profile-avatar') { var avPhone=button.dataset.phone,avName=button.dataset.name||avPhone,avSrc='/api/avatar?phone='+encodeURIComponent(avPhone)+'&token='+encodeURIComponent(rt.getToken())+'&v='+avatarVer; showModal(avName,'<div class="ohli-profile-photo-preview"><img src="'+esc(avSrc)+'" alt="Foto profil '+esc(avName)+'" onerror="this.style.display=\'none\'"><p>@'+esc(avPhone)+'</p></div>','',null); }
      else if (action === 'compose-focus') setPage('create');
      else if (action === 'pick-post-media') shell.querySelector('#ohliPostFile').click();
      else if (action === 'pick-story-media') shell.querySelector('#ohliStatusFile').click();
      else if (action === 'feed-mode') { currentFeedMode = button.dataset.mode || 'public'; nextBefore = 0; shell.querySelectorAll('.ohli-feed-tab').forEach(function (b) { b.classList.toggle('active', b === button); }); await renderHome(true); }
      else if (action === 'view-story') { var s = statusList.find(function (x) { return x.id === button.dataset.storyId; }); if (s) viewStory(s); }
      else if (action === 'close-story') closeStory();
      else if (action === 'story-prev') await stepStory(-1);
      else if (action === 'story-next') await stepStory(1);
      else if (action === 'story-owner-profile') { var ownerPhone = button.dataset.phone; closeStory(); setPage('profile', {phone:ownerPhone}); }
      else if (action === 'close-modal') closeModal();
      else if (action === 'archive-mode') { archiveMode = button.dataset.mode === 'saved' ? 'saved' : 'archive'; await renderArchives(); }
      else if (action === 'post-menu') { var targetPost = findPost(button.dataset.postId); if (!targetPost) { toast('Postingan tidak ditemukan pada tampilan ini. Muat ulang halaman.'); return; } var archived = targetPost.archived === true || button.dataset.archived === '1'; var menuBody = '<p class="ohli-hint">Kelola postingan milikmu. Perubahan akan disimpan ke server.</p><div class="ohli-post-manage-menu"><button type="button" class="ohli-btn" data-action="edit-post" data-post-id="' + esc(targetPost.id) + '">Edit teks dan audiens</button><button type="button" class="ohli-btn" data-action="archive-post" data-post-id="' + esc(targetPost.id) + '" data-archived="' + (archived ? '1' : '0') + '">' + (archived ? 'Pulihkan dari arsip' : 'Arsipkan postingan') + '</button><button type="button" class="ohli-btn ohli-btn-danger" data-action="delete-post" data-post-id="' + esc(targetPost.id) + '">Hapus postingan</button></div>'; showModal('Kelola postingan',menuBody,'',null); }
      else if (action === 'edit-post') { var pEdit = findPost(button.dataset.postId); if (!pEdit) return; var editBody = '<form id="ohliEditPostForm"><div class="ohli-field"><label for="ohliEditPostText">TEKS / CAPTION</label><textarea id="ohliEditPostText" name="text" maxlength="2000">' + esc(pEdit.text || '') + '</textarea></div><div class="ohli-field"><label for="ohliEditPostAudience">AUDIENS</label><select id="ohliEditPostAudience" name="audience"><option value="public" ' + (pEdit.audience === 'public' ? 'selected' : '') + '>Publik</option><option value="followers" ' + (pEdit.audience === 'followers' ? 'selected' : '') + '>Pengikut</option><option value="private" ' + (pEdit.audience === 'private' ? 'selected' : '') + '>Pribadi</option></select></div></form>'; showModal('Edit postingan',editBody,'Simpan perubahan',async function(content){var form=content.querySelector('#ohliEditPostForm');if(!form.reportValidity())return;var fd=new FormData(form);var updated=await rt.request('/api/posts/edit',{method:'POST',body:{postId:pEdit.id,text:fd.get('text'),audience:fd.get('audience')}});updatePost(updated.post);closeModal();toast('Postingan diperbarui di server.');if(page==='archive')await renderArchives();else if(page==='profile')await renderProfile(profileTarget);else await rerenderContent();}); }
      else if (action === 'archive-post') { var arch = await rt.request('/api/posts/archive',{method:'POST',body:{postId:button.dataset.postId,action:button.dataset.archived === '1' ? 'restore' : 'archive'}}); closeModal(); toast(arch.archived ? 'Postingan dipindahkan ke arsip.' : 'Postingan dipulihkan dari arsip.'); if(page==='archive')await renderArchives();else if(page==='profile')await renderProfile(profileTarget);else await renderHome(true); }
      else if (action === 'toggle-sound') { soundOn = !soundOn; pageContent.querySelectorAll('video[data-ohli-video]').forEach(function (v) { v.muted = wantMuted(v); }); shell.querySelectorAll('[data-action="toggle-sound"]').forEach(function (b) { b.innerHTML = ico(soundOn ? 'sound' : 'mute'); }); }
      else if (action === 'reel-comments') openReelComments(button.dataset.postId);
      else if (action === 'open-media') { var mp = findPost(button.dataset.postId); if (mp) openMedia(mp); }
      else if (action === 'repost') { var rd = await rt.request('/api/posts/repost', {method:'POST',body:{postId:button.dataset.postId}}); updatePost(rd.post); toast(rd.reposted ? 'Diposting ulang ke jaringanmu.' : 'Posting ulang dibatalkan.'); await rerenderContent(); }
      else if (action === 'reel-mode') { reelMode = button.dataset.mode === 'following' ? 'following' : 'foryou'; renderVideos(); }
      else if (action === 'sheet-close') closeSheet();
      else if (action === 'share-friend') shareDo('friend', button.dataset.phone, button);
      else if (action === 'share-wa') shareDo('wa');
      else if (action === 'share-copy') shareDo('copy');
      else if (action === 'share-native') shareDo('native');
      else if (action === 'like') { var d = await rt.request('/api/posts/like', {method:'POST',body:{postId:button.dataset.postId}}); updatePost(d.post); await rerenderContent(); }
      else if (action === 'comments') openReelComments(button.dataset.postId);
      else if (action === 'bookmark') { var bdata = await rt.request('/api/posts/bookmark', {method:'POST',body:{postId:button.dataset.postId}}); var p = findPost(button.dataset.postId); if (p) p.saved = !!bdata.saved; toast(bdata.saved ? 'Postingan disimpan ke koleksi pribadi.' : 'Postingan dikeluarkan dari koleksi pribadi.'); await rerenderContent(); }
      else if (action === 'share-post') openShare(button.dataset.postId);
      else if (action === 'delete-post') { if (confirm('Hapus postingan ini? Tindakan ini tidak dapat dibatalkan.')) { await rt.request('/api/posts/delete',{method:'POST',body:{postId:button.dataset.postId}}); posts = posts.filter(function (p) { return p.id !== button.dataset.postId; }); if (profileData) profileData.posts = (profileData.posts || []).filter(function (p) { return p.id !== button.dataset.postId; }); closeModal(); toast('Postingan dihapus dari server.'); if(page==='archive')await renderArchives();else if(page==='profile')await renderProfile(profileTarget);else await rerenderContent(); } }
      else if (action === 'load-more') { var next = nextBefore; if (!next || !hasMore) return; button.disabled = true; button.textContent = 'Memuat…'; var data = await rt.request('/api/feed?mode=' + encodeURIComponent(currentFeedMode) + '&before=' + encodeURIComponent(next)); var current = {}; posts.forEach(function (p) { current[p.id] = true; }); (data.posts || []).forEach(function (p) { if (!current[p.id]) posts.push(p); }); nextBefore = Number(data.nextBefore) || 0; hasMore = !!data.hasMore; var feedList = pageContent.querySelector('#ohliFeedList'); if (feedList) feedList.innerHTML = posts.length ? posts.map(postCard).join('') : empty('home','Belum ada postingan','Bagikan cerita pertamamu.','Buat postingan','compose-focus'); var moreBox = pageContent.querySelector('#ohliFeedMore'); if (moreBox) moreBox.innerHTML = hasMore ? '<button type="button" class="ohli-btn" data-action="load-more">Muat postingan lainnya</button>' : '<p class="ohli-hint">Kamu sudah melihat postingan yang tersedia untuk halaman ini.</p>'; }
      else if (action === 'profile') { closeModal(); setPage('profile',{phone:button.dataset.phone}); }
      else if (action === 'follow') { var currentMe = rt.getMe() || {}, followTarget = button.dataset.phone, isFollowing = button.dataset.following === '1'; if (!followTarget) return; var followData = await rt.request('/api/follow',{method:'POST',body:{target:followTarget,action:isFollowing?'unfollow':'follow'}}); toast(followData.requested ? 'Permintaan mengikuti telah dikirim.' : (followData.following ? 'Akun berhasil diikuti.' : 'Kamu berhenti mengikuti akun ini.')); users = (users || []).map(function(u){ if(u.phone===followTarget){u.isFollowing=!!followData.following;u.followRequested=!!followData.requested;} return u; }); if (page === 'profile' && profileTarget === followTarget) await renderProfile(followTarget); else if(page==='home') await renderHome(false); else await rerenderContent(); }
      else if (action === 'search-topic') { pageQuery = button.dataset.query || ''; searchInput.value = pageQuery; setPage('explore'); }
      else if (action === 'start-live') rt.startLive();
      else if (action === 'join-live') { var live = (await rt.request('/api/live')).lives || []; var selected = live.find(function (l) { return l.id === button.dataset.liveId; }); if (selected) rt.joinLive(selected); else toast('Siaran tidak lagi aktif.'); }
      else if (action === 'create-community' || action.indexOf('create-community:') === 0) { var kind = button.dataset.kind || action.split(':')[1] || 'group'; showCommunityForm(kind); }
      else if (action === 'join-community' || action === 'follow-channel') { var kind2 = action === 'join-community' ? 'group' : 'channel', endpoint = kind2 === 'group' ? '/api/groups/join' : '/api/channels/follow'; var dataJoin = await rt.request(endpoint,{method:'POST',body:{id:button.dataset.id,action:button.dataset.joined === '1' ? (kind2 === 'group' ? 'leave' : 'unfollow') : (kind2 === 'group' ? 'join' : 'follow')}}); toast(dataJoin.joined ? 'Kamu sudah bergabung.' : (kind2 === 'group' ? 'Kamu keluar dari grup.' : 'Kamu berhenti mengikuti channel.')); if(dataJoin.joined){if(kind2==='group')await openGroupChat(button.dataset.id);else await openChannel(button.dataset.id);}else await renderCommunities(kind2); }
      else if (action === 'mark-all-read') { await rt.request('/api/notifications/read',{method:'POST',body:{}}); toast('Notifikasi ditandai sudah dibaca.'); await renderNotifications(); }
      else if (action === 'open-notification') { await rt.request('/api/notifications/read',{method:'POST',body:{id:button.dataset.id}}); if (button.dataset.actor) setPage('profile',{phone:button.dataset.actor}); else setPage('home'); }
      else if (action === 'edit-profile') openEditProfile();
      else if (action === 'copy-profile') { var u = profileData && profileData.user; if (u && navigator.clipboard) { await navigator.clipboard.writeText(u.phone); toast('ID profil disalin.'); } else toast('ID: ' + ((profileData && profileData.user && profileData.user.phone) || '')); }
      else if (action === 'profile-privacy') await showPrivacySettings();
      else if (action === 'open-chat-user') { var phone = button.dataset.phone; shell.hidden = true; document.getElementById('app').hidden = false; rt.openChatWith(phone); var returnBtn = document.getElementById('ohliBackSocial'); if (returnBtn) returnBtn.style.display = ''; }
      else if (action === 'profile-stat') { var pc = shell.querySelector('#ohliProfileContent'); if (pc) pc.scrollIntoView({behavior:'smooth',block:'start'}); }
      else if (action === 'show-follow-list') await showFollowList(button.dataset.phone,button.dataset.type);
      else if (action === 'profile-views') await showProfileViews();
      else if (action === 'like-story') { var sl = await rt.request('/api/status/like',{method:'POST',body:{statusId:button.dataset.storyId}}); var stx = statusList.find(function(x){return x.id===button.dataset.storyId;}); if(stx){stx.liked=sl.liked;stx.likesCount=sl.likesCount;} var sb = shell.querySelector('#ohliStoryFoot [data-action="like-story"]'); if(sb){sb.classList.toggle('is-liked',sl.liked);sb.textContent=sl.liked?'♥ Disukai':'♡ Suka';} var stats = shell.querySelector('.ohli-story-stats');if(stats)stats.textContent=sl.likesCount+' suka'; }
      else if (action === 'story-viewers') await showStoryViewers(button.dataset.storyId);
      else if (action === 'story-highlight') createHighlightFromStory(button.dataset.storyId);
      else if (action === 'view-highlight') { var hh=(profileData.highlights||[]).find(function(x){return x.id===button.dataset.id;}); if(hh)openHighlight(hh); }
      else if (action === 'delete-highlight') { event.stopPropagation(); if(confirm('Hapus Sorotan ini dari profil?')){await rt.request('/api/highlights/delete',{method:'POST',body:{id:button.dataset.id}});await renderProfile(profileTarget);} }
      else if (action === 'contact-qr') openContactQr(button.dataset.phone || (rt.getMe()||{}).phone);
      else if (action === 'scan-contact-qr') openContactScanner();
      else if (action === 'change-password') await submitPasswordChange();
      else if (action === 'follow-requests') await showFollowRequests();
      else if (action === 'block-user') { var blockPhone=button.dataset.phone; if(!blockPhone)return; if(confirm('Blokir akun ini? Akun tersebut tidak dapat melihat profilmu atau menghubungimu.')){await rt.request('/api/blocks',{method:'POST',body:{phone:blockPhone,action:'block'}});closeStory();toast('Akun diblokir.');setPage('home');} }
      else if (action === 'blocked-list') await showBlockedList();
      else if (action === 'unblock-user') { await rt.request('/api/blocks',{method:'POST',body:{phone:button.dataset.phone,action:'unblock'}});toast('Blokir dibuka.');await showBlockedList(); }
      else if (action === 'follow-request-approve' || action === 'follow-request-reject') { await rt.request('/api/follow/requests',{method:'POST',body:{user:button.dataset.phone,action:action==='follow-request-approve'?'approve':'reject'}});toast(action==='follow-request-approve'?'Permintaan diizinkan.':'Permintaan ditolak.');await showFollowRequests(); }
      else if (action === 'refresh-group') await openGroupChat(button.dataset.id);
      else if (action === 'open-group') await openGroupChat(button.dataset.id);
      else if (action === 'open-channel') await openChannel(button.dataset.id);

      else if (action === 'profile-tab') { var tab = button.dataset.tab, target = shell.querySelector('#ohliProfileContent'); shell.querySelectorAll('[data-action="profile-tab"]').forEach(function (b) { b.classList.toggle('active', b === button); }); if (!target || !profileData) return; var ps = profileData.posts || [], qphone = encodeURIComponent(profileTarget); target.className = 'ohli-feed-column'; target.innerHTML = '<div class="ohli-loading"><div class="ohli-skeleton"></div></div>'; if (tab === 'saved' || tab === 'liked' || tab === 'reposted') { var ep = tab === 'saved' ? '/api/posts/saved?phone=' + qphone : (tab === 'liked' ? '/api/posts/liked?phone=' + qphone : '/api/posts/reposted?phone=' + qphone); var collection = await rt.request(ep); posts = collection.posts || []; target.innerHTML = posts.length ? posts.map(postCard).join('') : empty(tab === 'saved' ? 'bookmark' : 'heart', tab === 'saved' ? 'Belum ada yang disimpan' : (tab === 'liked' ? 'Belum ada postingan disukai' : 'Belum ada postingan ulang'), 'Konten akan muncul di sini ketika tersedia.'); return; } if (tab === 'media') { ps = ps.filter(function (p) { return !!p.mediaId; }); target.className = ''; target.innerHTML = mediaGrid(ps); return; } if (tab === 'highlights') { var hi = profileData.highlights || []; target.className = 'ohli-highlight-grid'; target.innerHTML = hi.length ? hi.map(function (h) { return '<button class="ohli-highlight-card" type="button" data-action="view-highlight" data-id="' + esc(h.id) + '"><span>' + (h.mediaId ? '<img src="' + esc(rt.mediaUrl(h.mediaId)) + '" alt="">' : '<b>OHLI</b>') + '</span><strong>' + esc(h.name) + '</strong>' + (profileTarget === (rt.getMe()||{}).phone ? '<i data-action="delete-highlight" data-id="' + esc(h.id) + '">×</i>' : '') + '</button>'; }).join('') : empty('story','Belum ada Sorotan','Simpan Story milikmu ke Sorotan agar tetap tampil di profil.'); return; } if (tab === 'media') return; if (tab === 'about') { target.innerHTML = '<div class="ohli-card ohli-rail-card"><div class="ohli-rail-title">Tentang</div><p class="ohli-profile-bio">' + esc((profileData.user && profileData.user.about) || 'Belum menambahkan bio.') + '</p><p class="ohli-hint">ID akun menggunakan nomor akun OHLI.</p></div>'; return; } target.innerHTML = ps.length ? ps.map(postCard).join('') : empty('profile','Belum ada konten','Konten pada tab ini akan muncul ketika tersedia.'); }
      else if (action === 'toggle-theme') toggleTheme();
      else if (action === 'legacy-settings') { goLegacy('chat'); rt.openLegacySettings(); }
      else if (action === 'check-health') await checkHealth();
      else if (action === 'retry') await renderPage();
    } catch (e) { toast(apiError(e)); }
  }

  async function handleSubmit(event) {
    var form = event.target;
    if (form.id === 'ohliComposeForm') {
      event.preventDefault(); var text = form.querySelector('[name="text"]').value.trim(), audience = shell.querySelector('#ohliAudience').value, file = selectedFile;
      if (!text && !file) { toast('Tulis postingan atau pilih foto/video terlebih dahulu.'); return; }
      var submit = form.querySelector('#ohliPostSubmit'); submit.disabled = true; submit.textContent = file ? 'Mengunggah…' : 'Memposting…';
      try { if (file) await rt.uploadPostMedia(file,text,audience); else await rt.request('/api/posts',{method:'POST',body:{text:text,audience:audience}}); selectedFile = null; nextBefore = 0; toast('Postingan berhasil disimpan di server.'); await renderHome(true); }
      catch (e) { toast(apiError(e)); }
      finally { var button = shell.querySelector('#ohliPostSubmit'); if (button) { button.disabled = false; button.innerHTML = ico('send') + ' Posting'; } }
    } else if (form.id === 'ohliStoryForm') {
      event.preventDefault(); var storyText = form.querySelector('[name="text"]').value.trim(), storyFile = selectedStatusFile;
      if (!storyText && !storyFile) { toast('Isi teks Story atau pilih foto/video.'); return; }
      var sb = form.querySelector('#ohliStorySubmit'); sb.disabled = true; sb.textContent = storyFile ? 'Mengunggah…' : 'Membagikan…';
      try { if (storyFile) await rt.uploadStatusMedia(storyFile,storyText); else await rt.request('/api/status',{method:'POST',body:{text:storyText}}); selectedStatusFile = null; toast('Story berhasil dibagikan.'); await renderStories(); }
      catch (e) { toast(apiError(e)); }
      finally { var liveBtn = shell.querySelector('#ohliStorySubmit'); if (liveBtn) { liveBtn.disabled = false; liveBtn.textContent = 'Bagikan Story'; } }
    } else if (form.id === 'ohliExploreForm') { event.preventDefault(); pageQuery = form.querySelector('[name="q"]').value.trim(); searchInput.value = pageQuery; await renderExplore(); }
    else if (form.hasAttribute('data-comment-post')) {
      event.preventDefault(); var comment = form.querySelector('[name="comment"]').value.trim(), postId = form.getAttribute('data-comment-post'); if (!comment) return;
      try { var data = await rt.request('/api/posts/comment',{method:'POST',body:{postId:postId,text:comment}}); updatePost(data.post); await rerenderContent(); }
      catch (e) { toast(apiError(e)); }
    }
  }

  function handleChange(event) {
    var target = event.target;
    if (target.id === 'ohliPostFile') { selectedFile = target.files && target.files[0] || null; var label = shell.querySelector('#ohliSelectedFileLabel'); if (label) label.textContent = selectedFile ? selectedFile.name + ' · ' + Math.ceil(selectedFile.size/1024/1024) + ' MB' : ''; if (selectedFile && selectedFile.size > 16*1024*1024) { toast('Ukuran maksimum media adalah 16 MB.'); selectedFile = null; target.value = ''; if (label) label.textContent = ''; } }
    if (target.id === 'ohliStatusFile') { selectedStatusFile = target.files && target.files[0] || null; var statusLabel = shell.querySelector('#ohliStoryFileLabel'); if (statusLabel) statusLabel.textContent = selectedStatusFile ? selectedStatusFile.name + ' · ' + Math.ceil(selectedStatusFile.size/1024/1024) + ' MB' : ''; if (selectedStatusFile && selectedStatusFile.size > 16*1024*1024) { toast('Ukuran maksimum media adalah 16 MB.'); selectedStatusFile = null; target.value = ''; if (statusLabel) statusLabel.textContent = ''; } }
  }

  function findPost(id) { var found = (posts || []).find(function (p) { return p.id === id; }); if (found) return found; return profileData && (profileData.posts || []).find(function (p) { return p.id === id; }) || null; }
  function updatePost(updated) { if (!updated) return; var found = false; posts = (posts || []).map(function (p) { if (p.id === updated.id) { found = true; return updated; } return p; }); if (!found && page === 'profile' && profileData) profileData.posts = (profileData.posts || []).map(function (p) { return p.id === updated.id ? updated : p; }); }
  async function rerenderContent() {
    var stg = shell.querySelector('.ohli-stage'), keep = stg ? stg.scrollTop : 0, l0 = pageContent.querySelector('#ohliFeedList'); if (l0) l0.style.minHeight = l0.offsetHeight + 'px';
    try { await rerenderInner(); } finally {
      if (stg) { stg.scrollTop = keep; requestAnimationFrame(function () { stg.scrollTop = keep; }); } if (l0) setTimeout(function () { l0.style.minHeight = ''; }, 900);
      var cs = shell.querySelector('.ohli-sheet-bg[data-cm]'); if (cs) { var inp = cs.querySelector('input[name="comment"]'); if (inp) inp.value = ''; openReelComments(cs.getAttribute('data-cm')); }
    }
  }
  async function rerenderInner() { if (page === 'archive') return renderArchives(); if (page === 'home') { var list = pageContent.querySelector('#ohliFeedList'); if (list) list.innerHTML = posts.length ? posts.map(postCard).join('') : empty('home','Belum ada postingan','Bagikan cerita pertamamu.','Buat postingan','compose-focus'); } else if (page === 'videos') { syncReels(); } else if (page === 'explore') await renderExplore(); else if (page === 'profile') await renderProfile(profileTarget); }

  async function showPrivacySettings() {
    var me=rt.getMe()||{}, current={};
    try { var fresh=await rt.request('/api/profile?phone='+encodeURIComponent(me.phone)); profileData=fresh; current=(fresh.user&&fresh.user.privacy)||{}; } catch(e) { toast(apiError(e)); return; }
    function opt(name,label,def,account){var v=current[name]||def;return '<label class="ohli-field">'+label+'<select name="'+name+'">'+(account?'<option value="public" '+(v==='public'?'selected':'')+'>Akun publik</option><option value="private" '+(v==='private'?'selected':'')+'>Akun privat</option>':'<option value="everyone" '+(v==='everyone'?'selected':'')+'>Semua orang</option><option value="followers" '+(v==='followers'?'selected':'')+'>Pengikut</option><option value="private" '+(v==='private'?'selected':'')+'>Hanya saya</option>')+'</select></label>';}
    var body='<form id="ohliPrivacyForm"><p class="ohli-hint">Akun privat hanya menampilkan postingan dan Sorotan kepada pengikut yang sudah disetujui. Permintaan pengikut perlu kamu setujui.</p>'+opt('account','Visibilitas akun','public',true)+opt('followers','Siapa yang dapat melihat daftar pengikut','everyone')+opt('following','Siapa yang dapat melihat daftar mengikuti','everyone')+opt('likes','Siapa yang dapat melihat postingan yang kamu sukai','everyone')+opt('saved','Siapa yang dapat melihat koleksi tersimpan','private')+'</form>';
    showModal('Privasi akun',body,'Simpan privasi',async function(content){var f=content.querySelector('#ohliPrivacyForm');if(!f.reportValidity())return;var d=Object.fromEntries(new FormData(f).entries());await rt.request('/api/settings/privacy',{method:'POST',body:d});closeModal();toast('Pengaturan privasi diperbarui.');if(page==='profile')await renderProfile(me.phone);else await renderSettings();});
  }

  async function showFollowList(phone,type){
    try{var d=await rt.request('/api/followers?phone='+encodeURIComponent(phone)+'&type='+encodeURIComponent(type));var list=d.users||[];var html=list.length?list.map(function(u){return '<div class="ohli-list-card">'+avatar(u.name,u.phone)+'<div class="ohli-list-copy"><strong>'+esc(u.name||u.phone)+'</strong><p>@'+esc(u.phone)+'</p></div><button class="ohli-btn" data-action="profile" data-phone="'+esc(u.phone)+'">Profil</button></div>';}).join(''):'<p class="ohli-hint">Daftar ini masih kosong.</p>';showModal(type==='followers'?'Pengikut':'Mengikuti','<div class="ohli-list-stack">'+html+'</div>','',null);}catch(e){toast(apiError(e));}
  }

  async function showProfileViews(){try{var d=await rt.request('/api/profile/views');var list=d.viewers||[];var html=list.length?list.map(function(v){return '<div class="ohli-list-card">'+avatar(v.name,v.phone)+'<div class="ohli-list-copy"><strong>'+esc(v.name||v.phone)+'</strong><p>'+Number(v.views||1)+' kali dilihat · terakhir '+esc(shortDate(v.lastSeen))+'</p></div><button class="ohli-btn" data-action="profile" data-phone="'+esc(v.phone)+'">Profil</button></div>';}).join(''):'<p class="ohli-hint">Belum ada kunjungan profil yang tercatat.</p>';showModal('Tayangan profil','<p class="ohli-hint">'+Number(d.viewsCount||0)+' tayangan dari '+Number(d.uniqueViewers||0)+' akun unik. Penghitungan dibatasi satu catatan per akun per hari.</p><div class="ohli-list-stack">'+html+'</div>','',null);}catch(e){toast(apiError(e));}}

  async function showStoryViewers(id){try{var d=await rt.request('/api/status/views?statusId='+encodeURIComponent(id));var list=d.viewers||[];var html=list.length?list.map(function(v){return '<div class="ohli-list-card">'+avatar(v.name,v.phone)+'<div class="ohli-list-copy"><strong>'+esc(v.name||v.phone)+'</strong><p>'+Number(v.views||1)+' kali diputar ulang · '+esc(shortDate(v.lastSeen))+'</p></div></div>';}).join(''):'<p class="ohli-hint">Belum ada penonton selain kamu.</p>';showModal('Penonton Story','<p class="ohli-hint">'+d.uniqueViewers+' akun unik · '+d.totalViews+' total tayangan termasuk replay.</p><div class="ohli-list-stack">'+html+'</div>','',null);}catch(e){toast(apiError(e));}}

  function createHighlightFromStory(id){var story=statusList.find(function(s){return s.id===id;});if(!story)return;var body='<form id="ohliHighlightForm"><label class="ohli-field">Nama Sorotan<input name="name" required maxlength="40" value="Momen spesial"></label><p class="ohli-hint">Story akan disimpan sebagai Sorotan dan tetap tampil di profil setelah Story 24 jam berakhir.</p></form>';showModal('Simpan ke Sorotan',body,'Simpan',async function(content){var f=content.querySelector('#ohliHighlightForm');if(!f.reportValidity())return;await rt.request('/api/highlights',{method:'POST',body:{statusId:id,name:f.elements.name.value.trim()}});closeModal();toast('Story ditambahkan ke Sorotan.');await renderProfile((rt.getMe()||{}).phone);});}

  function openHighlight(h){var streamed=!!(h.mimeType&&(/^(video|image)\//i).test(h.mimeType));var raw=h.mediaId?(streamed?rt.mediaUrl(h.mediaId):('/api/image?token='+encodeURIComponent(rt.getToken())+'&id='+encodeURIComponent(h.mediaId))):'';var u=esc(raw);var isVideo=h.mediaType==='video'||(h.mimeType||'').indexOf('video/')===0;var body=(h.mediaId?(isVideo?'<video src="'+u+'" controls playsinline style="width:100%;max-height:65vh"></video>':'<img src="'+u+'" alt="" style="width:100%;max-height:65vh;object-fit:contain">'):'')+(h.text?'<p class="ohli-post-text">'+esc(h.text)+'</p>':'');showModal(h.name,body,'',null);}

  async function submitPasswordChange(){var a=shell.querySelector('#ohliCurrentPassword'),b=shell.querySelector('#ohliNewPassword');if(!a||!b)return;if(a.value.length<6||b.value.length<6){toast('Isi kata sandi saat ini dan kata sandi baru minimal 6 karakter.');return;}try{await rt.request('/api/password',{method:'POST',body:{currentPassword:a.value,newPassword:b.value}});a.value='';b.value='';toast('Kata sandi berhasil diganti. Perangkat lain telah dikeluarkan.');}catch(e){toast(apiError(e));}}

  async function showBlockedList(){
    try{var d=await rt.request('/api/blocks'),list=d.users||[];var html=list.length?list.map(function(u){return '<div class="ohli-list-card">'+avatar(u.name,u.phone)+'<div class="ohli-list-copy"><strong>'+esc(u.name||u.phone)+'</strong><p>@'+esc(u.phone)+'</p></div><button type="button" class="ohli-btn" data-action="unblock-user" data-phone="'+esc(u.phone)+'">Buka blokir</button></div>';}).join(''):'<p class="ohli-hint">Belum ada akun yang diblokir.</p>';showModal('Daftar akun diblokir','<div class="ohli-list-stack">'+html+'</div>','',null);}catch(e){toast(apiError(e));}
  }
  async function showFollowRequests(){try{var d=await rt.request('/api/follow/requests'),list=d.requests||[];var html=list.length?list.map(function(u){return '<div class="ohli-list-card">'+avatar(u.name,u.phone)+'<div class="ohli-list-copy"><strong>'+esc(u.name||u.phone)+'</strong><p>@'+esc(u.phone)+'</p></div><button class="ohli-btn" data-action="follow-request-reject" data-phone="'+esc(u.phone)+'">Tolak</button><button class="ohli-btn ohli-btn-primary" data-action="follow-request-approve" data-phone="'+esc(u.phone)+'">Terima</button></div>';}).join(''):'<p class="ohli-hint">Belum ada permintaan mengikuti.</p>';showModal('Permintaan mengikuti','<div class="ohli-list-stack">'+html+'</div>','',null);}catch(e){toast(apiError(e));}}

  async function openGroupChat(id){
    try{var g=(groupItems||[]).find(function(x){return x.id===id;});var d=await rt.request('/api/groups/messages?groupId='+encodeURIComponent(id));g=d.group||g||{name:'Grup'};var list=d.messages||[];var body='<div class="ohli-group-thread" id="ohliGroupThread">'+(list.length?list.map(function(m){var mine=m.sender===(rt.getMe()||{}).phone;return '<div class="ohli-group-message '+(mine?'mine':'')+'"><b>'+esc(mine?'Kamu':m.name||m.sender)+'</b><p>'+esc(m.text)+'</p><small>'+esc(shortDate(m.time))+'</small></div>';}).join(''):'<p class="ohli-hint">Belum ada pesan. Mulai percakapan grup.</p>')+'</div><form id="ohliGroupMessageForm" class="ohli-comment-form"><input name="text" maxlength="2000" placeholder="Tulis pesan grup…" required><button type="submit">Kirim</button></form><button type="button" class="ohli-btn" data-action="refresh-group" data-id="'+esc(id)+'">Muat ulang pesan</button>';
      showModal('Chat · '+(g.name||'Grup'),body,'',null);var form=overlayContent.querySelector('#ohliGroupMessageForm');form.addEventListener('submit',async function(e){e.preventDefault();var input=form.elements.text,text=input.value.trim();if(!text)return;try{await rt.request('/api/groups/messages',{method:'POST',body:{groupId:id,text:text}});input.value='';await openGroupChat(id);}catch(err){toast(apiError(err));}});
    }catch(e){toast(apiError(e));}
  }

  async function openChannel(id){
    try{var c=(channelItems||[]).find(function(x){return x.id===id;});var d=await rt.request('/api/channels/posts?channelId='+encodeURIComponent(id));c=d.channel||c||{name:'Channel'};var list=d.posts||[],self=(rt.getMe()||{}).phone===(c.owner||'');var composer=self?'<form id="ohliChannelPostForm" class="ohli-comment-form"><input name="text" maxlength="2000" placeholder="Tulis pengumuman Channel…" required><button type="submit">Kirim</button></form>':'';var body=composer+'<div class="ohli-channel-posts" id="ohliChannelPosts">'+(list.length?list.map(function(p){return '<article class="ohli-card ohli-channel-post"><strong>'+esc(p.authorName||c.ownerName||'Admin')+'</strong><small>'+esc(shortDate(p.createdAt))+'</small><p>'+esc(p.text)+'</p></article>';}).join(''):'<p class="ohli-hint">Belum ada pengumuman dari Channel ini.</p>')+'</div>';
      showModal('Channel · '+(c.name||'OHLI'),body,'',null);var form=overlayContent.querySelector('#ohliChannelPostForm');if(form)form.addEventListener('submit',async function(e){e.preventDefault();var input=form.elements.text,text=input.value.trim();if(!text)return;try{await rt.request('/api/channels/posts',{method:'POST',body:{channelId:id,text:text}});input.value='';await openChannel(id);}catch(err){toast(apiError(err));}});
    }catch(e){toast(apiError(e));}
  }

  var qrStream=null,qrLoop=false,qrReader=null;
  var doubleTapPending={};
  function openContactQr(phone){var me=rt.getMe()||{};phone=phone||me.phone;if(phone!==me.phone){toast('QR profil akun lain belum dapat diterbitkan.');return;}var url='/api/contact-qr?token='+encodeURIComponent(rt.getToken())+'&v='+Date.now();showModal('QR kontak OHLI','<div class="ohli-qr-card"><img src="'+url+'" alt="QR kontak OHLI"><strong>'+esc(me.name||'Akun OHLI')+'</strong><span>'+esc(me.phone||'')+'</span><p>Pindai kode ini untuk menambahkan kontak OHLI.</p><button type="button" class="ohli-btn" data-action="scan-contact-qr">Pindai QR teman</button></div>','',null);}
  async function stopQrScanner(){qrLoop=false;if(qrReader){try{qrReader.reset();}catch(e){}qrReader=null;}if(qrStream){qrStream.getTracks().forEach(function(t){t.stop();});qrStream=null;}}
  function parseContactQr(raw){try{var d=JSON.parse(raw);if(d.type!=='ohli-contact'||!/^\d{8,15}$/.test(String(d.phone||'')))throw new Error('QR bukan kontak OHLI yang valid.');return d;}catch(e){throw new Error('QR tidak dikenali sebagai kontak OHLI.');}}
  async function importQrContact(raw){var d=parseContactQr(raw);await rt.request('/api/contacts',{method:'POST',body:{phone:d.phone,alias:d.name||''}});await stopQrScanner();closeModal();toast('Kontak '+(d.name||d.phone)+' berhasil ditambahkan.');}
  function showManualContactAdd(message){var body='<p class="ohli-hint">'+esc(message||'Pemindaian kamera tidak tersedia pada browser ini.')+'</p><label class="ohli-field">Nomor teman<input id="ohliManualQrPhone" inputmode="numeric" maxlength="15" placeholder="Nomor OHLI"></label>';showModal('Tambahkan kontak OHLI',body,'Tambahkan',async function(content){var field=content.querySelector('#ohliManualQrPhone'),ph=field.value.replace(/[^0-9]/g,'');if(!/^\d{8,15}$/.test(ph))throw new Error('Nomor harus 8–15 angka.');await rt.request('/api/contacts',{method:'POST',body:{phone:ph,alias:''}});closeModal();toast('Kontak berhasil ditambahkan.');});}
  function loadQrFallback(){return new Promise(function(resolve,reject){if(window.ZXingBrowser||window.ZXing){resolve(window.ZXingBrowser||window.ZXing);return;}var script=document.createElement('script');script.src='https://unpkg.com/@zxing/browser@0.1.5/umd/index.min.js';script.async=true;script.onload=function(){var api=window.ZXingBrowser||window.ZXing;if(api)resolve(api);else reject(new Error('Library pemindai tidak tersedia'));};script.onerror=function(){reject(new Error('Library pemindai QR tidak dapat dimuat'));};document.head.appendChild(script);});}
  async function openContactScanner(){
    await stopQrScanner();
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){showManualContactAdd('Browser menolak akses kamera. Gunakan HTTPS atau localhost, lalu izinkan kamera.');return;}
    showModal('Pindai QR kontak','<video id="ohliQrVideo" autoplay playsinline muted></video><p class="ohli-hint" id="ohliQrState">Meminta izin kamera…</p><button type="button" class="ohli-btn" data-action="close-modal">Tutup pemindai</button>','',null);
    try{
      qrStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
      var video=overlayContent.querySelector('#ohliQrVideo');video.srcObject=qrStream;await video.play();
      if('BarcodeDetector' in window){var detector=new BarcodeDetector({formats:['qr_code']});qrLoop=true;var busy=false;async function tick(){if(!qrLoop||!overlay||overlay.hidden||busy)return;try{var codes=await detector.detect(video);if(codes&&codes.length){busy=true;await importQrContact(codes[0].rawValue);return;}}catch(e){}if(qrLoop)requestAnimationFrame(tick);}requestAnimationFrame(tick);}
      else{
        var api=await loadQrFallback(),Reader=api.BrowserMultiFormatReader||api.BrowserQRCodeReader;if(!Reader)throw new Error('Pemindai QR tidak kompatibel');
        qrReader=new Reader();qrLoop=true;qrReader.decodeFromVideoElement(video,function(result,err){if(!qrLoop||!result)return;qrLoop=false;var raw=result.getText?result.getText():String(result.text||'');importQrContact(raw).catch(function(e){toast(apiError(e));});});
      }
      var note=overlayContent.querySelector('#ohliQrState');if(note)note.textContent='Arahkan kamera belakang ke QR kontak OHLI.';
    }catch(e){await stopQrScanner();showManualContactAdd((location.protocol!=='https:'&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'?'Kamera browser memerlukan HTTPS atau localhost. Alamat http://IP-lokal tidak mendapat izin kamera. ':'')+'Kamera atau pemindai tidak tersedia: '+(e.message||'periksa izin kamera')+'. Masukkan nomor teman secara manual.');}
  }

  function showCommunityForm(kind) {
    var isGroup = kind === 'group', title = isGroup ? 'Buat grup/komunitas' : 'Buat Channel';
    var body = '<form id="ohliCommunityForm"><div class="ohli-field"><label for="ohliCommunityName">NAMA</label><input id="ohliCommunityName" name="name" maxlength="70" minlength="2" required placeholder="Nama ' + (isGroup ? 'komunitas' : 'channel') + '"></div><div class="ohli-field"><label for="ohliCommunityDescription">DESKRIPSI</label><textarea id="ohliCommunityDescription" name="description" maxlength="500" placeholder="Tentang ' + (isGroup ? 'komunitas' : 'channel') + '"></textarea></div><div class="ohli-field"><label for="ohliCommunityPrivacy">AKSES</label><select id="ohliCommunityPrivacy" name="privacy"><option value="public">Publik</option><option value="private">Privat</option></select></div><p class="ohli-hint">' + (isGroup ? 'Anggota grup dapat bertukar pesan teks. Gunakan nama dan deskripsi yang mudah dikenali.' : 'Pemilik Channel dapat menerbitkan pengumuman teks kepada para pengikut.') + '</p></form>';
    showModal(title, body, 'Buat', async function (content) { var form = content.querySelector('#ohliCommunityForm'), data = Object.fromEntries(new FormData(form).entries()); if (!form.reportValidity()) return; await rt.request(isGroup?'/api/groups':'/api/channels',{method:'POST',body:data}); closeModal(); toast((isGroup?'Grup':'Channel') + ' dibuat.'); await renderCommunities(kind); });
  }

  // Legacy bridge so users can switch back without losing the existing chat screen/API.
  window.addEventListener('ohli-authenticated', function () { if (!shell) makeShell(); profileTarget = (rt.getMe() || {}).phone; showShell('home'); checkHealth(); });
  window.addEventListener('ohli-logged-out', function () { if (shell) shell.hidden = true; var app = document.getElementById('app'); if (app) app.hidden = true; });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { if (!shell) makeShell(); }); else makeShell();
  window.ohliSocial = { openHome:function(){ if (!shell) makeShell(); showShell('home'); }, navigate:function(p,phone){ if (!shell) makeShell(); showShell(p, phone ? {phone:phone} : undefined); } };


  document.addEventListener('keydown',function(e){var v=shell&&shell.querySelector('#ohliStoryViewer');if(!v||v.hidden)return;if(e.key==='ArrowLeft'){e.preventDefault();stepStory(-1);}else if(e.key==='ArrowRight'){e.preventDefault();stepStory(1);}else if(e.key==='Escape')closeStory();});
  (function bindStorySwipe(){var start=null;document.addEventListener('touchstart',function(e){var media=e.target.closest&&e.target.closest('#ohliStoryMedia');if(media&&e.touches&&e.touches.length===1)start={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});document.addEventListener('touchend',function(e){if(!start)return;var t=e.changedTouches&&e.changedTouches[0];if(t){var dx=t.clientX-start.x,dy=t.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.25)stepStory(dx<0?1:-1);}start=null;},{passive:true});})();

  /* v1.7: ketuk video = putar/jeda; ikon & progres; pasang pengamat video untuk semua halaman */
  document.addEventListener('click', function (e) {
    var w = e.target.closest && e.target.closest('#ohliSocialShell .ohli-vwrap'); if (!w || e.target.closest('[data-action]')) return;
    var v = w.querySelector('video'); if (!v) return;
    if (v.paused) playVid(v); else if (v.muted && soundOn && v.dataset.mute !== '1') { v.muted = false; needGesture = false; } else v.pause();
  });

  var lastMediaTap={id:'',time:0};
  async function doubleTapLike(postId,host){var p=findPost(postId);if(!p||p.liked||doubleTapPending[postId])return;doubleTapPending[postId]=true;try{var d=await rt.request('/api/posts/like',{method:'POST',body:{postId:postId}});updatePost(d.post);if(host){var heart=document.createElement('div');heart.className='ohli-double-heart';heart.textContent='♥';host.appendChild(heart);setTimeout(function(){heart.remove();},850);}await rerenderContent();}catch(e){toast(apiError(e));}finally{setTimeout(function(){delete doubleTapPending[postId];},450);}}
  document.addEventListener('click',function(e){var media=e.target.closest&&e.target.closest('.ohli-post-media, .ohli-reel .ohli-vwrap');if(!media||e.target.closest('[data-action]'))return;var card=media.closest('[data-post-card]');if(!card)return;var id=card.getAttribute('data-post-card'),now=Date.now();if(lastMediaTap.id===id&&now-lastMediaTap.time<360){lastMediaTap={id:'',time:0};doubleTapLike(id,media.parentElement||card);}else lastMediaTap={id:id,time:now};});

    function vstate(e, paused) { var v = e.target; if (!v || !v.matches || !v.matches('video[data-ohli-video]')) return; var w = v.closest('.ohli-vwrap'); if (w) w.classList.toggle('paused', paused); }
  document.addEventListener('play', function (e) { vstate(e, false); }, true);
  document.addEventListener('pause', function (e) { vstate(e, true); }, true);
  document.addEventListener('timeupdate', function (e) { var v = e.target, r = v && v.closest && v.closest('.ohli-reel'); if (r && v.duration) r.querySelector('.ohli-reel-bar i').style.width = (v.currentTime / v.duration * 100) + '%'; }, true);
  var vTimer = 0; new MutationObserver(function () { clearTimeout(vTimer); vTimer = setTimeout(initVideoObserver, 120); }).observe(document.body, {childList: true, subtree: true});

  /* ===== v1.9 ===== */
  function metaOf(p) { try { return p && p.meta ? (typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta) : null; } catch (e) { return null; } }
  function mediaOverlay(p) { var m = metaOf(p); if (!m || !m.items || !m.items.length) return ''; return '<div class="ohli-ovl">' + m.items.map(function (it) { return '<span class="ohli-ovl-item" style="left:' + (+it.x || 50) + '%;top:' + (+it.y || 50) + '%;font-size:' + (+it.s || 7) + 'cqw;color:' + esc(it.c || '#fff') + '">' + esc(it.t) + '</span>'; }).join('') + '</div>'; }
  function vAttrs(p) { var m = metaOf(p) || {}; return (m.mute ? ' data-mute="1"' : '') + (m.start ? ' data-start="' + (+m.start) + '"' : '') + (m.end ? ' data-end="' + (+m.end) + '"' : ''); }
  function vStyle(p) { var m = metaOf(p) || {}, r = {'1:1': '1/1', '4:5': '4/5', '9:16': '9/16'}[m.crop]; return r ? ' style="aspect-ratio:' + r + '"' : ''; }
  document.addEventListener('timeupdate', function (e) { var v = e.target; if (v && v.dataset && v.dataset.end && v.currentTime >= +v.dataset.end) v.currentTime = +v.dataset.start || 0; }, true);
  document.addEventListener('loadedmetadata', function (e) { var v = e.target; if (v && v.dataset && v.dataset.start) v.currentTime = +v.dataset.start; }, true);

  /* lembar bawah: komentar, bagikan, edit profil */
  function openSheet(html) { closeSheet(); var bg = document.createElement('div'); bg.className = 'ohli-sheet-bg'; bg.innerHTML = '<div class="ohli-sheet" role="dialog">' + html + '</div>'; shell.appendChild(bg); bg.addEventListener('click', function (e) { if (e.target === bg) closeSheet(); }); return bg; }
  function closeSheet() { var b = shell.querySelector('.ohli-sheet-bg'); if (b) b.remove(); reelCommentsId = null; }
  var X = '<button type="button" data-action="sheet-close" aria-label="Tutup">✕</button>';
  function commentsHtml(p) { return (p.comments || []).map(function (c) { return '<div class="ohli-comment">' + avatar(c.name, c.phone) + '<div class="ohli-comment-copy"><strong>' + esc(c.name || c.phone) + '</strong><p>' + esc(c.text) + '</p></div></div>'; }).join('') || '<p class="ohli-hint" style="text-align:center">Belum ada komentar. Jadilah yang pertama.</p>'; }
  function openReelComments(id) {
    var p = findPost(id); if (!p) return; var open = shell.querySelector('.ohli-sheet-bg[data-cm="' + id + '"]');
    if (open) { var l = open.querySelector('.ohli-sheet-list'); l.innerHTML = commentsHtml(p); open.querySelector('.ohli-sheet-title').textContent = Number(p.commentsCount || 0) + ' komentar'; l.scrollTop = l.scrollHeight; return; }
    var bg = openSheet('<div class="ohli-sheet-head"><strong class="ohli-sheet-title">' + Number(p.commentsCount || 0) + ' komentar</strong>' + X + '</div><div class="ohli-sheet-list">' + commentsHtml(p) + '</div><form class="ohli-comment-form ohli-sheet-form" data-comment-post="' + esc(id) + '"><input name="comment" maxlength="500" placeholder="Tambahkan komentar…" required autocomplete="off"><button type="submit" aria-label="Kirim">' + ico('send') + '</button></form>');
    bg.setAttribute('data-cm', id); reelCommentsId = id;
  }
  async function openShare(id) {
    var p = findPost(id); if (!p) return;
    var bg = openSheet('<div class="ohli-sheet-head"><strong>Bagikan</strong>' + X + '</div><div class="ohli-share-friends" id="shFriends"><span class="ohli-hint">Memuat teman…</span></div><div class="ohli-share-grid"><button type="button" data-action="share-wa">WhatsApp</button><button type="button" data-action="share-copy">Salin tautan</button><button type="button" data-action="share-native">Lainnya…</button></div>');
    bg.setAttribute('data-share', id);
    try { var c = await rt.request('/api/contacts'), list = c.contacts || c.users || [], t = bg.querySelector('#shFriends'); if (!t) return;
      t.innerHTML = list.length ? list.slice(0, 30).map(function (u) { return '<button type="button" data-action="share-friend" data-phone="' + esc(u.phone) + '">' + avatar(u.alias || u.name, u.phone) + '<span>' + esc((u.alias || u.name || u.phone).slice(0, 10)) + '</span></button>'; }).join('') : '<span class="ohli-hint">Belum ada kontak tersimpan. Gunakan WhatsApp atau salin tautan.</span>';
    } catch (e) { var t2 = bg.querySelector('#shFriends'); if (t2) t2.innerHTML = '<span class="ohli-hint">Daftar teman belum bisa dimuat.</span>'; }
  }
  async function shareDo(kind, phone, btn) {
    var bg = shell.querySelector('.ohli-sheet-bg[data-share]'); if (!bg) return; var id = bg.getAttribute('data-share'), p = findPost(id); if (!p) return;
    var link = location.origin + '/#post-' + encodeURIComponent(id), msg = (p.text ? p.text.slice(0, 80) + '\n' : '') + link, ok = false;
    try {
      if (kind === 'friend') { await rt.request('/api/messages', {method: 'POST', body: {recipient: phone, text: 'Lihat postingan ini di OHLI Social:\n' + link}}); toast('Terkirim ke teman.'); ok = true; }
      else if (kind === 'wa') { window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank'); ok = true; }
      else if (kind === 'copy') { try { await navigator.clipboard.writeText(link); } catch (e) { var ta = document.createElement('textarea'); ta.value = link; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); } toast('Tautan disalin.'); ok = true; }
      else if (kind === 'native') { if (navigator.share) { await navigator.share({title: 'OHLI Social', text: p.text || 'Postingan di OHLI Social', url: link}); ok = true; } else toast('Browser ini belum mendukung menu bagikan.'); }
    } catch (e) { if (e && e.name !== 'AbortError') toast(apiError(e)); }
    if (ok) { try { var d = await rt.request('/api/posts/share', {method: 'POST', body: {postId: id}}); updatePost(d.post); } catch (e2) { } closeSheet(); await rerenderContent(); }
  }
  async function openHashPost() {
    var m = /^#post-(.+)$/.exec(location.hash || ''); if (!m || !shell || !rt.getToken()) return; var id = decodeURIComponent(m[1]);
    try { var d = await rt.request('/api/feed?mode=public'), p = (d.posts || []).find(function (x) { return x.id === id; }); if (!p) { toast('Postingan tidak ditemukan atau tidak bisa kamu akses.'); return; }
      if (!findPost(id)) posts.push(p); setShellVisible(true); openSheet('<div class="ohli-sheet-head"><strong>Postingan</strong>' + X + '</div><div class="ohli-sheet-list">' + postCard(p) + '</div>'); history.replaceState(null, '', location.pathname);
    } catch (e) { }
  }
  window.addEventListener('load', function () { setTimeout(openHashPost, 2500); });

  /* edit profil: foto, latar (cover), hapus */
  function imgToB64(file, w, h, maxBytes) { return new Promise(function (res, rej) { var u = URL.createObjectURL(file), im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d'), k = Math.max(w / im.width, h / im.height), dw = im.width * k, dh = im.height * k; x.drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh); URL.revokeObjectURL(u); var q = 0.86, d; do { d = c.toDataURL('image/jpeg', q); q -= 0.08; } while (d.length * 0.75 > maxBytes && q > 0.3); res(d.split(',')[1]); }; im.onerror = function () { rej(new Error('Foto tidak dapat dibaca. Gunakan JPG atau PNG.')); }; im.src = u; }); }
  function openEditProfile() {
    var me = rt.getMe() || {}, tk = encodeURIComponent(rt.getToken()), ph = encodeURIComponent(me.phone || '');
    var bg = openSheet('<div class="ohli-sheet-head"><strong>Edit profil</strong>' + X + '</div><div class="ohli-sheet-list ohli-ep"><div class="ohli-ep-cover" id="epCover" style="background-image:url(/api/cover?phone=' + ph + '&token=' + tk + '&v=' + avatarVer + '),linear-gradient(135deg,#243b7a,#8b5cf6)"></div><div class="ohli-ep-av" id="epAv">' + avatar(me.name, me.phone, 'ohli-avatar-xl') + '</div><div class="ohli-ep-btns"><button type="button" class="ohli-btn" id="epAvPick">Ganti foto profil</button><button type="button" class="ohli-btn" id="epAvDel">Hapus foto</button><button type="button" class="ohli-btn" id="epCvPick">Ganti latar</button><button type="button" class="ohli-btn" id="epCvDel">Hapus latar</button></div><input type="file" id="epAvFile" accept="image/*" hidden><input type="file" id="epCvFile" accept="image/*" hidden><label class="ohli-field">Nama<input id="epName" maxlength="40" value="' + esc(me.name || '') + '"></label><label class="ohli-field">Bio<textarea id="epAbout" rows="2" maxlength="120">' + esc(me.about || '') + '</textarea></label><button type="button" class="ohli-btn ohli-btn-primary" id="epSave">Simpan</button></div>');
    function $(id) { return bg.querySelector('#' + id); }
    function refresh() { avatarVer = Date.now(); $('epCover').style.backgroundImage = 'url(/api/cover?phone=' + ph + '&token=' + tk + '&v=' + avatarVer + '),linear-gradient(135deg,#243b7a,#8b5cf6)'; $('epAv').innerHTML = avatar(me.name, me.phone, 'ohli-avatar-xl'); }
    async function send(path, body, okMsg) { try { await rt.request(path, {method: 'POST', body: body}); refresh(); toast(okMsg); } catch (e) { toast(apiError(e)); } }
    $('epAvPick').onclick = function () { $('epAvFile').click(); }; $('epCvPick').onclick = function () { $('epCvFile').click(); };
    $('epAvFile').onchange = async function () { var f = this.files[0]; if (!f) return; try { await send('/api/profile-photo', {data: await imgToB64(f, 400, 400, 170 * 1024)}, 'Foto profil diganti.'); } catch (e) { toast(apiError(e)); } };
    $('epCvFile').onchange = async function () { var f = this.files[0]; if (!f) return; try { await send('/api/cover-photo', {data: await imgToB64(f, 1000, 340, 170 * 1024)}, 'Latar profil diganti.'); } catch (e) { toast(apiError(e)); } };
    $('epAvDel').onclick = function () { send('/api/photo/remove', {kind: 'avatar'}, 'Foto profil dihapus.'); }; $('epCvDel').onclick = function () { send('/api/photo/remove', {kind: 'cover'}, 'Latar profil dihapus.'); };
    $('epSave').onclick = async function () { var name = $('epName').value.trim(), about = $('epAbout').value.trim(); if (!name) { toast('Nama tidak boleh kosong.'); return; }
      try { await rt.request('/api/profile', {method: 'POST', body: {name: name, about: about}}); me.name = name; me.about = about; var tn = shell.querySelector('#ohliTopName'); if (tn) tn.textContent = name; closeSheet(); toast('Profil disimpan.'); if (page === 'profile') setPage('profile', {phone: me.phone}); } catch (e) { toast(apiError(e)); } };
  }

  /* geser dari tepi kiri (Beranda) = menu pintasan */
  var swX = 0, swY = 0, swOn = false;
  document.addEventListener('touchstart', function (e) { var t = e.touches[0]; swOn = !!(shell && !shell.hidden && page === 'home' && t.clientX < 26); swX = t.clientX; swY = t.clientY; }, {passive: true});
  document.addEventListener('touchend', function (e) { if (!swOn) return; swOn = false; var t = e.changedTouches[0]; if (t.clientX - swX > 70 && Math.abs(t.clientY - swY) < 60) { var m = shell.querySelector('[data-action="more-menu"]'); if (m) m.click(); } }, {passive: true});

  /* ===== Buat konten: pilih foto/video, edit (teks, stiker, potong, crop, suara), bagikan ===== */
  var cr = null, CR_STICKERS = ['😀', '😂', '😍', '🔥', '❤️', '👍', '🎉', '😎', '🙏', '✨', '🌸', '🎵'];
  function renderCreate() {
    cr = {file: null, kind: '', items: [], crop: 'orig', mute: false, start: 0, end: 0, dur: 0, url: ''};
    pageContent.innerHTML = '<div class="ohli-create"><div class="ohli-card ohli-create-pick"><div class="ohli-empty-icon">' + ico('plus') + '</div><h3>Buat konten baru</h3><p class="ohli-hint">Pilih foto atau video dari galeri, lalu edit sebelum dibagikan. Ukuran video tidak dibatasi aplikasi.</p><button type="button" class="ohli-btn ohli-btn-primary" id="crPick">' + ico('image') + ' Pilih foto / video</button><button type="button" class="ohli-btn" id="crText">Tulis postingan teks</button><input type="file" id="crFile" accept="image/*,video/*" hidden></div></div>';
    var f = pageContent.querySelector('#crFile'); pageContent.querySelector('#crPick').onclick = function () { f.click(); };
    f.onchange = function () { var file = f.files[0]; if (!file) return; cr.file = file; cr.kind = file.type.indexOf('video/') === 0 ? 'video' : 'image'; cr.url = URL.createObjectURL(file); crEdit(); };
    pageContent.querySelector('#crText').onclick = function () { cr.kind = 'text'; crEdit(); };
  }
  function crStageSize() {
    var st = pageContent.querySelector('#crStage'); if (!st) return; var m = st.querySelector('img,video'); if (!m) return;
    var nat = cr.kind === 'video' ? (m.videoWidth && m.videoHeight ? m.videoWidth / m.videoHeight : 9 / 16) : (m.naturalWidth && m.naturalHeight ? m.naturalWidth / m.naturalHeight : 1);
    var r = {'1:1': 1, '4:5': 0.8, '9:16': 9 / 16}[cr.crop] || nat; st.style.aspectRatio = String(r); st.style.width = 'min(100%, calc(62vh * ' + r + '))';
  }
  function crEdit() {
    var root = pageContent.querySelector('.ohli-create'), isM = cr.kind !== 'text', isV = cr.kind === 'video';
    root.innerHTML = '<div class="ohli-editor">' + (isM ? '<div class="ohli-ed-stage ' + (isV ? 'ohli-vwrap' : '') + '" id="crStage">' + (isV ? '<video src="' + cr.url + '" autoplay muted loop playsinline></video>' : '<img src="' + cr.url + '" alt="">') + '<div class="ohli-ovl" id="crOvl"></div></div><div class="ohli-ed-tools"><button type="button" data-t="text">Aa Teks</button><button type="button" data-t="sticker">😊 Stiker</button>' + (isV ? '<button type="button" data-t="trim">✂ Potong</button>' : '') + '<button type="button" data-t="crop" id="crCropBtn">▢ Crop: Asli</button>' + (isV ? '<button type="button" data-t="mute" id="crMuteBtn">🔊 Suara: nyala</button>' : '') + '<button type="button" data-t="del" id="crDel" disabled>🗑 Hapus</button></div><div id="crPanel"></div>' : '') + '<textarea id="crCap" rows="3" maxlength="2000" placeholder="Tulis keterangan…"></textarea><div class="ohli-ed-row"><select id="crAud"><option value="public">Publik</option><option value="followers">Pengikut</option><option value="private">Hanya saya</option></select><button type="button" class="ohli-btn" id="crBack">Ganti</button><button type="button" class="ohli-btn ohli-btn-primary" id="crGo">Bagikan</button></div></div>';
    var q = function (id) { return root.querySelector(id); }, med = isM ? q('#crStage').querySelector('img,video') : null, panel = q('#crPanel');
    if (med) { med.onload = crStageSize; med.onloadedmetadata = function () { cr.dur = med.duration || 0; cr.end = cr.dur; crStageSize(); }; crStageSize(); }
    function addItem(t, sz) { cr.items.push({t: t, x: 50, y: 50, s: sz, c: '#ffffff'}); crRenderItems(); }
    function crRenderItems() { q('#crOvl').innerHTML = cr.items.map(function (it, i) { return '<span class="ohli-ovl-item" data-i="' + i + '" style="left:' + it.x + '%;top:' + it.y + '%;font-size:' + it.s + 'cqw;color:' + esc(it.c) + '">' + esc(it.t) + '</span>'; }).join(''); }
    if (isM) {
      q('#crOvl').addEventListener('pointerdown', function (e) {
        var el = e.target.closest('.ohli-ovl-item'); q('#crOvl').querySelectorAll('.ohli-ovl-item').forEach(function (n) { n.classList.toggle('sel', n === el); }); q('#crDel').disabled = !el; if (!el) return;
        var i = +el.dataset.i, st = q('#crStage').getBoundingClientRect(); try { el.setPointerCapture(e.pointerId); } catch (x) { }
        function mv(ev) { cr.items[i].x = Math.max(4, Math.min(96, (ev.clientX - st.left) / st.width * 100)); cr.items[i].y = Math.max(4, Math.min(96, (ev.clientY - st.top) / st.height * 100)); el.style.left = cr.items[i].x + '%'; el.style.top = cr.items[i].y + '%'; }
        function up() { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerup', up); } el.addEventListener('pointermove', mv); el.addEventListener('pointerup', up);
      });
      root.querySelector('.ohli-ed-tools').addEventListener('click', function (e) {
        var b = e.target.closest('[data-t]'); if (!b) return; var t = b.dataset.t; panel.innerHTML = '';
        if (t === 'text') { var v = prompt('Tulis teks:'); if (v && v.trim()) addItem(v.trim().slice(0, 60), 7); }
        else if (t === 'sticker') { panel.innerHTML = '<div class="ohli-ed-stickers">' + CR_STICKERS.map(function (s2) { return '<button type="button" data-s="' + s2 + '">' + s2 + '</button>'; }).join('') + '</div>'; panel.onclick = function (ev) { var sb = ev.target.closest('[data-s]'); if (sb) addItem(sb.dataset.s, 16); }; }
        else if (t === 'trim' && cr.dur) { panel.innerHTML = '<label class="ohli-hint">Mulai <input type="range" id="crS" min="0" max="' + cr.dur + '" step="0.1" value="' + cr.start + '"></label><label class="ohli-hint">Selesai <input type="range" id="crE" min="0" max="' + cr.dur + '" step="0.1" value="' + cr.end + '"></label><p class="ohli-hint">Video diputar hanya pada bagian ini.</p>';
          var rs = panel.querySelector('#crS'), re2 = panel.querySelector('#crE'); function upd() { cr.start = Math.min(+rs.value, +re2.value - 0.5); cr.end = Math.max(+re2.value, cr.start + 0.5); med.dataset.start = cr.start; med.dataset.end = cr.end; med.currentTime = cr.start; } rs.oninput = upd; re2.oninput = upd; }
        else if (t === 'crop') { var o = ['orig', '1:1', '4:5', '9:16'], nm = {orig: 'Asli', '1:1': '1:1', '4:5': '4:5', '9:16': '9:16'}; cr.crop = o[(o.indexOf(cr.crop) + 1) % 4]; b.textContent = '▢ Crop: ' + nm[cr.crop]; crStageSize(); }
        else if (t === 'mute') { cr.mute = !cr.mute; b.textContent = cr.mute ? '🔇 Suara: mati' : '🔊 Suara: nyala'; if (med) med.muted = cr.mute; }
        else if (t === 'del') { var sel = q('#crOvl').querySelector('.ohli-ovl-item.sel'); if (sel) { cr.items.splice(+sel.dataset.i, 1); crRenderItems(); q('#crDel').disabled = true; } }
      });
    }
    q('#crBack').onclick = renderCreate;
    q('#crGo').onclick = async function () {
      var btn = this, cap = q('#crCap').value.trim(), aud = q('#crAud').value; if (cr.kind === 'text' && !cap) { toast('Tulis sesuatu dulu.'); return; }
      btn.disabled = true; btn.textContent = 'Mengunggah…';
      try {
        if (cr.kind === 'text') await rt.request('/api/posts', {method: 'POST', body: {text: cap, audience: aud}});
        else if (cr.kind === 'image') await rt.uploadPostMedia(cr.items.length || cr.crop !== 'orig' ? await crBakeImage() : cr.file, cap, aud);
        else {
          var meta = {}; if (cr.items.length) meta.items = cr.items.map(function (it) { return {t: it.t, x: +it.x.toFixed(1), y: +it.y.toFixed(1), s: it.s, c: it.c}; });
          if (cr.crop !== 'orig') meta.crop = cr.crop; if (cr.mute) meta.mute = 1; if (cr.start > 0.05) meta.start = +cr.start.toFixed(2); if (cr.dur && cr.end < cr.dur - 0.05) meta.end = +cr.end.toFixed(2);
          var m = Object.keys(meta).length ? JSON.stringify(meta) : ''; if (m.length > 1400) throw new Error('Terlalu banyak teks/stiker. Kurangi dulu.');
          await rt.uploadPostMedia(cr.file, cap, aud, m);
        }
        toast('Berhasil dibagikan.'); setPage('home');
      } catch (e) { toast(apiError(e)); btn.disabled = false; btn.textContent = 'Bagikan'; }
    };
  }
  function crBakeImage() {
    return new Promise(function (res, rej) {
      var img = new Image(); img.onload = function () {
        var r = {'1:1': 1, '4:5': 0.8, '9:16': 9 / 16}[cr.crop] || (img.width / img.height), W = Math.min(1440, cr.crop === 'orig' ? img.width : 1080), H = Math.round(W / r), c = document.createElement('canvas'); c.width = W; c.height = H;
        var x = c.getContext('2d'), k = Math.max(W / img.width, H / img.height), dw = img.width * k, dh = img.height * k; x.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh); x.textAlign = 'center'; x.textBaseline = 'middle';
        cr.items.forEach(function (it) { var fs = it.s / 100 * W; x.font = '800 ' + fs + 'px system-ui,sans-serif'; x.fillStyle = it.c || '#fff'; x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = fs / 6; x.fillText(it.t, W * it.x / 100, H * it.y / 100); });
        c.toBlob(function (b) { b ? res(new File([b], 'foto.jpg', {type: 'image/jpeg'})) : rej(new Error('Gagal memproses foto.')); }, 'image/jpeg', 0.9);
      }; img.onerror = function () { rej(new Error('Foto tidak bisa diedit di browser ini. Hapus teks/crop lalu coba lagi.')); }; img.src = cr.url;
    });
  }
})();

/* v1.8: tandai layar percakapan (chat-open) supaya bar tab HP disembunyikan dan kolom pesan selalu tampil */
(function () {
  var app = document.getElementById('app'); if (!app) return; var q = 0;
  function sync() {
    q = 0; var cm = app.querySelector('.main .compose');
    var open = !!(cm && !cm.classList.contains('hidden') && app.classList.contains('page-open'));
    if (app.classList.contains('chat-open') !== open) app.classList.toggle('chat-open', open);
  }
  new MutationObserver(function () { if (!q) q = requestAnimationFrame(sync); }).observe(app, {subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden']});
  sync();
})();

/* v1.9: balas ala WhatsApp (bar kutipan), kutipan di balon, dan pengecil foto latar */
(function () {
  window.shrinkImage = function (file, maxW, q) { return new Promise(function (res, rej) { var u = URL.createObjectURL(file), im = new Image(); im.onload = function () { var k = Math.min(1, maxW / im.width), c = document.createElement('canvas'); c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(u); res(c.toDataURL('image/jpeg', q || 0.7)); }; im.onerror = function () { rej(new Error('x')); }; im.src = u; }); };
  window.setReplyTarget = function (name, text) {
    window.__reply = {name: String(name || ''), text: String(text || '')}; var c = document.querySelector('#app .main .compose'); if (!c) return;
    var bar = document.getElementById('waReplyBar'); if (!bar) { bar = document.createElement('div'); bar.id = 'waReplyBar'; bar.className = 'wa-replybar'; c.parentNode.insertBefore(bar, c); }
    bar.innerHTML = '<div class="q"><b></b><span></span></div><button type="button" aria-label="Batalkan balasan">✕</button>'; bar.querySelector('b').textContent = window.__reply.name; bar.querySelector('span').textContent = window.__reply.text.slice(0, 140); bar.querySelector('button').onclick = window.clearReply;
    var i = document.getElementById('messageInput'); if (i) i.focus();
  };
  window.clearReply = function () { window.__reply = null; var b = document.getElementById('waReplyBar'); if (b) b.remove(); };
  var mb = document.getElementById('mainBody');
  if (mb) new MutationObserver(function () {
    mb.querySelectorAll('.bubble-text:not([data-q])').forEach(function (el) {
      el.setAttribute('data-q', '1'); var m = /^↩\uFE0F?\s([^:\n]{1,40}):\s([^\n]*)\n([\s\S]*)$/.exec(el.textContent || ''); if (!m) return;
      el.textContent = ''; var q = document.createElement('div'); q.className = 'wa-quote'; var b = document.createElement('b'); b.textContent = m[1]; var s = document.createElement('span'); s.textContent = m[2]; q.appendChild(b); q.appendChild(s);
      var r = document.createElement('div'); r.textContent = m[3]; el.appendChild(q); el.appendChild(r);
    });
  }).observe(mb, {childList: true, subtree: true});
})();
