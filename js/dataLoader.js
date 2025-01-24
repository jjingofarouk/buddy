// dataLoader.js

let mcqData = null;

/**
 * Loads MCQ data from the JSON file.
 * @returns {Promise<Object>} The MCQ data.
 */
export async function loadMCQData() {
  if (!mcqData) {
    const response = await fetch("data/mcqs.json");
    mcqData = await response.json();
  }
  return mcqData;
}

/**
 * Gets the list of subjects from the MCQ data.
 * @returns {Array<string>} List of subjects.
 */
export async function getSubjects() {
  const data = await loadMCQData();
  return data.subjects.map((subject) => subject.name);
}

/**
 * Gets the questions for a specific subject.
 * @param {string} subject - The subject name.
 * @returns {Array<Object>} List of questions for the subject.
 */
export async function getQuestionsForSubject(subject) {
  const data = await loadMCQData();
  const subjectData = data.subjects.find((s) => s.name === subject);
  return subjectData ? subjectData.questions : [];
}