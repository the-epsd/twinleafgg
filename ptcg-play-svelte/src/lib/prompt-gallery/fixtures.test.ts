import { describe, expect, it } from 'vitest';
import {
  attachPromptDemo,
  boardPromptDemos,
  dockPromptDemos,
  PROMPT_GALLERY_CLASS_NAMES,
  unsupportedPromptDemos,
} from './fixtures';

describe('prompt gallery fixtures', () => {
  it('represents every known prompt class in the gallery', () => {
    const represented = new Set([
      ...dockPromptDemos.map((demo) => demo.prompt.className),
      attachPromptDemo.prompt.className,
      ...boardPromptDemos.map((demo) => demo.prompt.className),
      ...unsupportedPromptDemos.map((demo) => demo.prompt.className),
    ]);

    expect([...PROMPT_GALLERY_CLASS_NAMES].filter((className) => !represented.has(className))).toEqual([]);
  });
});
