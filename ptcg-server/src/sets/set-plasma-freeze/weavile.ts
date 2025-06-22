import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Weavile extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sneasel';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Hail',
    cost: [C],
    damage: 0,
    text: 'This attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Vilify',
    cost: [D, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Discard as many Pokémon as you like from your hand. This attack does 30 damage times the number of Pokémon you discarded.'
  }];

  public set: string = 'PLF';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weavile';
  public fullName: string = 'Weavile PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Hail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);

      const activeDamageEffect = new DealDamageEffect(effect, 20);
      store.reduceEffect(state, activeDamageEffect);

      benched.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    // Bite Off
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const pokemonInHand = player.hand.cards.filter(c => c.superType === SuperType.POKEMON).length;

      // Allow player to discard any number of pokemon
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 0, max: pokemonInHand, allowCancel: true }
      ), transfers => {
        if (!transfers || transfers.length === 0) {
          return state;
        }

        // Damage = per pokemon discarded
        effect.damage = transfers.length * 30;
        // Discard the cards
        for (const transfer of transfers) {
          MOVE_CARDS(store, state, player.hand, player.discard, { cards: [transfer] });
        }

        return state;
      });
    }

    return state;
  }
} 