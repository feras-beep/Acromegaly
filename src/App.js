import "./App.css";
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const App = () => {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    chartInstance.current = new Chart(chartContainer.current, {
      type: "bar",
      data: {
        labels: ["Class 1", "Class 2", "Class 3"],
        datasets: [
          {
            label: "Predicted Cure Rate",
            data: [68, 38, 0],
            backgroundColor: ["#8bc34a", "#ffc107", "#ff0000"],
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Cure Rate (%)",
            },
            grid: {
              drawBorder: false,
              color: ["#dcdcdc"],
            },
            ticks: {
              color: "#666",
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
        layout: {
          padding: {
            top: 40,
          },
        },
        interaction: {
          intersect: false,
        },
        elements: {
          bar: {
            borderWidth: 1,
          },
          line: {
            borderWidth: 2,
            borderColor: "#ff0000",
          },
        },
      },
    });
  }, []);

  const getClassification = (miRatio) => {
    if (miRatio < 0.58) {
      return "Class 1";
    } else if (miRatio < 1) {
      return "Class 2";
    } else {
      return "Class 3";
    }
  };

  const getCureRate = (classification) => {
    if (classification === "Class 1") {
      return 68;
    } else if (classification === "Class 2") {
      return 38;
    } else if (classification === "Class 3") {
      return 0;
    } else {
      return 0;
    }
  };

  const calculate = () => {
    const midlineInput = document.getElementById("midline-input");
    const icaInput = document.getElementById("ica-input");
    const cureRateInput = document.getElementById("cure-rate-input");
    const miInput = document.getElementById("mi-input");
    const classInput = document.getElementById("class-input");

    const midline = parseFloat(midlineInput.value);
    const icaDistance = parseFloat(icaInput.value);

    // Calculate the M/I Ratio
    const miRatio = midline / icaDistance;

    const classification = getClassification(miRatio);
    const cureRate = getCureRate(classification);
    cureRateInput.value = `${cureRate}%`;
    miInput.value = miRatio.toFixed(2);
    classInput.value = classification;

    // Update chart data for cure rates
    const classLabels = ["Class 1", "Class 2", "Class 3"];
    const cureRates = classLabels.map((label) => {
      const classCureRate = getCureRate(label);
      return classification === label ? classCureRate : NaN;
    });

    chartInstance.current.data.labels = classLabels;
    chartInstance.current.data.datasets[0].data = cureRates;

    chartInstance.current.update();
  };

  return (
    <div>
      <h1 className="title">Acromegaly Classification</h1>
      <div className="input-container">
        <label htmlFor="midline-input">Midline:</label>
        <input type="number" id="midline-input" />
      </div>
      <div className="input-container">
        <label htmlFor="ica-input">ICA Distance:</label>
        <input type="number" id="ica-input" />
      </div>
      <button className="calculate-button" onClick={calculate}>
        Calculate
      </button>
      <div className="result-container">
        <label htmlFor="cure-rate-input">Predicted Cure Rate:</label>
        <input type="text" id="cure-rate-input" readOnly />
      </div>
      <div className="result-container">
        <label htmlFor="mi-input">M/I Ratio:</label>
        <input type="text" id="mi-input" readOnly />
      </div>
      <div className="result-container">
        <label htmlFor="class-input">Class:</label>
        <input type="text" id="class-input" readOnly />
      </div>
      <div className="chart-container">
        <canvas ref={chartContainer} />
        <div className="chart-key">
          <span className="key-item">
            <span className="key-class1"></span>Class 1
          </span>
          <span className="key-item">
            <span className="key-class2"></span>Class 2
          </span>
          <span className="key-item">
            <span className="key-class3"></span>Class 3
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;


