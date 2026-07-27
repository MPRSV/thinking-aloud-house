document.getElementById("year").textContent = new Date().getFullYear();

const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");

const observer = new IntersectionObserver(
  ([entry]) => {
    header.classList.toggle("solid", !entry.isIntersecting);
  },
  { threshold: 0.15 }
);

observer.observe(hero);
