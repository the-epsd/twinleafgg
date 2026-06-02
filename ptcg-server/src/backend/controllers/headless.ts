import { Request, Response } from 'express';
import { HeadlessCommandRequest, HeadlessCommandRunner } from '../../game/headless/command-handler';
import { Controller, Post } from './controller';

type HeadlessSession = {
  runner: HeadlessCommandRunner;
  lastSeen: number;
};

const sessions = new Map<string, HeadlessSession>();
const sessionTtlMs = 4 * 60 * 60 * 1000;
const maxSessions = 1000;

export class Headless extends Controller {

  @Post('')
  public async onCommand(req: Request, res: Response) {
    cleanupSessions();

    const body = req.body || {};
    const sessionId = normalizeSessionId(body.sessionId) || createSessionId();
    const request = toHeadlessRequest(body);

    if (!request.type) {
      res.status(400).send({ ok: false, sessionId, error: 'Missing headless command type.' });
      return;
    }

    try {
      const session = getSession(sessionId, shouldResetSession(request));
      const response = session.runner.handle(request);
      session.lastSeen = Date.now();
      res.send({ ok: true, sessionId, ...response });
    } catch (error: any) {
      res.status(400).send({
        ok: false,
        sessionId,
        error: error?.message ?? String(error)
      });
    }
  }

}

function toHeadlessRequest(body: any): HeadlessCommandRequest {
  return {
    id: body.id,
    type: typeof body.type === 'string' ? body.type : '',
    payload: body.payload,
    availableActionsScope: normalizeAvailableActionsScope(body.availableActionsScope)
  };
}

function normalizeAvailableActionsScope(value: unknown) {
  return value === 'none' || value === 'active' || value === 'full' ? value : undefined;
}

function shouldResetSession(request: HeadlessCommandRequest): boolean {
  return request.type === 'newGame' || request.type === 'setupScenario';
}

function getSession(sessionId: string, reset: boolean): HeadlessSession {
  const existing = sessions.get(sessionId);
  if (existing && !reset) {
    return existing;
  }
  const session = {
    runner: new HeadlessCommandRunner(),
    lastSeen: Date.now()
  };
  sessions.set(sessionId, session);
  return session;
}

function cleanupSessions(): void {
  const now = Date.now();
  for (const [sessionId, session] of sessions) {
    if (now - session.lastSeen > sessionTtlMs) {
      sessions.delete(sessionId);
    }
  }

  if (sessions.size <= maxSessions) {
    return;
  }

  const staleFirst = [...sessions.entries()].sort((a, b) => a[1].lastSeen - b[1].lastSeen);
  for (const [sessionId] of staleFirst.slice(0, sessions.size - maxSessions)) {
    sessions.delete(sessionId);
  }
}

function normalizeSessionId(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 80);
}

function createSessionId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}
