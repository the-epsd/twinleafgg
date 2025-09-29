import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ptcg-ux-study',
  templateUrl: './ux-study.component.html',
  styleUrls: ['./ux-study.component.scss']
})
export class UxStudyComponent implements OnInit {
  activeJourney: string = 'new-player';

  constructor() { }

  ngOnInit(): void {
  }

  setActiveJourney(journey: string): void {
    this.activeJourney = journey;
  }
}
