import { GamePhase, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Mismagius extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public regulationMark = 'F';

  public evolvesFrom = 'Misdreavus';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Spiteful Magic',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP and is Knocked Out by damage from an attack from your opponent\'s Pokémon, put 8 damage counters on the Attacking Pokémon.'
  }
  ];

  public attacks = [{
    name: 'Eerie Voice',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Put 2 damage counters on each of your opponent\'s Pokémon.'
  }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '64';

  public name: string = 'Mismagius';

  public fullName: string = 'Mismagius SIT';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this ||
        state.phase !== GamePhase.ATTACK ||
        IS_ABILITY_BLOCKED(store, state, player, this)
      ) {
        return state;
      }

      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {
        effect.source.damage += 80;
      }
    }

    if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner === effect.player) {
        this.damageDealt = false;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const damageEffect = new PutCountersEffect(effect, 20);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}