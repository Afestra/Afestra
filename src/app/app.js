/* ✦ AFESTRA — App Logic
   ═══════════════════════════════════════════════════════════
   This is YOUR app. Edit everything in here freely.

   Currently: A beautiful, fully-functional calculator.

   To build a different app:
   1. Clear the renderApp() function and replace the HTML
   2. Remove the Calculator class and write your own logic
   3. Update afestra.config.js with your app name

   The AFESTRA shell (header, theme, footer) is separate —
   it lives in src/shell/ and reads afestra.config.js.
   ═══════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ══════════════════════════════════════════════════════════
  //  STEP 1 ─ Render your app's HTML into #app-mount
  // ══════════════════════════════════════════════════════════
  function renderApp() {
    const mount = document.getElementById("app-mount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="calc-wrapper">

        <div class="calc-eyebrow">
          <h1>Calculator</h1>
          <p>The default AFESTRA app &middot; Fork &amp; build anything</p>
        </div>

        <div class="calc" role="application" aria-label="Calculator">
          <div class="calc-display">
            <div class="calc-display__history" id="calcHistory"></div>
            <div class="calc-display__value" id="calcDisplay">0</div>
          </div>

          <div class="calc-grid">
            <button class="calc-btn --function" data-action="clear">AC</button>
            <button class="calc-btn --function" data-action="sign">+/−</button>
            <button class="calc-btn --function" data-action="percent">%</button>
            <button class="calc-btn --operator" data-action="operator" data-value="÷">÷</button>

            <button class="calc-btn" data-action="digit" data-value="7">7</button>
            <button class="calc-btn" data-action="digit" data-value="8">8</button>
            <button class="calc-btn" data-action="digit" data-value="9">9</button>
            <button class="calc-btn --operator" data-action="operator" data-value="×">×</button>

            <button class="calc-btn" data-action="digit" data-value="4">4</button>
            <button class="calc-btn" data-action="digit" data-value="5">5</button>
            <button class="calc-btn" data-action="digit" data-value="6">6</button>
            <button class="calc-btn --operator" data-action="operator" data-value="−">−</button>

            <button class="calc-btn" data-action="digit" data-value="1">1</button>
            <button class="calc-btn" data-action="digit" data-value="2">2</button>
            <button class="calc-btn" data-action="digit" data-value="3">3</button>
            <button class="calc-btn --operator" data-action="operator" data-value="+">+</button>

            <button class="calc-btn --zero" data-action="digit" data-value="0">0</button>
            <button class="calc-btn --decimal" data-action="decimal">.</button>
            <button class="calc-btn --equals" data-action="equals">=</button>
          </div>
        </div>

        <div class="calc-opensource">
          <div class="calc-opensource__title">✦ Build your own app</div>
          <div class="calc-opensource__steps">
            <div class="calc-step">
              <span class="calc-step__num">1</span>
              <span>Edit <code>afestra.config.js</code> — set your app name &amp; color</span>
            </div>
            <div class="calc-step">
              <span class="calc-step__num">2</span>
              <span>Replace <code>src/app/app.js</code> with your own logic</span>
            </div>
            <div class="calc-step">
              <span class="calc-step__num">3</span>
              <span>Style it in <code>src/app/app.css</code> — then ship it 🚀</span>
            </div>
          </div>
        </div>

      </div>
    `;
  }


  // ══════════════════════════════════════════════════════════
  //  STEP 2 ─ Your app logic
  //  Below is the Calculator implementation.
  //  Replace this class with your own app's logic.
  // ══════════════════════════════════════════════════════════

  class Calculator {
    constructor() {
      this.display     = null;
      this.history     = null;
      this.clearBtn    = null;

      this.current     = "0";
      this.previous    = null;
      this.operator    = null;
      this.waitingForOperand = false;
      this.justCalculated   = false;
    }

    init() {
      this.display  = document.getElementById("calcDisplay");
      this.history  = document.getElementById("calcHistory");
      this.clearBtn = document.querySelector('[data-action="clear"]');

      if (!this.display) return;

      // Event delegation on the grid
      const grid = document.querySelector(".calc-grid");
      if (grid) {
        grid.addEventListener("click", (e) => {
          const btn = e.target.closest(".calc-btn");
          if (!btn) return;
          this._ripple(btn, e);
          this._handleButton(btn);
        });
      }

      // Keyboard support
      document.addEventListener("keydown", (e) => this._handleKey(e));

      this._updateDisplay();
    }

    // ── Button Dispatch ──────────────────────────────────────
    _handleButton(btn) {
      const action = btn.dataset.action;
      const value  = btn.dataset.value;

      switch (action) {
        case "digit":    this._inputDigit(value);    break;
        case "decimal":  this._inputDecimal();        break;
        case "operator": this._inputOperator(value);  break;
        case "equals":   this._calculate();           break;
        case "clear":    this._clear();               break;
        case "sign":     this._toggleSign();          break;
        case "percent":  this._percent();             break;
      }
    }

    _handleKey(e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const map = {
        "0":"0","1":"1","2":"2","3":"3","4":"4",
        "5":"5","6":"6","7":"7","8":"8","9":"9",
        "+":"+", "-":"−", "*":"×", "/":"÷",
        "Enter":"=", "=":"=", ".":".", ",":".",
        "Backspace":"backspace", "Escape":"clear", "%":"%",
      };
      const mapped = map[e.key];
      if (!mapped) return;
      e.preventDefault();

      if (mapped === "backspace") { this._backspace(); return; }
      if (mapped === "clear")     { this._clear();     return; }
      if (mapped === "=")         { this._calculate(); return; }
      if (mapped === "%")         { this._percent();   return; }
      if (mapped === ".")         { this._inputDecimal(); return; }
      if ("0123456789".includes(mapped)) { this._inputDigit(mapped); return; }
      this._inputOperator(mapped);
    }

    // ── Operations ───────────────────────────────────────────
    _inputDigit(digit) {
      if (this.waitingForOperand) {
        this.current = digit;
        this.waitingForOperand = false;
      } else {
        if (this.justCalculated) {
          this.current = digit;
          this.justCalculated = false;
        } else {
          this.current = this.current === "0"
            ? digit
            : this.current.length >= 12
              ? this.current
              : this.current + digit;
        }
      }
      this._updateDisplay();
      this._updateClearBtn();
    }

    _inputDecimal() {
      if (this.waitingForOperand) {
        this.current = "0.";
        this.waitingForOperand = false;
        this._updateDisplay();
        return;
      }
      if (!this.current.includes(".")) {
        this.current += ".";
        this._updateDisplay();
      }
    }

    _inputOperator(op) {
      const val = parseFloat(this.current);

      if (this.operator && !this.waitingForOperand) {
        const result = this._compute(parseFloat(this.previous), val, this.operator);
        this.current  = this._format(result);
        this.previous = String(result);
      } else {
        this.previous = this.current;
      }

      this.operator    = op;
      this.waitingForOperand = true;
      this.justCalculated    = false;
      this._updateHistory(`${this._format(parseFloat(this.previous))} ${op}`);
      this._updateDisplay();
      this._updateClearBtn();
      this._highlightOperator(op);
    }

    _calculate() {
      if (!this.operator || this.waitingForOperand) return;
      const a = parseFloat(this.previous);
      const b = parseFloat(this.current);
      const result = this._compute(a, b, this.operator);

      this._updateHistory(`${this._format(a)} ${this.operator} ${this._format(b)} =`);
      this.current  = this._format(result);
      this.previous = null;
      this.operator = null;
      this.waitingForOperand = false;
      this.justCalculated    = true;
      this._updateDisplay();
      this._updateClearBtn();
      this._clearOperatorHighlight();
    }

    _compute(a, b, op) {
      switch (op) {
        case "+": return a + b;
        case "−": return a - b;
        case "×": return a * b;
        case "÷": return b !== 0 ? a / b : NaN;
        default:  return b;
      }
    }

    _clear() {
      if (this.current !== "0" && this.clearBtn?.textContent === "C") {
        // First press: clear entry
        this.current = "0";
        this.clearBtn.textContent = "AC";
      } else {
        // Full clear
        this.current  = "0";
        this.previous = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.justCalculated    = false;
        this._updateHistory("");
        this._clearOperatorHighlight();
      }
      this._updateDisplay();
    }

    _backspace() {
      if (this.justCalculated) return;
      if (this.current.length > 1) {
        this.current = this.current.slice(0, -1);
      } else {
        this.current = "0";
      }
      this._updateDisplay();
      this._updateClearBtn();
    }

    _toggleSign() {
      const val = parseFloat(this.current);
      if (val === 0) return;
      this.current = this._format(-val);
      this._updateDisplay();
    }

    _percent() {
      const val = parseFloat(this.current);
      this.current = this._format(val / 100);
      this._updateDisplay();
    }

    // ── Display ──────────────────────────────────────────────
    _format(n) {
      if (isNaN(n))      return "Error";
      if (!isFinite(n))  return "∞";
      // Limit precision to avoid floating point noise
      const str = parseFloat(n.toPrecision(12)).toString();
      return str;
    }

    _updateDisplay() {
      if (!this.display) return;
      const val = this.current;
      this.display.textContent = val;

      // Font size scaling
      this.display.classList.remove("--small", "--xs");
      if (val.length > 10) this.display.classList.add("--xs");
      else if (val.length > 7) this.display.classList.add("--small");
    }

    _updateHistory(text) {
      if (this.history) this.history.textContent = text;
    }

    _updateClearBtn() {
      if (!this.clearBtn) return;
      this.clearBtn.textContent = this.current !== "0" ? "C" : "AC";
    }

    // ── Visual Feedback ──────────────────────────────────────
    _highlightOperator(op) {
      this._clearOperatorHighlight();
      document.querySelectorAll('[data-action="operator"]').forEach(btn => {
        if (btn.dataset.value === op) btn.classList.add("--operator-active");
      });
    }

    _clearOperatorHighlight() {
      document.querySelectorAll('[data-action="operator"]').forEach(btn => {
        btn.classList.remove("--operator-active");
      });
    }

    _ripple(btn, e) {
      const circle = document.createElement("span");
      circle.classList.add("ripple-circle");
      const rect = btn.getBoundingClientRect();
      circle.style.top  = (e.clientY - rect.top)  + "px";
      circle.style.left = (e.clientX - rect.left) + "px";
      btn.appendChild(circle);
      circle.addEventListener("animationend", () => circle.remove());
    }
  }


  // ══════════════════════════════════════════════════════════
  //  STEP 3 ─ Bootstrap
  //  This runs when the DOM is ready.
  // ══════════════════════════════════════════════════════════
  document.addEventListener("DOMContentLoaded", function () {
    renderApp();

    // Init your app
    const calc = new Calculator();
    calc.init();
  });

})();
