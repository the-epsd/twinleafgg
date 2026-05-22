<script lang="ts">
  import PromptIcon from './primitives/PromptIcon.svelte';
  import PromptStrip from './primitives/PromptStrip.svelte';
  import type { BoardInteractionStrategy } from '../../game/boardInteraction';

  type Props = {
    strategy: BoardInteractionStrategy;
    resolving?: boolean;
  };

  let { strategy, resolving = false }: Props = $props();
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

<div class="board-prompt-strip-anchor" style:--prompt-strip-anchor-y={benchY !== null ? `${benchY}px` : null}>
  <PromptStrip title={strategy.title} hint={strategy.hint} anchor="top">
    {#snippet icon()}<PromptIcon name={strategy.iconName} />{/snippet}

    {#snippet meta()}
      <span>{strategy.meta.current}/{strategy.meta.max}</span>
      {#if strategy.meta.secondary}
        <span class="prompt-strip-meta-secondary">· {strategy.meta.secondary}</span>
      {/if}
    {/snippet}

    {#snippet actions()}
      {#if strategy.allowCancel}
        <button disabled={resolving} onclick={strategy.cancel}>Cancel</button>
      {/if}
      <button disabled={resolving || !strategy.canReset} onclick={strategy.reset}>Reset</button>
      <button class="primary" disabled={resolving || !strategy.canConfirm} onclick={strategy.confirm}>Confirm</button>
    {/snippet}
  </PromptStrip>
</div>

<style>
  .prompt-strip-meta-secondary {
    color: var(--text-muted);
    font-weight: 700;
  }
</style>
