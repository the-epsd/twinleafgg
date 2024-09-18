import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Floragato extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sprigatito';
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public attacks = [
    {
      name: 'Seed Bomb',
      cost: [CardType.GRASS],
      damage: 30,
      text: ''
    },
    {
      name: 'Magic Whip',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      text: 'Switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
    }
  ];

  public set: string = 'PAL';
  public name: string = 'Floragato';
  public fullName: string = 'Floragato PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public regulationMark = 'G';
  public magicWhip: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      this.magicWhip = true;
    }

    if (effect instanceof EndTurnEffect && this.magicWhip == true) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      state = store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        if (result) {
          if (result.length > 0) {
            opponent.active.clearEffects();
            opponent.switchPokemon(result[0]);
            this.magicWhip = false;
            return state;
          }
        }
      });
    }
    return state;
  }
}
