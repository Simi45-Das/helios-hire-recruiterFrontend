document.addEventListener("DOMContentLoaded", () => {
  const notificationForm = document.querySelector("form");

  notificationForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(notificationForm);

    try {
      // Retrieve the JWT token from local storage or cookies
      const token = localStorage.getItem("token"); // Replace with your token storage method

      if (!token) {
        alert("Authentication token is missing. Please log in.");
        return;
      }

      // Decode the JWT token to get the companyId
      const payloadParts = token.split(".")[1];
      const payload = JSON.parse(atob(payloadParts)); // Decode the base64 payload
      const companyId = payload.companyId;

      if (!companyId) {
        alert("Company ID is missing in the token.");
        return;
      }

      // Add the company ID to the form data
      formData.append("companyId", companyId);

      // Send the POST request
      const response = await fetch(
        "http://localhost:5001/api/v1/notifications/submit-notification",
        {
          method: "POST",
          headers: {
            "Authorization-Type": "recruiter",
            Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Notification created successfully!");
        notificationForm.reset(); // Reset the form
        // Optionally, redirect or update the UI
      } else {
        console.error("Error:", result.message);
        alert(`Error creating notification: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting notification:", error);
      alert("An unexpected error occurred. Please try again.");
    }
  });
});
