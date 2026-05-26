<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import SelectableCard from './primitives/SelectableCard.svelte';
  import {
    extractPromptCards,
    promptBlockedIndexes,
    promptOptions,
    prunePromptIndexes,
    samePromptIndexes,
  } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let selectedIndexes = $state<number[]>([]);
  let promptKey = $state('');
  let fields = $derived(prompt.fields ?? {});
  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(fields));
  let selectionPoolSize = $derived(cards.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let minSelections = $derived(normalizeSelectionLimit(options.min, 0));
  let blockedIndexes = $derived(new Set<number>(promptBlockedIndexes(prompt)));

  $effect(() => {
    const key = `${prompt.id}:${prompt.className}`;
    if (promptKey !== key) {
      promptKey = key;
      selectedIndexes = [];
    }
  });

  $effect(() => {
    const nextIndexes = prunePromptIndexes(selectedIndexes, isIndexSelectable, maxSelections);
    if (!samePromptIndexes(selectedIndexes, nextIndexes)) {
      selectedIndexes = nextIndexes;
    }
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

  function matchesCardFilter(card: typeof cards[number] | undefined, filter: unknown) {
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

<PromptPanel
  title="Choose Cards"
  variant="search"
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="cards" />{/snippet}

  <div class="search-card-grid">
    {#each cards as card, index}
      {@const cardIndex = card.index ?? index}
      <SelectableCard
        selected={selectedIndexes.includes(cardIndex)}
        blocked={!isIndexSelectable(cardIndex)}
        disabled={resolving || !isIndexSelectable(cardIndex)}
        onclick={() => toggleIndex(cardIndex)}
      >
        <CardTile {card} compact />
      </SelectableCard>
    {/each}
  </div>

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    <button class="primary" disabled={resolving || selectedIndexes.length < minSelections} onclick={submitSelectedIndexes}>
      Confirm
    </button>
  {/snippet}
</PromptPanel>
