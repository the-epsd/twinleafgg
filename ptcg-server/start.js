require('./config');

const { App } = require('./output/backend/app');
const { BotManager } = require('./output/game/bots/bot-manager');
const { SimpleBot } = require('./output/simple-bot/simple-bot');
const { CardManager } = require('./output/game/cards/card-manager');
const { StateSerializer } = require('./output/game/serializer/state-serializer');
const { config } = require('./output/config');
const sets = require('./output/sets');
const process = require('process');

require('dotenv').config({ path: require('find-config')('.env') })

const cardManager = CardManager.getInstance();

cardManager.defineSet(sets.setBaseSet);
cardManager.defineSet(sets.setJungle);
cardManager.defineSet(sets.setFossil);
cardManager.defineSet(sets.setWOTCPromos);
cardManager.defineSet(sets.setVendingSeries);

cardManager.defineSet(sets.setBaseSetEnergy);

//ex Era shit
cardManager.defineSet(sets.setDragon);
cardManager.defineSet(sets.setDragonFrontiers);
cardManager.defineSet(sets.setDeoxys);
cardManager.defineSet(sets.setUnseenForces);
cardManager.defineSet(sets.setTeamRocketReturns);
cardManager.defineSet(sets.setCrystalGuardians);
cardManager.defineSet(sets.setPowerKeepers);
cardManager.defineSet(sets.setFireRedLeafGreen);
cardManager.defineSet(sets.setDeltaSpecies);

cardManager.defineSet(sets.setDiamondAndPearl);
// cardManager.defineSet(sets.setOP9);
cardManager.defineSet(sets.setGreatEncounters);
cardManager.defineSet(sets.setPlatinum);

cardManager.defineSet(sets.setBattleRoadPromos);

cardManager.defineSet(sets.setHeartGoldAndSoulSilver);
cardManager.defineSet(sets.setHeartGoldAndSoulSilverPromos);
cardManager.defineSet(sets.setLPPromos);
cardManager.defineSet(sets.setTriumphant);
cardManager.defineSet(sets.setUndaunted);
cardManager.defineSet(sets.setUnleashed);

cardManager.defineSet(sets.setBlackAndWhitePromos);
cardManager.defineSet(sets.setBlackAndWhite);
cardManager.defineSet(sets.setEmergingPowers);
cardManager.defineSet(sets.setNobleVictories);
cardManager.defineSet(sets.setNextDestinies);
cardManager.defineSet(sets.setDarkExplorers);
cardManager.defineSet(sets.setDoubleCrisis);
cardManager.defineSet(sets.setDragonsExalted);
cardManager.defineSet(sets.setDragonsMajesty);
cardManager.defineSet(sets.setDragonVault);
cardManager.defineSet(sets.setBoundariesCrossed);
cardManager.defineSet(sets.setPlasmaStorm);
cardManager.defineSet(sets.setPlasmaFreeze);
cardManager.defineSet(sets.setPlasmaBlast);
cardManager.defineSet(sets.setLegendaryTreasures);


cardManager.defineSet(sets.setXY);
cardManager.defineSet(sets.setFlashfire);
cardManager.defineSet(sets.setFuriousFists);
cardManager.defineSet(sets.setPhantomForces);
cardManager.defineSet(sets.setBurningShadows);
cardManager.defineSet(sets.setPrimalClash);
cardManager.defineSet(sets.setXYPromos);
cardManager.defineSet(sets.setRoaringSkies);
cardManager.defineSet(sets.setAncientOrigins);
cardManager.defineSet(sets.setBreakpoint);
cardManager.defineSet(sets.setBreakthrough);

cardManager.defineSet(sets.setFatesCollide);
cardManager.defineSet(sets.setGenerations);
cardManager.defineSet(sets.setChampionsPath);

cardManager.defineSet(sets.setSunAndMoon);
cardManager.defineSet(sets.setSunAndMoonPromos);
cardManager.defineSet(sets.setGuardiansRising);
cardManager.defineSet(sets.setSteamSiege);


cardManager.defineSet(sets.setUltraPrism);
cardManager.defineSet(sets.setForbiddenLight);
cardManager.defineSet(sets.setCelestialStorm);
cardManager.defineSet(sets.setCrimsonInvasion);
cardManager.defineSet(sets.setLostThunder);
cardManager.defineSet(sets.setTeamUp);

cardManager.defineSet(sets.setUnbrokenBonds);
cardManager.defineSet(sets.setUnifiedMinds);
cardManager.defineSet(sets.setHiddenFates);
cardManager.defineSet(sets.setCosmicEclipse);
cardManager.defineSet(sets.setEvolutions);
cardManager.defineSet(sets.setDetectivePikachu);


cardManager.defineSet(sets.setSwordAndShield);
cardManager.defineSet(sets.setSwordAndShieldPromos);
cardManager.defineSet(sets.setDarknessAblaze);
cardManager.defineSet(sets.setShiningLegends);
cardManager.defineSet(sets.setVividVoltage);
cardManager.defineSet(sets.setShiningFates);
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
cardManager.defineSet(sets.setRebelClash);


cardManager.defineSet(sets.setScarletAndViolet);
cardManager.defineSet(sets.setScarletAndVioletEnergy);
cardManager.defineSet(sets.setScarletAndVioletPromos);
cardManager.defineSet(sets.setPaldeaEvolved);
cardManager.defineSet(sets.setObsidianFlames);
cardManager.defineSet(sets.setPokemon151);
cardManager.defineSet(sets.setParadoxRift);
cardManager.defineSet(sets.setPaldeaFates);
cardManager.defineSet(sets.setTemporalForces);
cardManager.defineSet(sets.setTwilightMasquerade);
cardManager.defineSet(sets.setShroudedFable);
cardManager.defineSet(sets.setStellarCrown);
cardManager.defineSet(sets.setSurgingSparks);
cardManager.defineSet(sets.setPrismaticEvolution);
cardManager.defineSet(sets.setSV9);

cardManager.defineSet(sets.setTest);

cardManager.defineSet(sets.setLegendsAwakened);
cardManager.defineSet(sets.setStormfront);
cardManager.defineSet(sets.setMajesticDawn);
cardManager.defineSet(sets.setArceus);

StateSerializer.setKnownCards(cardManager.getAllCards());

const botManager = BotManager.getInstance();
// botManager.registerBot(new SimpleBot('Gardevoir'));
// botManager.registerBot(new SimpleBot('Charizard'));
// botManager.registerBot(new SimpleBot('LostBox'));
// botManager.registerBot(new SimpleBot('Lugia'));
// botManager.registerBot(new SimpleBot('Dragapult'));
botManager.registerBot(new SimpleBot('Standard'));
botManager.registerBot(new SimpleBot('GLC'));
botManager.registerBot(new SimpleBot('Retro'));

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
