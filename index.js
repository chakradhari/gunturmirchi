var sannamObj = [];
var tejaObj = [];
var byadgiObj = [];
var threeFourtyOneobj = [];
var no5Obj = [];
var devanurObj = [];

function makeApiCall() {
	var params = {
		spreadsheetId: "1dwhlEIQ_H0NcAIT-SSg1sM_ZpsT2KZNUvc2fqWI9lYU",
		API_KEY: "AIzaSyBshQgbcousVir0__rUic0Bj1Ei6XYuKrE",
		majorDimension: "COLUMNS"
	};

	var request = fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${
		params.spreadsheetId
	}/values:batchGet?ranges=Daily%20Snapshot&ranges=Consolidated%20Prices&majorDimension=${
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
			},
			function(reason) {
				console.error("error: " + reason.error.message);
			}
		);
}

function makeApiCallForCharts() {
	var params = {
		spreadsheetId: "1dwhlEIQ_H0NcAIT-SSg1sM_ZpsT2KZNUvc2fqWI9lYU",
		API_KEY: "AIzaSyBshQgbcousVir0__rUic0Bj1Ei6XYuKrE",
		majorDimension: "ROWS",
		range: 'Consolidated Prices'
	};

	// `https://sheets.googleapis.com/v4/spreadsheets/${params.spreadsheetId}/values/${param.range}`
	var request = fetch(`https://content-sheets.googleapis.com/v4/spreadsheets/${
		params.spreadsheetId
	}/values:batchGet?ranges=Consolidated%20Prices&majorDimension=${
		params.majorDimension
	}&key=${params.API_KEY}
  `);
	request
		.then(function(response) {
			return response.json();
		})
		.then(
			function(response) {
				var consolidatedPrices = response.valueRanges[0].values;
				for(var i=1; i<=6; i++) {

					var dateInfo = '';	
					var tejaIndividual = [], sannamIndividual = [], byadgiIndividual = [], threeFourtyOneIndividual = [], no5Individual = [], devanurIndividual = [];
					var tejaBuffer = 1, sannamBuffer = 1, byadgiBuffer = 1, threeFourtyOneBuffer = 1, no5Buffer = 1, devanurBuffer = 1;
					
					consolidatedPrices[consolidatedPrices.length - i].forEach(function(val, i) {
						
						// For getting the date
						if(i == 0) {
							dataInfo = val;
						}

						// Teja Logic
						if(i == 1 || (i>1 && i < 5)) {
							tejaIndividual.push(val);
							tejaBuffer++;
						}

						if(tejaBuffer == 5) {
							tejaIndividual.unshift(dataInfo);
							tejaObj.unshift(tejaIndividual);
							tejaBuffer = 1;
						}

						// Sannam Logic
						if(i == 5 || (i > 5 && i < 9)) {
							sannamIndividual.push(val);
							sannamBuffer++;
						}

						if(sannamBuffer == 5) {
							sannamIndividual.unshift(dataInfo);
							sannamObj.unshift(sannamIndividual);
							sannamBuffer = 1
						}

						// Byadgi Logic
						if(i == 9 || (i > 9 && i < 13)) {
							byadgiIndividual.push(val);
							byadgiBuffer++;
						}

						if(byadgiBuffer == 5) {
							byadgiIndividual.unshift(dataInfo);
							byadgiObj.unshift(byadgiIndividual);
							byadgiBuffer = 1;
						}

						// 341 Logic
						if(i == 13 || (i > 13 && i < 17)) {
							threeFourtyOneIndividual.push(val);
							threeFourtyOneBuffer++;
						}

						if(threeFourtyOneBuffer == 5) {
							threeFourtyOneIndividual.unshift(dataInfo);
							threeFourtyOneobj.unshift(threeFourtyOneIndividual);
							threeFourtyOneBuffer = 1;
						}

						// No 5 Logic
						if(i == 17 || (i > 17 && i < 21)) {
							no5Individual.push(val);
							no5Buffer++;
						}

						if(no5Buffer == 5) {
							no5Individual.unshift(dataInfo);
							no5Obj.unshift(no5Individual);
							no5Buffer = 1;
						}

						// Devanur Logic
						if(i == 21 || (i > 21 && i < 25)) {
							devanurIndividual.push(val);
							devanurBuffer++;
						}

						if(devanurBuffer == 5) {
							devanurIndividual.unshift(dataInfo);
							devanurObj.unshift(devanurIndividual);
							devanurBuffer = 1;
						}

					})
				}

				console.log(tejaObj);
				initializeChart();
			},
			function(reason) {
				console.error("error: " + reason.error.message);
			}
		);
}

function updateDailyArrivalsIndividualFields(fields) {
	var dateArray = fields[0];

	var index = dateArray.length - 1;

	// for (let i = 1; i < dateArray.length; i++) {
	// 	if (
	// 		new Date().setHours(0, 0, 0, 0) ==
	// 		new Date(dateArray[i]).setHours(0, 0, 0, 0)
	// 	) {
	// 		index = i;
	// 	}
	// }
	document.getElementById('dateOfFlow').innerHTML = `Prices on Date: ${dateArray[index]}`
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

	var index = dateArray.length - 1;

	// for (let i = 1; i < dateArray.length; i++) {
	// 	if (
	// 		new Date().setHours(0, 0, 0, 0) ==
	// 		new Date(dateArray[i]).setHours(0, 0, 0, 0)
	// 	) {
	// 		index = i;
	// 	}
	// }

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
    	if(i == 0) {
      	arr.push(val);
        return;
      }
      arr.push(parseInt(val));
    });
    modifiedArray.push(arr);
  })
	

	return modifiedArray;
}

function drawCharts() {
	drawChart(sannamObj, "334/Sannam Chart", "sannam_graph");
	drawChart(tejaObj, "Teja Chart", "teja_graph");
	drawChart(byadgiObj, "Byadgi Chart", "byadgi_graph");
	drawChart(threeFourtyOneobj, "341 Chart", "341_graph");
	drawChart(no5Obj, "No 5 Chart", "no5_graph");
	drawChart(devanurObj, "Devanur Chart", "denvar");
}

function drawChart(fields, title, id) {
	// Create the data table.
	var getUpdatedInfo = getModifiedArray(fields);
	var data = google.visualization.arrayToDataTable(getUpdatedInfo);

	var options = {
		title: title + 'Price Chart',
		legend: {
			position: "bottom"
		},
		backgroundColor: '#f3f3f3',
		width: "800",
		height: "450",
		vAxis: {
			ticks: [0, 2500, 5000, 7500, 10000, 12500]
		},
		lineSmoothing: false,
		focusTarget: 'category'
	};

	// Instantiate and draw our chart, passing in some options.
	var chart = new google.visualization.LineChart(document.getElementById(id));
	chart.draw(data, options);
}


/**
 * 
 * Older Logic as of date July 9th, 2019
 * 
 * function makeApiCall() {
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
				var consolidatedPrices = response.valueRanges[1].values;
				console.log(consolidatedPrices);
				for(var i=1; i<=6; i++) {

					var dateInfo = '';	
					var tejaIndividual, sannamIndividual, byadgiIndividual, threeFourtyOneIndividual, no5Individual, devanurIndividual = [];
					var tejaBuffer, sannamBuffer, byadgiBuffer, threeFourtyOneBuffer, no5Buffer, devanurBuffer = 1;
					
					consolidatedPrices[consolidatedPrices.length - i].forEach(function(val, i) {
						
						// For getting the date
						if(i == 0) {
							dataInfo = consolidatedPrices[0];
						}

						// Teja Logic
						if(i == 1 || (i>1 && i < 5)) {
							tejaIndividual.push(val);
							tejaBuffer++;
						}

						if(tejaBuffer == 5) {
							tejaIndividual.unshift(dataInfo);
							tejaObj.unshift(tejaIndividual);
						}

						// Sannam Logic
						if(i == 5 || (i > 5 && i < 9)) {
							sannamIndividual.push(val);
							sannamBuffer++;
						}

						if(sannamBuffer == 5) {
							sannamIndividual.unshift(dataInfo);
							sannamObj.unshift(sannamIndividual);
						}

						// Byadgi Logic
						if(i == 9 || (i > 9 && i < 13)) {
							byadgiIndividual.push(val);
							byadgiBuffer++;
						}

						if(byadgiBuffer == 5) {
							byadgiIndividual.unshift(dataInfo);
							byadgiObj.unshift(byadgiIndividual);
						}

						// 341 Logic
						if(i == 13 || (i > 13 && i < 17)) {
							threeFourtyOneIndividual.push(val);
							threeFourtyOneBuffer++;
						}

						if(threeFourtyOneBuffer == 5) {
							threeFourtyOneIndividual.unshift(dataInfo);
							threeFourtyOneobj.unshift(threeFourtyOneIndividual);
						}

						// No 5 Logic
						if(i == 17 || (i > 17 && i < 21)) {
							no5Individual.push(val);
							no5Buffer++;
						}

						if(no5Buffer == 5) {
							no5Individual.unshift(dataInfo);
							no5Obj.unshift(no5Individual);
						}

						// Devanur Logic
						if(i == 21 || (i > 21 && i < 25)) {
							devanurIndividual.push(val);
							devanurBuffer++;
						}

						if(devanurBuffer == 5) {
							devanurIndividual.unshift(dataInfo);
							devanurObj.unshift(devanurIndividual);
						}

					})
				}

				console.log(sannamObj);
				console.log(tejaObj);
				console.log(byadgiObj);
				
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
 */


 /**
	* 

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
  */