import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'twinleaf-button',
  templateUrl: './twinleaf-button.component.html',
  styleUrls: ['./twinleaf-button.component.scss']
})
export class TwinleafButtonComponent implements OnInit, OnDestroy {
  @Input() text: string = 'Button';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = '';
  @Input() color: string = 'primary'; // primary, secondary, accent
  @Input() size: string = 'normal'; // small, normal, large
  @Input() fullWidth: boolean = false;
  @Input() matMenuTriggerFor: any;
  @Input() routerLink: any;

  @Output() clicked = new EventEmitter<void>();

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }

  get buttonClasses(): string {
    const classes = ['twinleaf-button'];
    classes.push(`twinleaf-button--${this.color}`);
    classes.push(`twinleaf-button--${this.size}`);
    if (this.fullWidth) {
      classes.push('twinleaf-button--full-width');
    }
    if (this.disabled) {
      classes.push('twinleaf-button--disabled');
    }
    if (this.loading) {
      classes.push('twinleaf-button--loading');
    }
    return classes.join(' ');
  }
}
