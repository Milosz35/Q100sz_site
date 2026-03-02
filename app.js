const $ = (sel) => document.querySelector(sel);

const burger = $("#burger");
const mobileNav = $("#mobileNav");

if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    mobileNav.hidden = expanded;
  });

  // zamknij menu po kliknięciu linku
  mobileNav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      mobileNav.hidden = true;
    });
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
