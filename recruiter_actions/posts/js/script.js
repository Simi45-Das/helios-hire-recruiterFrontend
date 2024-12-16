document
  .getElementById("jobPostForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = {
      title: document.getElementById("title").value,
      company: document.getElementById("company").value,
      location: document.getElementById("location").value,
      employmentType: document.getElementById("employmentType").value,
      remote: document.getElementById("remote").value === "true",
      description: document.getElementById("description").value,
      responsibilities: document
        .getElementById("responsibilities")
        .value.split(","),
      requirements: document.getElementById("requirements").value.split(","),
      preferredSkills: document
        .getElementById("preferredSkills")
        .value.split(","),
      salary: {
        min: Number(document.getElementById("minSalary").value) || null,
        max: Number(document.getElementById("maxSalary").value) || null,
      },
      benefits: document.getElementById("benefits").value.split(","),
      experienceLevel: document.getElementById("experienceLevel").value,
      applicationDeadline: document.getElementById("applicationDeadline").value,
    };

    try {
      const response = await fetch(
        "http://localhost:5001/api/v1/job-posts/create-job-post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Authorization-Type": "recruiter",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Job post created successfully!");
        document.getElementById("jobPostForm").reset();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  });
