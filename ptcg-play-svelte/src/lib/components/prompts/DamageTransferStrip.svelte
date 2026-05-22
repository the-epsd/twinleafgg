<script lang="ts">
  import PromptStrip from './primitives/PromptStrip.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    sourceLabel: string | null;
    destinationLabel: string | null;
    counterCount: number;
    minCounters: number;
    maxCounters: number;
    damagePerCounter: number;
    allowCancel?: boolean;
    onresolve: (value: unknown) => void;
    onreset: () => void;
    onconfirm: () => void;
  };

  let {
    prompt,
    resolving = false,
    sourceLabel,
    destinationLabel,
    counterCount,
    minCounters,
    maxCounters,
    damagePerCounter,
    allowCancel = false,
    onresolve,
    onreset,
    onconfirm,
  }: Props = $props();

  let damageMoved = $derived(counterCount * damagePerCounter);
  let damageMax = $derived(maxCounters * damagePerCounter);
  let canConfirm = $derived(counterCount >= minCounters && counterCount > 0);
  let atMax = $derived(counterCount >= maxCounters);

  let title = $derived(prompt.className === 'RemoveDamagePrompt' ? 'Remove damage' : 'Move damage');

  let hint = $derived.by(() => {
    if (!sourceLabel) {
      return 'Pick a damaged Pokémon to move damage from.';
    }
    if (!destinationLabel) {
      return `Moving from ${sourceLabel} — pick where the damage goes.`;
    }
    if (atMax) {
      return `Moving ${damageMoved} damage from ${sourceLabel} to ${destinationLabel}.`;
    }
    return `Moving from ${sourceLabel} to ${destinationLabel}. Tap ${destinationLabel} again for more (up to ${damageMax}).`;
  });
</script>

<PromptStrip {title} {hint} anchor="top">
  {#snippet icon()}<PromptIcon name="damage" />{/snippet}

  {#snippet meta()}
    <span>{damageMoved}/{damageMax}</span>
    {#if counterCount > 0}<span class="prompt-strip-meta-secondary">· {counterCount}/{maxCounters} counters</span>{/if}
  {/snippet}

  {#snippet actions()}
    {#if allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    <button disabled={resolving || counterCount === 0} onclick={onreset}>Reset</button>
    <button class="primary" disabled={resolving || !canConfirm} onclick={onconfirm}>Confirm</button>
  {/snippet}
</PromptStrip>

<style>
  .prompt-strip-meta-secondary {
    color: var(--text-muted);
    font-weight: 700;
  }
</style>
