import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Friend {
  id: number;
  username: string;
  avatar: string;
  status: string;
  isSent?: boolean;
}

@Component({
  selector: 'ptcg-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  friends: Friend[] = [];
  friendRequests: Friend[] = [];
  loading = false;
  activeTab: 'friends' | 'requests' = 'friends';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadFriends();
    this.loadFriendRequests();
  }

  loadFriends() {
    this.loading = true;
    this.http.get<Friend[]>(`${environment.apiUrl}/v1/friends`).subscribe({
      next: (friends) => {
        this.friends = friends;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Failed to load friends list', 'Close', { duration: 3000 });
      }
    });
  }

  loadFriendRequests() {
    this.http.get<Friend[]>(`${environment.apiUrl}/v1/friends/requests`).subscribe({
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

  removeFriend(friendId: number) {
    this.http.delete(`${environment.apiUrl}/v1/friends/${friendId}`).subscribe({
      next: () => {
        this.loadFriends();
        this.snackBar.open('Friend removed', 'Close', { duration: 3000 });
      },
      error: (error) => {
        this.snackBar.open('Failed to remove friend', 'Close', { duration: 3000 });
      }
    });
  }
} 