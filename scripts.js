document.addEventListener("DOMContentLoaded", () => {

  const links = document.querySelectorAll("nav ul li a, .header a");
  const sections = document.querySelectorAll("section, header");
  const form = document.getElementById("contact-form");
  const emailInput = document.getElementById("email"); 
  const message = document.getElementById("form-message");
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector('nav');
  const navLinks = document.querySelector(".nav-links");
  const logo = document.querySelector("nav .logo")

  const ZEROBOUNCE_API_KEY = "b21226e0fe014941a70746f5766808d1";

  // Smooth scrolling and active link handling
  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      updateActiveLink(link);
    });
  });

  function updateActiveLink(activeLink) {
    links.forEach(l => l.classList.remove("active"));
    activeLink.classList.add("active");
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;

      if (entry.isIntersecting) {
        // Update active navbar link
        links.forEach(link => {
          const isActive = link.getAttribute("href").substring(1) === id;
          link.classList.toggle("active", isActive);
        });

        if (!entry.target.classList.contains('fade-up')) {
          entry.target.classList.add("fade-up");
        }
      }
    });
  }, {
    threshold: 0.2
  });

  sections.forEach(section => observer.observe(section));

  // Toggle hamburger navigation menu visibility
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation(); 
    navLinks.classList.toggle("show");
    hamburger.classList.toggle("hidden");
    logo.classList.toggle("hidden");
  });
  
  links.forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        nav.classList.remove("hidden");
        hamburger.classList.remove("hidden");
        logo.classList.remove("hidden");
      });
  });
  
  document.addEventListener("click", (e) => {
      const isHamburger = hamburger.contains(e.target); 
      const isMenu = navLinks.contains(e.target); 
  
      if (!isHamburger && !isMenu) {
      navLinks.classList.remove("show");
      nav.classList.remove("hidden");
      hamburger.classList.remove("hidden"); 
      logo.classList.remove("hidden");
      }
    });

  // Email verification with ZeroBounce
  async function verifyEmail(email) {
    try {
      const response = await fetch(
        `https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`
      );
      const data = await response.json();
      return data.status === "valid"; // Check if email is valid
    } catch (error) {
      console.error("Error verifying email:", error);
      return false;
    }
  }

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value;

    // Verify email before proceeding
    const isEmailValid = await verifyEmail(email);

    if (!isEmailValid) {
      alert("The email address is invalid. Please provide a valid email.");
      return;
    }

    // Proceed with submission if email is valid
    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    }).then(response => {
      if (response.ok) {
        message.style.display = "block"; // Show success message
        form.reset(); // Reset the form
      } else {
        alert("There was an issue sending your message. Please try again later.");
      }
    }).catch(() => {
      alert("There was an issue sending your message. Please try again later.");
    });
  });
});
