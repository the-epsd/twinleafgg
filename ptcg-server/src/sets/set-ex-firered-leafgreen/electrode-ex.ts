import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils, GameMessage,
  PlayerType, SlotType,
  AttachEnergyPrompt,
  EnergyCard,
  CardTarget,
  DiscardEnergyPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MOVE_CARD_TO, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Electrodeex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Voltorb';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Extra Energy Bomb',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may discard Electrode ex and all the cards attached to it (this counts as Knocking Out Electrode ex). If you do, search your discard pile for 5 Energy cards and attach them to any of your Pokémon (excluding Pokémon-ex) in any way you like. This power can\'t be used if Electrode ex is affected by a Special Condition.'
  }];

  public attacks = [
    {
      name: 'Crash and Burn',
      cost: [L, C],
      damage: 30,
      damageCalculation: '+',
      text: 'You may discard as many Energy as you like attached to your Pokémon in play. If you do, this attack does 30 damage plus 20 more damage for each Energy you discarded.'
    }
  ];

  public set: string = 'RG';
  public name: string = 'Electrode ex';
  public fullName: string = 'Electrode ex RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    //Versatile pokebody
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.tags.includes(CardTag.POKEMON_ex)) {
          blocked2.push(target);
        }
      });

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 5, blockedTo: blocked2 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.damage += 999;
              return state;
            }
          });
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARD_TO(state, transfer.card, target);
        }
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });
    }

    //Power Move attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let totalEnergy = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const energyCount = cardList.cards.filter(card =>
          card instanceof EnergyCard
        ).length;
        totalEnergy += energyCount;
      });

      return store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { min: 1, max: totalEnergy, allowCancel: false }
      ), transfers => {
        if (transfers === null) {
          return state;
        }

        // Move all selected energies to discard
        transfers.forEach(transfer => {
          const source = StateUtils.getTarget(state, player, transfer.from);
          source.moveCardTo(transfer.card, player.discard);
        });

        // Set damage based on number of discarded cards
        effect.damage += transfers.length * 20;
        return state;
      });
    }
    return state;
  }

}