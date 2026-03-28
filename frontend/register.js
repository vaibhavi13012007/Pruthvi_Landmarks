async function registerUser(e) {
  e.preventDefault();

  const form = document.getElementById("registerForm");

  const data = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    mobile: form.mobile.value.trim(),
    password: form.password.value,
    confirmPassword: form.confirmPassword.value,
  };

  if (!data.name || !data.email || !data.password || !data.confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (data.password !== data.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Registration failed");
      return;
    }

    alert("Registration successful");
    window.location.href = "login.html";

  } catch (err) {
    alert("Server not reachable");
  }
}
