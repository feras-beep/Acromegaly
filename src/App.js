import React, { useRef, useEffect } from 'react';
import './App.css';

import 'chartjs-adapter-moment';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarController,
  BarElement,
  LineController,
  Tooltip,
} from 'chart.js';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarController,
  BarElement,
  LineController,
  Tooltip
);


const App = () => {
  const chartContainer = useRef(null);
  const lineChartContainer = useRef(null);
  const chartInstance = useRef(null);
  const chartLineInstance = useRef(null);

  useEffect(() => {
    Chart.defaults.font.family = "'Roboto', sans-serif";
    Chart.defaults.font.weight = 'normal';
    Chart.defaults.font.size = 12;

    chartInstance.current = new Chart(chartContainer.current, {
      type: 'bar',
      data: {
        labels: ['Class 1', 'Class 2', 'Class 3'],
        datasets: [
          {
            label: 'Cure Rate (%)',
            data: [68, 38, 0],
            backgroundColor: ['#8bc34a', '#ffc107', 'rgba(255, 0, 0, 0.8)'],
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
              text: 'Cure Rate (%)',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Cure Rates by Class',
            position: 'top',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    });

    const lineGraphData = [];
    for (let i = 0; i <= 40; i++) {
      const miRatio = i * 0.05;
      const cureRateRatio = 0.93 + miRatio * -0.49;
      lineGraphData.push({ x: miRatio, y: cureRateRatio });
    }

    chartLineInstance.current = new Chart(lineChartContainer.current, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Cure Rate ratio',
            data: lineGraphData,
            borderColor: 'rgba(0, 0, 255, 1)',
            backgroundColor: 'rgba(0, 0, 255, 0.2)',
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            min: 0,
            max: 2.0,
            title: {
              display: true,
              text: 'M/I Ratio',
            },
          },
          y: {
            min: 0,
            max: 1,
            title: {
              display: true,
              text: 'Cure Rate (%)',
            },
          },
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || '';
                if (label) {
                  return `${label}: ${context.formattedValue}`;
                }
                return context.formattedValue;
              },
            },
          },
          title: {
            display: true,
            text: 'Cure Rates by Ratio',
            position: 'top',
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    });
  }, []);

  const calculate = () => {
    const midlineInput = document.getElementById('midline-input');
    const icaInput = document.getElementById('ica-input');
    const miRatioOutput = document.getElementById('mi-ratio-output');
    const cureRateRatioOutput = document.getElementById('cure-rate-ratio-output');
    const classClassificationOutput = document.getElementById('class-classification-output');
    const cureRateOutput = document.getElementById('cure-rate-output');

    const midline = parseFloat(midlineInput.value);
    const icaDistance = parseFloat(icaInput.value);

    // Calculate the M/I Ratio
    const miRatio = midline / icaDistance;

    // Update the M/I Ratio textbox
    miRatioOutput.value = miRatio.toFixed(2);

    // Calculate the Cure Rate by Ratio
    const cureRateRatio = 0.93 + miRatio * -0.49;

    // Ensure the Cure Rate is not below 0
    const cureRate = cureRateRatio < 0 ? 0 : cureRateRatio;

    // Update the Cure Rate Ratio textbox
    cureRateRatioOutput.value = cureRate.toFixed(2);

    // Classify the M/I Ratio into a Class
    let classClassification;
    if (miRatio <= 0.58) {
      classClassification = 'Class 1';
    } else if (miRatio < 1) {
      classClassification = 'Class 2';
    } else {
      classClassification = 'Class 3';
    }

    // Update the Class Classification textbox
    classClassificationOutput.value = classClassification;

    // Update the Cure Rate textbox with cure rate by class
    const cureRates = [68, 38, 0];
    let cureRateByClass;
    if (classClassification === 'Class 1') {
      cureRateByClass = cureRates[0];
    } else if (classClassification === 'Class 2') {
      cureRateByClass = cureRates[1];
    } else {
      cureRateByClass = cureRates[2];
    }
    cureRateOutput.value = cureRateByClass.toFixed(2);

    
    chartInstance.current.data.datasets[0].data = cureRates;
    chartInstance.current.update(); // Update the bar chart

    // Add data point to line chart
    const lineGraphData = {
      x: miRatio,
      y: cureRate,
      borderColor: 'rgba(255, 0, 0, 1)', // Change the border color to red
      backgroundColor: 'rgba(255, 0, 0, 1)', // Change the fill color to red
      pointStyle: 'cross',
      pointRadius: 10,
      borderWidth: 3,
    };
  
    // Remove the oldest data point if the dataset exceeds a certain length
    const lineData = chartLineInstance.current.data.datasets[0].data;
    if (lineData.length >= 50) {
      lineData.shift();
    }
  
    lineData.push(lineGraphData);
    chartLineInstance.current.update();
  };

  return (
    <div className="container">
      <h1 className="title">Cure Rate Analysis</h1>
      <div className="input-container">
        <label htmlFor="midline-input">Midline Measured:</label>
        <input type="number" id="midline-input" />
      </div>
      <div className="input-container">
        <label htmlFor="ica-input">ICA Diameter:</label>
        <input type="number" id="ica-input" />
      </div>
      <div className="input-container">
        <label htmlFor="mi-ratio-output">M/I Ratio:</label>
        <input type="text" id="mi-ratio-output" readOnly />
      </div>
      <div className="input-container">
        <label htmlFor="cure-rate-ratio-output">Cure Rate Ratio:</label>
        <input type="text" id="cure-rate-ratio-output" readOnly />
      </div>
      <div className="input-container">
        <label htmlFor="class-classification-output">Class Classification:</label>
        <input type="text" id="class-classification-output" readOnly />
      </div>
      <div className="input-container">
        <label htmlFor="cure-rate-output">Cure Rate:</label>
        <input type="text" id="cure-rate-output" readOnly />
      </div>
      <button className="calculate-button" onClick={calculate}>
        Calculate
      </button>
      <div className="chart-container">
        <canvas ref={chartContainer}></canvas>
      </div>
      <div className="line-chart-container">
        <canvas ref={lineChartContainer}></canvas>
      </div>
    </div>
  );
};

export default App;
