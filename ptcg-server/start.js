require('./config');

const { App } = require('./output/backend/app');
const { BotManager } = require('./output/game/bots/bot-manager');
const { SimpleBot } = require('./output/simple-bot/simple-bot');
const { CardManager } = require('./output/game/cards/card-manager');
const { StateSerializer } = require('./output/game/serializer/state-serializer');
const { config } = require('./output/config');
const sets = require('./output/sets');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineSet(sets.setDiamondAndPearl);
cardManager.defineSet(sets.setOp9);
cardManager.defineSet(sets.setHgss);
cardManager.defineSet(sets.setBlackAndWhite);
cardManager.defineSet(sets.setBlackAndWhite2);
cardManager.defineSet(sets.setBlackAndWhite3);
cardManager.defineSet(sets.setBlackAndWhite4);
cardManager.defineSet(sets.setPokemon151);
cardManager.defineSet(sets.setSwordAndShield);
cardManager.defineSet(sets.setSwordAndShieldPromos);
cardManager.defineSet(sets.setBattleStyles);
cardManager.defineSet(sets.setEvolvingSkies);
cardManager.defineSet(sets.setCelebrations);
cardManager.defineSet(sets.setFusionStrike);
cardManager.defineSet(sets.setBrilliantStars);
cardManager.defineSet(sets.setAstralRadiance);
cardManager.defineSet(sets.setLostOrigin);
cardManager.defineSet(sets.setSilverTempest);
cardManager.defineSet(sets.setCrownZenith);
//cardManager.defineSet(sets.setSwordAndShield8);
//cardManager.defineSet(sets.setSwordAndShield9);
cardManager.defineSet(sets.setScarletAndViolet);
cardManager.defineSet(sets.setPaldeaEvolved);
cardManager.defineSet(sets.setObsidianFlames);
cardManager.defineSet(sets.setParadoxRift);

StateSerializer.setKnownCards(cardManager.getAllCards());

const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('Charizard'));
botManager.registerBot(new SimpleBot('Blastoise'));
botManager.registerBot(new SimpleBot('Venusaur'));

const app = new App();

app.connectToDatabase()
  .catch(error => {
    console.log('Unable to connect to database.');
    console.error(error.message);
    process.exit(1);
  })
  .then(() => app.configureBotManager(botManager))
  .then(() => app.start())
  .then(() => {
    const address = config.backend.address;
    const port = config.backend.port;
    console.log('Application started on ' + address + ':' + port + '.');
  })
  .catch(error => {
    console.error(error.message);
    console.log('Application not started.');
    process.exit(1);
  });
