document.addEventListener("DOMContentLoaded", async () => {
  const notificationDetailsContainer = document.getElementById(
    "notification-details"
  );

  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // Display an error if the token is missing
      notificationDetailsContainer.innerHTML = `
        <p style="color: red;">Error: Token is missing in localStorage.</p>
      `;
      return;
    }

    // Decode the token to get user data (companyId)
    const payload = JSON.parse(atob(token.split(".")[1])); // Assuming the token is in the format of JWT
    const companyId = payload.companyId;

    if (!companyId) {
      // Display an error message if companyId is not found in the token payload
      notificationDetailsContainer.innerHTML = `
        <p style="color: red;">Error: Company ID is required.</p>
      `;
      return;
    }

    // Fetch notifications for the company associated with the token
    const response = await fetch(
      `http://localhost:5001/api/v1/notifications/get-notification-by-company-id?companyId=${companyId}`,
      {
        method: "GET",
        headers: {
          "Authorization-Type": "recruiter", // Pass the custom Authorization-Type header
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      }
    );

    if (!response.ok) {
      // Handle non-OK responses
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    const notifications = await response.json();

    if (!notifications || notifications.length === 0) {
      // Display a message if no notifications are found
      notificationDetailsContainer.innerHTML = `
        <p style="color: blue;">No notifications found.</p>
      `;
      return;
    }

    // Render notifications (loop to display all or display latest)
    const notificationHTML = notifications
      .map((notification) => {
        const {
          notificationTitle,
          notificationText,
          notificationDate,
          notificationTime,
        } = notification;

        return `
          <div class="notification-item">
            <div class="notification-title"><strong>${notificationTitle}</strong></div>
            <div class="notification-date">${notificationDate} at ${notificationTime}</div>
            <div class="notification-body">${notificationText}</div>
          </div>
          <hr />
        `;
      })
      .join(""); // Combine all notifications into a single string

    notificationDetailsContainer.innerHTML = notificationHTML;
  } catch (error) {
    // Display error message
    notificationDetailsContainer.innerHTML = `
      <p style="color: red;">Error: ${error.message}</p>
    `;
  }
});
