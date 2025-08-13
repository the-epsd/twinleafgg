import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MimeJr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 30;
  public retreat = [];

  public powers = [{
    name: 'Sweet Sleeping Face',
    powerType: PowerType.POKEBODY,
    text: 'As long as Mime Jr. is Asleep, prevent all damage done to Mime Jr. by attacks.'
  }];

  public attacks = [{
    name: 'Sleepy Lost',
    cost: [],
    damage: 0,
    text: 'Put the top card of your opponent\'s deck in the Lost Zone. Mime Jr. is now Asleep.'
  }];

  public set: string = 'CL';
  public name: string = 'Mime Jr.';
  public fullName: string = 'Mime Jr. CL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
      const player = StateUtils.findOwner(state, effect.target);

      if (effect.target.cards.includes(this)
        && effect.target.getPokemonCard() === this
        && player.active.cards[0] === this
        && player.active.specialConditions.includes(SpecialCondition.ASLEEP)
        && !IS_POKEBODY_BLOCKED(store, state, player, this)) {

        effect.damage = 0;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      MOVE_CARDS(store, state, opponent.deck, opponent.lostzone, { cards: [opponent.deck.cards[0]], sourceCard: this, sourceEffect: this.attacks[0] });

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addSpecialCondition(SpecialCondition.ASLEEP);
        }
      });
    }

    return state;
  }

}