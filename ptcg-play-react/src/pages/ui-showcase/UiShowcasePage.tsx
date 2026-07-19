import { useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  BattleStatusBadge,
  DeckValidityBadge,
  EmptyBattlefield,
  FormatTabButton,
  FriendActionButton,
  LoadingSpinner,
  NoDecksMessage,
  QueueOverlayBanner,
  SearchBox,
  StatusIndicator,
  TwinleafButton,
  TwinleafForm,
  TwinleafNextButton,
  TwinleafPlayButton,
  TwinleafPreviousButton,
  type TwinleafFormField,
} from '../../components';
import { CardFace } from '../../components/cards/CardFace';
import { TrainerTypeIcon } from '../../components/cards/TrainerTypeIcon';
import { CheckboxField } from '../../components/ui/CheckboxField';
import { FormAlert } from '../../components/ui/FormAlert';
import { ShellButton } from '../../components/ui/ShellButton';
import { ShellButtonLink } from '../../components/ui/ShellButtonLink';
import { ShellIconButton } from '../../components/ui/ShellIconButton';
import { TextField } from '../../components/ui/TextField';
import { EnergyTypeIcon } from '../../card-info/EnergyTypeIcon';
import { ArchetypeIcon } from '../../games/ArchetypeIcon';
import { useSnackbar } from '../../context/SnackbarContext';
import { publicAssetUrl } from '../../utils/publicAssetUrl';
import deckStyles from '../DeckListPage.module.css';
import friendStyles from '../FriendsPage.module.css';
import lobbyStyles from '../../games/MatchmakingLobby.module.css';
import {
  MOCK_SHOWCASE_ARCHETYPES,
  MOCK_SHOWCASE_DECKS,
  MOCK_SHOWCASE_ENERGY_TYPES,
  MOCK_SHOWCASE_FORMAT_TABS,
  MOCK_SHOWCASE_FORMATS,
  MOCK_SHOWCASE_FRIENDS,
  MOCK_SHOWCASE_TRAINER_TYPES,
} from './uiShowcaseMockData';
import styles from './UiShowcasePage.module.css';

const SHOWCASE_LOGIN_FIELDS: TwinleafFormField[] = [
  { name: 'username', label: 'Username', type: 'text', placeholder: 'Enter username', required: true, minLength: 3 },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter password', required: true, minLength: 6 },
  { name: 'rememberMe', label: 'Remember me', type: 'checkbox' },
];

const SHOWCASE_FUTURISTIC_FIELDS: TwinleafFormField[] = [
  {
    name: 'trainerId',
    label: 'Trainer ID',
    type: 'text',
    placeholder: 'Enter trainer ID',
    required: true,
    pattern: /^\d+$/,
    hint: 'Enter the trainer ID you want to send a request to',
  },
  { name: 'message', label: 'Message', type: 'text', placeholder: 'Optional message', hint: 'Add a personal message to your request' },
];

const SHOWCASE_MINIMAL_FIELDS: TwinleafFormField[] = [
  { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name', required: true },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', required: true },
  {
    name: 'format',
    label: 'Preferred Format',
    type: 'select',
    placeholder: 'Select format',
    required: true,
    options: [
      { value: 'standard', label: 'Standard' },
      { value: 'glc', label: 'GLC' },
      { value: 'unlimited', label: 'Unlimited' },
    ],
  },
];

const TABS = [
  { id: 'buttons', label: 'Buttons' },
  { id: 'forms', label: 'Forms' },
  { id: 'cards', label: 'Cards' },
  { id: 'status', label: 'Status' },
  { id: 'interactive', label: 'Interactive' },
  { id: 'empty', label: 'Empty states' },
] as const;

type TabId = (typeof TABS)[number]['id'];

const FORMAT_CARD_STYLE = {
  width: 200,
  maxWidth: 200,
  flex: '0 0 200px',
  '--format-card-w': '200px',
} as CSSProperties;

export function UiShowcasePage() {
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<TabId>('buttons');
  const [activeFormatTab, setActiveFormatTab] = useState(0);
  const [rememberMe, setRememberMe] = useState(true);
  const [demoLoading, setDemoLoading] = useState(false);
  const [playLoading, setPlayLoading] = useState(false);
  const [inQueue, setInQueue] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const loginFields = useMemo(() => SHOWCASE_LOGIN_FIELDS, []);
  const futuristicFields = useMemo(() => SHOWCASE_FUTURISTIC_FIELDS, []);
  const minimalFields = useMemo(() => SHOWCASE_MINIMAL_FIELDS, []);

  function onDemoClick(label: string) {
    showSnackbar(`${label} clicked`);
  }

  function onDemoSubmit(e: React.FormEvent) {
    e.preventDefault();
    showSnackbar('Form submitted');
  }

  function onToggleLoading() {
    setDemoLoading(true);
    window.setTimeout(() => setDemoLoading(false), 1500);
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>PTCG Elite Design System (React)</h1>
        <p className={styles.subtitle}>
          Showcase of shared React UI components and page patterns used in the ptcg-play-react frontend.
        </p>
        <Link className={styles.backLink} to="/games">
          Back to app
        </Link>
      </header>

      <nav className={styles.tabs} aria-label="Showcase sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`${styles.tab}${activeTab === tab.id ? ` ${styles.tabActive}` : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {activeTab === 'buttons' ? (
          <section className={styles.section} aria-labelledby="showcase-buttons">
            <h2 id="showcase-buttons" className={styles.sectionTitle}>
              Button components
            </h2>
            <p className={styles.sectionDesc}>
              Twinleaf design-system buttons ported from Angular, plus existing React shell buttons.
            </p>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>TwinleafPlayButton</h3>
              <p className={styles.groupDesc}>Matchmaking primary CTA with clip-path styling.</p>
              <div className={styles.row}>
                <TwinleafPlayButton
                  loading={playLoading}
                  onClick={() => {
                    setPlayLoading(true);
                    window.setTimeout(() => setPlayLoading(false), 1200);
                    onDemoClick('Play');
                  }}
                />
                <TwinleafPlayButton inQueue={inQueue} onClick={() => setInQueue((v) => !v)} />
                <TwinleafPlayButton disabled text="Disabled" />
              </div>
            </div>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>TwinleafNavButton</h3>
              <p className={styles.groupDesc}>Glassmorphism carousel controls from Angular.</p>
              <div className={styles.navDemo}>
                <TwinleafPreviousButton onClick={() => onDemoClick('Previous')} />
                <TwinleafNextButton onClick={() => onDemoClick('Next')} />
                <TwinleafNextButton disabled />
              </div>
            </div>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>TwinleafButton</h3>
              <p className={styles.groupDesc}>Green rounded action button with loading state.</p>
              <div className={styles.row}>
                <TwinleafButton text="Create deck" onClick={() => onDemoClick('Create deck')} />
                <TwinleafButton text="Save deck" color="primary" onClick={() => onDemoClick('Save deck')} />
                <TwinleafButton text="Delete deck" color="secondary" onClick={() => onDemoClick('Delete deck')} />
                <TwinleafButton text="Disabled" disabled />
                <TwinleafButton text="Loading" loading />
              </div>
            </div>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>FriendActionButton</h3>
              <p className={styles.groupDesc}>Friends list action buttons from Angular showcase.</p>
              <div className={styles.row}>
                <FriendActionButton variant="challenge" onClick={() => onDemoClick('Challenge')}>
                  Challenge
                </FriendActionButton>
                <FriendActionButton
                  variant="message"
                  aria-label="Message"
                  icon={
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  }
                  onClick={() => onDemoClick('Message')}
                />
                <FriendActionButton variant="unblock" onClick={() => onDemoClick('Unblock')}>
                  Unblock
                </FriendActionButton>
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>ShellButton</h3>
              <p className={styles.groupDesc}>React shell buttons used in the current app chrome.</p>
              <div className={styles.row}>
                <ShellButton onClick={() => onDemoClick('Primary')}>Find match</ShellButton>
                <ShellButton variant="secondary" onClick={() => onDemoClick('Secondary')}>
                  Create deck
                </ShellButton>
                <ShellButton variant="plain" onClick={() => onDemoClick('Plain')}>
                  Plain
                </ShellButton>
                <ShellButton disabled>Disabled</ShellButton>
                <ShellButton disabled={demoLoading} onClick={onToggleLoading}>
                  {demoLoading ? 'Loading…' : 'Simulate loading'}
                </ShellButton>
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>ShellButtonLink & ShellIconButton</h3>
              <div className={styles.row}>
                <ShellButtonLink to="/deck" variant="secondary">
                  Go to decks
                </ShellButtonLink>
                <ShellIconButton aria-label="Add" onClick={() => onDemoClick('Icon add')}>
                  +
                </ShellIconButton>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'forms' ? (
          <section className={styles.section} aria-labelledby="showcase-forms">
            <h2 id="showcase-forms" className={styles.sectionTitle}>
              Form components
            </h2>
            <p className={styles.sectionDesc}>Twinleaf forms from Angular plus React shell inputs and search.</p>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>TwinleafForm</h3>
              <p className={styles.groupDesc}>Config-driven forms with default, futuristic, and minimal styles.</p>
              <div className={styles.formGrid}>
                <TwinleafForm
                  fields={loginFields}
                  submitText="Login"
                  loading={formLoading}
                  onSubmit={() => {
                    setFormLoading(true);
                    window.setTimeout(() => setFormLoading(false), 1200);
                    showSnackbar('Login form submitted');
                  }}
                />
                <TwinleafForm
                  fields={futuristicFields}
                  submitText="Send request"
                  formStyle="futuristic"
                  onSubmit={() => showSnackbar('Futuristic form submitted')}
                />
                <TwinleafForm
                  fields={minimalFields}
                  submitText="Submit"
                  formStyle="minimal"
                  onSubmit={() => showSnackbar('Minimal form submitted')}
                />
              </div>
            </div>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>SearchBox</h3>
              <p className={styles.groupDesc}>Expandable search input from Angular ranking UI.</p>
              <div className={styles.row}>
                <SearchBox activated onSearch={(term) => showSnackbar(`Searching: ${term || '(empty)'}`)} />
                <SearchBox showSearchButton onSearch={(term) => showSnackbar(`Searching: ${term || '(empty)'}`)} />
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>React shell inputs</h3>
              <form className={styles.formStack} onSubmit={onDemoSubmit}>
                <TextField id="showcase-username" label="Username" placeholder="Enter username" autoComplete="username" />
                <TextField
                  id="showcase-password"
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <CheckboxField
                  id="showcase-remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Remember me
                </CheckboxField>
                <ShellButton type="submit" variant="secondary">
                  Submit
                </ShellButton>
              </form>
              <FormAlert>Invalid username or password.</FormAlert>
            </div>

            <div className={`${styles.group} ${styles.darkPanel}`}>
              <h3 className={styles.groupTitle}>FormatTabButton</h3>
              <p className={styles.groupDesc}>Angular dark-theme format tabs.</p>
              <div className={styles.formatTabsRow}>
                {MOCK_SHOWCASE_FORMAT_TABS.map((label, index) => (
                  <FormatTabButton
                    key={label}
                    active={index === activeFormatTab}
                    onClick={() => setActiveFormatTab(index)}
                  >
                    {label}
                  </FormatTabButton>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'cards' ? (
          <section className={styles.section} aria-labelledby="showcase-cards">
            <h2 id="showcase-cards" className={styles.sectionTitle}>
              Card layouts
            </h2>
            <p className={styles.sectionDesc}>Deck tiles, matchmaking format boxes, and trainer rows.</p>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>Matchmaking format cards</h3>
              <p className={styles.groupDesc}>Format selection boxes from the games lobby.</p>
              <div className={styles.formatCardsRow}>
                {MOCK_SHOWCASE_FORMATS.map((format) => (
                  <div
                    key={format.label}
                    className={`${lobbyStyles.formatBox} ${styles.formatCardFixed}`}
                    style={FORMAT_CARD_STYLE}
                    role="button"
                    tabIndex={0}
                    onClick={() => onDemoClick(format.label)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        onDemoClick(format.label);
                      }
                    }}
                  >
                    {format.queueCount > 0 ? (
                      <QueueOverlayBanner absolute>
                        {format.queueCount} players in queue
                      </QueueOverlayBanner>
                    ) : null}
                    <div className={lobbyStyles.artwork}>
                      <div className={lobbyStyles.artworkInner}>
                        <ArchetypeIcon archetypes={format.archetype} scale={2.5} />
                      </div>
                    </div>
                    <div className={lobbyStyles.info}>
                      <div className={lobbyStyles.formatName}>{format.label}</div>
                      <div className={lobbyStyles.deckName}>{format.deckName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>Deck tiles</h3>
              <p className={styles.groupDesc}>Deck grid cards with validity badge and default star.</p>
              <div className={styles.deckGrid}>
                {MOCK_SHOWCASE_DECKS.map((deck) => (
                  <div key={deck.id} className={deckStyles.tile}>
                    <div
                      className={deckStyles.card}
                      role="button"
                      tabIndex={0}
                      onClick={() => onDemoClick(deck.name)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onDemoClick(deck.name);
                        }
                      }}
                    >
                      <div className={deckStyles.status}>
                        <DeckValidityBadge valid={deck.isValid} absolute />
                        {deck.isDefault ? (
                          <div className={deckStyles.defaultWrap}>
                            <span className={deckStyles.defaultStar} title="Default deck">
                              ★
                            </span>
                            <div className={deckStyles.defaultTip}>Default deck</div>
                          </div>
                        ) : null}
                      </div>
                      <div className={deckStyles.archetype}>
                        <ArchetypeIcon archetypes={deck.archetype} scale={1.8} />
                      </div>
                      <div className={deckStyles.nameRow}>
                        <div className={deckStyles.deckName}>{deck.name}</div>
                        <button
                          type="button"
                          className={deckStyles.menuBtn}
                          aria-label="Deck menu"
                          onClick={(e) => e.stopPropagation()}
                        >
                          ⋮
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>Trainer / friend cards</h3>
              <p className={styles.groupDesc}>Friend list rows from the friends page.</p>
              <div className={friendStyles.roster}>
                {MOCK_SHOWCASE_FRIENDS.map((friend) => (
                  <div
                    key={friend.name}
                    className={`${friendStyles.trainerCard}${friend.connected ? ` ${friendStyles.trainerCardOnline}` : ''}`}
                  >
                    <div className={friendStyles.statusCol}>
                      <StatusIndicator online={friend.connected} pulse={friend.connected} />
                    </div>
                    <div className={friendStyles.avatarCol}>
                      <div className={friendStyles.avatarFrame}>
                        <Avatar alt={friend.name} hoverable />
                      </div>
                      <BattleStatusBadge variant={friend.status === 'blocked' ? 'blocked' : 'friend'}>
                        {friend.status === 'blocked' ? 'Blocked' : 'Friend'}
                      </BattleStatusBadge>
                    </div>
                    <div className={friendStyles.infoCol}>
                      <div className={friendStyles.trainerName}>{friend.name}</div>
                      <div className={friendStyles.metaRow}>
                        <span>Rank {friend.ranking}</span>
                        <span className={`${friendStyles.connection}${friend.connected ? ` ${friendStyles.connectionOn}` : ''}`}>
                          {friend.connected ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'status' ? (
          <section className={styles.section} aria-labelledby="showcase-status">
            <h2 id="showcase-status" className={styles.sectionTitle}>
              Status indicators
            </h2>
            <p className={styles.sectionDesc}>Loading spinners, queue banners, and validity badges.</p>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>LoadingSpinner</h3>
              <div className={styles.row}>
                <LoadingSpinner size={65} />
                <LoadingSpinner size={32} />
                <LoadingSpinner size={24} />
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>QueueOverlayBanner</h3>
              <div className={styles.queueSamples}>
                <QueueOverlayBanner>12 players in queue</QueueOverlayBanner>
                <QueueOverlayBanner>1 player in queue</QueueOverlayBanner>
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>DeckValidityBadge</h3>
              <div className={styles.row}>
                <DeckValidityBadge valid />
                <DeckValidityBadge valid={false} />
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>StatusIndicator</h3>
              <div className={styles.row}>
                <StatusIndicator online />
                <StatusIndicator />
                <StatusIndicator online pulse />
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>BattleStatusBadge</h3>
              <div className={styles.row}>
                <BattleStatusBadge>Friend</BattleStatusBadge>
                <BattleStatusBadge variant="blocked">Blocked</BattleStatusBadge>
                <BattleStatusBadge variant="pending">Pending</BattleStatusBadge>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'interactive' ? (
          <section className={styles.section} aria-labelledby="showcase-interactive">
            <h2 id="showcase-interactive" className={styles.sectionTitle}>
              Interactive elements
            </h2>
            <p className={styles.sectionDesc}>Archetype sprites, energy icons, and card faces.</p>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>ArchetypeIcon</h3>
              <div className={styles.archetypeRow}>
                {MOCK_SHOWCASE_ARCHETYPES.map((archetype) => (
                  <ArchetypeIcon key={archetype} archetypes={archetype} scale={2} />
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>EnergyTypeIcon</h3>
              <div className={styles.energyRow}>
                {MOCK_SHOWCASE_ENERGY_TYPES.map((type) => (
                  <EnergyTypeIcon key={type} type={type} />
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>TrainerTypeIcon</h3>
              <div className={styles.trainerTypeRow}>
                {MOCK_SHOWCASE_TRAINER_TYPES.map((type) => (
                  <TrainerTypeIcon key={type} type={type} />
                ))}
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>Avatar</h3>
              <div className={styles.row}>
                <Avatar hoverable />
                <Avatar size="profile" hoverable />
              </div>
            </div>

            <div className={styles.group}>
              <h3 className={styles.groupTitle}>CardFace</h3>
              <p className={styles.groupDesc}>Shared card image component (card back shown here).</p>
              <div className={styles.cardFaceDemo}>
                <CardFace src={publicAssetUrl('assets/cardback.png')} name="Card back" />
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'empty' ? (
          <section className={`${styles.section} ${styles.darkPanel}`} aria-labelledby="showcase-empty">
            <h2 id="showcase-empty" className={styles.sectionTitle}>
              Empty states
            </h2>
            <p className={styles.sectionDesc}>Angular empty-state patterns as reusable components.</p>

            <div className={styles.group}>
              <EmptyBattlefield />
            </div>

            <div className={styles.group}>
              <NoDecksMessage action={<TwinleafButton text="Create deck" onClick={() => onDemoClick('Create deck')} />} />
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
