import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PlayerType, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';


export class SerperiorV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public tags = [CardTag.POKEMON_V];

  public attacks = [
    {
      name: 'Noble Light',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Heal 30 damage from each Pokémon (both yours and your opponent\'s).'
    },
    {
      name: 'Solar Beam',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'SIT';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Serperior V';

  public fullName: string = 'Serperior V SIT 7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets: PokemonCardList[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          targets.push(cardList);
        }
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          if (cardList.damage > 0) {
            targets.push(cardList);
          }
        });
      });

      if (targets.length === 0) {
        return state;
      }

      targets.forEach(target => {
        // Heal Pokemon
        const healEffect = new HealEffect(player, target, 30);
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }

}
