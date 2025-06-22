import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionService } from 'src/app/shared/session/session.service';
import { ProfileService } from 'src/app/api/services/profile.service';
import { CustomAvatarInfo } from 'src/app/api/interfaces/profile.interface';
import { UserInfo } from 'ptcg-server';

@UntilDestroy()
@Component({
  selector: 'app-avatar-customization-popup',
  templateUrl: './avatar-customization-popup.component.html',
  styleUrls: ['./avatar-customization-popup.component.scss']
})
export class AvatarCustomizationPopupComponent implements OnInit {

  public avatar: Partial<CustomAvatarInfo> = {};
  public loading = true;
  private userId: number;

  public faceOptions = ['face_1', 'face_2', 'face_3'];
  public hairOptions = ['hair_1', 'hair_2', 'hair_3'];
  public glassesOptions = ['glasses_1', 'glasses_2', ''];
  public shirtOptions = ['shirt_1', 'shirt_2', 'shirt_3'];
  public hatOptions = ['hat_1', 'hat_2', ''];
  public accessoryOptions = ['accessory_1', 'accessory_2', ''];

  constructor(
    private dialogRef: MatDialogRef<AvatarCustomizationPopupComponent>,
    private sessionService: SessionService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.sessionService.get(s => s.loggedUserId)
      .pipe(untilDestroyed(this))
      .subscribe(userId => {
        this.userId = userId;
        const user = this.sessionService.session.users[userId];
        if (user && user.customAvatar) {
          this.avatar = { ...user.customAvatar };
        }
        this.loading = false;
      });
  }

  public next(part: keyof CustomAvatarInfo) {
    const options = this[part + 'Options'];
    const currentIndex = options.indexOf(this.avatar[part] || '');
    const nextIndex = (currentIndex + 1) % options.length;
    this.avatar = {
      ...this.avatar,
      [part]: options[nextIndex]
    };
  }

  public previous(part: keyof CustomAvatarInfo) {
    const options = this[part + 'Options'];
    const currentIndex = options.indexOf(this.avatar[part] || '');
    const nextIndex = (currentIndex - 1 + options.length) % options.length;
    this.avatar = {
      ...this.avatar,
      [part]: options[nextIndex]
    };
  }

  public save() {
    this.loading = true;
    this.profileService.updateAvatar(this.avatar).subscribe({
      next: response => {
        console.log('[DEBUG] Server response after save:', response);
        this.loading = false;
        this.dialogRef.close();

        if (response && response.user) {
          const users = this.sessionService.session.users;
          const updatedUsers = { ...users, [this.userId]: response.user };
          this.sessionService.set({ users: updatedUsers });
        } else {
          console.error('Invalid response from server after updating avatar:', response);
        }
      },
      error: err => {
        this.loading = false;
        console.error('Error saving avatar:', err);
      }
    });
  }

  public cancel() {
    this.dialogRef.close();
  }
} 