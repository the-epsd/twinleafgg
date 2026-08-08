import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, BLOCK_IF_GX_ATTACK_USED, OPPONENT_CANNOT_PLAY_ANY_CARDS } from "../../../game/store/prefabs/prefabs";

export class AlolanGolemGx extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Alolan Graveler';
  public cardType: CardType = L;
  public hp: number = 250;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Hammer In',
    cost: [L, C, C],
    damage: 80,
    text: ''
  },
  {
    name: 'Super Electromagnetic Tackle',
    cost: [L, L, C, C],
    damage: 200,
    text: 'This Pokémon does 50 damage to itself.'
  },
  {
    name: 'Heavy Rock-GX',
    cost: [L, L, C, C],
    damage: 100,
    text: 'Your opponent can\'t play any cards from their hand during their next turn. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CIN';
  public setNumber: string = '34';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Golem-GX';
  public fullName: string = 'Alolan Golem-GX CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Super Electromagnetic Tackle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 50);
    }

    // Heavy Rock-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;
      return OPPONENT_CANNOT_PLAY_ANY_CARDS(store, state, effect, this);
    }

    return state;
  }
}
