import { Card } from '../../game/store/card/card';
import { BuriedFossil } from './buried-fossil';
import { DesertShaman } from './desert-shaman';
import { Ditto } from './ditto';
import { Flareon } from './flareon';
import { FriendBall } from './friend-ball';
import { Haunter } from './haunter';
import { Kabuto } from './kabuto';
import { Lapras } from './lapras';
import { Moltres } from './moltres';
import { UndergroundExpedition } from './underground-expedition';

// Other prints
import { FishermanSK } from './other-prints';

export const setSkyridge: Card[] = [
  new BuriedFossil(),
  new DesertShaman(),
  new Ditto(),
  new Flareon(),
  new FriendBall(),
  new Haunter(),
  new Kabuto(),
  new Lapras(),
  new Moltres(),
  new UndergroundExpedition(),

  // Other prints
  new FishermanSK(),
];
