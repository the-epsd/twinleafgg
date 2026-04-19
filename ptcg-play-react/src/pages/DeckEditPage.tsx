import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { DeckEditView } from '../deck-editor/DeckEditView';

export function DeckEditPage() {
  const { t } = useTranslation();
  const { deckId: deckIdParam } = useParams();
  const deckId = Number(deckIdParam);

  if (!Number.isFinite(deckId)) {
    return <p style={{ padding: 20 }}>{t('REACT_INVALID_DECK')}</p>;
  }

  return (
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <DeckEditView deckId={deckId} />
    </div>
  );
}
