const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const galleryInner = document.getElementById("galleryInner");
const videoContainer = document.getElementById("videoContainer");
const mapFrame = document.getElementById("map");

fetch(`http://localhost:5000/api/projects/${id}`)
  .then(res => res.json())
  .then(project => {

    // BASIC DETAILS
    document.getElementById("projectTitle").innerText = project.title;
    document.getElementById("projectAddress").innerText = project.address || "";

    const statusBadge = document.getElementById("projectStatus");
    statusBadge.innerText = project.status;
    statusBadge.className = `badge bg-${
      project.status === "completed" ? "success" :
      project.status === "ongoing" ? "primary" : "warning"
    }`;

    document.getElementById("projectDescription").innerText =
      project.description || "";

    // PHOTOS
    if (project.photos && project.photos.length) {
      project.photos.forEach((img, i) => {
        galleryInner.innerHTML += `
          <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="http://localhost:5000/uploads/projects/${img}"
                 class="d-block w-100"
                 style="max-height:420px;object-fit:cover;">
          </div>
        `;
      });
    } else {
      galleryInner.innerHTML = `
        <div class="carousel-item active">
          <div class="text-center p-5 bg-secondary text-white">
            No images available
          </div>
        </div>`;
    }

    // VIDEOS
    if (project.videos && project.videos.length) {
      project.videos.forEach(video => {
        if (video.includes("youtube")) {
          videoContainer.innerHTML += `
            <div class="col-md-6">
              <iframe width="100%" height="250"
                src="${video.replace("watch?v=", "embed/")}"
                allowfullscreen></iframe>
            </div>`;
        } else {
          videoContainer.innerHTML += `
            <div class="col-md-6">
              <video controls width="100%">
                <source src="http://localhost:5000/uploads/projects/${video}">
              </video>
            </div>`;
        }
      });
    } else {
      videoContainer.innerHTML = `<p>No videos available</p>`;
    }

    // GOOGLE MAP (ORIGINAL LINK)
    if (project.mapUrl) {
      mapFrame.src = project.mapUrl.replace("/maps/", "/maps/embed/");
    } else {
      mapFrame.style.display = "none";
    }

  })
  .catch(err => {
    console.error(err);
    alert("Failed to load project details");
  });
