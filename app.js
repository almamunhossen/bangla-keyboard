/***** Global Variables *****/
var activeta; // Active textarea ID
var isShift = false; // Shift state for on-screen keyboard
var switched = false; // Toggle for Bangla/English mode
var ctrlPressed = false; // Track control key (for Unijoy)
var carry = ""; // For storing keystrokes (Unijoy)
var old_len = 0; // Length of last parsed Bangla character
var lastInserted; // Last inserted value
// Number row values for unshift and shift states (for on-screen keyboard)
var unshiftedNumbers = [
  "১",
  "২",
  "৩",
  "৪",
  "৫",
  "৬",
  "৭",
  "৮",
  "৯",
  "০",
  "-",
  "=",
  "ৱ",
];
var shiftedNumbers = [
  "!",
  "@",
  "#",
  "৳",
  "%",
  "÷",
  "ঁ",
  "×",
  "(",
  ")",
  "ৎ",
  "+",
  "ৰ",
];

/***** On‑Screen Keyboard Functions *****/
// Insert text at the cursor position in the textarea
function insertAtCursor(myValue) {
  lastInserted = myValue;
  var myField = document.getElementById(activeta);
  if (document.selection) {
    myField.focus();
    var sel = document.selection.createRange();
    sel.text = myValue;
    sel.collapse(true);
    sel.select();
  } else if (myField.selectionStart || myField.selectionStart === 0) {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    var scrollTop = myField.scrollTop;
    startPos = startPos === -1 ? myField.value.length : startPos;
    myField.value =
      myField.value.substring(0, startPos) +
      myValue +
      myField.value.substring(endPos);
    myField.focus();
    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
    myField.scrollTop = scrollTop;
  } else {
    myField.value += myValue;
    myField.focus();
  }
}

// Insert a key from the on-screen keyboard based on shift state

function insertKey(btn) {
  // Ensure the active textarea is set
  if (!activeta) {
    console.error(
      "Active textarea is not set. Please ensure 'activeta' is initialized."
    );
    return;
  }

  // Get the active textarea element
  const textarea = document.getElementById(activeta);
  if (!textarea) {
    console.error(`Textarea with ID '${activeta}' not found.`);
    return;
  }

  // Get the value based on the shift state
  const value = isShift
    ? btn.getAttribute("data-shift")
    : btn.getAttribute("data-unshift");

  // Ensure the button has the required attributes
  if (!value) {
    console.error(
      "Button does not have the required 'data-shift' or 'data-unshift' attributes."
    );
    return;
  }

  // Insert the value into the textarea
  insertAtCursor(value);
}

// Toggle shift state and update key labels
function toggleShift() {
  isShift = !isShift;
  // Update number row buttons
  for (var i = 0; i < unshiftedNumbers.length; i++) {
    var btn = document.getElementById("num" + i);
    if (btn) {
      btn.innerHTML = isShift ? shiftedNumbers[i] : unshiftedNumbers[i];
    }
  }
  // Update keys with data attributes
  var keys = document.querySelectorAll(
    "#onScreenKeyboard button[data-unshift]"
  );
  keys.forEach(function (btn) {
    btn.innerHTML = isShift
      ? btn.getAttribute("data-shift")
      : btn.getAttribute("data-unshift");
  });
  // Visual indicator for shift key
  document.getElementById("shiftKey").style.backgroundColor = isShift
    ? "#d4d4d4"
    : "#eaeaea";
}

// Insert number from the number row
function insertNumber(index) {
  var value = isShift ? shiftedNumbers[index] : unshiftedNumbers[index];
  insertAtCursor(value);
}

// Backspace function to remove a character before the cursor or delete selection
function backspace() {
  var myField = document.getElementById(activeta);
  if (myField.selectionStart || myField.selectionStart === 0) {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    if (startPos === endPos && startPos > 0) {
      myField.value =
        myField.value.substring(0, startPos - 1) +
        myField.value.substring(endPos);
      myField.selectionStart = myField.selectionEnd = startPos - 1;
    } else if (startPos !== endPos) {
      myField.value =
        myField.value.substring(0, startPos) + myField.value.substring(endPos);
      myField.selectionStart = myField.selectionEnd = startPos;
    }
    myField.focus();
  }
}

// Copy text to clipboard
function copyText() {
  var textArea = document.getElementById("bangla");
  textArea.select();
  try {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(textArea.value);
    } else {
      document.execCommand("copy");
    }
    alert("Text copied to clipboard!");
  } catch (err) {
    alert("Unable to copy text");
  }
}

/***** Unijoy Script Functions *****/
// Set of Unijoy character mappings
var unijoy = [];
unijoy["0"] = "\u09e6"; // ০
unijoy["1"] = "\u09e7"; // ১
unijoy["2"] = "\u09e8"; // ২
unijoy["3"] = "\u09e9"; // ৩
unijoy["4"] = "\u09ea"; // ৪
unijoy["5"] = "\u09eb"; // ৫
unijoy["6"] = "\u09ec"; // ৬
unijoy["7"] = "\u09ed"; // ৭
unijoy["8"] = "\u09ee"; // ৮
unijoy["9"] = "\u09ef"; // ৯

// Unijoy Bangla equivalents
unijoy["j"] = "\u0995"; // ক
unijoy["d"] = "\u09BF"; // ি
unijoy["gd"] = "\u0987"; // ই
unijoy["D"] = "\u09C0"; // ী
unijoy["gD"] = "\u0988"; // ঈ
unijoy["c"] = "\u09C7"; // ে
unijoy["gc"] = "\u098F"; // এ
unijoy["gs"] = "\u0989"; // উ
unijoy["s"] = "\u09C1"; // ু
unijoy["S"] = "\u09C2"; // ূ
unijoy["gS"] = "\u098A"; // ঊ
unijoy["v"] = "\u09B0"; // র
unijoy["a"] = "\u098B"; // ৃ
unijoy["f"] = "\u09BE"; // া
unijoy["gf"] = "\u0986"; // আ
unijoy["F"] = "\u0985"; // অ
unijoy["n"] = "\u09B8"; // স
unijoy["t"] = "\u099F"; // ট
unijoy["J"] = "\u0996"; // খ
unijoy["b"] = "\u09A8"; // ন
unijoy["B"] = "\u09A3"; // ণ
unijoy["k"] = "\u09A4"; // ত
unijoy["K"] = "\u09A5"; // থ
unijoy["e"] = "\u09A1"; // ড
unijoy["E"] = "\u09A2"; // ঢ
unijoy["h"] = "\u09AC"; // ব
unijoy["H"] = "\u09AD"; // ভ
unijoy["p"] = "\u09DC"; // ড়
unijoy["P"] = "\u09DD"; // ঢ়
unijoy["o"] = "\u0997"; // গ
unijoy["O"] = "\u0998"; // ঘ
unijoy["i"] = "\u09B9"; // হ
unijoy["I"] = "\u099E"; // ঞ
unijoy["u"] = "\u099C"; // জ
unijoy["U"] = "\u099D"; // ঝ
unijoy["y"] = "\u099A"; // চ
unijoy["Y"] = "\u099B"; // ছ
unijoy["T"] = "\u09A0"; // ঠ
unijoy["r"] = "\u09AA"; // প
unijoy["R"] = "\u09AB"; // ফ
unijoy["l"] = "\u09A6"; // দ
unijoy["L"] = "\u09A7"; // ধ
unijoy["w"] = "\u09AF"; // য
unijoy["W"] = "\u09DF"; // য়
unijoy["q"] = "\u0999"; // ঙ
unijoy["Q"] = "\u0982"; // ং
unijoy["V"] = "\u09B2"; // ল
unijoy["m"] = "\u09AE"; // ম
unijoy["M"] = "\u09B6"; // শ
unijoy["N"] = "\u09B7"; // ষ
unijoy["gx"] = "\u0993"; // ও
unijoy["X"] = "\u09CC"; // ৌ
unijoy["gX"] = "\u0994"; // ঔ
unijoy["gC"] = "\u0990"; // ঐ
unijoy["\\"] = "\u0983"; // Khanda (ঁ)
unijoy["|"] = "\u09CE"; // Bisworgo
unijoy["G"] = "\u0964"; // ।
unijoy["g"] = " "; // hosonto (or joiner)
unijoy["&"] = "\u0981"; // চন্দ্রবিন্দু
unijoy["Z"] = "\u09CD" + "\u09AF"; // জোফলা
unijoy["gh"] = "\u09CD" + "\u09AC"; // বোফলা
unijoy["ga"] = "\u098B"; // Wri kar
unijoy["a"] = "\u09C3"; // Wri
unijoy["vZ"] = unijoy["v"] + "\u200d" + "\u09CD" + "\u09AF";
unijoy["z"] = "\u09CD" + unijoy["v"];
unijoy["x"] = "\u09CB";
unijoy["C"] = "\u09C8"; // Oi Kar
unijoy["gf"] = "\u09CD\u09BE"; // আ

// Track the control key press
function checkKeyDown(ev) {
  var e = ev.keyCode || ev.which;
  if (e == 17) {
    ctrlPressed = true;
  }
}
function checkKeyUp(ev) {
  var e = ev.keyCode || ev.which;
  if (e == 17) {
    ctrlPressed = false;
  }
}

// Main Unijoy parser for keystrokes
function parseunijoy(evnt) {
  var t = document.getElementById(activeta);
  var e = evnt.keyCode || evnt.which;

  // Toggle keyboard mode with ctrl + F2 (113)
  if (e == 113) {
    if (ctrlPressed) {
      switched = !switched;
      return true;
    }
  }
  if (switched) return true;

  if (ctrlPressed) {
    e = 0;
  }

  var char_e = String.fromCharCode(e);

  if (e == 8 || e == 32) {
    // On backspace or space clear the carry
    carry = " ";
    old_len = 1;
    return;
  }

  var lastcarry = carry;
  carry += char_e;

  var bangla = parseunijoyCarry(carry);
  var tempBangla = parseunijoyCarry(char_e);

  if (tempBangla == ".." || bangla == "..") {
    return false;
  }

  if (char_e == "g") {
    if (carry == "gg") {
      insertConjunction("\u09CD" + "\u200c", old_len);
      old_len = 1;
      return false;
    }
    // Otherwise, simple joiner
    insertAtCursor("\u09CD");
    old_len = 1;
    carry = "g";
    return false;
  } else if (old_len == 0) {
    insertConjunction(bangla, 1);
    old_len = 1;
    return false;
  } else if (char_e == "A") {
    var newChar = unijoy["v"] + "\u09CD";
    insertAtCursor(newChar);
    old_len = 1;
    return false;
  } else if (bangla == "" && tempBangla != "") {
    bangla = tempBangla;
    if (bangla == "") {
      carry = "";
      return;
    } else {
      carry = char_e;
      insertAtCursor(bangla);
      old_len = bangla.length;
      return false;
    }
  } else if (bangla != "") {
    insertConjunction(bangla, old_len);
    old_len = bangla.length;
    return false;
  }
}

// Returns the Bangla equivalent for a given keystroke sequence
function parseunijoyCarry(code) {
  if (!unijoy[code]) {
    return "";
  } else {
    return unijoy[code];
  }
}

// Inserts a conjunction by replacing the previous characters
function insertConjunction(myValue, len) {
  lastInserted = myValue;
  var myField = document.getElementById(activeta);
  if (document.selection) {
    myField.focus();
    var sel = document.selection.createRange();
    if (myField.value.length >= len) {
      sel.moveStart("character", -1 * len);
    }
    sel.text = myValue;
    sel.collapse(true);
    sel.select();
  } else if (myField.selectionStart || myField.selectionStart === 0) {
    myField.focus();
    var startPos = myField.selectionStart - len;
    var endPos = myField.selectionEnd;
    var scrollTop = myField.scrollTop;
    startPos = startPos === -1 ? myField.value.length : startPos;
    myField.value =
      myField.value.substring(0, startPos) +
      myValue +
      myField.value.substring(endPos);
    myField.focus();
    myField.selectionStart = startPos + myValue.length;
    myField.selectionEnd = startPos + myValue.length;
    myField.scrollTop = scrollTop;
  } else {
    var scrollTop = myField.scrollTop;
    myField.value += myValue;
    myField.focus();
    myField.scrollTop = scrollTop;
  }
}

// Initialize the Unijoy editor on the given textarea ID
function makeUnijoyEditor(textAreaId) {
  const activeTextAreaInstance = document.getElementById(textAreaId);
  activeTextAreaInstance.onkeypress = parseunijoy;
  activeTextAreaInstance.onkeydown = checkKeyDown;
  activeTextAreaInstance.onkeyup = checkKeyUp;
  activeTextAreaInstance.onfocus = function () {
    activeta = textAreaId; // Set the active textarea
  };
}

// Consolidated window.onload initialization
window.onload = function () {
  makeUnijoyEditor("bangla");
  const textarea = document.getElementById("bangla");
  textarea.focus(); // Automatically focus the textarea

  // Initialize Enter key listener
  document.getElementById("enter-key").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default action (e.g., form submission)
      this.value += "\n"; // Add a new line
    }
  });

  // Initialize mode toggle
  document.getElementById("switch").addEventListener("change", toggleMode);

  // Initialize calculator mode behavior
  textarea.addEventListener("keydown", function (e) {
    if (isCalculatorMode && e.key === "Enter") {
      e.preventDefault(); // Prevent newline in textarea
      calculate(); // Perform calculation
    }
  });
};

// Enter Key চাপলে নতুন লাইন যুক্ত হবে
function insertEnter() {
  const textarea = document.getElementById("bangla");

  // Insert a new line at the current cursor position
  if (textarea.selectionStart || textarea.selectionStart === 0) {
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const textBefore = textarea.value.substring(0, startPos);
    const textAfter = textarea.value.substring(endPos, textarea.value.length);

    // Add the new line
    textarea.value = textBefore + "\n" + textAfter;

    // Move the cursor to the next line
    textarea.selectionStart = textarea.selectionEnd = startPos + 1;
  } else {
    // If no selection, simply append a new line
    textarea.value += "\n";
  }

  // Keep the focus on the textarea
  textarea.focus();
}

// ----------------Switch toggle-----------------------//

let isCalculatorMode = false; // Default mode is Normal

// Toggle between Normal and Calculator mode
function toggleMode() {
  isCalculatorMode = document.getElementById("switch").checked;
  const textarea = document.getElementById("bangla");

  if (isCalculatorMode) {
    textarea.placeholder = "ক্যালকুলেটর মোড (বাংলা সংখ্যা ব্যবহার করুন)";
  } else {
    textarea.placeholder = "বাংলা টাইপ করুন...";
  }
}

// Handle input behavior
document.getElementById("bangla").addEventListener("keydown", function (e) {
  if (isCalculatorMode && e.key === "Enter") {
    e.preventDefault(); // Prevent newline in textarea
    calculate(); // Perform calculation
  }
});

// ক্যালকুলেশন ফাংশন
function calculate() {
  const textarea = document.getElementById("bangla");
  let value = textarea.value.trim();
  if (!value) return;

  // বাংলা সংখ্যাগুলো ইংরেজি সংখ্যায় রূপান্তর করা
  let convertedExpression = value
    .replace(/০/g, "0")
    .replace(/১/g, "1")
    .replace(/২/g, "2")
    .replace(/৩/g, "3")
    .replace(/৪/g, "4")
    .replace(/৫/g, "5")
    .replace(/৬/g, "6")
    .replace(/৭/g, "7")
    .replace(/৮/g, "8")
    .replace(/৯/g, "9")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/[^0-9+\-*/().]/g, "");

  try {
    let result = eval(convertedExpression);
    if (!isNaN(result)) {
      textarea.value = result
        .toString()
        .replace(/0/g, "০")
        .replace(/1/g, "১")
        .replace(/2/g, "২")
        .replace(/3/g, "৩")
        .replace(/4/g, "৪")
        .replace(/5/g, "৫")
        .replace(/6/g, "৬")
        .replace(/7/g, "৭")
        .replace(/8/g, "৮")
        .replace(/9/g, "৯");
    }
  } catch (err) {
    textarea.value = "ভুল ইনপুট!";
  }
}

//------------------Switch Language Mode------------------//
// Switch between Bangla and English modes
function switchLanguageMode() {
  const textarea = document.getElementById("bangla");
  const button = document.querySelector(".pointer");

  if (button.value === "Switch to Bangla") {
    button.value = "Switch to English";
    textarea.placeholder = "বাংলা টাইপ করুন...";
  } else {
    button.value = "Switch to Bangla";
    textarea.placeholder = "Type in English...";
  }
}