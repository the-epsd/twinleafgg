import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { BeginTurnEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Metagross extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Metang';

  public regulationMark = 'H';

  public cardType: CardType = CardType.METAL;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Meteor Mash',
      cost: [CardType.METAL],
      damage: 60,
      text: 'During your next turn, this Pokémon\'s Meteor Mash attack does 60 more damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Luster Blast',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'Discard 2 Energy from this Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '115';

  public name: string = 'Metagross';

  public fullName: string = 'Metagross TEF';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public usedAttack: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect) {
      this.usedAttack = true;
    }

    if (effect instanceof BeginTurnEffect) {
      if (this.usedAttack) {
        this.usedAttack = false;
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (!this.usedAttack) {
        this.usedAttack = false;
        effect.player.attackMarker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
        effect.player.attackMarker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.player.attackMarker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
      effect.player.attackMarker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);

      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Check marker
      if (effect.player.attackMarker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
        effect.damage += 60;
      }
      effect.player.attackMarker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
    }
    return state;
  }
}