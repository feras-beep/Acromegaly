// main.js
function calculate() {
  // Get the input values
  var midlineDistance = parseFloat(document.getElementById("midline-distance").value);
  var icaDistance = parseFloat(document.getElementById("ica-distance").value);

  // Perform the calculation
  var miRatio = midlineDistance / icaDistance;

  // Display the result
  var resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "M/I: " + miRatio.toFixed(2);
// main.js
function calculate() {
  // Get the input values
  var midlineDistance = parseFloat(document.getElementById("midline-distance").value);
  var icaDistance = parseFloat(document.getElementById("ica-distance").value);

  // Perform the calculation
  var miRatio = midlineDistance / icaDistance;

  // Display the result
  var resultContainer = document.getElementById("result-container");
  resultContainer.innerHTML = "M/I: " + miRatio.toFixed(2);

  // Plot the graph
  var graphContainer = document.getElementById("graph-container");

  // Prepare data for the graph
  var data = {
    labels: ["M/I"],
    datasets: [
      {
        label: "Cure Rate Prediction",
        data: [miRatio],
        backgroundColor: [
          miRatio < 0.58 ? "rgba(255, 99, 132, 0.2)" : miRatio < 1 ? "rgba(54, 162, 235, 0.2)" : "rgba(75, 192, 192, 0.2)"
        ],
        borderColor: [
          miRatio < 0.58 ? "rgba(255, 99, 132, 1)" : miRatio < 1 ? "rgba(54, 162, 235, 1)" : "rgba(75, 192, 192, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configure the chart options
  var options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 2,
      },
    },
  };

  // Create the line chart
  new Chart(graphContainer, {
    type: "bar", // Change the chart type to 'bar' for distinct sections
    data: data,
    options: options,
  });
}
}