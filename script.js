// Medical MCQ Application
class MedicalMCQApp {
    constructor() {
        this.subjects = [];
        this.currentSubject = null;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;

        this.initializeElements();
        this.setupEventListeners();
        this.loadSubjects();
        this.setupThemeSystem();
    }

    initializeElements() {
        this.elements = {
            subjectList: document.getElementById('subject-list'),
            subjectSearch: document.getElementById('subject-search'),
            currentSubjectTitle: document.getElementById('current-subject'),
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            startQuizBtn: document.getElementById('start-quiz'),
            questionCounter: document.getElementById('question-counter'),
            resultArea: document.getElementById('result-area'),
            scoreDisplay: document.getElementById('score-display'),
            themeToggle: document.getElementById('theme-toggle'),
            themeColors: document.querySelectorAll('.theme-color')
        };
    }

    setupEventListeners() {
        this.elements.subjectSearch.addEventListener('input', this.filterSubjects.bind(this));
        this.elements.startQuizBtn.addEventListener('click', this.startQuiz.bind(this));
        this.elements.themeToggle.addEventListener('click', this.toggleDarkMode.bind(this));
        
        this.elements.themeColors.forEach(colorBtn => {
            colorBtn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.changeTheme(theme);
            });
        });
    }

    async loadSubjects() {
        try {
            const response = await fetch('medical-subjects.json');
            this.subjects = await response.json();
            this.renderSubjects();
        } catch (error) {
            console.error('Failed to load subjects:', error);
        }
    }

    renderSubjects() {
        this.elements.subjectList.innerHTML = '';
        this.subjects.forEach(subject => {
            const li = document.createElement('li');
            li.textContent = subject.name;
            li.addEventListener('click', () => this.selectSubject(subject));
            this.elements.subjectList.appendChild(li);
        });
    }

    filterSubjects() {
        const searchTerm = this.elements.subjectSearch.value.toLowerCase();
        const listItems = this.elements.subjectList.getElementsByTagName('li');
        
        Array.from(listItems).forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    selectSubject(subject) {
        this.currentSubject = subject;
        this.elements.currentSubjectTitle.textContent = subject.name;
        this.currentQuestions = subject.questions;
        this.elements.startQuizBtn.disabled = false;
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.shuffleQuestions();
        this.displayQuestion();
    }

    shuffleQuestions() {
        this.currentQuestions.sort(() => Math.random() - 0.5);
    }

    displayQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        this.elements.questionText.textContent = question.text;
        
        this.elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => this.selectAnswer(option));
            this.elements.optionsContainer.appendChild(optionBtn);
        });

        this.elements.questionCounter.textContent = 
            `${this.currentQuestionIndex + 1}/${this.currentQuestions.length}`;
    }

    selectAnswer(selectedOption) {
        const currentQuestion = this.currentQuestions[this.currentQuestionIndex];
        if (selectedOption === currentQuestion.correctAnswer) {
            this.score++;
        }
        this.currentQuestionIndex++;
        this.displayQuestion();
    }

    showResults() {
        this.elements.resultArea.classList.remove('hidden');
        this.elements.scoreDisplay.textContent = 
            `Your Score: ${this.score}/${this.currentQuestions.length}`;
    }

    toggleDarkMode() {
        document.body.classList.toggle('theme-dark');
        this.elements.themeToggle.querySelector('i').classList.toggle('fa-moon');
        this.elements.themeToggle.querySelector('i').classList.toggle('fa-sun');
    }

    changeTheme(themeName) {
        document.body.className = `theme-${themeName}`;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new MedicalMCQApp();
});
