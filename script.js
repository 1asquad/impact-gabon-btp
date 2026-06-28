const pageName = document.body.dataset.page || '';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const contactInfo = {
  address: 'Akanda Libreville Gabon',
  phones: [
    { label: '00241077853711', href: 'tel:00241077853711' },
    { label: '0024177431326', href: 'tel:0024177431326' },
    { label: '0033758306538', href: 'tel:0033758306538' }
  ],
  email: 'impact.gabonbtp@gmail.com',
  whatsapp: {
    label: '0033788397249',
    href: 'https://wa.me/33788397249'
  },
  tiktok: 'https://www.tiktok.com/@impact.btp.gabon?_r=1&_t=ZN-97V0LAjyrQ6'
};

function initCookieConsent() {
  const banner = document.getElementById('cookieBanner');
  const acceptBtn = document.getElementById('cookieAccept');
  if (!banner || !acceptBtn) return;
  
  if (!localStorage.getItem('cookie-consent')) {
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('show'));
  }
  
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookie-consent', 'accepted');
    banner.classList.remove('show');
    setTimeout(() => banner.hidden = true, 350);
  });
}

const navItems = [
  { page: 'accueil', label: 'Accueil', href: 'index.html' },
  {
    label: 'Entreprise',
    groups: [
      {
        title: 'Impact BTP',
        links: [
          ['À propos', 'apropos.html'],
          ['Avis clients', 'avis.html'],
          ['Contact', 'contact.html']
        ]
      }
    ],
    preview: ['photos/used/equipe-impact-btp-terrain.jpg', 'Notre histoire', 'Une équipe locale pour lire le terrain, cadrer le besoin et suivre les travaux.', 'apropos.html']
  },
  {
    label: 'Services',
    wide: true,
    groups: [
      {
        title: 'Services terrain',
        links: [
          ['Voiries secondaires', 'services.html#voiries'],
          ['Pistes rurales', 'services.html#pistes'],
          ['Terrassement', 'services.html#terrassement'],
          ['Drainage', 'services.html#drainage']
        ]
      },
      {
        title: 'Interventions',
        links: [
          ['Accès de chantier', 'services.html#acces'],
          ['Entretien des voiries', 'services.html#entretien'],
          ['Aménagements urbains', 'services.html#urbain'],
          ['Demander un devis', 'devis.html']
        ]
      }
    ],
    preview: ['photos/used/hero-terrassement-engin.jpg', 'Services terrain', 'Voiries, pistes, terrassement et drainage adaptés aux réalités du site.', 'services.html']
  },
  {
    label: 'Travaux',
    groups: [
      {
        title: 'Réalisations',
        links: [
          ['Avant / Après', 'realisations.html#avant-apres'],
          ['Suivi chantier', 'realisations.html#chantier'],
          ['Galerie terrain', 'realisations.html#galerie']
        ]
      }
    ],
    preview: ['photos/used/voirie-beton-finale.jpg', 'Réalisations', "Des transformations visibles, de l'accès difficile au passage praticable.", 'realisations.html']
  }
];

function isActive(page) {
  if (!page) return false;
  if (pageName === page) return true;
  if (page === 'accueil' && pageName === 'home') return true;
  return false;
}

function createHeader() {
  const mount = document.getElementById('siteHeader');
  if (!mount) return;

  const navMarkup = navItems.map((item) => {
    if (item.href) {
      return `<a class="nav-link ${isActive(item.page) ? 'is-active' : ''}" href="${item.href}">${item.label}</a>`;
    }

    const groupMarkup = item.groups.map(group => `
      <div class="mega-col">
        <p>${group.title}</p>
        ${group.links.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
      </div>
    `).join('');

    const [img, badge, text, href] = item.preview;
    return `
      <div class="nav-item">
        <button class="nav-trigger" type="button" aria-expanded="false">${item.label}</button>
        <div class="mega-menu ${item.wide ? 'mega-wide' : ''}">
          ${groupMarkup}
          <a class="mega-preview" href="${href}">
            <img src="${img}" width="1280" height="720" loading="lazy" decoding="async" alt="${badge} - Impact BTP Gabon Plus">
            <span>${badge}</span>
            <strong>${text}</strong>
          </a>
        </div>
      </div>
    `;
  }).join('');

  const hiddenMobileLabels = new Set(['Contact', 'Demander un devis']);
  const mobileMarkup = navItems.map((item) => {
    if (hiddenMobileLabels.has(item.label)) return '';

    if (item.href) {
      return `<a class="${isActive(item.page) ? 'is-active' : ''}" href="${item.href}">${item.label}</a>`;
    }

    return `
      <div class="mobile-nav-section">
        <button class="mobile-accordion-trigger" type="button" aria-expanded="false">
          <span>${item.label}</span>
          <i data-lucide="chevron-down"></i>
        </button>
        <div class="mobile-accordion-panel">
          <div class="mobile-accordion-inner">
          ${item.groups.map(group => `
            <div class="mobile-subgroup">
              <p>${group.title}</p>
              ${group.links
                .filter(([label]) => !hiddenMobileLabels.has(label))
                .map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}
            </div>
          `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  mount.innerHTML = `
    <header class="site-header">
      <div class="site-header-inner">
        <a class="brand" href="index.html" aria-label="Impact BTP Gabon Plus">
          <img src="photos/logos/logoibtppaysagervb.png" width="3308" height="1124" alt="Impact BTP Gabon Plus">
        </a>
        <nav class="desktop-nav" aria-label="Navigation principale">
          ${navMarkup}
        </nav>
        <a class="nav-cta desktop-cta" href="devis.html"><i data-lucide="file-text"></i> Demander un devis</a>
        <button id="menuBtn" class="menu-toggle" type="button" aria-label="Ouvrir le menu">
          <i data-lucide="menu" class="w-6 h-6"></i>
        </button>
      </div>
    </header>
    <aside id="mobileMenu" class="mobile-menu" aria-label="Navigation mobile">
      <div class="mobile-menu-head">
        <button id="closeMenu" class="mobile-close" type="button" aria-label="Fermer le menu">
          <i data-lucide="x"></i>
        </button>
      </div>
      <div class="mobile-links">
        ${mobileMarkup}
        <div class="mobile-actions">
          <a class="mobile-primary-cta" href="devis.html"><i data-lucide="file-text"></i> Demander un devis</a>
          <a class="mobile-secondary-cta" href="contact.html"><i data-lucide="phone-call"></i> Contact</a>
        </div>
        <div class="mobile-socials">
          <span>Suivez-nous</span>
          <div class="mobile-social-links">
            <a class="mobile-social-link" href="${contactInfo.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 3c.4 2.7 1.9 4.3 4.8 4.5v3.4c-1.7.1-3.2-.4-4.7-1.4v6.3c0 3.2-2.1 5.2-5.1 5.2-3 0-5.2-2-5.2-4.8 0-3.2 2.4-5.1 6-4.8v3.5c-1.6-.3-2.5.2-2.5 1.3 0 .9.7 1.5 1.7 1.5 1.1 0 1.7-.7 1.7-2V3h3.3Z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </aside>
    <div id="menuOverlay" class="menu-overlay"></div>
  `;
}

function createFooter() {
  const mount = document.getElementById('siteFooter');
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-brand-block">
            <a class="footer-logo" href="index.html" aria-label="Impact BTP Gabon Plus - Accueil">
              <img src="photos/logos/logoibtppaysagervb.png" width="3308" height="1124" loading="lazy" decoding="async" alt="Impact BTP Gabon Plus">
            </a>
            <p>Entreprise gabonaise spécialisée dans la construction et la réhabilitation de voiries secondaires et pistes rurales.</p>
            <strong>Impactons ensemble l'avenir du Gabon.</strong>
            <div class="footer-brand-marks" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              <li><a href="services.html#voiries">Voiries secondaires</a></li>
              <li><a href="services.html#pistes">Pistes rurales</a></li>
              <li><a href="services.html#terrassement">Terrassement et compactage</a></li>
              <li><a href="services.html#drainage">Assainissement et drainage</a></li>
              <li><a href="services.html#acces">Accès de chantier</a></li>
              <li><a href="services.html#entretien">Entretien des voiries</a></li>
              <li><a href="services.html#urbain">Aménagements urbains</a></li>
            </ul>
          </div>
          <div>
            <h3>Navigation</h3>
            <ul>
              <li><a href="index.html">Accueil</a></li>
              <li><a href="apropos.html">À propos</a></li>
              <li><a href="services.html">Nos services</a></li>
              <li><a href="realisations.html">Réalisations</a></li>
              <li><a href="avis.html">Avis clients</a></li>
              <li><a href="devis.html">Demande de devis</a></li>
              <li><a href="contact.html">Contact</a></li>
            </ul>
          </div>
          <div class="footer-contact-block">
            <h3>Contact</h3>
            <ul class="footer-contact-list">
              <li class="footer-contact-item">
                <i data-lucide="map-pin"></i>
                <span>
                  <small>Adresse</small>
                  ${contactInfo.address}
                </span>
              </li>
              <li class="footer-contact-item">
                <i data-lucide="phone"></i>
                <span>
                  <small>Téléphones</small>
                  <span class="footer-phone-links">
                    ${contactInfo.phones.map(phone => `<a href="${phone.href}">${phone.label}</a>`).join('')}
                  </span>
                </span>
              </li>
              <li class="footer-contact-item">
                <i data-lucide="mail"></i>
                <span>
                  <small>Email</small>
                  <a href="mailto:${contactInfo.email}">${contactInfo.email}</a>
                </span>
              </li>
              <li class="footer-contact-item">
                <svg class="footer-contact-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5A8.3 8.3 0 0 0 5 16.3L4 20.5l4.3-1A8.3 8.3 0 1 0 12 3.5Zm0 2.1a6.2 6.2 0 0 1 5.3 9.4 6.2 6.2 0 0 1-7.9 2.2l-.4-.2-2.2.5.5-2.1-.3-.5A6.2 6.2 0 0 1 12 5.6Zm-2.3 3.1c-.2 0-.5.1-.7.4-.2.3-.8 1-.8 2.1 0 1.2.8 2.3.9 2.5.1.1 1.7 2.8 4.2 3.7 2 .7 2.4.4 2.8.4.4 0 1.3-.6 1.5-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3l-1.5-.8c-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.7-.7-1.2-1.5-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.4Z"/></svg>
                <span>
                  <small>WhatsApp</small>
                  <a href="${contactInfo.whatsapp.href}" target="_blank" rel="noopener">${contactInfo.whatsapp.label}</a>
                </span>
              </li>
            </ul>
            <div class="footer-social">
              <h3>Suivez-nous</h3>
              <div class="social-links">
                <a class="social-link social-tiktok" href="${contactInfo.tiktok}" target="_blank" rel="noopener" aria-label="TikTok">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 3c.4 2.7 1.9 4.3 4.8 4.5v3.4c-1.7.1-3.2-.4-4.7-1.4v6.3c0 3.2-2.1 5.2-5.1 5.2-3 0-5.2-2-5.2-4.8 0-3.2 2.4-5.1 6-4.8v3.5c-1.6-.3-2.5.2-2.5 1.3 0 .9.7 1.5 1.7 1.5 1.1 0 1.7-.7 1.7-2V3h3.3Z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Impact BTP Gabon Plus. Tous droits réservés.</span>
          <span><a href="mentions-legales.html">Mentions légales</a> · <a href="confidentialite.html">Confidentialité</a></span>
        </div>
      </div>
    </footer>
    <button id="backToTop" class="back-to-top" type="button" aria-label="Retour en haut">
      <i data-lucide="chevron-up" class="w-5 h-5"></i>
    </button>
  `;
}

function initNavigation() {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenu = document.getElementById('closeMenu');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const dropdownItems = document.querySelectorAll('.nav-item');
  const mobileAccordions = document.querySelectorAll('.mobile-nav-section');
  let closeTimer;

  function openMobile() {
    mobileMenu?.classList.add('open');
    overlay?.classList.add('show');
    document.body.classList.add('menu-locked');
    const firstLink = mobileMenu?.querySelector('a');
    setTimeout(() => firstLink?.focus(), 150);
  }

  function closeMobile() {
    mobileMenu?.classList.remove('open');
    overlay?.classList.remove('show');
    document.body.classList.remove('menu-locked');
    menuBtn?.focus();
  }

  function closeMobileAccordions(except) {
    mobileAccordions.forEach(section => {
      if (section === except) return;
      section.classList.remove('is-open');
      section.querySelector('.mobile-accordion-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }

  function closeDropdowns() {
    dropdownItems.forEach(item => {
      item.classList.remove('is-open');
      item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
  }

  function openDropdown(item) {
    window.clearTimeout(closeTimer);
    dropdownItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('is-open');
        other.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      }
    });
    item.classList.add('is-open');
    item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'true');
  }

  menuBtn?.addEventListener('click', openMobile);
  closeMenu?.addEventListener('click', closeMobile);
  overlay?.addEventListener('click', closeMobile);
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobile));
  mobileAccordions.forEach(section => {
    const trigger = section.querySelector('.mobile-accordion-trigger');
    trigger?.addEventListener('click', () => {
      const willOpen = !section.classList.contains('is-open');
      closeMobileAccordions(section);
      section.classList.toggle('is-open', willOpen);
      trigger.setAttribute('aria-expanded', String(willOpen));
    });
  });

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('.nav-trigger');
    item.addEventListener('pointerenter', () => {
      if (window.matchMedia('(min-width: 1024px)').matches) openDropdown(item);
    });
    item.addEventListener('pointerleave', () => {
      if (window.matchMedia('(min-width: 1024px)').matches) {
        closeTimer = window.setTimeout(closeDropdowns, 180);
      }
    });
    trigger?.addEventListener('click', event => {
      event.stopPropagation();
      if (item.classList.contains('is-open')) closeDropdowns();
      else openDropdown(item);
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeDropdowns();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeDropdowns();
      closeMobile();
    }
  });
}

function initReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => observer.observe(el));
}

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide-bg');
  const contents = document.querySelectorAll('.hero-slide-content');
  const dots = document.querySelectorAll('.hero-dot');
  const progress = document.getElementById('heroProg');
  if (!slides.length || !contents.length) return;

  let current = 0;
  let timer;

  function animateContent(index) {
    contents[index].querySelectorAll('.hero-word, .hero-line, .hero-fade').forEach(el => {
      el.classList.remove('go');
      void el.offsetWidth;
      el.classList.add('go');
    });
  }

  function goTo(index) {
    slides[current].classList.remove('on');
    contents[current].classList.remove('on');
    dots[current]?.classList.remove('on');
    contents[current].querySelectorAll('.hero-word, .hero-line, .hero-fade').forEach(el => el.classList.remove('go'));

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('on');
    contents[current].classList.add('on');
    dots[current]?.classList.add('on');
    if (progress) {
      progress.classList.remove('run');
      void progress.offsetWidth;
      progress.classList.add('run');
    }
    setTimeout(() => animateContent(current), 50);
  }

  function start() {
    if (prefersReducedMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => goTo(current + 1), 6000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.goto, 10) || 0);
      start();
    });
  });

  animateContent(0);
  start();
}

function initBeforeAfter() {
  const container = document.getElementById('baSlider1');
  const after = document.getElementById('baAfter1');
  const handle = document.getElementById('baHandle1');
  if (!container || !after || !handle) return;

  let dragging = false;

  function update(clientX) {
    const rect = container.getBoundingClientRect();
    let pos = (clientX - rect.left) / rect.width;
    pos = Math.max(0.06, Math.min(0.94, pos));
    after.style.width = `${pos * 100}%`;
    after.style.setProperty('--ba-width', `${rect.width}px`);
    handle.style.left = `${pos * 100}%`;
  }

  requestAnimationFrame(() => update(container.getBoundingClientRect().left + container.getBoundingClientRect().width / 2));
  container.addEventListener('pointerdown', event => {
    dragging = true;
    container.setPointerCapture?.(event.pointerId);
    update(event.clientX);
  });
  container.addEventListener('pointermove', event => {
    if (dragging) update(event.clientX);
  });
  container.addEventListener('pointerup', () => dragging = false);
  container.addEventListener('pointercancel', () => dragging = false);
}

function initForms() {
  const fileDrop = document.getElementById('fileDrop');
  const fileInput = document.getElementById('fileInput');
  const fileList = document.getElementById('fileList');
  const forms = document.querySelectorAll('form[data-formsubmit-form]');

  function showToast(message, isError = false) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.innerHTML = '<i data-lucide="check-circle"></i><span></span>';
      document.body.appendChild(toast);
    }
    const icon = toast.querySelector('i');
    const text = toast.querySelector('span');
    if (text) text.textContent = message;
    if (icon) {
      icon.setAttribute('data-lucide', isError ? 'alert-circle' : 'check-circle');
    }
    toast.classList.toggle('is-error', isError);

    // Reset animation
    toast.classList.remove('show');
    void toast.offsetWidth;
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 5000);
  }

  function addFiles(files) {
    if (!fileList) return;
    Array.from(files).forEach(file => {
      const item = document.createElement('div');
      item.className = 'file-chip';
      item.innerHTML = `<span><i data-lucide="paperclip" class="w-4 h-4"></i> ${file.name}</span><button type="button" aria-label="Retirer le fichier"><i data-lucide="x" class="w-4 h-4"></i></button>`;
      item.querySelector('button')?.addEventListener('click', () => item.remove());
      fileList.appendChild(item);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function getFormSubject(form) {
    const name = form.querySelector('[name="nom"]')?.value.trim();
    const base = form.id === 'devisForm'
      ? 'Demande de devis - Impact BTP Gabon Plus'
      : 'Message contact - Impact BTP Gabon Plus';
    return name ? `${base} - ${name}` : base;
  }

  function setFormPending(form, isPending) {
    const button = form.querySelector('button[type="submit"]');
    if (!button) return;
    if (!button.dataset.originalText) button.dataset.originalText = button.innerHTML;
    button.disabled = isPending;
    button.innerHTML = isPending ? 'Envoi en cours...' : button.dataset.originalText;
    if (!isPending && window.lucide) window.lucide.createIcons();
  }

  async function submitWithFormSubmit(form) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const formData = new FormData(form);
      formData.set('_subject', getFormSubject(form));
      formData.set('_template', 'table');
      formData.set('_captcha', 'false');
      formData.set('_replyto', form.querySelector('[name="email"]')?.value.trim() || '');

      const response = await fetch(`https://formsubmit.co/ajax/${contactInfo.email}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
        signal: controller.signal
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Le service de messagerie n'a pas répondu.");
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  fileDrop?.addEventListener('click', () => fileInput?.click());
  fileDrop?.addEventListener('dragover', event => event.preventDefault());
  fileDrop?.addEventListener('drop', event => {
    event.preventDefault();
    addFiles(event.dataTransfer.files);
  });
  fileInput?.addEventListener('change', () => addFiles(fileInput.files));

  forms.forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (form.querySelector('[name="_honey"]')?.value) return;

      setFormPending(form, true);
      try {
        await submitWithFormSubmit(form);
        form.reset();
        if (fileList) fileList.innerHTML = '';
        showToast('Votre message a bien été envoyé à Impact BTP.');
      } catch (error) {
        showToast("L'envoi n'a pas abouti. Vous pouvez réessayer ou écrire directement à impact.gabonbtp@gmail.com.", true);
      } finally {
        setFormPending(form, false);
      }
    });
  });
}

function initBackToTop() {
  const button = document.getElementById('backToTop');
  if (!button) return;
  function sync() {
    button.classList.toggle('show', window.scrollY > 520);
  }
  window.addEventListener('scroll', sync, { passive: true });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  sync();
}

function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initLazyIframes() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const iframe = entry.target;
        if (iframe.dataset.src) {
          iframe.src = iframe.dataset.src;
        }
        observer.unobserve(iframe);
      }
    });
  }, { rootMargin: '200px' });

  document.querySelectorAll('iframe[loading="lazy"]').forEach(iframe => {
    if (iframe.src) {
      iframe.dataset.src = iframe.src;
      iframe.removeAttribute('src');
    }
    observer.observe(iframe);
  });
}

createHeader();
createFooter();
initNavigation();
initReveal();
initHeroSlider();
initBeforeAfter();
initForms();
initBackToTop();
initSmoothAnchors();
initCookieConsent();
initLazyIframes();
if (window.lucide) window.lucide.createIcons();
