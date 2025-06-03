import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, GameError,
  GameMessage, ChoosePrizePrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, BLOCK_IF_ASLEEP_CONFUSED_PARALYZED, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Trickery',
    useWhenInPlay: true,
    powerType: PowerType.POKEMON_POWER,
    text: 'Once during your turn (before your attack), you may switch 1 of your Prizes with the top card of your deck. This power can\'t be used if Rattata is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage; if tails, this attack does 10 damage.'
    }
  ];

  public set: string = 'TR';
  public name: string = 'Rattata';
  public fullName: string = 'Rattata TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';

  public readonly TRICKERY_MARKER = 'TRICKERY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.TRICKERY_MARKER, effect.player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.TRICKERY_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      BLOCK_IF_ASLEEP_CONFUSED_PARALYZED(player, this);

      ADD_MARKER(this.TRICKERY_MARKER, player, this);

      state = store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        { count: 1, allowCancel: false }
      ), prizes => {
        if (prizes && prizes.length > 0) {
          const temp = player.deck.cards[0];
          player.deck.cards[0] = prizes[0].cards[0];
          prizes[0].cards[0] = temp;
        }
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    return state;
  }
}
