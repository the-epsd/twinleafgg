import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendRequestInfo } from '../../api/interfaces/friends.interface';
import { UserInfo } from 'ptcg-server';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.scss']
})
export class FriendRequestsComponent {

  @Input() requests: FriendRequestInfo[] = [];
  @Input() users: { [key: number]: UserInfo } = {};
  @Input() requestType: 'pending' | 'sent' = 'pending';

  @Output() acceptRequest = new EventEmitter<number>();
  @Output() rejectRequest = new EventEmitter<number>();
  @Output() cancelRequest = new EventEmitter<number>();

  getRequestUser(request: FriendRequestInfo): UserInfo {
    if (this.requestType === 'pending') {
      return request.sender;
    } else {
      return request.receiver;
    }
  }

  onAcceptRequest(requestId: number): void {
    this.acceptRequest.emit(requestId);
  }

  onRejectRequest(requestId: number): void {
    if (confirm('Are you sure you want to reject this friend request?')) {
      this.rejectRequest.emit(requestId);
    }
  }

  onCancelRequest(requestId: number): void {
    if (confirm('Are you sure you want to cancel this friend request?')) {
      this.cancelRequest.emit(requestId);
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'accepted':
        return 'badge-success';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  getEmptyStateMessage(): string {
    if (this.requestType === 'pending') {
      return 'No pending friend requests';
    } else {
      return 'No sent friend requests';
    }
  }

  getEmptyStateDescription(): string {
    if (this.requestType === 'pending') {
      return 'When other players send you friend requests, they will appear here.';
    } else {
      return 'Friend requests you have sent to other players will appear here.';
    }
  }
} 