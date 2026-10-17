import { CardTarget, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike, SuperType } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

function isEeveeEvolution(cardList: PokemonCardList): boolean {
  return cardList.getPokemons().some(p => p.evolvesFrom === 'Eevee');
}


export class Espeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Sunlight Veil',
    powerType: PowerType.POKEBODY,
    text: 'Each of your Pokémon that evolves from Eevee gets +20 HP. You can\'t use more than 1 Sunlight Veil Poké-Body each turn.'
  }];

  public attacks = [{
    name: 'Morning Sun',
    cost: [P, C, C],
    damage: 60,
    text: 'You may move an Energy card attached to Espeon to 1 of your Benched Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sunlight Veil
    if (effect instanceof CheckHpEffect) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner !== effect.player || !isEeveeEvolution(effect.target)) {
        return state;
      }

      let firstEspeon: PokemonCard | undefined;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card.fullName === this.fullName && !firstEspeon && !IS_POKEBODY_BLOCKED(store, state, owner, card)) {
          firstEspeon = card;
        }
      });

      if (firstEspeon === this) {
        effect.hp += 20;
      }
    }

    // Morning Sun
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      const hasEnergyOnActive = player.active.cards.some(c => c.superType === SuperType.ENERGY);

      if (!hasBench || !hasEnergyOnActive) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantTo => {
        if (!wantTo) {
          return;
        }

        const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _card, target) => {
          if (target.slot !== SlotType.ACTIVE) {
            blockedMap.push({ source: target, blocked: cardList.cards.map((_, i) => i) });
          } else {
            const nonEnergy: number[] = [];
            cardList.cards.forEach((c, i) => {
              if (c.superType !== SuperType.ENERGY) {
                nonEnergy.push(i);
              }
            });
            if (nonEnergy.length > 0) {
              blockedMap.push({ source: target, blocked: nonEnergy });
            }
          }
        });

        const blockedTo: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, _card, target) => {
          if (target.slot === SlotType.ACTIVE) {
            blockedTo.push(target);
          }
        });

        store.prompt(state, new MoveEnergyPrompt(
          player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: true, min: 0, max: 1, blockedMap, blockedTo }
        ), transfers => {
          if (!transfers || transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const source = StateUtils.getTarget(state, player, transfer.from);
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this });
          }
        });
      });
    }

    return state;
  }
}
