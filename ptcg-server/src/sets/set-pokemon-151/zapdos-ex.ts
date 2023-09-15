import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Zapdosex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

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

      // Check attached energy 
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);

      // Look for Lightning energy
      const hasLightning = checkProvidedEnergy.energyMap.some(e => { 
        if (e.provides.includes(CardType.LIGHTNING)) {
          return true;
        }

        if (hasLightning) {
        // Set retreat cost to empty if Lightning attached
          effect.cost = [ 0 ]; 
        }});
      return state;
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const source = opponent.bench;
  
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
      const damagedBenched = source.filter(b => b.damage > 0);
    
      if (damagedBenched) {
        // Opponent has damaged benched Pokemon
  
        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [ SlotType.BENCH ],
          { max: 1, allowCancel: false }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          const damageEffect = new PutDamageEffect(effect, 90);
          damageEffect.target = targets[0];
          store.reduceEffect(state, damageEffect);
        });
  
        return state;
      }
  
      return state;
    }
  
    return state;
  
  }
  
}