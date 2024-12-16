document
  .getElementById("testForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Gather form data
    const testName = document.getElementById("testName").value.trim();
    const fullMarks = parseInt(document.getElementById("fullMarks").value);
    const totalMarks = parseInt(document.getElementById("totalMarks").value);
    const passingMarks = parseInt(
      document.getElementById("passingMarks").value
    );
    const timeLimit = parseInt(document.getElementById("timeLimit").value);

    // Placeholder values for recruiterId and companyId
    const recruiterId = "60f6c0c2f1e4f814c8f0b5b6"; // Example ObjectId
    const companyId = "60f6c0c2f1e4f814c8f0b5b7"; // Example ObjectId

    // Gather all questions, marks, and model answers
    const questions = [];
    const questionBlocks = document.querySelectorAll(".questionBlock");

    questionBlocks.forEach((block, index) => {
      const questionText = block
        .querySelector(`textarea[name='questions[]']`)
        .value.trim();
      const questionMarks = parseInt(
        block.querySelector(`input[name='marks[]']`).value
      );
      const modelAnswer = block
        .querySelector(`textarea[name='modelAnswers[]']`)
        .value.trim();

      if (
        questionText &&
        !isNaN(questionMarks) &&
        questionMarks > 0 &&
        modelAnswer
      ) {
        questions.push({
          question: questionText,
          marks: questionMarks,
          modelAnswer: modelAnswer,
        });
      } else {
        alert("Please fill all the required fields for each question.");
        return;
      }
    });

    // Validate that at least one question exists
    if (questions.length === 0) {
      alert("Please add at least one valid question.");
      return;
    }

    // Create the data object to send to the backend
    const testData = {
      testName,
      fullMarks,
      totalMarks,
      passingMarks,
      timeLimit,
      questions,
      recruiterId,
      companyId,
      role: "Descriptive", // Example role
      testExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: 1 week from now
      technology: "N/A", // Adjust as needed
      region: "N/A", // Adjust as needed
    };

    try {
      // Make the fetch request
      const response = await fetch(
        "http://localhost:5001/createDescriptiveTest",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
        }
      );

      // Parse the JSON response
      const result = await response.json();

      if (response.ok) {
        alert("Descriptive Test created successfully!");
        console.log("Response:", result);
        // Optionally, reset the form or redirect the user
        document.getElementById("testForm").reset();
        // Remove additional questions except the first one
        const questionsContainer =
          document.getElementById("questionsContainer");
        while (questionsContainer.children.length > 1) {
          questionsContainer.removeChild(questionsContainer.lastChild);
        }
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error creating test. Please try again.");
    }
  });

// Dynamically add new question blocks
let questionCount = 1; // Initialize question count

document
  .getElementById("addQuestionBtn")
  .addEventListener("click", function () {
    questionCount++;

    const questionsContainer = document.getElementById("questionsContainer");

    const newQuestionBlock = document.createElement("div");
    newQuestionBlock.classList.add("questionBlock");
    newQuestionBlock.id = `questionBlock${questionCount}`;
    newQuestionBlock.innerHTML = `
        <label for="question${questionCount}">Question ${questionCount}:</label>
        <textarea id="question${questionCount}" name="questions[]" rows="4" required></textarea><br>

        <label for="marks${questionCount}">Marks for this question:</label>
        <input type="number" id="marks${questionCount}" name="marks[]" min="1" required /><br>

        <label for="modelAnswer${questionCount}">Model Answer / Notes:</label>
        <textarea id="modelAnswer${questionCount}" name="modelAnswers[]" rows="4" required></textarea><br><br>
    `;

    questionsContainer.appendChild(newQuestionBlock);
  });
