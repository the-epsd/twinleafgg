<script lang="ts">
  import CardTile from './lib/components/CardTile.svelte';
  import GameBoard from './lib/components/GameBoard.svelte';
  import Hand from './lib/components/Hand.svelte';
  import PromptPanel from './lib/components/PromptPanel.svelte';
  import ZoneViewer from './lib/components/ZoneViewer.svelte';
  import { parseDeckList, SAMPLE_DECK } from './lib/game/deckImport';
  import { localGameApi } from './lib/game/httpClient';
  import { labelFor } from './lib/game/labels';
  import { canPlayCardToPlayArea, canPlayCardToSlot, canRetreatToSlot, isBasicPokemonCard } from './lib/game/playTargets';
  import { getSetupPromptUiState, promptLimit, setupPromptResult } from './lib/game/setupPrompt';
  import {
    PlayerType,
    SlotType,
    targetFor,
    type CardTarget,
    type CardView,
    type GameView,
    type PlayerView,
    type PokemonSlotView,
    type PromptView,
  } from './lib/game/types';

  let deck1Text = SAMPLE_DECK;
  let deck2Text = SAMPLE_DECK;
  let game: GameView | null = null;
  let error = '';
  let busy = false;
  let resolvingPrompt = false;
  let selectedHand: { playerIndex: number; handIndex: number } | null = null;
  let draggingHand: { playerIndex: number; handIndex: number } | null = null;
  let focusedSlot: PokemonSlotView | null = null;
  let followActive = true;
  let autoConfirmPrompts = true;
  let autoConfirmPromptKey = '';
  let selectedBoardTargets: CardTarget[] = [];
  let attachPromptEnergyIndex: number | null = null;
  let attachPromptAssignments: Array<{ energyIndex: number; target: CardTarget }> = [];
  let viewIndex = 0;
  let setupActiveIndex: number | null = null;
  let setupBenchIndexes: number[] = [];
  let setupPromptKey = '';
  let boardTilt = 8;
  let boardPerspective = 1250;
  let boardScaleY = 94;
  let boardLift = 0;
  let debugZones = false;
  let showLogs = false;
  let openZone:
    | { playerIndex: number; zone: 'discard' | 'lostZone' | 'stadium' | 'playZone'; title: string; faceDown?: boolean }
    | null = null;

  $: activePlayer = game?.players[game.activePlayerIndex];
  $: bottomPlayer = game?.players[viewIndex] ?? game?.players[0];
  $: topPlayer = game?.players.find((player) => player.index !== bottomPlayer?.index);
  $: currentPrompt = game?.prompts[0];
  $: boardTargetPrompt = currentPrompt?.className === 'ChoosePokemonPrompt' ? currentPrompt : null;
  $: attachPrompt = currentPrompt?.className === 'AttachEnergyPrompt' ? currentPrompt : null;
  $: boardPromptTargets = boardTargetPrompt && game ? getBoardPromptTargets(game, boardTargetPrompt) : [];
  $: attachPromptCards = attachPrompt ? extractPromptCards(attachPrompt.fields) : [];
  $: attachPromptMin = normalizePromptLimit((attachPrompt?.fields.options as any)?.min, 0);
  $: attachPromptMax = normalizePromptLimit((attachPrompt?.fields.options as any)?.max, attachPromptCards.length || 1);
  $: attachPromptTargets = attachPrompt && game ? getAttachPromptTargets(game, attachPrompt) : [];
  $: attachPromptAssignments = attachPromptAssignments.filter((assignment) =>
    attachPromptCards.some((card, index) => (card.index ?? index) === assignment.energyIndex)
      && attachPromptTargets.some((target) => sameTarget(target, assignment.target)),
  ).slice(0, attachPromptMax);
  $: attachPromptEnergyIndex =
    attachPromptEnergyIndex !== null && isAttachEnergyAvailable(attachPromptEnergyIndex)
      ? attachPromptEnergyIndex
      : null;
  $: boardPromptMin = normalizePromptLimit((boardTargetPrompt?.fields.options as any)?.min, 1);
  $: boardPromptMax = normalizePromptLimit((boardTargetPrompt?.fields.options as any)?.max, 1);
  $: canConfirmBoardPrompt = !!boardTargetPrompt && selectedBoardTargets.length >= boardPromptMin;
  $: autoConfirmPrompt =
    !!currentPrompt && ['AlertPrompt', 'ShowCardsPrompt', 'ConfirmCardsPrompt', 'ShowMulliganPrompt'].includes(currentPrompt.className);
  $: setupPrompt =
    currentPrompt?.className === 'ChooseCardsPrompt' && currentPrompt.message === 'CHOOSE_STARTING_POKEMONS'
      ? currentPrompt
      : null;
  $: setupPlayer = setupPrompt && game ? game.players[setupPrompt.playerIndex] : undefined;
  $: setupBlockedIndexes = new Set<number>(
    Array.isArray((setupPrompt?.fields.options as any)?.blocked) ? ((setupPrompt?.fields.options as any).blocked as number[]) : [],
  );
  $: setupUi = getSetupPromptUiState(setupPrompt?.fields.options, setupPlayer, setupActiveIndex);
  $: setupMinSelections = setupUi.minSelections;
  $: setupMaxSelections = setupUi.maxSelections;
  $: setupHasEngineActive = setupUi.hasEngineActive;
  $: setupNeedsActive = !!setupPrompt && setupUi.needsActive;
  $: setupCanConfirm = !!setupPrompt && setupUi.canConfirm;
  $: setupPlayableIndexes = setupPlayer
    ? setupPlayer.hand
        .map((card, index) => ({ card, index }))
        .filter(({ card, index }) => isSetupStartable(card, index))
        .map(({ index }) => index)
    : [];
  $: setupPlacedIndexes = [setupActiveIndex, ...setupBenchIndexes].filter((index): index is number => index !== null);
  $: setupSelectedIndex =
    selectedHand && setupPrompt?.playerIndex === selectedHand.playerIndex && setupPlayableIndexes.includes(selectedHand.handIndex)
      ? selectedHand.handIndex
      : undefined;
  $: if (currentPrompt?.id !== undefined && setupPromptKey !== `${currentPrompt.id}:${currentPrompt.className}`) {
    setupPromptKey = `${currentPrompt.id}:${currentPrompt.className}`;
    setupActiveIndex = null;
    setupBenchIndexes = [];
    selectedBoardTargets = [];
    attachPromptEnergyIndex = null;
    attachPromptAssignments = [];
  } else if (!currentPrompt && setupPromptKey) {
    setupPromptKey = '';
    setupActiveIndex = null;
    setupBenchIndexes = [];
    selectedBoardTargets = [];
    attachPromptEnergyIndex = null;
    attachPromptAssignments = [];
  }

  function resetPerspective() {
    boardTilt = 8;
    boardPerspective = 1250;
    boardScaleY = 94;
    boardLift = 0;
  }
  $: if (game && followActive) {
    viewIndex = setupPrompt?.playerIndex ?? game.activePlayerIndex;
  }
  $: gameFinished = game?.phase === 7;
  $: winnerName =
    game?.winner === 0 || game?.winner === 1
      ? game.players[game.winner]?.name
      : game?.winner === 3
        ? 'Draw'
        : undefined;
  $: canAct = (playerIndex: number) => game?.activePlayerIndex === playerIndex && !currentPrompt && !gameFinished;
  $: selectedCard = selectedHand && game ? game.players[selectedHand.playerIndex]?.hand[selectedHand.handIndex] : undefined;
  $: draggingCard = draggingHand && game ? game.players[draggingHand.playerIndex]?.hand[draggingHand.handIndex] : undefined;
  $: currentStadium = game ? game.players.flatMap((player) => player.stadium)[0] : undefined;
  $: currentStadiumOwner = game?.players.find((player) => player.stadium.length);
  $: viewedCards = openZone && game ? (game.players[openZone.playerIndex]?.[openZone.zone] ?? []) : [];
  $: attachPreviewKey = attachPrompt
    ? attachPromptAssignments.map((assignment) => `${assignment.energyIndex}:${assignment.target.player}:${assignment.target.slot}:${assignment.target.index}`).join('|')
    : '';
  $: focusedPlayer = focusedSlot && game ? game.players[focusedSlot.ownerIndex] : undefined;
  $: focusedPokemon = focusedSlot?.pokemon;
  $: focusedIsActive = focusedSlot?.slot === 'active';
  $: focusedCanAct = !!focusedPlayer && canAct(focusedPlayer.index);
  $: focusedBenchTargets = focusedPlayer?.bench.filter((slot) => !slot.empty) ?? [];
  $: topActiveSlot = topPlayer
    ? previewAttachEnergySlot(
        previewSlot(
          topPlayer.active,
          topPlayer.index === setupPrompt?.playerIndex && setupActiveIndex !== null ? topPlayer.hand[setupActiveIndex] : undefined,
        ),
        attachPreviewKey,
      )
    : undefined;
  $: bottomActiveSlot = bottomPlayer
    ? previewAttachEnergySlot(
        previewSlot(
          bottomPlayer.active,
          bottomPlayer.index === setupPrompt?.playerIndex && setupActiveIndex !== null ? bottomPlayer.hand[setupActiveIndex] : undefined,
        ),
        attachPreviewKey,
      )
    : undefined;
  $: topBenchSlots = topPlayer ? benchSlotsFor(topPlayer, setupPrompt, setupBenchIndexes).map((slot) => previewAttachEnergySlot(slot, attachPreviewKey)) : [];
  $: bottomBenchSlots = bottomPlayer ? benchSlotsFor(bottomPlayer, setupPrompt, setupBenchIndexes).map((slot) => previewAttachEnergySlot(slot, attachPreviewKey)) : [];
  $: canPlayOnBoard =
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
    );
  $: if (currentPrompt || gameFinished) {
    focusedSlot = null;
  }
  $: if (autoConfirmPrompts && autoConfirmPrompt && currentPrompt && !resolvingPrompt) {
    const key = `${currentPrompt.id}:${currentPrompt.className}`;
    if (autoConfirmPromptKey !== key) {
      autoConfirmPromptKey = key;
      void resolvePrompt(true);
    }
  } else if (!autoConfirmPrompt) {
    autoConfirmPromptKey = '';
  }

  async function startGame() {
    const p1 = parseDeckList(deck1Text);
    const p2 = parseDeckList(deck2Text);
    if (p1.errors.length || p2.errors.length) {
      error = [...p1.errors.map((e) => `Player 1: ${e}`), ...p2.errors.map((e) => `Player 2: ${e}`)].join('\n');
      return;
    }

    busy = true;
    error = '';
    selectedHand = null;
    const res = await localGameApi.start(p1.cards, p2.cards);
    busy = false;
    applyResponse(res);
  }

  function applyResponse(res: Awaited<ReturnType<typeof localGameApi.state>>) {
    if (res.ok) {
      game = res.view;
      error = '';
      selectedHand = null;
      draggingHand = null;
      focusedSlot = null;
      if (!res.view.prompts.length) {
        setupActiveIndex = null;
        setupBenchIndexes = [];
      }
      return;
    }
    error = res.error;
    if (res.view) {
      game = res.view;
    }
  }

  async function playToTarget(target: CardTarget) {
    if (!selectedHand || !game || !canAct(selectedHand.playerIndex)) {
      return;
    }
    busy = true;
    const res = await localGameApi.playCard(selectedHand.playerIndex, selectedHand.handIndex, target);
    busy = false;
    applyResponse(res);
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
      focusedSlot = slot;
    }
  }

  async function attack(name: string) {
    if (!game || !focusedPlayer || !focusedIsActive || !focusedCanAct) return;
    busy = true;
    const res = await localGameApi.attack(focusedPlayer.index, name);
    busy = false;
    applyResponse(res);
  }

  async function useAbility(name: string, target: CardTarget) {
    if (!game || !focusedPlayer || !focusedCanAct) return;
    busy = true;
    const res = await localGameApi.useAbility(focusedPlayer.index, name, target);
    busy = false;
    applyResponse(res);
  }

  async function concede() {
    if (!game || !activePlayer || gameFinished) return;
    busy = true;
    const res = await localGameApi.concede(game.activePlayerIndex);
    busy = false;
    applyResponse(res);
  }

  async function passTurn() {
    if (!game) return;
    busy = true;
    const res = await localGameApi.passTurn(game.activePlayerIndex);
    busy = false;
    applyResponse(res);
  }

  async function retreat(to: number) {
    if (!game) return;
    busy = true;
    const res = await localGameApi.retreat(game.activePlayerIndex, to);
    busy = false;
    applyResponse(res);
  }

  async function resolvePrompt(value: unknown) {
    if (!currentPrompt) return;
    resolvingPrompt = true;
    const res = await localGameApi.resolvePrompt(currentPrompt.id, value);
    resolvingPrompt = false;
    applyResponse(res);
  }

  function selectHandCard(playerIndex: number, handIndex: number) {
    if (setupPrompt && playerIndex === setupPrompt.playerIndex) {
      if (!isSetupStartable(game?.players[playerIndex]?.hand[handIndex], handIndex)) {
        return;
      }
      selectedHand =
        selectedHand?.playerIndex === playerIndex && selectedHand.handIndex === handIndex
          ? null
          : { playerIndex, handIndex };
      focusedSlot = null;
      return;
    }

    if (!canAct(playerIndex)) {
      return;
    }
    selectedHand =
      selectedHand?.playerIndex === playerIndex && selectedHand.handIndex === handIndex
        ? null
        : { playerIndex, handIndex };
    focusedSlot = null;
  }

  function onHandDrag(playerIndex: number, handIndex: number, event: DragEvent) {
    if (setupPrompt && playerIndex === setupPrompt.playerIndex) {
      if (!isSetupStartable(game?.players[playerIndex]?.hand[handIndex], handIndex)) {
        return;
      }
    } else if (!canAct(playerIndex)) {
      return;
    }
    selectedHand = { playerIndex, handIndex };
    focusedSlot = null;
    draggingHand = { playerIndex, handIndex };
    event.dataTransfer?.setData('text/plain', `${playerIndex}:${handIndex}`);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function clearDragState() {
    draggingHand = null;
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
    followActive = false;
    viewIndex = topPlayer?.index ?? 0;
  }

  function resetGame() {
    game = null;
    error = '';
    selectedHand = null;
    draggingHand = null;
    openZone = null;
    resolvingPrompt = false;
    focusedSlot = null;
    busy = false;
    followActive = true;
    viewIndex = 0;
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

  function occupiedBench(player: PlayerView) {
    return player.bench.filter((slot) => !slot.empty);
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
    openZone = { playerIndex, zone, title, faceDown };
  }

  function normalizePromptLimit(value: unknown, fallback: number) {
    return promptLimit(value, fallback);
  }

  function sameTarget(a: CardTarget, b: CardTarget) {
    return a.player === b.player && a.slot === b.slot && a.index === b.index;
  }

  function targetForPromptSlot(prompt: PromptView, slot: PokemonSlotView) {
    return targetFor(prompt.playerIndex, slot.ownerIndex, slot.slot === 'active' ? SlotType.ACTIVE : SlotType.BENCH, slot.index);
  }

  function getBoardPromptTargets(current: GameView, prompt: PromptView) {
    const playerType = Number((prompt.fields as any).playerType ?? PlayerType.ANY);
    const slots = Array.isArray((prompt.fields as any).slots)
      ? ((prompt.fields as any).slots as number[])
      : [SlotType.ACTIVE, SlotType.BENCH];
    const blocked = Array.isArray((prompt.fields as any).options?.blocked)
      ? ((prompt.fields as any).options.blocked as CardTarget[])
      : [];
    const result: CardTarget[] = [];
    for (const player of current.players) {
      const isPromptPlayer = player.index === prompt.playerIndex;
      if (playerType === PlayerType.BOTTOM_PLAYER && !isPromptPlayer) continue;
      if (playerType === PlayerType.TOP_PLAYER && isPromptPlayer) continue;
      if (slots.includes(SlotType.ACTIVE) && !player.active.empty) {
        const target = targetForPromptSlot(prompt, player.active);
        if (!blocked.some((item) => sameTarget(item, target))) {
          result.push(target);
        }
      }
      if (slots.includes(SlotType.BENCH)) {
        for (const bench of player.bench) {
          if (bench.empty) continue;
          const target = targetForPromptSlot(prompt, bench);
          if (!blocked.some((item) => sameTarget(item, target))) {
            result.push(target);
          }
        }
      }
    }
    return result;
  }

  function extractPromptCards(fields: Record<string, unknown>) {
    const cardList = (fields.cardList as any[]) ?? (fields.cards as any[]);
    if (Array.isArray(cardList)) {
      return cardList;
    }
    const energy = fields.energy as any[];
    if (Array.isArray(energy)) {
      return energy.map((item, index) => ({ index: item.index ?? index, ...(item.card ?? {}) }));
    }
    return [];
  }

  function getAttachPromptTargets(current: GameView, prompt: PromptView) {
    const playerType = Number((prompt.fields as any).playerType ?? PlayerType.ANY);
    const slots = Array.isArray((prompt.fields as any).slots)
      ? ((prompt.fields as any).slots as number[])
      : [SlotType.ACTIVE, SlotType.BENCH];
    const blockedTo = Array.isArray((prompt.fields as any).options?.blockedTo)
      ? ((prompt.fields as any).options.blockedTo as CardTarget[])
      : [];
    const result: CardTarget[] = [];
    for (const player of current.players) {
      const isPromptPlayer = player.index === prompt.playerIndex;
      if (playerType === PlayerType.BOTTOM_PLAYER && !isPromptPlayer) continue;
      if (playerType === PlayerType.TOP_PLAYER && isPromptPlayer) continue;
      if (slots.includes(SlotType.ACTIVE) && !player.active.empty) {
        const target = targetForPromptSlot(prompt, player.active);
        if (!blockedTo.some((item) => sameTarget(item, target))) {
          result.push(target);
        }
      }
      if (slots.includes(SlotType.BENCH)) {
        for (const bench of player.bench) {
          if (bench.empty) continue;
          const target = targetForPromptSlot(prompt, bench);
          if (!blockedTo.some((item) => sameTarget(item, target))) {
            result.push(target);
          }
        }
      }
    }
    return result;
  }

  function isAttachEnergyAvailable(index: number) {
    const blocked = new Set<number>(Array.isArray((attachPrompt?.fields.options as any)?.blocked) ? (attachPrompt?.fields.options as any).blocked : []);
    return !blocked.has(index) && !attachPromptAssignments.some((assignment) => assignment.energyIndex === index);
  }

  function canAssignAttachPromptTarget(target: CardTarget, energyIndex = attachPromptEnergyIndex) {
    if (!attachPrompt || energyIndex === null || !isAttachEnergyAvailable(energyIndex)) {
      return false;
    }
    if (attachPromptMax > 1 && attachPromptAssignments.length >= attachPromptMax) {
      return false;
    }
    const options = (attachPrompt.fields.options as any) ?? {};
    if (options.differentTargets && attachPromptAssignments.some((assignment) => sameTarget(assignment.target, target))) {
      return false;
    }
    if (options.sameTarget && attachPromptAssignments.length > 0 && !sameTarget(attachPromptAssignments[0].target, target)) {
      return false;
    }
    return attachPromptTargets.some((item) => sameTarget(item, target));
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
    selectedBoardTargets = selectedBoardTargets.some((item) => sameTarget(item, target))
      ? selectedBoardTargets.filter((item) => !sameTarget(item, target))
      : selectedBoardTargets.length < boardPromptMax
        ? [...selectedBoardTargets, target]
        : selectedBoardTargets;
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
    const withoutEnergy = attachPromptAssignments.filter((assignment) => assignment.energyIndex !== attachPromptEnergyIndex);
    const nextAssignment = { energyIndex: attachPromptEnergyIndex, target };
    attachPromptAssignments = attachPromptMax <= 1
      ? [nextAssignment]
      : [...withoutEnergy, nextAssignment].slice(0, attachPromptMax);
    attachPromptEnergyIndex = null;
  }

  function selectAttachPromptEnergy(index: number | null) {
    attachPromptEnergyIndex = attachPromptEnergyIndex === index ? null : index;
  }

  function removeAttachPromptAssignment(index: number) {
    attachPromptAssignments = attachPromptAssignments.filter((assignment) => assignment.energyIndex !== index);
    if (attachPromptEnergyIndex === index) {
      attachPromptEnergyIndex = null;
    }
  }

  function resetAttachPromptAssignments() {
    attachPromptAssignments = [];
    attachPromptEnergyIndex = null;
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
    setupBenchIndexes = setupBenchIndexes.filter((index) => index !== handIndex);
    setupActiveIndex = handIndex;
    selectedHand = null;
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
    setupBenchIndexes = [...setupBenchIndexes, handIndex];
    selectedHand = null;
  }

  function removeSetupIndex(handIndex: number) {
    if (setupActiveIndex === handIndex) {
      setupActiveIndex = null;
    }
    setupBenchIndexes = setupBenchIndexes.filter((index) => index !== handIndex);
  }

  async function confirmSetupPokemon() {
    if (!setupPrompt || !setupCanConfirm) {
      return;
    }
    await resolvePrompt(setupPromptResult(setupHasEngineActive, setupActiveIndex, setupBenchIndexes));
  }

  function previewSlot(slot: PokemonSlotView, card: CardView | undefined): PokemonSlotView {
    if (!card) {
      return slot;
    }
    return {
      ...slot,
      empty: false,
      pokemon: card,
      cards: [card],
      damage: 0,
      hp: 0,
      energy: [],
      tools: [],
      specialConditions: [],
    };
  }

  function previewAttachEnergySlot(slot: PokemonSlotView, _previewKey = ''): PokemonSlotView {
    if (!attachPrompt) {
      return slot;
    }
    const target = targetForPromptSlot(attachPrompt, slot);
    const pending = attachPromptAssignments
      .filter((assignment) => sameTarget(assignment.target, target))
      .map((assignment) => {
        const card = attachPromptCards.find((item, index) => (item.index ?? index) === assignment.energyIndex);
        return card ? ({ ...card, pendingAttach: true } as CardView) : undefined;
      })
      .filter((card): card is CardView => !!card);
    return pending.length
      ? {
          ...slot,
          energy: [...slot.energy, ...pending],
        }
      : slot;
  }

  function benchSlotsFor(player: PlayerView, prompt = setupPrompt, benchIndexes = setupBenchIndexes) {
    const occupied = occupiedBench(player);
    if (!prompt || player.index !== prompt.playerIndex) {
      return occupied;
    }
    const emptySlots = player.bench.filter((slot) => slot.empty);
    const previews = benchIndexes
      .map((handIndex, index) => {
        const card = player.hand[handIndex];
        const slot = emptySlots[index] ?? player.bench[index] ?? player.bench[0];
        return slot && card ? previewSlot(slot, card) : undefined;
      })
      .filter((slot): slot is PokemonSlotView => !!slot);
    return [...occupied, ...previews];
  }
</script>

<main>
  {#if !game}
    <header class="app-header">
      <div>
        <h1>Twinleaf Local</h1>
        <p>Manual-prompt, two-deck self-play client.</p>
      </div>
    </header>

    <section class="import-screen">
      <div class="deck-import">
        <label>
          Player 1 deck
          <textarea bind:value={deck1Text} spellcheck="false"></textarea>
        </label>
        <label>
          Player 2 deck
          <textarea bind:value={deck2Text} spellcheck="false"></textarea>
        </label>
      </div>
      <button class="primary" disabled={busy} on:click={startGame}>
        {busy ? 'Starting...' : 'Start local game'}
      </button>
      {#if error}
        <pre class="error">{error}</pre>
      {/if}
    </section>
  {:else if bottomPlayer && topPlayer}
    <section class="table-shell" class:debug-zones={debugZones}>
      <div class="game-status">
        <strong>{winnerName ? `${winnerName} wins` : game.phaseLabel}</strong>
        <span>Turn {game.turn}</span>
        {#if !gameFinished}
          <span>{activePlayer?.name}</span>
        {/if}
      </div>

      <div class="table-toolbar">
        <details class="board-perspective-controls">
          <summary aria-label="Board perspective settings" title="Board perspective settings">⚙</summary>
          <div class="board-perspective-menu">
            <strong>Board perspective</strong>
            <label>
              Tilt
              <input type="range" min="0" max="18" step="1" bind:value={boardTilt} />
              <span>{boardTilt}deg</span>
            </label>
            <label>
              Depth
              <input type="range" min="700" max="2200" step="50" bind:value={boardPerspective} />
              <span>{boardPerspective}px</span>
            </label>
            <label>
              Height
              <input type="range" min="86" max="100" step="1" bind:value={boardScaleY} />
              <span>{boardScaleY}%</span>
            </label>
            <label>
              Lift
              <input type="range" min="-48" max="48" step="2" bind:value={boardLift} />
              <span>{boardLift}px</span>
            </label>
            <button type="button" on:click={resetPerspective}>Reset</button>
          </div>
        </details>
        <label>
          <input type="checkbox" bind:checked={followActive} />
          Follow active player
        </label>
        <label>
          <input type="checkbox" bind:checked={autoConfirmPrompts} />
          Auto-confirm reveals
        </label>
        <label>
          <input type="checkbox" bind:checked={debugZones} />
          Debug zones
        </label>
        <label>
          <input type="checkbox" bind:checked={showLogs} />
          Show logs
        </label>
        <div class="sidebar-turn-actions">
          <button disabled={busy || !!currentPrompt || gameFinished} on:click={passTurn}>Pass turn</button>
          <button class="danger" disabled={busy || !!currentPrompt || gameFinished} on:click={concede}>Concede</button>
        </div>
        <button on:click={switchSides}>Switch sides</button>
        <button on:click={resetGame}>Change decks</button>
        {#if error}
          <span class="inline-error">{labelFor(error)}</span>
        {/if}
      </div>

      {#if setupPrompt}
        <div class="setup-dock">
          <strong>Choose your starting Pokemon</strong>
          <span>
            {setupNeedsActive
              ? 'Drag a highlighted Basic to Active, then optionally place Basics on the Bench.'
              : 'Optionally drag highlighted Basics to the Bench, then confirm.'}
          </span>
          <button class="primary" disabled={resolvingPrompt || !setupCanConfirm} on:click={confirmSetupPokemon}>
            Confirm setup
          </button>
        </div>
      {:else if boardTargetPrompt}
        <div class="board-prompt-dock">
          <strong>{labelFor(boardTargetPrompt.message || boardTargetPrompt.type)}</strong>
          <span>Select Pokemon on the board.</span>
          {#if boardPromptMax > 1}
            <button class="primary" disabled={!canConfirmBoardPrompt || resolvingPrompt} on:click={confirmBoardPromptTargets}>
              Confirm selection
            </button>
          {/if}
        </div>
      {:else if currentPrompt && !(autoConfirmPrompts && autoConfirmPrompt)}
        <div
          class="prompt-dock"
          class:search-prompt-dock={currentPrompt.className === 'ChooseCardsPrompt'}
          class:attach-energy-prompt-dock={currentPrompt.className === 'AttachEnergyPrompt'}
        >
          <PromptPanel
            game={game}
            prompt={currentPrompt}
            resolving={resolvingPrompt}
            activeAttachEnergyIndex={attachPromptEnergyIndex}
            attachAssignments={attachPromptAssignments}
            on:resolve={(event) => resolvePrompt(event.detail)}
            on:attachEnergySelect={(event) => selectAttachPromptEnergy(event.detail)}
            on:attachEnergyUnassign={(event) => removeAttachPromptAssignment(event.detail)}
            on:attachEnergyReset={resetAttachPromptAssignments}
          />
        </div>
      {/if}

      <div class="board">
        <section class="player-panel top">
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
        </section>

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
          {allowBoardPlayDrop}
          {dropToBoardPlay}
          {boardTilt}
          {boardPerspective}
          {boardScaleY}
          {boardLift}
        />

        <section class="player-panel bottom">
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
        </section>

        {#if focusedSlot && focusedPlayer && focusedPokemon}
          <button
            type="button"
            class="active-focus-backdrop"
            aria-label="Close Pokemon actions"
            on:click={() => (focusedSlot = null)}
          ></button>
          <section class="active-focus" aria-label={`${focusedPokemon.name} actions`}>
            <div class="focus-card">
              <CardTile card={focusedPokemon} />
            </div>
            <div class="focus-content">
              <div class="focus-title">
                <div>
                  <strong>{focusedPokemon.name}</strong>
                  <span>
                    {focusedSlot.slot === 'active' ? 'Active' : `Bench ${focusedSlot.index + 1}`}
                    · {Math.max(0, focusedSlot.hp - focusedSlot.damage)}/{focusedSlot.hp} HP
                    · {focusedSlot.energy.length} Energy
                    {#if focusedSlot.tools.length}
                      · {focusedSlot.tools.length} Tool
                    {/if}
                  </span>
                </div>
                <button type="button" class="focus-close" on:click={() => (focusedSlot = null)} aria-label="Close Pokemon actions">
                  Close
                </button>
              </div>

              <div class="focus-actions">
                {#if focusedPokemon.powers?.length}
                  <div class="action-group">
                    <span>Abilities</span>
                    {#each focusedPokemon.powers as power}
                      <button disabled={busy || !!currentPrompt || !focusedCanAct} title={power.text ?? power.name} on:click={() => useAbility(power.name, focusedSlot.target)}>
                        {power.name}
                      </button>
                    {/each}
                  </div>
                {/if}

                {#if focusedIsActive && focusedPokemon.attacks?.length}
                  <div class="action-group">
                    <span>Attacks</span>
                    {#each focusedPokemon.attacks as item}
                      <button disabled={busy || !!currentPrompt || !focusedCanAct} title={item.text ?? item.name} on:click={() => attack(item.name)}>
                        {item.name} {item.damage ? `(${item.damage})` : ''}
                      </button>
                    {/each}
                  </div>
                {/if}

                {#if focusedIsActive && focusedBenchTargets.length}
                  <div class="action-group">
                    <span>Retreat</span>
                    {#each focusedBenchTargets as bench}
                      <button disabled={busy || !!currentPrompt || !focusedCanAct || !canRetreatToSlot(focusedSlot, bench)} on:click={() => retreat(bench.index)}>
                        To bench {bench.index + 1}
                      </button>
                    {/each}
                  </div>
                {/if}

              </div>
            </div>
          </section>
        {/if}

        {#if showLogs}
          <aside class="log-panel">
            <h2>Log</h2>
            {#each game.logs.slice(-18).reverse() as log}
              <p>{labelFor(log.message)}</p>
            {/each}
          </aside>
        {/if}

        <ZoneViewer
          open={!!openZone}
          title={openZone?.title ?? ''}
          cards={viewedCards}
          faceDown={openZone?.faceDown ?? false}
          on:close={() => (openZone = null)}
        />
      </div>
    </section>
  {/if}
</main>
