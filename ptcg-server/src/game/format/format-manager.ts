import { Format } from '../store/format/format';

export class FormatManager {
  private static instance: FormatManager;
  private formats: Format[] = [];

  public static getInstance(): FormatManager {
    if (!FormatManager.instance) {
      FormatManager.instance = new FormatManager();
    }
    return FormatManager.instance;
  }
}
