const form = document.getElementById("blogForm");
const token = localStorage.getItem("token");

if (!token) {
  alert("Login required ❌");
  window.location.href = "login.html";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("title", title.value);
  formData.append("category", category.value);
  formData.append("caption", caption.value);

  if (image.files[0]) formData.append("image", image.files[0]);
  if (videoFile.files[0]) formData.append("video", videoFile.files[0]);
  if (song.files[0]) formData.append("song", song.files[0]);

  const res = await fetch("http://localhost:5000/api/blogs", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });

  if (res.ok) {
    alert("✅ Blog published");
    window.location.href = "blogs.html";
  } else {
    alert("❌ Failed to publish");
  }
});
