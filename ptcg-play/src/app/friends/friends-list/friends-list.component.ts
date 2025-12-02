import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FriendInfo } from '../../api/interfaces/friends.interface';
import { UserInfo } from 'ptcg-server';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent {

  @Input() friends: FriendInfo[] = [];
  @Input() users: { [key: number]: UserInfo } = {};

  @Output() removeFriend = new EventEmitter<number>();
  @Output() blockUser = new EventEmitter<number>();
  @Output() unblockUser = new EventEmitter<number>();

  constructor(private sessionService: SessionService) { }

  getFriendUser(friend: FriendInfo): UserInfo {
    const currentUserId = this.getCurrentUserId();

    // Add safety checks
    if (!friend || !friend.user || !friend.friend) {
      return null;
    }

    return friend.user.userId === currentUserId ? friend.friend : friend.user;
  }

  getCurrentUserId(): number {
    return this.sessionService.session.loggedUserId;
  }

  onRemoveFriend(friend: FriendInfo): void {
    if (confirm('Are you sure you want to remove this friend?')) {
      const friendUser = this.getFriendUser(friend);
      if (friendUser && friendUser.userId) {
        this.removeFriend.emit(friendUser.userId);
      } else {
        alert('Error: Could not remove friend. Please try again.');
      }
    }
  }

  onBlockUser(userId: number): void {
    if (confirm('Are you sure you want to block this user?')) {
      this.blockUser.emit(userId);
    }
  }

  onUnblockUser(userId: number): void {
    this.unblockUser.emit(userId);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'accepted':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'blocked':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'accepted':
        return 'Friend';
      case 'pending':
        return 'Pending';
      case 'blocked':
        return 'Blocked';
      default:
        return 'Unknown';
    }
  }

  trackByFriend(index: number, friend: FriendInfo): any {
    return friend.id || index;
  }
} 