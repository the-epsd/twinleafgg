<script lang="ts">
  type Props = {
    resultLabel: string;
    turn: number;
    onconfirm: () => void;
  };

  let { resultLabel, turn, onconfirm }: Props = $props();
</script>

<div class="end-game-overlay" role="dialog" aria-modal="true" aria-labelledby="end-game-title">
  <section class="end-game-panel">
    <div>
      <span>Game over</span>
      <h2 id="end-game-title">{resultLabel}</h2>
      <p>Finished on turn {turn}</p>
    </div>
    <button type="button" onclick={onconfirm}>Back to main screen</button>
  </section>
</div>

<style>
  .end-game-overlay {
    position: absolute;
    inset: 0;
    z-index: 18;
    display: grid;
    place-items: center;
    padding: 24px;
    background: rgba(12, 15, 19, 0.54);
    backdrop-filter: blur(5px);
  }

  .end-game-panel {
    width: min(420px, calc(100vw - 48px));
    display: grid;
    gap: 18px;
    padding: 20px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(18, 22, 27, 0.94);
    color: rgba(245, 248, 255, 0.92);
    box-shadow: 0 24px 68px rgba(12, 15, 19, 0.42);
  }

  .end-game-panel span {
    display: block;
    margin-bottom: 6px;
    color: rgba(143, 232, 206, 0.9);
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
  }

  .end-game-panel h2 {
    margin: 0;
    color: #f8fafc;
    font-size: 28px;
    line-height: 1.05;
  }

  .end-game-panel p {
    margin: 8px 0 0;
    color: rgba(245, 248, 255, 0.68);
    font-size: 14px;
  }

  .end-game-panel button {
    justify-self: start;
    border-radius: 5px;
    border: 1px solid rgba(143, 232, 206, 0.36);
    background: rgba(41, 161, 139, 0.22);
    color: rgba(245, 248, 255, 0.96);
    padding: 9px 12px;
    font-weight: 900;
  }

  .end-game-panel button:hover,
  .end-game-panel button:focus-visible {
    border-color: rgba(143, 232, 206, 0.72);
    background: rgba(41, 161, 139, 0.32);
  }
</style>
