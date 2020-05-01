var sannamObj = [];
var tejaObj = [];
var byadgiObj = [];
var threeFourtyOneobj = [];
var no5Obj = [];
var devanurObj = [];
var rowsToDisplay = 6;
var USDRate = 0;
var rootArray = [];
var rootArrayForCharts = [];

function getUSDRate() {
  var params = {
    API_KEY: "fa936138ca2f3fa679d8",
    compact: "ultra",
    q: "USD_INR"
  };

  var request = fetch(
    `http://free.currencyconverterapi.com/api/v5/convert?q=${params.q}&compact=${params.compact}&apiKey=${params.API_KEY}`
  );

  request
    .then(function(response) {
      return response.json();
    })
    .then(function(responseJson) {
      USDRate = responseJson.USD_INR;
    });
}

getUSDRate();

function makeApiCall() {
  var params = {
    spreadsheetId: "1dwhlEIQ_H0NcAIT-SSg1sM_ZpsT2KZNUvc2fqWI9lYU",
    API_KEY: "AIzaSyBshQgbcousVir0__rUic0Bj1Ei6XYuKrE",
    majorDimension: "COLUMNS"
  };

  var request = fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values:batchGet?ranges=Daily%20Snapshot&ranges=Consolidated%20Prices&majorDimension=${params.majorDimension}&key=${params.API_KEY}
  `);
  request
    .then(function(response) {
      return response.json();
    })
    .then(
      function(response) {
        rootArray = response.valueRanges[1].values.slice();
        var tailoredArray = [];
        tailoredArray = response.valueRanges[1].values.slice(25, 73);
        tailoredArray.unshift(response.valueRanges[1].values[0]);
        updateDailyInFlow(response.valueRanges[0].values);
        updateDailyArrivalsIndividualFields(
          response.valueRanges[1].values.slice(0, 25)
        );
        updateDailyArrivalsIndividualFieldsStemBasis(tailoredArray);
      },
      function(reason) {
        console.error("error: " + reason.error.message);
      }
    );
}

function prepareChartInfo(rowsInput, inputGraphKey) {
  var rows = rowsInput ? rowsInput : rowsToDisplay;
  var consolidatedPrices = rootArrayForCharts.slice();
  for (var i = 1; i <= rows; i++) {
    var dateInfo = "";
    var tejaIndividual = [],
      sannamIndividual = [],
      byadgiIndividual = [],
      threeFourtyOneIndividual = [],
      no5Individual = [],
      devanurIndividual = [];
    var tejaBuffer = 1,
      sannamBuffer = 1,
      byadgiBuffer = 1,
      threeFourtyOneBuffer = 1,
      no5Buffer = 1,
      devanurBuffer = 1;

    consolidatedPrices[consolidatedPrices.length - i].forEach(function(val, i) {
      // For getting the date
      if (i == 0) {
        dataInfo = val;
      }

      // Teja Logic
      if (i == 1 || (i > 1 && i < 5)) {
        tejaIndividual.push(val);
        tejaBuffer++;
      }

      if (tejaBuffer == 5) {
        tejaIndividual.unshift(dataInfo);
        tejaObj.unshift(tejaIndividual);
        tejaBuffer = 1;
      }

      // Sannam Logic
      if (i == 5 || (i > 5 && i < 9)) {
        sannamIndividual.push(val);
        sannamBuffer++;
      }

      if (sannamBuffer == 5) {
        sannamIndividual.unshift(dataInfo);
        sannamObj.unshift(sannamIndividual);
        sannamBuffer = 1;
      }

      // Byadgi Logic
      if (i == 9 || (i > 9 && i < 13)) {
        byadgiIndividual.push(val);
        byadgiBuffer++;
      }

      if (byadgiBuffer == 5) {
        byadgiIndividual.unshift(dataInfo);
        byadgiObj.unshift(byadgiIndividual);
        byadgiBuffer = 1;
      }

      // 341 Logic
      if (i == 13 || (i > 13 && i < 17)) {
        threeFourtyOneIndividual.push(val);
        threeFourtyOneBuffer++;
      }

      if (threeFourtyOneBuffer == 5) {
        threeFourtyOneIndividual.unshift(dataInfo);
        threeFourtyOneobj.unshift(threeFourtyOneIndividual);
        threeFourtyOneBuffer = 1;
      }

      // No 5 Logic
      if (i == 17 || (i > 17 && i < 21)) {
        no5Individual.push(val);
        no5Buffer++;
      }

      if (no5Buffer == 5) {
        no5Individual.unshift(dataInfo);
        no5Obj.unshift(no5Individual);
        no5Buffer = 1;
      }

      // Devanur Logic
      if (i == 21 || (i > 21 && i < 25)) {
        devanurIndividual.push(val);
        devanurBuffer++;
      }

      if (devanurBuffer == 5) {
        devanurIndividual.unshift(dataInfo);
        devanurObj.unshift(devanurIndividual);
        devanurBuffer = 1;
      }
    });
  }

  if (inputGraphKey) {
    if (inputGraphKey === "sannam") {
      drawChart(sannamObj, "334 S4/Sannam", "sannam_graph", inputGraphKey);
    }
    if (inputGraphKey === "teja") {
      drawChart(tejaObj, "Teja S17", "teja_graph", inputGraphKey);
    }
    if (inputGraphKey === "byadgi") {
      drawChart(byadgiObj, "Byadgi", "byadgi_graph", inputGraphKey);
    }
    if (inputGraphKey === "341") {
      drawChart(threeFourtyOneobj, "341", "341_graph", inputGraphKey);
    }
    if (inputGraphKey === "no5") {
      drawChart(no5Obj, "No 5", "no5_graph", inputGraphKey);
    }
    if (inputGraphKey === "dd") {
      drawChart(devanurObj, "Devanur Deluxe DD", "denvar", inputGraphKey);
    }
  } else {
    initializeChart();
  }
}

function makeApiCallForCharts(val) {
  var rows = val ? val : rowsToDisplay;
  var params = {
    spreadsheetId: "1dwhlEIQ_H0NcAIT-SSg1sM_ZpsT2KZNUvc2fqWI9lYU",
    API_KEY: "AIzaSyBshQgbcousVir0__rUic0Bj1Ei6XYuKrE",
    majorDimension: "ROWS",
    range: "Consolidated Prices"
  };

  var request = fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values:batchGet?ranges=Consolidated%20Prices&majorDimension=${params.majorDimension}&key=${params.API_KEY}
  `);
  request
    .then(function(response) {
      return response.json();
    })
    .then(
      function(response) {
        rootArrayForCharts = response.valueRanges[0].values;
        prepareChartInfo();
      },
      function(reason) {
        console.error("error: " + reason.error.message);
      }
    );
}

function updateDailyArrivalsIndividualFieldsStemBasis(fields) {
  var dateArray = fields[0].slice();

  var index = dateArray.length - 1;

  var table = document.getElementById("dailyRatesTable1");

  document.getElementById(
    "dateOfFlow1"
  ).innerHTML = `Our Offer prices on Date: ${dateArray[index]}`;

  var tailoredData = fields.slice();

  if (index) {
    var cellBuffer = 1;
    var rowBuffer = 1;

    tailoredData.forEach((value, i) => {
      if (i == 0) {
        return;
      }

      value.forEach((val, i) => {
        if (rowBuffer == 9) {
          rowBuffer = 1;
          cellBuffer++;
        }
        if (i == index) {
          table.rows[rowBuffer].cells[cellBuffer].innerHTML = val;
          rowBuffer++;
        }
      });
    });
  }
}

function updateDailyArrivalsIndividualFields(fields) {
  var dateArray = fields[0].slice();

  var index = dateArray.length - 1;

  document.getElementById(
    "dateOfFlow"
  ).innerHTML = `Farmer Prices per quintal on Date: ${dateArray[index]}`;

  var table = document.getElementById("dailyRatesTable");
  if (index) {
    var cellBuffer = 1;
    var rowBuffer = 1;

    var tailoredData = fields.slice();

    tailoredData.forEach((value, i) => {
      if (i == 0) {
        return;
      }

      value.forEach((val, i) => {
        if (rowBuffer == 5) {
          rowBuffer = 1;
          cellBuffer++;
        }
        if (i == index) {
          table.rows[rowBuffer].cells[cellBuffer].innerHTML = val;
          rowBuffer++;
        }
      });
    });
  }
}

function updateDailyInFlow(fields) {
  var dateArray = fields[0];

  var index = dateArray.length - 1;

  var table = document.getElementById("OverAllInFlow");
  if (index) {
    var rowBuffer = 0;
    fields.forEach((value, i) => {
      value.forEach((val, i) => {
        if (i == index) {
          table.rows[rowBuffer].cells[1].innerHTML = val;
          rowBuffer++;
        }
      });
    });
  }
}

function initializeChart() {
  google.charts.load("current", { packages: ["corechart"] });
  google.charts.setOnLoadCallback(drawCharts);
}

function getModifiedArray(fields) {
  var values = fields;

  var modifiedArray = [];
  modifiedArray.push(["Date", "Medium", "Medium Best", "Best", "Deluxe"]);

  var arr = [];

  values.forEach(function(value, index) {
    var arr = [];
    value.forEach(function(val, i) {
      if (i == 0) {
        arr.push(val);
        return;
      }
      arr.push(parseInt(val));
    });
    modifiedArray.push(arr);
  });

  return modifiedArray;
}

function drawCharts() {
  drawChart(sannamObj, "334 S4/Sannam", "sannam_graph");
  drawChart(tejaObj, "Teja S17", "teja_graph");
  drawChart(byadgiObj, "Byadgi", "byadgi_graph");
  drawChart(threeFourtyOneobj, "341", "341_graph");
  drawChart(no5Obj, "No 5", "no5_graph");
  drawChart(devanurObj, "Devanur Deluxe DD", "denvar");
}

function drawChart(fields, title, id, objectToModify) {
  // Create the data table.
  var slicedField = fields.slice();
  var getUpdatedInfo = getModifiedArray(slicedField);
  var data = google.visualization.arrayToDataTable(getUpdatedInfo);

  var options = {
    title: title + " Dried Red Chilli Farmer Live Rates",
    legend: {
      position: "bottom"
    },
    backgroundColor: "#f3f3f3",
    width: "800",
    height: "450",
    vAxis: {
      ticks: [5000, 7500, 10000, 12500, 15000, 17000, 20000]
    },
    lineSmoothing: false,
    focusTarget: "category"
  };

  var chart = new google.visualization.LineChart(document.getElementById(id));
  chart.draw(data, options);

  if (objectToModify) {
    if (objectToModify === "sannam") sannamObj = [];
    if (objectToModify === "teja") tejaObj = [];
    if (objectToModify === "341") threeFourtyOneobj = [];
    if (objectToModify === "no5") no5Obj = [];
    if (objectToModify === "byadgi") byadgiObj = [];
    if (objectToModify === "dd") devanurObj = [];
  } else {
    setTimeout(function() {
      sannamObj = [];
      tejaObj = [];
      byadgiObj = [];
      threeFourtyOneobj = [];
      no5Obj = [];
      devanurObj = [];
    }, 1000);
  }
}

function convertUSD(farmerValues) {
  var farmersArrayConverted = [];

  farmerValues.forEach(function(value, index) {
    var arr = [];

    if (index == 0) {
      farmersArrayConverted.push(value);
      return;
    }

    value.forEach(function(childValue, childIndex) {
      if (childIndex == 0) {
        arr.push(childValue);
        return;
      }

      arr.push(Math.ceil(childValue / USDRate));
    });

    farmersArrayConverted.push(arr);
  });

  return farmersArrayConverted;
}

function modifyFarmerTableToUSD(farmerValues) {
  updateDailyArrivalsIndividualFields(convertUSD(farmerValues));
}

function modifiedOfferTableToUSD(offerValues) {
  updateDailyArrivalsIndividualFieldsStemBasis(convertUSD(offerValues));
}

var farmerClicked = false;

var offerClicked = false;

var currentCurrencyForFarmer = "INR";

var currentCurrencyForoffer = "INR";

var farmerButton = document.getElementById("FarmerRateConverterButton");

var offerButton = document.getElementById("OfferRateConverterButton");

var modifyArrayForUSDRates = [];
function modifyRatesToUSD(incomingBuffer) {
  var modifiedArray = [];
  var arrayToBeShipped = [];
  var rootArrayDummy = rootArray.slice();

  if (!farmerClicked || !offerClicked) {
    rootArrayDummy.forEach(function(individualArray, i) {
      var arr = [];

      if (i == 0) {
        modifiedArray.push(individualArray);
        return;
      }

      individualArray.forEach(function(val, childIndex) {
        if (childIndex == 0) {
          arr.push(val);
        } else {
          arr.push(parseInt(val));
        }
      });

      modifiedArray.push(arr);
    });
    modifyArrayForUSDRates = modifiedArray.slice();
  }

  if (incomingBuffer == "farmer") {
    if (!farmerClicked || currentCurrencyForFarmer !== "USD") {
      modifyFarmerTableToUSD(modifyArrayForUSDRates.slice(0, 25));
      farmerClicked = true;
      currentCurrencyForFarmer = "USD";
      farmerButton.innerText = "Convert to INR";
    } else {
      updateDailyArrivalsIndividualFields(rootArray.slice(0, 25));
      currentCurrencyForFarmer = "INR";
      farmerButton.innerText = "Convert to USD";
    }
  }
  if (incomingBuffer == "offer") {
    if (!offerClicked || currentCurrencyForoffer !== "USD") {
      var tailoredArray = [];
      tailoredArray = modifyArrayForUSDRates.slice(25, 73);
      tailoredArray.unshift(modifyArrayForUSDRates[0]);
      modifiedOfferTableToUSD(tailoredArray.slice());
      offerClicked = true;
      currentCurrencyForoffer = "USD";
      offerButton.innerText = "Convert to INR";
    } else {
      var tailoredArrayforINR = [];
      var rootArrayForTemp = rootArray.slice();
      tailoredArrayforINR = rootArrayForTemp.slice(25, 73);
      tailoredArrayforINR.unshift(rootArrayForTemp.slice(0, 1)[0]);
      updateDailyArrivalsIndividualFieldsStemBasis(tailoredArrayforINR);
      currentCurrencyForoffer = "INR";
      offerButton.innerText = "Convert to USD";
    }
  }
}
