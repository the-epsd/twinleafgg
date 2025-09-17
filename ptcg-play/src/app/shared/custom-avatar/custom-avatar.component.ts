import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CustomAvatarInfo } from 'src/app/api/interfaces/profile.interface';

@Component({
  selector: 'ptcg-custom-avatar',
  templateUrl: './custom-avatar.component.html',
  styleUrls: ['./custom-avatar.component.scss']
})
export class CustomAvatarComponent implements OnChanges {

  @Input() avatar: Partial<CustomAvatarInfo>;

  public faceUrl: SafeUrl;
  public hairUrl: SafeUrl;
  public glassesUrl: SafeUrl;
  public shirtUrl: SafeUrl;
  public hatUrl: SafeUrl;
  public accessoryUrl: SafeUrl;

  private readonly basePath = 'assets/custom-avatar/';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.avatar) {
      this.updateUrls();
    }
  }

  private updateUrls(): void {
    this.faceUrl = this.getSafeUrl('face', this.avatar?.face);
    this.hairUrl = this.getSafeUrl('hair', this.avatar?.hair);
    this.glassesUrl = this.getSafeUrl('glasses', this.avatar?.glasses);
    this.shirtUrl = this.getSafeUrl('shirt', this.avatar?.shirt);
    this.hatUrl = this.getSafeUrl('hat', this.avatar?.hat);
    this.accessoryUrl = this.getSafeUrl('accessory', this.avatar?.accessory);
  }

  private getSafeUrl(part: keyof CustomAvatarInfo, value: string | undefined): SafeUrl {
    if (!value) {
      return '';
    }
    const path = `${this.basePath}${part}/${value}.svg`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(path);
  }
} 