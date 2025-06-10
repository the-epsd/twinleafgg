import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, SelectPrompt, StateUtils, PokemonCardList, Card, CoinFlipPrompt, AttachEnergyPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Rayquazaex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: C }];
  public resistance = [{ type: W, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spiral Growth',
    cost: [C],
    damage: 0,
    text: 'Flip a coin until you get tails. For each heads, search your discard pile for a basic Energy card and attach it to Rayquaza ex.'
  },
  {
    name: 'Dragon Burst',
    cost: [R, L],
    damage: 40,
    damageCalculation: 'x',
    text: 'Discard either all [R] Energy or all [L] Energy attached to Rayquaza ex. This attack does 40 damage times the amount of [R] or [L] Energy discarded.'
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Rayquaza ex';
  public fullName: string = 'Rayquaza ex DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }

          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_ACTIVE,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 0, max: heads }
          ), transfers => {
            transfers = transfers || [];
            // cancelled by user
            if (transfers.length === 0) {
              return;
            }

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
            }
          });
        });
      };
      return flipCoin();
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.ALL_FIRE_ENERGIES,
          action: () => {
            // Discard all [R]
            const player = effect.player;
            const cardList = StateUtils.findCardList(state, this);
            if (!(cardList instanceof PokemonCardList))
              throw new GameError(GameMessage.INVALID_TARGET);

            const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);

            // Only discard cards that provide R or ANY energy
            const cards: Card[] = checkProvidedEnergy.energyMap
              .filter(e => e.provides.includes(CardType.FIRE) || e.provides.includes(CardType.ANY))
              .map(e => e.card);

            effect.damage = 40 * cards.length;
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = cardList;
            store.reduceEffect(state, discardEnergy);
          }
        },

        {
          message: GameMessage.ALL_LIGHTNING_ENERGIES,
          action: () => {

            // Discard all [L]
            const player = effect.player;
            const cardList = StateUtils.findCardList(state, this);
            if (!(cardList instanceof PokemonCardList))
              throw new GameError(GameMessage.INVALID_TARGET);

            const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
            state = store.reduceEffect(state, checkProvidedEnergy);

            // Only discard cards that provide LIGHTNING or ANY energy
            const cards: Card[] = checkProvidedEnergy.energyMap
              .filter(e => e.provides.includes(CardType.LIGHTNING) || e.provides.includes(CardType.ANY))
              .map(e => e.card);

            effect.damage = 40 * cards.length;
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = cardList;
            store.reduceEffect(state, discardEnergy);
          }
        }
      ];
      return store.prompt(state, new SelectPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
      });
    }
    return state;
  }
}