document.addEventListener("DOMContentLoaded", () => {
  const loadContent = (page) => {
    fetch(`/pages/${page}.html`)
      .then((response) => response.text())
      .then((data) => {
        document.getElementById("main-content").innerHTML = data;
      })
      .catch((err) => {
        console.error("Error loading page:", err);
        document.getElementById("main-content").innerHTML =
          "<p>Error loading content.</p>";
      });
  };

  // Load the home page initially
  loadContent("home");

  // Add event listeners to navigation links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;
      loadContent(page);
    });
  });
});
