import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';


export class Luxray extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Luxio';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 150;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Swelling Flash',
    powerType: PowerType.ABILITY,
    // useFromHand: true,
    text: 'Once during your turn, if this Pokémon is in your hand and you have more Prize cards remaining than your opponent, you may put this Pokémon onto your Bench.'
  }];

  public attacks = [{

    name: 'Wild Charge',
    cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
    damage: 180,
    text: 'This Pokémon also does 20 damage to itself.'
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '71';

  public name: string = 'Luxray';

  public fullName: string = 'Luxray PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // if (effect instanceof PowerEffect
    //   && effect.power.powerType === PowerType.ABILITY) {

    //   const player = effect.player;
    //   const opponent = StateUtils.getOpponent(state, player);
    //   const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

    //   if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
    //     // Check if bench has open slots
    //     const openSlots = player.bench.filter(b => b.cards.length === 0);

    //     if (openSlots.length === 0) {
    //       // No open slots, throw error
    //       throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
    //     }

    //     state = store.prompt(state, new ConfirmPrompt(
    //       effect.player.id,
    //       GameMessage.WANT_TO_USE_ABILITY,
    //     ), wantToUse => {
    //       if (wantToUse) {
    //         player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
    //           if (cardList.getPokemonCard() === this) {
    //             store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: 'Swelling Flash' });
    //           }
    //         });

    //         const card = this;
    //         player.hand.moveCardTo(card, slots[0]);
    //         slots[0].pokemonPlayedTurn = state.turn;
    //         store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: card.name });

    //         return state;
    //       }
    //     });
    //   }
    // }
    return state;
  }
}