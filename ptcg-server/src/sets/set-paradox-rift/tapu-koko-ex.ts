
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { Card, ChooseEnergyPrompt, GameMessage, GamePhase, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AddSpecialConditionsEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class TapuKokoex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 210;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Vengeful Shock',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 30,
      damageCalculation: '+',
      text: 'If any of your Pokémon were Knocked Out by damage from an attack during your opponent\'s last turn, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Extreme Current',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 180,
      text: 'Discard an Energy from this Pokémon.'
    },
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Tapu Koko ex';

  public fullName: string = 'Tapu Koko ex PAR';

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.RETALIATE_MARKER)) {
        effect.damage += 90;
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialConditionEffect);
      }

      return state;
    }

    if (effect instanceof KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarkerToState(this.RETALIATE_MARKER);
      }
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.RETALIATE_MARKER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      return store.prompt(state, new ChooseEnergyPrompt(
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
        return state;
      });
    }
    return state;
  }

}
