import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { DashboardData } from '../core/models/dashboard.model';

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
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private updateSubscription?: Subscription;
  private dataLoaded = false;

  // Dynamic metrics
  consumoMes: number = 0;
  promedioMes: number = 0;
  promedioOficinas: number = 0;

  labels: string[] = [];
  data: number[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDashboardData();

    // Refresh data every 30 seconds to stay updated with the backend
    this.updateSubscription = interval(30000).subscribe(() => {
      this.loadDashboardData();
    });
  }

  ngAfterViewInit(): void {
    // If data already arrived, build chart now
    if (this.dataLoaded) {
      this.buildChart();
    }
  }

  private loadDashboardData(): void {
    this.http.get<DashboardData>('http://localhost:8000/api/dashboard/').subscribe({
      next: (res) => {
        this.labels = res.labels;
        this.data = res.data;
        this.consumoMes = res.metrics.consumoMes;
        this.promedioMes = res.metrics.promedioMes;
        this.promedioOficinas = res.metrics.promedioOficinas;
        
        this.dataLoaded = true;

        if (this.chart) {
          // Update existing chart
          this.chart.data.labels = this.labels;
          this.chart.data.datasets[0].data = this.data;
          this.chart.update();
        } else if (this.chartCanvas) {
          // Build chart for the first time if view is ready
          this.buildChart();
        }
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
      }
    });
  }

  private buildChart(): void {
    if (!this.chartCanvas) return;
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
          tension: 0.3,
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
              label: (ctx: any) => ` ${ctx.parsed.y} kw`
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
