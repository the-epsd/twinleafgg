import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PowerType, SlotType, StateUtils } from '../../game';
import { AttackEffect, KnockOutEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

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

  public readonly RETALIATE_MARKER = 'RETALIATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (!player.marker.hasMarker(this.RETALIATE_MARKER, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
  
      if (player.usedTableTurner == true) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
        
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      
      player.deck.moveTo(player.hand, 3);
      player.usedTableTurner = true;
      
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
        }
      });
    }

    if (effect instanceof KnockOutEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        player.marker.addMarker(this.RETALIATE_MARKER, this);
        console.log('player pokemon was knocked out last turn');
      }
      return state;
    }
  
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.RETALIATE_MARKER);
      player.usedTableTurner = false;
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