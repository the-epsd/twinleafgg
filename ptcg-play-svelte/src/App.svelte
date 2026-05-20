<script lang="ts">
  import ActiveFocus from './lib/components/ActiveFocus.svelte';
  import AppHeader from './lib/components/AppHeader.svelte';
  import BoardLayer from './lib/components/BoardLayer.svelte';
  import BoardPromptDock from './lib/components/BoardPromptDock.svelte';
  import GameBoard from './lib/components/GameBoard.svelte';
  import GameStatus from './lib/components/GameStatus.svelte';
  import Hand from './lib/components/Hand.svelte';
  import ImportScreen from './lib/components/ImportScreen.svelte';
  import LogPanel from './lib/components/LogPanel.svelte';
  import PlayerPanel from './lib/components/PlayerPanel.svelte';
  import PromptDock from './lib/components/prompts/PromptDock.svelte';
  import PromptHost from './lib/components/prompts/PromptHost.svelte';
  import SetupDock from './lib/components/SetupDock.svelte';
  import TableShell from './lib/components/TableShell.svelte';
  import Toolbar from './lib/components/Toolbar.svelte';
  import ZoneViewer from './lib/components/ZoneViewer.svelte';
  import { parseDeckList, SAMPLE_DECK } from './lib/game/deckImport';
  import { localGameApi } from './lib/game/httpClient';
  import { labelFor } from './lib/game/labels';
  import { canPlayCardToPlayArea, canPlayCardToSlot, canRetreatToSlot, isBasicPokemonCard } from './lib/game/playTargets';
  import { benchSlotsFor, previewAttachEnergySlot, previewSlot } from './lib/game/preview';
  import { extractPromptCards, promptBlockedIndexes, promptOptions } from './lib/game/prompts';
  import { getSetupPromptUiState, promptLimit, setupPromptResult } from './lib/game/setupPrompt';
  import { getAttachPromptTargets, getBoardPromptTargets, sameTarget, targetForPromptSlot } from './lib/game/targets';
  import {
    SlotType,
    targetFor,
    type CardTarget,
    type CardView,
    type PlayerView,
    type PokemonSlotView,
    type PromptView,
  } from './lib/game/types';
  import { gameStore } from './state/game.svelte';
  import { promptSelectionStore } from './state/promptSelection.svelte';
  import { canAssignAttachTarget, isAttachEnergyAvailable as isAttachEnergyAvailableModel } from './state/promptSelectionModel';
  import { selectionStore } from './state/selection.svelte';
  import { setupSelectionStore } from './state/setupSelection.svelte';
  import { viewSettingsStore } from './state/viewSettings.svelte';
  import { zoneViewerStore } from './state/zoneViewer.svelte';

  let deck1Text = $state(SAMPLE_DECK);
  let deck2Text = $state(SAMPLE_DECK);
  let game = $derived(gameStore.game);
  let error = $derived(gameStore.error);
  let busy = $derived(gameStore.busy);
  let resolvingPrompt = $derived(gameStore.resolvingPrompt);
  let selectedHand = $derived(selectionStore.selectedHand);
  let draggingHand = $derived(selectionStore.draggingHand);
  let focusedSlot = $derived(selectionStore.focusedSlot);
  let setupActiveIndex = $derived(setupSelectionStore.activeIndex);
  let setupBenchIndexes = $derived(setupSelectionStore.benchIndexes);
  let selectedBoardTargets = $derived(promptSelectionStore.selectedBoardTargets);
  let attachPromptEnergyIndex = $derived(promptSelectionStore.activeAttachEnergyIndex);
  let attachPromptAssignments = $derived(promptSelectionStore.attachAssignments);
  let followActive = $derived(viewSettingsStore.followActive);
  let autoConfirmPrompts = $derived(viewSettingsStore.autoConfirmPrompts);
  let viewIndex = $derived(viewSettingsStore.viewIndex);
  let boardTilt = $derived(viewSettingsStore.boardTilt);
  let boardPerspective = $derived(viewSettingsStore.boardPerspective);
  let boardScaleY = $derived(viewSettingsStore.boardScaleY);
  let boardLift = $derived(viewSettingsStore.boardLift);
  let debugZones = $derived(viewSettingsStore.debugZones);
  let showLogs = $derived(viewSettingsStore.showLogs);
  let zoneViewerOpen = $derived(zoneViewerStore.open);
  let zoneViewerTitle = $derived(zoneViewerStore.title);
  let zoneViewerFaceDown = $derived(zoneViewerStore.faceDown);
  let autoConfirmPromptKey = $state('');
  let setupPromptKey = $state('');

  let activePlayer = $derived(game?.players[game.activePlayerIndex]);
  let bottomPlayer = $derived(game?.players[viewIndex] ?? game?.players[0]);
  let topPlayer = $derived(game?.players.find((player) => player.index !== bottomPlayer?.index));
  let currentPrompt = $derived(game?.prompts[0]);
  let boardTargetPrompt = $derived(currentPrompt?.className === 'ChoosePokemonPrompt' ? currentPrompt : null);
  let attachPrompt = $derived(currentPrompt?.className === 'AttachEnergyPrompt' ? currentPrompt : null);
  let boardPromptTargets = $derived(boardTargetPrompt && game ? getBoardPromptTargets(game, boardTargetPrompt) : []);
  let attachPromptCards = $derived(attachPrompt ? extractPromptCards(attachPrompt.fields) : []);
  let attachPromptMin = $derived(normalizePromptLimit(promptOptions(attachPrompt).min, 0));
  let attachPromptMax = $derived(normalizePromptLimit(promptOptions(attachPrompt).max, attachPromptCards.length || 1));
  let attachPromptTargets = $derived(attachPrompt && game ? getAttachPromptTargets(game, attachPrompt) : []);
  $effect(() => {
    promptSelectionStore.pruneAttachAssignments(attachPromptCards, attachPromptTargets, attachPromptMax);
  });
  $effect(() => {
    promptSelectionStore.clearUnavailableAttachEnergy(isAttachEnergyAvailable);
  });
  let boardPromptMin = $derived(normalizePromptLimit(promptOptions(boardTargetPrompt).min, 1));
  let boardPromptMax = $derived(normalizePromptLimit(promptOptions(boardTargetPrompt).max, 1));
  let canConfirmBoardPrompt = $derived(!!boardTargetPrompt && selectedBoardTargets.length >= boardPromptMin);
  let autoConfirmPrompt = $derived(
    !!currentPrompt && ['AlertPrompt', 'ShowCardsPrompt', 'ConfirmCardsPrompt', 'ShowMulliganPrompt'].includes(currentPrompt.className),
  );
  let setupPrompt = $derived(
    currentPrompt?.className === 'ChooseCardsPrompt' && currentPrompt.message === 'CHOOSE_STARTING_POKEMONS'
      ? currentPrompt
      : null,
  );
  let setupPlayer = $derived(setupPrompt && game ? game.players[setupPrompt.playerIndex] : undefined);
  let setupBlockedIndexes = $derived(new Set<number>(promptBlockedIndexes(setupPrompt)));
  let setupUi = $derived(getSetupPromptUiState(promptOptions(setupPrompt), setupPlayer, setupActiveIndex));
  let setupMinSelections = $derived(setupUi.minSelections);
  let setupMaxSelections = $derived(setupUi.maxSelections);
  let setupHasEngineActive = $derived(setupUi.hasEngineActive);
  let setupNeedsActive = $derived(!!setupPrompt && setupUi.needsActive);
  let setupCanConfirm = $derived(!!setupPrompt && setupUi.canConfirm);
  let setupPlayableIndexes = $derived(setupPlayer
    ? setupPlayer.hand
        .map((card, index) => ({ card, index }))
        .filter(({ card, index }) => isSetupStartable(card, index))
        .map(({ index }) => index)
    : []);
  let setupPlacedIndexes = $derived(setupSelectionStore.placedIndexes);
  let setupSelectedIndex = $derived(
    selectedHand && setupPrompt?.playerIndex === selectedHand.playerIndex && setupPlayableIndexes.includes(selectedHand.handIndex)
      ? selectedHand.handIndex
      : undefined,
  );

  function resetPerspective() {
    viewSettingsStore.resetPerspective();
  }
  $effect(() => {
    if (game && followActive) {
      viewSettingsStore.followPlayer(currentPrompt?.playerIndex ?? game.activePlayerIndex);
    }
  });
  let gameFinished = $derived(game?.phase === 7);
  let winnerName = $derived(
    game?.winner === 0 || game?.winner === 1
      ? game.players[game.winner]?.name
      : game?.winner === 3
        ? 'Draw'
        : undefined,
  );
  let currentPromptDockMode = $derived(
    currentPrompt?.className === 'ChooseCardsPrompt'
      ? 'search'
      : currentPrompt?.className === 'AttachEnergyPrompt'
        ? 'attachEnergy'
        : 'default',
  );
  let selectedCard = $derived(selectedHand && game ? game.players[selectedHand.playerIndex]?.hand[selectedHand.handIndex] : undefined);
  let draggingCard = $derived(draggingHand && game ? game.players[draggingHand.playerIndex]?.hand[draggingHand.handIndex] : undefined);
  let currentStadium = $derived(game ? game.players.flatMap((player) => player.stadium)[0] : undefined);
  let currentStadiumOwner = $derived(game?.players.find((player) => player.stadium.length));
  let viewedCards = $derived(zoneViewerStore.cardsFor(game));
  let focusedPlayer = $derived(focusedSlot && game ? game.players[focusedSlot.ownerIndex] : undefined);
  let focusedIsActive = $derived(focusedSlot?.slot === 'active');
  let focusedCanAct = $derived(!!focusedPlayer && canAct(focusedPlayer.index));
  let focusedBenchTargets = $derived(focusedPlayer?.bench.filter((slot) => !slot.empty) ?? []);
  let topActiveSlot = $derived(topPlayer
    ? previewAttachEnergySlot(
        previewSlot(
          topPlayer.active,
          topPlayer.index === setupPrompt?.playerIndex && setupActiveIndex !== null ? topPlayer.hand[setupActiveIndex] : undefined,
        ),
        attachPrompt,
        attachPromptAssignments,
        attachPromptCards,
      )
    : undefined);
  let bottomActiveSlot = $derived(bottomPlayer
    ? previewAttachEnergySlot(
        previewSlot(
          bottomPlayer.active,
          bottomPlayer.index === setupPrompt?.playerIndex && setupActiveIndex !== null ? bottomPlayer.hand[setupActiveIndex] : undefined,
        ),
        attachPrompt,
        attachPromptAssignments,
        attachPromptCards,
      )
    : undefined);
  let topBenchSlots = $derived(topPlayer
    ? benchSlotsFor(topPlayer, setupPrompt, setupBenchIndexes).map((slot) =>
        previewAttachEnergySlot(slot, attachPrompt, attachPromptAssignments, attachPromptCards),
      )
    : []);
  let bottomBenchSlots = $derived(bottomPlayer
    ? benchSlotsFor(bottomPlayer, setupPrompt, setupBenchIndexes).map((slot) =>
        previewAttachEnergySlot(slot, attachPrompt, attachPromptAssignments, attachPromptCards),
      )
    : []);
  let canPlayOnBoard = $derived(
    !!bottomPlayer &&
    canPlayOnBoardState(
      selectedCard,
      selectedHand?.playerIndex,
      draggingCard,
      draggingHand?.playerIndex,
      game?.activePlayerIndex,
      !!currentPrompt,
      gameFinished,
      !!setupPrompt,
    ),
  );
  $effect(() => {
    if (currentPrompt || gameFinished) {
      selectionStore.clearFocus();
    }
  });
  $effect(() => {
    if (autoConfirmPrompts && autoConfirmPrompt && currentPrompt && !resolvingPrompt) {
      const key = `${currentPrompt.id}:${currentPrompt.className}`;
      if (autoConfirmPromptKey !== key) {
        autoConfirmPromptKey = key;
        void resolvePrompt(true);
      }
    } else if (!autoConfirmPrompt) {
      autoConfirmPromptKey = '';
    }
  });

  async function startGame() {
    const p1 = parseDeckList(deck1Text);
    const p2 = parseDeckList(deck2Text);
    if (p1.errors.length || p2.errors.length) {
      gameStore.setError([...p1.errors.map((e) => `Player 1: ${e}`), ...p2.errors.map((e) => `Player 2: ${e}`)].join('\n'));
      return;
    }

    selectionStore.setSelectedHand(null);
    await runGameCommand(() => localGameApi.start(p1.cards, p2.cards));
  }

  async function runGameCommand(command: () => Promise<Awaited<ReturnType<typeof localGameApi.state>>>) {
    const response = await gameStore.run(command);
    syncPromptScopedState(response.view?.prompts[0] ?? gameStore.game?.prompts[0]);
    resetCommandSelection(response.view?.prompts.length ?? gameStore.game?.prompts.length ?? 0);
    return response;
  }

  async function resolveGamePrompt(command: () => Promise<Awaited<ReturnType<typeof localGameApi.state>>>) {
    const response = await gameStore.resolve(command);
    syncPromptScopedState(response.view?.prompts[0] ?? gameStore.game?.prompts[0]);
    resetCommandSelection(response.view?.prompts.length ?? gameStore.game?.prompts.length ?? 0);
    return response;
  }

  function syncPromptScopedState(prompt: PromptView | undefined) {
    const nextPromptKey = prompt ? `${prompt.id}:${prompt.className}` : '';
    if (setupPromptKey === nextPromptKey) {
      return;
    }
    setupPromptKey = nextPromptKey;
    setupSelectionStore.reset();
    promptSelectionStore.reset();
  }

  function resetCommandSelection(promptCount: number) {
    selectionStore.clearHandAndFocus();
    if (!promptCount) {
      setupSelectionStore.reset();
    }
  }

  async function playToTarget(target: CardTarget) {
    if (!selectedHand || !game || !canAct(selectedHand.playerIndex)) {
      return;
    }
    await runGameCommand(() => localGameApi.playCard(selectedHand!.playerIndex, selectedHand!.handIndex, target));
  }

  function playToSlot(slot: PokemonSlotView) {
    if (!isPlayableTarget(slot)) {
      return;
    }
    void playToTarget(slot.target);
  }

  function clickSlot(slot: PokemonSlotView) {
    if (attachPrompt && isBoardPromptSelectable(slot)) {
      assignAttachPromptTarget(slot);
      return;
    }

    if (boardTargetPrompt && isBoardPromptSelectable(slot)) {
      selectBoardPromptSlot(slot);
      return;
    }

    if (canPlaceSetupActive(slot)) {
      placeSetupActive();
      return;
    }

    if (setupPrompt && slot.ownerIndex === setupPrompt.playerIndex && !selectedHand) {
      if (slot.slot === 'active' && setupActiveIndex !== null) {
        removeSetupIndex(setupActiveIndex);
        return;
      }
      if (slot.slot === 'bench' && setupBenchIndexes[slot.index] !== undefined) {
        removeSetupIndex(setupBenchIndexes[slot.index]);
        return;
      }
    }

    if (isPlayableTarget(slot)) {
      playToSlot(slot);
      return;
    }

    if (!slot.empty && slot.pokemon) {
      selectionStore.focusSlot(slot);
    }
  }

  async function attack(name: string) {
    if (!game || !focusedPlayer || !focusedIsActive || !focusedCanAct) return;
    await runGameCommand(() => localGameApi.attack(focusedPlayer!.index, name));
  }

  async function useAbility(name: string, target: CardTarget) {
    if (!game || !focusedPlayer || !focusedCanAct) return;
    await runGameCommand(() => localGameApi.useAbility(focusedPlayer!.index, name, target));
  }

  async function concede() {
    if (!game || !activePlayer || gameFinished) return;
    await runGameCommand(() => localGameApi.concede(game.activePlayerIndex));
  }

  async function passTurn() {
    if (!game) return;
    await runGameCommand(() => localGameApi.passTurn(game.activePlayerIndex));
  }

  async function retreat(to: number) {
    if (!game) return;
    await runGameCommand(() => localGameApi.retreat(game.activePlayerIndex, to));
  }

  async function resolvePrompt(value: unknown) {
    if (!currentPrompt) return;
    await resolveGamePrompt(() => localGameApi.resolvePrompt(currentPrompt.id, value));
  }

  function selectHandCard(playerIndex: number, handIndex: number) {
    if (setupPrompt && playerIndex === setupPrompt.playerIndex) {
      if (!isSetupStartable(game?.players[playerIndex]?.hand[handIndex], handIndex)) {
        return;
      }
      selectionStore.toggleSelectedHand({ playerIndex, handIndex });
      selectionStore.clearFocus();
      return;
    }

    if (!canAct(playerIndex)) {
      return;
    }
    selectionStore.toggleSelectedHand({ playerIndex, handIndex });
    selectionStore.clearFocus();
  }

  function onHandDrag(playerIndex: number, handIndex: number, event: DragEvent) {
    if (setupPrompt && playerIndex === setupPrompt.playerIndex) {
      if (!isSetupStartable(game?.players[playerIndex]?.hand[handIndex], handIndex)) {
        return;
      }
    } else if (!canAct(playerIndex)) {
      return;
    }
    selectionStore.startDragging({ playerIndex, handIndex });
    event.dataTransfer?.setData('text/plain', `${playerIndex}:${handIndex}`);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function clearDragState() {
    selectionStore.clearDragging();
  }

  function allowDrop(event: DragEvent, slot: PokemonSlotView) {
    if (isPlayableTarget(slot) || canPlaceSetupActive(slot) || (attachPrompt && isBoardPromptSelectable(slot))) {
      event.preventDefault();
    }
  }

  function allowBoardPlayDrop(event: DragEvent) {
    if (canPlayOnBoard) {
      event.preventDefault();
    }
  }

  function allowBenchDrop(event: DragEvent, player: PlayerView) {
    if (canPlayToBenchArea(player) || canPlaceSetupBench(player)) {
      event.preventDefault();
    }
  }

  function switchSides() {
    viewSettingsStore.switchToPlayer(topPlayer?.index ?? 0);
  }

  function resetGame() {
    gameStore.reset();
    selectionStore.clearAll();
    syncPromptScopedState(undefined);
    zoneViewerStore.close();
    viewSettingsStore.resetView();
  }

  function dropToSlot(slot: PokemonSlotView, event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    clearDragState();
    if (attachPrompt && isBoardPromptSelectable(slot)) {
      assignAttachPromptTarget(slot);
      return;
    }
    if (canPlaceSetupActive(slot)) {
      placeSetupActive();
      return;
    }
    playToSlot(slot);
  }

  function dropToBoardPlay(event: DragEvent) {
    if (!canPlayOnBoard) {
      return;
    }
    event.preventDefault();
    clearDragState();
    playSelectedToBoard();
  }

  function clickBoardPlay(event: MouseEvent) {
    if (!canPlayOnBoard) {
      return;
    }
    event.preventDefault();
    playSelectedToBoard();
  }

  function dropToBenchArea(player: PlayerView, event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    clearDragState();
    if (canPlaceSetupBench(player)) {
      placeSetupBench();
      return;
    }
    playToBenchArea(player);
  }

  function isPlayableTarget(slot: PokemonSlotView) {
    if (setupPrompt) {
      return false;
    }
    return canPlayCardToSlot(selectedCard, selectedHand?.playerIndex, slot);
  }

  function benchAreaTarget(player: PlayerView) {
    return player.bench.find((slot) => slot.empty && isPlayableTarget(slot));
  }

  function canPlayToBenchArea(player: PlayerView) {
    if (setupPrompt) {
      return false;
    }
    return !!benchAreaTarget(player);
  }

  function playToBenchArea(player: PlayerView) {
    const target = benchAreaTarget(player);
    if (!target) {
      return;
    }
    playToSlot(target);
  }

  function canPlayToArea(player: PlayerView) {
    if (setupPrompt) {
      return false;
    }
    return canAct(player.index) && canPlayCardToPlayArea(selectedCard, selectedHand?.playerIndex);
  }

  function canPlayOnBoardState(
    selected: CardView | undefined,
    selectedPlayerIndex: number | undefined,
    dragging: CardView | undefined,
    draggingPlayerIndex: number | undefined,
    activePlayerIndex: number | undefined,
    hasPrompt: boolean,
    finished: boolean,
    inSetup: boolean,
  ) {
    if (inSetup || hasPrompt || finished || activePlayerIndex === undefined) {
      return false;
    }
    const selectedCanPlay =
      selectedPlayerIndex === activePlayerIndex && canPlayCardToPlayArea(selected, selectedPlayerIndex);
    const draggingCanPlay =
      draggingPlayerIndex === activePlayerIndex && canPlayCardToPlayArea(dragging, draggingPlayerIndex);
    return (
      selectedCanPlay ||
      draggingCanPlay
    );
  }

  function playSelectedToBoard() {
    if (!game || !activePlayer || !canPlayToArea(activePlayer)) {
      return;
    }
    void playToTarget(targetFor(game.activePlayerIndex, game.activePlayerIndex, SlotType.ACTIVE));
  }

  function showZone(
    playerIndex: number,
    zone: 'discard' | 'lostZone' | 'stadium' | 'playZone',
    title: string,
    faceDown = false,
  ) {
    zoneViewerStore.show(playerIndex, zone, title, faceDown);
  }

  function normalizePromptLimit(value: unknown, fallback: number) {
    return promptLimit(value, fallback);
  }

  function canAct(playerIndex: number) {
    return game?.activePlayerIndex === playerIndex && !currentPrompt && !gameFinished;
  }

  function isAttachEnergyAvailable(index: number) {
    const blocked = new Set<number>(promptBlockedIndexes(attachPrompt));
    return isAttachEnergyAvailableModel(index, [...blocked], attachPromptAssignments);
  }

  function canAssignAttachPromptTarget(target: CardTarget, energyIndex = attachPromptEnergyIndex) {
    if (!attachPrompt) {
      return false;
    }
    return canAssignAttachTarget(
      target,
      energyIndex,
      attachPromptAssignments,
      attachPromptTargets,
      attachPromptMax,
      promptOptions(attachPrompt),
      isAttachEnergyAvailable,
    );
  }

  function isBoardPromptSelectable(slot: PokemonSlotView) {
    if (attachPrompt) {
      if (slot.empty) {
        return false;
      }
      const target = targetForPromptSlot(attachPrompt, slot);
      return canAssignAttachPromptTarget(target);
    }
    if (!boardTargetPrompt || slot.empty) {
      return false;
    }
    const target = targetForPromptSlot(boardTargetPrompt, slot);
    return boardPromptTargets.some((item) => sameTarget(item, target));
  }

  function isBoardPromptSelected(slot: PokemonSlotView) {
    if (attachPrompt) {
      if (slot.empty) {
        return false;
      }
      const target = targetForPromptSlot(attachPrompt, slot);
      return attachPromptAssignments.some((assignment) => sameTarget(assignment.target, target));
    }
    if (!boardTargetPrompt || slot.empty) {
      return false;
    }
    const target = targetForPromptSlot(boardTargetPrompt, slot);
    return selectedBoardTargets.some((item) => sameTarget(item, target));
  }

  function selectBoardPromptSlot(slot: PokemonSlotView) {
    if (!boardTargetPrompt || !isBoardPromptSelectable(slot)) {
      return;
    }
    const target = targetForPromptSlot(boardTargetPrompt, slot);
    if (boardPromptMax <= 1) {
      void resolvePrompt([target]);
      return;
    }
    promptSelectionStore.toggleBoardTarget(target, boardPromptMax);
  }

  function confirmBoardPromptTargets() {
    if (!canConfirmBoardPrompt) {
      return;
    }
    void resolvePrompt(selectedBoardTargets);
  }

  function assignAttachPromptTarget(slot: PokemonSlotView) {
    if (!attachPrompt || attachPromptEnergyIndex === null || !isBoardPromptSelectable(slot)) {
      return;
    }
    const target = targetForPromptSlot(attachPrompt, slot);
    promptSelectionStore.assignAttachTarget(target, attachPromptMax);
  }

  function selectAttachPromptEnergy(index: number | null) {
    promptSelectionStore.toggleAttachEnergy(index);
  }

  function removeAttachPromptAssignment(index: number) {
    promptSelectionStore.removeAttachAssignment(index);
  }

  function resetAttachPromptAssignments() {
    promptSelectionStore.resetAttachAssignments();
  }

  function isSetupStartable(card: CardView | undefined, handIndex: number) {
    return !!setupPrompt && !setupBlockedIndexes.has(handIndex) && isBasicPokemonCard(card);
  }

  function selectedSetupHandIndex() {
    return setupSelectedIndex;
  }

  function canPlaceSetupActive(slot: PokemonSlotView) {
    const handIndex = selectedSetupHandIndex();
    return (
      !!setupPrompt &&
      !setupHasEngineActive &&
      slot.ownerIndex === setupPrompt.playerIndex &&
      slot.slot === 'active' &&
      handIndex !== undefined
    );
  }

  function placeSetupActive() {
    const handIndex = selectedSetupHandIndex();
    if (handIndex === undefined) {
      return;
    }
    setupSelectionStore.placeActive(handIndex);
    selectionStore.setSelectedHand(null);
  }

  function canPlaceSetupBench(player: PlayerView) {
    const handIndex = selectedSetupHandIndex();
    const hasActive = setupHasEngineActive || setupActiveIndex !== null || setupMinSelections === 0;
    const benchCapacity = setupUi.benchCapacity;
    return (
      !!setupPrompt &&
      player.index === setupPrompt.playerIndex &&
      hasActive &&
      handIndex !== undefined &&
      handIndex !== setupActiveIndex &&
      !setupBenchIndexes.includes(handIndex) &&
      setupBenchIndexes.length < benchCapacity
    );
  }

  function placeSetupBench() {
    const handIndex = selectedSetupHandIndex();
    if (handIndex === undefined || !setupPlayer || !canPlaceSetupBench(setupPlayer)) {
      return;
    }
    setupSelectionStore.placeBench(handIndex);
    selectionStore.setSelectedHand(null);
  }

  function removeSetupIndex(handIndex: number) {
    setupSelectionStore.remove(handIndex);
  }

  async function confirmSetupPokemon() {
    if (!setupPrompt || !setupCanConfirm) {
      return;
    }
    await resolvePrompt(setupPromptResult(setupHasEngineActive, setupActiveIndex, setupBenchIndexes));
  }

</script>

<main>
  {#if !game}
    <AppHeader />

    <ImportScreen bind:deck1Text bind:deck2Text {busy} {error} startGame={startGame} />
  {:else if bottomPlayer && topPlayer}
    <TableShell {debugZones}>
      <GameStatus
        phaseLabel={game.phaseLabel}
        turn={game.turn}
        activePlayerName={activePlayer?.name}
        {winnerName}
        {gameFinished}
      />

      <Toolbar
        bind:boardTilt={viewSettingsStore.boardTilt}
        bind:boardPerspective={viewSettingsStore.boardPerspective}
        bind:boardScaleY={viewSettingsStore.boardScaleY}
        bind:boardLift={viewSettingsStore.boardLift}
        bind:followActive={viewSettingsStore.followActive}
        bind:autoConfirmPrompts={viewSettingsStore.autoConfirmPrompts}
        bind:debugZones={viewSettingsStore.debugZones}
        bind:showLogs={viewSettingsStore.showLogs}
        {busy}
        promptActive={!!currentPrompt}
        {gameFinished}
        {error}
        {resetPerspective}
        {passTurn}
        {concede}
        {switchSides}
        {resetGame}
      />

      {#if setupPrompt}
        <SetupDock
          needsActive={setupNeedsActive}
          canConfirm={setupCanConfirm}
          resolving={resolvingPrompt}
          confirm={confirmSetupPokemon}
        />
      {:else if boardTargetPrompt}
        <BoardPromptDock
          prompt={boardTargetPrompt}
          maxSelections={boardPromptMax}
          canConfirm={canConfirmBoardPrompt}
          resolving={resolvingPrompt}
          confirm={confirmBoardPromptTargets}
        />
      {:else if currentPrompt && !(autoConfirmPrompts && autoConfirmPrompt)}
        <PromptDock mode={currentPromptDockMode}>
          <PromptHost
            game={game}
            prompt={currentPrompt}
            resolving={resolvingPrompt}
            activeAttachEnergyIndex={attachPromptEnergyIndex}
            attachAssignments={attachPromptAssignments}
            onresolve={resolvePrompt}
            onattachEnergySelect={selectAttachPromptEnergy}
            onattachEnergyUnassign={removeAttachPromptAssignment}
            onattachEnergyReset={resetAttachPromptAssignments}
          />
        </PromptDock>
      {/if}

      <BoardLayer>
        <PlayerPanel side="top">
          <Hand
            player={topPlayer}
            selectedHand={selectedHand}
            disabled={!canAct(topPlayer.index) && setupPrompt?.playerIndex !== topPlayer.index}
            playableIndexes={setupPrompt?.playerIndex === topPlayer.index ? setupPlayableIndexes : []}
            placedIndexes={setupPrompt?.playerIndex === topPlayer.index ? setupPlacedIndexes : []}
            concealed
            onSelect={selectHandCard}
            onDrag={onHandDrag}
            onDragEnd={clearDragState}
          />
        </PlayerPanel>

        <GameBoard
          {topPlayer}
          {bottomPlayer}
          {topBenchSlots}
          {bottomBenchSlots}
          {topActiveSlot}
          {bottomActiveSlot}
          {currentStadium}
          {currentStadiumOwner}
          {canPlayToBenchArea}
          {canPlaceSetupBench}
          {playToBenchArea}
          {placeSetupBench}
          {allowBenchDrop}
          {dropToBenchArea}
          {isPlayableTarget}
          {isBoardPromptSelectable}
          {isBoardPromptSelected}
          {clickSlot}
          {allowDrop}
          {dropToSlot}
          {canPlaceSetupActive}
          {placeSetupActive}
          {showZone}
          {canPlayOnBoard}
          {clickBoardPlay}
          {allowBoardPlayDrop}
          {dropToBoardPlay}
          {boardTilt}
          {boardPerspective}
          {boardScaleY}
          {boardLift}
        />

        <PlayerPanel side="bottom">
          <Hand
            player={bottomPlayer}
            selectedHand={selectedHand}
            disabled={!canAct(bottomPlayer.index) && setupPrompt?.playerIndex !== bottomPlayer.index}
            playableIndexes={setupPrompt?.playerIndex === bottomPlayer.index ? setupPlayableIndexes : []}
            placedIndexes={setupPrompt?.playerIndex === bottomPlayer.index ? setupPlacedIndexes : []}
            onSelect={selectHandCard}
            onDrag={onHandDrag}
            onDragEnd={clearDragState}
          />
        </PlayerPanel>

        {#if focusedSlot}
          <ActiveFocus
            slot={focusedSlot}
            benchTargets={focusedBenchTargets}
            {busy}
            promptActive={!!currentPrompt}
            canAct={focusedCanAct}
            {canRetreatToSlot}
            close={() => {
              selectionStore.clearFocus();
            }}
            {useAbility}
            {attack}
            {retreat}
          />
        {/if}

        {#if showLogs}
          <LogPanel logs={game.logs} />
        {/if}

        <ZoneViewer
          open={zoneViewerOpen}
          title={zoneViewerTitle}
          cards={viewedCards}
          faceDown={zoneViewerFaceDown}
          close={() => zoneViewerStore.close()}
        />
      </BoardLayer>
    </TableShell>
  {/if}
</main>
