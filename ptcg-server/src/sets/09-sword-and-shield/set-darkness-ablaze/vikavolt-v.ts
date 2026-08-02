import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseEnergyPrompt, Card } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/prefabs';

export class VikavoltV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = L;
  public hp: number = 210;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Paralyzing Bolt',
    cost: [L, C],
    damage: 50,
    text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  },
  {
    name: 'Super Zap Cannon',
    cost: [L, L, C],
    damage: 190,
    text: 'Discard 2 Energy from this Pokémon.',
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '60';
  public name: string = 'Vikavolt V';
  public fullName: string = 'Vikavolt V DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Paralyzing Bolt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    // Super Zap Cannon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [C, C],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }
    return state;
  }
}
