// profile_view.js

document.addEventListener("DOMContentLoaded", () => {
  // Function to get query parameters from the URL
  function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  // Fetch the 'name' parameter from the URL
  const userName = getQueryParameter("name");

  // Select the <h1> element where the name will be inserted
  const nameHeading = document.querySelector("h1.text-4xl.font-extrabold.text-gray-900");

  // Check if name exists in the URL and update the <h1> element
  if (userName) {
    nameHeading.textContent = userName;
  } else {
    // Default name if 'name' parameter is not present
    nameHeading.textContent = "Guest User";
  }
});
