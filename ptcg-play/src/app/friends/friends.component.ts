import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../api/services/friends.service';
import { SessionService } from '../shared/session/session.service';
import { FriendInfo, FriendRequestInfo } from '../api/interfaces/friends.interface';
import { UserInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  friends: FriendInfo[] = [];
  pendingRequests: FriendRequestInfo[] = [];
  sentRequests: FriendRequestInfo[] = [];
  users: { [key: number]: UserInfo } = {};
  loading = false;
  activeTab = 'friends'; // 'friends', 'pending', 'sent'
  showAddFriendModal = false;
  tabTransitioning = false;

  constructor(
    private friendsService: FriendsService,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
    this.loadAllFriendsData();
  }

  openAddFriendModal(): void {
    this.showAddFriendModal = true;
  }

  closeAddFriendModal(): void {
    this.showAddFriendModal = false;
  }

  loadAllFriendsData(): void {
    this.loading = true;

    // Load all friend data concurrently
    Promise.all([
      this.loadFriendsDataPromise(),
      this.loadPendingRequestsPromise(),
      this.loadSentRequestsPromise()
    ]).then(() => {
      this.loading = false;
    }).catch(error => {
      console.error('Error loading friends data:', error);
      this.loading = false;
    });
  }

  loadFriendsData(): void {
    this.loading = true;

    // Load friends list
    this.friendsService.getFriendsList().subscribe(
      response => {
        console.log('Friends response:', response);
        this.friends = response.friends;
        this.updateUsers(response.users);
        this.loading = false;
      },
      error => {
        console.error('Error loading friends:', error);
        this.loading = false;
      }
    );
  }

  private loadFriendsDataPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.friendsService.getFriendsList().subscribe({
        next: (response) => {
          console.log('Friends response:', response);
          this.friends = response.friends;
          this.updateUsers(response.users);
          resolve();
        },
        error: (error) => {
          console.error('Error loading friends:', error);
          reject(error);
        }
      });
    });
  }

  loadPendingRequests(): void {
    this.friendsService.getPendingRequests().subscribe(
      response => {
        this.pendingRequests = response.requests;
        this.updateUsers(response.users);
      },
      error => {
        console.error('Error loading pending requests:', error);
      }
    );
  }

  private loadPendingRequestsPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.friendsService.getPendingRequests().subscribe({
        next: (response) => {
          this.pendingRequests = response.requests;
          this.updateUsers(response.users);
          resolve();
        },
        error: (error) => {
          console.error('Error loading pending requests:', error);
          reject(error);
        }
      });
    });
  }

  loadSentRequests(): void {
    this.friendsService.getSentRequests().subscribe(
      response => {
        this.sentRequests = response.requests;
        this.updateUsers(response.users);
      },
      error => {
        console.error('Error loading sent requests:', error);
      }
    );
  }

  private loadSentRequestsPromise(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.friendsService.getSentRequests().subscribe({
        next: (response) => {
          this.sentRequests = response.requests;
          this.updateUsers(response.users);
          resolve();
        },
        error: (error) => {
          console.error('Error loading sent requests:', error);
          reject(error);
        }
      });
    });
  }

  private updateUsers(newUsers: UserInfo[]): void {
    newUsers.forEach(user => {
      this.users[user.userId] = user;
    });
  }

  onTabChange(tab: string): void {
    if (this.activeTab === tab || this.tabTransitioning) {
      return; // Prevent multiple rapid clicks
    }

    this.tabTransitioning = true;

    // Brief delay to show smooth transition
    setTimeout(() => {
      this.activeTab = tab;

      // Load data if needed
      if (tab === 'pending' && this.pendingRequests.length === 0) {
        this.loadPendingRequests();
      } else if (tab === 'sent' && this.sentRequests.length === 0) {
        this.loadSentRequests();
      }

      // Allow transitions again after content is loaded
      setTimeout(() => {
        this.tabTransitioning = false;
      }, 300);
    }, 50);
  }

  onAcceptRequest(requestId: number): void {
    this.friendsService.acceptFriendRequest(requestId).subscribe(
      () => {
        this.loadAllFriendsData();
      },
      error => {
        console.error('Error accepting friend request:', error);
      }
    );
  }

  onRejectRequest(requestId: number): void {
    this.friendsService.rejectFriendRequest(requestId).subscribe(
      () => {
        this.loadPendingRequests();
      },
      error => {
        console.error('Error rejecting friend request:', error);
      }
    );
  }

  onCancelRequest(requestId: number): void {
    this.friendsService.cancelFriendRequest(requestId).subscribe(
      () => {
        this.loadSentRequests();
      },
      error => {
        console.error('Error canceling friend request:', error);
      }
    );
  }

  onRemoveFriend(friendId: number): void {
    this.friendsService.removeFriend(friendId).subscribe(
      () => {
        this.loadFriendsData();
      },
      error => {
        console.error('Error removing friend:', error);
      }
    );
  }

  onBlockUser(userId: number): void {
    this.friendsService.blockUser(userId).subscribe(
      () => {
        this.loadFriendsData();
      },
      error => {
        console.error('Error blocking user:', error);
      }
    );
  }

  onUnblockUser(userId: number): void {
    this.friendsService.unblockUser(userId).subscribe(
      () => {
        this.loadFriendsData();
      },
      error => {
        console.error('Error unblocking user:', error);
      }
    );
  }

  onFriendRequestSent(): void {
    // Close the modal
    this.closeAddFriendModal();
    // Refresh all data to update counters in the tabs
    this.loadAllFriendsData();
  }
} 