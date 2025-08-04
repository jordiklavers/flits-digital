console.log("test");

// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on("scroll", ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);

UnicornStudio.init()
  .then((scenes) => {
    // Scenes are ready
  })
  .catch((err) => {
    console.error(err);
  });

$("section[data-theme]").each(function () {
  let theme = 1;
  if ($(this).attr("data-theme") === "dark") theme = 2;

  ScrollTrigger.create({
    trigger: $(this),
    start: "top 2%",
    end: "bottom top",
    onToggle: ({ self, isActive }) => {
      if (isActive)
        gsap.to(".navigatie", { ...colorThemes[theme], duration: 0.3 });
    },
  });
});

gsap.registerPlugin(CustomEase, ScrollTrigger);

CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");

gsap.defaults({
  ease: "main",
  duration: 0.7,
});

initMenu();
initModalBasic();
initScrollTriggerAnimations();
initAdvancedFormValidation();

function initMenu() {
  let navWrap = document.querySelector(".navigatie_menu");
  let state = navWrap.getAttribute("data-nav");
  let overlay = navWrap.querySelector(".overlay");
  let menu = navWrap.querySelector(".menu");
  let bg = navWrap.querySelector(".menu_bg");
  let menuLinks = navWrap.querySelectorAll(".menu_link");
  let fadeTargets = navWrap.querySelector(".menu_details");
  let flitsLogo = document.querySelectorAll("#flitslogo");

  let menuToggles = document.querySelectorAll("[data-menu-toggle]");
  let menuButton = document.querySelector(".navigatie_button-wrap");
  let firstMenuIcon = menuButton.querySelector(".navigatie_button-icon-1");
  let secondMenuIcon = menuButton.querySelector(".navigatie_button-icon-2");

  let navLinks = document.querySelectorAll(".nav_link");

  let tl = gsap.timeline();

  const openNav = () => {
    navWrap.setAttribute("data-nav", "open");

    tl.clear()
      .set(navWrap, { display: "block" })
      .set(menu, { xPercent: 0 }, "<")
      .fromTo(firstMenuIcon, { y: "0rem" }, { y: "-2rem", duration: 0.4 })
      .fromTo(secondMenuIcon, { y: "2rem" }, { y: "0rem", duration: 0.5 }, "<")
      .fromTo(
        flitsLogo,
        { y: "0rem" },
        {
          y: "-1.2rem",
          duration: 0.3,
          stagger: {
            from: "left",
            amount: 0.08,
          },
        },
        "<+0.15"
      )
      .fromTo(
        navLinks,
        { y: "0rem" },
        { y: "-1.5rem", stagger: 0.1, duration: 0.3 },
        "<"
      )
      .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
      .fromTo(
        bg,
        { xPercent: -120 },
        { xPercent: 0, stagger: 0.12, duration: 0.575 },
        "<"
      )
      .fromTo(menuLinks, { yPercent: 140 }, { yPercent: 0, stagger: 0.1 }, "<")
      .fromTo(
        fadeTargets,
        { autoAlpha: 0, yPercent: 50 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.5,
        },
        "<+=0.2"
      );
  };

  const closeNav = () => {
    navWrap.setAttribute("data-nav", "closed");

    tl.clear()
      .to(overlay, { autoAlpha: 0 })
      .to(menu, { xPercent: -120 }, "<")
      .to(firstMenuIcon, { y: "0rem" }, "<")
      .to(secondMenuIcon, { y: "2rem" }, "<")
      .to(navLinks, { y: "0rem", stagger: 0.1, duration: 0.5 }, "<")
      .to(flitsLogo, { y: "0rem", duration: 0.3, stagger: 0.1 }, "<+0.2")
      .set(navWrap, { display: "none" });
  };

  // Toggle menu open / close depending on its current state
  menuToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      state = navWrap.getAttribute("data-nav");
      if (state === "open") {
        closeNav();
      } else {
        openNav();
      }
    });
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNav();
    });
  });

  // If menu is open, you can close it using the "escape" key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navWrap.getAttribute("data-nav") === "open") {
      closeNav();
    }
  });
}

function initModalBasic() {
  const modalGroup = document.querySelector("[data-modal-group-status]");
  const modals = document.querySelectorAll("[data-modal-name]");
  const modalTargets = document.querySelectorAll("[data-modal-target]");
  const isMobile = window.innerWidth <= 768;

  // Open modal
  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener("click", function () {
      if (!isMobile) lenis.stop();
      const modalTargetName = this.getAttribute("data-modal-target");

      // Close all modals
      modalTargets.forEach((target) =>
        target.setAttribute("data-modal-status", "not-active")
      );
      modals.forEach((modal) =>
        modal.setAttribute("data-modal-status", "not-active")
      );

      // Activate clicked modal
      document
        .querySelector(`[data-modal-target="${modalTargetName}"]`)
        .setAttribute("data-modal-status", "active");
      document
        .querySelector(`[data-modal-name="${modalTargetName}"]`)
        .setAttribute("data-modal-status", "active");

      // Set group to active
      if (modalGroup) {
        modalGroup.setAttribute("data-modal-group-status", "active");
      }
    });
  });

  // Close modal
  document.querySelectorAll("[data-modal-close]").forEach((closeBtn) => {
    closeBtn.addEventListener("click", closeAllModals);
  });

  // Close modal on `Escape` key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeAllModals();
    }
  });

  // Function to close all modals
  function closeAllModals() {
    modalTargets.forEach((target) =>
      target.setAttribute("data-modal-status", "not-active")
    );

    if (modalGroup) {
      modalGroup.setAttribute("data-modal-group-status", "not-active");
    }
    if (!isMobile) lenis.start();
  }
}

function initAdvancedFormValidation() {
  const forms = document.querySelectorAll("[data-form-validate]");

  forms.forEach((formContainer) => {
    const startTime = new Date().getTime();

    const form = formContainer.querySelector("form");
    if (!form) {
      console.log("no form");
      return;
    }

    const validateFields = form.querySelectorAll("[data-validate]");
    const dataSubmit = form.querySelector("[data-submit]");
    if (!dataSubmit) return;

    const realSubmitInput = dataSubmit.querySelector('input[type="submit"]');
    if (!realSubmitInput) return;

    function isSpam() {
      const currentTime = new Date().getTime();
      return currentTime - startTime < 5000;
    }

    // Disable select options with invalid values on page load
    validateFields.forEach(function (fieldGroup) {
      const select = fieldGroup.querySelector("select");
      if (select) {
        const options = select.querySelectorAll("option");
        options.forEach(function (option) {
          if (
            option.value === "" ||
            option.value === "disabled" ||
            option.value === "null" ||
            option.value === "false"
          ) {
            option.setAttribute("disabled", "disabled");
          }
        });
      }
    });

    function validateAndStartLiveValidationForAll() {
      let allValid = true;
      let firstInvalidField = null;

      validateFields.forEach(function (fieldGroup) {
        const input = fieldGroup.querySelector("input, textarea, select");
        const radioCheckGroup = fieldGroup.querySelector(
          "[data-radiocheck-group]"
        );
        if (!input && !radioCheckGroup) return;

        if (input) input.__validationStarted = true;
        if (radioCheckGroup) {
          radioCheckGroup.__validationStarted = true;
          const inputs = radioCheckGroup.querySelectorAll(
            'input[type="radio"], input[type="checkbox"]'
          );
          inputs.forEach(function (input) {
            input.__validationStarted = true;
          });
        }

        updateFieldStatus(fieldGroup);

        if (!isValid(fieldGroup)) {
          allValid = false;
          if (!firstInvalidField) {
            firstInvalidField = input || radioCheckGroup.querySelector("input");
          }
        }
      });

      if (!allValid && firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    }

    function isValid(fieldGroup) {
      const radioCheckGroup = fieldGroup.querySelector(
        "[data-radiocheck-group]"
      );
      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]'
        );
        const checkedInputs = radioCheckGroup.querySelectorAll("input:checked");
        const min = parseInt(radioCheckGroup.getAttribute("min")) || 1;
        const max =
          parseInt(radioCheckGroup.getAttribute("max")) || inputs.length;
        const checkedCount = checkedInputs.length;

        if (inputs[0].type === "radio") {
          return checkedCount >= 1;
        } else {
          if (inputs.length === 1) {
            return inputs[0].checked;
          } else {
            return checkedCount >= min && checkedCount <= max;
          }
        }
      } else {
        const input = fieldGroup.querySelector("input, textarea, select");
        if (!input) return false;

        let valid = true;
        const min = parseInt(input.getAttribute("min")) || 0;
        const max = parseInt(input.getAttribute("max")) || Infinity;
        const value = input.value.trim();
        const length = value.length;

        if (input.tagName.toLowerCase() === "select") {
          if (
            value === "" ||
            value === "disabled" ||
            value === "null" ||
            value === "false"
          ) {
            valid = false;
          }
        } else if (input.type === "email") {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          valid = emailPattern.test(value);
        } else {
          if (input.hasAttribute("min") && length < min) valid = false;
          if (input.hasAttribute("max") && length > max) valid = false;
        }

        return valid;
      }
    }

    function updateFieldStatus(fieldGroup) {
      const radioCheckGroup = fieldGroup.querySelector(
        "[data-radiocheck-group]"
      );
      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]'
        );
        const checkedInputs = radioCheckGroup.querySelectorAll("input:checked");

        if (checkedInputs.length > 0) {
          fieldGroup.classList.add("is--filled");
        } else {
          fieldGroup.classList.remove("is--filled");
        }

        const valid = isValid(fieldGroup);

        if (valid) {
          fieldGroup.classList.add("is--success");
          fieldGroup.classList.remove("is--error");
        } else {
          fieldGroup.classList.remove("is--success");
          const anyInputValidationStarted = Array.from(inputs).some(
            (input) => input.__validationStarted
          );
          if (anyInputValidationStarted) {
            fieldGroup.classList.add("is--error");
          } else {
            fieldGroup.classList.remove("is--error");
          }
        }
      } else {
        const input = fieldGroup.querySelector("input, textarea, select");
        if (!input) return;

        const value = input.value.trim();

        if (value) {
          fieldGroup.classList.add("is--filled");
        } else {
          fieldGroup.classList.remove("is--filled");
        }

        const valid = isValid(fieldGroup);

        if (valid) {
          fieldGroup.classList.add("is--success");
          fieldGroup.classList.remove("is--error");
        } else {
          fieldGroup.classList.remove("is--success");
          if (input.__validationStarted) {
            fieldGroup.classList.add("is--error");
          } else {
            fieldGroup.classList.remove("is--error");
          }
        }
      }
    }

    validateFields.forEach(function (fieldGroup) {
      const input = fieldGroup.querySelector("input, textarea, select");
      const radioCheckGroup = fieldGroup.querySelector(
        "[data-radiocheck-group]"
      );

      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]'
        );
        inputs.forEach(function (input) {
          input.__validationStarted = false;

          input.addEventListener("change", function () {
            requestAnimationFrame(function () {
              if (!input.__validationStarted) {
                const checkedCount =
                  radioCheckGroup.querySelectorAll("input:checked").length;
                const min = parseInt(radioCheckGroup.getAttribute("min")) || 1;

                if (checkedCount >= min) {
                  input.__validationStarted = true;
                }
              }

              if (input.__validationStarted) {
                updateFieldStatus(fieldGroup);
              }
            });
          });

          input.addEventListener("blur", function () {
            input.__validationStarted = true;
            updateFieldStatus(fieldGroup);
          });
        });
      } else if (input) {
        input.__validationStarted = false;

        if (input.tagName.toLowerCase() === "select") {
          input.addEventListener("change", function () {
            input.__validationStarted = true;
            updateFieldStatus(fieldGroup);
          });
        } else {
          input.addEventListener("input", function () {
            const value = input.value.trim();
            const length = value.length;
            const min = parseInt(input.getAttribute("min")) || 0;
            const max = parseInt(input.getAttribute("max")) || Infinity;

            if (!input.__validationStarted) {
              if (input.type === "email") {
                if (isValid(fieldGroup)) input.__validationStarted = true;
              } else {
                if (
                  (input.hasAttribute("min") && length >= min) ||
                  (input.hasAttribute("max") && length <= max)
                ) {
                  input.__validationStarted = true;
                }
              }
            }

            if (input.__validationStarted) {
              updateFieldStatus(fieldGroup);
            }
          });

          input.addEventListener("blur", function () {
            input.__validationStarted = true;
            updateFieldStatus(fieldGroup);
          });
        }
      }
    });

    dataSubmit.addEventListener("click", function () {
      if (validateAndStartLiveValidationForAll()) {
        if (isSpam()) {
          alert("Form submitted too quickly. Please try again.");
          return;
        }
        realSubmitInput.click();
      }
    });

    form.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
        event.preventDefault();
        if (validateAndStartLiveValidationForAll()) {
          if (isSpam()) {
            alert("Form submitted too quickly. Please try again.");
            return;
          }
          realSubmitInput.click();
        }
      }
    });
  });
}

function initScrollTriggerAnimations() {
  // Home Hero
  if (document.querySelector(".hero")) {
    $(".hero").each(function (index) {
      let triggerElement = $(this);
      let targetElement = $(this).find(".hero_header");

      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 1,
          markers: false,
        },
      });

      tl.to(targetElement, {
        ease: "none",
        yPercent: -50,
      });
    });
  }

  // Cases Horizontal scroll

  $(".cases_3image-slider").each(function () {
    console.log("test");
    let triggerElement = $(this);
    let targetElement = $(this).find("._3image-slider_wrap");

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
      },
    });

    tl.fromTo(
      targetElement,
      {
        x: "-20%",
      },
      {
        x: "20%",
        ease: "none",
      }
    );
  });
}

let flitsPath = $(".footer_svg").find("path");
console.log(flitsPath);

gsap.from(flitsPath, {
  scrollTrigger: {
    trigger: ".footer",
    start: "top 50%",
    end: "bottom bottom",
  },
  yPercent: 100,
  stagger: 0.2,
  ease: "main",
  duration: 0.7,
});

function updateTime() {
  // Maak een nieuwe datum gebaseerd op de Nederlandse tijd
  const now = new Date().toLocaleTimeString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Amsterdam",
  });

  // Pak het element met ID 'currentTime'
  const currentTimeElement = document.getElementById("currentTime");
  if (currentTimeElement) {
    // Update de inhoud van het element met de huidige tijd
    currentTimeElement.textContent = now;
  }
}

// Roep de functie meteen aan om de tijd direct te tonen
updateTime();

// Update de tijd elke seconde
setInterval(updateTime, 1000);

// ------------------- DIENSTEN PAGINA ------------------- //

const casesSwiper = new Swiper(".swiper.is-cases", {
  // Optional parameters
  direction: "horizontal",
  grabCursor: true,
  slidesPerView: 2,
  spaceBetween: 8,
  // breakpoints: {
  //   // when window width is >= 320px
  //   320: {
  //     slidesPerView: 1,
  //     spaceBetween: 8
  //   },
  //   // when window width is >= 480px
  //   480: {
  //     slidesPerView: 1,
  //     spaceBetween: 8
  //   },
  //   // when window width is >= 640px
  //   640: {
  //     slidesPerView: 2,
  //     spaceBetween: 16
  //   }
  // },
});

const reviewsSwiper = new Swiper(".swiper.is-reviews", {
  direction: "horizontal",
  grabCursor: true,
  loop: true,

  autoplay: {
    delay: 5000,
  },
  breakpoints: {
    768: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 3,
      spaceBetween: 16,
    },
  },
});
