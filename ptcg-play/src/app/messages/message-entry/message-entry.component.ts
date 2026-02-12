import { Component, Input, OnChanges } from '@angular/core';
import { MessageInfo, UserInfo } from 'ptcg-server';
import { Observable, EMPTY } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-message-entry',
  templateUrl: './message-entry.component.html',
  styleUrls: ['./message-entry.component.scss']
})
export class MessageEntryComponent implements OnChanges {

  @Input() message: MessageInfo;
  @Input() loggedUserId: number;
  public user$: Observable<UserInfo> = EMPTY;
  public writtenByMe: boolean;

  constructor(private sessionService: SessionService) { }

  ngOnChanges(): void {
    if (this.message && this.loggedUserId) {
      const senderId = this.message.senderId;
      this.writtenByMe = senderId === this.loggedUserId;
      this.user$ = this.sessionService.get(session => session.users[senderId]);
    }
  }

  formatTimestamp(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;
    const date = new Date(timestamp);

    // Less than a minute ago
    if (diff < 60000) {
      return 'now';
    }

    // Today - show time
    const today = new Date();
    if (date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()) {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${displayHours}:${displayMinutes} ${ampm}`;
    }

    // Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()) {
      return 'Yesterday';
    }

    // Older - show date
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = today.getFullYear();

    if (year === currentYear) {
      return `${month}/${day}`;
    }

    return `${month}/${day}/${year}`;
  }

}
