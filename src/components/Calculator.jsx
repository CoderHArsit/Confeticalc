import React, { useState } from "react";
import DisplayWindow from "./DisplayWindow";
import KeysWindow from "./KeysWindow";

import ConfettiExplosion from 'react-confetti-explosion';
import confetti from 'canvas-confetti';
import HistoryWindow from "./HistoryWindow";
const Calculator = ({toggle}) => {
  const [expression, setExpression] = useState("");
  const [history, setHistory] = useState([]); // State for history
  const [displayEXP, setDisplayEXP] = useState("");
  const [result, setResult] = useState("0");
  const [mode, setMode] = useState("rad");
  const [memory, setMemory] = useState(0); // Added state for memory
//  ARRAY FOR MAPPING SYMBOLS
  const sciFunc = {
    sin: "sin",
    cos: "cos",
    tan: "tan",
    ln: "Math.log",
    "log10": "Math.log10",
    π: "Math.PI",
    e: "Math.E",
    "^": "**",
    "√": "Math.sqrt",
    "∛": "Math.cbrt",
    "y√": "(x, y) => Math.pow(x, 1/y)", 
    "x": "*",
    "x2": "**2",
    "x3": "**3",
    "xy": "**",
    "ex": "2.718281828459045**",
    "10X": "10**",
    "1/x": "1/",
    "2nd": "2**",
    "sinh": "Math.sinh",
    "cosh": "Math.cosh",
    "tanh": "Math.tanh",
    "Rand": "Math.random",
  };
// CONVERTING ANGLES
  const toRadians = (angle) => (mode === "deg" ? (angle * Math.PI) / 180 : angle);

  function calcResult() {
    if (expression.length !== 0) {
      try {
        let exp = expression;
         // Check for 5 and 6 as operands in the expression
         const containsFiveAndSix = /\b5\b/.test(exp) && /\b6\b/.test(exp);
         if (containsFiveAndSix) {
           confetti({
             particleCount: 1000,
             spread: 100,
             origin: { y: 0.6 }
           });
         }
        // Replace trigonometric functions with radian-adjusted versions
        exp = exp.replace(/sin\(([^)]+)\)/g, (_, angle) => `Math.sin(${toRadians(angle)})`);
        exp = exp.replace(/cos\(([^)]+)\)/g, (_, angle) => `Math.cos(${toRadians(angle)})`);
        exp = exp.replace(/tan\(([^)]+)\)/g, (_, angle) => `Math.tan(${toRadians(angle)})`);

        let compute = eval(exp);
        setHistory([...history, { expression: displayEXP, result: compute }]); // Update history
        setExpression(compute);
        setDisplayEXP(compute);
        setResult(compute);

      } catch (error) {
        setResult("An Error Occurred!");
      }
    } else {
      setResult("An Error Occurred!");
    }
  }
  // CHECKING MINUS SIGN
  const [minus, setMinus]=useState("-");
  function handleButton(value) {
    if (value === "c") {
      setExpression("");
      setDisplayEXP("");
      setResult("0");
    } else if (value === "DEL") {
      if (typeof displayEXP === 'string') {
        setDisplayEXP(displayEXP.slice(0, -1));
      }
      if (typeof expression === 'string') {
        setExpression(expression.slice(0, -1));
      }
    } else if (sciFunc.hasOwnProperty(value)) {
      if (value === "y√") {
        // Implement logic for nth root operation
        const lastNum = extractLastNum(expression);
        if (lastNum != null) {
          const num = parseFloat(lastNum);
          setDisplayEXP(displayEXP + `√(`);
          setExpression(expression + `,`);
          setResult("√");
        }}
      setDisplayEXP(displayEXP + value);
      setExpression(expression + sciFunc[value]);
    } else if (value === "x!") {
      const lastNum = extractLastNum(expression);
      if (lastNum != null) {
        const num = parseFloat(lastNum);
        setDisplayEXP(displayEXP + value);
        setExpression(expression.replace(lastNum, factorial(num)));
      }
    } 
    
    else if(value ==="+/-"){
        if(minus==="-"){
          setExpression(expression+"-");
          setDisplayEXP(displayEXP+"-");
          setMinus("+");
        }
        else{
          setMinus("-");
        }
    }
    // CALCULATING RESULT IF = TO OCCURS
    else if (value === "=") calcResult();
    else if (value === "mode") {
      setMode(mode === "rad" ? "deg" : "rad");
    } else if (value === "mc") {
      setMemory(0);
    } else if (value === "m+") {
      setMemory(memory + parseFloat(result));
    } else if (value === "m-") {
      setMemory(memory - parseFloat(result));
    } else if (value === "mr") {
      setResult(memory.toString());
      setDisplayEXP(memory.toString());
      setExpression(memory.toString());
    } else {
      setExpression(expression + value);
      setDisplayEXP(displayEXP + value);
    }
  }

  function factorial(n) {
    let result = 1;
    for (let i = 1; i <= n; i++) result *= i;
    return result;
  }

  
  function extractLastNum(exp) {
    const numbers = exp.match(/\d+/g);
    return numbers ? numbers[numbers.length - 1] : null;
  }

 


  return (
    // passing toggle for light and dark mode
    // /dispexp contains the expression for the display and expresion contain the expresion to evaluate.


    <div className={`calculator ${toggle}`}>
      <div className="history_tab">
      <HistoryWindow toggle={toggle} history={history} /> 
      </div>
      <DisplayWindow toggle={toggle} expression={displayEXP} result={result} />
      <KeysWindow  handleButton={handleButton} />
      <button onClick={() => handleButton("mode")}>Mode: {mode}</button>

      <p style={{font:"small-caption"}}>Please use brackets for roots,  trigonometric and logarithmic functions i.e. sin(x) cos(x) log10(x)</p>

      
      
    </div>
  );
};

export default Calculator;
