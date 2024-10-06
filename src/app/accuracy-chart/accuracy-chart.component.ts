import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-accuracy-chart',
  templateUrl: './accuracy-chart.component.html',
  styleUrls: ['./accuracy-chart.component.scss']
})
export class AccuracyChartComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();
  chart: Chart | undefined;

  ngOnInit() {
    this.initializeChart(); // Initialize the chart when the component loads
  }

  initializeChart() {
    this.chart = new Chart('accuracyChart', {
      type: 'line', // Type of chart
      data: {
        labels: ['Label 1', 'Label 2', 'Label 3'], // Replace with actual labels
        datasets: [{
          label: 'Dataset 1',
          data: [10, 20, 30], // Replace with actual data
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          fill: false // Do not fill area under the line
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        },
      }
    });
  }

  close() {
    this.closeModal.emit(); // Emit event to close the modal
    if (this.chart) {
      this.chart.destroy(); // Destroy the chart when closing the modal to avoid memory leaks
    }
  }
}
