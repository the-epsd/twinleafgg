import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, EnergyCard, CardTarget } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Zapdosex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 200;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Voltaic Float',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any Lightning Energy attached, it has no ' +
      'Retreat Cost.'
  }];

  public attacks = [{
    name: 'Multishot Lightning',
    cost: [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING ],
    damage: 120,
    text: 'This attack also does 90 damage to 1 of your opponent\'s Benched Pokémon that has any damage counters on it. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = '151';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '145';

  public name: string = 'Zapdos ex';

  public fullName: string = 'Zapdos ex MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }


      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.name === 'Lightning Energy';
      })) {
        effect.cost = [ ];
      }
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blocked: CardTarget[] = [];

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        effect.damage = 120;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          return state;
        } else {
          blocked.push(target);
        }
      });

      if (!blocked.length) {
        effect.damage = 120;
      }

      if (blocked.length) {
        // Opponent has damaged benched Pokemon


        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked: blocked }
        ), target => {
          if (!target || target.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 90);
          damageEffect.target = target[0];
          effect.damage = 120;
          store.reduceEffect(state, damageEffect);
        });
      }

      return state;
    }

    return state;
  }

}

