import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CoinFlipEffect } from '../../../game/store/effects/play-card-effects';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';
import { PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Malamar extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Inkay';
  public cardType: CardType[] = [D];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'θ Stop',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'Prevent all effects of your opponent\'s Pokémon\'s Abilities done to this Pokémon.'
  }, {
    name: 'Contrary',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon, whenever your opponent flips a coin during his or her turn, treat it as tails.'
  }];

  public attacks = [{
    name: 'Conform',
    cost: [D, C, C],
    damage: 40,
    text: 'If you have the same number of cards in your hand as your opponent, your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'XYP';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Malamar';
  public fullName: string = 'Malamar XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // θ Stop — Ancient Trait (not an Ability; no IS_ABILITY_BLOCKED)
    PREVENT_EFFECTS_OF_OPPONENTS_ABILITIES(state, effect, (target) => {
      return target.getPokemonCard() === this;
    });

    // Contrary
    if (effect instanceof CoinFlipEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner.active.getPokemonCard() !== this) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, owner, this, this.powers[1])) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      if (effect.player !== opponent) {
        return state;
      }
      if (state.players[state.activePlayer] !== opponent) {
        return state;
      }

      effect.forcedResult = false;
    }

    // Conform
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.hand.cards.length === opponent.hand.cards.length) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      }
    }

    return state;
  }
}
