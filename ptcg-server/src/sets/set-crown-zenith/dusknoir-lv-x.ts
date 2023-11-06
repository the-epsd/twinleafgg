import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameError, GameMessage, StateUtils,
  PokemonCardList,
  GameLog} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

function* usePower(next: Function, store: StoreLike, state: State, self: DusknoirLvX, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const cardList = StateUtils.findCardList(state, self);

  const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
  if (benchIndex === -1) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  const pokemonCard = player.bench[benchIndex].getPokemonCard();
  if (pokemonCard !== self) {
    throw new GameError(GameMessage.ILLEGAL_ACTION);
  }

  if (player.stadium.cards.length > 0) {
    player.stadium.moveTo(player.discard);
  }
  if (opponent.stadium.cards.length > 0) {
    opponent.stadium.moveTo(opponent.discard);
  }
  store.log(state, GameLog.LOG_PLAYER_PLAYS_STADIUM, {
    name: effect.player.name,
    card: self.name,
  });
  player.stadiumUsedTurn = 0;
  player.bench[benchIndex].moveCardTo(pokemonCard, player.stadium);

  // Discard other cards
  player.bench[benchIndex].moveTo(player.discard);
  player.bench[benchIndex].clearEffects();
}


export class DusknoirLvX extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 300;

  public weakness = [{ type: CardType.PSYCHIC, value: 10 }];

  public retreat = [ ];

  public powers = [{
    name: 'Quick',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if Unown Q is on your ' +
      'Bench, you may discard all cards attached to Unown Q and attach Unown Q ' +
      'to 1 of your Pokemon as Pokemon Tool card. As long as Unown Q ' +
      'is attached to a Pokemon, you pay C less to retreat that Pokemon.'
  }];

  public set: string = 'SF';

  public set2: string = 'stormfront';

  public setNumber: string = '96';

  public name: string = 'Dusknoir Lv.X';

  public fullName: string = 'DusknLv.X SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = usePower(() => generator.next(), store, state, this, effect);
      return generator.next().value;
    }
    return state;
  }
}