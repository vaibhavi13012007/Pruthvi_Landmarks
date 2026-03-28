async function registerUser(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Registration Successful");
    window.location.href = "login.html";
  }
}

async function forgotPassword(e) {
  e.preventDefault();
  alert("Feature coming soon 🚧");
}
