import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Galvantulaex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public evolvesFrom = 'Joltik';
  public cardType: CardType = L;
  public hp: number = 260;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Charged Web',
    cost: [L, C],
    damage: 110,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is a Pokémon ex or Pokémon V, this attack does 110 more damage.',
  },
  {
    name: 'Fulgurite',
    cost: [G, L, F],
    damage: 180,
    text: 'Discard all Energy from this Pokémon. During your opponent\'s next turn, they can\'t play any Item cards from their hand.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Galvantula ex';
  public fullName: string = 'Galvantula ex SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Charged Web
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.POKEMON_V) || opponentActive && opponentActive.tags.includes(CardTag.POKEMON_VSTAR) || opponentActive && opponentActive.tags.includes(CardTag.POKEMON_VMAX) || opponentActive && opponentActive.tags.includes(CardTag.POKEMON_ex)) {
        effect.damage += 110;
      }
    }

    // Fulgurite
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }
      effect.preventDefault = true;
    }
    return state;
  }
}
