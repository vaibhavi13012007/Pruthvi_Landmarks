document.addEventListener("DOMContentLoaded", async () => {
  /*********************************
   * CONFIG
   *********************************/
  const BASE_URL = "http://localhost:5000";
  const AUTH_API = `${BASE_URL}/api/auth`;
  const CONTACT_API = `${BASE_URL}/api/contact`;

  const DEFAULT_PROFILE_IMG = "./assets/images/profile.jpg";

  /*********************************
   * NAVBAR AUTH + PROFILE IMAGE
   *********************************/
  const profileImg = document.getElementById("navbarProfileImg");
  const loginLink = document.getElementById("loginLink");
  const registerLink = document.getElementById("registerLink");
  const profileLink = document.getElementById("profileLink");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = localStorage.getItem("token");

  function guestUI() {
    loginLink?.classList.remove("d-none");
    registerLink?.classList.remove("d-none");
    profileLink?.classList.add("d-none");
    logoutBtn?.classList.add("d-none");

    if (profileImg) {
      profileImg.src = DEFAULT_PROFILE_IMG;
    }
  }

  function userUI(user) {
    loginLink?.classList.add("d-none");
    registerLink?.classList.add("d-none");
    profileLink?.classList.remove("d-none");
    logoutBtn?.classList.remove("d-none");

    if (profileImg) {
      profileImg.src = user.photo
        ? `${BASE_URL}/uploads/${user.photo}`
        : DEFAULT_PROFILE_IMG;

      // ✅ If uploaded image fails, fallback automatically
      profileImg.onerror = () => {
        profileImg.src = DEFAULT_PROFILE_IMG;
      };
    }

    localStorage.setItem("userRole", user.role);
  }

  if (token) {
    try {
      const res = await fetch(`${AUTH_API}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Invalid token");

      const user = await res.json();
      userUI(user);

    } catch (err) {
      console.warn("Session expired");
      localStorage.clear();
      guestUI();
    }
  } else {
    guestUI();
  }

  logoutBtn?.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
  });


  /*********************************
   * CONTACT FORM LOGIC
   *********************************/
  const form = document.getElementById("contactForm");
  const successBox = document.getElementById("successBox");
  const aiResult = document.getElementById("aiResult");

  if (!form) return; // stop if page has no contact form

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ratingEl = document.querySelector("input[name='rating']:checked");

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      rating: ratingEl ? ratingEl.value : "No Rating",
      message: form.message.value.trim()
    };

    // ✅ Basic validation
    if (!data.name || !data.email || !data.subject || !data.message) {
      alert("Please fill in all required fields.");
      return;
    }

    /*********************************
     * SIMPLE AI SENTIMENT LOGIC
     *********************************/
    let sentiment = "Neutral 😐";
    const msg = data.message.toLowerCase();

    if (
      msg.includes("good") ||
      msg.includes("great") ||
      msg.includes("excellent") ||
      msg.includes("amazing")
    ) {
      sentiment = "Positive 😊";
    } else if (
      msg.includes("bad") ||
      msg.includes("poor") ||
      msg.includes("terrible") ||
      msg.includes("worst")
    ) {
      sentiment = "Needs Improvement ⚠️";
    }

    try {
      const res = await fetch(CONTACT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Server error");

      form.reset();

      if (successBox) successBox.classList.remove("d-none");
      if (aiResult) aiResult.textContent = "AI Insight: " + sentiment;

    } catch (err) {
      console.error(err);
      alert("❌ Unable to send message. Please try again.");
    }
  });
});
