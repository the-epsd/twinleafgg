import { PokemonCard, Stage, StoreLike, State, StateUtils, GameError, GameMessage, PokemonCardList, ChooseCardsPrompt, SuperType } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Dusknoir extends PokemonCard {
  public stage = Stage.STAGE_2;
  public evolvesFrom = 'Dusclops';
  public cardType = P;
  public hp = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Dark Invitation',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may have your opponent reveal their hand. Put a Basic Pokémon you find there onto your opponent\'s Bench, and put 3 damage counters on that Pokémon.'
  }];

  public attacks = [{
    name: 'Mind Jack',
    cost: [P, C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
  }];

  public set = 'BUS';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Dusknoir';
  public fullName = 'Dusknoir BUS';

  public readonly DARK_INVITATION_MARKER = 'DARK_INVITATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

      if (slots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.DARK_INVITATION_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_MARKER(this.DARK_INVITATION_MARKER, player, this);
      ABILITY_USED(player, this);

      const min = Math.min(
        opponent.hand.cards.filter(card => card instanceof PokemonCard && card.stage === Stage.BASIC).length,
        1
      );

      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        opponent.hand,
        { superType: SuperType.POKEMON, stage: Stage.BASIC },
        { min, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];

        // Operation canceled by the user
        if (cards.length === 0) {
          return;
        }

        cards.forEach((card, index) => {
          opponent.hand.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
          slots[index].damage += 30;
        });
      });
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DARK_INVITATION_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage += (opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0) * 30);
    }

    return state;
  }

}
