<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    debugZones?: boolean;
    children: Snippet;
  };

  let { debugZones = false, children }: Props = $props();
</script>

<section class="table-shell" class:debug-zones={debugZones}>
  {@render children()}
</section>

<style>
  .table-shell {
    --board-card-w: clamp(58px, min(8vw, 8.1vh), 104px);
    --card-w: var(--board-card-w);
    --hand-card-w: min(clamp(96px, min(7.8vw, 14.5vh), 150px), calc(var(--board-card-w) * 1.55));
    --min-table-width: 760px;
    --board-row-gap: calc(var(--board-card-w) * 0.16);
    --active-gap: calc(var(--board-card-w) * 0.24);
    --bench-card-w: calc(var(--board-card-w) * 1.24);
    --bench-row-h: calc(var(--bench-card-w) * 1.42);
    --opponent-hand-height: clamp(58px, 7.2vh, 84px);
    --hand-board-gap: 0px;
    --board-top-inset: calc(var(--opponent-hand-height) + var(--hand-board-gap));
    --hand-hover-pad: calc(var(--board-card-w) * 0.065);
    --hand-hover-clearance: calc(var(--hand-hover-pad) + 12px);
    --hand-shadow-clearance: calc(var(--hand-hover-pad) + 14px);
    --board-bottom-inset: calc((var(--hand-card-w) * 1.397) + (var(--hand-hover-pad) * 2.5) + 14px);
    --board-right-rail: 150px;
    --table-side-gap: 14px;
    --player-panel-right: calc(var(--board-right-rail) + 8px);
    --board-h: calc(100vh - var(--board-top-inset) - var(--board-bottom-inset));
    --board-edge-pad: calc(var(--board-card-w) * 0.32);
    --board-outline-pad-y: calc(var(--board-card-w) * 0.06);
    --board-content-pad: calc(var(--board-card-w) * 0.18);
    --board-edge-pad-x: var(--board-edge-pad);
    --board-content-inset-y: calc(var(--board-outline-pad-y) + var(--board-content-pad));
    --board-content-inset-x: calc(var(--board-edge-pad-x) + var(--board-content-pad));
    width: max(100vw, var(--min-table-width));
    min-width: var(--min-table-width);
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    padding: 0;
    background: var(--app-backdrop-bg);
    -webkit-user-select: none;
    user-select: none;
  }

  .table-shell :global(*) {
    -webkit-user-select: none;
    user-select: none;
  }

  .table-shell :global(img) {
    -webkit-user-drag: none;
  }
</style>
