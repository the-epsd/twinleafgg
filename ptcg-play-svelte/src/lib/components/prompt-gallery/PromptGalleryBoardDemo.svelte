<script lang="ts">
  import GameBoard from '../GameBoard.svelte';
  import BoardPromptStrip from '../prompts/BoardPromptStrip.svelte';
  import PromptDock from '../prompts/PromptDock.svelte';
  import PromptHost from '../prompts/PromptHost.svelte';
  import { extractPromptCards, promptBlockedIndexes, promptOptions } from '../../game/prompts';
  import { previewAttachEnergySlot } from '../../game/preview';
  import type { AttachAssignment } from '../../game/preview';
  import { createChoosePokemonStrategy } from '../../game/strategies/choosePokemonStrategy';
  import { createDamageTransferStrategy } from '../../game/strategies/damageTransferStrategy';
  import { createPutDamageStrategy } from '../../game/strategies/putDamageStrategy';
  import { getAttachPromptTargets, sameTarget, targetForPromptSlot } from '../../game/targets';
  import type { BoardInteractionStrategy } from '../../game/boardInteraction';
  import type { CardTarget, GameView, PlayerView, PokemonSlotView, PromptView } from '../../game/types';
  import {
    addDamagePlacement,
    assignAttachTarget,
    canAssignAttachTarget,
    damageForTarget as damageForTargetModel,
    damagePlacementsToResult,
    isAttachEnergyAvailable,
    maxDamageForTarget,
    toggleBoardTarget,
    totalPlacedDamage,
    type DamagePlacement,
  } from '../../../state/promptSelectionModel';
  import type { DamageTransferPair } from '../../../state/damageTransfer.svelte';

  type Props = {
    game: GameView;
    prompt: PromptView;
    title: string;
    description: string;
  };

  let { game, prompt, title, description }: Props = $props();

  let selectedBoardTargets = $state<CardTarget[]>([]);
  let damagePlacements = $state<DamagePlacement[]>([]);
  let transferSource = $state<CardTarget | null>(null);
  let transferPairs = $state<DamageTransferPair[]>([]);
  let activeAttachEnergyIndex = $state<number | null>(0);
  let attachAssignments = $state<AttachAssignment[]>([]);
  let lastResult = $state('');

  let bottomPlayer = $derived(game.players[0]);
  let topPlayer = $derived(game.players[1]);
  let attachCards = $derived(extractPromptCards(prompt.fields));
  let attachTargets = $derived(getAttachPromptTargets(game, prompt));
  let maxAttachAssignments = $derived(normalizeLimit(promptOptions(prompt).max, attachCards.length || 1));
  let attachBlockedIndexes = $derived(new Set<number>(promptBlockedIndexes(prompt)));
  let promptStrategy = $derived(createStrategy());
  let topActiveSlot = $derived(previewAttachEnergySlot(topPlayer.active, attachPrompt(), attachAssignments, attachCards));
  let bottomActiveSlot = $derived(previewAttachEnergySlot(bottomPlayer.active, attachPrompt(), attachAssignments, attachCards));
  let topBenchSlots = $derived(topPlayer.bench
    .filter((slot) => !slot.empty)
    .map((slot) => previewAttachEnergySlot(slot, attachPrompt(), attachAssignments, attachCards)));
  let bottomBenchSlots = $derived(bottomPlayer.bench
    .filter((slot) => !slot.empty)
    .map((slot) => previewAttachEnergySlot(slot, attachPrompt(), attachAssignments, attachCards)));
  let currentStadium = $derived(game.players.flatMap((player) => player.stadium)[0]);
  let currentStadiumOwner = $derived(game.players.find((player) => player.stadium.length));

  function createStrategy(): BoardInteractionStrategy | null {
    if (prompt.className === 'PutDamagePrompt') {
      return createPutDamageStrategy({
        game,
        prompt,
        store: {
          get damagePlacements() {
            return damagePlacements;
          },
          placeDamage(target, amount, requiredDamage, maxAllowedDamage) {
            damagePlacements = addDamagePlacement(
              damagePlacements,
              target,
              amount,
              requiredDamage,
              maxDamageForTarget(maxAllowedDamage, target),
            );
          },
          resetDamagePlacements() {
            damagePlacements = [];
          },
          damageForTarget(target) {
            return damageForTargetModel(damagePlacements, target);
          },
          damageResult() {
            return damagePlacementsToResult(damagePlacements);
          },
        },
        resolve: recordResult,
      });
    }

    if (prompt.className === 'MoveDamagePrompt' || prompt.className === 'RemoveDamagePrompt') {
      return createDamageTransferStrategy({
        game,
        prompt,
        store: {
          get source() {
            return transferSource;
          },
          get destination() {
            return transferPairs[0]?.to ?? null;
          },
          get pairs() {
            return transferPairs;
          },
          get counterCount() {
            return transferPairs.length;
          },
          selectSource(target) {
            transferSource = target;
          },
          addCounter(destination, maxCounters) {
            if (!transferSource || transferPairs.length >= maxCounters) {
              return;
            }
            transferPairs = [...transferPairs, { from: transferSource, to: destination }];
          },
          reset() {
            transferSource = null;
            transferPairs = [];
          },
          isSource(target) {
            return !!transferSource && sameTarget(transferSource, target);
          },
          isDestination(target) {
            const destination = transferPairs[0]?.to;
            return !!destination && sameTarget(destination, target);
          },
          result() {
            return [...transferPairs];
          },
        },
        resolve: recordResult,
      });
    }

    if (prompt.className === 'ChoosePokemonPrompt') {
      return createChoosePokemonStrategy({
        game,
        prompt,
        store: {
          get selectedBoardTargets() {
            return selectedBoardTargets;
          },
          toggleBoardTarget(target, maxSelections) {
            selectedBoardTargets = toggleBoardTarget(selectedBoardTargets, target, maxSelections);
          },
          resetBoardTargets() {
            selectedBoardTargets = [];
          },
        },
        resolve: recordResult,
      });
    }

    return null;
  }

  function attachPrompt() {
    return prompt.className === 'AttachEnergyPrompt' ? prompt : null;
  }

  function recordResult(value: unknown) {
    lastResult = formatResult(value);
  }

  function normalizeLimit(value: unknown, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function formatResult(value: unknown) {
    return JSON.stringify(value, null, 2) ?? String(value);
  }

  function canUseAttachEnergy(index: number) {
    return isAttachEnergyAvailable(index, [...attachBlockedIndexes], attachAssignments);
  }

  function canAssignToTarget(target: CardTarget, energyIndex = activeAttachEnergyIndex) {
    if (prompt.className !== 'AttachEnergyPrompt') {
      return false;
    }
    return canAssignAttachTarget(
      target,
      energyIndex,
      attachAssignments,
      attachTargets,
      maxAttachAssignments,
      promptOptions(prompt),
      canUseAttachEnergy,
    );
  }

  function isBoardPromptSelectable(slot: PokemonSlotView) {
    if (slot.empty) {
      return false;
    }
    if (prompt.className === 'AttachEnergyPrompt') {
      return canAssignToTarget(targetForPromptSlot(prompt, slot));
    }
    return !!promptStrategy?.isEligible(targetForPromptSlot(prompt, slot));
  }

  function isBoardPromptSelected(slot: PokemonSlotView) {
    if (slot.empty) {
      return false;
    }
    const target = targetForPromptSlot(prompt, slot);
    if (prompt.className === 'AttachEnergyPrompt') {
      return attachAssignments.some((assignment) => sameTarget(assignment.target, target));
    }
    return !!promptStrategy?.isSelected(target);
  }

  function boardSlotDelta(slot: PokemonSlotView) {
    if (!promptStrategy || slot.empty) {
      return 0;
    }
    return promptStrategy.deltaFor(targetForPromptSlot(prompt, slot));
  }

  function clickSlot(slot: PokemonSlotView) {
    if (slot.empty) {
      return;
    }
    const target = targetForPromptSlot(prompt, slot);
    if (prompt.className === 'AttachEnergyPrompt') {
      if (activeAttachEnergyIndex === null || !canAssignToTarget(target)) {
        return;
      }
      attachAssignments = assignAttachTarget(attachAssignments, activeAttachEnergyIndex, target, maxAttachAssignments);
      activeAttachEnergyIndex = null;
      return;
    }
    if (promptStrategy?.isEligible(target)) {
      promptStrategy.activate(target);
    }
  }

  function selectAttachEnergy(index: number | null) {
    activeAttachEnergyIndex = activeAttachEnergyIndex === index ? null : index;
  }

  function removeAttachAssignment(index: number) {
    attachAssignments = attachAssignments.filter((assignment) => assignment.energyIndex !== index);
    if (activeAttachEnergyIndex === index) {
      activeAttachEnergyIndex = null;
    }
  }

  function resetAttachAssignments() {
    attachAssignments = [];
    activeAttachEnergyIndex = null;
  }

  function allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  function noop() {}
</script>

<article class="gallery-board-demo">
  <div class="gallery-demo-copy">
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
    {#if lastResult}
      <pre>{lastResult}</pre>
    {/if}
  </div>

  <div class="gallery-board-stage">
    {#if prompt.className === 'AttachEnergyPrompt'}
      <PromptDock mode="attachEnergy">
        <PromptHost
          {game}
          {prompt}
          activeAttachEnergyIndex={activeAttachEnergyIndex}
          attachAssignments={attachAssignments}
          onresolve={recordResult}
          onattachEnergySelect={selectAttachEnergy}
          onattachEnergyUnassign={removeAttachAssignment}
          onattachEnergyReset={resetAttachAssignments}
        />
      </PromptDock>
    {:else if promptStrategy}
      <BoardPromptStrip strategy={promptStrategy} />
    {/if}

    <GameBoard
      {topPlayer}
      {bottomPlayer}
      {topBenchSlots}
      {bottomBenchSlots}
      {topActiveSlot}
      {bottomActiveSlot}
      {currentStadium}
      {currentStadiumOwner}
      canPlayToBenchArea={() => false}
      canPlaceSetupBench={() => false}
      playToBenchArea={noop}
      placeSetupBench={noop}
      allowBenchDrop={allowDrop}
      dropToBenchArea={noop}
      isPlayableTarget={() => false}
      {isBoardPromptSelectable}
      {isBoardPromptSelected}
      {boardSlotDelta}
      {clickSlot}
      {allowDrop}
      dropToSlot={noop}
      canPlaceSetupActive={() => false}
      placeSetupActive={noop}
      showZone={noop}
      clickBoardPlay={noop}
      allowBoardPlayDrop={allowDrop}
      dropToBoardPlay={noop}
      boardTilt={4}
      boardPerspective={1300}
      boardScaleY={98}
      boardLift={0}
    />
  </div>
</article>

<style>
  .gallery-board-demo {
    display: grid;
    gap: 12px;
  }

  .gallery-demo-copy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(220px, 0.42fr);
    gap: 14px;
    align-items: start;
  }

  .gallery-demo-copy:not(:has(pre)) {
    grid-template-columns: 1fr;
  }

  .gallery-demo-copy h3,
  .gallery-demo-copy p {
    margin: 0;
  }

  .gallery-demo-copy h3 {
    color: var(--text-primary);
    font-size: 18px;
  }

  .gallery-demo-copy p {
    margin-top: 4px;
    color: var(--text-secondary);
    font-size: 13px;
  }

  .gallery-demo-copy pre {
    min-height: 46px;
    max-height: 96px;
    margin: 0;
    overflow: auto;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-md);
    background: var(--surface-inset-bg);
    color: var(--text-muted);
    padding: 8px;
    font-size: 11px;
    line-height: 1.35;
    white-space: pre-wrap;
  }

  .gallery-board-stage {
    --board-card-w: clamp(48px, min(6vw, 6.4vh), 78px);
    --card-w: var(--board-card-w);
    --hand-card-w: calc(var(--board-card-w) * 1.35);
    --board-row-gap: calc(var(--board-card-w) * 0.16);
    --active-gap: calc(var(--board-card-w) * 0.24);
    --bench-card-w: calc(var(--board-card-w) * 1.24);
    --bench-row-h: calc(var(--bench-card-w) * 1.42);
    --board-top-inset: 150px;
    --board-bottom-inset: calc(var(--board-card-w) * 0.7);
    --board-right-rail: 0px;
    --board-h: 620px;
    --board-edge-pad: calc(var(--board-card-w) * 0.32);
    --board-outline-pad-y: calc(var(--board-card-w) * 0.06);
    --board-content-pad: calc(var(--board-card-w) * 0.18);
    --board-edge-pad-x: var(--board-edge-pad);
    --board-content-inset-y: calc(var(--board-outline-pad-y) + var(--board-content-pad));
    --board-content-inset-x: calc(var(--board-edge-pad-x) + var(--board-content-pad));
    position: relative;
    min-height: calc(var(--board-top-inset) + var(--board-h) + var(--board-bottom-inset));
    overflow: hidden;
    border: 1px solid var(--surface-inset-border);
    border-radius: var(--radius-lg);
    background: var(--app-backdrop-bg);
  }

  .gallery-board-stage :global(.prompt-dock) {
    left: 50%;
    top: 10px;
    width: min(640px, calc(100% - 32px));
    max-height: 210px;
    transform: translateX(-50%);
  }

  .gallery-board-stage :global(.board-prompt-strip-anchor) {
    position: absolute;
    left: 50%;
    top: 16px;
    z-index: 15;
    width: min(560px, calc(100% - 32px));
    transform: translateX(-50%);
  }

  .gallery-board-stage :global(.board-prompt-strip-anchor .prompt-strip) {
    position: relative;
    inset: auto;
    left: auto;
    width: 100%;
    max-width: 100%;
    transform: none;
  }

  @media (max-width: 860px) {
    .gallery-demo-copy {
      grid-template-columns: 1fr;
    }

    .gallery-board-stage {
      --board-top-inset: 170px;
      --board-h: 560px;
    }
  }
</style>
