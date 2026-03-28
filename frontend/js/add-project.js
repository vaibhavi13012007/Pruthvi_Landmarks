document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("projectForm");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("Not authenticated");
      return;
    }

    const fd = new FormData(form);

    // ✅ Force status properly
    const statusField = document.querySelector('[name="status"]');
    const status = statusField
      ? statusField.value.toString().trim().toLowerCase()
      : "ongoing";

    fd.set("status", status);

    // ✅ Videos: comma-separated → array
    const videosInput = document.getElementById("videos")?.value || "";
    const videos = videosInput
      ? videosInput.split(",").map(v => v.trim()).filter(Boolean)
      : [];

    fd.set("videos", JSON.stringify(videos));

    console.log("Submitting Project Status:", status);

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: fd,
      });

      const data = await res.json();
      console.log("Project Save Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Failed to add project");
      }

      alert("Project added successfully ✅");
      window.location.href = "project.html";
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
});