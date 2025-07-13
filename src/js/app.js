const slides = document.querySelectorAll(".slide-item");
const slideNumber = document.querySelector(".slider-section-title .number");
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

document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.querySelector("#skills-section");
  const progressBars = document.querySelectorAll(".progress");

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
});

document.addEventListener("DOMContentLoaded", () => {
  const testimonialsData = [
    {
      text: "Ana Kavtaradze is the bridge between design and code that every designer wishes for. Her work is clean, precise, and she has an innate understanding of visual hierarchy and spacing. She made my designs better. I would work with her again in a heartbeat.",
      photo: "/src/images/d3.svg",
      profession: "Graphic Designer",
      name: "Anna Keller",
    },
    {
      text: "A great developer and an even better teammate. Ana elevates the entire team with their positive attitude and insightful code reviews. A pleasure to lead.",
      photo: "/src/images/d4.svg",
      profession: "Lead Developer",
      name: "Mau Thomas",
    },
    {
      text: "Ana Kavtardze is a fantastic technical partner. She excels at collaborating with design, QA, and backend teams to deliver a polished final product. She doesn't just build features; she takes ownership of the outcome and is committed to the project's success. Highly effective.",
      photo: "/src/images/d5.svg",
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

      displayTestimonial(clickedButton.dataset.index);
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
