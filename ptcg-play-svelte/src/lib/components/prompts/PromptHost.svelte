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
    damagePlacedTotal?: number;
    canConfirmDamagePrompt?: boolean;
    onresolve: (value: unknown) => void;
    onattachEnergySelect: (index: number | null) => void;
    onattachEnergyUnassign: (index: number) => void;
    onattachEnergyReset: () => void;
    ondamageReset: () => void;
    ondamageConfirm: () => void;
  };

  let {
    game,
    prompt,
    resolving = false,
    autoContinue = false,
    activeAttachEnergyIndex = null,
    attachAssignments = [],
    damagePlacedTotal = 0,
    canConfirmDamagePrompt = false,
    onresolve,
    onattachEnergySelect,
    onattachEnergyUnassign,
    onattachEnergyReset,
    ondamageReset,
    ondamageConfirm,
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
  <DamagePrompt
    {game}
    {prompt}
    {resolving}
    {damagePlacedTotal}
    {canConfirmDamagePrompt}
    {onresolve}
    {ondamageReset}
    {ondamageConfirm}
  />
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

<style>
  :global(.prompt-hint) {
    margin: 0;
    color: var(--text-muted);
    font-size: 13px;
  }

  :global(.inline-field) {
    display: grid;
    gap: 8px;
    color: var(--text-primary);
    font-weight: 700;
  }

  :global(.prompt-panel input[type="number"]) {
    width: 96px;
    border: 1px solid var(--input-border);
    background: var(--input-bg);
    color: var(--input-text);
    border-radius: var(--radius-md);
    padding: 8px;
  }

  :global(.prompt-grid) {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  }

  :global(.prompt-grid button.selected) {
    outline: var(--selection-outline);
    outline-offset: 1px;
    border-color: var(--selection-border-strong);
    background: var(--selection-bg);
  }

  :global(.prompt-card-list) {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    max-height: min(46vh, 420px);
    overflow: auto;
  }

  :global(.search-card-grid) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(clamp(116px, 9vw, 142px), 1fr));
    gap: 12px;
    align-content: start;
    align-items: start;
    min-height: 0;
    max-height: min(52vh, 560px);
    overflow: auto;
    padding: 2px 4px 8px 2px;
  }

  :global(.selected-card-slots) {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 3px 1px 6px;
  }

  :global(.selected-card-slot) {
    flex: 0 0 clamp(112px, 9.2vw, 148px);
    width: clamp(112px, 9.2vw, 148px);
    aspect-ratio: 63 / 88;
    border-radius: var(--radius-md);
  }

  :global(.selected-card-slot.filled) {
    padding: 0;
    border: 1px solid var(--selection-border-strong);
    background: var(--selection-bg);
    box-shadow: var(--selection-shadow);
  }

  :global(.prompt-panel .selected-card-slot.filled > .card-tile),
  :global(.prompt-panel .selected-card-slot.filled > .card-tile.compact) {
    width: 100%;
  }

  :global(.selected-card-slot.empty) {
    display: grid;
    place-items: center;
    border: 1px dashed var(--surface-inset-border);
    background: var(--surface-inset-bg);
    color: var(--text-muted);
  }

  :global(.selected-card-slot.empty span) {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: var(--radius-pill);
    background: var(--surface-inset-bg);
    font-weight: 800;
  }

  :global(.prize-prompt-grid) {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: clamp(10px, 1.2vw, 16px);
    align-items: start;
    min-width: 0;
  }

  :global(.mulligan-slider) {
    display: grid;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-md);
    background: var(--surface-inset-bg);
  }

  :global(.mulligan-slider-meta),
  :global(.mulligan-slider-scale) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  :global(.mulligan-slider-meta) {
    color: var(--text-secondary);
    font-size: 13px;
  }

  :global(.mulligan-slider-meta strong) {
    color: var(--text-primary);
    font-variant-numeric: tabular-nums;
  }

  :global(.mulligan-slider input[type='range']) {
    width: 100%;
    accent-color: var(--accent-base);
  }

  :global(.mulligan-slider-scale) {
    color: var(--text-muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  :global(.prompt-panel textarea) {
    min-height: 88px;
  }

  :global(.prompt-panel pre) {
    white-space: pre-wrap;
  }
</style>
