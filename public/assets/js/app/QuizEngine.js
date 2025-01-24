export class QuizEngine {
  constructor(config) {
    this.questions = [];
    this.currentQuestion = 0;
    this.timer = null;
    this.config = {
      shuffle: true,
      mode: 'timed',
      ...config
    };
    this.init();
  }

  async init() {
    await this.loadQuestions();
    this.setupEventListeners();
    this.renderQuestion();
  }

  async loadQuestions() {
    try {
      const response = await fetch('/src/data/questions.json');
      const data = await response.json();
      this.questions = this.processQuestions(data.questions);
    } catch (error) {
      this.handleError(error);
    }
  }

  processQuestions(questions) {
    return questions.map(q => ({
      ...q,
      attempts: 0,
      lastAnswered: null,
      history: []
    }));
  }

  renderQuestion() {
    const question = this.questions[this.currentQuestion];
    const template = this.generateTemplate(question);
    document.querySelector('.question-content').innerHTML = template;
    this.updateProgress();
  }

  generateTemplate(question) {
    return `
      <div class="question-body" data-question-id="${question.id}">
        ${question.multimedia?.images?.map(img => `
          <figure class="medical-image">
            <img src="/assets/images/${img}" alt="Clinical illustration">
            <figcaption>Relevant diagnostic image</figcaption>
          </figure>
        `).join('')}
        
        <div class="question-text">${question.question}</div>
        
        <div class="options-grid">
          $${question.options.map(opt => `
            <button class="option-btn" 
                    data-option="$${opt.id}"
                    aria-labelledby="option-${opt.id}">
              <span class="option-id">${opt.id}</span>
              <span class="option-text" id="option-${opt.id}">${opt.content}</span>
              ${opt.correct ? '<span class="sr-only">(Correct answer)</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  handleAnswer(event) {
    const selectedOption = event.target.closest('.option-btn');
    if (!selectedOption) return;

    const questionId = selectedOption.closest('.question-body').dataset.questionId;
    const question = this.questions.find(q => q.id === questionId);
    
    this.recordAttempt(question, selectedOption.dataset.option);
    this.showFeedback(selectedOption, question);
  }

  recordAttempt(question, selectedId) {
    const attempt = {
      timestamp: new Date().toISOString(),
      selected: selectedId,
      correct: question.options.find(opt => opt.id === selectedId)?.correct || false
    };
    
    question.history.push(attempt);
    question.attempts++;
    question.lastAnswered = attempt.timestamp;
  }

  // Additional methods for timer, navigation, analytics integration...
}
