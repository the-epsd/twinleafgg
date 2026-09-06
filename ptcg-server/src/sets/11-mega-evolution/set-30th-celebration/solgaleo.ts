import { PokemonCard, Stage, CardType, EnergyType, SuperType, StoreLike, State, PowerType, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils, CardTarget, GameError, PokemonCardList } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POWER_USED, USE_ABILITY_ONCE_PER_TURN, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN, DISCARD_ALL_ENERGY_FROM_POKEMON, SHUFFLE_DECK, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';

export class Solgaleo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Cosmoem';
  public hp: number = 170;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Sunrise',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon is on your Bench, you may use this Ability. Search your deck for up to 2 Basic [M] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Sunsteel Strike',
    cost: [M, M, C, C],
    damage: 220,
    text: 'Discard all Energy from this Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'Solgaleo';
  public fullName: string = 'Solgaleo 30C';

  public readonly SUNRISE_MARKER = 'SUNRISE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const isBenched = player.bench.some(b => b === cardList);

      if (!isBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.SUNRISE_MARKER, this);
      ABILITY_USED(player, this);

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
        if (list !== cardList) {
          blockedTo.push(target);
        }
      });

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
        { allowCancel: true, min: 0, max: 2, blockedTo }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.deck, target, {
            cards: [transfer.card],
            sourceCard: this,
            sourceEffect: this.powers[0],
          });
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SUNRISE_MARKER, this);

    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
    }

    return state;
  }
}
