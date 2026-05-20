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
    --board-top-inset: clamp(58px, 7.2vh, 84px);
    --board-bottom-inset: clamp(166px, 19.5vh, 232px);
    --board-right-rail: 150px;
    --board-h: calc(100vh - var(--board-top-inset) - var(--board-bottom-inset));
    --card-w: clamp(58px, min(8vw, calc(var(--board-h) / 9.05)), 104px);
    --hand-separator-gap: calc(var(--card-w) * 0.045);
    --hand-hover-pad: calc(var(--card-w) * 0.065);
    --board-edge-pad: calc(var(--card-w) * 0.32);
    --board-outline-pad-y: calc(var(--card-w) * 0.06);
    --board-content-pad: calc(var(--card-w) * 0.18);
    --board-edge-pad-x: var(--board-edge-pad);
    --board-content-inset-y: calc(var(--board-outline-pad-y) + var(--board-content-pad));
    --board-content-inset-x: calc(var(--board-edge-pad-x) + var(--board-content-pad));
    min-height: 100vh;
    position: relative;
    overflow: hidden;
    padding: 0;
    background:
      radial-gradient(circle at 50% 48%, rgba(255, 255, 255, 0.34), transparent 32%),
      #dfe1e5;
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
