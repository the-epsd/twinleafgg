<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { PlayerView } from '../game/types';

  export let player: PlayerView;
  export let selectedHand: { playerIndex: number; handIndex: number } | null = null;
  export let disabled = false;
  export let concealed = false;
  export let onSelect: (playerIndex: number, handIndex: number) => void;
  export let onDrag: (playerIndex: number, handIndex: number, event: DragEvent) => void;
</script>

<div class:disabled class:concealed class="hand">
  {#each player.hand as card, index}
    <CardTile
      {card}
      compact
      selected={selectedHand?.playerIndex === player.index && selectedHand.handIndex === index}
      draggable={!disabled && !concealed}
      {disabled}
      interactive={!disabled && !concealed}
      faceDown={concealed}
      testId={`hand-card-${player.index}-${index}`}
      on:click={() => onSelect(player.index, index)}
      on:dragstart={(event) => onDrag(player.index, index, event)}
    />
  {/each}
</div>
