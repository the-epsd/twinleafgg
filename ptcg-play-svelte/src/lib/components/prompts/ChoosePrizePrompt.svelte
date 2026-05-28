<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import SelectableCard from './primitives/SelectableCard.svelte';
  import { promptTitle } from '../../game/promptCopy';
  import { promptBlockedIndexes, promptOptions, prunePromptIndexes, samePromptIndexes } from '../../game/prompts';
  import type { CardView, GameView, PromptView } from '../../game/types';

  type PrizeChoice = {
    index: number;
    cards?: CardView[];
  };

  type Props = {
    game: GameView;
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { game, prompt, resolving = false, onresolve }: Props = $props();

  let selectedIndexes = $state<number[]>([]);
  let options = $derived(promptOptions(prompt));
  let prizeChoices = $derived(extractPrizes(prompt.fields, prompt.playerIndex));
  let selectionPoolSize = $derived(prizeChoices.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let minSelections = $derived(normalizeSelectionLimit(options.min, normalizeSelectionLimit(options.count, 1)));
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

  function extractPrizes(rawFields: Record<string, unknown>, promptPlayerIndex: number): PrizeChoice[] {
    if (Array.isArray(rawFields.prizes)) {
      return rawFields.prizes as PrizeChoice[];
    }
    const promptPlayer = game.players[promptPlayerIndex];
    const count = promptPlayer?.prizesLeft ?? normalizeSelectionLimit(promptOptions(prompt).count, 6);
    return Array.from({ length: count }, (_, index) => ({ index, cards: [] }));
  }
</script>

<PromptPanel
  title={promptTitle(prompt, 'Choose prize')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="prize" />{/snippet}

  <div class="prize-prompt-grid">
    {#each prizeChoices as prize}
      <SelectableCard
        selected={selectedIndexes.includes(prize.index)}
        blocked={!isIndexSelectable(prize.index)}
        disabled={resolving || !isIndexSelectable(prize.index)}
        onclick={() => toggleIndex(prize.index)}
      >
        {#if prize.cards?.[0]}
          <CardTile card={prize.cards[0]} compact />
        {:else}
          <CardTile card={undefined} compact faceDown />
        {/if}
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
