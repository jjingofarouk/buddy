document.addEventListener("DOMContentLoaded", () => {
  const subjectSelect = document.getElementById("subject-select");
  const mcqContainer = document.getElementById("mcqs");
  const subjectTitle = document.getElementById("subject-title");
  const themeToggle = document.getElementById("theme-toggle");

  let mcqData = null; // Cache MCQ data to avoid repeated fetches
  let currentThemeIndex = 0;
  const themes = ["dark", "theme-1", "theme-2", "theme-3", "theme-4", "theme-5"];

  // Load MCQ data
  async function loadMCQData() {
    try {
      const response = await fetch("data/mcqs.json");
      if (!response.ok) throw new Error("Failed to load MCQ data");
      mcqData = await response.json();
      populateSubjects(mcqData.subjects);
    } catch (error) {
      console.error("Error loading MCQ data:", error);
      mcqContainer.innerHTML = "<p>Failed to load questions. Please try again later.</p>";
    }
  }

  // Populate subjects dropdown
  function populateSubjects(subjects) {
    subjects.forEach((subject) => {
      const option = document.createElement("option");
      option.value = subject.name;
      option.textContent = subject.name;
      subjectSelect.appendChild(option);
    });
  }

  // Load MCQs for selected subject
  async function loadMCQs(subject) {
    if (!mcqData) return;

    mcqContainer.innerHTML = "<p>Loading questions...</p>"; // Loading state
    const subjectData = mcqData.subjects.find((s) => s.name === subject);

    if (subjectData) {
      subjectTitle.textContent = subject;
      renderMCQs(subjectData.questions);
    } else {
      mcqContainer.innerHTML = "<p>No questions found for this subject.</p>";
    }
  }

  // Render MCQs
  function renderMCQs(questions) {
    mcqContainer.innerHTML = ""; // Clear previous content
    questions.forEach((q, index) => {
      const mcq = document.createElement("div");
      mcq.classList.add("mcq");
      mcq.innerHTML = `
        <p>${index + 1}. ${q.question}</p>
        $${q.options
          .map(
            (option) =>
              `<button class="option" aria-label="Select $${option}">${option}</button>`
          )
          .join("")}
      `;
      mcqContainer.appendChild(mcq);
    });

    // Add event listeners to options
    const optionButtons = document.querySelectorAll(".option");
    optionButtons.forEach((button) => {
      button.addEventListener("click", () => handleOptionClick(button, q.answer));
    });
  }

  // Handle option selection
  function handleOptionClick(button, correctAnswer) {
    const selectedOption = button.textContent;
    const isCorrect = selectedOption === correctAnswer;

    // Provide feedback
    button.classList.add(isCorrect ? "correct" : "incorrect");
    button.setAttribute("aria-live", "polite");
    button.setAttribute("aria-label", `${selectedOption} - ${isCorrect ? "Correct" : "Incorrect"}`);
  }

  // Toggle theme
  function toggleTheme() {
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);

    // Save theme preference
    localStorage.setItem("theme", themes[currentThemeIndex]);
  }

  // Load saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.add(savedTheme);
    currentThemeIndex = themes.indexOf(savedTheme);
  }

  // Event listeners
  subjectSelect.addEventListener("change", (e) => {
    const selectedSubject = e.target.value;
    loadMCQs(selectedSubject);
  });

  themeToggle.addEventListener("click", toggleTheme);

  // Initial load
  loadMCQData();
});