import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameError, GameMessage, PlayerType, Card, ChooseCardsPrompt } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Riolu';
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Roaring Resolve',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 2 damage counters on this Pokémon. If you do, search your deck for a [F] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Aura Sphere Volley',
      cost: [F, F],
      damage: 10,
      damageCalculation: '+',
      text: 'Discard all [F] Energy from this Pokémon. This attack does 60 more damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'BRS';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario BRS';

  public readonly ROARING_RESOLVE_MARKER = 'ROARING_RESOLVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.marker.hasMarker(this.ROARING_RESOLVE_MARKER, this)) {
          cardList.marker.removeMarker(this.ROARING_RESOLVE_MARKER, this);
        }
      });
    }

    // Roaring Resolve Gaming
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {

          if (cardList.marker.hasMarker(this.ROARING_RESOLVE_MARKER, this)) {
            throw new GameError(GameMessage.POWER_ALREADY_USED);
          }

          cardList.marker.addMarker(this.ROARING_RESOLVE_MARKER, this);
          cardList.damage += 20;

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
            { min: 0, max: 1, allowCancel: false, differentTypes: true }
          ), selected => {
            cards = selected || [];

            MOVE_CARDS(store, state, player.deck, cardList, { cards, sourceCard: this, sourceEffect: this.powers[0] });
          });
        }
      });

    }

    // Aura Sphere Volley
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let fightingEnergy = 0;
      checkProvidedEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.FIGHTING) || em.provides.includes(CardType.ANY)) {
          const discardEnergy = new DiscardCardsEffect(effect, [em.card]);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          fightingEnergy++;
        }
      });

      effect.damage += 60 * fightingEnergy;
    }
    return state;
  }
}