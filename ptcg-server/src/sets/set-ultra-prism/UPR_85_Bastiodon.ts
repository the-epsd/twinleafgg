import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Bastiodon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.METAL;
  public hp: number = 160;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Shieldon';

  public powers = [{
    name: 'Earthen Shield',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to your [M] Pokémon by attacks from your opponent\'s Pokémon that have any Special Energy attached to them.'
  }];

  public attacks = [{
    name: 'Push Down',
    cost: [CardType.METAL, CardType.METAL, CardType.COLORLESS],
    damage: 110,
    text: 'You may have your opponent switch their Active Pokémon with 1 of their Benched Pokémon.'
  }];

  public set = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name = 'Bastiodon';
  public fullName = 'Bastiodon UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect) {
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

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const opponentHasSpecialEnergy = checkProvidedEnergyEffect.energyMap.some(e => e.card.energyType === EnergyType.SPECIAL);

      console.log('Opponent has special energy: ' + opponentHasSpecialEnergy);

      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(opponent.active);
      store.reduceEffect(state, checkPokemonTypeEffect);

      console.log('Bastiodon owner has metal type in active: ' + checkPokemonTypeEffect.cardTypes.includes(CardType.METAL));

      if (opponentHasSpecialEnergy && checkPokemonTypeEffect.cardTypes.includes(CardType.METAL)) {
        effect.preventDefault = true;
        return state;
      }

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          return store.prompt(state, new ChoosePokemonPrompt(
            opponent.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (targets && targets.length > 0) {
              opponent.active.clearEffects();
              opponent.switchPokemon(targets[0]);
              return state;
            }
          });
        }
      });
    }

    return state;
  }
}