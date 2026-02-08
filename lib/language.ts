import { franc } from 'franc-min';
import langs from 'langs';

export function detectLanguage(text: string) {
  const code = franc(text ?? '', { minLength: 12 });
  if (code === 'und') return null;
  const language = langs.where('3', code);
  return language?.name ?? null;
}
