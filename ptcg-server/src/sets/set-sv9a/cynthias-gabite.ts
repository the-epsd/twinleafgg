import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State,
  GameMessage,
  ChooseCardsPrompt,
  ShuffleDeckPrompt,
  GameError,
  StateUtils
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { REMOVE_MARKER, HAS_MARKER, ABILITY_USED, MOVE_CARDS_TO_HAND, SHOW_CARDS_TO_PLAYER, ADD_MARKER } from '../../game/store/prefabs/prefabs';

export class CynthiasGabite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Cynthia\'s Gible';
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public powers = [
    {
      name: 'Champion\'s Call',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, you may search your deck for a Cynthia\'s Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
    }
  ];

  public attacks = [
    {
      name: 'Dragon Slice',
      cost: [F],
      damage: 40,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV9a';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Gabite';
  public fullName: string = 'Cynthia\'s Gabite SV9a';

  public readonly CHAMPIONS_CALL_MARKER = 'CHAMPIONS_CALL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      REMOVE_MARKER(this.CHAMPIONS_CALL_MARKER, effect.player, this);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.CHAMPIONS_CALL_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.CHAMPIONS_CALL_MARKER, effect.player, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.CHAMPIONS_CALL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ABILITY_USED(player, this);

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && !card.tags.includes(CardTag.CYNTHIAS)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 1, allowCancel: false, blocked }
      ), cards => {
        if (cards.length > 0) {
          MOVE_CARDS_TO_HAND(store, state, player, cards);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          ADD_MARKER(this.CHAMPIONS_CALL_MARKER, player, this);
        });
      });
    }

    return state;
  }
}
