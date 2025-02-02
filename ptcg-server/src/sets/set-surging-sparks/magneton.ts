import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, PlayerType, SlotType, EnergyCard, GameError, AttachEnergyPrompt, StateUtils, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Magneton extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magnemite';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 100;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Overvolt Discharge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may attach up to 3 Basic Energy cards from your discard pile to your L Pokémon in any way you like. If you use this Ability, this Pokémon is Knocked Out.'
  }];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 40,
      text: ''
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '59';

  public name: string = 'Magneton';

  public fullName: string = 'Magneton SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const hasEnergyInHand = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType == EnergyType.BASIC;
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.cardType !== CardType.LIGHTNING) {
          blocked2.push(target);
        }
      });

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 3, blockedTo: blocked2 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });
    }
    return state;
  }
}