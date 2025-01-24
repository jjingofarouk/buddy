export class Analytics {
  constructor(userId) {
    this.userId = userId;
    this.data = {
      totalQuestions: 0,
      correctAnswers: 0,
      weakAreas: [],
      history: []
    };
  }

  recordAnswer(questionId, isCorrect) {
    this.data.totalQuestions++;
    if (isCorrect) this.data.correctAnswers++;

    this.updateWeakAreas(questionId, isCorrect);
    this.saveToLocalStorage();
  }

  updateWeakAreas(questionId, isCorrect) {
    if (!isCorrect) {
      const weakArea = this.data.weakAreas.find(area => area.id === questionId);
      if (weakArea) {
        weakArea.count++;
      } else {
        this.data.weakAreas.push({ id: questionId, count: 1 });
      }
    }
  }

  saveToLocalStorage() {
    localStorage.setItem(`analytics-${this.userId}`, JSON.stringify(this.data));
  }

  loadFromLocalStorage() {
    const savedData = localStorage.getItem(`analytics-${this.userId}`);
    if (savedData) {
      this.data = JSON.parse(savedData);
    }
  }
}
