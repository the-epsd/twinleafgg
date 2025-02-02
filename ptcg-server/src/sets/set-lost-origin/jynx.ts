import { PokemonCard, Stage, CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike, SpecialCondition } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Jynx extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp = 100;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Alluring Dance',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. The new Active Pokémon is now Confused.'
  }, {
    name: 'Super Psy Bolt',
    cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 80,
    text: ''
  }];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '68';

  public name: string = 'Jynx';

  public fullName: string = 'Jynx LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
        opponent.active.specialConditions.push(SpecialCondition.CONFUSED);
      });
    }
    return state;
  }
}