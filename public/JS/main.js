console.log("main.js loaded");

// ---- LOGIN PAGE ----
const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (loginError) loginError.textContent = "";

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      if (loginError) {
        loginError.textContent = "Please enter both email and password.";
      }
      return;
    }

    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await resp.json();
      console.log("Login response:", data);

      if (!data.success) {
        if (loginError) {
          loginError.textContent = data.message || "Login failed.";
        }
        return;
      }

      // Save user in localStorage
      localStorage.setItem("gradeflexUser", JSON.stringify(data.user));

      // Redirect to dashboard
      window.location.href = "home.html";
    } catch (err) {
      console.error("Login error:", err);
      if (loginError) {
        loginError.textContent = "Network or server error.";
      }
    }
  });
}

// ---- HOME PAGE ----
const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");

if (welcomeTitle && welcomeSubtitle) {
  const userStr = localStorage.getItem("gradeflexUser");
  if (!userStr) {
    window.location.href = "login.html";
  } else {
    const user = JSON.parse(userStr);
    welcomeTitle.textContent = `Welcome, ${user.name}!`;

    if (user.role === "teacher") {
      welcomeSubtitle.textContent =
        "You can create tests, manage your classes and view detailed reports.";
    } else if (user.role === "student") {
      welcomeSubtitle.textContent =
        "You can see available tests and review your results over time.";
    } else {
      welcomeSubtitle.textContent =
        "Here you can work with online tests and performance reports.";
    }
  }

  const logoutLink = document.getElementById("logoutLink");

  if (logoutLink) {
    logoutLink.addEventListener("click", () => {
        console.log("Logging out...");
        localStorage.removeItem("gradeflexUser");
        window.location.href = "login.html";
    });
  }

  const goToTests = document.getElementById("goToTests");
  const goToReports = document.getElementById("goToReports");

  if (goToTests) {
    goToTests.addEventListener("click", () => {
      alert("This is where we will implement the Tests module.");
    });
  }

  if (goToReports) {
    goToReports.addEventListener("click", () => {
      alert("This is where we will implement the Reports & Analytics module.");
    });
  }
}