<script lang="ts">
  import { labelFor } from '../../game/labels';
  import { promptOptions } from '../../game/prompts';
  import { getSelectableTargets, sameTarget } from '../../game/targets';
  import type { CardTarget, GameView, PromptView } from '../../game/types';
  import { damageForTarget, type DamagePlacement } from '../../../state/promptSelectionModel';

  type Props = {
    game: GameView;
    prompt: PromptView;
    resolving?: boolean;
    damagePlacements?: DamagePlacement[];
    damagePlacedTotal?: number;
    canConfirmDamagePrompt?: boolean;
    onresolve: (value: unknown) => void;
    ondamagePlace: (target: CardTarget) => void;
    ondamageReset: () => void;
    ondamageConfirm: () => void;
  };

  let {
    game,
    prompt,
    resolving = false,
    damagePlacements = [],
    damagePlacedTotal = 0,
    canConfirmDamagePrompt = false,
    onresolve,
    ondamagePlace,
    ondamageReset,
    ondamageConfirm,
  }: Props = $props();

  let sourceTarget = $state<CardTarget | null>(null);
  let selectedTargets = $state<CardTarget[]>([]);
  let options = $derived(promptOptions(prompt));
  let selectableTargets = $derived(getSelectableTargets(game, prompt));
  let selectionPoolSize = $derived(selectableTargets.length || 1);
  let maxSelections = $derived(normalizeSelectionLimit(options.max, normalizeSelectionLimit(options.count, selectionPoolSize)));
  let requiredDamage = $derived(normalizeSelectionLimit(prompt.fields.damage, 0));
  let remainingDamage = $derived(Math.max(0, requiredDamage - damagePlacedTotal));
  let damageStep = $derived(normalizeSelectionLimit(options.damageMultiple, 10));

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
    <div class="damage-progress" aria-live="polite">
      <span>{damagePlacedTotal}/{requiredDamage} placed</span>
      <strong>{remainingDamage} remaining</strong>
    </div>
    <div class="prompt-grid">
      {#each selectableTargets as item}
        <button
          class:selected={damageForTarget(damagePlacements, item.target) > 0}
          disabled={resolving || remainingDamage < damageStep}
          onclick={() => ondamagePlace(item.target)}
        >
          <span>{item.label}</span>
          <strong>+{damageForTarget(damagePlacements, item.target)}</strong>
        </button>
      {/each}
    </div>
    <div class="prompt-actions">
      <button disabled={resolving || damagePlacedTotal === 0} onclick={ondamageReset}>Reset</button>
      <button disabled={resolving || !canConfirmDamagePrompt} onclick={ondamageConfirm}>Confirm</button>
    </div>
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

<style>
  .damage-progress {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.06);
    color: rgba(245, 248, 255, 0.74);
    font-size: 13px;
    font-weight: 800;
  }

  .damage-progress strong {
    color: rgba(255, 248, 235, 0.94);
  }

  .prompt-grid button {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    text-align: left;
  }

  .prompt-grid button > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .prompt-grid button > strong {
    min-width: 36px;
    padding: 4px 7px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    color: rgba(245, 248, 255, 0.82);
    font-size: 12px;
    line-height: 1;
    text-align: center;
  }

  .prompt-grid button.selected > strong {
    background: rgba(194, 65, 12, 0.22);
    color: #fed7aa;
  }
</style>
