document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* 🔐 AUTH CHECK */
  if (!token || !user) {
    window.location.href = "/frontend/login.html";
    return;
  }

  /* 👑 ADMIN CHECK (THIS FIXES YOUR ISSUE) */
  if (user.role !== "admin") {
    document.body.innerHTML = `
      <div style="padding:40px; text-align:center; font-size:20px; color:red;">
        Access denied ❌ <br><br>
        Admins only
      </div>
    `;
    return;
  }

  /* 📊 LOAD DASHBOARD STATS */
  loadStats(token);
});

async function loadStats(token) {
  try {
    const res = await fetch("http://localhost:5000/api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();

    document.getElementById("totalProjects").innerText =
      data.totalProjects ?? 0;

    document.getElementById("ongoingProjects").innerText =
      data.ongoingProjects ?? 0;

  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <div style="padding:40px; text-align:center; font-size:20px; color:red;">
        Failed to load admin data ❌
      </div>
    `;
  }
}
