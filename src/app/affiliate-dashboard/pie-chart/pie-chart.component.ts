import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnChanges {

  constructor(private _ngZone: NgZone) { 

  }

  public chartData: any;

  ngOnInit(): void {
        this._ngZone.runOutsideAngular(() => {
      this.createChart();
    })
  }

  @Input() chart: any;

  ngOnChanges(changes: SimpleChanges): void {}

  createChart() {
    this.chartData = new Chart('myChart', {
      type: 'pie', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: ['Red', 'Pink', 'Green', 'Yellow', 'Orange', 'Blue'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [300, 240, 100, 432, 253, 34],
            backgroundColor: [
              'red',
              'pink',
              'green',
              'yellow',
              'orange',
              'blue',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}
