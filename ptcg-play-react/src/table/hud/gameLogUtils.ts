import type { TFunction } from 'i18next';
import type { Player, StateLog } from 'ptcg-server';

export function logPlayerName(log: StateLog, players: Player[]): string {
  if (log.client === 0) {
    return 'System';
  }
  return players.find((p) => p.id === log.client)?.name ?? `Player ${log.client}`;
}

export function isLogHidden(log: StateLog, clientId: number): boolean {
  return String(log.params?.private) === 'true' && log.client !== clientId && log.client !== 0;
}

export function formatGameLogLine(t: TFunction, log: StateLog): string {
  return t(`GAME_LOGS.${log.message}`, {
    ...log.params,
    defaultValue: String(log.message),
  });
}

export type GameLogSpeakerClass = 'system' | 'active' | 'opponent' | 'default';

export function logSpeakerClass(
  log: StateLog,
  activePlayerId: number | undefined,
): GameLogSpeakerClass {
  if (log.client === 0) {
    return 'system';
  }
  if (activePlayerId != null && log.client === activePlayerId) {
    return 'active';
  }
  if (activePlayerId != null && log.client !== activePlayerId) {
    return 'opponent';
  }
  return 'default';
}

export type GameLogTurnSection = {
  key: string;
  title: string;
  turn: number | null;
  logs: StateLog[];
};

export function groupLogsByTurn(
  logs: StateLog[],
  t: TFunction,
  clientId: number,
): GameLogTurnSection[] {
  const sections: GameLogTurnSection[] = [];
  let current: GameLogTurnSection = {
    key: 'setup',
    title: t('REACT_GAME_LOG_SETUP', { defaultValue: 'Setup' }),
    turn: null,
    logs: [],
  };

  for (const log of logs) {
    if (isLogHidden(log, clientId)) {
      continue;
    }
    if (log.message === 'LOG_TURN') {
      if (current.logs.length > 0) {
        sections.push(current);
      }
      const turn = Number(log.params?.turn ?? 0);
      current = {
        key: `turn-${turn}-${log.id}`,
        title: formatGameLogLine(t, log),
        turn,
        logs: [log],
      };
    } else {
      current.logs.push(log);
    }
  }

  if (current.logs.length > 0) {
    sections.push(current);
  }

  return sections;
}
