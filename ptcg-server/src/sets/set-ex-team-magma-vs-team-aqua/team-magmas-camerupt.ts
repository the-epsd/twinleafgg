import { AttachEnergyPrompt, ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARD_TO, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class TeamMagmasCamerupt extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Team Magma\'s Numel';
  public tags = [CardTag.TEAM_MAGMA];
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Oveheat',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may search your discard pile for a basic Energy card and attach it to Team Magma\'s Camerupt. Put 2 damage counters on Team Mamga\'s Camerupt. This power can\'t be used if Team Magma\'s Camerupt is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Flame Ball',
    cost: [R, C, C],
    damage: 50,
    text: 'You may move a [R] Energy card attached to Team Magma\'s Camerupt to 1 of your Benched Pokémon.'
  }];


  public set: string = 'MA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Team Magma\'s Camerupt';
  public fullName: string = 'Team Magma\'s Camerupt MA';

  public readonly OVERHEAT_MARKER = 'OVERHEAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.OVERHEAT_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      //Once per turn
      if (HAS_MARKER(this.OVERHEAT_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      //Must have basic energy in discard
      if (!player.discard.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DECK,
        player.discard,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            MOVE_CARDS(store, state, player.discard, cardList, { cards: selected });
            cardList.damage += 20;
          }
        });

        ADD_MARKER(this.OVERHEAT_MARKER, player, this);
        ABILITY_USED(player, this);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Fire Energy' },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARD_TO(state, transfer.card, target);
        }
      });
    }

    return state;
  }
}