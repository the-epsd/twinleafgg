<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
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

<PromptPanel
  title={labelFor(prompt.className)}
  subtitle={labelFor(prompt.message || prompt.type)}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="shuffle" />{/snippet}
  <p class="prompt-hint">Keep the shown order to continue.</p>

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
    <button class="primary" disabled={resolving} onclick={useListedOrder}>Continue</button>
  {/snippet}
</PromptPanel>
