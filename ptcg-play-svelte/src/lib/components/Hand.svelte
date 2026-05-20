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
