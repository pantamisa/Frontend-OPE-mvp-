import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RentalService, Rental } from '../../../core/services/rental';

@Component({
  selector: 'app-rental-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rental-list.html',
  styleUrl: './rental-list.scss'
})
export class RentalList implements OnInit {
  rentals: Rental[] = [];
  loading = true;
  error = '';

  constructor(private rentalService: RentalService) {}

  ngOnInit() {
    this.rentalService.getAll().subscribe({
      next: (data) => { this.rentals = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar rentas'; this.loading = false; }
    });
  }
}