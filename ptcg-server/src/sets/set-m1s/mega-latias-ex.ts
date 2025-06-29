import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ConfirmPrompt, GameMessage, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class MegaLatiasex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.MEGA];
  public hp: number = 280;
  public cardType: CardType = N;
  public retreat = [C];

  public attacks = [
    {
      name: 'Strafe',
      cost: [C],
      damage: 40,
      text: 'You may switch this Pokémon with one of your Benched Pokémon.'
    },
    {
      name: 'Mirage Pulse',
      cost: [R, P, C],
      damage: 300,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'M1S';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Latias ex';
  public fullName: string = 'Mega Latias ex M1S';

  public strafeUsed: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.strafeUsed = true;
    }

    if (effect instanceof AfterAttackEffect && this.strafeUsed) {
      this.strafeUsed = false;
      const player = effect.player;
      if (player.bench.length > 0) {
        store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_SWITCH_POKEMON
        ), wantToSwitch => {
          if (wantToSwitch) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
    }

    return state;
  }
} 