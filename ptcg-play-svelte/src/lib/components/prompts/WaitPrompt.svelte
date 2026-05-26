<script lang="ts">
  import PromptPanel from './primitives/PromptPanel.svelte';
  import PromptIcon from './primitives/PromptIcon.svelte';
  import { promptTitle } from '../../game/promptCopy';
  import type { PromptView } from '../../game/types';

  type Props = {
    prompt: PromptView;
    resolving?: boolean;
    onresolve: (value: unknown) => void;
  };

  let { prompt, resolving = false, onresolve }: Props = $props();
</script>

<PromptPanel
  title={promptTitle(prompt, 'Waiting for opponent')}
  warning={!prompt.supported ? (prompt.unsupportedReason ?? 'This prompt needs the advanced resolver.') : undefined}
>
  {#snippet icon()}<PromptIcon name="hourglass" />{/snippet}

  {#snippet actions()}
    <button disabled={resolving} onclick={() => onresolve(null)}>Continue</button>
  {/snippet}
</PromptPanel>
