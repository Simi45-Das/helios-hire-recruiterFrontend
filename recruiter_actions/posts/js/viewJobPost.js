document.addEventListener("DOMContentLoaded", async function () {
  try {
    // Retrieve and decode the JWT token
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // Decode the JWT to extract companyId
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decodedToken = JSON.parse(jsonPayload);

    const companyId = decodedToken.companyId;
    if (!companyId) {
      alert("No company ID found in the token.");
      return;
    }

    // Fetch the job posts using the GET method with companyId in the query string
    const response = await fetch(
      `http://localhost:5001/api/v1/job-posts/get-job-posts-by-company-id?companyId=${companyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Authorization-Type": "recruiter",
        },
      }
    );

    if (response.ok) {
      const jobPosts = await response.json();

      if (jobPosts.length === 0) {
        alert("No job posts found for this company.");
        return;
      }

      // Display the job posts
      const jobPostsContainer = document.getElementById("jobPostsContainer");
      jobPostsContainer.innerHTML = ""; // Clear existing posts

      jobPosts.forEach((jobPost) => {
        const jobPostElement = document.createElement("div");
        jobPostElement.classList.add("job-post");

        jobPostElement.innerHTML = `
          <h3>${jobPost.title}</h3>
          <p><strong>Company:</strong> ${jobPost.company}</p>
          <p><strong>Location:</strong> ${jobPost.location}</p>
          <p><strong>Employment Type:</strong> ${jobPost.employmentType}</p>
          <p><strong>Experience Level:</strong> ${jobPost.experienceLevel}</p>
          <p><strong>Application Deadline:</strong> ${new Date(
            jobPost.applicationDeadline
          ).toLocaleDateString()}</p>
          <p class="salary"><strong>Salary:</strong> $${
            jobPost.salary.min
          } - $${jobPost.salary.max}</p>
          <p><strong>Remote:</strong> ${jobPost.remote ? "Yes" : "No"}</p>
          <p><strong>Description:</strong> ${jobPost.description}</p>
        `;

        jobPostsContainer.appendChild(jobPostElement);
      });
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the job posts.");
  }
});
