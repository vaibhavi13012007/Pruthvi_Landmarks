const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || user?.role !== "supervisor") {
  alert("Access denied ❌");
  window.location.href = "../login.html";
}

fetch("http://localhost:5000/api/blogs")
  .then(res => res.json())
  .then(data => {
    document.getElementById("totalBlogs").innerText = data.length;
    document.getElementById("totalComments").innerText =
      data.reduce((sum, b) => sum + b.comments.length, 0);
  });
