var LOCAL_BASE = "COMPLETED";
var completed = {};
var solved = 0;
var review = 0;
var local_rows = {};

// Extra column adding functionality
function process(row) {
  th = row.getElementsByTagName("th");
  if (th.length > 0) {
    if (th.length === 6)
      row.innerHTML +=
        '<th class="sorting" tabindex="0" aria-controls="example2" rowspan="1" colspan="1" style="width: 88px;" aria-label="Difficulty: activate to sort column ascending"> Solved</th>';
  } else {
    console.log(row);
    td = row.getElementsByTagName("td");
    var id = td[0].innerHTML;
    for (var i = 6; i < td.length; i++) td[i].remove();

    if (completed[id]) {
      if (completed[id] == 1) {
        row.innerHTML +=
          "<td class='bg-success'> <button class='btn btn-success' onclick=markIncomplete('" +
          id +
          "')> Undo </button>  </td>";
        row.classList.add("bg-success");
      } else {
        row.innerHTML +=
          "<td class='bg-warning'> <button class='btn btn-warning' onclick=markIncomplete('" +
          id +
          "')> Undo </button>  </td>";
        row.classList.add("bg-warning");
      }
    } else {
      row.innerHTML +=
        "<td> <div style='display:flex'> <button class='btn btn-danger' style='margin-right:2px' onclick=markCompleted('" +
        id +
        "')> D </button>  <button class='btn btn-danger' onclick=markReview('" +
        id +
        "')> R </button></td> </div>";
      row.classList.remove("bg-success");
      row.classList.remove("bg-warning");
    }
  }
}

function addExtraCol() {
  var rows = document.getElementsByTagName("tr");
  for (var i = 0; i < rows.length; i++) {
    process(rows[i]);
  }
}

function updateUI() {
  document.getElementById("solved").innerHTML = solved;
  document.getElementById("review").innerHTML = review;
}

// Local data communication
function loadLocal() {
  completed = JSON.parse(localStorage.getItem(LOCAL_BASE)) || {};
}

function saveToLocal(completed) {
  localStorage.setItem(LOCAL_BASE, JSON.stringify(completed));
}

function clearLocalData() {
  if (confirm("Are you sure clear data??")) {
    localStorage.removeItem(LOCAL_BASE);
    completed = [];
    solved = 0;
    review = 0;
    updateUI();
  }
}

// Event Handling functions
function markReview(id) {
  completed[id] = 2;
  saveToLocal(completed);
  review++;
  updateUI();
}

function markCompleted(id) {
  completed[id] = 1;
  saveToLocal(completed);
  solved++;
  updateUI();
}

function markIncomplete(id) {
  completed[id] == 1 ? solved-- : review--;
  delete completed[id];
  saveToLocal(completed);
  updateUI();
}

function review_questions() {}

function start() {
  loadLocal();
  addExtraCol();
  document.getElementById("start").disabled = true;
  document.getElementById("review_q").disabled = false;
  var body = document.getElementsByTagName("body")[0];
  body.addEventListener("click", addExtraCol);

  var values = Object.entries(completed) || [];
  values.forEach((ele) => {
    if (ele[1] == 1) solved++;
    else if (ele[1] == 2) review++;
  });
  updateUI();
}

function initial() {
  console.log("Extention Initialized");
  var head = document.getElementsByClassName("blog-header")[0];
  head.innerHTML =
    "<button class='btn btn-info' id='start' onclick='start()'> Start Extention </button>  " +
    "<button class='btn btn-warning ml-2' id='review_q' onclick='review_questions()' disabled> Review Questions </button>" +
    "<button class='btn btn-danger ml-2' onclick='clearLocalData()'> Clear Data </button>" +
    "<p class='text-danger'> Before starting extention please make sure you sort questions according to your need. once extention is started the sorting will be disabled. </p>" +
    "<div class='alert alert-info' role='alert'> Solved Questions = <span id='solved' style='margin-right:20px'>0</span>  Mark for Review = <span id='review'>0</span></div>";
}

if (window.location.href.indexOf("/problems") === -1) initial();
