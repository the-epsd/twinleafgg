<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { PlayerView } from '../game/types';

  export let player: PlayerView;
  export let selectedHand: { playerIndex: number; handIndex: number } | null = null;
  export let disabled = false;
  export let concealed = false;
  export let playableIndexes: number[] = [];
  export let placedIndexes: number[] = [];
  export let onSelect: (playerIndex: number, handIndex: number) => void;
  export let onDrag: (playerIndex: number, handIndex: number, event: DragEvent) => void;
  export let onDragEnd: () => void = () => {};

  $: playableSet = new Set(playableIndexes);
  $: placedSet = new Set(placedIndexes);
  $: hasPlayableFilter = playableIndexes.length > 0;
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
        on:click={() => onSelect(player.index, index)}
        on:dragstart={(event) => onDrag(player.index, index, event)}
        on:dragend={onDragEnd}
      />
    {/if}
  {/each}
</div>
