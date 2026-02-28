import { ApricornMaker } from '../set-celestial-storm/apricorn-maker';
import { CrystalShard } from '../set-ex-deoxys/crystal-shard';
import { Fisherman } from '../set-celestial-storm/fisherman';

export class ApricornMakerSK extends ApricornMaker {
  public fullName = 'Apricorn Maker SK';
  public set = 'SK';
  public setNumber = '121';
  public text = 'Search your deck for up to 2 Trainer cards with Ball in their names, show them to your opponent, and put them into your hand. Shuffle your deck afterward.';
}

export class CrystalShardSK extends CrystalShard {
  public fullName = 'Crystal Shard SK';
  public set = 'SK';
  public setNumber = '122';
  public text = 'As long as this card is attached to a Pokémon, that Pokémon\'s type (color) is [C]. If that Pokémon attacks, discard this card at the end of the turn.';
}

export class FishermanSK extends Fisherman {
  public fullName = 'Fisherman SK';
  public set = 'SK';
  public setNumber = '125';
  public text = 'Choose 4 basic Energy cards from your discard pile (if there are fewer basic Energy cards than choose, take all of them), show them to your opponent, and put them into your hand.';
}