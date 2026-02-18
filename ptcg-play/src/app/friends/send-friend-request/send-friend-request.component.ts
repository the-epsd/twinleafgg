import { Component, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { FriendsService } from '../../api/services/friends.service';

@Component({
  selector: 'ptcg-send-friend-request',
  templateUrl: './send-friend-request.component.html',
  styleUrls: ['./send-friend-request.component.scss']
})
export class SendFriendRequestComponent {

  @Output() requestSent = new EventEmitter<void>();

  friendRequestForm: UntypedFormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private friendsService: FriendsService
  ) {
    this.friendRequestForm = this.formBuilder.group({
      receiverId: ['', [Validators.required, Validators.pattern(/^[1-9]\d*$/)]]
    });
  }

  onSubmit(): void {
    if (this.friendRequestForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const receiverId = this.friendRequestForm.get('receiverId')?.value;
      const receiverIdNumber = parseInt(receiverId, 10);

      if (isNaN(receiverIdNumber) || receiverIdNumber <= 0) {
        this.loading = false;
        this.errorMessage = 'Please enter a valid user ID (positive number).';
        return;
      }

      this.friendsService.sendFriendRequest(receiverIdNumber).subscribe({
        next: (response) => {
          this.successMessage = 'Friend request sent successfully!';
          this.friendRequestForm.reset();
          this.requestSent.emit();
          this.loading = false;

          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.loading = false;

          if (error.status === 400) {
            if (error.error && error.error.error) {
              this.errorMessage = this.getErrorMessage(error.error.error);
            } else if (error.error && error.error.message) {
              this.errorMessage = error.error.message;
            } else {
              this.errorMessage = 'Invalid request. Please check the user ID and try again.';
            }
          } else if (error.status === 401) {
            this.errorMessage = 'You need to be logged in to send friend requests.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found. Please check the user ID.';
          } else if (error.error && error.error.error) {
            this.errorMessage = this.getErrorMessage(error.error.error);
          } else {
            this.errorMessage = 'Failed to send friend request. Please try again.';
          }
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.friendRequestForm.markAllAsTouched();
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'ERROR_PROFILE_INVALID':
        return 'User not found. Please check the user ID.';
      case 'ERROR_INVALID_PARAM':
        return 'Invalid request. You cannot send a friend request to yourself.';
      case 'Friendship already exists':
        return 'You are already friends with this user.';
      case 'Friend request already sent':
        return 'You have already sent a friend request to this user.';
      case 'Cannot send friend request to yourself':
        return 'You cannot send a friend request to yourself.';
      case 'User is blocked':
        return 'You cannot send a friend request to this user.';
      case 'ERROR_INVALID_TOKEN':
        return 'Authentication failed. Please log in again.';
      case 'ERROR_INVALID_PERMISSIONS':
        return 'You do not have permission to perform this action.';
      default:
        return `Error: ${errorCode}`;
    }
  }

  onInputChange(): void {
    // Clear messages when user starts typing
    if (this.errorMessage || this.successMessage) {
      this.errorMessage = '';
      this.successMessage = '';
    }
  }
} 