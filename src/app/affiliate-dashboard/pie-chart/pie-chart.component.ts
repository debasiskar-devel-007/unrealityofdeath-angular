import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import 'chartjs-plugin-datalabels';
import { sum } from 'lodash';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css'],
})
export class PieChartComponent implements OnChanges {

  constructor(private _ngZone: NgZone) { 

  }

  public chartData: any;

  public chartCurrVal: any = {}

  ngOnInit(): void {
        this._ngZone.runOutsideAngular(() => {
      this.createChart();
    })
  }

  @Input() chartConfigInput: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.chartCurrVal = changes['chartConfigInput'].currentValue
    console.log(this.chartCurrVal);
    
  }

  createChart() {

    this.chartData = new Chart('myChart', {
      type: 'pie', //this denotes the type of chart
      data: {
        // values on X-Axis
        labels: ['Conversion Report Data', 'Click Report Data'],
        datasets: [
          {
            label: 'Count',
            data: [this.chartCurrVal?.conversioncount, (this.chartCurrVal?.clickcount - this.chartCurrVal?.conversioncount)],
            backgroundColor: [
              '#7f2e0a',
              '#27130b',
            ],
            borderColor: ['#27130b', '#edf2f0'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        aspectRatio: 3,
        responsive: true,

        // plugins: {
        //   datalabels: {
        //     formatter: (value, context) =>  {

        //       console.log(value, context);
        //       let dataArr = context.chart.data.datasets[0].data;
        //       let total = sum(dataArr);     // sum from lodash  
        //       console.log(total);

        //       let percentage = (value * 100 / total).toFixed(2) + "%";
        //     return percentage;
        //     },
        //   },
        // },
        
      },
    });
  }
}
