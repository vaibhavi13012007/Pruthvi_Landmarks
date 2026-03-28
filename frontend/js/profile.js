document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  /* ELEMENTS */
  const profileForm = document.getElementById("profileForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const roleInput = document.getElementById("role");
  const photoInput = document.getElementById("photo");
  const avatar = document.getElementById("avatar");
  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const themeToggle = document.getElementById("themeToggle");

  /* ---------------- DARK MODE ---------------- */
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerText = "☀️ Light Mode";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
  });

  /* ---------------- VIEW / EDIT MODES ---------------- */
  function setViewMode() {
    nameInput.disabled = true;
    nameInput.classList.remove("border-warning");

    photoInput.classList.add("d-none");
    saveBtn.classList.add("d-none");
    editBtn.classList.remove("d-none");
  }

  function setEditMode() {
    nameInput.disabled = false;
    nameInput.focus();
    nameInput.classList.add("border-warning");

    photoInput.classList.remove("d-none");
    saveBtn.classList.remove("d-none");
    editBtn.classList.add("d-none");
  }

  editBtn.addEventListener("click", setEditMode);

  avatar.addEventListener("click", () => {
    if (!nameInput.disabled) {
      photoInput.click();
    }
  });

  /* ---------------- LOAD PROFILE ---------------- */
  fetch("http://localhost:5000/api/profile", {
    headers: { Authorization: "Bearer " + token }
  })
    .then(res => {
      if (!res.ok) throw new Error("Unauthorized");
      return res.json();
    })
    .then(user => {
      profileForm.classList.remove("d-none");

      nameInput.value = user.name || "";
      emailInput.value = user.email || "";
      roleInput.value = user.role || "";

      if (user.photo) {
        avatar.src = `http://localhost:5000/uploads/${user.photo}`;
      }

      editBtn.disabled = false;
      setViewMode();
    })
    .catch(() => logout());

  /* ---------------- SAVE PROFILE ---------------- */
  saveBtn.addEventListener("click", () => {
    const formData = new FormData();
    formData.append("name", nameInput.value);

    if (photoInput.files[0]) {
      formData.append("photo", photoInput.files[0]);
    }

    fetch("http://localhost:5000/api/profile", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    })
      .then(res => res.json())
      .then(user => {
        if (user.photo) {
          avatar.src = `http://localhost:5000/uploads/${user.photo}`;
        }

        localStorage.setItem("user", JSON.stringify(user));
        setViewMode();
        alert("Profile updated successfully ✅");
      });
  });

});

/* ---------------- LOGOUT (GLOBAL) ---------------- */
window.logout = function () {
  localStorage.clear();
  window.location.href = "login.html";
};
