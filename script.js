// script.js - Typing animation, scroll spy, progress bars, form validation, reveal on scroll, back to top, hamburger
document.addEventListener("DOMContentLoaded", () => {
  // ********** TYPING ANIMATION **********
  const typedTextSpan = document.querySelector(".typed-text");
  const roles = ["Junior Software Developer", "Full-Stack Aspiring", "HTML & CSS Expert"];
  let roleIndex = 0, charIndex = 0;
  let isDeleting = false;
  function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }
    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1800);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeEffect, 300);
      return;
    }
    const speed = isDeleting ? 60 : 120;
    setTimeout(typeEffect, speed);
  }
  typeEffect();

  // ********** NAVBAR HAMBURGER **********
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
    });
  });

  // ********** SMOOTH SCROLLING **********
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if(targetId === "#") return;
      const targetElem = document.querySelector(targetId);
      if(targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ********** ACTIVE SECTION HIGHLIGHT **********
  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".nav-link");
  function updateActiveSection() {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        current = section.getAttribute("id");
      }
    });
    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${current}`) {
        item.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", updateActiveSection);
  updateActiveSection();

  // ********** SCROLL REVEAL + ANIMATED PROGRESS BARS **********
  const revealElements = document.querySelectorAll(".section");
  const skillItems = document.querySelectorAll(".skill-item");
  let progressTriggered = false;

  const observerOptions = { threshold: 0.2, rootMargin: "0px 0px -30px 0px" };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  revealElements.forEach(section => revealObserver.observe(section));

  // Progress bar fill observer
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !progressTriggered) {
        skillItems.forEach(item => {
          const percent = item.getAttribute("data-percent");
          const fillBar = item.querySelector(".progress-fill");
          const percentSpan = item.querySelector(".percent");
          if (fillBar && percent) {
            fillBar.style.width = percent + "%";
            if (percentSpan) percentSpan.textContent = percent + "%";
          }
        });
        progressTriggered = true;
        progressObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const skillsSection = document.querySelector("#skills");
  if (skillsSection) progressObserver.observe(skillsSection);

  // ********** BACK TO TOP BUTTON **********
  const backBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backBtn.style.display = "flex";
    } else {
      backBtn.style.display = "none";
    }
  });
  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ********** FORM VALIDATION & SUCCESS MESSAGE **********
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("form-feedback");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    if (!name || !email || !message) {
      feedback.innerHTML = '<span style="color:#ff8a7a;">❌ All fields are required.</span>';
      return;
    }
    const emailPattern = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
    if (!emailPattern.test(email)) {
      feedback.innerHTML = '<span style="color:#ff8a7a;">❌ Please enter a valid email address.</span>';
      return;
    }
    feedback.innerHTML = '<span style="color:#7ae9c2;">✓ Message sent successfully! I will get back soon.</span>';
    form.reset();
    setTimeout(() => { feedback.innerHTML = ""; }, 4000);
  });

  // ********** DOWNLOAD RESUME PLACEHOLDER **********
  const resumeBtn = document.getElementById("resume-btn");
  if (resumeBtn) {
    resumeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      alert("📄 Resume download demo: In a real scenario, your PDF would be downloaded.");
    });
  }

  // ********** CERTIFICATE PREVIEW MODAL **********
  const imageModal = document.getElementById("imageModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalImage = document.getElementById("modalImage");
  const modalCaption = document.getElementById("modalCaption");

  function closeModal() {
    imageModal.classList.remove("active");
    imageModal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    modalImage.alt = "";
    modalCaption.textContent = "";
  }

  document.querySelectorAll(".cert-img").forEach(img => {
    img.addEventListener("click", () => {
      imageModal.classList.add("active");
      imageModal.setAttribute("aria-hidden", "false");
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      modalCaption.textContent = img.alt;
    });
  });

  modalBackdrop.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && imageModal.classList.contains("active")) {
      closeModal();
    }
  });

  // mobile/touch feedback for cards
  const touchCards = [".detail-card", ".skill-category", ".project-card", ".timeline-item", ".cert-card"];
  touchCards.forEach(selector => {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener("touchstart", () => card.classList.add("touch-active"), { passive: true });
      card.addEventListener("touchend", () => card.classList.remove("touch-active"));
      card.addEventListener("touchcancel", () => card.classList.remove("touch-active"));
    });
  });

  // pre-reveal for sections already visible on load
  window.dispatchEvent(new Event("scroll"));
});