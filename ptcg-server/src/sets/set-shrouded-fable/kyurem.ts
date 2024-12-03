import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { Card, ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, StateUtils, TrainerCard } from '../../game';
import { CheckAttackCostEffect, CheckPokemonAttacksEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';


export class Kyurem extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 130;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Plasma Bane',
    powerType: PowerType.ABILITY,
    text: 'If your opponent has any card with Colress in its name in their discard pile, this Pokémon\'s Tri Frost attack can be used for 1 Colorless Energy.'
  }];

  public attacks = [{
    name: 'Trifrost',
    cost: [CardType.WATER, CardType.WATER, CardType.METAL, CardType.METAL, CardType.COLORLESS],
    damage: 0,
    text: 'Discard all Energy from this Pokémon. This attack does 110 damage to 3 of your opponent\'s Pokémon.'
  }];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '47';

  public name: string = 'Kyurem';

  public fullName: string = 'Kyurem SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
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
        console.log(effect.cost);
        return state;
      }

      let isColressInOpponentsDiscard = false;
      opponent.discard.cards.filter(card => {
        if (card instanceof TrainerCard
          && card.name.includes('Colress')) {
          isColressInOpponentsDiscard = true;
        }
      });


      if (isColressInOpponentsDiscard) {
        // Remove the Water and Metal energy requirements
        effect.cost = effect.cost.filter(type => type !== CardType.WATER && type !== CardType.METAL);
      }

      return state;
    }

    if (effect instanceof UseAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      new CheckPokemonAttacksEffect(player);

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

      let isColressInOpponentsDiscard = false;
      opponent.discard.cards.filter(card => {
        if (card.name === 'Colress' || card.name === 'Colress\'s Experiment' || card.name === 'Colress\'s Obsession') {
          isColressInOpponentsDiscard = true;
        }
      });

      if (isColressInOpponentsDiscard) {

        this.attacks[0].cost = [CardType.COLORLESS];

      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 3, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 110);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
      });
    }
    return state;
  }
}

