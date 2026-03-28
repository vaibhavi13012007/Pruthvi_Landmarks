const API = "http://localhost:5000/api/blogs";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const blogsGrid = document.getElementById("blogsGrid");

/* ===== HELPERS ===== */
function authHeaders() {
  return {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  };
}

/* ===== LOAD BLOGS ===== */
document.addEventListener("DOMContentLoaded", fetchBlogs);

async function fetchBlogs() {
  const res = await fetch(API);
  const blogs = await res.json();
  blogsGrid.innerHTML = blogs.map(renderBlog).join("");
}

/* ===== RENDER ===== */
function renderBlog(blog) {
  return `
  <article class="card">

    ${
      blog.image
        ? `<img src="http://localhost:5000/uploads/blogs/${blog.image}" class="img-fluid">`
        : ""
    }

    ${
      blog.video
        ? `
        <video controls class="w-100 mt-2">
          <source src="http://localhost:5000/uploads/blogs/${blog.video}">
          Your browser does not support video.
        </video>`
        : ""
    }

    ${
      blog.song
        ? `
        <audio controls class="w-100 mt-2">
          <source src="http://localhost:5000/uploads/blogs/${blog.song}">
          Your browser does not support audio.
        </audio>`
        : ""
    }

    <div class="card-content mt-2">
      <span class="badge-custom">${blog.category || "General"}</span>
      <h3>${blog.title}</h3>
      <p>${blog.caption || ""}</p>

      <div class="d-flex gap-3 my-2">
        <button onclick="likeBlog('${blog._id}')">
          ❤️ ${blog.likes?.length || 0}
        </button>

        <button onclick="dislikeBlog('${blog._id}')">
          👎 ${blog.dislikes?.length || 0}
        </button>
      </div>

      <input
        class="form-control"
        placeholder="Add a comment..."
        onkeydown="if(event.key==='Enter') commentBlog('${blog._id}', this.value)"
      />

      <div class="mt-2">
        ${(blog.comments || []).map(c => `
          <div class="border-top pt-1 small">💬 ${c.text}</div>
        `).join("")}
      </div>

      ${
        ["admin", "supervisor"].includes(user?.role)
          ? `<button class="btn btn-danger btn-sm mt-2"
               onclick="deleteBlog('${blog._id}')">🗑 Delete</button>`
          : ""
      }

    </div>
  </article>`;
}

/* ===== ACTIONS ===== */

async function likeBlog(id) {
  if (!token) return alert("Login required");
  await fetch(`${API}/${id}/like`, {
    method: "POST",
    headers: authHeaders()
  });
  fetchBlogs();
}

async function dislikeBlog(id) {
  if (!token) return alert("Login required");
  await fetch(`${API}/${id}/dislike`, {
    method: "POST",
    headers: authHeaders()
  });
  fetchBlogs();
}

async function commentBlog(id, text) {
  if (!token) return alert("Login required");
  if (!text.trim()) return;

  await fetch(`${API}/${id}/comment`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ text })
  });

  fetchBlogs();
}

async function deleteBlog(id) {
  if (!token) return alert("Login required");
  if (!confirm("Delete this blog?")) return;

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  });

  if (!res.ok) {
    const err = await res.json();
    return alert(err.message || "Delete failed");
  }

  fetchBlogs();
}