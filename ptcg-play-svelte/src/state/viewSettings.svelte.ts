const DEFAULT_BOARD_TILT = 8;
const DEFAULT_BOARD_PERSPECTIVE = 1250;
const DEFAULT_BOARD_SCALE_Y = 94;
const DEFAULT_BOARD_LIFT = 0;

class ViewSettingsStore {
  followActive = $state(true);
  autoConfirmPrompts = $state(true);
  debugZones = $state(false);
  showLogs = $state(false);
  viewIndex = $state(0);
  boardTilt = $state(DEFAULT_BOARD_TILT);
  boardPerspective = $state(DEFAULT_BOARD_PERSPECTIVE);
  boardScaleY = $state(DEFAULT_BOARD_SCALE_Y);
  boardLift = $state(DEFAULT_BOARD_LIFT);

  resetPerspective() {
    this.boardTilt = DEFAULT_BOARD_TILT;
    this.boardPerspective = DEFAULT_BOARD_PERSPECTIVE;
    this.boardScaleY = DEFAULT_BOARD_SCALE_Y;
    this.boardLift = DEFAULT_BOARD_LIFT;
  }

  followPlayer(playerIndex: number) {
    this.viewIndex = playerIndex;
  }

  switchToPlayer(playerIndex: number) {
    this.followActive = false;
    this.viewIndex = playerIndex;
  }

  resetView() {
    this.followActive = true;
    this.viewIndex = 0;
  }
}

export const viewSettingsStore = new ViewSettingsStore();
