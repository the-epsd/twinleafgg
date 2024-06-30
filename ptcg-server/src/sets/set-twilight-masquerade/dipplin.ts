import { CardType, Stage } from '../../game/store/card/card-types';
import { Attack, ChooseAttackPrompt, ConfirmPrompt, GameLog, GameMessage, GamePhase, PokemonCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Dipplin extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Applin';

  public regulationMark = 'H';

  public cardType: CardType = CardType.GRASS;

  public cardTypez: CardType = CardType.DIPPLIN;

  public hp: number = 80;

  public weakness = [ {type: CardType.FIRE}];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Do the Wave',
      cost: [CardType.GRASS],
      damage: 20,
      text: 'This attack does 20 damage for each of your Benched Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '18';

  public name: string = 'Dipplin';

  public fullName: string = 'Dipplin TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activePokemon = opponent.active.getPokemonCard();
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (activePokemon) {
        const playerBenched = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
        effect.damage = playerBenched * 20;
      }

      // Handle PowerEffect after damage is resolved
      // Check if 'Festival Plaza' stadium is in play
      if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
        if (effect.damage > 0) {
          const dealDamage = new DealDamageEffect(effect, effect.damage);
          state = store.reduceEffect(state, dealDamage);
  
          try {
            const stub = new PowerEffect(player, {
              name: 'test',
              powerType: PowerType.ABILITY,
              text: ''
            }, this);
            store.reduceEffect(state, stub);
          } catch {
            return state;
          }
  
          state = store.prompt(state, new ConfirmPrompt(
            effect.player.id,
            GameMessage.WANT_TO_USE_FESTIVAL_FEVER,
          ), wantToUse => {
            if (!wantToUse) {
              effect.damage = 0;
              return state;
            }
            const opponent = StateUtils.getOpponent(state, player);

            // Do not activate between turns, or when it's not the opponent's turn.
            if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
              return state;
            }
            const activeDipplin = player.active.cards.filter(card => card instanceof PokemonCard) as PokemonCard[];

            let selected: Attack | null;
            store.prompt(state, new ChooseAttackPrompt(
              player.id,
              GameMessage.CHOOSE_ATTACK_TO_COPY,
              activeDipplin,
              { allowCancel: false }
            ), result => {
              selected = result;

              const attack: Attack | null = selected;

              if (attack !== null) {
                store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
                  name: player.name,
                  attack: attack.name
                });

                // Perform attack
                const attackEffect = new AttackEffect(player, opponent, attack);
                store.reduceEffect(state, attackEffect);

                if (store.hasPrompts()) {
                  store.waitPrompt(state, () => { });
                }

                if (attackEffect.damage > 0) {
                  const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
                  state = store.reduceEffect(state, dealDamage);
                }
              }
              return state;
            });
          });
        }
      }
    }
    return state;
  }
}