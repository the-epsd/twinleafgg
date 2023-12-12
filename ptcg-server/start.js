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

// cardManager.defineSet(sets.setBaseSet);

// cardManager.defineSet(sets.setDiamondAndPearl);
// cardManager.defineSet(sets.setOP9);


// cardManager.defineSet(sets.setHeartGoldAndSoulSilver);
// cardManager.defineSet(sets.setHeartGoldAndSoulSilverPromos);
// cardManager.defineSet(sets.setTriumphant);
// cardManager.defineSet(sets.setUndaunted);
// cardManager.defineSet(sets.setUnleashed);


// cardManager.defineSet(sets.setBlackAndWhite);
// cardManager.defineSet(sets.setEmergingPowers);
// cardManager.defineSet(sets.setNobleVictories);
// cardManager.defineSet(sets.setNextDestinies);
// cardManager.defineSet(sets.setDarkExplorers);
// cardManager.defineSet(sets.setDragonsExalted);
// cardManager.defineSet(sets.setDragonVault);
// cardManager.defineSet(sets.setBoundariesCrossed);
// cardManager.defineSet(sets.setPlasmaStorm);
// cardManager.defineSet(sets.setPlasmaFreeze);
// cardManager.defineSet(sets.setPlasmaBlast);
// cardManager.defineSet(sets.setLegendaryTreasures);


// cardManager.defineSet(sets.setXY);
// cardManager.defineSet(sets.setFlashfire);
// cardManager.defineSet(sets.setFuriousFists);
// cardManager.defineSet(sets.setPhantomForces);
// cardManager.defineSet(sets.setPrimalClash);

// cardManager.defineSet(sets.setRoaringSkies);
// cardManager.defineSet(sets.setAncientOrigins);
// cardManager.defineSet(sets.setBreakthrough);

// cardManager.defineSet(sets.setFatesCollide);

// cardManager.defineSet(sets.setSunAndMoon);




// cardManager.defineSet(sets.setUltraPrism);

// cardManager.defineSet(sets.setCelestialStorm);

// cardManager.defineSet(sets.setTeamUp);

// cardManager.defineSet(sets.setUnbrokenBonds);

//cardManager.defineSet(sets.setHiddenFates);
// cardManager.defineSet(sets.setCosmicEclipse);


// cardManager.defineSet(sets.setSwordAndShield);
cardManager.defineSet(sets.setSwordAndShieldPromos);
cardManager.defineSet(sets.setShiningLegends);
//cardManager.defineSet(sets.setVividVoltage);
cardManager.defineSet(sets.setBattleStyles);
cardManager.defineSet(sets.setChillingReign);
cardManager.defineSet(sets.setEvolvingSkies);
cardManager.defineSet(sets.setCelebrations);
cardManager.defineSet(sets.setFusionStrike);
cardManager.defineSet(sets.setBrilliantStars);
cardManager.defineSet(sets.setAstralRadiance);
cardManager.defineSet(sets.setPokemonGO);
cardManager.defineSet(sets.setLostOrigin);
cardManager.defineSet(sets.setSilverTempest);
cardManager.defineSet(sets.setCrownZenith);


cardManager.defineSet(sets.setScarletAndViolet);
cardManager.defineSet(sets.setScarletAndVioletEnergy);
cardManager.defineSet(sets.setScarletAndVioletPromos);
cardManager.defineSet(sets.setPaldeaEvolved);
cardManager.defineSet(sets.setObsidianFlames);
cardManager.defineSet(sets.setPokemon151);
cardManager.defineSet(sets.setParadoxRift);
cardManager.defineSet(sets.setPaldeaFates);

StateSerializer.setKnownCards(cardManager.getAllCards());

const botManager = BotManager.getInstance();
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
