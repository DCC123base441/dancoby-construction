import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export default function ResourceQuiz({ questions, onPass }) {
  const { lang } = useLanguage();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions || questions.length === 0) return null;

  const q = questions[currentQ];
  const questionText = lang === 'es' && q.question_es ? q.question_es : q.question;
  const options = lang === 'es' && q.options_es?.length === q.options?.length
    ? q.options_es.map((o, i) => o || q.options[i])
    : q.options || [];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleConfirm = () => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === q.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setFinished(true);
      const finalScore = selected === q.correctIndex ? score + 1 : score;
      const passed = finalScore >= Math.ceil(questions.length * 0.7);
      if (passed && onPass) onPass();
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  const finalScore = finished ? score : null;
  const passed = finalScore !== null && finalScore >= Math.ceil(questions.length * 0.7);

  if (finished) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 text-center space-y-3">
        <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
          {passed ? <CheckCircle2 className="w-7 h-7 text-green-600" /> : <XCircle className="w-7 h-7 text-red-600" />}
        </div>
        <h3 className="font-bold text-gray-900 text-lg">{passed ? (lang === 'es' ? '¡Aprobaste!' : 'You Passed!') : (lang === 'es' ? 'Intenta de nuevo' : 'Try Again')}</h3>
        <p className="text-sm text-gray-500">{finalScore} / {questions.length} {lang === 'es' ? 'correctas' : 'correct'}</p>
        {!passed && (
          <Button onClick={handleRetry} variant="outline" size="sm">
            <RotateCcw className="w-3.5 h-3.5 mr-1" /> {lang === 'es' ? 'Reintentar' : 'Retry'}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">{lang === 'es' ? 'Pregunta' : 'Question'} {currentQ + 1} / {questions.length}</span>
        <span className="text-xs text-gray-400">{score} {lang === 'es' ? 'correctas' : 'correct'}</span>
      </div>

      <p className="font-semibold text-gray-900">{questionText}</p>

      <div className="space-y-2">
        {options.map((opt, idx) => {
          let style = 'border-gray-200 bg-white hover:border-amber-300';
          if (showResult) {
            if (idx === q.correctIndex) style = 'border-green-500 bg-green-50';
            else if (idx === selected) style = 'border-red-400 bg-red-50';
            else style = 'border-gray-200 bg-gray-50 opacity-60';
          } else if (selected === idx) {
            style = 'border-amber-500 bg-amber-50';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  showResult && idx === q.correctIndex ? 'bg-green-500 text-white' :
                  showResult && idx === selected ? 'bg-red-400 text-white' :
                  selected === idx ? 'bg-amber-500 text-white' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className={showResult && idx !== q.correctIndex && idx !== selected ? 'text-gray-400' : 'text-gray-800'}>{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        {!showResult ? (
          <Button size="sm" onClick={handleConfirm} disabled={selected === null}>
            {lang === 'es' ? 'Confirmar' : 'Confirm'}
          </Button>
        ) : (
          <Button size="sm" onClick={handleNext}>
            {currentQ + 1 < questions.length
              ? <><ArrowRight className="w-3.5 h-3.5 mr-1" /> {lang === 'es' ? 'Siguiente' : 'Next'}</>
              : (lang === 'es' ? 'Ver Resultado' : 'See Results')
            }
          </Button>
        )}
      </div>
    </div>
  );
}