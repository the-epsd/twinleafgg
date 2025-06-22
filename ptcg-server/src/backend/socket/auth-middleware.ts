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
    console.log(`[Migration] Checking decks for user ${user.name} (ID: ${userId})`);
    const userDecks = await Deck.find({ where: { user: { id: userId } } });
    const cardManager = CardManager.getInstance();
    let hasChanges = false;

    for (const deck of userDecks) {
      console.log(`[Migration] Processing deck "${deck.name}" (ID: ${deck.id})`);
      const cardNames: string[] = JSON.parse(deck.cards);
      let needsNameUpdate = false;

      const resolvedCards = cardNames.map(name => {
        const card = cardManager.getCardByName(name);
        if (card && card.fullName !== name) {
          console.log(`[Migration] Legacy name found in deck "${deck.name}": "${name}". Resolving to "${card.fullName}".`);
          needsNameUpdate = true;
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
          console.log(`[Migration] Updating card names for deck "${deck.name}".`);
          deck.cards = JSON.stringify(resolvedCards);
        }
        if (needsValidationUpdate) {
          console.log(`[Migration] Updating isValid flag for deck "${deck.name}" from ${deck.isValid} to ${newIsValid}.`);
          deck.isValid = newIsValid;
        }
        console.log(`[Migration] Saving changes for deck "${deck.name}" to database.`);
        await deck.save();
      }
    }

    if (hasChanges) {
      console.log(`[Migration] Finished updating decks for user ${user.name} (ID: ${userId}).`);
    } else {
      console.log(`[Migration] No deck updates needed for user ${user.name} (ID: ${userId}).`);
    }
  } catch (error) {
    console.error(`[Migration] Error updating decks for user ${userId}:`, error);
  }
  // --- End Deck Migration Logic ---

  (socket as any).user = user;
  next();
}