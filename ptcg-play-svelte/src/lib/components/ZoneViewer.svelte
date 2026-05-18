<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import CardTile from './CardTile.svelte';
  import type { CardView } from '../game/types';

  export let title = '';
  export let cards: CardView[] = [];
  export let faceDown = false;
  export let open = false;

  const dispatch = createEventDispatcher<{ close: void }>();
</script>

{#if open}
  <section class="zone-viewer" aria-label={title}>
    <div class="zone-viewer-header">
      <strong>{title}</strong>
      <span>{cards.length} card{cards.length === 1 ? '' : 's'}</span>
      <button type="button" on:click={() => dispatch('close')}>Close</button>
    </div>
    {#if cards.length}
      <div class="zone-card-grid">
        {#each cards as card, index}
          <CardTile {card} compact faceDown={faceDown} testId={`zone-card-${index}`} />
        {/each}
      </div>
    {:else}
      <p class="zone-empty">Empty</p>
    {/if}
  </section>
{/if}
