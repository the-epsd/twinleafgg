<script lang="ts">
  import CardTile from '../../CardTile.svelte';
  import type { IndexedCardView } from '../../../game/prompts';

  type Props = {
    cards: IndexedCardView[];
    selectedIndexes: number[];
    slotCount?: number;
    onremove?: (index: number) => void;
  };

  let {
    cards,
    selectedIndexes,
    slotCount = 0,
    onremove,
  }: Props = $props();

  let slots = $derived(
    Number.isFinite(slotCount) && slotCount > 0
      ? Array.from({ length: slotCount }, (_, index) => index)
      : [],
  );
  let selectedCards = $derived(selectedIndexes
    .map((selectedIndex) => ({
      index: selectedIndex,
      card: cards.find((card, cardIndex) => (card.index ?? cardIndex) === selectedIndex),
    }))
    .filter((item): item is { index: number; card: IndexedCardView } => !!item.card));
</script>

{#if slots.length || selectedCards.length}
  <section class="selected-card-strip" aria-label="Selected cards in order">
    <div class="selected-card-rail">
      {#each slots.length ? slots : selectedCards as slotOrItem, order}
        {@const item = slots.length ? selectedCards[order] : slotOrItem}
        <div class="selected-card-slot" class:empty={!item}>
          {#if item}
            <button
              type="button"
              class="selected-card-chip"
              title={`Remove ${item.card.name}`}
              disabled={!onremove}
              onclick={() => onremove?.(item.index)}
            >
              <CardTile card={item.card} compact />
            </button>
          {:else}
            <div class="selected-card-placeholder" aria-label={`Selection slot ${order + 1}`}>
              <span class="selected-card-order">{order + 1}</span>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </section>
{/if}

<style>
  .selected-card-strip {
    min-height: clamp(112px, 15vh, 156px);
    padding: 10px;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-md);
    background: var(--surface-inset-bg);
    overflow: hidden;
  }

  .selected-card-rail {
    display: flex;
    gap: 10px;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 2px 2px 8px;
  }

  .selected-card-slot {
    position: relative;
    flex: 0 0 clamp(76px, 7vw, 96px);
    width: clamp(76px, 7vw, 96px);
    aspect-ratio: 63 / 88;
    min-width: 0;
  }

  .selected-card-slot.empty {
    opacity: 0.82;
  }

  .selected-card-chip {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    border-radius: var(--radius-sm);
    background: transparent;
    box-shadow: none;
  }

  .selected-card-chip:not(:disabled) {
    cursor: pointer;
  }

  .selected-card-chip:not(:disabled):hover :global(.card-tile) {
    filter: brightness(1.04);
  }

  .selected-card-chip:disabled {
    opacity: 1;
  }

  .selected-card-chip :global(.card-tile) {
    width: 100%;
    height: 100%;
    box-shadow: var(--glow-selected-shadow);
  }

  .selected-card-order {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    color: var(--text-primary);
    font-size: clamp(28px, 3vw, 40px);
    font-weight: 900;
    line-height: 1;
  }

  .selected-card-placeholder {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1px dashed var(--surface-glass-border);
    border-radius: var(--radius-sm);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.08), transparent 48%),
      var(--surface-inset-bg);
  }
</style>
