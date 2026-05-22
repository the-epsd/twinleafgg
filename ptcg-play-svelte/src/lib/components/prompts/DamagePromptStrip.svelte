<script lang="ts">
  import PromptStrip from './primitives/PromptStrip.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    damagePlacedTotal: number;
    damageRequired: number;
    canConfirm: boolean;
    allowCancel?: boolean;
    onresolve: (value: unknown) => void;
    onreset: () => void;
    onconfirm: () => void;
  };

  let {
    prompt,
    resolving = false,
    damagePlacedTotal,
    damageRequired,
    canConfirm,
    allowCancel = false,
    onresolve,
    onreset,
    onconfirm,
  }: Props = $props();

  let remaining = $derived(Math.max(0, damageRequired - damagePlacedTotal));
  let benchY = $state<number | null>(null);

  function measureBench() {
    const bench = document.querySelector<HTMLElement>('.bench-zone.opponent');
    if (bench) {
      benchY = bench.getBoundingClientRect().top;
    }
  }

  $effect(() => {
    measureBench();
    const handle = () => measureBench();
    window.addEventListener('resize', handle);
    const raf = requestAnimationFrame(measureBench);
    return () => {
      window.removeEventListener('resize', handle);
      cancelAnimationFrame(raf);
    };
  });
</script>

<div class="damage-strip-anchor" style:--prompt-strip-anchor-y={benchY !== null ? `${benchY}px` : null}>
  <PromptStrip
    title={prompt.className === 'PutDamagePrompt' ? 'Place damage' : 'Damage'}
    hint="Tap a Pokémon on the board to place damage."
    anchor="top"
  >
    {#snippet icon()}<PromptIcon name="damage" />{/snippet}

    {#snippet meta()}
      <span>{damagePlacedTotal}/{damageRequired}</span>
      {#if remaining > 0}<span class="prompt-strip-meta-secondary">· {remaining} left</span>{/if}
    {/snippet}

    {#snippet actions()}
      {#if allowCancel}
        <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
      {/if}
      <button disabled={resolving || damagePlacedTotal === 0} onclick={onreset}>Reset</button>
      <button class="primary" disabled={resolving || !canConfirm} onclick={onconfirm}>Confirm</button>
    {/snippet}
  </PromptStrip>
</div>

<style>
  .prompt-strip-meta-secondary {
    color: var(--text-muted);
    font-weight: 700;
  }
</style>
