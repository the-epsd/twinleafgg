import { Component, Input, OnChanges } from '@angular/core';
import { ConversationInfo, UserInfo } from 'ptcg-server';
import { Observable, EMPTY } from 'rxjs';

import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-contact-bar',
  templateUrl: './contact-bar.component.html',
  styleUrls: ['./contact-bar.component.scss']
})
export class ContactBarComponent implements OnChanges {

  @Input() conversation: ConversationInfo;

  @Input() loggedUserId: number;

  @Input() active = false;

  public user$: Observable<UserInfo> = EMPTY;

  public marked: boolean;

  constructor(private sessionService: SessionService) { }

  ngOnChanges(): void {
    if (this.conversation && this.loggedUserId) {
      let userId = this.conversation.user1Id;
      if (userId === this.loggedUserId) {
        userId = this.conversation.user2Id;
      }
      const sendedByMe = this.conversation.lastMessage.senderId === this.loggedUserId;
      const isRead = this.conversation.lastMessage.isRead;
      this.marked = !sendedByMe && !isRead;
      this.user$ = this.sessionService.get(session => session.users[userId]);
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

    // Less than an hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m`;
    }

    // Less than 24 hours ago
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h`;
    }

    // Less than a week ago
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d`;
    }

    // Older than a week - show date
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  }

}
