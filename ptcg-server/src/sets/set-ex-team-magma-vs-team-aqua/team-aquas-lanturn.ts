import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class TeamAquasLanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Aqua\'s Chinchou';
  public tags = [CardTag.TEAM_AQUA];
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Auxiliary Light',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may attach a basic Energy card from your hand to Team Aqua\'s Lanturn. Put 2 damage counters on Team Aqua\'s Lanturn. This power can\'t be used if Team Aqua\'s Lanturn is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Lightning Ball',
    cost: [L, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Team Aqua\'s Lanturn';
  public fullName: string = 'Team Aqua\'s Lanturn MA';

  public readonly AUXILIARY_LIGHT_MARKER = 'AUXILIARY_LIGHT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.AUXILIARY_LIGHT_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      //Once per turn
      if (HAS_MARKER(this.AUXILIARY_LIGHT_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      //Must have basic energy in discard
      if (!player.hand.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            MOVE_CARDS(store, state, player.hand, cardList, { cards: selected });
            cardList.damage += 20;
          }
        });

        ADD_MARKER(this.AUXILIARY_LIGHT_MARKER, player, this);
        ABILITY_USED(player, this);
      });
    }

    return state;
  }
}