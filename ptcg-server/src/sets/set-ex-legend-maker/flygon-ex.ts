import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttachEnergyPrompt, Card, CardTarget, ChooseCardsPrompt, PlayerType, SlotType, StateUtils } from '../../game';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Flygonex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vibrava';
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: C }];
  public resistance = [{ type: L, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Emerge Charge',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Flygon ex from your hand to evolve 1 of your Pokémon, you may search your discard pile for up to 2 Energy cards and attach them to Flygon ex.'
  }];

  public attacks = [{
    name: 'Reactive Blast',
    cost: [L, C],
    damage: 40,
    damageCalculation: '+',
    text: 'You may discard any number of React Energy cards attached to Flygon ex. If you do, this attack does 40 damage plus 30 more damage for each Energy card you discarded.'
  },
  {
    name: 'Dragon Claw',
    cost: [G, L, C, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'LM';
  public setNumber: string = '87';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Flygon ex';
  public fullName: string = 'Flygon ex LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
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
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
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
          MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.powers[0] });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      // See if there is holon energy attached
      const reactEnergy = player.active.cards.filter(card => card.name === 'React Energy');

      if (reactEnergy.length > 0) {
        state = store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { name: 'React Energy' },
          { min: 0, max: reactEnergy.length, allowCancel: false }
        ), selected => {
          const cards: Card[] = selected || [];
          if (cards.length > 0) {
            const discardEffect = new DiscardCardsEffect(effect, cards);
            discardEffect.target = player.active;
            store.reduceEffect(state, discardEffect);

            effect.damage += 30 * cards.length;
          }
        });
      }
    }

    return state;
  }
}