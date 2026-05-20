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
