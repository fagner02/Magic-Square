var num = Math.ceil(Math.random() * 9);

const body = document.querySelector("body");
const text = document.querySelector(".text>input");
const cells = document.getElementsByClassName("cell");
const back = document.getElementsByClassName("back");
const inputs = document.getElementsByTagName("input");
const svg = document.querySelector(".powerUp");

boundSvg = svg?.getBoundingClientRect();

svg?.addEventListener("touchmove", (e) => {
  drag({ x: e.touches[0].pageX, y: e.touches[0].pageY });
});

svg?.addEventListener("touchend", () => {
  drop();
});

var mouseDown = false;
body.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    drag({ x: e.pageX, y: e.pageY });
  }
});

svg?.addEventListener("mousedown", (e) => {
  mouseDown = true;
});

svg?.addEventListener("mouseup", () => {
  mouseDown = false;
  drop();
});
var svgHtml = `
<svg class="powerSvg" width="70" height="70"> 
  <text class="powerText" x="19" y="56%"> ÷ </text> 
  <circle class="powerCircle" cx="50%" cy="50%" r="20"></circle> 
  <g class="arrow"> 
   <use href="#arrow" /> 
  </g>  
</svg>`;

function drag(pos) {
  svg.style.top = pos.y - 35 + "px";
  svg.style.left = pos.x - 35 + "px";
}

function drop() {
  var x = parseFloat(svg.style.left) + 35;
  var y = parseFloat(svg.style.top) + 35;

  svg.style.top = boundSvg.top + "px";
  svg.style.left = boundSvg.left + "px";
  for (var i = 0; i < cellsBound.length; i++) {
    if (
      x > cellsBound[i].left &&
      x < cellsBound[i].right &&
      y > cellsBound[i].top &&
      y < cellsBound[i].bottom
    ) {
      console.log("index", i);
      var frag = document.createRange().createContextualFragment(svgHtml);
      var temp = document.importNode(frag, true);
      cells[i].append(temp);
      divideValue = i;
      handleChanges(numbers[i]);
      return;
    }
  }
}

for (var i = 0; i < inputs.length; i++) {
  inputs[i].setAttribute(
    "onkeydown",
    `return event.keyCode !== 69 &&
    event.keyCode !== 0 && event.keyCode !== 10`
  );
  inputs[i].setAttribute("index", i);
}

text.value = num;

text.addEventListener("input", (e) => {
  num = text.value;
  handleChanges(numbers[0]);
});

var cellsBound = [];
var desPos = 0;
var xy = 0;
var size = 0;

(() => {
  var side = 70;
  size = Math.ceil(Math.sqrt(side ** 2 + side ** 2));
  xy = Math.round(10 * side * 0.2071429 * -1) / 10;
  desPos = side - xy;
})();

var gradientParts = [0, 1, 2, 1, 2, 3, 2, 3, 4];
function wait(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
(async () => {
  for (var i = 0; i < back.length; i++) {
    console.log(xy);
    backPos = gradientParts[i] * -50;
    cells[i].style.backgroundPosition = `${backPos}px ${backPos}px`;
    back[i].style.width = size + "px";
    back[i].style.height = size + "px";
    back[i].style.top = xy + "px";
    back[i].style.left = xy + "px";
    paramTimer(
      (obj) => {
        obj.style.transition = "top 1s, left 1s";
      },
      [back[i]],
      20
    );
  }
})();
async function paramTimer(cb, param, time) {
  await wait(time);
  cb(...param);
}

var numbers = document.getElementsByClassName("cellInput");
console.log(numbers.length);
console.log(numbers[1].getAttribute("index"), "index");
for (var i = 0; i < numbers.length; i++) {
  numbers[i].value = "0";
  setInputListener(numbers[i]);
  bound = cells[i].getBoundingClientRect();

  cellsBound.push({
    top: bound.top,
    left: bound.left,
    bottom: bound.bottom,
    right: bound.right,
  });
}
console.log(parseInt("0"), "parse");
function getKey(obj) {
  obj.addEventListener("keydown", (e) => {
    alert(e.keyCode);
  });
}

var selectTarget = false;
var divideValue = -1;
var divideDirection = 6;
function setInputListener(obj) {
  obj.addEventListener("input", (e) => {
    handleChanges(obj);
  });
}
function handleChanges(obj) {
  if (obj.value.charAt(0) == "0" && obj.value.length > 1) {
    obj.value = obj.value.substr(1, obj.value.length);
  }
  if (selectTarget && obj.value == "90") {
    num = parseInt(numbers[0].value);
    num = isNaN(num) ? 0 : num;
    text.value = num;
    selectTarget = false;
  }
  if (obj.value == "8089") {
    selectTarget = true;
  }

  var lines = [0, 0, 0, 0, 0, 0, 0, 0];

  for (var i = 0; i < numbers.length; i++) {
    var divide = i == divideValue;
    var value = parseFloat(numbers[i].value);
    value = isNaN(value) ? 0 : value;

    value = divide ? value / 2 : value;

    var column = (i % 3) + 3;
    var row = Math.floor(i / 3);
    lines[row] += value;
    lines[column] += value;

    if (row == column - 3) {
      var sum = divide && divideDirection == 6 ? value * 2 : value;
      lines[6] += sum;
    }
    if (row == 2 - (column - 3)) {
      value = divide && divideDirection == 7 ? value * 2 : value;
      lines[7] += value;
    }
  }
  setResult(lines, false);
  setResult(lines, true);
}
const lineMatch = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const parts = [3, 2, 3, 2, 4, 2, 3, 2, 3];

function setCorrect(index) {
  const pos = lineMatch[index];
  for (var i = 0; i < pos.length; i++) {
    const partPos = desPos / parts[pos[i]] + parseFloat(back[pos[i]].style.top);

    back[pos[i]].style.top = `${partPos}px`;
    back[pos[i]].style.left = `${partPos}px`;
  }
}

function setIncorrect(index) {
  const pos = lineMatch[index];
  for (var i = 0; i < pos.length; i++) {
    back[pos[i]].style.top = `${xy}px`;
    back[pos[i]].style.left = `${xy}px`;
  }
}

function setResult(lines, cover) {
  for (var n = 0; n < 8; n++) {
    if (lines[n] == num && cover) {
      setCorrect(n);
    }
    if (lines[n] != num && !cover) {
      setIncorrect(n);
    }
  }
}
