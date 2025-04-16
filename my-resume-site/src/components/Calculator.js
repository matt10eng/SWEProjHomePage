import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clearDisplay = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplay(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (operator === '+') {
      return firstOperand + inputValue;
    } else if (operator === '-') {
      return firstOperand - inputValue;
    } else if (operator === '×') {
      return firstOperand * inputValue;
    } else if (operator === '÷') {
      return inputValue !== 0 ? firstOperand / inputValue : 'Error';
    }

    return inputValue;
  };

  const handleEquals = () => {
    if (!operator) return;

    const inputValue = parseFloat(display);
    const result = performCalculation();

    setDisplay(String(result));
    setFirstOperand(result);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handlePercentage = () => {
    const inputValue = parseFloat(display);
    setDisplay(String(inputValue / 100));
  };

  const toggleSign = () => {
    const newValue = parseFloat(display) * -1;
    setDisplay(String(newValue));
  };

  return (
    <div className="calculator-page">
      <div className="calculator-container">
        <h2>React Calculator</h2>
        <div className="calculator">
          <div className="calculator-display">{display}</div>
          <div className="calculator-keypad">
            <div className="input-keys">
              <div className="function-keys">
                <button className="calculator-key key-clear" onClick={clearDisplay}>
                  AC
                </button>
                <button className="calculator-key key-sign" onClick={toggleSign}>
                  ±
                </button>
                <button className="calculator-key key-percent" onClick={handlePercentage}>
                  %
                </button>
              </div>
              <div className="digit-keys">
                <button className="calculator-key key-0" onClick={() => inputDigit('0')}>
                  0
                </button>
                <button className="calculator-key key-dot" onClick={inputDecimal}>
                  .
                </button>
                <button className="calculator-key key-1" onClick={() => inputDigit('1')}>
                  1
                </button>
                <button className="calculator-key key-2" onClick={() => inputDigit('2')}>
                  2
                </button>
                <button className="calculator-key key-3" onClick={() => inputDigit('3')}>
                  3
                </button>
                <button className="calculator-key key-4" onClick={() => inputDigit('4')}>
                  4
                </button>
                <button className="calculator-key key-5" onClick={() => inputDigit('5')}>
                  5
                </button>
                <button className="calculator-key key-6" onClick={() => inputDigit('6')}>
                  6
                </button>
                <button className="calculator-key key-7" onClick={() => inputDigit('7')}>
                  7
                </button>
                <button className="calculator-key key-8" onClick={() => inputDigit('8')}>
                  8
                </button>
                <button className="calculator-key key-9" onClick={() => inputDigit('9')}>
                  9
                </button>
              </div>
            </div>
            <div className="operator-keys">
              <button className="calculator-key key-divide" onClick={() => handleOperator('÷')}>
                ÷
              </button>
              <button className="calculator-key key-multiply" onClick={() => handleOperator('×')}>
                ×
              </button>
              <button className="calculator-key key-subtract" onClick={() => handleOperator('-')}>
                −
              </button>
              <button className="calculator-key key-add" onClick={() => handleOperator('+')}>
                +
              </button>
              <button className="calculator-key key-equals" onClick={handleEquals}>
                =
              </button>
            </div>
          </div>
        </div>
        <Link to="/" className="back-button">Back to Homepage</Link>
      </div>
    </div>
  );
};

export default Calculator; 