<script lang="ts">
  import { labelFor } from '../../game/labels';
  import { extractPromptCards, promptOptions } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(prompt.fields));

  function useListedOrder() {
    onresolve(cards.map((card, index) => card.index ?? index));
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

  <p class="prompt-hint">Keep the shown order to continue.</p>
  <div class="prompt-actions">
    <button disabled={resolving} onclick={useListedOrder}>Continue</button>
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  </div>
</section>
