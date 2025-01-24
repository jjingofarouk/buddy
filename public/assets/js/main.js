// Import Modules
import { QuizEngine } from './app/QuizEngine.js';
import { Analytics } from './app/Analytics.js';

// Initialize Quiz
const quizEngine = new QuizEngine({
  shuffle: true,
  mode: 'timed',
});

// Initialize Analytics
const analytics = new Analytics('user-123');

// Theme Toggler
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
});

// Navigation
const navLinks = document.querySelectorAll('.main-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Quiz Navigation
const prevButton = document.querySelector('.prev-question');
const nextButton = document.querySelector('.next-question');

prevButton.addEventListener('click', () => quizEngine.prevQuestion());
nextButton.addEventListener('click', () => quizEngine.nextQuestion());
