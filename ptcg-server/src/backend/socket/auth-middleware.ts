import { Socket } from 'socket.io';

import { ApiErrorEnum } from '../common/errors';
import { getValidFormatsForCardList } from '../controllers/decks';
import { User, Deck } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { validateToken } from '../services/auth-token';
import { CardManager, DeckAnalyser } from '../../game';
import { logger } from '../../utils/logger';

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
  const rateLimit = RateLimit.getInstance();
  const token: string = socket.handshake.query && socket.handshake.query.token as string;
  const reconnectionAttempt: string = socket.handshake.query && socket.handshake.query.reconnection as string;
  const userId = validateToken(token);
  const ipAddress: string = (socket.handshake.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || (socket.request.socket.remoteAddress || (socket.request.connection as any)?.remoteAddress)
    || '0.0.0.0';

  if (rateLimit.isLimitExceeded(ipAddress)) {
    return next(new Error(ApiErrorEnum.REQUESTS_LIMIT_REACHED));
  }

  if (userId === 0) {
    rateLimit.increment(ipAddress);
    return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
  }

  const user = await User.findOne(userId);
  if (user === undefined) {
    rateLimit.increment(ipAddress);
    return next(new Error(ApiErrorEnum.AUTH_TOKEN_INVALID));
  }

  // Log reconnection attempts for monitoring
  if (reconnectionAttempt === 'true') {
    logger.log(`[Auth] Reconnection attempt for user=${userId} from IP=${ipAddress}`);
    // Mark this socket as a reconnection attempt
    (socket as any).isReconnectionAttempt = true;
  }

  (socket as any).user = user;
  next();

  // Run deck migration in background (do not block connection)
  void (async () => {
    try {
      const userDecks = await Deck.find({
        where: { user: { id: userId } },
        take: 50,
        order: { id: 'DESC' }
      });
      const cardManager = CardManager.getInstance();
      let hasChanges = false;

      for (const deck of userDecks) {
        const cardNames: string[] = JSON.parse(deck.cards);
        let needsNameUpdate = false;
        const changedCards: string[] = [];

        const resolvedCards = cardNames.map(name => {
          const card = cardManager.getCardByName(name);
          if (card && card.fullName !== name) {
            needsNameUpdate = true;
            changedCards.push(`${name} → ${card.fullName}`);
            return card.fullName;
          }
          return name;
        });

        const deckAnalyser = new DeckAnalyser(needsNameUpdate ? resolvedCards : cardNames);
        const newIsValid = deckAnalyser.isValid();
        const needsValidationUpdate = deck.isValid !== newIsValid;
        const needsFormatsUpdate = !deck.formats || deck.formats.trim() === '';

        if (needsNameUpdate || needsValidationUpdate || needsFormatsUpdate) {
          hasChanges = true;
          if (needsNameUpdate) {
            deck.cards = JSON.stringify(resolvedCards);
          }
          if (needsValidationUpdate) {
            deck.isValid = newIsValid;
          }
          if (needsFormatsUpdate) {
            const cardsForFormats = needsNameUpdate ? resolvedCards : cardNames;
            deck.formats = JSON.stringify(getValidFormatsForCardList(cardsForFormats));
          }
          await deck.save();

          const changes = [];
          if (needsNameUpdate && changedCards.length > 0) {
            changes.push(`Card names: ${changedCards.join(', ')}`);
          }
          if (needsValidationUpdate) {
            changes.push(`Validation: ${deck.isValid ? 'valid' : 'invalid'}`);
          }
          if (needsFormatsUpdate) {
            changes.push('formats populated');
          }
          logger.log(`Deck ${deck.id} updated for user ${userId}: ${changes.join(', ')}`);
        }
      }

      if (hasChanges) {
        logger.log(`Deck migration completed for user ${userId}: Updated card names and validation status`);
      }
    } catch (error) {
      logger.log(`Error during deck migration for user ${userId}: ${error instanceof Error ? error.message : String(error)}`);
    }
  })();
}