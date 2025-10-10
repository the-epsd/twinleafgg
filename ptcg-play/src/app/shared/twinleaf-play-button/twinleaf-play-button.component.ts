import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'twinleaf-play-button',
  templateUrl: './twinleaf-play-button.component.html',
  styleUrls: ['./twinleaf-play-button.component.scss']
})
export class TwinleafPlayButtonComponent implements OnInit, OnDestroy {
  @Input() text: string = 'FIND MATCH';
  @Input() inQueue: boolean = false;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() onCooldown: boolean = false;
  @Input() cooldownSeconds: number = 0;
  @Input() connectionError: boolean = false;
  @Input() width: string = '240px';
  @Input() height: string = '60px';
  @Input() fontSize: string = '14px';

  @Output() clicked = new EventEmitter<void>();

  ngOnInit(): void {
    // Component initialization
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  onClick(): void {
    if (!this.disabled && !this.loading && !this.connectionError) {
      this.clicked.emit();
    }
  }

  get buttonText(): string {
    if (this.inQueue) {
      return 'LEAVE QUEUE';
    }
    if (this.onCooldown) {
      return `COOLDOWN (${this.cooldownSeconds})`;
    }
    return this.text;
  }

  get buttonClasses(): string {
    const classes = ['play-button'];
    if (this.inQueue) {
      classes.push('in-queue');
    }
    if (this.connectionError) {
      classes.push('error');
    }
    return classes.join(' ');
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading || this.connectionError || this.onCooldown;
  }
}
