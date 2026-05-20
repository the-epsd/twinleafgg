<script lang="ts">
  import CardTile from './CardTile.svelte';
  import type { CardView } from '../game/types';

  type Props = {
    title?: string;
    cards?: CardView[];
    faceDown?: boolean;
    open?: boolean;
    close: () => void;
  };

  let { title = '', cards = [], faceDown = false, open = false, close }: Props = $props();
</script>

{#if open}
  <button type="button" class="zone-viewer-backdrop" aria-label="Close zone viewer" onclick={close}></button>
  <section class="zone-viewer" aria-label={title}>
    <div class="zone-viewer-header">
      <strong>{title}</strong>
      <span>{cards.length} card{cards.length === 1 ? '' : 's'}</span>
      <button type="button" onclick={close}>Close</button>
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
