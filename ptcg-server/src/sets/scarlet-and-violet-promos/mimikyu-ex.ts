import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, SlotType } from '../../game';

export class Mimikyuex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex ];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 190;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Void Return',
    cost: [ CardType.PSYCHIC ],
    damage: 30,
    text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
  }, {
    name: 'Iron Breaker',
    cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 30,
    text: 'This attack does 30 damage for each Energy attached to both Active Pokémon.'
  }];

  public set: string = 'SVP';

  public set2: string = 'svpromos';

  public setNumber: string = '4';

  public regulationMark = 'E';

  public name: string = 'Mimikyu ex';

  public fullName: string = 'Mimikyu ex SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
    
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
    
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
            PlayerType.BOTTOM_PLAYER,
            [ SlotType.BENCH ],
            { allowCancel: true },
          ), selected => {
            if (!selected || selected.length === 0) {
              return state;
            }
            const target = selected[0];
            player.switchPokemon(target);
          });
        }

        // Energy Burst
        if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);

          const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
          const checkProvidedEnergyEffect2 = new CheckProvidedEnergyEffect(player);
          store.reduceEffect(state, checkProvidedEnergyEffect);
          const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
          const energyCount2 = checkProvidedEnergyEffect2.energyMap.reduce((left, p) => left + p.provides.length, 0);
      
          effect.damage += energyCount + energyCount2 * 20;
        }
        return state;
      });
      return state;
    }
    return state;
  }
}