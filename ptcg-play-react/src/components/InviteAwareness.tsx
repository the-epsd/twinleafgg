import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useCoreSession } from '../context/CoreSessionContext';
import { useSnackbar } from '../context/SnackbarContext';
import { classifyMyGame } from '../games/myGamesClassify';

/**
 * Toasts when a new incoming game invite appears in the lobby list.
 * Renders nothing; lives under CoreSessionProvider + SnackbarProvider.
 */
export function InviteAwareness() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { games, clientId, clients, usersById, connected } = useCoreSession();
  const { showSnackbar } = useSnackbar();
  const toastedIdsRef = useRef<Set<number>>(new Set());
  const readyRef = useRef(false);

  useEffect(() => {
    if (!connected || clientId <= 0) {
      return;
    }
    const userId = user?.userId ?? 0;
    const incomingIds = new Set<number>();

    for (const game of games) {
      if (classifyMyGame(game, clientId, userId) !== 'incoming') {
        continue;
      }
      incomingIds.add(game.gameId);
      if (!readyRef.current) {
        toastedIdsRef.current.add(game.gameId);
        continue;
      }
      if (toastedIdsRef.current.has(game.gameId)) {
        continue;
      }
      toastedIdsRef.current.add(game.gameId);

      const inviteeIndex = game.players.findIndex((p) => p.clientId === game.inviteeClientId);
      const inviterIndex = inviteeIndex === 0 ? 1 : 0;
      const inviterPlayer = game.players[inviterIndex];
      const inviterClient = inviterPlayer
        ? clients.find((c) => c.clientId === inviterPlayer.clientId)
        : undefined;
      const inviterUser =
        (inviterClient && usersById[inviterClient.userId]) ||
        (game.playerUserIds?.[inviterIndex] != null
          ? usersById[game.playerUserIds[inviterIndex]]
          : undefined);
      const name = inviterUser?.name ?? inviterPlayer?.name ?? t('REACT_MY_GAMES_UNKNOWN_PLAYER');

      showSnackbar(t('REACT_MY_GAMES_INVITE_TOAST', { name }), {
        durationMs: 8000,
        action: {
          label: t('REACT_MY_GAMES_INVITE_TOAST_ACTION'),
          onClick: () => navigate('/my-games'),
        },
      });
    }

    for (const id of [...toastedIdsRef.current]) {
      if (!incomingIds.has(id)) {
        toastedIdsRef.current.delete(id);
      }
    }

    readyRef.current = true;
  }, [games, clientId, clients, usersById, connected, user?.userId, showSnackbar, navigate, t]);

  return null;
}
