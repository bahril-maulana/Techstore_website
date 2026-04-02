document.addEventListener("DOMContentLoaded", function () {
      const revealItems = document.querySelectorAll("[data-reveal], .testimonial-card, .product-card, .cat-card, .feature-item");

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

      revealItems.forEach((item, index) => {
        item.classList.add("reveal-init");
        item.style.transitionDelay = item.hasAttribute("data-reveal") ? "70ms" : `${Math.min(index % 6, 5) * 100}ms`;
        revealObserver.observe(item);
      });

      const sections = Array.from(document.querySelectorAll("section[id], footer[id]"));
      const navLinks = Array.from(document.querySelectorAll(".phlox-nav .nav-link[href^='#']"));

      const activateNav = () => {
        const scrollPosition = window.scrollY + 140;
        let currentId = "home";

        sections.forEach((section) => {
          if (scrollPosition >= section.offsetTop) {
            currentId = section.id;
          }
        });

        navLinks.forEach((link) => {
          const targetId = link.getAttribute("href").replace("#", "");
          link.classList.toggle("active", targetId === currentId);
        });
      };

      activateNav();
      window.addEventListener("scroll", activateNav, { passive: true });

      const statsSection = document.querySelector(".testimonial-stats");
      const counterElements = document.querySelectorAll(".counter-value[data-counter]");

      const formatCounter = (value, suffix) => {
        if (suffix === "k+") {
          return `${Math.floor(value / 1000)}k<span>+</span>`;
        }
        if (suffix === "%") {
          return `${Math.floor(value)}<span>%</span>`;
        }
        return `${Math.floor(value)}`;
      };

      const animateCounter = (element) => {
        const target = Number(element.dataset.counter || 0);
        const suffix = element.dataset.counterSuffix || "";
        const duration = 1600;
        const startTime = performance.now();

        const updateValue = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = target * eased;
          element.innerHTML = formatCounter(current, suffix);

          if (progress < 1) {
            requestAnimationFrame(updateValue);
          } else {
            element.innerHTML = formatCounter(target, suffix);
          }
        };

        requestAnimationFrame(updateValue);
      };

      if (statsSection && counterElements.length) {
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              counterElements.forEach(animateCounter);
              counterObserver.disconnect();
            }
          });
        }, { threshold: 0.4 });

        counterObserver.observe(statsSection);
      }

      const testimonialSlides = Array.from(document.querySelectorAll("[data-testimonial-slide]"));
      const prevButton = document.querySelector("[data-testimonial-prev]");
      const nextButton = document.querySelector("[data-testimonial-next]");
      let activeSlide = 0;
      let sliderInterval = null;

      const updateSlides = () => {
        const mobileMode = window.innerWidth < 992;

        testimonialSlides.forEach((slide, index) => {
          if (mobileMode) {
            slide.classList.toggle("is-active", index === activeSlide);
          } else {
            slide.classList.add("is-active");
          }
        });
      };

      const moveSlide = (direction) => {
        if (window.innerWidth >= 992 || testimonialSlides.length === 0) return;
        activeSlide = (activeSlide + direction + testimonialSlides.length) % testimonialSlides.length;
        updateSlides();
      };

      const startSlider = () => {
        clearInterval(sliderInterval);
        if (window.innerWidth >= 992 || testimonialSlides.length === 0) return;
        sliderInterval = setInterval(() => moveSlide(1), 4500);
      };

      prevButton?.addEventListener("click", () => {
        moveSlide(-1);
        startSlider();
      });

      nextButton?.addEventListener("click", () => {
        moveSlide(1);
        startSlider();
      });

      window.addEventListener("resize", () => {
        updateSlides();
        startSlider();
      });

      updateSlides();
      startSlider();
    });