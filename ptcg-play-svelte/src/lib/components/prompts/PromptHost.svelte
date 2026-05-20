<script lang="ts">
  import AlertLikePrompt from './AlertLikePrompt.svelte';
  import AttachEnergyPrompt from './AttachEnergyPrompt.svelte';
  import CardListPrompt from './CardListPrompt.svelte';
  import ChooseAttackPrompt from './ChooseAttackPrompt.svelte';
  import ChooseCardsPrompt from './ChooseCardsPrompt.svelte';
  import ChooseEnergyPrompt from './ChooseEnergyPrompt.svelte';
  import ChoosePrizePrompt from './ChoosePrizePrompt.svelte';
  import CoinFlipPrompt from './CoinFlipPrompt.svelte';
  import ConfirmPrompt from './ConfirmPrompt.svelte';
  import DamagePrompt from './DamagePrompt.svelte';
  import EnergyTransferPrompt from './EnergyTransferPrompt.svelte';
  import SelectPrompt from './SelectPrompt.svelte';
  import ShuffleOrderPrompt from './ShuffleOrderPrompt.svelte';
  import WaitPrompt from './WaitPrompt.svelte';
  import type { AttachAssignment } from '../../game/preview';
  import { extractPromptCards } from '../../game/prompts';
  import type { GameView, PromptView } from '../../game/types';

  type Props = {
    game: GameView;
    prompt: PromptView;
    resolving?: boolean;
    autoContinue?: boolean;
    activeAttachEnergyIndex?: number | null;
    attachAssignments?: AttachAssignment[];
    onresolve: (value: unknown) => void;
    onattachEnergySelect: (index: number | null) => void;
    onattachEnergyUnassign: (index: number) => void;
    onattachEnergyReset: () => void;
  };

  let {
    game,
    prompt,
    resolving = false,
    autoContinue = false,
    activeAttachEnergyIndex = null,
    attachAssignments = [],
    onresolve,
    onattachEnergySelect,
    onattachEnergyUnassign,
    onattachEnergyReset,
  }: Props = $props();

  let isAlertLike = $derived(
    prompt.className === 'AlertPrompt'
      || prompt.className === 'ShowCardsPrompt'
      || prompt.className === 'ConfirmCardsPrompt'
      || prompt.className === 'ShowMulliganPrompt',
  );
  let isEnergyTransferPrompt = $derived(prompt.className === 'DiscardEnergyPrompt' || prompt.className === 'MoveEnergyPrompt');
  let isDamagePrompt = $derived(
    prompt.className === 'PutDamagePrompt'
      || prompt.className === 'MoveDamagePrompt'
      || prompt.className === 'RemoveDamagePrompt',
  );
  let isShuffleOrderPrompt = $derived((prompt.className.includes('Shuffle') || prompt.className.includes('Order'))
    && extractPromptCards(prompt.fields).length > 0);
  let hasPromptCards = $derived(extractPromptCards(prompt.fields).length > 0);
</script>

{#if isAlertLike}
  <AlertLikePrompt {prompt} {resolving} {autoContinue} {onresolve} />
{:else if prompt.className === 'WaitPrompt'}
  <WaitPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'ConfirmPrompt'}
  <ConfirmPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'CoinFlipPrompt'}
  <CoinFlipPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'SelectPrompt' || prompt.className === 'SelectOptionPrompt'}
  <SelectPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'ChooseAttackPrompt'}
  <ChooseAttackPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'ChooseCardsPrompt'}
  <ChooseCardsPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'ChoosePrizePrompt'}
  <ChoosePrizePrompt {game} {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'ChooseEnergyPrompt'}
  <ChooseEnergyPrompt {prompt} {resolving} {onresolve} />
{:else if isEnergyTransferPrompt}
  <EnergyTransferPrompt {game} {prompt} {resolving} {onresolve} />
{:else if isDamagePrompt}
  <DamagePrompt {game} {prompt} {resolving} {onresolve} />
{:else if isShuffleOrderPrompt}
  <ShuffleOrderPrompt {prompt} {resolving} {onresolve} />
{:else if prompt.className === 'AttachEnergyPrompt'}
  <AttachEnergyPrompt
    {game}
    {prompt}
    {resolving}
    {activeAttachEnergyIndex}
    {attachAssignments}
    {onresolve}
    {onattachEnergySelect}
    {onattachEnergyUnassign}
    {onattachEnergyReset}
  />
{:else if hasPromptCards}
  <CardListPrompt {prompt} {resolving} {onresolve} />
{/if}
