import { PokemonCard, Stage, CardType, State, StoreLike, PowerType, GameError, GameMessage, ChooseCardsPrompt, ShuffleDeckPrompt, StateUtils, SuperType, CardTag } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { HAS_MARKER, ABILITY_USED, MOVE_CARDS_TO_HAND, SHOW_CARDS_TO_PLAYER, ADD_MARKER } from '../../game/store/prefabs/prefabs';

export class Genesectex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 220;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Metal Signal',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for up to 2 [M] Evolution Pokemon, reveal them, and put them into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Protect Charge',
    cost: [M, M, C],
    damage: 150,
    text: 'During your opponent\'s next turn, this Pokemon takes 30 less damage from attacks.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Genesect ex';
  public fullName: string = 'Genesect ex SV11B';

  private turnTracker: number = 0;
  public readonly METAL_SIGNAL_MARKER = 'METAL_SIGNAL_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.METAL_SIGNAL_MARKER, this);
      effect.player.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      this.turnTracker = 0;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.METAL_SIGNAL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ABILITY_USED(player, this);

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard && card.cardType === CardType.METAL && card.stage !== Stage.BASIC)) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 2, allowCancel: false, blocked }
      ), cards => {
        if (cards.length > 0) {
          MOVE_CARDS_TO_HAND(store, state, player, cards);
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          ADD_MARKER(this.METAL_SIGNAL_MARKER, player, this);
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER)) {
      effect.damage -= 30;
      return state;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
      this.turnTracker++;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this) && this.turnTracker == 2) {
      effect.player.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
    }
    return state;
  }
}
