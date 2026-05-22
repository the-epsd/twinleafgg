<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import { labelFor } from '../../game/labels';
  import { promptOptions } from '../../game/prompts';
  import { getDamageTransferTargets, getSelectableTargets, sameTarget } from '../../game/targets';
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
  let options = $derived(promptOptions(prompt));
  let selectableTargets = $derived(getSelectableTargets(game, prompt));
  let sourceTargets = $derived(getDamageTransferTargets(game, prompt, 'blockedFrom'));
  let destinationTargets = $derived(getDamageTransferTargets(game, prompt, 'blockedTo'));
  let selectionPoolSize = $derived(selectableTargets.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));

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

  $effect(() => {
    if (sourceTarget && !sourceTargets.some((item) => sameTarget(item.target, sourceTarget!))) {
      sourceTarget = null;
    }
    selectedTargets = selectedTargets.filter((target) => destinationTargets.some((item) => sameTarget(item.target, target)));
  });

  function submitMoveDamage() {
    if (sourceTarget && selectedTargets.length > 0) {
      onresolve(selectedTargets.map((target) => ({ from: sourceTarget, to: target })));
    }
  }

  function normalizeSelectionLimit(raw: unknown, fallback: number) {
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  }
</script>

<PromptPanel
  title={labelFor(prompt.className)}
  subtitle={labelFor(prompt.message || prompt.type)}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="damage" />{/snippet}

  <p class="prompt-hint">Choose source, then destination.</p>
  <div class="prompt-grid">
    {#each sourceTargets as item}
      <button
        class:selected={sourceTarget && sameTarget(sourceTarget, item.target)}
        disabled={resolving}
        onclick={() => (sourceTarget = item.target)}
      >
        From {item.label}
      </button>
    {/each}
  </div>
  <div class="prompt-grid">
    {#each destinationTargets as item}
      <button
        class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
        disabled={resolving}
        onclick={() => toggleTarget(item.target)}
      >
        To {item.label}
      </button>
    {/each}
  </div>

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    <button
      class="primary"
      disabled={resolving || !sourceTarget || selectedTargets.length === 0}
      onclick={submitMoveDamage}
    >
      Confirm
    </button>
  {/snippet}
</PromptPanel>
