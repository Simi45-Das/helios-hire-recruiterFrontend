// Function to handle recruiter login
async function loginRecruiter(event) {
  event.preventDefault();

  const companyId = document.getElementById("companyId").value;
  const password = document.getElementById("password").value;

  // Validate input fields
  if (!companyId || !password) {
    alert("Please enter your company ID and password.");
    return;
  }

  const loginData = {
    companyId,
    password,
  };

  try {
    const response = await fetch("http://localhost:5001/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Login successful!");

      // Save the JWT token to localStorage
      localStorage.setItem("token", result.token);

      // Redirect to the home page
      window.location.href = "../recruiter_actions/home/index.html";
    } else {
      const errorData = await response.json();
      alert(`Login failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("An error occurred during login. Please try again.");
  }
}

// Attach event listener to the login form
document
  .getElementById("loginForm")
  ?.addEventListener("submit", loginRecruiter);
