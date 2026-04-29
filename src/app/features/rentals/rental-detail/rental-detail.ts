import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RentalService, Rental } from '../../../core/services/rental';

@Component({
  selector: 'app-rental-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './rental-detail.html',
  styleUrl: './rental-detail.scss'
})
export class RentalDetail implements OnInit {
  rental: Rental | null = null;
  loading = true;
  closing = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private rentalService: RentalService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.rentalService.getById(id).subscribe({
      next: (data) => { this.rental = data; this.loading = false; },
      error: () => { this.error = 'Error al cargar la renta'; this.loading = false; }
    });
  }

  close() {
    if (!this.rental?.id) return;
    this.closing = true;
    this.rentalService.close(this.rental.id).subscribe({
      next: () => this.router.navigate(['/rentals']),
      error: () => { this.error = 'Error al finalizar la renta'; this.closing = false; }
    });
  }
}