/* =========================
   GLOBAL AUTH
========================= */
const token = localStorage.getItem("token");

if (!token) {
  alert("Please login again");
  window.location.href = "../login.html";
}

/* =========================
   API BASE
========================= */
const API = "http://localhost:5000/api/supervisor/blogs";

/* =========================
   LOAD DASHBOARD
========================= */
document.addEventListener("DOMContentLoaded", () => {
  loadBlogs();
});

/* =========================
   LOAD BLOGS
========================= */
async function loadBlogs() {
  const res = await fetch(API, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const blogs = await res.json();

  document.getElementById("totalBlogs").innerText = blogs.length;

  const tbody = document.getElementById("blogTable");
  tbody.innerHTML = "";

  blogs.forEach(blog => {
    tbody.innerHTML += `
      <tr>
        <td>${blog.title}</td>
        <td>${blog.views || 0}</td>
        <td>${blog.likes?.length || 0}</td>
        <td>${blog.comments?.length || 0}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editBlog('${blog._id}')">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBlog('${blog._id}')">🗑</button>
        </td>
      </tr>
    `;
  });
}

/* =========================
   ADD / EDIT BLOG
========================= */
window.saveBlog = async function () {
  const form = document.getElementById("blogForm");
  const formData = new FormData(form);

  const blogId = document.getElementById("blogId").value;
  const method = blogId ? "PUT" : "POST";
  const url = blogId ? `${API}/${blogId}` : API;

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (res.ok) {
    alert("Blog saved");
    form.reset();
    document.getElementById("blogId").value = "";
    loadBlogs();
  } else {
    alert("Failed to save blog");
  }
};

/* =========================
   EDIT BLOG
========================= */
window.editBlog = async function (id) {
  const res = await fetch(`${API}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const blogs = await res.json();
  const blog = blogs.find(b => b._id === id);

  document.getElementById("blogId").value = blog._id;
  document.getElementById("title").value = blog.title;
  document.getElementById("content").value = blog.content;
  document.getElementById("caption").value = blog.caption || "";
  document.getElementById("map").value = blog.map || "";
};

/* =========================
   DELETE BLOG
========================= */
window.deleteBlog = async function (id) {
  if (!confirm("Delete this blog?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  loadBlogs();
};
