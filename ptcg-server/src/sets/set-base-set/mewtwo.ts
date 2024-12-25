// ptcg-server\src\sets\set-base-set\mewtwo.ts

import { StoreLike, State, StateUtils, ChooseEnergyPrompt, GameMessage, Card, PlayerType, PokemonCardList } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { AbstractAttackEffect, DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Mewtwo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType = P;

  public hp: number = 60;

  public weakness = [{ type: P }];

  public retreat = [C, C, C];

  public attacks: Attack[] = [{
    name: 'Psychic',
    cost: [P, C],
    damage: 10,
    text: 'Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.'
  }, {
    name: 'Barrier',
    cost: [P, P],
    text: 'Discard 1 {P} Energy card attached to Mewtwo in order to prevent all effects of attacks, including damage, done to Mewtwo during your opponent’s next turn.',
    damage: 0
  }];

  public set = 'BS';

  public name = 'Mewtwo';

  public fullName = 'Mewtwo BS';

  public setNumber = '10';

  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(opponent);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const energyCount = checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);

      effect.damage = 10 + energyCount * 10;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.PSYCHIC],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);

        player.active.marker.addMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
        opponent.marker.addMarker(PokemonCardList.PREVENT_ALL_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN, this);
      });
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
