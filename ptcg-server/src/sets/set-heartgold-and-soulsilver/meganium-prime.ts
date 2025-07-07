import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Card, CardTarget, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Meganium extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Bayleef';
  public tags = [CardTag.PRIME];
  public cardType: CardType = G;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Leaf Trans',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), you may move a [G] Energy attached to 1 of your Pokémon to another of your Pokémon. This power can\'t be used if Meganium is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Solar Beam',
    cost: [G, G, C, C],
    damage: 80,
    text: ''
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '109';
  public name: string = 'Meganium';
  public fullName: string = 'Meganium HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);

        const blockedCards: Card[] = [];
        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.GRASS) && !em.provides.includes(CardType.ANY)) {
            blockedCards.push(em.card);
          }
        });

        cardList.cards.forEach(em => {
          if (cardList.getPokemons().includes(em as PokemonCard)) {
            blockedCards.push(em);
          }
        });

        const blocked: number[] = [];
        blockedCards.forEach(bc => {
          const index = cardList.cards.indexOf(bc);
          if (index !== -1 && !blocked.includes(index)) {
            blocked.push(index);
          }
        });

        if (blocked.length !== 0) {
          blockedMap.push({ source: target, blocked });
        }
      });

      store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        {},
        { allowCancel: true, blockedMap }
      ), transfers => {
        if (transfers === null) {
          return;
        }

        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);

          if (transfer.card instanceof PokemonCard) {
            // Remove it from the source
            source.removePokemonAsEnergy(transfer.card);

            // Reposition it to be with energy cards (at the beginning of the card list)
            target.cards.unshift(target.cards.splice(target.cards.length - 1, 1)[0]);

            // Register this card as energy in the PokemonCardList
            target.addPokemonAsEnergy(transfer.card);
          }
        }
      });
    }

    return state;
  }
}