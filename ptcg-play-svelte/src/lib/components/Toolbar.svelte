<script lang="ts">
  import BoardPerspectiveControls from './BoardPerspectiveControls.svelte';
  import { labelFor } from '../game/labels';
  import type { ThemePreference } from '../../state/viewSettings.svelte';

  type Props = {
    boardTilt: number;
    boardPerspective: number;
    boardScaleY: number;
    boardLift: number;
    followActive: boolean;
    autoConfirmPrompts: boolean;
    debugZones: boolean;
    showLogs: boolean;
    themePreference: ThemePreference;
    busy?: boolean;
    promptActive?: boolean;
    gameFinished?: boolean;
    error?: string;
    resetPerspective: () => void;
    passTurn: () => void;
    concede: () => void;
    switchSides: () => void;
    switchDisabled?: boolean;
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
    themePreference = $bindable(),
    busy = false,
    promptActive = false,
    gameFinished = false,
    error = '',
    resetPerspective,
    passTurn,
    concede,
    switchSides,
    switchDisabled = false,
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
  <label>
    Theme
    <select bind:value={themePreference} aria-label="Theme preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
  <div class="sidebar-turn-actions">
    <button disabled={busy || promptActive || gameFinished} onclick={passTurn}>Pass turn</button>
    <button class="danger" disabled={busy || promptActive || gameFinished} onclick={concede}>Concede</button>
  </div>
  <button disabled={switchDisabled} onclick={switchSides}>Switch sides</button>
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
    border: 1px solid var(--surface-toolbar-border);
    background: var(--surface-toolbar-bg);
    border-radius: 6px;
    box-shadow: var(--surface-toolbar-shadow);
    backdrop-filter: blur(var(--backdrop-blur));
    flex-direction: column;
    align-items: stretch;
  }

  .table-toolbar label {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 2px 1px 5px;
    color: var(--text-secondary);
    font-size: 10px;
    line-height: 1.2;
  }

  .table-toolbar button {
    width: 100%;
    border-radius: 5px;
    padding: 6px 7px;
    border-color: var(--button-border);
    background: var(--button-bg);
    color: var(--button-text);
    font-size: 10px;
    font-weight: 700;
  }

  .sidebar-turn-actions {
    display: grid;
    gap: 6px;
    padding-bottom: 5px;
    border-bottom: 1px solid var(--surface-inset-border);
  }

  .table-toolbar button.danger {
    color: var(--danger-text);
  }

  .table-toolbar select {
    min-width: 0;
    width: 100%;
    border: 1px solid var(--input-border);
    border-radius: var(--radius-sm);
    background: var(--input-bg);
    color: var(--input-text);
    font: inherit;
    font-weight: 700;
  }

  .inline-error {
    padding: 6px 8px;
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid var(--danger-border);
    background: var(--danger-bg);
    color: var(--danger-strong);
    font-size: 11px;
  }
</style>
