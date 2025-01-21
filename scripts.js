
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav ul li a, .header a");
  const sections = document.querySelectorAll("section, header");
  const form = document.getElementById("contact-form");
  const emailInput = document.getElementById("email"); // Email input field
  const message = document.getElementById("form-message");

  const ZEROBOUNCE_API_KEY = "b21226e0fe014941a70746f5766808d1"; // Replace with your actual API key

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

      links.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href").substring(1) === id);
        });
        entry.target.classList.add("fade-up");
      } else {
        entry.target.classList.remove("fade-up");
      }
    });
  }, {
    threshold: 0.2
  });

  sections.forEach(section => observer.observe(section));

  // Email verification with ZeroBounce
  async function verifyEmail(email) {
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${ZEROBOUNCE_API_KEY}&email=${email}`
    );
    const data = await response.json();
    return data.status === "valid"; // Check if email is valid
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

