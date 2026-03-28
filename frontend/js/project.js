/*********************************
 * CONFIG
 *********************************/
const BASE_URL = "http://localhost:5000";
const AUTH_API = `${BASE_URL}/api/auth`;
const PROJECTS_API = `${BASE_URL}/api/projects`;

const DEFAULT_PROFILE_IMG = "./assets/images/profile.jpg";
const DEFAULT_PROJECT_IMG = "./assets/images/default-project.jpg";

/*********************************
 * HELPERS
 *********************************/
function normalizeStatus(status) {
  return (status || "").toString().trim().toLowerCase();
}

function isAdminUser() {
  return localStorage.getItem("userRole") === "admin";
}

function getStatusBadgeClass(status) {
  switch (normalizeStatus(status)) {
    case "completed":
      return "bg-success text-white";
    case "ongoing":
      return "bg-primary text-white";
    case "upcoming":
      return "bg-warning text-dark";
    default:
      return "bg-secondary text-white";
  }
}

function getProjectImage(project) {
  const image = project.coverImage || project.photos?.[0] || "";

  if (typeof image === "string" && (image.startsWith("http://") || image.startsWith("https://"))) {
    return image;
  }

  if (image && image !== "undefined" && image !== "null") {
    return `${BASE_URL}/uploads/projects/${image}`;
  }

  return DEFAULT_PROJECT_IMG;
}

/*********************************
 * DOM READY
 *********************************/
document.addEventListener("DOMContentLoaded", async () => {
  const profileImg = document.getElementById("navbarProfileImg");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const profileLink = document.getElementById("profileLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const projectList = document.getElementById("projectList");
  const searchInput = document.getElementById("searchInput");

  // "" = show all
  // "completed" = only completed
  // "ongoing" = only ongoing
  // "upcoming" = only upcoming
  const PAGE_STATUS = "";

  function guestUI() {
    loginLink?.classList.remove("d-none");
    registerLink?.classList.remove("d-none");
    profileLink?.classList.add("d-none");
    logoutBtn?.classList.add("d-none");

    if (profileImg) {
      profileImg.src = DEFAULT_PROFILE_IMG;
      profileImg.onerror = () => {
        profileImg.src = "https://via.placeholder.com/32";
      };
    }
  }

  function userUI(user) {
    loginLink?.classList.add("d-none");
    registerLink?.classList.add("d-none");
    profileLink?.classList.remove("d-none");
    logoutBtn?.classList.remove("d-none");

    if (profileImg) {
      profileImg.src = user.photo
        ? `${BASE_URL}/uploads/${user.photo}`
        : DEFAULT_PROFILE_IMG;

      profileImg.onerror = () => {
        profileImg.src = DEFAULT_PROFILE_IMG;
      };
    }

    localStorage.setItem("userRole", user.role);
  }

  async function checkAuth() {
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      guestUI();
      return;
    }

    try {
      const res = await fetch(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      if (!res.ok) throw new Error("Invalid token");

      const user = await res.json();
      userUI(user);
    } catch (err) {
      console.warn("Session expired");
      localStorage.clear();
      guestUI();
    }
  }

  function renderProjects(projects) {
    if (!projectList) return;

    projectList.innerHTML = "";

    if (!projects || projects.length === 0) {
      projectList.innerHTML = `
        <p class="text-center w-100 text-light">No projects found</p>
      `;
      return;
    }

    projects.forEach(project => {
      const image = getProjectImage(project);
      const status = normalizeStatus(project.status);

      projectList.innerHTML += `
        <div class="col-12 col-sm-6 col-md-4 mb-4">
          <div class="card h-100 project-card">
            <div class="img-wrapper">
              <img
                src="${image}"
                class="card-img-top main-img"
                alt="${project.title || "Project"}"
                onerror="this.src='${DEFAULT_PROJECT_IMG}'"
              />
            </div>

            <div class="card-body">
              <span class="badge mb-2 text-capitalize ${getStatusBadgeClass(status)}">
                ${status || "unknown"}
              </span>

              <h5 class="card-title">${project.title || "Untitled Project"}</h5>
              <p class="card-text">${project.address || ""}</p>

              <a href="project-details.html?id=${project._id}" class="btn btn-sm btn-primary">
                View
              </a>

              ${
                isAdminUser()
                  ? `
                    <a href="edit-project.html?id=${project._id}" class="btn btn-sm btn-warning ms-1">
                      Edit
                    </a>

                    
                  `
                  : ""
              }
            </div>
          </div>
        </div>
      `;
    });
  }

  async function loadProjects(query = "") {
    if (!projectList) return;

    try {
      const res = await fetch(`${PROJECTS_API}?search=${encodeURIComponent(query)}`);
      const data = await res.json();

      console.log("Fetched Projects from API:", data);

      const projects = Array.isArray(data) ? data : [];

      const filteredProjects = PAGE_STATUS
        ? projects.filter(project => normalizeStatus(project.status) === PAGE_STATUS)
        : projects;

      renderProjects(filteredProjects);
    } catch (err) {
      console.error(err);
      projectList.innerHTML = `
        <p class="text-center text-danger">
          Error loading projects
        </p>
      `;
    }
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });

  searchInput?.addEventListener("input", e => {
    loadProjects(e.target.value);
  });

  await checkAuth();
  loadProjects();
});

/*********************************
 * DELETE PROJECT
 *********************************/
async function deleteProject(id) {
  if (!confirm("Delete this project?")) return;

  const authToken = localStorage.getItem("token");

  try {
    const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.ok) {
      location.reload();
    } else {
      alert("Delete failed");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}