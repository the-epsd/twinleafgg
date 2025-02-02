import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Attack, PowerType } from '../../game/store/card/pokemon-types';
import { ChooseAttackPrompt, GameError, GameLog, GameMessage, PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

function* useGenomeHacking(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);
  const pokemonCard = opponent.active.getPokemonCard();

  if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
    return state;
  }

  const attacks = pokemonCard.attacks.map(a => a.name);
  if (attacks.includes(effect.attack.name + ' (Genome Hacking)')) {
    return state;
  }

  let selected: any;
  yield store.prompt(state, new ChooseAttackPrompt(
    player.id,
    GameMessage.CHOOSE_ATTACK_TO_COPY,
    [pokemonCard],
    { allowCancel: false }
  ), result => {
    selected = result;
    next();
  });

  const attack: Attack | null = selected;

  if (attack === null) {
    return state;
  }

  if (attack.copycatAttack === true) {
    return state;
  }

  store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
    name: player.name,
    attack: attack.name
  });

  // Perform attack
  const attackEffect = new AttackEffect(player, opponent, attack);
  store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  return state;
}

export class Mewex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 180;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public powers = [{
    name: 'Restart',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw cards until you ' +
      'have 3 cards in your hand.'
  }];

  public attacks = [{
    name: 'Genome Hacking',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    copycatAttack: true,
    text: 'Choose 1 of the Defending Pokemon\'s attacks and use it ' +
      'as this attack.'
  }];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public name: string = 'Mew ex';

  public fullName: string = 'Mew ex MEW';

  public readonly RESTART_MARKER = 'RESTART_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RESTART_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.RESTART_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.RESTART_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.hand.cards.length >= 3) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      while (player.hand.cards.length < 3) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }
      player.marker.addMarker(this.RESTART_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

    }

    if (effect instanceof EndTurnEffect) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player instanceof Mewex) {
          player.marker.removeMarker(this.RESTART_MARKER);
        }
      });

    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useGenomeHacking(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
