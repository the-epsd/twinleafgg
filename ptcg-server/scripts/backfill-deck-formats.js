/**
 * Backfill deck.formats for decks where formats is NULL or empty.
 * Run via: npm run backfill:deck-formats (or: node start.js --backfill)
 *
 * Processing is done in batches of 50 to avoid memory spikes.
 */
const { IsNull } = require('typeorm');
const { Deck } = require('../output/storage');
const { getValidFormatsForCardList } = require('../output/backend/controllers/decks');
const { Storage } = require('../output/storage');

const BATCH_SIZE = 50;

async function run() {
  const storage = new Storage();
  await storage.connect();

  try {
    const [decks, total] = await Deck.findAndCount({
      where: [
        { formats: IsNull() },
        { formats: '' }
      ],
      order: { id: 'ASC' },
      take: BATCH_SIZE,
      skip: 0
    });

    if (total === 0) {
      console.log('No decks with empty formats found. Backfill complete.');
      return;
    }

    console.log(`Found ${total} deck(s) with empty formats. Processing in batches of ${BATCH_SIZE}...`);

    let processed = 0;
    let offset = 0;

    while (true) {
      const [batch] = await Deck.findAndCount({
        where: [
          { formats: IsNull() },
          { formats: '' }
        ],
        order: { id: 'ASC' },
        take: BATCH_SIZE,
        skip: offset
      });

      if (batch.length === 0) break;

      for (const deck of batch) {
        try {
          const cards = JSON.parse(deck.cards);
          const format = getValidFormatsForCardList(cards);
          deck.formats = JSON.stringify(format);
          await deck.save();
          processed++;
        } catch (err) {
          console.error(`[backfill] Failed deck id=${deck.id}: ${err.message}`);
        }
      }

      offset += BATCH_SIZE;
      if (batch.length < BATCH_SIZE) break;
    }

    console.log(`Backfill complete. Updated formats for ${processed} deck(s).`);
  } finally {
    await storage.disconnect();
  }
}

module.exports = { run };
