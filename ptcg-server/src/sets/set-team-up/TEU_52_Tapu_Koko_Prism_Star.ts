import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class TapuKokoPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 130;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Dance of the Ancients',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, '
      + 'you may choose 2 of your Benched Pokémon and attach a [L] Energy card from your discard pile to each of them.'
      + 'If you do, discard all cards from this Pokémon and put it in the Lost Zone.'
  }];

  public attacks = [{
    name: 'Mach Bolt',
    cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
    damage: 120,
    text: ''
  }];

  public set = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '195';
  public name = 'Tapu Koko Prism Star';
  public fullName = 'Tapu Koko Prism Star TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      // Check to see if anything is blocking our Ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (player.active.cards[0] == this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }



    }

    return state;
  }
}