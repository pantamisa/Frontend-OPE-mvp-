import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// Chart.js — install via: npm install chart.js
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
export class DashboardComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;

  readonly labels = [
    'Oficina 1','Oficina 2','Oficina 3','Oficina 4','Oficina 5','Oficina 6',
    'Oficina 7','Oficina 8','Oficina 9','Oficina 10','Oficina 11'
  ];

  readonly data = [4, 10, 8, 15, 10, 27, 16, 16, 11, 13, 8];

  ngAfterViewInit(): void {
    this.buildChart();
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
          tension: 0,
          fill: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
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
            max: 30,
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
    this.chart?.destroy();
  }
}
