<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import { labelFor } from '../../game/labels';
  import { extractPromptCards, promptBlockedIndexes, promptOptions } from '../../game/prompts';
  import type { CardView, PromptView } from '../../game/types';

  type SelectedCard = {
    index: number;
    card: CardView;
  };

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let selectedIndexes = $state<number[]>([]);
  let hidden = $state(false);
  let promptKey = $state('');
  let fields = $derived(prompt.fields ?? {});
  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(fields));
  let selectionPoolSize = $derived(cards.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let minSelections = $derived(normalizeSelectionLimit(options.min, 0));
  let blockedIndexes = $derived(new Set<number>(promptBlockedIndexes(prompt)));
  let selectedCards = $derived(
    selectedIndexes
      .map((index) => ({ index, card: cardForSelection(index) }))
      .filter((item): item is SelectedCard => !!item.card),
  );
  let selectedSlotCount = $derived(
    maxSelections <= 4
      ? maxSelections
      : Math.min(maxSelections, Math.max(minSelections, selectedIndexes.length + 1, 1)),
  );
  let selectedSlots = $derived(Array.from({ length: selectedSlotCount }, (_, index) => selectedCards[index] ?? null));

  $effect(() => {
    const key = `${prompt.id}:${prompt.className}`;
    if (promptKey !== key) {
      promptKey = key;
      hidden = false;
      selectedIndexes = [];
    }
  });

  $effect(() => {
    selectedIndexes = selectedIndexes.filter((index) => isIndexSelectable(index)).slice(0, maxSelections);
  });

  function toggleIndex(index: number) {
    if (!isIndexSelectable(index)) {
      return;
    }
    selectedIndexes = selectedIndexes.includes(index)
      ? selectedIndexes.filter((item) => item !== index)
      : maxSelections <= 1
        ? [index]
        : selectedIndexes.length < maxSelections
          ? [...selectedIndexes, index]
          : selectedIndexes;
  }

  function submitSelectedIndexes() {
    if (selectedIndexes.length >= minSelections) {
      onresolve(selectedIndexes);
      selectedIndexes = [];
    }
  }

  function isIndexSelectable(index: number) {
    if (blockedIndexes.has(index)) {
      return false;
    }
    return matchesCardFilter(cards.find((card, cardIndex) => (card.index ?? cardIndex) === index), fields.filter);
  }

  function cardForSelection(index: number) {
    return cards.find((card, cardIndex) => (card.index ?? cardIndex) === index);
  }

  function matchesCardFilter(card: CardView | undefined, filter: unknown) {
    if (!card || !filter || typeof filter !== 'object') {
      return true;
    }
    return Object.entries(filter as Record<string, unknown>).every(([key, value]) => value === undefined || card[key as keyof CardView] === value);
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
</script>

{#if hidden}
  <section class="prompt-panel prompt-panel-collapsed">
    <button type="button" onclick={() => (hidden = false)}>Show</button>
  </section>
{:else}
  <section class="prompt-panel search-prompt">
    <div class="prompt-title">
      <div>
        <strong>{labelFor(prompt.className)}</strong>
        <span>{labelFor(prompt.message || prompt.type)}</span>
      </div>
    </div>
    {#if !prompt.supported}
      <p class="prompt-warning">{prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.'}</p>
    {/if}

    <div class="search-selection">
      <div class="search-selection-meta">
        <strong>Selected</strong>
        <span>{selectedIndexes.length}/{maxSelections}</span>
      </div>
      <div class="selected-card-slots" aria-label="Selected cards">
        {#each selectedSlots as slot, slotIndex}
          {#if slot}
            <button
              type="button"
              class="selected-card-slot filled"
              disabled={resolving}
              title={`Remove ${slot.card.fullName ?? slot.card.name}`}
              onclick={() => toggleIndex(slot.index)}
            >
              <CardTile card={slot.card} compact />
            </button>
          {:else}
            <div class="selected-card-slot empty">
              <span>{slotIndex + 1}</span>
            </div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="search-card-grid">
      {#each cards as card, index}
        <button
          type="button"
          class:selected={selectedIndexes.includes(card.index ?? index)}
          class:blocked={!isIndexSelectable(card.index ?? index)}
          disabled={resolving || !isIndexSelectable(card.index ?? index)}
          onclick={() => toggleIndex(card.index ?? index)}
        >
          <CardTile card={card} compact />
        </button>
      {/each}
    </div>
    <div class="prompt-actions">
      <button type="button" onclick={() => (hidden = true)}>Hide</button>
      <button disabled={resolving || selectedIndexes.length < minSelections} onclick={submitSelectedIndexes}>Confirm selection</button>
      {#if options.allowCancel}
        <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
      {/if}
    </div>
  </section>
{/if}
