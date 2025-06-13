import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PlayerType, StateUtils, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ZeraoraVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public evolvesFrom: string = 'Zeraora V';
  public tags = [CardTag.POKEMON_VMAX];
  public cardType: CardType = L;
  public hp: number = 320;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Reactive Pulse',
      cost: [L, L],
      damage: 60,
      damageCalculation: 'x',
      text: 'This attack does 60 damage for each of your opponent\'s Pokémon in play that has an Ability.'
    },
    {
      name: 'Max Fist',
      cost: [L, L, C],
      damage: 240,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public name: string = 'Zeraora VMAX';
  public fullName: string = 'Zeraora VMAX CRZ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '54';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let numOpPokemonWithAbilities = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card.powers != null && card.powers.length > 0 && card.powers.some((power) => power.powerType == PowerType.ABILITY)) {
          numOpPokemonWithAbilities++;
        }

      });
      const damagePerOpponent = 60;
      effect.damage = numOpPokemonWithAbilities * damagePerOpponent;
    }
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }
    return state;
  }
}