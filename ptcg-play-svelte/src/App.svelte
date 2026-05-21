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
  import type { GameCommandApi } from './lib/game/gameApi';
  import { localGameApi } from './lib/game/httpClient';
  import { labelFor } from './lib/game/labels';
  import {
    canPlayCardToBoardArea,
    canPlayCardToPlayArea,
    canPlayCardToSlot,
    canPlayerAct,
    canRetreatToSlot,
    playableBenchSlot,
    type BoardPlayAreaContext,
  } from './lib/game/playTargets';
  import { benchSlotsFor, previewAttachEnergySlot, previewSlot } from './lib/game/preview';
  import { extractPromptCards, promptBlockedIndexes, promptInstanceKey, promptOptions } from './lib/game/prompts';
  import { getSetupPromptUiState, promptLimit, setupPromptResult } from './lib/game/setupPrompt';
  import { getAttachPromptTargets, getBoardPromptTargets, sameTarget, targetForPromptSlot } from './lib/game/targets';
  import {
    SlotType,
    targetFor,
    type CardTarget,
    type CardView,
    type PlayerView,
    type PokemonSlotView,
  } from './lib/game/types';
  import { deckImportStore } from './state/deckImport.svelte';
  import { gameStore } from './state/game.svelte';
  import { gameSessionStore } from './state/gameSession.svelte';
  import { promptLifecycleStore } from './state/promptLifecycle.svelte';
  import { promptSelectionStore } from './state/promptSelection.svelte';
  import { remoteSessionStore } from './state/remoteSession.svelte';
  import {
    canAssignAttachTarget,
    damagePlacementsToResult,
    isAttachEnergyAvailable as isAttachEnergyAvailableModel,
    totalPlacedDamage,
    type DamagePlacement,
  } from './state/promptSelectionModel';
  import { selectionStore } from './state/selection.svelte';
  import { setupSelectionStore } from './state/setupSelection.svelte';
  import {
    canPlaceSetupActive as canPlaceSetupActiveModel,
    canPlaceSetupBench as canPlaceSetupBenchModel,
    isSetupStartable as isSetupStartableModel,
    type SetupPlacementContext,
  } from './state/setupSelectionModel';
  import { viewSettingsStore } from './state/viewSettings.svelte';
  import { zoneViewerStore } from './state/zoneViewer.svelte';

  let game = $derived(gameStore.game);
  let error = $derived(gameStore.error);
  let busy = $derived(gameStore.busy);
  let sessionBusy = $derived(busy || remoteSessionStore.busy || remoteSessionStore.connecting);
  let mode = $derived(remoteSessionStore.mode);
  let commandApi = $derived<GameCommandApi>(mode === 'remote' ? remoteSessionStore.api : localGameApi);
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
  let activePlayer = $derived(game?.players[game.activePlayerIndex]);
  let bottomPlayer = $derived(game?.players[viewIndex] ?? game?.players[0]);
  let topPlayer = $derived(game?.players.find((player) => player.index !== bottomPlayer?.index));
  let currentPrompt = $derived(game?.prompts[0]);
  let invitePrompt = $derived(currentPrompt?.className === 'InvitePlayerPrompt' ? currentPrompt : null);
  let boardTargetPrompt = $derived(currentPrompt?.className === 'ChoosePokemonPrompt' ? currentPrompt : null);
  let attachPrompt = $derived(currentPrompt?.className === 'AttachEnergyPrompt' ? currentPrompt : null);
  let damagePrompt = $derived(currentPrompt?.className === 'PutDamagePrompt' ? currentPrompt : null);
  let boardPromptTargets = $derived(boardTargetPrompt && game ? getBoardPromptTargets(game, boardTargetPrompt) : []);
  let attachPromptCards = $derived(attachPrompt ? extractPromptCards(attachPrompt.fields) : []);
  let attachPromptMin = $derived(normalizePromptLimit(promptOptions(attachPrompt).min, 0));
  let attachPromptMax = $derived(normalizePromptLimit(promptOptions(attachPrompt).max, attachPromptCards.length || 1));
  let attachPromptTargets = $derived(attachPrompt && game ? getAttachPromptTargets(game, attachPrompt) : []);
  let damagePromptTargets = $derived(damagePrompt && game ? getBoardPromptTargets(game, damagePrompt) : []);
  let damagePromptOptions = $derived(promptOptions(damagePrompt));
  let damagePromptStep = $derived(normalizePromptLimit(damagePromptOptions.damageMultiple, 10));
  let damagePromptRequired = $derived(normalizePromptLimit(damagePrompt?.fields.damage, 0));
  let damagePromptMaxAllowed = $derived(normalizeDamagePlacements(damagePrompt?.fields.maxAllowedDamage));
  let damagePlacements = $derived(promptSelectionStore.damagePlacements);
  let damagePlacedTotal = $derived(totalPlacedDamage(damagePlacements));
  let canConfirmDamagePrompt = $derived(
    !!damagePrompt
      && damagePlacedTotal > 0
      && (
        damagePromptOptions.allowPlacePartialDamage
          ? damagePlacedTotal <= damagePromptRequired
          : damagePlacedTotal === damagePromptRequired
      ),
  );
  let damagePromptInstanceKey = $derived(promptInstanceKey(damagePrompt));
  let lastDamagePromptInstanceKey = $state('');
  $effect(() => {
    promptSelectionStore.pruneAttachAssignments(attachPromptCards, attachPromptTargets, attachPromptMax);
  });
  $effect(() => {
    promptSelectionStore.clearUnavailableAttachEnergy(isAttachEnergyAvailable);
  });
  $effect(() => {
    promptSelectionStore.pruneDamagePlacements(damagePromptTargets);
  });
  $effect(() => {
    if (damagePromptInstanceKey !== lastDamagePromptInstanceKey) {
      promptSelectionStore.resetDamagePlacements();
      lastDamagePromptInstanceKey = damagePromptInstanceKey;
    }
  });
  $effect(() => {
    if (!damagePrompt || !game) {
      return;
    }
    window.addEventListener('click', clickDamagePromptSlotAtPoint, true);
    return () => {
      window.removeEventListener('click', clickDamagePromptSlotAtPoint, true);
    };
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
  let setupPlacementContext = $derived<SetupPlacementContext>({
    promptPlayerIndex: setupPrompt?.playerIndex,
    selectedHandIndex: setupSelectedIndex,
    hasEngineActive: setupHasEngineActive,
    activeIndex: setupActiveIndex,
    benchIndexes: setupBenchIndexes,
    minSelections: setupMinSelections,
    benchCapacity: setupUi.benchCapacity,
  });

  function resetPerspective() {
    viewSettingsStore.resetPerspective();
  }
  $effect(() => {
    if (game && followActive && mode === 'local') {
      viewSettingsStore.followPlayer(currentPrompt?.playerIndex ?? game.activePlayerIndex);
    }
  });
  $effect(() => {
    if (mode === 'remote' && remoteSessionStore.playerIndex !== null) {
      viewSettingsStore.switchToPlayer(remoteSessionStore.playerIndex);
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
    canPlayCardToBoardArea({
      selected: selectedCard,
      selectedPlayerIndex: selectedHand?.playerIndex,
      dragging: draggingCard,
      draggingPlayerIndex: draggingHand?.playerIndex,
      activePlayerIndex: game?.activePlayerIndex,
      hasPrompt: !!currentPrompt,
      finished: gameFinished,
      inSetup: !!setupPrompt,
    } satisfies BoardPlayAreaContext),
  );
  $effect(() => {
    if (currentPrompt || gameFinished) {
      selectionStore.clearFocus();
    }
  });
  $effect(() => {
    if (promptLifecycleStore.shouldAutoConfirm(currentPrompt, autoConfirmPrompts && autoConfirmPrompt, resolvingPrompt)) {
      void resolvePrompt(true);
    }
  });

  async function startGame() {
    if (mode !== 'local') {
      return;
    }
    const decks = deckImportStore.parseLocalGameDecks();
    if (!decks.ok) {
      gameStore.setError(decks.error);
      return;
    }

    selectionStore.setSelectedHand(null);
    await gameSessionStore.run(() => localGameApi.start(decks.player1Cards, decks.player2Cards));
  }

  async function connectOnline() {
    await remoteSessionStore.connect();
  }

  function disconnectOnline() {
    remoteSessionStore.disconnect();
  }

  async function inviteOnline(clientId: number) {
    const deck = deckImportStore.parseRemoteDeck();
    if (!deck.ok) {
      gameStore.setError(deck.error);
      return;
    }
    selectionStore.setSelectedHand(null);
    await gameSessionStore.run(() => remoteSessionStore.invite(clientId, deck.cards));
  }

  async function joinOnlineGame(gameId: number) {
    selectionStore.setSelectedHand(null);
    await gameSessionStore.run(() => remoteSessionStore.joinGame(gameId));
  }

  async function acceptInvite() {
    if (!invitePrompt) {
      return;
    }
    const deck = deckImportStore.parseRemoteDeck();
    if (!deck.ok) {
      gameStore.setError(deck.error);
      return;
    }
    await gameSessionStore.resolve(() => remoteSessionStore.api.resolvePrompt(invitePrompt.id, deck.cards));
  }

  async function declineInvite() {
    if (!invitePrompt) {
      return;
    }
    await gameSessionStore.resolve(() => remoteSessionStore.api.resolvePrompt(invitePrompt.id, null));
  }

  async function playToTarget(target: CardTarget) {
    if (!selectedHand || !game || !canAct(selectedHand.playerIndex)) {
      return;
    }
    await gameSessionStore.run(() => commandApi.playCard(selectedHand!.playerIndex, selectedHand!.handIndex, target));
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

    if (damagePrompt && isBoardPromptSelectable(slot)) {
      placeDamageOnSlot(slot);
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

    if (canPlayOnBoard) {
      playSelectedToBoard();
      return;
    }

    if (!slot.empty && slot.pokemon) {
      selectionStore.focusSlot(slot);
    }
  }

  async function attack(name: string) {
    if (!game || !focusedPlayer || !focusedIsActive || !focusedCanAct) return;
    await gameSessionStore.run(() => commandApi.attack(focusedPlayer!.index, name));
  }

  async function useAbility(name: string, target: CardTarget) {
    if (!game || !focusedPlayer || !focusedCanAct) return;
    await gameSessionStore.run(() => commandApi.useAbility(focusedPlayer!.index, name, target));
  }

  async function concede() {
    if (!game || !activePlayer || gameFinished) return;
    await gameSessionStore.run(() => commandApi.concede(game.activePlayerIndex));
  }

  async function passTurn() {
    if (!game) return;
    await gameSessionStore.run(() => commandApi.passTurn(game.activePlayerIndex));
  }

  async function retreat(to: number) {
    if (!game) return;
    await gameSessionStore.run(() => commandApi.retreat(game.activePlayerIndex, to));
  }

  async function resolvePrompt(value: unknown) {
    if (!currentPrompt) return;
    await gameSessionStore.resolve(() => commandApi.resolvePrompt(currentPrompt.id, value));
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
    if (mode === 'remote') {
      return;
    }
    viewSettingsStore.switchToPlayer(topPlayer?.index ?? 0);
  }

  function resetGame() {
    gameSessionStore.reset();
    remoteSessionStore.leaveActiveGame();
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
    if (isPlayableTarget(slot)) {
      playToSlot(slot);
      return;
    }
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
    return playableBenchSlot(player, selectedCard, selectedHand?.playerIndex, !!setupPrompt);
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

  function normalizeDamagePlacements(value: unknown): DamagePlacement[] {
    return Array.isArray(value)
      ? value.filter((item): item is DamagePlacement =>
          item
            && typeof item === 'object'
            && 'target' in item
            && 'damage' in item
            && typeof item.damage === 'number',
        )
      : [];
  }

  function canAct(playerIndex: number) {
    if (mode === 'remote' && remoteSessionStore.playerIndex !== playerIndex) {
      return false;
    }
    return canPlayerAct({
      playerIndex,
      activePlayerIndex: game?.activePlayerIndex,
      hasPrompt: !!currentPrompt,
      finished: gameFinished,
    });
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
    if (damagePrompt) {
      if (slot.empty || damagePlacedTotal >= damagePromptRequired) {
        return false;
      }
      const target = targetForPromptSlot(damagePrompt, slot);
      return damagePromptTargets.some((item) => sameTarget(item, target));
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
    if (damagePrompt) {
      if (slot.empty) {
        return false;
      }
      const target = targetForPromptSlot(damagePrompt, slot);
      return promptSelectionStore.damageForTarget(target) > 0;
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

  function boardPromptDamage(slot: PokemonSlotView) {
    if (!damagePrompt || slot.empty) {
      return 0;
    }
    return promptSelectionStore.damageForTarget(targetForPromptSlot(damagePrompt, slot));
  }

  function placeDamage(target: CardTarget) {
    if (!damagePrompt || !damagePromptTargets.some((item) => sameTarget(item, target))) {
      return;
    }
    promptSelectionStore.placeDamage(target, damagePromptStep, damagePromptRequired, damagePromptMaxAllowed);
  }

  function placeDamageOnSlot(slot: PokemonSlotView) {
    if (!damagePrompt || slot.empty) {
      return;
    }
    placeDamage(targetForPromptSlot(damagePrompt, slot));
  }

  function clickDamagePromptSlotAtPoint(event: MouseEvent) {
    if (!damagePrompt || resolvingPrompt) {
      return;
    }
    if (event.target instanceof Element && event.target.closest('.prompt-dock, .board-prompt-dock')) {
      return;
    }
    const slot = boardPromptSlotAtPoint(event.clientX, event.clientY);
    if (!slot || !isBoardPromptSelectable(slot)) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    placeDamageOnSlot(slot);
  }

  function boardPromptSlotAtPoint(x: number, y: number) {
    const slotElement = document.elementsFromPoint(x, y).find((element) =>
      element instanceof HTMLElement
        && element.classList.contains('board-slot')
        && element.classList.contains('prompt-selectable'),
    );
    return slotElement instanceof HTMLElement ? boardSlotFromElement(slotElement) : null;
  }

  function boardSlotFromElement(element: HTMLElement): PokemonSlotView | null {
    if (!game) {
      return null;
    }
    const ownerIndex = Number(element.dataset.ownerIndex);
    const slotKind = element.dataset.slotKind;
    const slotIndex = Number(element.dataset.slotIndex);
    const player = game.players.find((item) => item.index === ownerIndex);
    if (!player || !Number.isFinite(slotIndex)) {
      return null;
    }
    if (slotKind === 'active') {
      return player.active;
    }
    if (slotKind === 'bench') {
      return player.bench.find((slot) => slot.index === slotIndex) ?? null;
    }
    return null;
  }

  function resetDamagePrompt() {
    promptSelectionStore.resetDamagePlacements();
  }

  function confirmDamagePrompt() {
    if (!canConfirmDamagePrompt) {
      return;
    }
    void resolvePrompt(damagePlacementsToResult(damagePlacements));
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
    return isSetupStartableModel(card, handIndex, setupBlockedIndexes, !!setupPrompt);
  }

  function selectedSetupHandIndex() {
    return setupPlacementContext.selectedHandIndex;
  }

  function canPlaceSetupActive(slot: PokemonSlotView) {
    return canPlaceSetupActiveModel(slot, setupPlacementContext);
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
    return canPlaceSetupBenchModel(player, setupPlacementContext);
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

      <ImportScreen
        {mode}
        bind:deck1Text={deckImportStore.deck1Text}
        bind:deck2Text={deckImportStore.deck2Text}
        bind:displayName={remoteSessionStore.displayName}
        busy={sessionBusy}
        onlineBusy={remoteSessionStore.connecting || remoteSessionStore.busy}
        connected={remoteSessionStore.connected}
        {error}
        onlineError={remoteSessionStore.error}
        opponents={remoteSessionStore.opponents}
        games={remoteSessionStore.myGames}
        setMode={(nextMode) => remoteSessionStore.setMode(nextMode)}
        startGame={startGame}
        {connectOnline}
        {disconnectOnline}
        {inviteOnline}
        joinOnlineGame={joinOnlineGame}
      />
  {:else if invitePrompt}
    <AppHeader />
    <section class="remote-invite-screen">
      <div class="invite-panel">
        <strong>Game invitation</strong>
        <span>Choose your deck to join this match.</span>
        <div>
          <button disabled={resolvingPrompt} onclick={acceptInvite}>Accept</button>
          <button disabled={resolvingPrompt} onclick={declineInvite}>Decline</button>
        </div>
      </div>
      {#if error}
        <pre class="invite-error">{error}</pre>
      {/if}
    </section>
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
        busy={sessionBusy}
        promptActive={!!currentPrompt}
        {gameFinished}
        {error}
        {resetPerspective}
        {passTurn}
        {concede}
        {switchSides}
        switchDisabled={mode === 'remote'}
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
      {:else if invitePrompt}
        <PromptDock>
          <div class="invite-panel">
            <strong>Game invitation</strong>
            <span>Choose your deck to join this match.</span>
            <div>
              <button disabled={resolvingPrompt} onclick={acceptInvite}>Accept</button>
              <button disabled={resolvingPrompt} onclick={declineInvite}>Decline</button>
            </div>
          </div>
        </PromptDock>
      {:else if currentPrompt && !(autoConfirmPrompts && autoConfirmPrompt)}
        <PromptDock mode={currentPromptDockMode}>
          {#key promptInstanceKey(currentPrompt)}
            <PromptHost
              game={game}
              prompt={currentPrompt}
              resolving={resolvingPrompt}
              activeAttachEnergyIndex={attachPromptEnergyIndex}
              attachAssignments={attachPromptAssignments}
              {damagePlacedTotal}
              {canConfirmDamagePrompt}
              onresolve={resolvePrompt}
              onattachEnergySelect={selectAttachPromptEnergy}
              onattachEnergyUnassign={removeAttachPromptAssignment}
              onattachEnergyReset={resetAttachPromptAssignments}
              ondamageReset={resetDamagePrompt}
              ondamageConfirm={confirmDamagePrompt}
            />
          {/key}
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
          boardPromptDamage={boardPromptDamage}
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
            busy={sessionBusy}
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

<style>
  .invite-panel {
    display: grid;
    gap: 10px;
    min-width: min(360px, calc(100vw - 32px));
    padding: 14px;
    border-radius: 8px;
    border: 1px solid rgba(26, 31, 39, 0.16);
    background: #f7f8fa;
    color: #1d232b;
    box-shadow: 0 12px 32px rgba(12, 15, 19, 0.18);
  }

  .invite-panel strong {
    font-size: 14px;
  }

  .invite-panel span {
    color: #566272;
    font-size: 13px;
  }

  .invite-panel div {
    display: flex;
    gap: 8px;
  }

  .remote-invite-screen {
    min-height: 100vh;
    display: grid;
    align-content: center;
    justify-content: center;
    gap: 12px;
    padding: 72px 24px 24px;
  }

  .invite-error {
    margin: 0;
    padding: 12px;
    border-radius: 8px;
    background: #fff0f1;
    border: 1px solid #d87883;
    color: #7d2732;
    white-space: pre-wrap;
  }
</style>
