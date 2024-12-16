document
  .getElementById("testForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent the default form submission

    const formData = new FormData(this);
    const data = {};

    // Construct the data object
    formData.forEach((value, key) => {
      if (key.includes("[]")) {
        const baseKey = key.replace("[]", "");
        if (!data[baseKey]) data[baseKey] = [];
        data[baseKey].push(value);
      } else {
        data[key] = value;
      }
    });

    try {
      const response = await fetch("http://localhost:5001/createTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if the response is not ok
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error message
        throw new Error(errorData.error || "An unknown error occurred");
      }

      const result = await response.json(); // Get the successful result
      alert(`Test created successfully! View it here: ${result.driveUrl}`);
    } catch (error) {
      console.error("Error submitting form", error);
      alert(`Failed to create test: ${error.message}`);
    }
  });
