document.addEventListener("DOMContentLoaded", async () => {
  const notificationsContainer = document.getElementById("notifications");

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");
  if (!token) {
    notificationsContainer.innerHTML = `<p style="color: red;">Error: Authorization token is missing in localStorage. Please log in again.</p>`;
    return;
  }

  // Decode the token to extract the companyId
  const payload = JSON.parse(atob(token.split(".")[1])); // Decode the payload part of the token
  const companyId = payload?.user?.companyId;
  if (!companyId) {
    notificationsContainer.innerHTML = `<p style="color: red;">Error: Company ID could not be extracted from the token. Please log in again.</p>`;
    return;
  }

  try {
    // Call the API with the token and companyId
    const response = await fetch(
      `http://localhost:5001/api/v1/notifications/get-notification-by-company?type=recruiter&companyId=${companyId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

    const notifications = await response.json();
    notificationsContainer.innerHTML = ""; // Clear loading message

    if (notifications.length > 0) {
      // Display notifications
      notifications.forEach(({ _id, notificationTitle, notificationDate }) => {
        const card = document.createElement("div");
        card.className = "notification-card";
        card.innerHTML = `
                      <div class="notification-title">${notificationTitle}</div>
                      <div class="notification-date">${notificationDate}</div>
                  `;
        card.addEventListener("click", () => {
          localStorage.setItem("notificationId", _id);
          window.location.href = "details.html"; // Redirect to notification details page
        });
        notificationsContainer.appendChild(card);
      });
    } else {
      notificationsContainer.innerHTML = `<p>No notifications found for this company.</p>`;
    }
  } catch (error) {
    notificationsContainer.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
});
