document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("photos");
  const chooseButton = document.getElementById("choose-button");
  const photoPreviewContainer = document.getElementById("photo-preview");
  const uploadButton = document.getElementById("upload-button");

  let allFiles = []; // Store all selected files

  const updatePhotoPreview = () => {
    photoPreviewContainer.innerHTML = ""; // Clear previous previews
    allFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target.result;
        img.alt = file.name;
        img.classList.add(
          "w-32",
          "h-32",
          "object-cover",
          "rounded-lg",
          "border",
          "shadow",
          "m-2"
        );

        const wrapper = document.createElement("div");
        wrapper.classList.add("relative", "inline-block");

        const removeButton = document.createElement("button");
        removeButton.innerHTML = "×";
        removeButton.classList.add(
          "absolute",
          "top-1",
          "right-1",
          "bg-red-500",
          "text-white",
          "rounded-full",
          "w-6",
          "h-6",
          "flex",
          "items-center",
          "justify-center",
          "cursor-pointer"
        );
        removeButton.addEventListener("click", () => removeFile(index));

        wrapper.appendChild(img);
        wrapper.appendChild(removeButton);
        photoPreviewContainer.appendChild(wrapper);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    allFiles.splice(index, 1); // Remove file
    updatePhotoPreview(); // Update preview
  };

  chooseButton.addEventListener("click", () => {
    fileInput.click(); // Trigger file input
  });

  fileInput.addEventListener("change", () => {
    const newFiles = Array.from(fileInput.files);
    allFiles = [...allFiles, ...newFiles]; // Append new files
    updatePhotoPreview(); // Update preview
    fileInput.value = ""; // Clear input for new selection
  });

  uploadButton.addEventListener("click", async () => {
    if (allFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    const formData = new FormData();
    allFiles.forEach((file) => formData.append("photos", file));

    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/upload/uploadImages",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Authorization-Type": "recruiter",
          },
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert("Photos uploaded successfully!");
        allFiles = [];
        updatePhotoPreview();
      } else {
        alert(`Failed to upload photos: ${result.message}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading photos.");
    }
  });
});
