import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'twinleaf-next-button',
  templateUrl: './twinleaf-next-button.component.html',
  styleUrls: ['./twinleaf-next-button.component.scss']
})
export class TwinleafNextButtonComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean = false;
  @Input() size: string = '48px';
  @Input() tooltip: string = '';

  @Output() clicked = new EventEmitter<void>();

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  get buttonClasses(): string {
    const classes = ['nav-button', 'next'];
    if (this.disabled) {
      classes.push('disabled');
    }
    return classes.join(' ');
  }
}
