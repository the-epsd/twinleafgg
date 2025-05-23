import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, StateUtils,
  GameError, GameMessage, EnergyCard, PlayerType, SlotType,
  ChooseCardsPrompt,
  CoinFlipPrompt
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Blastoiseex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Wartortle';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Energy Rain',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), you may attach a [W] Energy card from your hand to 1 of your Pokémon. Put 1 damage counter on that Pokémon. This power can\'t be used if Blastoise ex is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Hyper Whirlpool',
    cost: [W, W, W, C],
    damage: 80,
    text: 'Flip a coin until you get tails. For each heads, your opponent discards an Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Blastoise ex';
  public fullName: string = 'Blastoise ex RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInHand = player.hand.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC
          && c.provides.includes(CardType.WATER);
      });
      if (!hasEnergyInHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.hand,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: false }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);

          target.damage += 10;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const active = opponent.active;
      const energyCards = active.cards.filter(c => c.superType === SuperType.ENERGY);

      if (energyCards.length === 0) {
        return state;
      }

      // Flip coins until tails, then prompt to discard
      let heads = 0;
      const flipCoins = (s: State): State => {
        return store.prompt(s, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
          if (result === true) {
            heads++;
            return flipCoins(s);
          }
          // After flipping, ask opponent to discard up to heads (or all if less)
          const maxToDiscard = Math.min(heads, energyCards.length);
          if (maxToDiscard === 0) {
            return s;
          }
          return store.prompt(s, new ChooseCardsPrompt(
            opponent,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            active,
            { superType: SuperType.ENERGY },
            { min: maxToDiscard, max: maxToDiscard, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
              MOVE_CARDS(store, s, active, opponent.discard, { cards });
            }
            return s;
          });
        });
      };

      return flipCoins(state);
    }

    return state;
  }

}
