import { Component, inject, signal } from '@angular/core';
import { SidebarService } from '../../providers';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface SidebarMenu {
  title: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [NgClass, RouterLinkActive, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  sidebar = inject(SidebarService);
  menus = signal<SidebarMenu[]>([
    {
      icon: 'ri-home-5-line',
      title: 'Dashboard',
      path: '/portal/dashboard',
    },
    {
      icon: 'ri-user-6-line',
      title: 'Personal',
      path: '/portal/personal',
    },
  ]);
}
