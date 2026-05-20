<script lang="ts">
  import BoardPerspectiveControls from './BoardPerspectiveControls.svelte';
  import { labelFor } from '../game/labels';

  type Props = {
    boardTilt: number;
    boardPerspective: number;
    boardScaleY: number;
    boardLift: number;
    followActive: boolean;
    autoConfirmPrompts: boolean;
    debugZones: boolean;
    showLogs: boolean;
    busy?: boolean;
    promptActive?: boolean;
    gameFinished?: boolean;
    error?: string;
    resetPerspective: () => void;
    passTurn: () => void;
    concede: () => void;
    switchSides: () => void;
    resetGame: () => void;
  };

  let {
    boardTilt = $bindable(),
    boardPerspective = $bindable(),
    boardScaleY = $bindable(),
    boardLift = $bindable(),
    followActive = $bindable(),
    autoConfirmPrompts = $bindable(),
    debugZones = $bindable(),
    showLogs = $bindable(),
    busy = false,
    promptActive = false,
    gameFinished = false,
    error = '',
    resetPerspective,
    passTurn,
    concede,
    switchSides,
    resetGame,
  }: Props = $props();
</script>

<div class="table-toolbar">
  <BoardPerspectiveControls
    bind:boardTilt
    bind:boardPerspective
    bind:boardScaleY
    bind:boardLift
    {resetPerspective}
  />
  <label>
    <input type="checkbox" bind:checked={followActive} />
    Follow active player
  </label>
  <label>
    <input type="checkbox" bind:checked={autoConfirmPrompts} />
    Auto-confirm reveals
  </label>
  <label>
    <input type="checkbox" bind:checked={debugZones} />
    Debug zones
  </label>
  <label>
    <input type="checkbox" bind:checked={showLogs} />
    Show logs
  </label>
  <div class="sidebar-turn-actions">
    <button disabled={busy || promptActive || gameFinished} onclick={passTurn}>Pass turn</button>
    <button class="danger" disabled={busy || promptActive || gameFinished} onclick={concede}>Concede</button>
  </div>
  <button onclick={switchSides}>Switch sides</button>
  <button onclick={resetGame}>Change decks</button>
  {#if error}
    <span class="inline-error">{labelFor(error)}</span>
  {/if}
</div>

<style>
  .table-toolbar {
    position: absolute;
    top: 54px;
    right: 14px;
    z-index: 8;
    width: 148px;
    min-height: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 7px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(12, 15, 19, 0.76);
    border-radius: 6px;
    box-shadow: 0 10px 24px rgba(12, 15, 19, 0.18);
    backdrop-filter: blur(10px);
    flex-direction: column;
    align-items: stretch;
  }

  .table-toolbar label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 1px 5px;
    color: rgba(245, 248, 255, 0.9);
    font-size: 10px;
    line-height: 1.2;
  }

  .table-toolbar button {
    width: 100%;
    border-radius: 5px;
    padding: 6px 7px;
    border-color: rgba(255, 255, 255, 0.14);
    background: rgba(255, 255, 255, 0.08);
    color: rgba(245, 248, 255, 0.94);
    font-size: 10px;
    font-weight: 700;
  }

  .sidebar-turn-actions {
    display: grid;
    gap: 6px;
    padding-bottom: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .table-toolbar button.danger {
    color: #ffd8dc;
  }

  .inline-error {
    padding: 6px 8px;
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid #d87883;
    background: #fff0f1;
    color: #7d2732;
    font-size: 11px;
  }
</style>
