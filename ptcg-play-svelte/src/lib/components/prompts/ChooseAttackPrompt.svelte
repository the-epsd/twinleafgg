<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import { promptTitle } from '../../game/promptCopy';
  import { extractPromptCards, promptOptions } from '../../game/prompts';
  import type { PromptView } from '../../game/types';

  type AttackChoice = {
    cardIndex: number;
    cardName: string;
    attackName: string;
    blocked: boolean;
  };

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();

  let options = $derived(promptOptions(prompt));
  let cards = $derived(extractPromptCards(prompt.fields));
  let attackChoices = $derived(cards.flatMap((card, cardIndex) =>
    (card.attacks ?? []).map((attack) => ({
      cardIndex: card.index ?? cardIndex,
      cardName: card.name,
      attackName: attack.name,
      blocked: isBlockedAttack(card.index ?? cardIndex, attack.name),
    } satisfies AttackChoice)),
  ));
  let multipleCards = $derived(new Set(attackChoices.map((choice) => choice.cardIndex)).size > 1);

  function isBlockedAttack(cardIndex: number, attackName: string) {
    const blocked = options.blocked;
    return Array.isArray(blocked)
      && blocked.some((item) => item?.index === cardIndex && item?.attack === attackName);
  }
</script>

<PromptPanel
  title={promptTitle(prompt, 'Choose attack')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="attack" />{/snippet}

  <div class="prompt-grid">
    {#each attackChoices as choice}
      <button
        class="attack-choice"
        disabled={resolving || choice.blocked}
        title={multipleCards ? `${choice.cardName}: ${choice.attackName}` : choice.attackName}
        onclick={() => onresolve({ index: choice.cardIndex, attack: choice.attackName })}
      >
        {#if multipleCards}<span>{choice.cardName}</span>{/if}
        <strong>{choice.attackName}</strong>
      </button>
    {/each}
  </div>

  {#snippet actions()}
    {#if options.allowCancel}
      <button disabled={resolving} onclick={() => onresolve(null)}>Cancel</button>
    {/if}
  {/snippet}
</PromptPanel>

<style>
  .attack-choice {
    min-height: 46px;
    justify-items: start;
    text-align: left;
  }

  .attack-choice span {
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 800;
  }

  .attack-choice strong {
    color: var(--text-primary);
    font-size: 14px;
    line-height: 1.15;
  }
</style>
