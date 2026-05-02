import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

// Chart.js
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  ChartConfiguration
} from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private updateSubscription?: Subscription;

  // Dynamic metrics
  consumoMes: number = 345;
  promedioMes: number = 289;
  promedioOficinas: number = 20;

  readonly labels = [
    'Oficina 1','Oficina 2','Oficina 3','Oficina 4','Oficina 5','Oficina 6',
    'Oficina 7','Oficina 8','Oficina 9','Oficina 10','Oficina 11'
  ];

  data = [4, 10, 8, 15, 10, 27, 16, 16, 11, 13, 8];

  ngOnInit(): void {
    // Simulate real-time updates every 3 seconds
    this.updateSubscription = interval(3000).subscribe(() => {
      this.simulateRealTimeData();
    });
  }

  ngAfterViewInit(): void {
    this.buildChart();
  }

  private simulateRealTimeData(): void {
    // Randomize metrics slightly to simulate live changes
    this.consumoMes += Math.floor(Math.random() * 5) - 1; // Slight increase mostly
    this.promedioMes = Math.floor(this.promedioMes + (Math.random() * 4 - 2));
    this.promedioOficinas = Math.floor(this.promedioOficinas + (Math.random() * 2 - 1));

    // Shift chart data left and add a new random point at the end
    this.data.shift();
    const newDataPoint = Math.floor(Math.random() * 15) + 5; // 5 to 20
    this.data.push(newDataPoint);

    if (this.chart) {
      this.chart.data.datasets[0].data = this.data;
      this.chart.update();
    }
  }

  private buildChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          borderColor: '#ffffff',
          borderWidth: 2.5,
          pointBackgroundColor: '#ffffff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.3, // Add some smoothness to make it look nicer
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(29,94,42,0.9)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} kw`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.15)' },
            ticks: {
              color: '#1a1a1a',
              font: { size: 11, weight: 'bold' },
              maxRotation: 90,
              minRotation: 45
            }
          },
          y: {
            min: 0,
            max: 35,
            ticks: {
              stepSize: 5,
              color: '#1a1a1a',
              font: { size: 11, weight: 'bold' }
            },
            grid: { color: 'rgba(255,255,255,0.25)' },
            title: {
              display: true,
              text: 'kw',
              color: '#1a1a1a',
              font: { size: 11, weight: 'bold' }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
    this.chart?.destroy();
  }
}
