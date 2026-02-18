#!/usr/bin/env node
const Jimp = require('jimp');
const path = require('path');

const WIDTH = 68;
const HEIGHT = 93;
const COLOR = 0x1a3a5aff;

async function generate() {
  const image = new Jimp(WIDTH, HEIGHT, COLOR);
  const outPath = path.resolve(__dirname, '../../ptcg-play/src/assets/cardback.png');
  await image.writeAsync(outPath);
  console.log('Created', outPath);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
