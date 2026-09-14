(function () {
  "use strict";

  /* ---------------------------------------------------------
     En-tête : fond au scroll
  --------------------------------------------------------- */
  var header = document.getElementById("site-header");
  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------------------------------------------------
     Menu mobile
  --------------------------------------------------------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  function closeNav() {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  navToggle.addEventListener("click", function () {
    var isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeNav();
  });

  /* ---------------------------------------------------------
     Hero : entrée douce une fois l'image chargée
  --------------------------------------------------------- */
  var heroImg = document.getElementById("hero-img");
  var heroContent = document.querySelector(".hero-content");

  function revealHero() {
    heroImg.classList.add("is-loaded");
    if (heroContent) heroContent.classList.add("is-visible");
  }
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalWidth > 0) {
      revealHero();
    } else {
      heroImg.addEventListener("load", revealHero);
      heroImg.addEventListener("error", revealHero);
    }
  }

  /* Léger effet de parallaxe sur l'image du hero (discret, plafonné) */
  var heroMedia = document.querySelector(".hero-media");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroMedia && !reduceMotion) {
    window.addEventListener(
      "scroll",
      function () {
        var offset = Math.min(window.scrollY * 0.25, 120);
        heroMedia.style.transform = "translateY(" + offset + "px)";
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------
     Galerie : lightbox
  --------------------------------------------------------- */
  var galleryItems = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-item")
  );
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var currentIndex = 0;
  var lastFocusedElement = null;

  function openLightbox(index) {
    currentIndex = index;
    var item = galleryItems[currentIndex];
    var full = item.getAttribute("data-full");
    var img = item.querySelector("img");
    lightboxImg.src = full;
    lightboxImg.alt = img ? img.alt : "";
    lastFocusedElement = document.activeElement;
    lightbox.hidden = false;
    lightboxClose.focus();
    document.body.classList.add("nav-open");
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.classList.remove("nav-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function showRelative(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  galleryItems.forEach(function (item, index) {
    item.addEventListener("click", function () {
      openLightbox(index);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", function () { showRelative(-1); });
  if (lightboxNext) lightboxNext.addEventListener("click", function () { showRelative(1); });

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") showRelative(1);
    if (e.key === "ArrowLeft") showRelative(-1);
  });

  /* ---------------------------------------------------------
     Formulaire de contact
     À adapter : remplacer la logique ci-dessous par l'envoi
     réel (ex. service Formspree, Netlify Forms, ou backend
     personnalisé) une fois le formulaire déployé.
  --------------------------------------------------------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var prenom = form.prenom.value.trim();
      var nom = form.nom.value.trim();
      var email = form.email.value.trim();

      if (!prenom || !nom || !email) {
        status.textContent = "Merci de renseigner votre prénom, nom et e-mail.";
        return;
      }

      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        status.textContent = "Merci de renseigner une adresse e-mail valide.";
        return;
      }

      /* Remplacer ce bloc par un envoi réel du formulaire
         (endpoint Formspree / Netlify / autre). Pour l'instant,
         on prépare un e-mail pré-rempli à destination du
         propriétaire. */
      var sujet = encodeURIComponent("Demande de visite — [VILLE]");
      var corps = encodeURIComponent(
        "Prénom : " + prenom +
        "\nNom : " + nom +
        "\nE-mail : " + email +
        "\nTéléphone : " + form.telephone.value.trim() +
        "\nDisponibilités : " + form.disponibilites.value.trim() +
        "\nMessage : " + form.message.value.trim()
      );

      window.location.href = "mailto:lina.tetouani@gmail.com?subject=" + sujet + "&body=" + corps;
      status.textContent = "Votre messagerie va s'ouvrir pour envoyer votre demande.";
      form.reset();
    });
  }
})();
