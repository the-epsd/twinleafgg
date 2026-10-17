import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Cradily extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lileep';
  public hp: number = 120;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Drain Down',
    cost: [G],
    damage: 30,
    text: 'Before doing damage, you may switch 1 of the Defending Pokémon with 1 of your opponent\'s Benched Pokémon. If you do, this attack does 30 damage to the new Defending Pokémon. If the Defending Pokémon would be Knocked Out by this attack, you may remove all damage counters from Cradily.'
  },
  {
    name: 'Acid',
    cost: [G, C, C],
    damage: 50,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Cradily';
  public fullName: string = 'Cradily LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Drain Down
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }
      return CONFIRMATION_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false },
        ), chosen => {
          if (chosen && chosen.length > 0) {
            opponent.switchPokemon(chosen[0]);
          }
        });
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    if (effect instanceof AfterDamageEffect && effect.attack === this.attacks[0]
      && effect.source.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.source);
      const opponent = StateUtils.getOpponent(state, player);
      const checkHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkHp);
      if (opponent.active.damage >= checkHp.hp) {
        CONFIRMATION_PROMPT(store, state, player, wantToHeal => {
          if (!wantToHeal) {
            return;
          }
          const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
          const healEffect = new HealEffect(player, cardList, cardList.damage);
          store.reduceEffect(state, healEffect);
        }, GameMessage.WANT_TO_USE_ABILITY);
      }
    }

    // Acid
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    return state;
  }
}
