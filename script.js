window.addEventListener("load", () => {
  document.querySelector(".page-loader")?.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const delay = entry.target.dataset.delay;
        if (entry.isIntersecting) {
          if (delay) {
            entry.target.style.transitionDelay = `${parseFloat(delay)}s`;
          }
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
          if (delay) {
            entry.target.style.transitionDelay = "";
          }
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  document
    .querySelectorAll("[data-animate], .pillars article, .work-card, .step")
    .forEach((el) => observer.observe(el));

  const dynamicText = document.querySelector(".dynamic-text");
  if (dynamicText) {
    let words = [];
    try {
      words = JSON.parse(dynamicText.dataset.words || "[]");
    } catch (error) {
      console.warn("تعذر قراءة الكلمات المتحركة:", error);
    }
    words = (Array.isArray(words) && words.length ? words : [dynamicText.textContent.trim()]).filter(
      Boolean
    );
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const currentWord = words[wordIndex] || "";
      if (!deleting) {
        dynamicText.textContent = currentWord.slice(0, ++charIndex);
        if (charIndex === currentWord.length) {
          deleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else {
        dynamicText.textContent = currentWord.slice(0, --charIndex);
        if (charIndex === 0) {
          deleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(type, deleting ? 60 : 120);
    };
    type();
  }

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    let timeoutId;
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width - 0.5) * 10).toFixed(2);
      const rotateX = ((0.5 - y / rect.height) * 10).toFixed(2);
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      clearTimeout(timeoutId);
    });

    card.addEventListener("mouseleave", () => {
      timeoutId = setTimeout(() => {
        card.style.transform = "";
      }, 150);
    });
  });

  const contactForm = document.querySelector(".contact-card");
  if (contactForm) {
    const statusEl = contactForm.querySelector(".form-alert");
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    if (!statusEl || !submitBtn) {
      return;
    }

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) {
        return;
      }

      statusEl.classList.remove("success", "error");
      statusEl.textContent = "جارٍ إرسال الرسالة...";
      statusEl.classList.add("visible");
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method || "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        contactForm.reset();
        statusEl.innerHTML = `
          <span class="check-icon" aria-hidden="true">
            <svg viewBox="0 0 52 52">
              <circle class="check-icon-circle" cx="26" cy="26" r="25"></circle>
              <path class="check-icon-check" d="M14 27l7 7 17-17"></path>
            </svg>
          </span>
          <span>تم إرسال الرسالة بنجاح!</span>
        `;
        statusEl.classList.add("success");
      } catch (error) {
        console.error("تعذر إرسال الرسالة:", error);
        statusEl.textContent = "تعذر إرسال الرسالة. حاول مجدداً لاحقاً.";
        statusEl.classList.add("error");
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
});

