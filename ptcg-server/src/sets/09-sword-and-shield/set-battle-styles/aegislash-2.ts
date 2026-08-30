import {
  CardTag,
  CardType,
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PowerType,
  Stage,
  State,
  StoreLike,
  SuperType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_POWER_USED,
  IS_ABILITY_BLOCKED,
  USE_ABILITY_ONCE_PER_TURN,
  ABILITY_USED,
  REMOVE_MARKER_AT_END_OF_TURN,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Aegislash2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Doublade';
  public cardType: CardType[] = [M];
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [
    {
      name: 'Stance Change',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, you may switch this Pokémon with an Aegislash in your hand. Any attached cards, damage counters, Special Conditions, turns in play, and any other effects remain on the new Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Gigaton Bash',
      cost: [M, C],
      damage: 70,
      text: "During your opponent's next turn, prevent all damage done to this Pokémon by attacks from Pokémon VMAX.",
    },
  ];

  public regulationMark: string = 'E';
  public set: string = 'BST';
  public setNumber: string = '108';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aegislash';
  public fullName: string = 'Aegislash BST 108';

  public readonly STANCE_CHANGE_MARKER = 'AEGISLASH2_BST_STANCE_CHANGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stance Change
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const aegislashInHand = player.hand.cards.filter(
        (c) => c instanceof PokemonCard && c.name === 'Aegislash' && c !== this,
      );

      if (aegislashInHand.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.STANCE_CHANGE_MARKER, this);
      ABILITY_USED(player, this);

      let cardList: any = null;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list) => {
        if (list.cards.includes(this)) {
          cardList = list;
        }
      });

      if (cardList === null) {
        return state;
      }

      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) || card.name !== 'Aegislash') {
          blocked.push(index);
        }
      });

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          player.hand,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (selected) => {
          if (!selected || selected.length === 0) {
            return;
          }

          const newAegislash = selected[0] as PokemonCard;

          const thisIndex = cardList.cards.indexOf(this);
          if (thisIndex !== -1) {
            cardList.cards.splice(thisIndex, 1);
            const handIndex = player.hand.cards.indexOf(newAegislash);
            if (handIndex !== -1) {
              player.hand.cards.splice(handIndex, 1);
            }

            // Swap: remove this card from the PokemonCardList, insert new one
            if (thisIndex !== -1) {
              cardList.cards.splice(thisIndex, 1);
              const handIndex = player.hand.cards.indexOf(newAegislash);
              if (handIndex !== -1) {
                player.hand.cards.splice(handIndex, 1);
              }
              cardList.cards.splice(thisIndex, 0, newAegislash);
              player.hand.cards.push(this);
            }
          }
        },
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.STANCE_CHANGE_MARKER, this);

    // Gigaton Bash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceTags: [CardTag.POKEMON_VMAX] });
    }

    return state;
  }
}
