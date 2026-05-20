<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import { labelFor } from '../../game/labels';
  import { extractPromptCards } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    autoContinue?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, autoContinue = false, onresolve }: Props = $props();
  let cards = $derived(extractPromptCards(prompt.fields));
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

  {#if cards.length}
    <div class="prompt-card-list">
      {#each cards as card}
        <CardTile {card} compact />
      {/each}
    </div>
  {/if}
  {#if autoContinue}
    <p class="prompt-hint">Auto-continues in 3 seconds.</p>
  {/if}
  <button disabled={resolving} onclick={() => onresolve(true)}>Continue</button>
</section>
