import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, CardTag, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, CardTarget } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class DuskManeNecrozma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = M;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dusk Shot',
    cost: [M],
    damage: 0,
    text: 'This attack does 60 damage to 1 of your opponent\'s Pokémon-GX or Pokémon-EX. This damage isn\'t affected by Weakness or Resistance.'
  },
  {
    name: 'Rusty Claws',
    cost: [M, M, C],
    damage: 100,
    damageCalculation: '+',
    text: 'If your opponent has exactly 1 Prize card remaining, this attack does 100 more damage.'
  }];

  public set: string = 'SMP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Dusk Mane Necrozma';
  public fullName: string = 'Dusk Mane Necrozma SMP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dusk Shot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;

      // Check if opponent has any GX/EX Pokemon
      const hasGxExPokemon = (() => {
        let found = false;
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
          if (card.tags.includes(CardTag.POKEMON_GX) || card.tags.includes(CardTag.POKEMON_EX)) {
            found = true;
          }
        });
        return found;
      })();

      if (!hasGxExPokemon) {
        return state;
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.POKEMON_GX) || !card.tags.includes(CardTag.POKEMON_EX)) {
          blocked.push(target);
        }
      });

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 60, targets);
      });
    }

    // Rusty Claws
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.getPrizeLeft() === 1) {
        effect.damage += 100;
      }
    }

    return state;
  }
}
