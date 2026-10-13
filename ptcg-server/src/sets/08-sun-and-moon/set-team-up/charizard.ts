import { CardType, AttachEnergyPrompt, Card, EnergyType, GameError, GameMessage, PlayerType, PokemonCard, PokemonCardList, PowerType, ShuffleDeckPrompt, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import {
  ABILITY_USED,
  IS_ABILITY_BLOCKED,
  MOVE_CARDS,
  REMOVE_MARKER_AT_END_OF_TURN,
  USE_ABILITY_ONCE_PER_TURN,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';
import { CardTarget } from '../../../game/store/actions/play-card-action';

export class Charizard extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charmeleon';
  public cardType: CardType[] = [R];
  public hp = 150;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Roaring Resolve',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may put 2 damage counters on this Pokémon. If you do, search your deck for up to 2 [R] Energy cards and attach them to this Pokémon. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Continuous Blaze Ball',
      cost: [R, R],
      damage: 30,
      damageCalculation: '+',
      text: 'Discard all [R] Energy from this Pokémon. This attack does 50 more damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Charizard';
  public fullName: string = 'Charizard TEU';

  public readonly ROARING_RESEOLVE_MARKER = 'ROARING_RESEOLVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ROARING_RESEOLVE_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.ABILITY_BLOCKED);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ROARING_RESEOLVE_MARKER, this);
      ABILITY_USED(player, this);

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const placeCounters = new PlaceDamageCountersEffect(
        player,
        cardList,
        20,
        this,
        this.powers[0],
      );
      store.reduceEffect(state, placeCounters);
      if (placeCounters.preventDefault) {
        return state;
      }

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() !== this) {
          blockedTo.push({
            player: PlayerType.BOTTOM_PLAYER,
            slot: cardList === player.active ? SlotType.ACTIVE : SlotType.BENCH,
            index: cardList === player.active ? 0 : player.bench.indexOf(cardList)
          });
        }
      });

      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        {
          min: 0,
          max: 2,
          allowCancel: false,
          blockedTo
        }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this });
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let totalDiscarded = 0;

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;

      totalDiscarded += discardEnergy.cards.length;

      store.reduceEffect(state, discardEnergy);

      effect.damage += (totalDiscarded) * 50;
    }
    return state;
  }
}