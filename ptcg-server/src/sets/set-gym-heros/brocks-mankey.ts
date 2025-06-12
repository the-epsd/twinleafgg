import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class BrocksMankey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BROCKS];
  public cardType: CardType = F;
  public hp: number = 40;
  public weakness = [{ type: P }];
  public retreat = [];

  public attacks = [{
    name: 'Taunt',
    cost: [C],
    damage: 0,
    text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with the Defending Pokémon.'
  },
  {
    name: 'Light Kick',
    cost: [F],
    damage: 10,
    text: ''
  }];

  public set: string = 'G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Brock\'s Mankey';
  public fullName: string = 'Brock\'s Mankey G1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      } else {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), result => {
          const cardList = result[0];
          opponent.switchPokemon(cardList);
          return state;
        });
      }
    }

    return state;
  }
}