import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, Card, ChooseEnergyPrompt, GameMessage, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public tags = [CardTag.DELTA_SPECIES];

  public cardType: CardType = M;

  public hp: number = 70;

  public weakness = [{ type: F }];

  public retreat = [];

  public attacks = [
    {
      name: 'Zzzap',
      cost: [C],
      damage: 20,
      text: 'Does 20 damage to each Pokémon that has any Poké-Powers or Poké-Bodies (both yours and your opponent\'s). Don\'t apply Weakness or Resistance.'
    },
    {
      name: 'Metallic Thunder',
      cost: [M, M, C],
      damage: 50,
      text: 'You may discard 2 [M] Energy attached to Raichu. If you do, this attack\'s base damage is 90 instead of 50.'
    }
  ];

  public set: string = 'HP';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu HP';

  public setNumber: string = '15';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check both players' Pokémon for Poké-Powers/Bodies
      [player, opponent].forEach(currentPlayer => {
        // Check active Pokémon
        const activeCard = currentPlayer.active.getPokemonCard();
        if (activeCard) {
          const stubPowerEffect = new PowerEffect(currentPlayer, {
            name: 'test',
            powerType: PowerType.POKEPOWER,
            text: ''
          }, activeCard);

          try {
            store.reduceEffect(state, stubPowerEffect);
            if (activeCard.powers.length) {
              // Apply 20 damage without Weakness/Resistance
              const damageEffect = new PutDamageEffect(effect, 20);
              damageEffect.target = currentPlayer.active;
              store.reduceEffect(state, damageEffect);
            }
          } catch {
            return state;
          }
        }

        // Check bench Pokémon
        currentPlayer.bench.forEach(bench => {
          const benchCard = bench.getPokemonCard();
          if (benchCard) {
            const stubPowerEffect = new PowerEffect(currentPlayer, {
              name: 'test',
              powerType: PowerType.POKEPOWER,
              text: ''
            }, benchCard);

            try {
              store.reduceEffect(state, stubPowerEffect);
              if (benchCard.powers.length) {
                // Apply 20 damage without Weakness/Resistance
                const damageEffect = new PutDamageEffect(effect, 20);
                damageEffect.target = bench;
                store.reduceEffect(state, damageEffect);
              }
            } catch {
              return state;
            }
          }
        });
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          state = store.prompt(state, new ChooseEnergyPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            checkProvidedEnergy.energyMap,
            [CardType.METAL, CardType.METAL],
            { allowCancel: false }
          ), energy => {
            const cards: Card[] = (energy || []).map(e => e.card);
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = player.active;
            store.reduceEffect(state, discardEnergy);

            effect.damage += 40;
            return state;
          });
        }
      });
      return state;
    }
    return state;
  }
}

