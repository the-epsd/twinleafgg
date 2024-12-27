import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class HopsSnorlax extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.HOPS];

  public cardType: CardType = C;

  public hp: number = 150;

  public weakness = [{ type: F }];

  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Big Belly',
    powerType: PowerType.ABILITY,
    text: 'The attacks of your Hop\'s Pokémon do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). The effect of Big Belly doesn\'t stack.'
  }];

  public attacks = [
    {
      name: 'Dynamic Press',
      cost: [C, C, C],
      damage: 140,
      text: 'This Pokémon also does 80 damage to itself.'
    }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name: string = 'Hop\'s Snorlax';

  public fullName: string = 'Hop\'s Snorlax SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      return store.reduceEffect(state, dealDamage);
    }

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const hasSnorlaxInPlay = player.bench.some(b => b.cards.includes(this)) || player.active.cards.includes(this);
      let isSnorlaxInPlay = false;

      if (hasSnorlaxInPlay) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList.cards.includes(this)) {
            isSnorlaxInPlay = true;
          }
        });
      }

      const hopsPokemon = player.active.getPokemonCard();

      if (isSnorlaxInPlay && hopsPokemon && hopsPokemon.tags.includes(CardTag.HOPS) && effect.target === opponent.active) {
        effect.damage += 30;
      }
    }
    return state;
  }
}