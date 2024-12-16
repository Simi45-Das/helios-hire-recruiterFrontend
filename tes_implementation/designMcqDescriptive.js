document
  .getElementById("testForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Handle array fields like 'questions[]', 'marks[]', etc.
    data.questions = formData.getAll("questions[]");
    data.questionType = formData.getAll("questionType[]");
    data.marks = formData.getAll("marks[]");
    data.modelAnswers = formData.getAll("modelAnswers[]");
    data.options = [];

    // Collect MCQ options dynamically
    for (let i = 1; i <= questionCount; i++) {
      const options = formData.getAll(`options${i}[]`);
      if (options.length > 0) data.options.push(options);
    }

    data.correctAnswers = formData.getAll("correctAnswers[]");

    try {
      const response = await fetch("http://localhost:5001/createTest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`Test created! You can view it at: ${result.url}`);
      } else {
        console.error(result);
        alert("Error creating the test.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
