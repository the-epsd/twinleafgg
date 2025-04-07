import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface User {
  id: number;
  username: string;
  status: string;
  avatar?: string;
  isFriend?: boolean;
}

@Component({
  selector: 'ptcg-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  friends: User[] = [];
  onlineUsers: User[] = [];
  friendRequests: User[] = [];
  loading = false;
  activeTab: 'friends' | 'online' = 'friends';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadFriends();
    this.loadOnlineUsers();
    this.loadFriendRequests();
  }

  loadFriends() {
    this.loading = true;
    this.http.get<User[]>(`${environment.apiUrl}/v1/friends`).subscribe({
      next: (friends) => {
        this.friends = friends.map(friend => ({ ...friend, isFriend: true }));
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load friends list', 'Close', { duration: 3000 });
      }
    });
  }

  loadOnlineUsers() {
    this.http.get<User[]>(`${environment.apiUrl}/v1/users/online`).subscribe({
      next: (users) => {
        // Filter out friends and add isFriend flag
        this.onlineUsers = users
          .filter(user => !this.friends.some(friend => friend.id === user.id))
          .map(user => ({ ...user, isFriend: false }));
      },
      error: (error) => {
        this.snackBar.open('Failed to load online users', 'Close', { duration: 3000 });
      }
    });
  }

  loadFriendRequests() {
    this.http.get<User[]>(`${environment.apiUrl}/v1/friends/requests`).subscribe({
      next: (requests) => {
        this.friendRequests = requests;
      },
      error: (error) => {
        this.snackBar.open('Failed to load friend requests', 'Close', { duration: 3000 });
      }
    });
  }

  acceptFriendRequest(friendId: number) {
    this.http.post(`${environment.apiUrl}/v1/friends/accept/${friendId}`, {}).subscribe({
      next: () => {
        this.loadFriends();
        this.loadOnlineUsers();
        this.loadFriendRequests();
        this.snackBar.open('Friend request accepted', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to accept friend request', 'Close', { duration: 3000 });
      }
    });
  }

  rejectFriendRequest(friendId: number) {
    this.http.post(`${environment.apiUrl}/v1/friends/reject/${friendId}`, {}).subscribe({
      next: () => {
        this.loadFriendRequests();
        this.snackBar.open('Friend request rejected', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to reject friend request', 'Close', { duration: 3000 });
      }
    });
  }

  sendFriendRequest(userId: number) {
    this.http.post(`${environment.apiUrl}/v1/friends/request/${userId}`, {}).subscribe({
      next: () => {
        this.loadOnlineUsers();
        this.snackBar.open('Friend request sent', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to send friend request', 'Close', { duration: 3000 });
      }
    });
  }
}
