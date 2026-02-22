import { PokemonCard, Stage, StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { PowerType } from '../../game';
import { EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hariyama extends PokemonCard {
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Makuhita';
  public cardType = F;
  public hp = 150;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sumo Catcher',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this card from your hand to evolve one of your Pokémon, you may switch one of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [{
    name: 'Wild Press',
    cost: [F, F, F],
    damage: 210,
    text: 'This Pokémon does 70 damage to itself.'
  },];

  public set = 'MEG';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Hariyama';
  public fullName = 'Hariyama M1L';
  public regulationMark = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, (result) => {
        if (result) {
          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];

            const switchEffect = new EffectOfAbilityEffect(player, this.powers[0], this, cardList);
            store.reduceEffect(state, switchEffect);
            if (switchEffect.target) {
              opponent.switchPokemon(cardList);
            }
          });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 70);
    }
    return state;
  }

}
