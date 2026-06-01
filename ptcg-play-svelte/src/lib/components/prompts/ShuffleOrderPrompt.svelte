<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import SelectableCard from './primitives/SelectableCard.svelte';
  import SelectedCardStrip from './primitives/SelectedCardStrip.svelte';
  import { promptTitle } from '../../game/promptCopy';
  import { extractPromptCards, promptOptions } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let selectedIndexes = $state<number[]>([]);
  let promptKey = $state('');
  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(prompt.fields));
  let allCardIndexes = $derived(cards.map((card, index) => card.index ?? index));
  let hasCompleteOrder = $derived(selectedIndexes.length === cards.length);

  $effect(() => {
    const key = `${prompt.id}:${prompt.className}:${cards.length}`;
    if (promptKey !== key) {
      promptKey = key;
      selectedIndexes = allCardIndexes;
    }
  });

  $effect(() => {
    const allowed = new Set(allCardIndexes);
    const nextIndexes = selectedIndexes.filter((index) => allowed.has(index));
    if (nextIndexes.length !== selectedIndexes.length || nextIndexes.some((index, order) => selectedIndexes[order] !== index)) {
      selectedIndexes = nextIndexes;
    }
  });

  function useListedOrder() {
    if (hasCompleteOrder) {
      onresolve(selectedIndexes);
    }
  }

  function toggleIndex(index: number) {
    selectedIndexes = selectedIndexes.includes(index)
      ? selectedIndexes.filter((item) => item !== index)
      : [...selectedIndexes, index];
  }

  function resetOrder() {
    selectedIndexes = allCardIndexes;
  }

  function clearOrder() {
    selectedIndexes = [];
  }
</script>

<PromptPanel
  title={promptTitle(prompt)}
  variant="search"
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="shuffle" />{/snippet}

  <SelectedCardStrip
    {cards}
    {selectedIndexes}
    slotCount={cards.length}
    onremove={toggleIndex}
  />

  <div class="search-card-grid">
    {#each cards as card, index}
      {@const cardIndex = card.index ?? index}
      <SelectableCard
        selected={selectedIndexes.includes(cardIndex)}
        disabled={resolving}
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
    <button disabled={resolving} onclick={clearOrder}>Clear order</button>
    <button disabled={resolving} onclick={resetOrder}>Reset</button>
    <button class="primary" disabled={resolving || !hasCompleteOrder} onclick={useListedOrder}>Continue</button>
  {/snippet}
</PromptPanel>
