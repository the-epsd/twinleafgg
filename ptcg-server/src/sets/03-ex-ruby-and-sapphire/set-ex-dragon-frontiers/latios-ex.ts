import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, StateUtils, PlayerType } from "../../../game";
import { CheckRetreatCostEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from "../../../game/store/prefabs/prefabs";

export class Latiosex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Link Wing',
    powerType: PowerType.POKEBODY,
    text: 'The Retreat Cost for each of your Latias, Latias ex, Latios, and Latios ex is 0.'
  }];

  public attacks = [{
    name: 'Ice Barrier',
    cost: [W, C],
    damage: 30,
    text: 'Prevent all effects of an attack, including damage, done to Latios ex by your opponent\'s Pokémon-ex during your opponent\'s next turn.'
  },
  {
    name: 'Hydro Splash',
    cost: [W, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DF';
  public setNumber: string = '96';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Latios ex';
  public fullName: string = 'Latios ex DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Link Wing
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active.getPokemonCard();

      if (owner !== player || active === undefined) {
        return state;
      }

      let isLatiosexInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isLatiosexInPlay = true;
        }
      });

      if (!isLatiosexInPlay) {
        return state;
      }

      if (!IS_POKEBODY_BLOCKED(store, state, player, this) && (active.name === 'Latios' || active.name === 'Latios ex' || active.name === 'Latias' || active.name === 'Latias ex')) {
        effect.cost = [];
      }
    }
    // Ice Barrier
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const options = { sourceTags: [CardTag.POKEMON_ex] };
      PREVENT_DAMAGE(store, state, effect, this, options);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this, options);
    }

    return state;
  }
}
