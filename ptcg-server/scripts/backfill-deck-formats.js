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
const BAR_WIDTH = 28;

function formatProgressBar(current, total) {
  const ratio = total > 0 ? Math.min(1, current / total) : 0;
  const filled = Math.round(BAR_WIDTH * ratio);
  const bar = '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled);
  const pct = (ratio * 100).toFixed(1);
  return `[${bar}] ${current}/${total} (${pct}%)`;
}

function writeProgress(current, total) {
  const line = formatProgressBar(current, total);
  if (process.stdout.isTTY) {
    process.stdout.write(`\r\x1b[K${line}`);
  }
}

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
    let scanned = 0;
    let skip = 0;
    let lastLoggedPct = -1;

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
        scanned++;
        try {
          const cards = JSON.parse(deck.cards);
          const format = getValidFormatsForCardList(cards);
          const formatStr = JSON.stringify(format);
          // Avoid BaseEntity.save change-tracking edge cases by using explicit UPDATE values.
          await Deck.update({ id: deck.id }, { formats: formatStr });
          processed++;
        } catch (err) {
          if (process.stdout.isTTY) {
            process.stdout.write('\n');
          }
          console.error(`[backfill] Failed deck id=${deck.id}: ${err.message}`);
        }
      }

      writeProgress(scanned, total);
      if (!process.stdout.isTTY) {
        const pct = total > 0 ? Math.floor((scanned / total) * 100) : 100;
        if (pct > lastLoggedPct) {
          lastLoggedPct = pct;
          console.log(formatProgressBar(scanned, total));
        }
      }

      skip += BATCH_SIZE;
    }

    if (process.stdout.isTTY) {
      process.stdout.write('\n');
    }
    console.log(`Backfill complete. Updated formats for ${processed} deck(s).`);
  } finally {
    await storage.disconnect();
  }
}

module.exports = { run };
