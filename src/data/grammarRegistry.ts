import { GrammarLessonType } from '../types';

export const GRAMMAR_REGISTRY: Record<string, any> = {
  'de_a1_01': require('../../assets/grammar/german/a1/01_personal_pronouns.json'),
  'de_a1_02': require('../../assets/grammar/german/a1/02_verb_sein.json'),
  'de_a1_03': require('../../assets/grammar/german/a1/03_verb_haben.json'),
  'de_a1_04': require('../../assets/grammar/german/a1/04_regular_verbs.json'),
  'de_a1_05': require('../../assets/grammar/german/a1/05_definite_articles.json'),
  'de_a1_06': require('../../assets/grammar/german/a1/06_indefinite_articles.json'),
  'de_a1_07': require('../../assets/grammar/german/a1/07_plural_forms.json'),
  'de_a1_08': require('../../assets/grammar/german/a1/08_nominativ.json'),
  'de_a1_09': require('../../assets/grammar/german/a1/09_akkusativ.json'),
  'de_a1_10': require('../../assets/grammar/german/a1/10_dativ.json'),
  'de_a1_11': require('../../assets/grammar/german/a1/11_cases_comparison.json'),
  'de_a1_12': require('../../assets/grammar/german/a1/12_possessive_articles.json'),
  'de_a1_13': require('../../assets/grammar/german/a1/13_object_pronouns.json'),
  'de_a1_14': require('../../assets/grammar/german/a1/14_basic_sentence_structure.json'),
};

export const getLessonById = (id: string): GrammarLessonType | null => {
  return GRAMMAR_REGISTRY[id] || null;
};
