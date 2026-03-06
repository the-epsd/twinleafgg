import { CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, PlayerType, SlotType, ChoosePokemonPrompt, GameMessage, StateUtils, StoreLike, State } from '../../game';
import { MULTIPLE_COIN_FLIPS_PROMPT, DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 130;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Crowd Targeting',
    cost: [C, C],
    damage: 0,
    damageCalculation: 'x' as 'x',
    text: 'Choose 1 of your opponent\'s Pokemon. Flip a coin for each of your Pokemon that has "Tauros" in its name. This attack does 50 damage for each heads to that Pokemon.'
  }];
  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Tauros';
  public fullName: string = 'Tauros M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let taurosCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card && card.name.includes('Tauros')) taurosCount++;
      });
      const hasOpponentPokemon = opponent.active.cards.length > 0 || opponent.bench.some(b => b.cards.length > 0);
      if (!hasOpponentPokemon) return state;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) return state;
        return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, taurosCount, results => {
          const damage = 50 * results.filter(r => r).length;
          if (damage > 0) {
            DAMAGE_OPPONENT_POKEMON(store, state, effect, damage, targets);
          }
        });
      });
    }
    return state;
  }
}
