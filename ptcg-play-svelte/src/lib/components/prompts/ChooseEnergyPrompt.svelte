<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptMeta from './primitives/PromptMeta.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import SelectableCard from './primitives/SelectableCard.svelte';
  import { promptTitle } from '../../game/promptCopy';
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
  let minSelections = $derived(normalizeSelectionLimit(options.min, Array.isArray(prompt.fields.cost) ? prompt.fields.cost.length : 1));
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

  function isIndexSelectable(index: number) {
    return !blockedIndexes.has(index);
  }

  function submitSelectedIndexes() {
    if (selectedIndexes.length >= minSelections) {
      onresolve(selectedIndexes);
    }
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
</script>

<PromptPanel
  title={promptTitle(prompt, 'Choose energy')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="energy" />{/snippet}
  <PromptMeta label="Energy to pay" current={selectedIndexes.length} max={maxSelections} min={minSelections} />

  <div class="prompt-card-list">
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
