const { config } = require('./output/config');

config.backend.address = 'https://twinleaf-app.ondigitalocean.app';
config.backend.port = 8080;
config.backend.avatarsDir = __dirname + '/avatars';

config.storage.type = 'sqlite';
config.storage.database = __dirname + '/database.sq3';

config.bots.defaultPassword = 'bot';

config.sets.scansDir = __dirname + '/scans';
