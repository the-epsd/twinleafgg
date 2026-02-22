import { Component } from '@angular/core';
import { Replay, GameWinner, Base64 } from 'ptcg-server';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { FileInput } from '../../shared/file-input/file-input.model';
import { ReplayService } from '../../api/services/replay.service';
import { SessionService } from '../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-import-replay-popup',
  templateUrl: './import-replay-popup.component.html',
  styleUrls: ['./import-replay-popup.component.scss']
})
export class ImportReplayPopupComponent {

  public GameWinner = GameWinner;
  public loading = false;
  public invalidName: string;
  public replayFile: FileInput;
  public name: string;
  public replayError: string;
  public maxFileSize: number;
  public replay: Replay | undefined;
  public statesCount: number;
  public turnsCount: number;
  public replayWinner: string;
  public isDragOver = false;
  private replayData: string;

  constructor(
    private alertService: AlertService,
    private dialogRef: MatDialogRef<ImportReplayPopupComponent>,
    private replayService: ReplayService,
    private sessionService: SessionService
  ) {
    this.maxFileSize = this.sessionService.session.config.avatarFileSize;
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  public onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    if (this.loading) {
      return;
    }

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileInput = new FileInput([file]);
      this.replayFile = fileInput;
      this.updatePreview(fileInput);
    }
  }

  public updatePreview(value: FileInput) {
    this.replayData = '';

    if (value === null || value.files.length === 0) {
      this.replayError = '';
      this.replay = undefined;
      return;
    }

    const file = value.files[0];

    // handled by different validator
    if (file.size > this.maxFileSize) {
      this.replayError = '';
      this.replay = undefined;
      return;
    }

    this.loading = true;
    const fileReader = new FileReader();

    fileReader.onload = event => {
      const replayData = event.target.result as string;
      const replay = new Replay({ indexEnabled: false });
      const base64 = new Base64();
      try {
        replay.deserialize(base64.decode(replayData));
        this.replay = replay;
        this.statesCount = replay.getStateCount();
        this.turnsCount = replay.getTurnCount();
        this.replayData = replayData;
        this.replayError = '';
      } catch (error) {
        this.replayError = 'CANNOT_DECODE_REPLAY_FILE';
      }
      this.loading = false;
    };

    fileReader.onerror = () => {
      this.loading = false;
      this.replayError = 'CANNOT_READ_REPLAY_FILE';
    };

    fileReader.readAsText(file);
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public importReplay() {
    this.loading = true;
    this.replayService.import(this.replayData, this.name)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.dialogRef.close(response.replay);
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.code);
        }
      });
  }

}
