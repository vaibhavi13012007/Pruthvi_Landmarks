axios.post("http://localhost:5000/api/auth/login", data)
.then(res => {
  localStorage.setItem("token", res.data.token);

  if (res.data.role === "admin") {
    axios.get("http://localhost:5000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${res.data.token}`
      }
    });

    navigate("/admin-dashboard");
  }
});
