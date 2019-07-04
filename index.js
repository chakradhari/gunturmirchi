var sannamObj = {};
var tejaObj = {};
var byadgiObj = {};
var threeFourtyOneobj = {};
var no5Obj = {};
var devanurObj = {};

function makeApiCall() {
	var params = {
		// The ID of the spreadsheet to retrieve data from.
		spreadsheetId: "1dwhlEIQ_H0NcAIT-SSg1sM_ZpsT2KZNUvc2fqWI9lYU", // TODO: Update placeholder value.

		API_KEY: "AIzaSyBshQgbcousVir0__rUic0Bj1Ei6XYuKrE",
		// The A1 notation of the values to retrieve.
		ranges: [
			"Daily Snapshot",
			"Consolidated Prices",
			"334/Sannam",
			"Teja",
			"Byadgi",
			"341",
			"No 5",
			"Devanur Deluxe"
		],
		majorDimension: "COLUMNS"
	};

	var request = fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${
		params.spreadsheetId
	}/values:batchGet?ranges=Daily%20Snapshot&ranges=Consolidated%20Prices&ranges=334%2FSannam&ranges=Teja&ranges=Byadgi&ranges=341&ranges=No%205&ranges=Devanur%20Deluxe&majorDimension=${
		params.majorDimension
	}&key=${params.API_KEY}
  `);
	request
		.then(function(response) {
			return response.json();
		})
		.then(
			function(response) {
				updateDailyInFlow(response.valueRanges[0].values);
				updateDailyArrivalsIndividualFields(response.valueRanges[1].values);
				sannamObj = response.valueRanges[2];
				tejaObj = response.valueRanges[3];
				byadgiObj = response.valueRanges[4];
				threeFourtyOneobj = response.valueRanges[5];
				no5Obj = response.valueRanges[6];
				devanurObj = response.valueRanges[7];
				initializeChart();
			},
			function(reason) {
				console.error("error: " + reason.error.message);
			}
		);
}

function updateDailyArrivalsIndividualFields(fields) {
	var dateArray = fields[0];

	var index = 0;

	for (let i = 1; i < dateArray.length; i++) {
		if (
			new Date().setHours(0, 0, 0, 0) ==
			new Date(dateArray[i]).setHours(0, 0, 0, 0)
		) {
			index = i;
		}
	}

	var table = document.getElementById("dailyRatesTable");
	if (index) {
		var cellBuffer = 1;
		var rowBuffer = 1;
		fields.forEach((value, i) => {
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

	var index = 0;

	for (let i = 1; i < dateArray.length; i++) {
		if (
			new Date().setHours(0, 0, 0, 0) ==
			new Date(dateArray[i]).setHours(0, 0, 0, 0)
		) {
			index = i;
		}
	}

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
	var buffer = 1;

	for (var i = 1; i < values[0].length; i++) {
		var arr = [];

		values.forEach(function(value, index) {
			if (index == 0) {
				arr.push(value[buffer]);
				return;
			}
			arr.push(parseInt(value[buffer]));
		});

		buffer++;
		modifiedArray.push(arr);
	}

	return modifiedArray;
}

function drawCharts() {
	drawChart(sannamObj.values, "334/Sannam Chart", "sannam_graph");
	drawChart(tejaObj.values, "Teja Chart", "teja_graph");
	drawChart(byadgiObj.values, "Byadgi Chart", "byadgi_graph");
	drawChart(threeFourtyOneobj.values, "341 Chart", "341_graph");
	drawChart(no5Obj.values, "No 5 Chart", "no5_graph");
	drawChart(devanurObj.values, "Devanur Chart", "denvar");
}

function drawChart(fields, title, id) {
	// Create the data table.
	var getUpdatedInfo = getModifiedArray(fields);
	var data = google.visualization.arrayToDataTable(getUpdatedInfo);

	var options = {
		title: title,
		curveType: "function",
		legend: {
			position: "bottom"
		},
		width: "800",
		height: "450"
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.LineChart(document.getElementById(id));
	chart.draw(data, options);
}
