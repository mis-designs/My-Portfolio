"use strict";

/* =========================================================
   MiskatDesigns — interactions
   ========================================================= */
const root = document.documentElement;
root.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = new Date().getFullYear(); });

/* ---------- Toast ---------- */
let toastEl, toastTimer;
function toast(message) {
  if (!toastEl) {
    toastEl = document.createElement("div");
    toastEl.className = "toast";
    toastEl.setAttribute("role", "status");
    document.body.append(toastEl);
  }
  toastEl.textContent = message;
  requestAnimationFrame(() => toastEl.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
}

/* ---------- Theme toggle (persisted) ---------- */
(function theme() {
  const headerInner = $(".header-inner");
  if (!headerInner) return;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  btn.innerHTML = '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const sync = () => {
    const light = root.dataset.theme === "light";
    btn.setAttribute("aria-label", light ? "Passa al tema scuro" : "Passa al tema chiaro");
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = light ? "#f5f3ee" : "#07090e";
  };
  btn.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try { localStorage.setItem("md-theme", root.dataset.theme); } catch (e) { /* storage unavailable */ }
    sync();
  });
  const toggle = $(".menu-toggle");
  headerInner.insertBefore(btn, toggle ? toggle.nextSibling : null);
  sync();
})();

/* ---------- Mobile navigation ---------- */
const menuButton = $(".menu-toggle");
const navigation = $("#navigation");
function closeMenu() {
  if (!menuButton) return;
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}
if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    navigation.classList.toggle("is-open", !open);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener("click", (event) => { if (!event.target.closest(".header")) closeMenu(); });
  navigation.addEventListener("click", (event) => { if (event.target.closest("a")) closeMenu(); });
  window.matchMedia("(min-width: 961px)").addEventListener("change", closeMenu);
}

/* ---------- Preloader (first visit of the session) ---------- */
(function preloader() {
  const el = $(".preloader");
  if (!el) return;
  const finish = () => {
    el.classList.add("done");
    document.dispatchEvent(new Event("md:ready"));
    setTimeout(() => el.remove(), 1400);
    try { sessionStorage.setItem("md-seen", "1"); } catch (e) { /* ignore */ }
  };
  if (root.classList.contains("seen") || reduceMotion.matches) {
    el.remove();
    return;
  }
  const bar = $(".preloader-bar i", el);
  const count = $(".preloader-count", el);
  let n = 0;
  const tick = () => {
    n = Math.min(100, n + Math.max(1, Math.round((100 - n) * 0.09)));
    bar.style.transform = "scaleX(" + n / 100 + ")";
    count.textContent = String(n).padStart(3, "0");
    if (n < 100) setTimeout(tick, 28);
    else setTimeout(finish, 220);
  };
  tick();
})();
const pageReady = new Promise((resolve) => {
  if (!$(".preloader")) resolve();
  else document.addEventListener("md:ready", resolve, { once: true });
});

/* ---------- Page transitions ---------- */
(function transitions() {
  if (reduceMotion.matches) return;
  const curtain = document.createElement("div");
  curtain.className = "curtain";
  curtain.setAttribute("aria-hidden", "true");
  document.body.append(curtain);
  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    const url = new URL(link.href, location.href);
    if (link.target === "_blank" || url.origin !== location.origin || url.protocol.startsWith("mailto")) return;
    if (url.pathname === location.pathname && url.hash) return;
    if (!/\.html$|\/$/.test(url.pathname)) return;
    event.preventDefault();
    curtain.classList.add("on");
    setTimeout(() => { location.href = url.href; }, 380);
  });
  window.addEventListener("pageshow", () => curtain.classList.remove("on"));
})();

/* ---------- Split headlines into animated words ---------- */
function splitWords(el) {
  let i = 0;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.append(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = "w";
          const wi = document.createElement("span");
          wi.className = "wi";
          wi.style.setProperty("--i", i++);
          wi.textContent = part;
          w.append(wi);
          frag.append(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && child.tagName !== "BR" && child.tagName !== "svg") {
        walk(child);
      }
    });
  };
  walk(el);
  el.classList.add("split-ready");
}
const splitTargets = $$("main h1, [data-split]");
if (!reduceMotion.matches) {
  splitTargets.forEach((el) => {
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    splitWords(el);
    $$(".w", el).forEach((w) => w.setAttribute("aria-hidden", "true"));
  });
}

/* ---------- Auto reveal ---------- */
const autoReveal = [
  ".section-heading", ".page-hero .lead", ".page-hero .eyebrow", ".page-hero .actions", ".page-hero .notice", ".breadcrumb",
  ".quality-grid article", ".detail-card", ".timeline-step", ".faq", ".service-card", ".picture-card",
  ".project", ".case-visual", ".case-body", ".sector-tool", ".tailored > div:first-child", ".split > div", ".goal-picker", ".goal-result",
  ".experience-copy", ".experience-panel", ".contact-card", "#contact-form", ".cta > *", ".intro-tags",
  ".process-aside", ".builder-form", ".builder-summary", ".hero-sub", ".hero .actions", ".hero .eyebrow",
  ".footer-top", ".marquee", ".filters", ".filter-status", ".section-label", ".showcase-stage"
];
$$(autoReveal.join(",")).forEach((el) => { if (!el.classList.contains("reveal")) el.classList.add("reveal"); });
// Stagger siblings that share a parent
const groups = new Map();
$$(".reveal").forEach((el) => {
  const p = el.parentElement;
  if (!groups.has(p)) groups.set(p, []);
  groups.get(p).push(el);
});
groups.forEach((items) => items.forEach((el, idx) => { if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", Math.min(idx, 6) * 0.08 + "s"); }));

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible", "split-in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  pageReady.then(() => {
    $$(".reveal, .clip-reveal").forEach((el) => { el.classList.add("will-reveal"); observer.observe(el); });
    splitTargets.forEach((el, idx) => {
      el.style.setProperty("--base", (idx === 0 ? 120 : 0) + "ms");
      observer.observe(el);
    });
  });
  // Elements must be hidden before first paint of the reveal; do it immediately for those below the fold
  $$(".reveal, .clip-reveal").forEach((el) => {
    if (el.getBoundingClientRect().top > window.innerHeight) el.classList.add("will-reveal");
  });
} else {
  splitTargets.forEach((el) => el.classList.add("split-in"));
}

/* ---------- Scroll: progress, header hide, parallax, highlights ---------- */
const progress = $(".reading-progress");
const header = $(".header");
const parallaxEls = $$("[data-parallax]");
const highlightEls = $$("[data-highlight]");
highlightEls.forEach((el) => {
  // Wrap words (text nodes only) for the scroll-lit statement
  const walk = (node) => [...node.childNodes].forEach((child) => {
    if (child.nodeType === 3) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.append(" "); return; }
        const s = document.createElement("span");
        s.className = "hw";
        s.textContent = part;
        frag.append(s);
      });
      child.replaceWith(frag);
    } else if (child.nodeType === 1 && child.tagName !== "BR") walk(child);
  });
  walk(el);
});
let lastY = window.scrollY;
let scrollScheduled = false;
function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const distance = document.documentElement.scrollHeight - vh;
  if (progress) progress.style.transform = "scaleX(" + (distance > 0 ? Math.min(1, Math.max(0, y / distance)) : 0) + ")";
  if (header) {
    const navOpen = navigation && navigation.classList.contains("is-open");
    header.classList.toggle("is-hidden", !navOpen && y > lastY && y > 260);
  }
  lastY = y;
  if (!reduceMotion.matches) {
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) return;
      const speed = parseFloat(el.dataset.parallax) || 0.1;
      const center = rect.top + rect.height / 2 - vh / 2;
      const scale = el.dataset.parallaxScale ? 1 + Math.max(0, Math.min(1, 1 - (rect.top / vh))) * parseFloat(el.dataset.parallaxScale) : 1;
      el.style.transform = "translate3d(0," + (-center * speed).toFixed(1) + "px,0) scale(" + scale.toFixed(3) + ")";
    });
  }
  highlightEls.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const words = $$(".hw", el);
    const ratio = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)));
    const lit = Math.round(ratio * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < lit));
  });
  scrollScheduled = false;
}
window.addEventListener("scroll", () => {
  if (!scrollScheduled) { scrollScheduled = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
const updateProgress = onScroll;

/* ---------- Process steps (sticky storytelling) ---------- */
(function processSteps() {
  const steps = $$(".process-step");
  if (!steps.length) return;
  const meter = $(".process-meter");
  const setActive = (idx) => {
    steps.forEach((s, i) => s.classList.toggle("is-active", i === idx));
    if (meter) {
      meter.style.setProperty("--p", (idx + 1) / steps.length);
      $(".bar i", meter).style.transform = "scaleX(" + (idx + 1) / steps.length + ")";
      $("b", meter).textContent = String(idx + 1).padStart(2, "0");
    }
  };
  setActive(0);
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(steps.indexOf(e.target)); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => io.observe(s));
})();

/* ---------- Marquee duplication for a seamless loop ---------- */
$$(".marquee-track").forEach((track) => {
  track.innerHTML += track.innerHTML;
  $$("span", track).forEach((s, i) => { if (i >= $$("span", track).length / 2) s.setAttribute("aria-hidden", "true"); });
});

/* ---------- Footer wordmark letters ---------- */
$$(".footer-wordmark").forEach((mark) => {
  const accent = mark.querySelector("span");
  const text = mark.firstChild && mark.firstChild.nodeType === 3 ? mark.firstChild.textContent : "";
  if (!text) return;
  const frag = document.createDocumentFragment();
  [...text].forEach((c, i) => {
    const s = document.createElement("span");
    s.className = "ch";
    s.style.transitionDelay = i * 18 + "ms";
    s.textContent = c;
    s.setAttribute("aria-hidden", "true");
    frag.append(s);
  });
  mark.firstChild.replaceWith(frag);
  if (accent) accent.classList.add("ch", "dot");
});

/* ---------- Live Rome clock ---------- */
const clockEls = $$("[data-clock]");
if (clockEls.length) {
  const fmt = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const tickClock = () => clockEls.forEach((el) => { el.textContent = fmt.format(new Date()); });
  tickClock();
  setInterval(tickClock, 1000);
}

/* ---------- Footer: copy email + inject actions ---------- */
(function footerExtras() {
  const top = $(".footer-top");
  const backTop = $(".back-top");
  if (top && backTop && !$(".copy-btn", top)) {
    const wrap = document.createElement("div");
    wrap.className = "footer-actions";
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-btn";
    copy.dataset.copy = "miskatdesigns@gmail.com";
    copy.innerHTML = '<svg class="icon" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="3"/><path d="M5 15V6a3 3 0 0 1 3-3h7"/></svg> Copia email';
    backTop.replaceWith(wrap);
    wrap.append(copy, backTop);
  }
  const bottom = $(".footer-bottom");
  if (bottom && !$("[data-clock]", bottom)) {
    const clock = document.createElement("span");
    clock.innerHTML = 'Roma · <span class="footer-clock" data-clock>--:--:--</span>';
    bottom.insertBefore(clock, bottom.children[1] || null);
    const fmt = new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const el = $("[data-clock]", clock);
    const t = () => { el.textContent = fmt.format(new Date()); };
    t(); setInterval(t, 1000);
  }
  if (backTop) backTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
  });
})();
document.addEventListener("click", async (event) => {
  const btn = event.target.closest("[data-copy]");
  if (!btn) return;
  try {
    await navigator.clipboard.writeText(btn.dataset.copy);
    toast("Email copiata negli appunti");
  } catch (e) {
    toast(btn.dataset.copy);
  }
});

/* ---------- Pointer effects: cursor, magnetic, tilt, spotlight ---------- */
if (finePointer.matches && !reduceMotion.matches) {
  const cursor = document.createElement("div");
  cursor.className = "cursor is-hidden";
  cursor.innerHTML = '<span class="cursor-label"></span>';
  const dot = document.createElement("div");
  dot.className = "cursor-dot is-hidden";
  document.body.append(cursor, dot);
  document.body.classList.add("has-cursor");
  const label = $(".cursor-label", cursor);
  let mx = -100, my = -100, cx = -100, cy = -100;
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = "translate(" + mx + "px," + my + "px)";
    cursor.classList.remove("is-hidden"); dot.classList.remove("is-hidden");
  }, { passive: true });
  document.addEventListener("pointerleave", () => { cursor.classList.add("is-hidden"); dot.classList.add("is-hidden"); });
  const loop = () => {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
    cursor.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener("pointerover", (e) => {
    const labelled = e.target.closest("[data-cursor]");
    const interactive = e.target.closest("a, button, summary, label, input, textarea");
    cursor.classList.toggle("is-label", !!labelled);
    cursor.classList.toggle("is-link", !labelled && !!interactive);
    label.textContent = labelled ? labelled.dataset.cursor : "";
  });

  // Magnetic buttons
  $$(".button, .nav-cta, .theme-toggle, .back-top, .picture-arrow, .reference-expand").forEach((el) => {
    const strength = el.classList.contains("button") ? 0.22 : 0.35;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * strength;
      const y = (e.clientY - r.top - r.height / 2) * strength;
      el.style.translate = x.toFixed(1) + "px " + y.toFixed(1) + "px";
    });
    el.addEventListener("pointerleave", () => { el.style.translate = ""; });
    el.style.transition = (getComputedStyle(el).transition ? getComputedStyle(el).transition + ", " : "") + "translate .5s cubic-bezier(.16,1,.3,1)";
  });

  // 3D tilt
  $$("[data-tilt], .picture-card, .service-card").forEach((el) => {
    const max = parseFloat(el.dataset.tilt) || 5;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = "perspective(1000px) rotateX(" + (-py * max).toFixed(2) + "deg) rotateY(" + (px * max).toFixed(2) + "deg)";
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });

  // Spotlight on quality cards
  $$(".quality-grid article").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
}

/* =========================================================
   Existing functions (kept)
   ========================================================= */
const filterButtons = $$("[data-filter]");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    let visible = 0;
    $$("[data-category]").forEach((project) => {
      const show = button.dataset.filter === "all" || project.dataset.category === button.dataset.filter;
      project.hidden = !show;
      if (show) {
        visible += 1;
        project.classList.remove("visible");
        void project.offsetWidth;
        project.style.setProperty("--d", (visible - 1) * 0.06 + "s");
        project.classList.add("visible");
      }
    });
    const status = $(".filter-status");
    if (status) status.textContent = visible + (visible === 1 ? " riferimento" : " riferimenti");
    updateProgress();
  });
});

function animateSwap(el) {
  if (!el || reduceMotion.matches) return;
  el.classList.remove("swap");
  void el.offsetWidth;
  el.classList.add("swap");
}

const goalContent = {
  web: ["Un sito che racconta il tuo valore.", "Presenta la tua attività e rendi semplice il primo contatto.", "siti-web.html"],
  app: ["Uno strumento che segue il tuo lavoro.", "Riunisci operazioni e informazioni in un’applicazione su misura.", "applicazioni.html"],
  campaign: ["Una pagina che mette a fuoco la tua offerta.", "Accompagna le persone dall’annuncio a una richiesta chiara.", "campagne.html"],
};
$$("[data-goal]").forEach((button) => {
  button.addEventListener("click", () => {
    $$("[data-goal]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const [title, copy, url] = goalContent[button.dataset.goal];
    $("#goal-title").textContent = title;
    $("#goal-copy").textContent = copy;
    $("#goal-link").href = url;
    animateSwap($(".goal-result"));
  });
});

const experienceContent = {
  identity: ["Un’identità che si fa ricordare.", "Colori, parole e dettagli che raccontano la tua attività con coerenza, su ogni schermo."],
  trust: ["La cura che trasmette fiducia.", "Informazioni chiare e servizi ben presentati aiutano le persone a capire il valore del tuo lavoro."],
  contact: ["Un contatto, a portata di clic.", "Un percorso semplice accompagna chi ti visita verso una domanda, una richiesta o una prenotazione."],
};
const experienceButtons = $$("[data-experience]");
experienceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    experienceButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const [title, copy] = experienceContent[button.dataset.experience];
    const panel = $(".experience-panel");
    panel.dataset.state = button.dataset.experience;
    $("#experience-title").textContent = title;
    $("#experience-copy").textContent = copy;
    animateSwap(panel);
    updateProgress();
  });
});

const form = $("#contact-form");
if (form) {
  const options = { web: "un sito web", siti: "un sito web", app: "un’applicazione", campaign: "una campagna", help: "un consiglio sul mio progetto" };
  const params = new URLSearchParams(window.location.search);
  const requestedService = params.get("servizio");
  const serviceValue = requestedService === "siti" ? "web" : requestedService;
  if (serviceValue && Object.hasOwn(options, serviceValue)) {
    const choice = [...form.elements.servizio].find((input) => input.value === serviceValue);
    if (choice) choice.checked = true;
  }
  const message = $("#message");
  const error = $("#message-error");
  const preview = $("#email-preview");
  const emailText = $("#email-text");
  const copyStatus = $("#copy-status");
  function resizeMessage() {
    message.style.height = "auto";
    message.style.height = message.scrollHeight + "px";
  }
  // Brief coming from the project builder on the home page
  const brief = params.get("brief");
  if (brief && message && !message.value) {
    message.value = brief.slice(0, 1500);
    requestAnimationFrame(resizeMessage);
    toast("Bozza del progetto inserita nel messaggio");
  }
  message.addEventListener("input", resizeMessage);
  form.addEventListener("input", () => {
    // A changed draft must be reviewed again before opening the mail client.
    preview.hidden = true;
    message.removeAttribute("aria-invalid");
    error.textContent = "";
    copyStatus.textContent = "";
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (message.value.trim().length < 10) {
      error.textContent = "Raccontami il tuo obiettivo con almeno 10 caratteri.";
      message.setAttribute("aria-invalid", "true");
      message.focus();
      return;
    }
    const selected = form.elements.servizio.value;
    const business = $("#business").value.trim();
    const text = [
      "Ciao Miskat,",
      "",
      "vorrei parlare di " + options[selected] + ".",
      business ? "La mia attività si chiama " + business + "." : "",
      "",
      message.value.trim(),
      "",
      "Grazie!",
    ].filter((line, index, lines) => line !== "" || lines[index - 1] !== "").join("\n");
    emailText.textContent = text;
    $("#send-email").href = "mailto:miskatdesigns@gmail.com?subject=" +
      encodeURIComponent("Un nuovo progetto per MiskatDesigns") + "&body=" + encodeURIComponent(text);
    preview.hidden = false;
    $("#preview-title").focus();
    updateProgress();
  });
  $("#copy-email").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(emailText.textContent);
      copyStatus.textContent = "Messaggio copiato. Incollalo nella tua email.";
      toast("Messaggio copiato");
    } catch {
      const range = document.createRange();
      range.selectNodeContents(emailText);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyStatus.textContent = "Testo selezionato. Usa Copia dal menu del dispositivo oppure Ctrl+C.";
    }
  });
}

const sectorContent = {
  negozio: ["La tua vetrina, anche online", "Dal quartiere, a chi ti sta cercando.", "Presenta prodotti e servizi, mostra cosa ti distingue e rendi semplice trovarti o chiedere informazioni.", ["Catalogo o servizi ben organizzati", "Orari, indicazioni e contatti visibili", "Percorso rapido dal telefono"], "web"],
  professionista: ["La tua competenza, riconoscibile", "Prima ti conoscono. Poi si fidano.", "Racconta i tuoi servizi, chiarisci a chi ti rivolgi e guida le persone verso una richiesta di consulenza.", ["Servizi spiegati con chiarezza", "Presentazione del tuo metodo", "Richieste di consulenza mirate"], "web"],
  impresa: ["Il digitale che segue il lavoro", "Più ordine. Più spazio per crescere.", "Affianca alla presentazione aziendale strumenti per organizzare richieste, attività e informazioni.", ["Offerta aziendale strutturata", "Analisi dei processi da semplificare", "Strumenti e integrazioni da concordare"], "app"],
};
const sectorButtons = $$("[data-sector]");
sectorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sectorButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    const [label, title, copy, features, service] = sectorContent[button.dataset.sector];
    $("#sector-label").textContent = label;
    $("#sector-title").textContent = title;
    $("#sector-copy").textContent = copy;
    $("#sector-list").replaceChildren(...features.map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    }));
    $("#sector-link").href = "contatti.html?servizio=" + service;
    animateSwap($(".sector-result"));
    updateProgress();
  });
});

const visualDialog = $(".visual-dialog");
if (visualDialog) {
  let visualTrigger;
  $$("[data-visual]").forEach((button) => {
    button.setAttribute("data-cursor", "Apri");
    button.addEventListener("click", () => {
      visualTrigger = button;
      $("#visual-title").textContent = button.dataset.title;
      const image = $("#visual-image");
      image.src = "assets/images/" + button.dataset.visual;
      image.alt = button.dataset.title + ", riferimento visivo fornito";
      visualDialog.showModal();
    });
  });
  $(".visual-close").addEventListener("click", () => visualDialog.close());
  visualDialog.addEventListener("click", (e) => { if (e.target === visualDialog) visualDialog.close(); });
  visualDialog.addEventListener("close", () => { if (visualTrigger) visualTrigger.focus(); });
}

/* =========================================================
   Project builder (home)
   ========================================================= */
(function projectBuilder() {
  const builder = $("#builder");
  if (!builder) return;
  const typeLabels = { web: "Sito web", app: "Applicazione su misura", campaign: "Landing page e campagna", restyling: "Restyling di un sito" };
  const serviceMap = { web: "web", app: "app", campaign: "campaign", restyling: "web" };
  const pagesInput = $("#b-pages");
  const pagesOut = $("#b-pages-out");
  const out = {
    type: $("#sum-type"), pages: $("#sum-pages"), features: $("#sum-features"),
    timing: $("#sum-timing"), level: $("#sum-level"), bar: $(".complexity-bar"), link: $("#sum-link"),
  };
  const bars = [];
  for (let i = 0; i < 10; i++) { const b = document.createElement("i"); out.bar.append(b); bars.push(b); }

  function read() {
    const type = builder.querySelector('input[name="b-type"]:checked').value;
    const features = $$('input[name="b-feature"]:checked', builder).map((i) => i.value);
    const pages = Number(pagesInput.value);
    const timing = builder.querySelector('input[name="b-timing"]:checked').value;
    return { type, features, pages, timing };
  }
  function render() {
    const s = read();
    const fill = ((s.pages - pagesInput.min) / (pagesInput.max - pagesInput.min)) * 100;
    pagesInput.style.setProperty("--fill", fill + "%");
    pagesOut.textContent = s.pages >= 20 ? "20+ pagine" : s.pages + (s.pages === 1 ? " pagina" : " pagine");
    // Qualitative scope indicator — no prices, just how structured the project is
    let score = { web: 2, app: 4, campaign: 1, restyling: 2 }[s.type];
    score += Math.min(3, Math.floor(s.pages / 6));
    score += s.features.length * 0.75;
    const level = Math.max(1, Math.min(10, Math.round(score)));
    const name = level <= 3 ? "Essenziale" : level <= 6 ? "Strutturato" : "Avanzato";
    out.type.textContent = typeLabels[s.type];
    out.pages.textContent = pagesOut.textContent;
    out.features.textContent = s.features.length ? s.features.length + (s.features.length === 1 ? " funzione" : " funzioni") : "Da definire";
    out.timing.textContent = s.timing;
    if (out.level.textContent !== name) { out.level.classList.remove("bump"); void out.level.offsetWidth; out.level.classList.add("bump"); }
    out.level.textContent = name;
    bars.forEach((b, i) => b.classList.toggle("on", i < level));
    const brief = [
      "Ho preparato una bozza dal sito:",
      "• Progetto: " + typeLabels[s.type],
      "• Dimensione: " + pagesOut.textContent,
      "• Funzioni: " + (s.features.length ? s.features.join(", ") : "da definire insieme"),
      "• Tempistiche: " + s.timing,
      "",
      "Ti racconto qualcosa in più sulla mia attività: ",
    ].join("\n");
    out.link.href = "contatti.html?servizio=" + serviceMap[s.type] + "&brief=" + encodeURIComponent(brief);
  }
  builder.addEventListener("input", render);
  builder.addEventListener("change", render);
  render();
})();
