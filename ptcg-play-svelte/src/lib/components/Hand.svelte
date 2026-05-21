<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { PlayerView } from '../game/types';

  type Props = {
    player: PlayerView;
    selectedHand?: { playerIndex: number; handIndex: number } | null;
    disabled?: boolean;
    concealed?: boolean;
    playableIndexes?: number[];
    placedIndexes?: number[];
    onSelect: (playerIndex: number, handIndex: number) => void;
    onDrag: (playerIndex: number, handIndex: number, event: DragEvent) => void;
    onDragEnd?: () => void;
  };

  let {
    player,
    selectedHand = null,
    disabled = false,
    concealed = false,
    playableIndexes = [],
    placedIndexes = [],
    onSelect,
    onDrag,
    onDragEnd = () => {},
  }: Props = $props();

  let playableSet = $derived(new Set(playableIndexes));
  let placedSet = $derived(new Set(placedIndexes));
  let hasPlayableFilter = $derived(playableIndexes.length > 0);
</script>

<div class:disabled class:concealed class="hand" data-card-count={player.hand.length}>
  {#each player.hand as card, index}
    {@const cardDisabled = disabled || (hasPlayableFilter && (!playableSet.has(index) || placedSet.has(index)))}
    {#if !placedSet.has(index)}
      <CardTile
        {card}
        compact
        selected={selectedHand?.playerIndex === player.index && selectedHand.handIndex === index}
        playable={playableSet.has(index)}
        draggable={!cardDisabled && !concealed}
        disabled={cardDisabled}
        interactive={!cardDisabled && !concealed}
        faceDown={concealed}
        testId={`hand-card-${player.index}-${index}`}
        onclick={() => onSelect(player.index, index)}
        ondragstart={(event) => onDrag(player.index, index, event)}
        ondragend={onDragEnd}
      />
    {/if}
  {/each}
</div>

<style>
  .hand {
    position: relative;
    z-index: 1;
    min-width: 0;
    min-height: calc(var(--card-w) * 1.42);
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: calc(var(--card-w) * 0.1);
    overflow: visible;
    padding: 10px 4px;
    pointer-events: auto;
    scrollbar-width: thin;
  }

  :global(.debug-zones) .hand {
    outline: 2px dashed rgba(236, 72, 153, 0.86);
    outline-offset: -4px;
    background: rgba(236, 72, 153, 0.08);
  }

  .hand.concealed {
    justify-content: center;
    min-height: calc(var(--card-w) * 1.42);
    overflow: visible;
    pointer-events: none;
  }

  .hand.concealed :global(.card-tile) {
    width: calc(var(--card-w) * 0.78);
    margin-right: calc(var(--card-w) * -0.46);
    transform: translateY(calc(var(--card-w) * -0.52));
  }

  .hand.concealed :global(.card-tile.compact) {
    width: calc(var(--card-w) * 0.8);
  }

  .hand.concealed::after {
    content: attr(data-card-count);
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 4;
    min-width: 34px;
    min-height: 34px;
    display: grid;
    place-items: center;
    transform: translate(-50%, -50%);
    border-radius: 999px;
    border: 1px solid rgba(18, 21, 26, 0.14);
    background: rgba(248, 249, 250, 0.88);
    color: #303842;
    box-shadow: 0 4px 12px rgba(23, 30, 38, 0.16);
    font-size: 17px;
    font-weight: 900;
    pointer-events: none;
  }

  :global(.player-panel.top) .hand {
    height: 100%;
    min-height: 0;
    padding: 0 4px;
    align-items: end;
    overflow: visible;
  }

  :global(.player-panel.top) .hand.concealed :global(.card-tile) {
    width: var(--card-w);
    transform: none;
  }

  :global(.player-panel.top) .hand.concealed::after {
    top: calc(100% + 2px);
  }

  :global(.player-panel.bottom) .hand {
    min-height: 0;
    align-items: start;
    padding-top: var(--hand-hover-pad);
    padding-bottom: calc(var(--hand-hover-pad) * 0.65);
  }
</style>
