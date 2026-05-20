<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import { labelFor } from '../../game/labels';
  import { extractPromptCards, promptBlockedIndexes, promptOptions, prunePromptIndexes, samePromptIndexes } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let selectedIndexes = $state<number[]>([]);
  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(prompt.fields));
  let selectionPoolSize = $derived(cards.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let minSelections = $derived(normalizeSelectionLimit(options.min, 0));
  let blockedIndexes = $derived(new Set<number>(promptBlockedIndexes(prompt)));

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
    return !blockedIndexes.has(index);
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
</script>

<section class="prompt-panel">
  <div class="prompt-title">
    <div>
      <strong>{labelFor(prompt.className)}</strong>
      <span>{labelFor(prompt.message || prompt.type)}</span>
    </div>
  </div>
  {#if !prompt.supported}
    <p class="prompt-warning">{prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.'}</p>
  {/if}

  <p class="prompt-hint">Select {minSelections}{#if maxSelections !== minSelections}-{maxSelections}{/if} card{maxSelections === 1 ? '' : 's'}.</p>
  <div class="prompt-card-list">
    {#each cards as card, index}
      <button
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
    <button disabled={resolving || selectedIndexes.length < minSelections} onclick={submitSelectedIndexes}>Confirm selection</button>
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  </div>
</section>
