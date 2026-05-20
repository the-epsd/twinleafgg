<script lang="ts">
  import { labelFor } from '../../game/labels';
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
  let damageAmount = $state(10);
  let options = $derived(promptOptions(prompt));
  let selectableTargets = $derived(getSelectableTargets(game, prompt));
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

  function submitDamage() {
    if (selectedTargets.length > 0) {
      onresolve(selectedTargets.map((target) => ({ target, damage: damageAmount })));
    }
  }

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

  {#if prompt.className === 'PutDamagePrompt'}
    <label class="inline-field">
      Damage
      <input type="number" min="0" step={options.damageMultiple ?? 10} bind:value={damageAmount} />
    </label>
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={selectedTargets.some((target) => sameTarget(target, item.target))}
          disabled={resolving}
          onclick={() => toggleTarget(item.target)}
        >
          {item.label}
        </button>
      {/each}
    </div>
    <button disabled={resolving || selectedTargets.length === 0} onclick={submitDamage}>Apply</button>
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  {:else}
    <p class="prompt-hint">Choose source, then destination.</p>
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button class:selected={sourceTarget && sameTarget(sourceTarget, item.target)} disabled={resolving} onclick={() => (sourceTarget = item.target)}>
          From {item.label}
        </button>
      {/each}
    </div>
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
    <button disabled={resolving || !sourceTarget || selectedTargets.length === 0} onclick={submitMoveDamage}>Move</button>
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  {/if}
</section>
