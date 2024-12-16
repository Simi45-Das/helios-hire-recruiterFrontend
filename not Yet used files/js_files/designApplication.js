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
      newElement.innerHTML = `<label>${elementLabel}</label><input type="${elementType}" placeholder="${elementLabel}"> <button onclick="removeElement(this)">Remove</button>`;
      break;
    case "textarea":
      newElement = document.createElement("div");
      newElement.innerHTML = `<label>${elementLabel}</label><textarea placeholder="${elementLabel}"></textarea> <button onclick="removeElement(this)">Remove</button>`;
      break;
    case "select":
      newElement = document.createElement("div");
      newElement.innerHTML = `<label>${elementLabel}</label><select><option value="">Select an option</option><option>${
        document.getElementById("elementoption1").value
      }</option><option>${
        document.getElementById("elementoption2").value
      }</option><option>${
        document.getElementById("elementoption3").value
      }</option></select> <button onclick="removeElement(this)">Remove</button>`;
      break;
    case "checkbox":
      newElement = document.createElement("div");
      newElement.innerHTML = `<label><input type="checkbox"> ${elementLabel}</label> <button onclick="removeElement(this)">Remove</button>`;
      break;
    case "radio":
      newElement = document.createElement("div");
      newElement.innerHTML = `<label>${elementLabel}</label><div><label><input type="radio" name="${elementLabel}" value="${
        document.getElementById("elementoption1").value
      }"> ${
        document.getElementById("elementoption1").value
      }</label><label><input type="radio" name="${elementLabel}" value="${
        document.getElementById("elementoption2").value
      }"> ${
        document.getElementById("elementoption2").value
      }</label><label><input type="radio" name="${elementLabel}" value="${
        document.getElementById("elementoption3").value
      }"> ${
        document.getElementById("elementoption3").value
      }</label></div> <button onclick="removeElement(this)">Remove</button>`;
      break;
    case "submit":
      newElement = document.createElement("div");
      newElement.innerHTML = `<button type="submit">${elementLabel}</button>`;
      // Hide all remove buttons if a submit button is added
      hideRemoveButtons(formPreview);
      break;
    default:
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
  const formName = document.getElementById("formName").value; // Get the form name dynamically
  const formData = document.getElementById("formPreview").innerHTML; // Get the HTML structure of the form

  try {
    const response = await fetch("http://localhost:5001/api/forms/saveForm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formName, formData }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(result);
      alert("Form uploaded successfully!");
    } else {
      console.error(result);
      alert("Error uploading form. Please try again.");
    }
  } catch (error) {
    console.error("Fetch error: ", error);
    alert("Network error. Please check your server and try again.");
  }
}

// Attach the upload function to the button click
document.getElementById("uploadButton").addEventListener("click", uploadForm);
