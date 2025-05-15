import { Component, inject } from '@angular/core';
import { SidebarService } from '@shared/providers';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  sidebar = inject(SidebarService);

  onClickToggleSidebar() {
    this.sidebar.collapsed.update((value) => !value);
  }
}
