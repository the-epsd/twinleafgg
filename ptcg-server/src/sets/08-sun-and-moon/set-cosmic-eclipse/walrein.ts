import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PlayerType } from "../../../game";
import { PutDamageEffect } from "../../../game/store/effects/attack-effects";
import { Effect } from "../../../game/store/effects/effect";
import { AttackEffect } from "../../../game/store/effects/game-effects";
import { WAS_ATTACK_USED, OPPONENT_CANNOT_PLAY_TRAINER_CARDS } from "../../../game/store/prefabs/prefabs";

export class Walrein extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Sealeo';
  public cardType: CardType = W;
  public hp: number = 160;
  public weakness = [{ type: M }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Cold Snap',
    cost: [W],
    damage: 60,
    text: 'Your opponent can\'t play any Trainer cards from their hand during their next turn. If 1 of your Pokémon used Cold Snap during your last turn, this attack can\'t be used.'
  },
  {
    name: 'Blizzard',
    cost: [W, C, C, C],
    damage: 120,
    text: 'This attack does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'CEC';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Walrein';
  public fullName: string = 'Walrein CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cold Snap — block reuse next turn on all of your Pokémon
    if (effect instanceof AttackEffect && effect.attack.name === this.attacks[0].name) {
      const attackName = this.attacks[0].name;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (!cardList.cannotUseAttacksNextTurnPending.includes(attackName)) {
          cardList.cannotUseAttacksNextTurnPending.push(attackName);
        }
      });
    }

    // Cold Snap — trainer lock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_TRAINER_CARDS(store, state, effect, this);
    }

    // Blizzard
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 10);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}
