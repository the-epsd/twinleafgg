import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ErikasWeepinbell extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Erika\'s Bellsprout';
  public cardType: CardType = G;
  public tags = [CardTag.ERIKAS];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Drool',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Flytrap',
    cost: [G, G],
    damage: 20,
    text: 'Before doing damage, choose 1 of your opponent\'s Benched Pokémon and switch it with his or her Active Pokémon. This attack can\'t be used if your opponent has no Benched Pokémon.'
  }];

  public set: string = 'G1';
  public name: string = 'Erika\'s Weepinbell';
  public fullName: string = 'Erika\'s Weepinbell G1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Flytrap
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const bench = opponent.bench.filter(bench => bench.cards.length > 0);

      if (bench.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
      });
    }

    return state;
  }

}
