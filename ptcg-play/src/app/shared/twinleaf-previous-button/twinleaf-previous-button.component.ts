import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'twinleaf-previous-button',
  templateUrl: './twinleaf-previous-button.component.html',
  styleUrls: ['./twinleaf-previous-button.component.scss']
})
export class TwinleafPreviousButtonComponent implements OnInit, OnDestroy {
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
    const classes = ['nav-button', 'prev'];
    if (this.disabled) {
      classes.push('disabled');
    }
    return classes.join(' ');
  }
}
