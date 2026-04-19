/** Canvas size for board damage counter art (matches 3D texture). */
export const BOARD_DAMAGE_COUNTER_SIZE = 128;

/**
 * Paints the in-game damage counter (yellow–orange–red disc, white ring, white text + shadow).
 * Shared by the 3D board overlay and 2D prompt UI.
 */
export function paintBoardDamageCounter(ctx: CanvasRenderingContext2D, damage: number): void {
  const centerX = 64;
  const centerY = 64;
  const radius = 58;

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, '#ffeb3b');
  gradient.addColorStop(0.5, '#ff9800');
  gradient.addColorStop(1, '#ff5722');

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = 'bold 48px Arial Black, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = damage.toString();
  ctx.fillStyle = '#000000';
  ctx.fillText(text, centerX - 0.5, centerY - 0.5 + 4);
  ctx.fillText(text, centerX + 0.5, centerY - 0.5 + 4);
  ctx.fillText(text, centerX - 0.5, centerY + 0.5 + 4);
  ctx.fillText(text, centerX + 0.5, centerY + 0.5 + 4);

  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, centerX, centerY + 4);
}

export function createBoardDamageCounterDataUrl(damage: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = BOARD_DAMAGE_COUNTER_SIZE;
  canvas.height = BOARD_DAMAGE_COUNTER_SIZE;
  const ctx = canvas.getContext('2d')!;
  paintBoardDamageCounter(ctx, damage);
  return canvas.toDataURL();
}
