import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, Card, ConfirmPrompt, ChooseEnergyPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class GarchompUNM extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gabite';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 150;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [];

  public powers = [{
    name: 'Avenging Aura',
    powerType: PowerType.ABILITY,
    text: 'If you have more Prize cards remaining than your opponent, this Pokémon\'s attacks do 80 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance). '
  }];

  public attacks = [
    {
      name: 'Over Slice',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 80,
      text: 'You may discard an Energy from this Pokémon. If you do, this attack does 40 more damage.'
    }
  ];

  public set: string = 'UNM';

  public setNumber = '114';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Garchomp';

  public fullName: string = 'Garchomp UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Avenging Aura
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppActive = opponent.active.getPokemonCard();
      const damageSource = effect.source.getPokemonCard();

      // checking if it's your attack
      if (damageSource && damageSource === oppActive) {
        return state;
      }

      // checking if the damage is caused by this garchomp
      if (damageSource && damageSource !== this) {
        return state;
      }

      // why must i check for ability lock so much can we just force it into the source code officially
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      if (opponent.getPrizeLeft() < player.getPrizeLeft()) {
        effect.damage += 80;
      }
    }

    // Over Slice
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
          state = store.reduceEffect(state, checkProvidedEnergy);


          state = store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.COLORLESS],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);

            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);

            effect.damage += 40;
          });

        }
      });
    }

    return state;
  }
}