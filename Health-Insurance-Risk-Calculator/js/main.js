// Get a reference to the select element
var selectElementHeight = document.getElementById('heightSelect');
var selectElementPressure = document.getElementById('pressureSelect');

// JSON data
var jsonDataHeight = {
"heightList": [
"4 feet ( 122 cm )",
"4 feet 1 inch ( 124 cm )",
"4 feet 2 inch ( 127 cm )",
"4 feet 3 inch ( 130 cm )",
"4 feet 4 inch ( 132 cm )",
"4 feet 5 inch ( 135 cm )",
"4 feet 6 inch ( 137 cm )",
"4 feet 7 inch ( 140 cm )",
"4 feet 8 inch ( 142 cm )",
"4 feet 9 inch ( 145 cm )",
"4 feet 10 inch( 147 cm )",
"4 feet 11 inch( 150 cm )",
"5 feet ( 152 cm )",
"5 feet 1 inch ( 155 cm )",
"5 feet 2 inch ( 157 cm )",
"5 feet 3 inch ( 160 cm )",
"5 feet 4 inch ( 163 cm )",
"5 feet 5 inch ( 165 cm )",
"5 feet 6 inch ( 168 cm )",
"5 feet 7 inch ( 170 cm )",
"5 feet 8 inch ( 173 cm )",
"5 feet 9 inch ( 175 cm )",
"5 feet 10 inch( 178 cm )",
"5 feet 11 inch( 180 cm )",
"6 feet( 183 cm )",
"6 feet 1 inch ( 185 cm )",
"6 feet 2 inch ( 188 cm )",
"6 feet 3 inch ( 191 cm )",
"6 feet 4 inch ( 193 cm )",
"6 feet 5 inch ( 196 cm )",
"6 feet 6 inch ( 198 cm )",
"6 feet 7 inch ( 201 cm )",
"6 feet 8 inch ( 203 cm )",
"6 feet 9 inch ( 206 cm )",
"6 feet 10 inch( 208 cm )",
"6 feet 11 inch( 211 cm )",
"7 feet ( 213 cm )",
"7 feet 1 inch ( 216 cm )",
"7 feet 2 inch ( 218 cm )"
]
    };

var jsonDataPressure = {
    "pressureList": [
    "Normal",
    "Elevated",
    "Hypertension Stage 1",
    "Hypertension Stage 2",
    "Hypertensive Crisis"
    ]
    };

// Populate the dropdown with options from the JSON data
function populateDropdown(jsonlist, specificlist, selectelement) {
  var defaultOption = document.createElement('option');
  defaultOption.text = "Select an option...";
  defaultOption.value = "";
  selectelement.appendChild(defaultOption);

  for (var i = 0; i < jsonlist[specificlist].length; i++) {
      var option = document.createElement('option');
      option.text = jsonlist[specificlist][i];
      option.value = i;
      selectelement.appendChild(option);
  }

  selectelement.selectedIndex = 0;
}
  
populateDropdown(jsonDataHeight, "heightList", selectElementHeight);
populateDropdown(jsonDataPressure, "pressureList", selectElementPressure);
  
// Add an event listener to get the selected height
  function extractSelection(jsonlist, selectelement, specificlist, callback) {
    selectelement.addEventListener('change', function () {
      var selectedIndex = selectelement.selectedIndex;
      if (selectedIndex >= 0) {
        callback(jsonlist[specificlist][selectedIndex]);
      }
    });
  }
  
var selectedHeight = '';
var selectedPressure = '';
  
extractSelection(jsonDataHeight, selectElementHeight, "heightList", function (height) {
    selectedHeight = height;
// Display height in console.
    console.log("Selected Height: " + height);
  });
  
  extractSelection(jsonDataPressure, selectElementPressure, "pressureList", function (pressure) {
    selectedPressure = pressure;
// Display blood pressure in console.
    console.log("Selected Pressure: " + pressure);
  });

// Get references to the age and weight input fields
var ageInput = document.getElementById('ageInput');
var weightInput = document.getElementById('weightInput');

// Add an event listener to the age input field
ageInput.addEventListener('change', function () {
  var age = ageInput.value;
// Display age in console.
  console.log("Selected Age: " + age);
});

// Add an event listener to the weight input field
weightInput.addEventListener('change', function () {
  var weight = weightInput.value;
// Display weight in console.
  console.log("Selected Weight: " + weight + " lbs");
});

// Get references to the checkboxes
var alzheimersCheckbox = document.getElementById('alzheimersCheckbox');
var cancerCheckbox = document.getElementById('cancerCheckbox');
var diabetesCheckbox = document.getElementById('diabetesCheckbox');

// Add event listeners to the checkboxes
alzheimersCheckbox.addEventListener('change', function () {
  var hasAlzheimers = alzheimersCheckbox.checked;
  console.log("Family has Alzheimer's: " + hasAlzheimers);
});

cancerCheckbox.addEventListener('change', function () {
  var hasCancer = cancerCheckbox.checked;
  console.log("Family has Cancer: " + hasCancer);
});

diabetesCheckbox.addEventListener('change', function () {
  var hasDiabetes = diabetesCheckbox.checked;
  console.log("Family has Diabetes: " + hasDiabetes);
});

// Sends to the azure function

function sendDataToAzure(data) {
  const azureURL = "https://insurance-calculations-api.azurewebsites.net/api/healthcalc"; 

  fetch(azureURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Success", data);
    // Display the returned data in the results div
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
      Age Points: ${data.agePoints}<br>
      BMI: ${data.bmi}<br>
      BMI Points: ${data.bmiPoints}<br>
      Blood Pressure: ${data.bloodPressure}<br>
      Family Points: ${data.familyPoints}<br>
      Risk Status: ${data.riskStatus}<br>
    `;
  })
  .catch((error) => {
    console.log("error",error);
  });
}

// function for the submit button that sends the data in json?
var submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', function(event) {
  var age = ageInput.value;
  var weight = weightInput.value;
  var hasAlzheimers = alzheimersCheckbox.checked;
  var hasCancer = cancerCheckbox.checked;
  var hasDiabetes = diabetesCheckbox.checked;
  if(selectedPressure === "Hypertension Stage 1") {
    selectedPressure = "stage 1";
} else if(selectedPressure === "Hypertension Stage 2") {
    selectedPressure = "stage 2";
} else if(selectedPressure === "Hypertensive Crisis") {
    selectedPressure = "crisis";
} else {
    selectedPressure = selectedPressure.toLowerCase();
}

  var jsonData = {
    "customerAge": parseInt(age),
    "customerWeight": parseFloat(weight),
    "customerHeight": parseFloat(selectedHeight.match(/(\d+) cm/)[1]) / 100,
    "bloodPressure": selectedPressure,
    "alzheimers": hasAlzheimers,
    "cancer": hasCancer,
    "diabetes": hasDiabetes
    };
  console.log(jsonData);
  
  //sends above data to azure function
  sendDataToAzure(jsonData);

  event.preventDefault();
});



