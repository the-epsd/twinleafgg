<script lang="ts">
  type Props = {
    boardTilt: number;
    boardPerspective: number;
    boardScaleY: number;
    boardLift: number;
    resetPerspective: () => void;
  };

  let {
    boardTilt = $bindable(),
    boardPerspective = $bindable(),
    boardScaleY = $bindable(),
    boardLift = $bindable(),
    resetPerspective,
  }: Props = $props();
</script>

<details class="board-perspective-controls">
  <summary aria-label="Board perspective settings" title="Board perspective settings">⚙</summary>
  <div class="board-perspective-menu">
    <strong>Board perspective</strong>
    <label>
      Tilt
      <input type="range" min="0" max="18" step="1" bind:value={boardTilt} />
      <span>{boardTilt}deg</span>
    </label>
    <label>
      Depth
      <input type="range" min="700" max="2200" step="50" bind:value={boardPerspective} />
      <span>{boardPerspective}px</span>
    </label>
    <label>
      Height
      <input type="range" min="86" max="100" step="1" bind:value={boardScaleY} />
      <span>{boardScaleY}%</span>
    </label>
    <label>
      Lift
      <input type="range" min="-48" max="48" step="2" bind:value={boardLift} />
      <span>{boardLift}px</span>
    </label>
    <button type="button" onclick={() => resetPerspective()}>Reset</button>
  </div>
</details>

<style>
  .board-perspective-controls {
    position: relative;
    color: var(--text-primary);
    font-size: 11px;
    font-weight: 750;
  }

  .board-perspective-controls summary {
    display: grid;
    place-items: center;
    width: 100%;
    height: 34px;
    border: 1px solid var(--button-border);
    border-radius: 6px;
    background: var(--button-bg);
    box-shadow: var(--surface-toolbar-shadow);
    color: var(--button-text);
    cursor: pointer;
    font-size: 17px;
    line-height: 1;
    user-select: none;
    backdrop-filter: blur(var(--backdrop-blur));
  }

  .board-perspective-controls summary::marker,
  .board-perspective-controls summary::-webkit-details-marker {
    display: none;
  }

  .board-perspective-controls[open] summary {
    background: var(--surface-inset-bg);
  }

  .board-perspective-menu {
    display: grid;
    gap: 7px;
    width: 100%;
    margin-top: 7px;
    padding: 0;
    border-radius: 6px;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: var(--text-secondary);
  }

  .board-perspective-menu strong {
    display: block;
  }

  .board-perspective-menu label {
    display: grid;
    grid-template-columns: 36px minmax(0, 1fr) 42px;
    gap: 6px;
    align-items: center;
    padding: 0;
    margin-top: 0;
  }

  .board-perspective-menu input[type="range"] {
    width: 100%;
  }

  .board-perspective-menu span {
    justify-self: end;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .board-perspective-menu button {
    width: 100%;
    margin-top: 8px;
    border-radius: 6px;
    padding: 6px 8px;
    border-color: var(--button-border);
    background: var(--button-bg);
    color: var(--button-text);
    font-size: 11px;
  }
</style>
