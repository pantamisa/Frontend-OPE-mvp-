import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, Report } from '../../../core/services/report';

@Component({
  selector: 'app-report-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-view.html',
  styleUrl: './report-view.scss'
})
export class ReportView implements OnInit {
  report: Report | null = null;
  loading = true;
  error = '';

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.reportService.getIncome().subscribe({
      next: (data) => { this.report = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar el reporte'; this.loading = false; }
    });
  }
}