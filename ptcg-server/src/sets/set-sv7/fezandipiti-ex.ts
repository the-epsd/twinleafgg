import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, ShuffleDeckPrompt, SlotType, StateUtils } from '../../game';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

function* useTableTurner(next: Function, store: StoreLike, state: State,
  effect: PowerEffect): IterableIterator<State> {
  
  const player = effect.player;

  if (player.usedTableTurner === true) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }
  
  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  player.deck.moveTo(player.hand, 3);
  player.usedTableTurner = true;
  
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Fezandipitiex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex ];

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public weakness = [{ type: CardType.FIGHTING }];

  public hp: number = 210;

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Table Turner',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if any of your Pokémon were Knocked Out during your opponent\'s last turn, you may draw 3 cards. You can\'t use more than 1 Table Turner Ability each turn.'
  }];

  public attacks = [{
    name: 'Dirty Headbutt',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    text: 'This attack does 100 damage to 1 of your opponent\'s Pokémon.'
  }];

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '38';
  
  public name: string = 'Fezandipiti ex';
  
  public fullName: string = 'Fezandipiti ex SV6a';

  public readonly TABLE_TURNER_MARKER = 'TABLE_TURNER_MARKER';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useTableTurner(() => generator.next(), store, state, effect);
      const player = effect.player;
      // No Pokemon KO last turn
      if (!player.marker.hasMarker(this.TABLE_TURNER_MARKER)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      return generator.next().value;
    }
    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const duringTurn = [GamePhase.PLAYER_TURN, GamePhase.ATTACK].includes(state.phase);
  
      // Do not activate between turns, or when it's not opponents turn.
      if (!duringTurn || state.players[state.activePlayer] !== opponent) {
        return state;
      }
  
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarker(this.TABLE_TURNER_MARKER, this);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
          }
        });

      }
      return state;
    }
  
    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.TABLE_TURNER_MARKER);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 120);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state; 
      });
    }
  
    return state;
  }
  
}