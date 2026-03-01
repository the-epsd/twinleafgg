import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

@Directive({
  selector: '[ptcgPreventWheelScroll]',
  standalone: true
})
export class PreventWheelScrollDirective implements OnInit, OnDestroy {
  private handler = (e: WheelEvent) => e.preventDefault();

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void {
    this.el.nativeElement.addEventListener('wheel', this.handler, { passive: false });
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('wheel', this.handler);
  }
}
