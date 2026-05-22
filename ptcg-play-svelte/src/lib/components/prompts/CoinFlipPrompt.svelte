<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import { labelFor } from '../../game/labels';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();
</script>

<PromptPanel
  title={labelFor(prompt.className)}
  subtitle={labelFor(prompt.message || prompt.type)}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="coin" />{/snippet}
  <p class="prompt-hint">Call the flip.</p>

  {#snippet actions()}
    <button class="primary" disabled={resolving} onclick={() => onresolve(true)}>Heads</button>
    <button class="primary" disabled={resolving} onclick={() => onresolve(false)}>Tails</button>
  {/snippet}
</PromptPanel>
