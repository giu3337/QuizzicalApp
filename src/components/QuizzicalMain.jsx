import React, { useState, useEffect } from 'react';
import { decode } from 'html-entities';

const QuizzMain = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch('https://opentdb.com/api.php?amount=5&category=20&difficulty=easy&type=multiple')
      .then(response => response.json())
      .then(data => {
        const formattedQuestions = data.results.map((question, index) => {
          const options = question.incorrect_answers.map(answer => decode(answer));
          const correctAnswer = decode(question.correct_answer);
          options.splice(Math.floor(Math.random() * (options.length + 1)), 0, correctAnswer); // Insert correct answer at a random position
          return {
            id: index + 1,
            question: decode(question.question),
            options: options.sort(() => Math.random() - 0.5), // Shuffle options
            answer: correctAnswer,
            isCorrect: null
          };
        });
        setQuestions(formattedQuestions);
        setSelectedAnswers(Array(formattedQuestions.length).fill(null)); // Initialize selectedAnswers array
        setQuizCompleted(false); // Reset quiz completion status
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  const handleAnswerSelection = (questionIndex, optionIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const checkAnswers = () => {
    const updatedQuestions = questions.map((question, index) => {
      const isCorrect = selectedAnswers[index] === question.options.findIndex((option) => option === question.answer);
      return { ...question, isCorrect };
    });
    setQuestions(updatedQuestions);
    setQuizCompleted(true); // Set quiz completion status
  };

  const resetQuiz = () => {
    setSelectedAnswers(Array(5).fill(null));
    setQuestions([]);
    fetchQuestions();
  };

  return (
    <div className='QuizMainContainer'>
      <img src="blobup.png" alt="Yellow circle" className='top-right-image' />
      {questions.map((question, questionIndex) => (
        <div key={question.id} className='questionBox'>
          <p className='questionTitle'>{question.question}</p>
          <form>
            {question.options.map((option, optionIndex) => {
              const isSelected = selectedAnswers[questionIndex] === optionIndex;
              const isCorrect = question.isCorrect !== null && option === question.answer;
              const classNames = isSelected ? 'selected' : isCorrect ? 'incorrect' : '';
              return (
                <label key={optionIndex} htmlFor={`question-${question.id}-option-${optionIndex}`} className={classNames}>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    id={`question-${question.id}-option-${optionIndex}`}
                    onChange={() => handleAnswerSelection(questionIndex, optionIndex)}
                  />
                  {option}
                </label>
              );
            })}
          </form>
        </div>
      ))}

      <div className="scoreAndButtonContainer">
        {!quizCompleted ? (
          <button className="checkButton" onClick={checkAnswers}>Check Answers</button>
        ) : (
          <button className="checkButton" onClick={resetQuiz}>Play Again</button>
        )}
        {quizCompleted && (
          <p className="scoreParagraph">
            You scored {questions.filter(q => q.isCorrect).length}/5 correct answers.
          </p>
        )}
      </div>
      <img src="blobsDown.png" alt="Blue circle" className='bottom-left-image' />
    </div>
  );
};

export default QuizzMain;
