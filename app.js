const $ = (sel) => document.querySelector(sel);

const burger = $("#burger");
const mobileNav = $("#mobileNav");
const overlay = $("#navOverlay");

function openNav() {
  burger?.setAttribute("aria-expanded", "true");
  mobileNav.hidden = false;
  overlay && (overlay.hidden = false);

  // wymuszamy “reflow”, żeby animacja zadziałała po zdjęciu hidden
  mobileNav.offsetHeight;

  mobileNav.classList.add("is-open");
  overlay?.classList.add("is-open");
}

function closeNav() {
  burger?.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("is-open");
  overlay?.classList.remove("is-open");

  // po animacji dopiero chowamy
  setTimeout(() => {
    mobileNav.hidden = true;
    if (overlay) overlay.hidden = true;
  }, 220);
}

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    expanded ? closeNav() : openNav();
  });

  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", closeNav);
  });

  overlay?.addEventListener("click", closeNav);

  // ESC zamyka
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") {
      closeNav();
    }
  });

  // jak ktoś powiększy okno na desktop, zamknij drawer
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && burger.getAttribute("aria-expanded") === "true") {
      closeNav();
    }
  });
}

$("#year").textContent = String(new Date().getFullYear());

const form = $("#contactForm");
const statusEl = $("#formStatus");
const sendBtn = $("#sendBtn");

function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.style.opacity = "1";
  statusEl.style.color = ok ? "rgba(232,238,247,.88)" : "rgba(255,200,200,.92)";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus("");
  sendBtn.disabled = true;
  sendBtn.textContent = "Wysyłanie...";

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(json?.detail || "Nie udało się wysłać wiadomości.");
    }

    form.reset();
    setStatus("Wiadomość wysłana ✅");
  } catch (err) {
    setStatus(`Błąd: ${err.message}`, false);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Wyślij wiadomość";
  }
});
