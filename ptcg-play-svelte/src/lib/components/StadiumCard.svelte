<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { CardView, PlayerView } from '../game/types';

  type ZoneName = 'discard' | 'lostZone' | 'stadium' | 'playZone';

  type Props = {
    card: CardView;
    owner: PlayerView;
    placement: 'top' | 'bottom';
    showZone: (playerIndex: number, zone: ZoneName, title: string, faceDown?: boolean) => void;
  };

  let { card, owner, placement, showZone }: Props = $props();
</script>

<button
  type="button"
  class="stadium-card"
  class:top-stadium-card={placement === 'top'}
  class:bottom-stadium-card={placement === 'bottom'}
  title={card.fullName}
  onclick={() => showZone(owner.index, 'stadium', `${owner.name} stadium`)}
>
  <CardTile {card} compact />
</button>

<style>
  .stadium-card {
    position: relative;
    z-index: 2;
    width: var(--card-w);
    aspect-ratio: 63 / 88;
    padding: 0;
    border: 0;
    border-radius: 5px;
    background: transparent;
    box-shadow: none;
    pointer-events: auto;
  }

  :global(.debug-zones) .stadium-card {
    outline: 2px solid rgba(217, 70, 239, 0.9);
    outline-offset: 4px;
  }

  .stadium-card :global(.card-tile) {
    width: 100%;
    height: 100%;
  }

  .top-stadium-card {
    grid-row: 1;
    grid-column: 1;
    justify-self: end;
    align-self: center;
    margin-right: calc(var(--card-w) * 0.92);
  }

  .top-stadium-card :global(.card-tile) {
    transform: rotate(180deg);
  }

  .bottom-stadium-card {
    grid-row: 3;
    grid-column: 3;
    justify-self: start;
    align-self: center;
    margin-left: calc(var(--card-w) * 0.92);
  }
</style>
