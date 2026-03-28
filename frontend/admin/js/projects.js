const form = document.getElementById("projectForm");
const token = localStorage.getItem("token");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const res = await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  if (res.ok) {
    alert("Project added successfully ✅");
    form.reset();
  } else {
    alert("Error adding project ❌");
  }
});
