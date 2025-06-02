import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChooseCardsPrompt, PowerType, GameLog, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';

export class TeamRocketsKoffing extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Alert Smog',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon (even if this Pokémon is Knocked Out), search your deck for up to 2 Pokémon with Koffing in their name and put them onto your Bench. Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Gas Leak',
      cost: [D, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '125';
  public name: string = 'Team Rocket\'s Koffing';
  public fullName: string = 'Team Rocket\'s Koffing DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) { return state; }

      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0 || openSlots.length === 0) {
        return state;
      }

      store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, card: this.name });

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const maxPokemons = Math.min(openSlots.length, 2);

          const blocked: number[] = [];
          player.deck.cards.forEach((card, index) => {
            if (!card.name.includes('Koffing')) {
              blocked.push(index);
            }
          });

          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON },
            { min: 0, max: Math.min(2, maxPokemons), allowCancel: false, blocked }
          ), selectedCards => {
            const cards = selectedCards || [];

            cards.forEach((card, index) => {
              player.deck.moveCardTo(card, openSlots[index]);
              openSlots[index].pokemonPlayedTurn = state.turn;
            });

            SHUFFLE_DECK(store, state, player);
          });
        }
      });
    }

    return state;
  }
}