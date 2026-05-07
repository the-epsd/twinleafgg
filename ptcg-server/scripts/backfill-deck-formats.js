/**
 * Recompute deck.formats for every deck using the current validator (batched).
 * Run via: npm run backfill:deck-formats (or: node start.js --backfill)
 *
 * Processing is done in batches of 50 to avoid memory spikes.
 */
const { Deck } = require('../output/storage');
const { getValidFormatsForCardList } = require('../output/backend/controllers/decks');
const { Storage } = require('../output/storage');

const BATCH_SIZE = 50;

async function run() {
  const storage = new Storage();
  await storage.connect();

  try {
    const total = await Deck.count();

    if (total === 0) {
      console.log('No decks found. Backfill complete.');
      return;
    }

    console.log(`Recomputing formats for ${total} deck(s) in batches of ${BATCH_SIZE}...`);

    let processed = 0;
    let skip = 0;

    while (skip < total) {
      const batch = await Deck.find({
        order: { id: 'ASC' },
        take: BATCH_SIZE,
        skip
      });

      if (batch.length === 0) {
        break;
      }

      for (const deck of batch) {
        try {
          const cards = JSON.parse(deck.cards);
          const format = getValidFormatsForCardList(cards);
          const formatStr = JSON.stringify(format);
          // Avoid BaseEntity.save change-tracking edge cases by using explicit UPDATE values.
          await Deck.update({ id: deck.id }, { formats: formatStr });
          processed++;
        } catch (err) {
          console.error(`[backfill] Failed deck id=${deck.id}: ${err.message}`);
        }
      }

      skip += BATCH_SIZE;
    }

    console.log(`Backfill complete. Updated formats for ${processed} deck(s).`);
  } finally {
    await storage.disconnect();
  }
}

module.exports = { run };
