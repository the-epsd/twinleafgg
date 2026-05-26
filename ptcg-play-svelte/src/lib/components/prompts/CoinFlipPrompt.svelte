<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import { promptSubtitle } from '../../game/promptCopy';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();
</script>

<PromptPanel
  title="Heads or tails?"
  subtitle={promptSubtitle(prompt, 'Heads or tails?')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="coin" />{/snippet}

  {#snippet actions()}
    <button class="primary" disabled={resolving} onclick={() => onresolve(true)}>Heads</button>
    <button class="primary" disabled={resolving} onclick={() => onresolve(false)}>Tails</button>
  {/snippet}
</PromptPanel>
