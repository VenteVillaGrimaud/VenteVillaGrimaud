(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURATION
     Colle ici ton URL Formspree (https://formspree.io) pour que
     le formulaire de contact s'envoie directement, sans dépendre
     de la messagerie du visiteur. Laisse vide ("") pour garder
     le comportement par défaut (ouverture de mailto).
     Exemple : "https://formspree.io/f/abcdwxyz"
  --------------------------------------------------------- */
  var FORM_ENDPOINT = "";

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
     Barre de progression de lecture
  --------------------------------------------------------- */
  var scrollProgress = document.getElementById("scroll-progress");
  function updateScrollProgress() {
    if (!scrollProgress) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = ratio + "%";
  }
  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);

  /* ---------------------------------------------------------
     Bouton "remonter en haut"
  --------------------------------------------------------- */
  var backToTop = document.getElementById("back-to-top");
  if (backToTop) {
    function updateBackToTop() {
      backToTop.classList.toggle("is-visible", window.scrollY > 600);
    }
    updateBackToTop();
    window.addEventListener("scroll", updateBackToTop, { passive: true });
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Barre de contact fixe (mobile) : apparaît une fois le hero
     dépassé, pour laisser le premier écran respirer.
  --------------------------------------------------------- */
  var mobileCtaBar = document.getElementById("mobile-cta-bar");
  var heroSection = document.getElementById("accueil");
  if (mobileCtaBar && heroSection && "IntersectionObserver" in window) {
    var ctaObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          mobileCtaBar.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );
    ctaObserver.observe(heroSection);
  }

  /* ---------------------------------------------------------
     Partage de la page (API native si dispo, sinon copie du lien)
  --------------------------------------------------------- */
  var shareBtn = document.getElementById("share-btn");
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var shareData = {
        title: document.title,
        text: "Villa provençale à vendre à Grimaud",
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(function () {
          var originalLabel = shareBtn.getAttribute("aria-label");
          shareBtn.setAttribute("aria-label", "Lien copié !");
          setTimeout(function () {
            shareBtn.setAttribute("aria-label", originalLabel);
          }, 2000);
        });
      }
    });
  }

  /* ---------------------------------------------------------
     Apparitions discrètes au défilement
     N'ajoute la classe .js-anim (qui active l'effet en CSS) que
     si le navigateur supporte IntersectionObserver et si la
     personne n'a pas demandé de réduire les animations.
  --------------------------------------------------------- */
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("js-anim");
    var revealTargets = document.querySelectorAll(
      ".feature-row, .presentation-image, .presentation-text, .highlight, .stat, .map-frame, .localisation-infos, .contact-form"
    );
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

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
    if (heroImg.complete) {
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
     Galerie : onglets (Maison principale / Dépendance)
     Pour ajouter un 3e album, ajoute un bouton .gallery-tab et
     un bloc .gallery-album avec le data-target / id correspondant
     dans index.html : le script ci-dessous s'adapte tout seul.
  --------------------------------------------------------- */
  var galleryTabs = Array.prototype.slice.call(document.querySelectorAll(".gallery-tab"));
  var galleryAlbums = Array.prototype.slice.call(document.querySelectorAll(".gallery-album"));

  function setActiveAlbum(targetId) {
    galleryAlbums.forEach(function (album) {
      var isActive = album.id === targetId;
      album.hidden = !isActive;
      album.classList.toggle("is-active", isActive);
    });
    galleryTabs.forEach(function (tab) {
      var isActive = tab.getAttribute("data-target") === targetId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });
    refreshGalleryItems();
  }

  galleryTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setActiveAlbum(tab.getAttribute("data-target"));
    });
  });

  /* ---------------------------------------------------------
     Galerie : "Voir plus de photos" (un bouton par album)
     Les photos marquées gallery-item--extra sont masquées par
     défaut (voir style.css). Un clic sur le bouton les révèle.
  --------------------------------------------------------- */
  var galleryMoreButtons = Array.prototype.slice.call(document.querySelectorAll(".gallery-more-btn"));

  galleryMoreButtons.forEach(function (btn) {
    var grid = document.getElementById(btn.getAttribute("data-grid"));
    if (!grid) return;
    var hasExtraPhotos = grid.querySelectorAll(".gallery-item--extra").length > 0;
    if (!hasExtraPhotos) {
      btn.parentElement.style.display = "none";
      return;
    }
    btn.addEventListener("click", function () {
      var isExpanded = grid.classList.toggle("is-expanded");
      btn.textContent = isExpanded ? "Voir moins de photos" : "Voir plus de photos";
    });
  });

  /* ---------------------------------------------------------
     Galerie : lightbox
     La liste des photos est reconstruite à chaque changement
     d'album, pour que les flèches ne naviguent qu'à l'intérieur
     de l'album actuellement affiché.
  --------------------------------------------------------- */
  var galleryItems = [];
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxClose = document.getElementById("lightbox-close");
  var lightboxPrev = document.getElementById("lightbox-prev");
  var lightboxNext = document.getElementById("lightbox-next");
  var lightboxCounter = document.getElementById("lightbox-counter");
  var currentIndex = 0;
  var lastFocusedElement = null;
  var touchStartX = null;

  function openLightbox(index) {
    currentIndex = index;
    var item = galleryItems[currentIndex];
    var full = item.getAttribute("data-full");
    var img = item.querySelector("img");
    lightboxImg.src = full;
    lightboxImg.alt = img ? img.alt : "";
    if (lightboxCounter) {
      lightboxCounter.textContent = (currentIndex + 1) + " / " + galleryItems.length;
    }
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

  function refreshGalleryItems() {
    var activeAlbum = document.querySelector(".gallery-album:not([hidden])");
    galleryItems = activeAlbum
      ? Array.prototype.slice.call(activeAlbum.querySelectorAll(".gallery-item"))
      : [];
    galleryItems.forEach(function (item, index) {
      item.onclick = function () {
        openLightbox(index);
      };
    });
  }

  refreshGalleryItems();

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

  /* Balayage tactile (swipe) pour naviguer entre les photos sur mobile */
  if (lightbox) {
    lightbox.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    lightbox.addEventListener(
      "touchend",
      function (e) {
        if (touchStartX === null) return;
        var deltaX = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(deltaX) > 40) {
          showRelative(deltaX > 0 ? -1 : 1);
        }
        touchStartX = null;
      },
      { passive: true }
    );
  }

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

      /* Piège à robots : si ce champ caché a été rempli, c'est un
         robot de spam. On fait comme si tout allait bien, sans
         rien envoyer. */
      if (form._gotcha && form._gotcha.value) {
        status.textContent = "Votre demande a bien été envoyée.";
        form.reset();
        return;
      }

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

      if (FORM_ENDPOINT) {
        /* Envoi direct via Formspree (ou service équivalent) :
           pas besoin que le visiteur ait une messagerie configurée. */
        var submitBtn = form.querySelector("button[type=submit]");
        if (submitBtn) submitBtn.disabled = true;
        status.textContent = "Envoi en cours...";

        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form)
        })
          .then(function (response) {
            if (response.ok) {
              status.textContent = "Merci ! Votre demande a bien été envoyée, nous revenons vers vous rapidement.";
              form.reset();
            } else {
              status.textContent = "Une erreur est survenue. Vous pouvez aussi nous écrire directement par e-mail ou WhatsApp.";
            }
          })
          .catch(function () {
            status.textContent = "Une erreur est survenue. Vous pouvez aussi nous écrire directement par e-mail ou WhatsApp.";
          })
          .finally(function () {
            if (submitBtn) submitBtn.disabled = false;
          });
        return;
      }

      /* Comportement par défaut (aucun FORM_ENDPOINT renseigné) :
         on prépare un e-mail pré-rempli à destination du propriétaire. */
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
