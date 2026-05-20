<script lang="ts">
  type Props = {
    phaseLabel: string;
    turn: number;
    activePlayerName?: string;
    winnerName?: string;
    gameFinished?: boolean;
  };

  let { phaseLabel, turn, activePlayerName = '', winnerName = '', gameFinished = false }: Props = $props();
</script>

<div class="game-status">
  <strong>{winnerName ? `${winnerName} wins` : phaseLabel}</strong>
  <span>Turn {turn}</span>
  {#if !gameFinished}
    <span>{activePlayerName}</span>
  {/if}
</div>

<style>
  .game-status {
    position: absolute;
    top: 14px;
    right: 14px;
    z-index: 9;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    pointer-events: auto;
    padding: 5px 9px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(12, 15, 19, 0.76);
    color: rgba(245, 248, 255, 0.72);
    box-shadow: 0 10px 24px rgba(12, 15, 19, 0.14);
    backdrop-filter: blur(10px);
    font-size: 11px;
  }

  .game-status strong {
    color: rgba(143, 232, 206, 0.96);
  }
</style>
