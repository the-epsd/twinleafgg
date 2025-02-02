// ptcg-server\src\sets\set-base-set\Jirachi.ts

import { StoreLike, State, StateUtils, GameMessage, Card, PlayerType, PokemonCardList, CardTarget, EnergyCard, ChooseCardsPrompt } from '../../game';
import { CardType, EnergyType, SpecialCondition, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { AbstractAttackEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Jirachi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType = CardType.METAL;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat: CardType[] = [CardType.COLORLESS];

  public attacks: Attack[] = [{
    name: 'Stardust',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Discard a Special Energy attached to your opponent\'s Active Pokémon.If you do, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Dream Dance',
    cost: [CardType.METAL, CardType.COLORLESS],
    text: 'Both Active Pokémon are now Asleep.',
    damage: 20
  }];

  public set: string = 'XYP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '67';

  public name: string = 'Jirachi';

  public fullName: string = 'Jirachi XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let hasPokemonWithEnergy = false;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasPokemonWithEnergy) {
        const endTurnEffect = new EndTurnEffect(player);
        store.reduceEffect(state, endTurnEffect);
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
        { min: 1, max: 1, allowCancel: true }
      ), energy => {
        const cards: Card[] = (energy || []);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = opponent.active;
        store.reduceEffect(state, discardEnergy);

        player.active.marker.addMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
        opponent.marker.addMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const active = opponent.active;

      active.addSpecialCondition(SpecialCondition.ASLEEP);
      player.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }

    if (effect instanceof EndTurnEffect &&
      effect.player.marker.hasMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {

      effect.player.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
      });
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) &&
      effect.target.marker.hasMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard) {
        effect.preventDefault = true;
      }

      return state;
    }

    return state;
  }
}
