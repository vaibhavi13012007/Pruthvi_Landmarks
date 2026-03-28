document.addEventListener("DOMContentLoaded", async () => {
  const API = "http://localhost:5000/api/auth";
  const STATS_API = "http://localhost:5000/api/stats";

  // Navbar elements
  const profileImg = document.getElementById("navbarProfileImg");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const profileLink = document.getElementById("profileLink");
  const logoutBtn = document.getElementById("logoutBtn");
  const nav = document.querySelector(".nav");

  const token = localStorage.getItem("token");

  /* ======================
     UI HELPERS
  ====================== */

  function guestUI() {
    loginLink?.classList.remove("d-none");
    registerLink?.classList.remove("d-none");
    profileLink?.classList.add("d-none");
    logoutBtn?.classList.add("d-none");

    if (profileImg) {
      // ✅ FIXED DEFAULT IMAGE
      profileImg.src = "./assets/images/profile.jpg";
      profileImg.classList.add("avatar");
    }
  }

  function userUI(user) {
    loginLink?.classList.add("d-none");
    registerLink?.classList.add("d-none");
    profileLink?.classList.remove("d-none");
    logoutBtn?.classList.remove("d-none");

    if (profileImg) {
      profileImg.src = user.photo
        ? `http://localhost:5000/uploads/${user.photo}`
        : "./assets/images/profile.jpg"; // ✅ fallback fixed

      profileImg.classList.add("avatar");
    }
  }

  function addAdminLinks(user) {
    if (!nav) return;

    if (["admin", "supervisor"].includes(user.role)) {
      const li = document.createElement("li");
      li.className = "nav-item";
      li.innerHTML = `
        <a href="add-blog.html" class="nav-link px-3 link-dark">
          ➕ Add Blog
        </a>`;
      nav.appendChild(li);
    }
  }

  /* ======================
     LOAD USER
  ====================== */

  if (token) {
    try {
      const res = await fetch(`${API}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Invalid token");

      const user = await res.json();
      userUI(user);
      addAdminLinks(user);

    } catch (err) {
      console.warn("Session expired");
      localStorage.clear();
      guestUI();
    }
  } else {
    guestUI();
  }

  /* ======================
     LOAD STATS (PUBLIC)
  ====================== */

  try {
    const res = await fetch(STATS_API);
    const data = await res.json();

    const completedEl = document.getElementById("completedProjects");
    const yearsEl = document.getElementById("yearsExperience");
    const clientsEl = document.getElementById("happyClients");
    const ongoingEl = document.getElementById("ongoingProjects");

    const animateCounter = (el, target, suffix = "") => {
      if (!el) return;

      let count = 0;
      const step = Math.ceil(target / 100);

      const interval = setInterval(() => {
        count += step;

        if (count >= target) {
          el.innerText = target + suffix;
          clearInterval(interval);
        } else {
          el.innerText = count + suffix;
        }
      }, 15);
    };

    animateCounter(completedEl, data.projectsCompleted, "+");
    animateCounter(yearsEl, data.yearsExperience, "+");
    animateCounter(clientsEl, data.happyClients, "+");
    animateCounter(ongoingEl, data.ongoingProjects);

  } catch (err) {
    console.error("Failed to load stats", err);
  }

  /* ======================
     LOGOUT
  ====================== */

  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });
});
