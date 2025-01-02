import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { CardType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect, EnergyEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WarpEnergy extends EnergyCard {

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'SLG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '70';

  public name = 'Warp Energy';

  public fullName = 'Warp Energy SHL';

  public text =
    'This card provides [C] Energy.' +
    '' +
    'When you attach this card from your hand to your Active Pokémon, switch that Pokémon with 1 of your Benched Pokémon.4244';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttachEnergyEffect && effect.target?.cards?.includes(this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      try {
        const energyEffect = new EnergyEffect(player, this);
        store.reduceEffect(state, energyEffect);
      } catch {
        return state;
      }

      if (effect.player.active !== effect.target) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        player.switchPokemon(cardList);
      });
    }

    return state;
  }

}
