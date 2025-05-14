import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [NgClass, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  showDropdown = false;
  sidebarCollapsed = false; // NUEVA VARIABLE

  users = [
    { name: 'Wade Warren', role: 'F&E Manager', email: 'wade.warren@gmail.com', phone: '+7 (903) 880-89-15', status: true },
    { name: 'Savannah Nguyen', role: 'Admin', email: 's.nguyen@gmail.com', phone: '+7 (903) 880-89-15', status: true },
    { name: 'Jenny Wilson', role: 'F&E Manager', email: 'jenny.wilson@gmail.com', phone: '+7 (903) 880-89-15', status: false }
  ];

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    alert('Sesión cerrada');
  }
}
