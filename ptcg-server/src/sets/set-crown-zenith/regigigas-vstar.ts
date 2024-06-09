import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, GameError } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class RegigigasVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Regigigas V';

  public tags = [ CardTag.POKEMON_VSTAR ];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 300;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];
  
  public powers = [{
    name: 'Star Guardian',
    powerType: PowerType.ABILITY,
    text: 'During your turn, if your opponent has exactly 1 Prize card remaining, you may choose 1 of your opponent\'s Benched Pokémon. They discard that Pokémon and all attached cards. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [
    {
      name: 'Giga Impact',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 230,
      text: ''
    },
  ];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '114';

  public name: string = 'Regigigas VSTAR';

  public fullName: string = 'Regigigas VSTAR CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.getPrizeLeft() !== 1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.usedVSTAR == true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }
      player.usedVSTAR = true;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.moveTo(opponent.discard);
        });
        return state;
      });
    }
    return state;
  }
}

