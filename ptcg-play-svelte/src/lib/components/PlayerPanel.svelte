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
    --card-w: clamp(112px, min(7vw, 13.2vh), 154px);
    top: 0;
    left: 14px;
    right: 158px;
    height: calc(var(--board-top-inset) - var(--hand-separator-gap));
    overflow: visible;
    align-items: end;
  }

  .player-panel.bottom {
    --card-w: clamp(116px, min(7.8vw, 14.5vh), 150px);
    top: calc(100vh - var(--board-bottom-inset) + var(--hand-separator-gap) - var(--hand-hover-pad));
    left: 14px;
    right: 158px;
    bottom: 8px;
    align-items: start;
  }
</style>
