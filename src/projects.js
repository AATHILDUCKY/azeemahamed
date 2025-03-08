// Fetch JSON Data and Initialize Page
const tagsContainer = document.getElementById("tagsContainer");
const projectsContainer = document.getElementById("projectsContainer");
const searchInput = document.getElementById("searchInput");
let projects = [];
let activeTag = "All";
let currentIndex = 0; // Track current index for "Show More" functionality
const projectsPerPage = 9; // Number of projects to display by default

// Fetch JSON Data
fetch("/src/projects.json")
  .then((res) => res.json())
  .then((data) => {
    // Sort projects by rating in descending order
    projects = data.sort((a, b) => b.rating - a.rating);
    renderTags();
    renderProjects(projects.slice(0, projectsPerPage)); // Load initial 9 projects
  });

// Render Tags
const renderTags = () => {
  const tags = ["All", ...new Set(projects.map((project) => project.category))];
  tagsContainer.innerHTML = "";
  tags.forEach((tag) => {
    const tagButton = document.createElement("button");
    tagButton.textContent = tag;
    tagButton.className =
      "px-4 py-2 bg-gray-800 text-gray-100 rounded-lg hover:bg-purple-500 transition duration-300";
    if (tag === activeTag) {
      tagButton.classList.add("bg-purple-500");
    }
    tagButton.addEventListener("click", () => {
      activeTag = tag;
      currentIndex = 0; // Reset index when changing tags
      renderTags();
      filterProjects();
    });
    tagsContainer.appendChild(tagButton);
  });
};

// Render Projects
const renderProjects = (projectList) => {
  projectsContainer.innerHTML = "";
  const visibleProjects = projectList.slice(0, currentIndex + projectsPerPage);
  visibleProjects.forEach((project) => {
    const card = document.createElement("div");
    card.className =
      "border border-gray-800 bg-gray-800 rounded-lg shadow-lg hover:shadow-md transition duration-300 transform hover:scale-102"; // Reduced hover effect
    card.innerHTML = `
      <a href="${project.link}" target="_blank" class="block">
        <img
          src="${project.image}"
          alt="${project.title}"
          class="w-full h-48 object-cover rounded-t-lg"
        />
        <div class="p-4">
          <h3 class="text-lg font-semibold text-purple-400">${project.title}</h3>
          <p class="text-sm text-gray-300">${project.description}</p>
        </div>
      </a>
    `;
    projectsContainer.appendChild(card);
  });
  renderShowMoreButton(projectList.length > visibleProjects.length);
};

// Render Show More Button
const renderShowMoreButton = (hasMore) => {
  let showMoreButton = document.getElementById("showMoreButton");
  if (hasMore) {
    if (!showMoreButton) {
      showMoreButton = document.createElement("button");
      showMoreButton.id = "showMoreButton";
      showMoreButton.textContent = "Show More Projects";
      showMoreButton.className =
        "mx-auto mt-6 block px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300";
      showMoreButton.addEventListener("click", () => {
        currentIndex += projectsPerPage;
        renderProjects(
          activeTag === "All"
            ? projects
            : projects.filter((project) => project.category === activeTag)
        );
      });
      projectsContainer.parentElement.appendChild(showMoreButton);
    }
  } else if (showMoreButton) {
    showMoreButton.remove();
  }
};

// Filter Projects by Tag
const filterProjects = () => {
  const filtered =
    activeTag === "All"
      ? projects
      : projects.filter((project) => project.category === activeTag);
  currentIndex = 0; // Reset index when filtering
  renderProjects(filtered);
};

// Search Projects
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query)
  );
  currentIndex = 0; // Reset index when searching
  renderProjects(filtered);
});
