const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");
menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
});
$$(".nav-links a").forEach(link => link.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const progress = $("#scrollProgress");
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
};
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

$("#year").textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revealObserver.observe(el));

const filterButtons = $$(".filter-btn");
const projects = $$(".project-card");
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    const filter = button.dataset.filter;
    projects.forEach(project => {
      project.hidden = filter !== "all" && project.dataset.category !== filter;
    });
  });
});

const projectInfo = {
  "Maison Sésame": "Concept fictif pour un restaurant : une direction artistique chaleureuse, une carte facile à consulter et des informations pratiques visibles. Ce visuel est une démonstration, pas un site livré à un client.",
  "Atelier 17": "Concept fictif pour un commerce de coiffure : une identité affirmée, les prestations et un parcours clair vers la prise de rendez-vous. Ce visuel est une démonstration.",
  "Forma Studio": "Concept fictif pour un studio de bien-être : une ambiance douce, une présentation des cours et une mise en avant de l’expérience. Ce visuel est une démonstration.",
  "Bâtir & Co.": "Concept fictif pour un artisan : une présentation du savoir-faire, des services et un chemin simple pour demander un devis. Ce visuel est une démonstration."
};
const dialog = $("#projectDialog");
const openProject = card => {
  const title = $("h3", card)?.textContent || "Concept";
  $("#dialogTitle").textContent = title;
  $("#dialogText").textContent = projectInfo[title] || "Un concept de démonstration imaginé pour présenter une direction artistique possible.";
  dialog.showModal();
};
projects.forEach(card => {
  card.addEventListener("click", event => {
    if (event.target.closest("a")) return;
    openProject(card);
  });
  card.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProject(card);
    }
  });
});
$("#dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
$("#dialogContact").addEventListener("click", () => dialog.close());

$("#contactForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  // IMPORTANT: Remplacez cette adresse par votre adresse professionnelle avant publication.
  const recipient = "VOTRE-EMAIL@EXEMPLE.FR";
  const subject = encodeURIComponent(`Demande de contact NovaWeb — ${data.get("name")}`);
  const body = encodeURIComponent(
    `Bonjour NovaWeb,\n\nNom : ${data.get("name")}\nE-mail : ${data.get("email")}\nActivité : ${data.get("activity") || "Non précisée"}\n\nProjet :\n${data.get("message")}\n\nEnvoyé depuis le site NovaWeb.`
  );
  $("#formFeedback").textContent = "Votre application e-mail va s’ouvrir. Pensez à remplacer l’adresse de démonstration dans script.js avant la mise en ligne.";
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
