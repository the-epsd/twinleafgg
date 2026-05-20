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
