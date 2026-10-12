import {
  PokemonCard,
  Stage,
  CardType,
  PowerType,
  StoreLike,
  State,
  StateUtils,
  ChooseCardsPrompt,
  GameMessage,
  SuperType,
  CardTag,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../../game/store/prefabs/attack-effects';
import {
  IS_ABILITY_BLOCKED,
  MOVE_CARDS,
  ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class Klawfex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  protected _tags = [CardTag.POKEMON_ex];

  public cardType: CardType[] = [CardType.FIGHTING];

  public hp: number = 220;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Counterattacking Pincer',
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), discard an Energy from the Attacking Pokémon.'
    }
  ];

  public attacks = [{
    name: 'Falling Press',
    cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 80 more damage.'
  }];

  public set: string = 'OBF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '157';

  public name: string = 'Klawf ex';

  public fullName: string = 'Klawf ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counterattacking Pincer
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      const attackingPokemon = effect.source;

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (!attackingPokemon.energies.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        attackingPokemon,
      )) {
        return state;
      }

      const attackerOwner = StateUtils.findOwner(state, attackingPokemon);
      return store.prompt(state, new ChooseCardsPrompt(
        abilityOwner,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        attackingPokemon,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, attackingPokemon, attackerOwner.discard, {
            cards,
            sourceCard: this,
            sourceEffect: this.powers[0],
          });
        }
      });
    }

    // Falling Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 80);
    }

    return state;
  }
}
