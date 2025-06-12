import { PokemonCard, Stage, CardType, PowerType } from '../../game';

export class Sigilyph extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public retreat = [C];
  public resistance = [{ type: F, value: -20 }];

  public powers = [
    {
      name: 'Toolbox',
      powerType: PowerType.ABILITY,
      text: 'This Pokémon may have up to 4 Pokémon Tool cards attached to it. ' +
        '(If this Pokémon loses this Ability, discard Pokémon Tool cards attached to this Pokémon until only 1 Pokémon Tool card remains.)'

    }
  ];

  public attacks = [{ name: 'Cutting Wind', cost: [P, C, C], damage: 70, text: '' }];

  public set: string = 'PLB';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sigilyph';
  public fullName: string = 'Sigilyph PLB';

  // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

  //   if (effect instanceof CheckTableStateEffect) {
  //     state.players.forEach(player => {
  //       if (!StateUtils.isPokemonInPlay(player, this)) {
  //         return;
  //       }
  //       player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
  //         if (card !== this) {
  //           return;
  //         }
  //         if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
  //           cardList.maxTools = 4;
  //         } else {
  //           cardList.maxTools = 1;
  //         }
  //       });
  //     });
  //   }
  //   return state;
  // }
}
