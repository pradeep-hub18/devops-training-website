(function () {
  const CONFIG = {
    courseName: "DevOps Mastery Training",
    whatsappNumber: "919583598899",
    appsScriptUrl: "PASTE_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE",
    whatsappMessage:
      "Hi, I am interested in your DevOps training course. Please share details.",
  };

  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      }
    });
  }

  function whatsappUrl() {
    const message = encodeURIComponent(CONFIG.whatsappMessage);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${message}`;
  }

  function leadWhatsappUrl(payload) {
    const message = [
      "Hi, I am interested in your DevOps training course.",
      "",
      `Name: ${payload.name || ""}`,
      `Phone: ${payload.phone || ""}`,
      `Email: ${payload.email || ""}`,
      `Experience: ${payload.experience || ""}`,
      `Message: ${payload.message || ""}`,
    ].join("\n");

    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  document.querySelectorAll(".js-whatsapp").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.open(whatsappUrl(), "_blank", "noopener,noreferrer");
    });
  });

  const form = document.querySelector("[data-lead-form]");
  const status = document.querySelector("[data-form-status]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector("[type='submit']");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    payload.courseName = CONFIG.courseName;
    payload.pageUrl = window.location.href;
    payload.submittedAt = new Date().toISOString();

    if (!CONFIG.appsScriptUrl || CONFIG.appsScriptUrl.includes("PASTE_")) {
      status.textContent =
        "Opening WhatsApp with your inquiry details...";
      status.className = "form-status";
      window.open(leadWhatsappUrl(payload), "_blank", "noopener,noreferrer");
      form.reset();
      window.location.href = "thank-you.html";
      return;
    }

    status.textContent = "Submitting your inquiry...";
    status.className = "form-status";
    submitButton.disabled = true;

    try {
      await fetch(CONFIG.appsScriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      form.reset();
      window.location.href = "thank-you.html";
    } catch (error) {
      status.textContent =
        "Something went wrong while submitting. Please try WhatsApp or submit again.";
      status.className = "form-status is-error";
      submitButton.disabled = false;
    }
  });
})();
