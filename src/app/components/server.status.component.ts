import {Component} from '@angular/core';

@Component({
  templateUrl: '../templates/server.status.component.html'
})
export class ServerStatusComponent {
  single = [
    {
      "name": "Germany",
      "value": 8940000
    }
  ];
  customColors = [
    {
      name: 'Germany',
      value: '#0000ff'
    }
  ];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;

  constructor() {

  }

  onSelect(event) {
    console.log(event);
  }
}
