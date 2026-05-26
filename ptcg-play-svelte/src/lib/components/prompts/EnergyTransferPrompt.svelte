<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import { promptTitle } from '../../game/promptCopy';
  import { promptOptions } from '../../game/prompts';
  import { getSelectableTargets, sameTarget } from '../../game/targets';
  import type { CardTarget, GameView, PromptView } from '../../game/types';

  type Props = {
    game: GameView;
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { game, prompt, resolving = false, onresolve }: Props = $props();

  let sourceTarget = $state<CardTarget | null>(null);
  let selectedTargets = $state<CardTarget[]>([]);
  let attachEnergyIndex = $state(0);
  let options = $derived(promptOptions(prompt));
  let selectableTargets = $derived(getSelectableTargets(game, prompt));
  let selectionPoolSize = $derived(selectableTargets.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));

  let isDiscard = $derived(prompt.className === 'DiscardEnergyPrompt');
  let canSubmit = $derived(
    !!sourceTarget && (isDiscard || selectedTargets.length > 0),
  );

  function toggleTarget(target: CardTarget) {
    const exists = selectedTargets.some((item) => sameTarget(item, target));
    if (exists) {
      selectedTargets = selectedTargets.filter((item) => !sameTarget(item, target));
      return;
    }
    if (maxSelections <= 1) {
      selectedTargets = [target];
      return;
    }
    if (selectedTargets.length < maxSelections) {
      selectedTargets = [...selectedTargets, target];
    }
  }

  function submit() {
    if (!sourceTarget) {
      return;
    }
    if (isDiscard) {
      onresolve([{ from: sourceTarget, index: attachEnergyIndex }]);
    } else if (selectedTargets.length > 0) {
      onresolve([{ from: sourceTarget, to: selectedTargets[0], index: attachEnergyIndex }]);
    }
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
</script>

<PromptPanel
  title={promptTitle(prompt, isDiscard ? 'Discard energy' : 'Move energy')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="energy" />{/snippet}

  <label class="inline-field">
    Energy index
    <input type="number" min="0" bind:value={attachEnergyIndex} />
  </label>
  <p class="prompt-hint">Choose source{isDiscard ? '' : ', then destination'}.</p>
  <div class="prompt-grid">
    {#each selectableTargets as item}
      <button
        class:selected={sourceTarget && sameTarget(sourceTarget, item.target)}
        disabled={resolving}
        onclick={() => (sourceTarget = item.target)}
      >
        From {item.label}
      </button>
    {/each}
  </div>
  {#if !isDiscard}
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
          disabled={resolving}
          onclick={() => toggleTarget(item.target)}
        >
          To {item.label}
        </button>
      {/each}
    </div>
  {/if}

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    <button class="primary" disabled={resolving || !canSubmit} onclick={submit}>Confirm</button>
  {/snippet}
</PromptPanel>
