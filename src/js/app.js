document.addEventListener("DOMContentLoaded", function () {
  initHeroSlider();
  initSkillsObserver();
  initContactSlider();
  initServiceCards();
  initTestimonialsSlider();
  initProjectsFilter();
  initProjectsMenuScroll();
  initContactForm();
  initSuccessDialog();

  function initHeroSlider() {
    const slides = document.querySelectorAll(".slide-item");
    const slideNumber = document.querySelector(".slider-section-title .number");
    const sliderContainer = document.getElementById("slider-container");

    if (!slides.length || !slideNumber || !sliderContainer) return;

    let currentSlide = 0;
    let slideInterval = setInterval(nextSlide, 5000);

    function showSlide() {
      slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentSlide);
      });
      slideNumber.textContent = "0" + (currentSlide + 1);
    }
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide();
    }
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide();
    }
    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    showSlide();

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        nextSlide();
        resetInterval();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
        resetInterval();
      }
    });

    let touchStartX = 0;
    sliderContainer.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
    });
    sliderContainer.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      if (touchEndX < touchStartX - 50) {
        nextSlide();
        resetInterval();
      }
      if (touchEndX > touchStartX + 50) {
        prevSlide();
        resetInterval();
      }
    });
  }

  function initSkillsObserver() {
    const skillsSection = document.querySelector("#skills-section");
    const progressBars = document.querySelectorAll(".progress");
    if (!skillsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          progressBars.forEach((bar) => {
            bar.style.width = entry.isIntersecting ? bar.dataset.width : "0";
          });
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(skillsSection);
  }

  function initContactSlider() {
    const container = document.querySelector(".contact-items-container");
    const dotsContainer = document.querySelector(".contact-nav-dots");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");
    let isSliderActive = false;

    function manageContactSlider() {
      if (window.innerWidth <= 768) {
        if (!isSliderActive) {
          initializeSlider();
          isSliderActive = true;
        }
      } else {
        if (isSliderActive) {
          destroySlider();
          isSliderActive = false;
        }
      }
    }

    function initializeSlider() {
      const items = document.querySelectorAll(".contact-items-container > div");
      const sliderWindow = document.querySelector(".contact-slider-window");
      if (!items || items.length === 0 || !sliderWindow) return;
      let currentIndex = 0;
      const totalItems = items.length;
      dotsContainer.innerHTML = "";
      items.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        dot.addEventListener("click", () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
      const dots = dotsContainer.querySelectorAll(".dot");
      function updateUI() {
        const slideWidth = sliderWindow.offsetWidth;
        container.style.transition = "transform 0.4s ease-out";
        container.style.transform = `translateX(-${
          currentIndex * slideWidth
        }px)`;
        dots.forEach((dot, index) =>
          dot.classList.toggle("active", index === currentIndex)
        );
      }
      function goToSlide(index) {
        currentIndex = index;
        updateUI();
      }
      nextBtn.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        nextBtn.classList.add("tapped");
        currentIndex = (currentIndex + 1) % totalItems;
        updateUI();
      });
      nextBtn.addEventListener("touchend", () =>
        setTimeout(() => nextBtn.classList.remove("tapped"), 150)
      );
      prevBtn.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        prevBtn.classList.add("tapped");
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateUI();
      });
      prevBtn.addEventListener("touchend", () =>
        setTimeout(() => prevBtn.classList.remove("tapped"), 150)
      );

      let isDragging = false,
        startPosX = 0,
        startPosY = 0,
        currentTranslate = 0,
        prevTranslate = 0;
      sliderWindow.addEventListener("touchstart", touchStart);
      sliderWindow.addEventListener("touchmove", touchMove);
      sliderWindow.addEventListener("touchend", touchEnd);
      sliderWindow.addEventListener("touchcancel", touchEnd);
      function touchStart(event) {
        startPosX = event.touches[0].clientX;
        startPosY = event.touches[0].clientY;
        isDragging = true;
        container.style.transition = "none";
        prevTranslate = -currentIndex * sliderWindow.offsetWidth;
        currentTranslate = prevTranslate;
      }
      function touchMove(event) {
        if (isDragging) {
          const diffX = event.touches[0].clientX - startPosX;
          const diffY = event.touches[0].clientY - startPosY;
          if (Math.abs(diffX) > Math.abs(diffY)) {
            event.preventDefault();
          }
          currentTranslate = prevTranslate + diffX;
          container.style.transform = `translateX(${currentTranslate}px)`;
        }
      }
      function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        const movedBy = currentTranslate - prevTranslate;
        container.style.transition = "transform 0.3s ease-out";
        if (movedBy < -75) {
          currentIndex = (currentIndex + 1) % totalItems;
        }
        if (movedBy > 75) {
          currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        }
        updateUI();
      }
      updateUI();
    }

    function destroySlider() {
      dotsContainer.innerHTML = "";
      container.style.transform = "";
    }

    manageContactSlider();
    window.addEventListener("resize", manageContactSlider);
  }

  function initServiceCards() {
    const serviceCards = document.querySelectorAll(".service-card");
    if (!serviceCards.length) return;

    serviceCards.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.stopPropagation();
        const isAlreadyActive = card.classList.contains("is-active");
        serviceCards.forEach((c) => c.classList.remove("is-active"));
        if (!isAlreadyActive) card.classList.add("is-active");
      });
    });
    document.addEventListener("click", () => {
      serviceCards.forEach((card) => card.classList.remove("is-active"));
    });
  }

  function initTestimonialsSlider() {
    const testimonialsData = [
      {
        text: "Ana Kavtaradze is the bridge between design and code that every designer wishes for. Her work is clean, precise, and she has an innate understanding of visual hierarchy and spacing. She made my designs better. I would work with her again in a heartbeat.",
        photo: "src/images/d3.svg",
        profession: "Graphic Designer",
        name: "Anna Keller",
      },
      {
        text: "A great developer and an even better teammate. Ana elevates the entire team with their positive attitude and insightful code reviews. A pleasure to lead.",
        photo: "src/images/d4.svg",
        profession: "Lead Developer",
        name: "Mau Thomas",
      },
      {
        text: "Ana Kavtaradze is a fantastic technical partner. She excels at collaborating with design, QA, and backend teams to deliver a polished final product. She doesn't just build features; she takes ownership of the outcome and is committed to the project's success. Highly effective.",
        photo: "src/images/d5.svg",
        profession: "Project Manager",
        name: "John Carter",
      },
    ];
    const elements = {
      textEl: document.getElementById("slide-text"),
      photoEl: document.getElementById("slide-photo"),
      professionEl: document.getElementById("slide-profession"),
      nameEl: document.getElementById("slide-name"),
      navEl: document.querySelector(".slider-nav"),
    };

    if (Object.values(elements).every((el) => el)) {
      createTestimonialSlider(testimonialsData, elements);
    }
  }

  // function initProjectsFilter() {
  //   const categoryItems = document.querySelectorAll(".projects-menu li");
  //   const projects = document.querySelectorAll(".project");
  //   if (!categoryItems.length) return;

  //   categoryItems.forEach((item) => {
  //     item.addEventListener("click", () => {
  //       categoryItems.forEach((i) => i.classList.remove("active"));
  //       item.classList.add("active");
  //       const selectedCategory = item.getAttribute("data-category");
  //       projects.forEach((project) => {
  //         const projectCategory = project.getAttribute("data-category");
  //         project.style.display =
  //           selectedCategory === "all" || projectCategory === selectedCategory
  //             ? "block"
  //             : "none";
  //       });
  //     });
  //   });

  function initProjectsFilter() {
    const categoryItems = document.querySelectorAll(".projects-menu li");
    const projects = document.querySelectorAll(".project");

    if (!categoryItems.length || !projects.length) return;

    categoryItems.forEach((item) => {
      item.addEventListener("click", () => {
        categoryItems.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        const selectedCategory = item.dataset.category;

        projects.forEach((project) => {
          const projectCategory = project.dataset.category;
          const shouldBeVisible =
            selectedCategory === "all" || projectCategory === selectedCategory;

          if (shouldBeVisible) {
            project.classList.remove("hidden");
          } else {
            project.classList.add("hidden");
          }
        });
      });
    });
  }

  function initProjectsMenuScroll() {
    const menuContainer = document.querySelector(".projects-menu");
    const menuList = document.querySelector(".projects-menu ul");
    if (!menuContainer || !menuList) return;

    const checkScroll = () => {
      const hasOverflow = menuList.scrollWidth > menuList.clientWidth;
      if (!hasOverflow) {
        menuContainer.classList.remove("is-scrollable");
        return;
      }
      const isScrolledToEnd =
        menuList.scrollLeft + menuList.clientWidth >= menuList.scrollWidth - 10;
      menuContainer.classList.toggle("is-scrollable", !isScrolledToEnd);
    };
    menuList.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    checkScroll();
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const username = document.getElementById("name");
    const email = document.getElementById("email");
    const website = document.getElementById("website");
    const message = document.getElementById("message");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const isNameValid = validateName();
      const isEmailValid = validateEmail();
      const isWebsiteValid = validateWebsite();
      const isMessageValid = validateMessage();
      if (isNameValid && isEmailValid && isWebsiteValid && isMessageValid) {
        const formData = {
          name: username.value,
          email: email.value,
          website: website.value,
          message: message.value,
        };
        sendUserData(formData);
      }
    });

    username.addEventListener("input", validateName);
    email.addEventListener("input", validateEmail);
    message.addEventListener("input", validateMessage);
    website.addEventListener("input", validateWebsite);
  }

  function initSuccessDialog() {
    const successDialog = document.getElementById("successDialog");
    if (successDialog) {
      const closeDialogBtn = document.getElementById("closeDialogBtn");
      closeDialogBtn.addEventListener("click", () => successDialog.close());
      successDialog.addEventListener("click", (event) => {
        const rect = successDialog.getBoundingClientRect();
        const isClickOutside =
          event.clientY < rect.top ||
          event.clientY > rect.bottom ||
          event.clientX < rect.left ||
          event.clientX > rect.right;
        if (isClickOutside) {
          successDialog.close();
        }
      });
    }
  }
});

function createTestimonialSlider(data, elements) {
  const { textEl, photoEl, professionEl, nameEl, navEl } = elements;
  let navigationButtons = [];
  navEl.innerHTML = "";
  data.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = "nav-btn";
    button.dataset.index = index;
    navEl.appendChild(button);
  });
  navigationButtons = navEl.querySelectorAll(".nav-btn");
  const displayTestimonial = (index) => {
    const testimonial = data[index];
    textEl.textContent = testimonial.text;
    photoEl.src = testimonial.photo;
    professionEl.textContent = testimonial.profession;
    nameEl.textContent = testimonial.name;
    navigationButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("active", buttonIndex == index);
    });
  };
  navEl.addEventListener("click", (event) => {
    const clickedButton = event.target.closest(".nav-btn");
    if (!clickedButton) return;
    displayTestimonial(Number(clickedButton.dataset.index));
  });
  displayTestimonial(0);
}

const form = document.getElementById("contact-form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const website = document.getElementById("website");
const message = document.getElementById("message");

function validateEmail() {
  const emailValue = email.value.trim();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (isEmpty(email)) {
    setError(email, "Email is required");
    return false;
  } else if (!emailRegex.test(emailValue)) {
    setError(email, "Please enter a valid email address");
    return false;
  } else {
    setSuccess(email, "Email is valid");
    return true;
  }
}

function validateName() {
  const nameValue = username.value.trim();
  if (isEmpty(username)) {
    setError(username, "Name is required");
    return false;
  } else if (nameValue.length < 3) {
    setError(username, "Name must be at least 3 characters long");
    return false;
  } else {
    setSuccess(username, "Name is valid");
    return true;
  }
}

function validateMessage() {
  const messageValue = message.value.trim();
  const minLength = 10;
  const maxLength = 300;
  if (isEmpty(message)) {
    setError(message, "Message is required");
    return false;
  } else if (messageValue.length < minLength) {
    setError(message, `Message must be at least ${minLength} characters long.`);
    return false;
  } else if (messageValue.length > maxLength) {
    setError(message, `Message cannot exceed ${maxLength} characters.`);
    return false;
  } else {
    setSuccess(message, "Message is valid");
    return true;
  }
}

function validateWebsite() {
  const websiteValue = website.value.trim();
  const urlRegex = /^(https?:\/\/)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/;
  if (isEmpty(website)) {
    setError(website, "Website is required");
    return false;
  } else if (!urlRegex.test(websiteValue)) {
    setError(
      website,
      "Please enter a valid website starting with http:// or https://"
    );
    return false;
  } else {
    setSuccess(website, "Website is valid");
    return true;
  }
}

function isEmpty(input) {
  return input.value.trim() === "";
}

function setError(element, message) {
  const formGroup = element.closest(".form-group");
  formGroup.classList.remove("success");
  formGroup.classList.add("error");
  formGroup.querySelector(".message").textContent = message;
}

function setSuccess(element, message) {
  const formGroup = element.closest(".form-group");
  formGroup.classList.remove("error");
  formGroup.classList.add("success");
  formGroup.querySelector(".message").textContent = message;
}

function clearValidationStyles() {
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("error", "success");
    group.querySelector(".message").textContent = "";
  });
}

function sendUserData(formData) {
  const successDialog = document.getElementById("successDialog");
  fetch("https://borjomi.loremipsum.ge/api/send-message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (
        data.status === 1 &&
        data.desc === "Message has been sent successfully"
      ) {
        successDialog.showModal();
        form.reset();
        clearValidationStyles();
      }
    })
    .catch((error) => {
      console.error("Error sending data:", error);
      alert(
        "An error occurred while sending your message. Please try again later."
      );
    });
}
