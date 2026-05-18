import { useMemo } from 'react';
import { GameWinner } from 'ptcg-server';
import { CardFace } from '../../components/cards/CardFace';
import type { LocalGameState } from '../types/localGameState';
import {
  computeGameOverPresentation,
  getSafePokemonName,
  hasValidCardImage,
} from './computeGameOverPresentation';
import styles from './GameOverOverlay.module.css';

export type GameOverOverlayProps = {
  localGame: LocalGameState;
  clientId: number;
  getScanUrl: (card: import('ptcg-server').Card) => string;
  onConfirm: () => void;
};

export function GameOverOverlay({ localGame, clientId, getScanUrl, onConfirm }: GameOverOverlayProps) {
  const vm = useMemo(
    () => computeGameOverPresentation(localGame, clientId),
    [localGame, clientId],
  );

  if (!vm) {
    return null;
  }

  const overlayClass =
    vm.resultClass === 'victory'
      ? styles.overlayVictory
      : vm.resultClass === 'defeat'
        ? styles.overlayDefeat
        : styles.overlayDraw;

  const title =
    vm.winner === GameWinner.DRAW ? (
      <h1 className={styles.title}>Draw</h1>
    ) : vm.isWinner ? (
      <h1 className={styles.title}>Victory!</h1>
    ) : (
      <h1 className={styles.title}>Defeat</h1>
    );

  const featuredYour = vm.showYourTopPokemon ? vm.topPokemon : null;
  const featuredOpp = vm.showOpponentTopPokemon ? vm.opponentTopPokemon : null;

  return (
    <div className={`${styles.overlay} ${overlayClass}`} role="dialog" aria-modal="true">
      <div className={styles.bg} />
      <div className={styles.scanline} />
      <div className={styles.top}>
        <div className={styles.victoryHeader}>{title}</div>
        <div className={styles.playerAvatars}>
          <span className={styles.playerName}>{vm.playerUsername}</span>
          <span className={styles.vsText}>vs.</span>
          <span className={styles.playerName}>{vm.opponentUsername}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.battleLog} />
        <div className={styles.grid}>
          <div className={styles.statsContainer}>
            <div className={styles.statsRow}>
              <span className={styles.statLabel}>Turn order</span>
              <span className={styles.statValue}>Went {vm.wentFirst ? 'first' : 'second'}</span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statLabel}>Turns played</span>
              <span className={styles.statValue}>{vm.turnCount}</span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statLabel}>Your prizes taken</span>
              <div className={styles.prizeIndicators}>
                {vm.prizeIndicators.map((prizeNum) => (
                  <div
                    key={`yours-${prizeNum}`}
                    className={`${styles.prizeIndicator} ${vm.playerPrizesTaken >= prizeNum ? styles.prizeTaken : ''}`}
                  >
                    {prizeNum}
                  </div>
                ))}
              </div>
              {!vm.hasAccurateStatistics ? (
                <small className={styles.estimatedNote}>(Estimated - server stats unavailable)</small>
              ) : null}
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statLabel}>Opponent&apos;s prizes taken</span>
              <div className={styles.prizeIndicators}>
                {vm.prizeIndicators.map((prizeNum) => (
                  <div
                    key={`opp-${prizeNum}`}
                    className={`${styles.prizeIndicator} ${vm.opponentPrizesTaken >= prizeNum ? styles.prizeOpponentTaken : ''}`}
                  >
                    {prizeNum}
                  </div>
                ))}
              </div>
              {!vm.hasAccurateStatistics ? (
                <small className={styles.estimatedNote}>(Estimated - server stats unavailable)</small>
              ) : null}
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statLabel}>Your damage dealt</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{vm.playerDamageDisplay}</span>
                {!vm.hasAccurateDamageStats ? (
                  <small className={styles.damageNote}>
                    (
                    {vm.hasAccurateStatistics ? 'No damage tracked' : 'Estimated'})
                  </small>
                ) : null}
              </div>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statLabel}>Opponent&apos;s damage dealt</span>
              <div className={styles.statValueRow}>
                <span className={styles.statValue}>{vm.opponentDamageDisplay}</span>
                {!vm.hasAccurateDamageStats ? (
                  <small className={styles.damageNote}>
                    (
                    {vm.hasAccurateStatistics ? 'No damage tracked' : 'Estimated'})
                  </small>
                ) : null}
              </div>
            </div>
          </div>

          <div className={styles.cardFeature}>
            {featuredYour ? (
              <div className={styles.pokemonSection}>
                <div className={styles.cardTitleContainer}>
                  <h3 className={styles.cardTitle}>Your Top Pokémon</h3>
                  {featuredYour.damage > 0 ? (
                    <div className={styles.damageBadge}>{vm.topPokemonBadgeText}</div>
                  ) : (
                    <div className={styles.noDamageBadge}>{vm.topPokemonBadgeText}</div>
                  )}
                </div>
                <div className={styles.featuredCardContainer}>
                  <div className={styles.cardPerspective}>
                    <div className={styles.cardHolder}>
                      {hasValidCardImage(featuredYour) ? (
                        <div className={styles.topPokemon}>
                          <CardFace
                            card={featuredYour.card}
                            src={getScanUrl(featuredYour.card)}
                            name={featuredYour.card.name}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : featuredYour ? (
                        <div className={styles.cardError}>
                          <div className={styles.cardBack}>
                            <span className={styles.errorText}>{getSafePokemonName(featuredYour)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.cardPlaceholder}>
                          <div className={styles.cardBack} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            {featuredOpp ? (
              <div className={styles.pokemonSection}>
                <div className={styles.cardTitleContainer}>
                  <h3 className={styles.cardTitle}>Opponent&apos;s Top Pokémon</h3>
                  {featuredOpp.damage > 0 ? (
                    <div className={styles.damageBadge}>{vm.opponentTopPokemonBadgeText}</div>
                  ) : (
                    <div className={styles.noDamageBadge}>{vm.opponentTopPokemonBadgeText}</div>
                  )}
                </div>
                <div className={styles.featuredCardContainer}>
                  <div className={styles.cardPerspective}>
                    <div className={styles.cardHolder}>
                      {hasValidCardImage(featuredOpp) ? (
                        <div className={styles.topPokemon}>
                          <CardFace
                            card={featuredOpp.card}
                            src={getScanUrl(featuredOpp.card)}
                            name={featuredOpp.card.name}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : featuredOpp ? (
                        <div className={styles.cardError}>
                          <div className={styles.cardBack}>
                            <span className={styles.errorText}>{getSafePokemonName(featuredOpp)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.cardPlaceholder}>
                          <div className={styles.cardBack} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.okButton} onClick={onConfirm}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
