import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent, SidebarComponent, TopbarComponent } from '@shared/components';

@Component({
  selector: 'app-home',
  imports: [RouterModule, SidebarComponent, TopbarComponent, BreadcrumbComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
