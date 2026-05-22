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

  function isBlockedAttack(cardIndex: number, attackName: string) {
    const blocked = options.blocked;
    return Array.isArray(blocked)
      && blocked.some((item) => item?.index === cardIndex && item?.attack === attackName);
  }
</script>

<PromptPanel
  title={labelFor(prompt.className)}
  subtitle={labelFor(prompt.message || prompt.type)}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="attack" />{/snippet}

  <div class="prompt-grid">
    {#each cards as card, cardIndex}
      {#each card.attacks ?? [] as attack}
        <button
          disabled={resolving || isBlockedAttack(card.index ?? cardIndex, attack.name)}
          onclick={() => onresolve({ index: card.index ?? cardIndex, attack: attack.name })}
        >
          <strong>{card.name}: {attack.name}</strong>
          {#if attack.damage}<span>{attack.damage}</span>{/if}
        </button>
      {/each}
    {/each}
  </div>

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  {/snippet}
</PromptPanel>
