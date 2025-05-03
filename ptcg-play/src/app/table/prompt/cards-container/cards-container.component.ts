import { Component, AfterViewInit, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'ptcg-cards-container',
  templateUrl: './cards-container.component.html',
  styleUrls: ['./cards-container.component.scss']
})
export class CardsContainerComponent implements AfterViewInit {

  @Input() keepInitialSize: boolean = false;

  constructor(private elementRef: ElementRef<HTMLElement>) { }

  ngAfterViewInit() {
    // Remember the height of the component,
    // and do not change it during drag & drop
    if (this.keepInitialSize) {
      setTimeout(() => {
        const host = this.elementRef.nativeElement;
        const container: HTMLElement | null = host.querySelector('.ptcg-cards-container');
        if (container) {
          const height = container.offsetHeight + 'px';
          const width = container.offsetWidth + 'px';
          container.style.height = height;
          container.style.width = width;
        }
      }, 100);
    }
  }
}