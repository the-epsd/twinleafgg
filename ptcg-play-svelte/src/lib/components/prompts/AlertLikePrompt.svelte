<script lang="ts">
  import CardTile from '../CardTile.svelte';
  import PromptPanel from './primitives/PromptPanel.svelte';
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

<PromptPanel
  title={labelFor(prompt.className)}
  subtitle={labelFor(prompt.message || prompt.type)}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
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

  {#snippet actions()}
    <button class="primary" disabled={resolving} onclick={() => onresolve(true)}>Continue</button>
  {/snippet}
</PromptPanel>
