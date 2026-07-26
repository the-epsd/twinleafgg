import { CardTag, CardType, GameMessage, PlayerType, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from "../../../game";
import { CheckAttackCostEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { HANDLE_ABILITY_BLOCK, POKEPOWER_TYPES } from "../../../game/store/prefabs/ability-lock";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN } from "../../../game/store/prefabs/prefabs";

export class Jirachiex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = P;
  public hp: number = 90;
  public retreat = [C];

  public powers = [{
    name: 'Star Light',
    powerType: PowerType.POKEBODY,
    text: 'As long as your opponent has any Pokémon-ex or Stage 2 Evolved Pokémon in play, Jirachi ex pays [C] less Energy to use Shield Beam or Super Psy Bolt.',
  }];

  public attacks = [{
    name: 'Shield Beam',
    cost: [P, C],
    damage: 30,
    text: 'During your opponent\'s next turn, your opponent can\'t use any Poké-Powers on his or her Pokémon.'
  },
  {
    name: 'Super Psy Bolt',
    cost: [P, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '94';
  public name: string = 'Jirachi ex';
  public fullName: string = 'Jirachi ex CG';

  public readonly SHIELD_BEAM_MARKER = 'SHIELD_BEAM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === (this.attacks[0] || this.attacks[1])) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      let isThingInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.stage === Stage.STAGE_2 || card.tags.includes(CardTag.POKEMON_ex)) {
          isThingInPlay = true;
        }
      });

      if (!isThingInPlay) {
        return state;
      }

      const costToRemove = 1;
      for (let i = 0; i < costToRemove; i++) {
        const index = effect.cost.indexOf(CardType.COLORLESS);
        if (index !== -1) {
          effect.cost.splice(index, 1);
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.SHIELD_BEAM_MARKER, opponent, this);
    }

    HANDLE_ABILITY_BLOCK(effect, ({ player }) => {
      return HAS_MARKER(this.SHIELD_BEAM_MARKER, player, this);
    }, {
      powerTypes: POKEPOWER_TYPES,
      error: GameMessage.CANNOT_USE_POWER,
    });

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SHIELD_BEAM_MARKER, this);

    return state;
  }

}
