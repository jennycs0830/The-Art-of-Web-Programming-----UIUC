const sections = document.querySelectorAll(".section");
const navbarLinks = document.querySelectorAll(".navbar a");
const navbar = document.querySelector(".navbar");
const targetSections = document.querySelectorAll(
  ".section, .multi-column-section, .carousel-container, .fixed-background, .modal-section"
);
const openModalBtn = document.querySelector(".open-modal-btn");
const modal = document.getElementById("modal");
const closeModalBtn = document.querySelector(".close");

function highlightNavbarLink() {
  let closestSectionIndex = -1;
  let closestDistance = Infinity;

  targetSections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top;

    const distance = Math.abs(sectionTop);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestSectionIndex = index;
    }
  });

  if (closestSectionIndex != -1) {
    navbarLinks.forEach((link) => {
      link.classList.remove("active");
    });
    navbarLinks[closestSectionIndex].classList.add("active");
  }
}

navbarLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

function adjustNavbarSize() {
  const scrollY = window.scrollY || window.pageYOffset;
  const initialFontSize = 20;
  const minFontSize = 16;
  const maxFontSize = 20;

  const newFontSize = Math.max(maxFontSize - scrollY / 10, minFontSize);
  navbar.style.fontSize = newFontSize + "px";
}

window.addEventListener("scroll", highlightNavbarLink);
window.addEventListener("scroll", adjustNavbarSize);
highlightNavbarLink();
adjustNavbarSize();

openModalBtn.addEventListener("click", () => {
  modal.classList.remove("hiding");
  modal.classList.add("showing");
  modal.style.display = "block";
});
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("showing");
  modal.classList.add("hiding");

  setTimeout(() => {
    modal.style.display = "none";
  }, 500);
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.classList.remove("showing");
    modal.classList.add("hiding");
    setTimeout(() => {
      modal.style.display = "none";
    }, 500);
  }
});

let slideIndex = 1;
showSlide(slideIndex);

function changeSlide(n) {
  showSlide((slideIndex += n));
}

function currentSlide(n) {
  showSlide((slideIndex = n));
}

function showSlide(n) {
  const slides = document.querySelectorAll(".carousel-slide");
  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;
  slides.forEach((slide) => {
    slide.style.display = "none";
  });
  slides[slideIndex - 1].style.display = "block";
}

const prevBtn = document.getElementById("prevBtn");
console.log( prevBtn );
prevBtn.addEventListener("click", () => {
  console.log("prevBtn click!");
  changeSlide(-1);
});
const nextBtn = document.getElementById("nextBtn");
console.log( nextBtn );
nextBtn.addEventListener("click", () => {
  console.log("nextBtn click!");
  changeSlide(1);
});