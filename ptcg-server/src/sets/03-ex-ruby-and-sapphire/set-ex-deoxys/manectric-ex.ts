import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PokemonCardList, Card, GameError, GameMessage } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Manectricex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electrike';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Disconnect',
    cost: [L, C],
    damage: 40,
    text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.',
  },
  {
    name: 'Mega Shot',
    cost: [L, L, C],
    damage: 0,
    text: 'Discard all [L] Energy attached to Manectric ex and then choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Manectric ex';
  public fullName: string = 'Manectric ex DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disconnect
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, tool: true, stadium: true });
    }

    // Mega Shot
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList))
        throw new GameError(GameMessage.INVALID_TARGET);
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const cards: Card[] = checkProvidedEnergy.energyMap
        .filter(e => e.provides.includes(L) || e.provides.includes(CardType.ANY))
        .map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = cardList;
      store.reduceEffect(state, discardEnergy);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
    }
    return state;
  }
}
