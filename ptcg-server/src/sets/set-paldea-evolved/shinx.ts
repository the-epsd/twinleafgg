import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

function* useBigRoar(next: Function, store: StoreLike, state: State,
  effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const hasBench = opponent.bench.some(b => b.cards.length > 0);

  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }

  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    opponent.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH],
    { allowCancel: false }
  ), results => {
    targets = results || [];
    next();
  });

  if (targets.length > 0) {
    opponent.active.clearEffects();
    opponent.switchPokemon(targets[0]);

  }
}

export class Shinx extends PokemonCard {

  public stage = Stage.BASIC;

  public cardType = CardType.LIGHTNING;

  public hp = 40;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Big Roar',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may switch out your opponent\'s Active Pokémon to the Bench. (Your opponent chooses the new Active Pokémon.)'
  }];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.LIGHTNING],
    damage: 10,
    text: ''
  }];

  public set: string = 'PAL';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public name: string = 'Shinx';

  public fullName: string = 'Shinx PAL';

  public readonly BIG_ROAR_MARKER = 'BIG_ROAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.BIG_ROAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useBigRoar(() => generator.next(), store, state, effect);
      const player = effect.player;

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }


      if (player.marker.hasMarker(this.BIG_ROAR_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      effect.player.marker.addMarker(this.BIG_ROAR_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      return generator.next().value;
    }
    return state;
  }
}