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

<style>
  :global(.prompt-actions) {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  :global(.inline-field) {
    display: grid;
    gap: 8px;
    color: #29313c;
    font-weight: 800;
  }

  :global(.prompt-panel input[type="number"]) {
    width: 96px;
    border: 1px solid rgba(26, 31, 39, 0.18);
    background: #f7f8fa;
    color: #1d232b;
    border-radius: 8px;
    padding: 8px;
  }

  :global(.prompt-panel) {
    display: grid;
    gap: 12px;
    max-height: inherit;
    padding: 14px;
    overflow: auto;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    background: rgba(12, 15, 19, 0.88);
    box-shadow: 0 24px 68px rgba(12, 15, 19, 0.34);
    color: rgba(245, 248, 255, 0.9);
    backdrop-filter: blur(10px);
  }

  :global(.prompt-panel.search-prompt) {
    grid-template-rows: auto auto minmax(0, 1fr) auto;
    gap: 14px;
    height: auto;
    max-height: inherit;
    padding: 16px;
    overflow: hidden;
  }

  :global(.prompt-panel.attach-energy-prompt) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-rows: auto minmax(0, 1fr);
    align-items: end;
    gap: 8px 12px;
    padding: 8px 10px;
    overflow: hidden;
  }

  :global(.prompt-panel.attach-energy-prompt .prompt-title) {
    grid-column: 1 / -1;
    align-items: center;
  }

  :global(.prompt-panel.attach-energy-prompt .prompt-title strong) {
    font-size: 14px;
  }

  :global(.prompt-panel.attach-energy-prompt .prompt-title span) {
    font-size: 11px;
  }

  :global(.prompt-panel.attach-energy-prompt .attach-energy-ui) {
    min-width: 0;
  }

  :global(.prompt-panel.attach-energy-prompt .prompt-actions) {
    align-self: end;
    flex-direction: column;
    gap: 6px;
    width: 96px;
  }

  :global(.prompt-panel.attach-energy-prompt .prompt-actions button) {
    width: 100%;
  }

  :global(.prompt-panel-collapsed) {
    width: max-content;
    justify-self: center;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;
    overflow: visible;
  }

  :global(.prompt-panel-collapsed button) {
    min-width: clamp(96px, calc(var(--card-w) * 1.45), 150px);
    min-height: clamp(40px, calc(var(--card-w) * 0.54), 56px);
    padding: clamp(9px, calc(var(--card-w) * 0.14), 14px) clamp(14px, calc(var(--card-w) * 0.24), 24px);
    border-radius: 8px;
    font-size: clamp(14px, calc(var(--card-w) * 0.17), 18px);
    font-weight: 800;
    box-shadow: 0 12px 32px rgba(23, 30, 38, 0.2);
  }

  :global(.prompt-title) {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
    color: rgba(245, 248, 255, 0.68);
  }

  :global(.prompt-title > div) {
    display: grid;
    gap: 4px;
  }

  :global(.prompt-title strong) {
    color: rgba(143, 232, 206, 0.96);
    font-size: 18px;
  }

  :global(.prompt-title span) {
    font-size: 13px;
  }

  :global(.ghost-button) {
    border-radius: 5px;
    padding: 7px 10px;
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.07);
    color: rgba(245, 248, 255, 0.86);
    box-shadow: none;
    font-size: 12px;
  }

  :global(.prompt-grid),
  :global(.prompt-card-list) {
    display: grid;
    gap: 8px;
  }

  :global(.prompt-grid) {
    grid-template-columns: repeat(auto-fit, minmax(112px, 1fr));
  }

  :global(.prompt-card-list) {
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    max-height: min(46vh, 420px);
    overflow: auto;
  }

  :global(.prompt-card-list button) {
    padding: 4px;
  }

  :global(.prompt-card-list .card-tile) {
    width: 100%;
  }

  :global(.prompt-card-list button.blocked) {
    opacity: 0.32;
  }

  :global(.prompt-card-list button.selected),
  :global(.prompt-grid button.selected) {
    outline: 2px solid #29a18b;
    outline-offset: 1px;
  }

  :global(.prize-prompt-grid) {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: clamp(10px, 1.2vw, 16px);
    align-items: start;
    min-width: 0;
  }

  :global(.prize-choice-card) {
    display: grid;
    gap: 8px;
    justify-items: center;
    min-width: 0;
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
    color: rgba(245, 248, 255, 0.82);
  }

  :global(.prize-choice-card .card-tile) {
    width: 100%;
    max-width: clamp(96px, 8.8vw, 132px);
    box-shadow:
      0 12px 28px rgba(0, 0, 0, 0.28),
      0 0 0 1px rgba(255, 255, 255, 0.08);
    transition:
      transform 140ms ease,
      box-shadow 140ms ease,
      filter 140ms ease;
  }

  :global(.prize-choice-card span) {
    min-width: 0;
    max-width: 100%;
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-size: 12px;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
  }

  :global(.prize-choice-card:hover:not(:disabled) .card-tile) {
    transform: translateY(-4px);
    box-shadow:
      0 18px 34px rgba(0, 0, 0, 0.32),
      0 0 0 2px rgba(143, 232, 206, 0.3),
      0 0 26px rgba(41, 161, 139, 0.24);
  }

  :global(.prize-choice-card.selected .card-tile) {
    transform: translateY(-5px);
    box-shadow:
      0 18px 36px rgba(0, 0, 0, 0.34),
      0 0 0 3px rgba(143, 232, 206, 0.72),
      0 0 30px rgba(41, 161, 139, 0.38);
  }

  :global(.prize-choice-card.selected span) {
    background: rgba(143, 232, 206, 0.16);
    color: rgba(213, 255, 244, 0.95);
  }

  :global(.prize-choice-card.blocked) {
    opacity: 0.36;
  }

  :global(.search-selection) {
    display: grid;
    gap: 8px;
    padding: 10px;
    border-radius: 7px;
    border: 1px solid rgba(143, 232, 206, 0.22);
    background: rgba(255, 255, 255, 0.05);
  }

  :global(.search-selection-meta) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: rgba(245, 248, 255, 0.72);
    font-size: 12px;
  }

  :global(.search-selection-meta strong) {
    color: rgba(245, 248, 255, 0.9);
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
    border-radius: 7px;
  }

  :global(.selected-card-slot.filled) {
    padding: 0;
    border: 1px solid rgba(143, 232, 206, 0.7);
    background: rgba(143, 232, 206, 0.08);
    box-shadow:
      0 0 0 2px rgba(143, 232, 206, 0.24),
      0 14px 28px rgba(0, 0, 0, 0.28);
  }

  :global(.selected-card-slot.filled .card-tile) {
    width: 100%;
  }

  :global(.selected-card-slot.empty) {
    display: grid;
    place-items: center;
    border: 1px dashed rgba(245, 248, 255, 0.22);
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
    color: rgba(245, 248, 255, 0.42);
  }

  :global(.selected-card-slot.empty span) {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.08);
    font-weight: 800;
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

  :global(.search-card-grid button) {
    align-self: start;
    display: block;
    padding: 0;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.04);
    box-shadow: none;
  }

  :global(.search-card-grid button.selected) {
    border-color: rgba(143, 232, 206, 0.78);
    background: rgba(143, 232, 206, 0.1);
    box-shadow:
      0 0 0 2px rgba(143, 232, 206, 0.3),
      0 0 24px rgba(41, 161, 139, 0.22);
  }

  :global(.search-card-grid button.blocked) {
    opacity: 0.28;
  }

  :global(.search-card-grid .card-tile) {
    width: 100%;
  }

  :global(.search-actions) {
    justify-content: end;
  }

  :global(.attach-energy-ui) {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    align-items: start;
  }

  :global(.attach-energy-pane),
  :global(.attach-target-pane) {
    display: grid;
    gap: 10px;
    min-width: 0;
    padding: 10px;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
  }

  :global(.attach-energy-heading) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: rgba(245, 248, 255, 0.66);
    font-size: 12px;
  }

  :global(.attach-energy-heading strong) {
    color: rgba(245, 248, 255, 0.9);
  }

  :global(.attach-energy-list),
  :global(.attach-target-grid) {
    display: grid;
    gap: 10px;
    max-height: min(42vh, 390px);
    overflow: auto;
    padding: 2px;
  }

  :global(.attach-energy-list) {
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  }

  :global(.attach-energy-prompt .attach-energy-pane) {
    padding: 0;
    border: 0;
    background: transparent;
  }

  :global(.attach-energy-prompt .attach-energy-list) {
    grid-auto-flow: column;
    grid-auto-columns: clamp(72px, 8vw, 92px);
    grid-template-columns: none;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 1px 1px 5px;
  }

  :global(.attach-energy-prompt .attach-energy-card) {
    gap: 4px;
    padding: 3px;
  }

  :global(.attach-target-grid) {
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  }

  :global(.attach-energy-card),
  :global(.attach-target-card) {
    position: relative;
    display: grid;
    gap: 6px;
    min-width: 0;
    padding: 4px;
    border-radius: 7px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: none;
    color: rgba(245, 248, 255, 0.86);
  }

  :global(.attach-energy-card) {
    cursor: grab;
  }

  :global(.attach-energy-card:active) {
    cursor: grabbing;
  }

  :global(.attach-energy-card .card-tile),
  :global(.attach-target-card .card-tile) {
    width: 100%;
  }

  :global(.attach-energy-card.selected),
  :global(.attach-target-card.ready) {
    border-color: rgba(143, 232, 206, 0.78);
    background: rgba(143, 232, 206, 0.1);
    box-shadow:
      0 0 0 2px rgba(143, 232, 206, 0.28),
      0 0 22px rgba(41, 161, 139, 0.2);
  }

  :global(.attach-energy-card.assigned) {
    border-color: rgba(242, 184, 68, 0.68);
    background: rgba(242, 184, 68, 0.1);
  }

  :global(.attach-energy-card.blocked) {
    opacity: 0.35;
  }

  :global(.attach-assignment-label),
  :global(.attach-target-card > span) {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(245, 248, 255, 0.74);
    font-size: 11px;
    line-height: 1.2;
    white-space: nowrap;
  }

  :global(.attach-assignment-label) {
    color: rgba(255, 225, 150, 0.95);
    font-weight: 800;
  }

  :global(.mulligan-slider) {
    display: grid;
    gap: 10px;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.06);
  }

  :global(.mulligan-slider-meta),
  :global(.mulligan-slider-scale) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  :global(.mulligan-slider-meta) {
    color: rgba(245, 248, 255, 0.68);
    font-size: 13px;
  }

  :global(.mulligan-slider-meta strong) {
    color: rgba(245, 248, 255, 0.94);
    font-variant-numeric: tabular-nums;
  }

  :global(.mulligan-slider input[type='range']) {
    width: 100%;
    accent-color: #29a18b;
  }

  :global(.mulligan-slider-scale) {
    color: rgba(245, 248, 255, 0.58);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }

  :global(.prompt-hint),
  :global(.prompt-warning),
  :global(.prompt-panel details),
  :global(.prompt-panel p) {
    margin: 0;
    color: rgba(245, 248, 255, 0.68);
    font-size: 13px;
  }

  :global(.prompt-warning) {
    color: #ffe0a6;
  }

  :global(.prompt-panel textarea) {
    min-height: 88px;
  }

  :global(.prompt-panel pre) {
    white-space: pre-wrap;
  }
</style>
