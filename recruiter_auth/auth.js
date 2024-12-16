// fetchRegistration.js

// Function to handle recruiter registration
async function registerRecruiter(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const company = document.getElementById("company").value;
  const password = document.getElementById("password").value;

  // Check if all fields are filled (extra validation)
  if (!name || !email || !company || !password) {
    alert("Please fill out all the fields.");
    return;
  }

  const registrationData = {
    fullName: name,
    email,
    companyName: company,
    password,
  };

  try {
    const response = await fetch("http://localhost:5001/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Registration successful! Check your email for your company ID.");
      // Optionally redirect after success
      window.location.href = "../verification_files/verification.html";
    } else {
      const errorData = await response.json();
      alert(`Registration failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error during registration:", error);
    alert("An error occurred during registration. Please try again.");
  }
}

// Attach event listener to the registration form
document
  .getElementById("recruiterForm")
  ?.addEventListener("submit", registerRecruiter);
