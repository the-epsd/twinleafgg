const textureModules = import.meta.glob('../../assets/deck-boxes/*.png', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function labelFromPath(path: string): string {
  const file = path.split('/').pop() ?? path;
  const base = file.replace(/\.png$/i, '');
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export type DeckBoxTextureOption = {
  id: string;
  label: string;
  url: string;
};

export const DECK_BOX_TEXTURES: DeckBoxTextureOption[] = Object.entries(textureModules)
  .map(([path, url]) => {
    const file = path.split('/').pop() ?? path;
    return {
      id: file.replace(/\.png$/i, ''),
      label: labelFromPath(path),
      url,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));
