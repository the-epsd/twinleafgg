import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect, DiscardCardsEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { SELECT_PROMPT_WITH_OPTIONS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Shelgon';
  public hp: number = 140;
  public cardType: CardType[] = [C];
  public weakness = [{ type: C, value: +30 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Direct Hit',
    cost: [C, C],
    damage: 50,
    text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
  },
  {
    name: 'Dragon Finish',
    cost: [R, R, W, W],
    damage: 0,
    text: 'Discard 2 basic Fire Energy cards or 2 basic Water Energy cards attached to Salamence. If you discarded 2 basic Fire Energy cards, this attack does 100 damage to the Defending Pokémon. If you discarded 2 Basic Water Energy cards, this attack does 100 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (If you can\'t discard cards, this attack does nothing.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Direct Hit
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const damage = 50;
      effect.damage = 0;
      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        afterDamage.target = opponent.active;
        store.reduceEffect(state, afterDamage);
      }
    }

    // Dragon Finish
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const fireEnergy = player.active.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.FIRE)
      );
      const waterEnergy = player.active.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC &&
        c.provides.includes(CardType.WATER)
      );

      const canFire = fireEnergy.length >= 2;
      const canWater = waterEnergy.length >= 2 && opponent.bench.some(b => b.cards.length > 0);

      if (!canFire && !canWater) {
        effect.damage = 0;
        return state;
      }

      const discardBasicEnergy = (energyName: string, onDiscarded: () => void) => {
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: energyName },
          { min: 2, max: 2, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length < 2) {
            effect.damage = 0;
            return;
          }
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          onDiscarded();
        });
      };

      const options: { message: GameMessage; action: () => void }[] = [];

      if (canFire) {
        options.push({
          message: GameMessage.WANT_TO_ATTACH_ONLY_FIRE_ENERGY,
          action: () => {
            discardBasicEnergy('Fire Energy', () => {
              effect.damage = 100;
            });
          }
        });
      }

      if (canWater) {
        options.push({
          message: GameMessage.WANT_TO_ATTACH_ONLY_WATER_ENERGY,
          action: () => {
            discardBasicEnergy('Water Energy', () => {
              effect.damage = 0;
              store.prompt(state, new ChoosePokemonPrompt(
                player.id,
                GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
                PlayerType.TOP_PLAYER,
                [SlotType.BENCH],
                { min: 1, max: 1, allowCancel: false }
              ), selected => {
                const target = selected[0];
                const putDamage = new PutDamageEffect(effect, 100);
                putDamage.target = target;
                store.reduceEffect(state, putDamage);
              });
            });
          }
        });
      }

      if (options.length === 1) {
        options[0].action();
        return state;
      }

      return SELECT_PROMPT_WITH_OPTIONS(store, state, player, GameMessage.CHOOSE_OPTION, options);
    }

    return state;
  }
}
