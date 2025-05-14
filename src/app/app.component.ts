import { Component, ElementRef, OnInit, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'nexi-mate-app';
  svgTree = viewChild<ElementRef<HTMLDivElement>>('svgTree');

  ngOnInit(): void {
    
  }
}
