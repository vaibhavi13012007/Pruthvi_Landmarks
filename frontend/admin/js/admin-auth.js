const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../login.html";
}

async function checkAdmin() {
  try {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    // FIX: check role, not isAdmin
    if (!user.role || user.role !== "admin") {
      alert("Access denied ❌");
      window.location.href = "../index.html";
      return;
    }

    // Optionally save user in localStorage if needed
    localStorage.setItem("user", JSON.stringify(user));

  } catch (err) {
    console.error(err);
    window.location.href = "../login.html";
  }
}

checkAdmin();
