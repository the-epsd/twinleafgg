import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from '../i18n/strings';
import type { CardList, Player } from 'ptcg-server';
import { GamePhase } from 'ptcg-server';
import { useAuth } from '../context/AuthContext';
import { useDeckCardScanUrl } from '../context/CardImagesContext';
import { useCoreSession } from '../context/CoreSessionContext';
import { getSocketManager } from '../socket/socketManager';
import { ApiError, formatUnknownError } from '../api/apiError';
import { useSnackbar } from '../context/SnackbarContext';
import { translateGameSocketError } from '../i18n/translateGameSocketError';
import { buildLocalGameFromMatchReplay } from '../api/replayApi';
import type { LocalGameState } from '../table/types/localGameState';
import { gameStateToLocal, mergeStateChange } from '../table/gameSessionUtils';
import { BoardInteractionService } from '../table/BoardInteractionService';
import type { Board3dGameActions } from '../table/board3d/board3dGameActions';
import { Board3DCanvas } from '../table/board3d/Board3DCanvas';
import { TablePromptLayer } from '../table/prompts/TablePromptLayer';
import { TableBoardOverlay } from '../table/hud/TableBoardOverlay';
import { GameOverOverlay } from '../table/end-game/GameOverOverlay';
import { MatchResultsSplash } from '../table/end-game/MatchResultsSplash';

const RECONNECT_GAME_ID_KEY = 'ptcg_reconnect_gameId';

function persistGameId(gameId: number): void {
  try {
    localStorage.setItem(RECONNECT_GAME_ID_KEY, String(gameId));
  } catch {
    /* ignore */
  }
}

function clearPersistedGameId(): void {
  try {
    localStorage.removeItem(RECONNECT_GAME_ID_KEY);
  } catch {
    /* ignore */
  }
}

type TableView = {
  bottomPlayer: Player;
  topPlayer: Player;
  bottomHand: CardList;
  topHand: CardList;
  isPlaying: boolean;
  isObserver: boolean;
};

export function TablePage() {
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();
  const { gameId: gameIdParam, matchId: matchIdParam } = useParams<{
    gameId?: string;
    matchId?: string;
  }>();
  const navigate = useNavigate();
  const { cardsInfo, serverConfig } = useAuth();
  const getScanUrl = useDeckCardScanUrl(serverConfig?.scansUrl);
  const { clientId } = useCoreSession();

  const hasReplayParam = matchIdParam != null && matchIdParam !== '';
  const replayMatchId = hasReplayParam ? Number(matchIdParam) : NaN;
  const serverGameId = gameIdParam != null && gameIdParam !== '' ? Number(gameIdParam) : NaN;
  const isReplayRoute = hasReplayParam;
  const isLiveRoute = Number.isFinite(serverGameId);
  const [localGame, setLocalGame] = useState<LocalGameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [endFlowStage, setEndFlowStage] = useState<'splash' | 'stats' | null>(null);
  const [suppressChoosePrizePrompt, setSuppressChoosePrizePrompt] = useState(false);
  const clientIdRef = useRef(clientId);
  clientIdRef.current = clientId;

  const boardInteraction = useMemo(() => new BoardInteractionService(), []);

  const onGameSocketError = useCallback(
    (e: unknown) => {
      const raw = formatUnknownError(e);
      showSnackbar(translateGameSocketError(t, raw), { variant: 'error' });
    },
    [showSnackbar, t],
  );

  const onKoSequenceActiveChange = useCallback((active: boolean) => {
    setSuppressChoosePrizePrompt(active);
  }, []);

  const socketGameActions: Board3dGameActions = useMemo(() => {
    const socket = getSocketManager();
    const wrap = (p: Promise<unknown>): Promise<void> =>
      p
        .then(() => undefined)
        .catch((e: unknown) => {
          onGameSocketError(e);
        });
    return {
      playCardAction: (gameId, handIndex, target) =>
        wrap(socket.emit('game:action:playCard', { gameId, handIndex, target })),
      retreatAction: (gameId, to) => wrap(socket.emit('game:action:retreat', { gameId, to })),
      trainerAbility: (gameId, ability, target) =>
        wrap(socket.emit('game:action:trainerAbility', { gameId, ability, target })),
      energyAbility: (gameId, ability, target) =>
        wrap(socket.emit('game:action:energyAbility', { gameId, ability, target })),
      ability: (gameId, ability, target) =>
        wrap(socket.emit('game:action:ability', { gameId, ability, target })),
      stadium: (gameId) => wrap(socket.emit('game:action:stadium', { gameId })),
      attack: (gameId, attack) => wrap(socket.emit('game:action:attack', { gameId, attack })),
      retreatStart: (gameId) => wrap(socket.emit('game:action:retreatStart', { gameId })),
      resolvePrompt: (gameId, promptId, result) =>
        wrap(socket.emit('game:action:resolvePrompt', { gameId, id: promptId, result })),
    };
  }, [onGameSocketError]);

  const replayNoopGameActions: Board3dGameActions = useMemo(
    () => ({
      playCardAction: async () => { },
      retreatAction: async () => { },
      trainerAbility: async () => { },
      energyAbility: async () => { },
      ability: async () => { },
      stadium: async () => { },
      attack: async () => { },
      retreatStart: async () => { },
      resolvePrompt: async () => { },
    }),
    [],
  );

  const gameActions: Board3dGameActions =
    localGame?.replay != null ? replayNoopGameActions : socketGameActions;

  const onResolvePrompt = useCallback(
    (promptId: number, result: unknown) => {
      if (!isLiveRoute || !Number.isFinite(serverGameId)) {
        return;
      }
      void getSocketManager()
        .emit('game:action:resolvePrompt', {
          gameId: serverGameId,
          id: promptId,
          result,
        })
        .catch(onGameSocketError);
    },
    [isLiveRoute, onGameSocketError, serverGameId],
  );

  const registerGameSocket = useCallback(
    (gameId: number) => {
      const socket = getSocketManager();
      const raw = socket.raw;

      const onState = (data: { stateData: string; playerStats?: import('ptcg-server').PlayerStats[] }) => {
        setLocalGame((g) => {
          if (!g || g.gameId !== gameId) return g;
          const next = mergeStateChange(g, data.stateData, data.playerStats);
          boardInteraction.updateGameLogs(next.logs);
          if (next.state.phase === GamePhase.FINISHED) {
            clearPersistedGameId();
          }
          return next;
        });
      };

      const onBasic = (data: {
        playerId: number;
        cardId: number | string;
        slot: string;
        index?: number;
      }) => {
        boardInteraction.triggerBasicAnimation(data);
      };
      const onEvo = (data: {
        playerId: number;
        cardId: number | string;
        slot: string;
        index?: number;
      }) => {
        boardInteraction.triggerEvolutionAnimation(data);
      };
      const onAttack = (data: {
        playerId: number;
        cardId: number | string;
        slot: string;
        index?: number;
      }) => {
        boardInteraction.triggerAttackAnimation(data);
      };
      const onCoin = (data: { playerId: number; result: boolean }) => {
        boardInteraction.triggerCoinFlipAnimation(data.result, data.playerId);
      };

      raw.on(`game[${gameId}]:stateChange`, onState);
      raw.on(`game[${gameId}]:playBasicAnimation`, onBasic);
      raw.on(`game[${gameId}]:evolution`, onEvo);
      raw.on(`game[${gameId}]:attack`, onAttack);
      raw.on(`game[${gameId}]:coinFlip`, onCoin);

      return () => {
        raw.off(`game[${gameId}]:stateChange`, onState);
        raw.off(`game[${gameId}]:playBasicAnimation`, onBasic);
        raw.off(`game[${gameId}]:evolution`, onEvo);
        raw.off(`game[${gameId}]:attack`, onAttack);
        raw.off(`game[${gameId}]:coinFlip`, onCoin);
      };
    },
    [boardInteraction],
  );

  useEffect(() => {
    if (isReplayRoute) {
      return;
    }
    if (!Number.isFinite(serverGameId)) {
      setError(t('REACT_INVALID_GAME', 'Invalid game'));
      return;
    }

    if (!cardsInfo) {
      return;
    }

    let cancelled = false;
    let unregister: (() => void) | undefined;

    void (async () => {
      try {
        const socket = getSocketManager();
        const gs = await socket.emit<number, import('ptcg-server').GameState>('game:join', serverGameId);
        if (cancelled) return;
        const local = gameStateToLocal(gs);
        setLocalGame(local);
        boardInteraction.updateGameLogs(local.logs);
        const isPlayer = local.state.players.some((p) => p.id === clientIdRef.current);
        if (isPlayer) {
          persistGameId(serverGameId);
        }
        unregister = registerGameSocket(serverGameId);
      } catch (e) {
        if (!cancelled) {
          const raw = e instanceof ApiError ? e.message : formatUnknownError(e);
          setError(translateGameSocketError(t, raw));
        }
      }
    })();

    return () => {
      cancelled = true;
      unregister?.();
      boardInteraction.endBoardSelection();
      clearPersistedGameId();
    };
  }, [isReplayRoute, serverGameId, cardsInfo, boardInteraction, registerGameSocket, t]);

  useEffect(() => {
    if (!isReplayRoute) {
      return;
    }
    if (!Number.isFinite(replayMatchId)) {
      setError(t('REACT_INVALID_GAME', 'Invalid game'));
      return;
    }
    if (!cardsInfo) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const local = await buildLocalGameFromMatchReplay(replayMatchId);
        if (!cancelled) {
          setLocalGame(local);
          boardInteraction.updateGameLogs(local.logs);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(formatUnknownError(e));
        }
      }
    })();

    return () => {
      cancelled = true;
      boardInteraction.endBoardSelection();
    };
  }, [isReplayRoute, replayMatchId, cardsInfo, boardInteraction, t]);

  useEffect(() => {
    if (!localGame || localGame.replay || !clientId) {
      return;
    }
    if (!Number.isFinite(serverGameId) || localGame.gameId !== serverGameId) {
      return;
    }
    const isPlayer = localGame.state.players.some((p) => p.id === clientId);
    if (isPlayer) {
      persistGameId(serverGameId);
    }
  }, [localGame, clientId, serverGameId]);

  useEffect(() => {
    setEndFlowStage(null);
  }, [isReplayRoute, replayMatchId, serverGameId]);

  useEffect(() => {
    if (!localGame) {
      return;
    }
    const finished = localGame.state.phase === GamePhase.FINISHED && !localGame.gameOver;
    if (!finished) {
      setEndFlowStage(null);
      return;
    }
    setEndFlowStage((s) => (s === null ? 'splash' : s));
  }, [localGame]);

  const tableClientId = useMemo(() => {
    if (!localGame) {
      return undefined;
    }
    if (localGame.replay != null) {
      return clientId != null && clientId !== 0
        ? clientId
        : (localGame.state.players[0]?.id ?? 0);
    }
    return clientId != null && clientId !== 0 ? clientId : undefined;
  }, [localGame, clientId]);

  const tableView = useMemo((): TableView | null => {
    if (!localGame || tableClientId == null) {
      return null;
    }
    const players = localGame.state.players;
    if (players.length < 2) {
      return null;
    }
    const isPlaying = players.some((p) => p.id === tableClientId);
    let bottom: Player | undefined;
    let top: Player | undefined;
    if (isPlaying) {
      bottom = players.find((p) => p.id === tableClientId);
      top = players.find((p) => p.id !== tableClientId);
    } else {
      bottom = players[0];
      top = players[1];
    }
    if (!bottom || !top) {
      return null;
    }
    if (localGame.switchSide) {
      const tmp = bottom;
      bottom = top;
      top = tmp;
    }
    return {
      bottomPlayer: bottom,
      topPlayer: top,
      bottomHand: bottom.hand,
      topHand: top.hand,
      isPlaying,
      isObserver: !isPlaying,
    };
  }, [localGame, tableClientId]);

  const toggleSwitchSides = useCallback(() => {
    setLocalGame((g) => (g ? { ...g, switchSide: !g.switchSide } : g));
  }, []);

  const onPassTurn = useCallback(() => {
    if (!isLiveRoute || !Number.isFinite(serverGameId)) {
      return;
    }
    void getSocketManager()
      .emit('game:action:passTurn', { gameId: serverGameId })
      .catch(onGameSocketError);
  }, [isLiveRoute, onGameSocketError, serverGameId]);

  const onLeave = useCallback(() => {
    const leaveReplay = isReplayRoute || localGame?.replay != null;
    const msg = leaveReplay ? t('REACT_LEAVE_REPLAY') : t('MAIN_LEAVE_GAME');
    if (!window.confirm(msg)) {
      return;
    }
    if (leaveReplay) {
      navigate('/games');
      return;
    }
    void getSocketManager()
      .emit('game:concede', { gameId: serverGameId })
      .catch(onGameSocketError);
    clearPersistedGameId();
    navigate('/games');
  }, [isReplayRoute, localGame?.replay, navigate, onGameSocketError, serverGameId, t]);

  const onSendChat = useCallback(
    (message: string) => {
      if (!isLiveRoute || !Number.isFinite(serverGameId)) {
        return;
      }
      void getSocketManager()
        .emit('game:action:appendLog', { gameId: serverGameId, message })
        .catch(onGameSocketError);
    },
    [isLiveRoute, onGameSocketError, serverGameId],
  );

  const onReplayStep = useCallback(
    (position: number, state: LocalGameState['state'], logs: LocalGameState['logs']) => {
      setLocalGame((g) => (g ? { ...g, state, logs, replayPosition: position } : g));
      boardInteraction.updateGameLogs(logs);
    },
    [boardInteraction],
  );

  const onGameOverConfirm = useCallback(() => {
    clearPersistedGameId();
    navigate('/games');
  }, [localGame?.replay, navigate]);

  if (error) {
    const backTarget = '/games';
    return (
      <div style={{ padding: 24 }}>
        <p>{error}</p>
        <button type="button" onClick={() => navigate(backTarget)}>
          {t('BUTTON_BACK')}
        </button>
      </div>
    );
  }

  if (!localGame || !tableView || tableClientId == null) {
    return <div style={{ padding: 24 }}>{t('REACT_LOADING')}</div>;
  }

  const { bottomPlayer, topPlayer, bottomHand, topHand, isPlaying, isObserver } = tableView;

  const showEndGame =
    localGame.state.phase === GamePhase.FINISHED &&
    !localGame.gameOver &&
    (clientId != null || localGame.replay != null);

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <TablePromptLayer
        localGame={localGame}
        clientId={tableClientId}
        catalog={cardsInfo?.cards ?? []}
        getScanUrl={getScanUrl}
        boardInteraction={boardInteraction}
        onResolvePrompt={onResolvePrompt}
        suppressChoosePrizePrompt={suppressChoosePrizePrompt}
      />
      <TableBoardOverlay
        localGame={localGame}
        clientId={tableClientId}
        topPlayer={topPlayer}
        bottomPlayer={bottomPlayer}
        isPlaying={isPlaying}
        isObserver={isObserver}
        onPassTurn={onPassTurn}
        onLeave={onLeave}
        onSwitchSides={toggleSwitchSides}
        onSendChat={onSendChat}
        onReplayStep={onReplayStep}
      />
      <Board3DCanvas
        gameState={localGame}
        topPlayer={topPlayer}
        bottomPlayer={bottomPlayer}
        bottomPlayerHand={bottomHand}
        topPlayerHand={topHand}
        clientId={tableClientId}
        catalog={cardsInfo?.cards ?? []}
        boardInteraction={boardInteraction}
        gameActions={gameActions}
        onKoSequenceActiveChange={onKoSequenceActiveChange}
      />
      {showEndGame && endFlowStage === 'splash' ? (
        <MatchResultsSplash
          localGame={localGame}
          clientId={tableClientId}
          onDismiss={() => setEndFlowStage('stats')}
        />
      ) : null}
      {showEndGame && endFlowStage === 'stats' ? (
        <GameOverOverlay
          localGame={localGame}
          clientId={tableClientId}
          getScanUrl={getScanUrl}
          onConfirm={onGameOverConfirm}
        />
      ) : null}
    </div>
  );
}
