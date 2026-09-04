import {
  ChooseCardsPrompt,
  GameMessage,
  PlayerType,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { CardTag, CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';
import { AttackEffect } from '../../../game/store/effects/game-effects';

export class Shiftryex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nuzleaf';
  protected _tags = [CardTag.POKEMON_ex];
  public cardType: CardType[] = [D];
  public hp: number = 140;
  public weakness = [{ type: G }, { type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Skill Hack',
      cost: [D],
      damage: 0,
      copycatAttack: true,
      text: "Look at your opponent's hand and choose a Basic Pokémon or Evolution card you find there. Choose 1 of that Pokémon's attacks. Skill Hack copies that attack except for its Energy cost. (You must still do anything else required for that attack.) (No matter what type that Pokémon is, Shiftry ex's type is still [D].) Shiftry ex performs that attack.",
    },
    {
      name: 'Dirge',
      cost: [D, C, C],
      damage: 60,
      text: "Does 60 damage to each of your opponent's Benched Pokémon that has the same name as the Defending Pokémon. (Don't apply Weakness and Resistance for Benched Pokémon.)",
    },
  ];

  public set: string = 'PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Shiftry ex';
  public fullName: string = 'Shiftry ex PK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonCardsInHand = opponent.hand.cards.filter((card) => card instanceof PokemonCard);
      if (pokemonCardsInHand.length === 0) {
        SHOW_CARDS_TO_PLAYER(store, state, player, [...opponent.hand.cards]);
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          opponent.hand,
          { superType: SuperType.POKEMON },
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const selectedCards = selected || [];
          const selectedPokemon = selectedCards[0] as PokemonCard;
          if (!selectedPokemon || selectedPokemon.attacks.length === 0) {
            return state;
          }

          return COPY_ATTACK_FROM_POKEMON_LIST(
            store,
            state,
            effect as AttackEffect,
            [selectedPokemon],
          );
        },
      );
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === effect.opponent.active) {
          return;
        }
        if (cardList.getPokemonCard()?.name === effect.opponent.active.getPokemonCard()?.name) {
          const damageEffect = new PutDamageEffect(effect, 60);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
