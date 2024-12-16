// Function to get the JWT from localStorage or cookies
function getJwtToken() {
  return localStorage.getItem("jwtToken"); // Or from cookies: document.cookie
}

// Function to get companyId from JWT or storage
function getCompanyIdFromJwt() {
  const jwtToken = getJwtToken();
  if (!jwtToken) return null;

  // Decode the JWT (base64 encoded string)
  const base64Url = jwtToken.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const decodedPayload = JSON.parse(window.atob(base64));

  return decodedPayload.companyId || null; // Return companyId from JWT payload
}

// Function to add JWT and companyId to request headers
function addJwtAndCompanyIdToHeaders(headers = {}) {
  const jwtToken = getJwtToken();
  const companyId = getCompanyIdFromJwt();

  if (jwtToken) {
    headers["Authorization"] = `Bearer ${jwtToken}`;
  }

  if (companyId) {
    headers["companyId"] = companyId;
  }

  return headers;
}

// Function to make API requests with JWT and companyId in headers
function makeApiRequest(url, method = "GET", data = null) {
  const headers = addJwtAndCompanyIdToHeaders({
    "Content-Type": "application/json",
  });

  const options = {
    method: method,
    headers: headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  return fetch(url, options)
    .then((response) => response.json())
    .then((responseData) => responseData)
    .catch((error) => console.error("Error:", error));
}

// Example: You can use this function to make API calls globally
// Automatically attach JWT and companyId
// Example API request with the JWT and companyId in the headers
// makeApiRequest("https://your-api-endpoint.com/data", "GET").then((data) =>
//   console.log("Data:", data)
// );

document.addEventListener("DOMContentLoaded", () => {
  const createNotificationCard = document.getElementById(
    "createNotificationCard"
  );
  const viewNotificationsCard = document.getElementById(
    "viewNotificationsCard"
  );
  const createNotificationLink = document.getElementById(
    "createNotificationLink"
  );
  const viewNotificationsLink = document.getElementById(
    "viewNotificationsLink"
  );

  // Redirect to Create Notification screen
  const redirectToCreateNotification = () => {
    window.location.href = "../notifications/html/createNotifications.html"; // Replace with actual URL
  };

  // Redirect to View Notifications screen
  const redirectToViewNotifications = () => {
    window.location.href = "../notifications/html/index.html"; // Replace with actual URL
  };

  // Add event listeners for cards and sidebar links
  createNotificationCard.addEventListener(
    "click",
    redirectToCreateNotification
  );
  viewNotificationsCard.addEventListener("click", redirectToViewNotifications);
  createNotificationLink.addEventListener(
    "click",
    redirectToCreateNotification
  );
  viewNotificationsLink.addEventListener("click", redirectToViewNotifications);
});
