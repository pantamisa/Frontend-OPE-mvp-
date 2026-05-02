import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  faultType: string;
  imageUrl?: string;
  checked: boolean;
}

@Component({
  selector: 'app-maintenance-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-requests.component.html',
  styleUrls: ['./maintenance-requests.component.scss']
})
export class MaintenanceRequestsComponent {
  searchTerm = '';
  showModal = false;
  selectedImageName = '';

  newRequest = { title: '', description: '', faultType: 'Sensor' };

  faultTypes = ['Sensor', 'Eléctrico', 'Mecánico', 'Hidráulico', 'Neumático', 'Otro'];

  requests: MaintenanceRequest[] = [
    { id: 1, title: 'Falla sensor de movimiento', description: 'El carro 8 presenta fallas en su sistema', faultType: 'Sensor', checked: false },
    { id: 2, title: 'La luz no enciende', description: 'En la carro 5 se fundio el bombillo', faultType: 'Eléctrico', checked: false },
  ];

  get filtered() {
    const q = this.searchTerm.toLowerCase();
    return this.requests.filter(r =>
      r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }

  openModal() { this.showModal = true; this.newRequest = { title: '', description: '', faultType: 'Sensor' }; this.selectedImageName = ''; }
  closeModal() { this.showModal = false; }

  saveRequest() {
    if (!this.newRequest.title.trim()) return;
    this.requests.push({
      id: Date.now(),
      title: this.newRequest.title,
      description: this.newRequest.description,
      faultType: this.newRequest.faultType,
      checked: false
    });
    this.closeModal();
  }

  deleteSelected() {
    this.requests = this.requests.filter(r => !r.checked);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedImageName = input.files[0].name;
  }
}
