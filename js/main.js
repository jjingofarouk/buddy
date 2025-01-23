document.addEventListener("DOMContentLoaded", () => {
  const subjectSelect = document.getElementById("subject-select");
  const mcqContainer = document.getElementById("mcqs");
  const subjectTitle = document.getElementById("subject-title");

  // Load data from JSON
  fetch("data/mcqs.json")
    .then((response) => response.json())
    .then((data) => {
      populateSubjects(data.subjects);
    });

  // Populate subjects
  function populateSubjects(subjects) {
    subjects.forEach((subject) => {
      const option = document.createElement("option");
      option.value = subject.name;
      option.textContent = subject.name;
      subjectSelect.appendChild(option);
    });
  }

  // On subject selection
  subjectSelect.addEventListener("change", (e) => {
    const selectedSubject = e.target.value;
    loadMCQs(selectedSubject);
  });

  // Load MCQs
  function loadMCQs(subject) {
    fetch("data/mcqs.json")
      .then((response) => response.json())
      .then((data) => {
        const subjectData = data.subjects.find((s) => s.name === subject);
        subjectTitle.textContent = subject;
        renderMCQs(subjectData.questions);
      });
  }

  // Render MCQs
  function renderMCQs(questions) {
    mcqContainer.innerHTML = "";
    questions.forEach((q, index) => {
      const mcq = document.createElement("div");
      mcq.classList.add("mcq");
      mcq.innerHTML = `
        <p>${index + 1}. ${q.question}</p>
        ${q.options
          .map(
            (option) =>
              `<button class="option">${option}</button>`
          )
          .join("")}
      `;
      mcqContainer.appendChild(mcq);
    });
  }

  // Toggle theme
  const themeToggle = document.getElementById("theme-toggle");
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });
});
