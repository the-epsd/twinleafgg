<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    side: 'top' | 'bottom';
    children: Snippet;
  };

  let { side, children }: Props = $props();
</script>

<section class={`player-panel ${side}`}>
  {@render children()}
</section>

<style>
  .player-panel {
    position: absolute;
    z-index: 10;
    min-width: 0;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  :global(.debug-zones) .player-panel {
    outline: 2px solid rgba(236, 72, 153, 0.78);
    outline-offset: -2px;
    background: rgba(236, 72, 153, 0.08);
  }

  .player-panel.top {
    --card-w: var(--hand-card-w);
    top: 0;
    left: var(--table-side-gap);
    right: var(--player-panel-right);
    height: var(--opponent-hand-height);
    overflow: visible;
    align-items: end;
  }

  .player-panel.bottom {
    --card-w: var(--hand-card-w);
    top: calc(100vh - var(--board-bottom-inset) + var(--hand-board-gap) - var(--hand-hover-clearance));
    left: var(--table-side-gap);
    right: var(--player-panel-right);
    bottom: 8px;
    align-items: start;
  }
</style>
