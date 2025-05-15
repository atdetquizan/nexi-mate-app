import { Component, inject, OnInit, signal } from '@angular/core';
import { PersonalService } from './cores/providers';
import { BirthdayPipe } from '@shared/pipes';

@Component({
  selector: 'app-personal',
  imports: [BirthdayPipe],
  templateUrl: './personal.component.html',
  styleUrl: './personal.component.scss'
})
export class PersonalComponent implements OnInit {
  personalService = inject(PersonalService)
  clients = signal<any[]>([])

  ngOnInit() {
    this.personalService.getAll().subscribe(res => {
      this.clients.set(res)
    })
  }
}
