// Function to add form elements dynamically
function addFormElement() {
  const formPreview = document.getElementById("formPreview");
  const elementType = document.getElementById("elementType").value;
  const elementLabel = document.getElementById("elementLabel").value;
  const formName = document.getElementById("formName").value;

  // Update the form name in the preview
  document.getElementById("previewFormName").innerText = formName;

  let newElement;

  switch (elementType) {
    case "text":
    case "email":
      newElement = document.createElement("div");
      newElement.innerHTML = `
        <label>${elementLabel}</label>
        <input type="${elementType}" placeholder="${elementLabel}">
        <button onclick="removeElement(this)">Remove</button>
      `;
      break;
    case "textarea":
      newElement = document.createElement("div");
      newElement.innerHTML = `
        <label>${elementLabel}</label>
        <textarea placeholder="${elementLabel}"></textarea>
        <button onclick="removeElement(this)">Remove</button>
      `;
      break;
    case "select":
      newElement = document.createElement("div");
      const option1 = document.getElementById("elementoption1").value;
      const option2 = document.getElementById("elementoption2").value;
      const option3 = document.getElementById("elementoption3").value;
      newElement.innerHTML = `
        <label>${elementLabel}</label>
        <select>
          <option value="">Select an option</option>
          <option>${option1}</option>
          <option>${option2}</option>
          <option>${option3}</option>
        </select>
        <button onclick="removeElement(this)">Remove</button>
      `;
      break;
    case "checkbox":
      newElement = document.createElement("div");
      newElement.innerHTML = `
        <label><input type="checkbox"> ${elementLabel}</label>
        <button onclick="removeElement(this)">Remove</button>
      `;
      break;
    case "radio":
      newElement = document.createElement("div");
      const radio1 = document.getElementById("elementoption1").value;
      const radio2 = document.getElementById("elementoption2").value;
      const radio3 = document.getElementById("elementoption3").value;
      newElement.innerHTML = `
        <label>${elementLabel}</label>
        <div>
          <label><input type="radio" name="${elementLabel}" value="${radio1}"> ${radio1}</label>
          <label><input type="radio" name="${elementLabel}" value="${radio2}"> ${radio2}</label>
          <label><input type="radio" name="${elementLabel}" value="${radio3}"> ${radio3}</label>
        </div>
        <button onclick="removeElement(this)">Remove</button>
      `;
      break;
    case "submit":
      newElement = document.createElement("div");
      newElement.innerHTML = `<button type="submit">${elementLabel}</button>`;
      hideRemoveButtons(formPreview); // Hide all remove buttons if a submit button is added
      break;
    default:
      alert("Invalid element type selected.");
      return;
  }

  formPreview.appendChild(newElement);

  // Clear option inputs after adding
  document.getElementById("elementoption1").value = "";
  document.getElementById("elementoption2").value = "";
  document.getElementById("elementoption3").value = "";
}

// Function to hide all remove buttons in the form preview
function hideRemoveButtons(formPreview) {
  const removeButtons = formPreview.querySelectorAll("button");
  removeButtons.forEach((button) => {
    if (button.textContent === "Remove") {
      button.style.display = "none"; // Hide the remove button
    }
  });
}

// Function to remove an element from the form preview
function removeElement(button) {
  button.parentElement.remove();
}

// Function to upload the form to the server
async function uploadForm() {
  const formName = document.getElementById("formName").value.trim(); // Trim to avoid empty spaces
  const formData = document.getElementById("formPreview").innerHTML; // Get the HTML structure of the form

  if (!formName) {
    alert("Please enter a form name before uploading.");
    return;
  }

  // Retrieve the JWT token from localStorage
  const token = localStorage.getItem("authToken");

  if (!token) {
    alert("You need to be logged in to perform this action.");
    window.location.href = "../html_files/login.html"; // Redirect to login page
    return;
  }

  try {
    const response = await fetch("http://localhost:5001/api/forms/saveForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include JWT token in the header
      },
      body: JSON.stringify({ formName, formData }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error uploading form.");
    }

    const result = await response.json();
    console.log(result);
    alert("Form uploaded successfully!");
  } catch (error) {
    console.error("Error uploading form:", error);
    alert(`Error: ${error.message}`);
  }
}

// Attach functions to the respective buttons
document.getElementById("uploadButton").addEventListener("click", uploadForm); // Save form data
