<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import { labelFor } from '../../game/labels';
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

  <p class="prompt-hint">Choose {minSelections}{#if maxSelections !== minSelections}-{maxSelections}{/if} prize card{maxSelections === 1 ? '' : 's'}.</p>
  <div class="prize-prompt-grid">
    {#each prizeChoices as prize}
      <button
        type="button"
        class="prize-choice-card"
        class:selected={selectedIndexes.includes(prize.index)}
        class:blocked={!isIndexSelectable(prize.index)}
        disabled={resolving || !isIndexSelectable(prize.index)}
        onclick={() => toggleIndex(prize.index)}
      >
        {#if prize.cards?.[0]}
          <CardTile card={prize.cards[0]} compact />
        {:else}
          <CardTile card={undefined} compact faceDown />
        {/if}
        <span>Prize {prize.index + 1}</span>
      </button>
    {/each}
  </div>
  <div class="prompt-actions">
    <button disabled={resolving || selectedIndexes.length < minSelections} onclick={submitSelectedIndexes}>
      Take selected prize{minSelections === 1 ? '' : 's'}
    </button>
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  </div>
</section>
