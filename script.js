// ---------------------------------------------------------
// EDIT THIS VALUE to match your real inbox.
// ---------------------------------------------------------
const ADOPT_EMAIL = "henrymcclean.vet@gmail.com";

function buildGmailComposeUrl({ to, subject, body }) {
  const params = new URLSearchParams({ view: "cm", fs: "1", to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

document.addEventListener("DOMContentLoaded", () => {
  // --- Adopt Me buttons: each one opens Gmail pre-filled with that puppy's name ---
  document.querySelectorAll("[data-adopt]").forEach((link) => {
    const puppyName = link.getAttribute("data-puppy-name");
    const subject = puppyName
      ? `I'd like to adopt ${puppyName}`
      : "I'd like to adopt one of your Boxer puppies";
    const body = puppyName
      ? `Hi! I'm interested in ${puppyName}. Could you tell me more and let me know if ${puppyName} is still available?`
      : "Hi! I saw your Boxer puppies online and I'd love to hear more.";
    const url = buildGmailComposeUrl({ to: ADOPT_EMAIL, subject, body });
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });

  // --- Footer year ---
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Contact form (homepage): builds a Gmail compose link from the fields ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cf-name").value.trim();
      const email = document.getElementById("cf-email").value.trim();
      const message = document.getElementById("cf-message").value.trim();
      const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
      const url = buildGmailComposeUrl({
        to: ADOPT_EMAIL,
        subject: `Website inquiry from ${name || "a visitor"}`,
        body
      });
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // --- Available Puppies page: litter / gender / status filters ---
  const filterLitter = document.getElementById("filterLitter");
  const filterGender = document.getElementById("filterGender");
  const filterStatus = document.getElementById("filterStatus");
  const clearBtn = document.getElementById("clearFilters");
  const noResults = document.getElementById("noResults");

  if (filterLitter && filterGender && filterStatus) {
    const cards = Array.from(document.querySelectorAll(".puppy-card"));
    const sections = Array.from(document.querySelectorAll(".litter-section"));

    function applyFilters() {
      const litter = filterLitter.value;
      const gender = filterGender.value;
      const status = filterStatus.value;
      let anyVisible = false;

      sections.forEach((section) => {
        let sectionHasVisible = false;
        section.querySelectorAll(".puppy-card").forEach((card) => {
          const matches =
            (litter === "all" || card.dataset.litter === litter) &&
            (gender === "all" || card.dataset.gender === gender) &&
            (status === "all" || card.dataset.status === status);
          card.hidden = !matches;
          if (matches) { sectionHasVisible = true; anyVisible = true; }
        });
        section.style.display = sectionHasVisible ? "" : "none";
      });

      if (noResults) noResults.hidden = anyVisible;
    }

    [filterLitter, filterGender, filterStatus].forEach((el) =>
      el.addEventListener("change", applyFilters)
    );

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        filterLitter.value = "all";
        filterGender.value = "all";
        filterStatus.value = "all";
        applyFilters();
      });
    }
  }
});
