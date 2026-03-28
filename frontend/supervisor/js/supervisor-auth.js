const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user || !["admin","supervisor"].includes(user.role)) {
  alert("Access denied ❌");
  window.location.href = "../login.html";
}
