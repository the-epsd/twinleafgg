import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameLog, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class GalarianZigzagoon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [{
    name: 'Headbutt Tantrum',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may put 1 damage counter on 1 of your opponent\'s Pokémon.',
  }];

  public attacks = [{
    name: 'Surprise Attack',
    cost: [D, C],
    damage: 30,
    text: 'Flip a coin. If tails, this attack does nothing.',
  }];

  public set: string = 'SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Galarian Zigzagoon';
  public fullName: string = 'Galarian Zigzagoon SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Headbutt Tantrum
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(player, target, 10, this, this.powers[0]),
          );
          store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, {
            name: player.name,
            damage: 10,
            target: target.getPokemonCard()!.name,
            effect: this.powers[0].name,
          });
        });
      });
    }

    // Surprise Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
