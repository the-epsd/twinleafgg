import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameMessage, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ChienPao extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Strafe',
    cost: [D],
    damage: 20,
    text: 'You may switch this Pokemon with 1 of your Benched Pokemon.'
  },
  {
    name: 'Rising Blade',
    cost: [D, D, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokemon is a Pokemon ex, this attack does 80 more damage.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Chien-Pao';
  public fullName: string = 'Chien-Pao M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Strafe - optional switch
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
      });
    }

    // Rising Blade - extra damage vs ex Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const opponentActive = opponent.active.getPokemonCard();

      if (opponentActive && (
        opponentActive.tags.includes(CardTag.POKEMON_ex)
      )) {
        effect.damage = 80 + 80;
      }
    }

    return state;
  }
}
