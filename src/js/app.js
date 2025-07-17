const slides = document.querySelectorAll(".slide-item");
const slideNumber = document.querySelector(".slider-section-title .number");
const sliderContainer = document.getElementById("slider-container");

let currentSlide = 0;
let slideInterval = setInterval(nextSlide, 5000);

function showSlide() {
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentSlide);
    slideNumber.textContent = "0" + (currentSlide + 1);
  });
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

if (sliderContainer) {
  let touchStartX = 0;
  let touchEndX = 0;

  sliderContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  sliderContainer.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;

    if (swipeDistance < -swipeThreshold) {
      nextSlide();
      resetInterval();
    } else if (swipeDistance > swipeThreshold) {
      prevSlide();
      resetInterval();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.querySelector("#skills-section");
  const progressBars = document.querySelectorAll(".progress");

  if (skillsSection) {
    const observerCallback = (items) => {
      items.forEach((item) => {
        if (item.isIntersecting) {
          progressBars.forEach((bar) => {
            bar.style.width = bar.dataset.width;
          });
        } else {
          progressBars.forEach((bar) => {
            bar.style.width = "0";
          });
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    observer.observe(skillsSection);
  }
});

document.addEventListener("DOMContentLoaded", () => {
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

  function createTestimonialSlider(data, elements) {
    const { textEl, photoEl, professionEl, nameEl, navEl } = elements;
    let navigationButtons = [];

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

  createTestimonialSlider(testimonialsData, {
    textEl: document.getElementById("slide-text"),
    photoEl: document.getElementById("slide-photo"),
    professionEl: document.getElementById("slide-profession"),
    nameEl: document.getElementById("slide-name"),
    navEl: document.querySelector(".slider-nav"),
  });
});

const form = document.getElementById("contact-form");
const username = document.getElementById("name");
const email = document.getElementById("email");
const website = document.getElementById("website");
const message = document.getElementById("message");
const submitButton = document.getElementById("submit-button");
const successDialog = document.getElementById("successDialog");
const closeDialogBtn = document.getElementById("closeDialogBtn");

closeDialogBtn.addEventListener("click", () => {
  successDialog.close();
});

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
  return input.validity.valueMissing || input.value.trim() === "";
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
  fetch("https://borjomi.loremipsum.ge/api/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

username.addEventListener("input", validateName);
email.addEventListener("input", validateEmail);
message.addEventListener("input", validateMessage);
website.addEventListener("input", validateWebsite);

document.addEventListener("DOMContentLoaded", function () {
  const categoryItems = document.querySelectorAll(".projects-menu li");
  const projects = document.querySelectorAll(".project");

  categoryItems.forEach((item) => {
    item.addEventListener("click", () => {
      categoryItems.forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const selectedCategory = item.getAttribute("data-category");

      projects.forEach((project) => {
        const projectCategory = project.getAttribute("data-category");

        if (
          selectedCategory === "all" ||
          projectCategory === selectedCategory
        ) {
          project.style.display = "block";
        } else {
          project.style.display = "none";
        }
      });
    });
  });
});
