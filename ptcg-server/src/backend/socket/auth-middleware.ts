import { Socket } from 'socket.io';

import { ApiErrorEnum } from '../common/errors';
import { User, Deck } from '../../storage';
import { RateLimit } from '../common/rate-limit';
import { validateToken } from '../services/auth-token';
import { CardManager, DeckAnalyser } from '../../game';

export async function authMiddleware(socket: Socket, next: (err?: any) => void): Promise<void> {
  const rateLimit = RateLimit.getInstance();
  const token: string = socket.handshake.query && socket.handshake.query.token as string;
  const userId = validateToken(token);
  const ipAddress: string = socket.request.connection.remoteAddress || '0.0.0.0';

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

  // --- Start Deck Migration Logic ---
  try {
    const userDecks = await Deck.find({ where: { user: { id: userId } } });
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

      if (needsNameUpdate || needsValidationUpdate) {
        hasChanges = true;
        if (needsNameUpdate) {
          deck.cards = JSON.stringify(resolvedCards);
        }
        if (needsValidationUpdate) {
          deck.isValid = newIsValid;
        }
        await deck.save();

        // Log specific changes for this deck
        const changes = [];
        if (needsNameUpdate && changedCards.length > 0) {
          changes.push(`Card names: ${changedCards.join(', ')}`);
        }
        if (needsValidationUpdate) {
          changes.push(`Validation: ${deck.isValid ? 'valid' : 'invalid'}`);
        }
        console.log(`Deck ${deck.id} updated for user ${userId}: ${changes.join(', ')}`);
      }
    }

    if (hasChanges) {
      console.log(`Deck migration completed for user ${userId}: Updated card names and validation status`);
    }
  } catch (error) {
    console.error(`Error during deck migration for user ${userId}:`, error);
  }
  // --- End Deck Migration Logic ---

  (socket as any).user = user;
  next();
}