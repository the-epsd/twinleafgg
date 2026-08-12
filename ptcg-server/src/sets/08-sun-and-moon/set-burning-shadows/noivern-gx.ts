import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State, PlayerType, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class NoivernGX extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Noibat';
  protected _tags = [CardTag.POKEMON_GX];
  public cardType: CardType = N;
  public hp: number = 200;
  public weakness = [{ type: Y }];
  public retreat = [];

  public attacks = [{
    name: 'Distort',
    cost: [D, C],
    damage: 50,
    text: 'Your opponent can\'t play any Item cards from their hand during their next turn.',
  },
  {
    name: 'Sonic Volume',
    cost: [P, D, C],
    damage: 120,
    text: 'Your opponent can\'t play any Special Energy cards from their hand during their next turn.',
  },
  {
    name: 'Boomburst-GX',
    cost: [P, D, C],
    damage: 0,
    gxAttack: true,
    text: 'This attack does 50 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Noivern-GX';
  public fullName: string = 'Noivern-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Distort
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true });
    }

    // Sonic Volume
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { specialEnergy: true });
    }

    // Boomburst-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const targets: PokemonCardList[] = [];
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        targets.push(cardList);
      });
      DAMAGE_OPPONENT_POKEMON(store, state, effect, 50, targets);
    }

    return state;
  }
}
