document
  .getElementById("companyVerificationForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get form data
    const companyId = document.getElementById("company-id").value.trim(); // Fetch company ID (changed to companyId)
    const companyName = document.getElementById("company-name").value.trim();
    const registrationNumber = document
      .getElementById("registration-number")
      .value.trim();
    const physicalAddress = document
      .getElementById("physical-address")
      .value.trim();
    const contactNumber = document
      .getElementById("contact-number")
      .value.trim();
    const email = document.getElementById("email").value.trim();
    const website = document.getElementById("website").value.trim();

    // Create the request payload
    const companyData = {
      companyId, // Use companyId here
      companyName,
      registrationNumber,
      physicalAddress,
      contactNumber,
      email,
      website,
    };

    try {
      // Make the API call
      const response = await fetch(
        "http://localhost:5001/api/company/submit-company-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(companyData),
        }
      );

      // Handle the response
      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Show success message
        document.getElementById("companyVerificationForm").reset(); // Clear the form
        window.location.href = "../recruiter_auth/login.html";
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.message || "Failed to submit verification."}`
        );
      }
    } catch (error) {
      console.error("Error submitting the company verification:", error);
      alert("An error occurred. Please try again later.");
    }
  });
