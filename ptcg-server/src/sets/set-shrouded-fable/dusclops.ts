import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Dusclops extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Duskull';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cursed Blast',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put 5 damage counters on 1 of your opponent\'s Pokémon. If you placed any damage counters in this way, this Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Will-o-Wisp',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Dusclops';

  public fullName: string = 'Dusclops SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 50;
        });
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });
    }
    return state;
  }
}