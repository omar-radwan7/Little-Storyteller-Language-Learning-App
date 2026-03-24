import { GrammarLessonType } from '../types';

export const GRAMMAR_REGISTRY: Record<string, any> = {
  // A1.1 - The Foundation & Pronunciation
  'de_a1_01': require('../../assets/grammar/german/a1/p1_alphabet.json'),
  'de_a1_02': require('../../assets/grammar/german/a1/p2_vowels.json'),
  'de_a1_03': require('../../assets/grammar/german/a1/p3_silent.json'),
  'de_a1_04': require('../../assets/grammar/german/a1/p4_umlauts.json'),
  'de_a1_05': require('../../assets/grammar/german/a1/01_personal_pronouns.json'),
  'de_a1_06': require('../../assets/grammar/german/a1/02_verb_sein.json'),
  'de_a1_07': require('../../assets/grammar/german/a1/03_verb_haben.json'),
  'de_a1_08': require('../../assets/grammar/german/a1/04_regular_verbs.json'),
  'de_a1_09': require('../../assets/grammar/german/a1/05_definite_articles.json'),
  'de_a1_10': require('../../assets/grammar/german/a1/06_indefinite_articles.json'),
  'de_a1_11': require('../../assets/grammar/german/a1/07_plural_forms.json'),
  'de_a1_12': require('../../assets/grammar/german/a1/08_nominativ.json'),
  'de_a1_13': require('../../assets/grammar/german/a1/09_akkusativ.json'),
  'de_a1_14': require('../../assets/grammar/german/a1/10_dativ.json'),

  // A1.2 - Grammar & Expressions
  'de_a1_15': require('../../assets/grammar/german/a1/11_cases_comparison.json'),
  'de_a1_16': require('../../assets/grammar/german/a1/14_basic_sentence_structure.json'),
  'de_a1_17': require('../../assets/grammar/german/a1/15_negation.json'),
  'de_a1_18': require('../../assets/grammar/german/a1/16_questions.json'),
  'de_a1_19': require('../../assets/grammar/german/a1/17_modal_verbs.json'),
  'de_a1_20': require('../../assets/grammar/german/a1/21_separable_verbs.json'),
  'de_a1_21': require('../../assets/grammar/german/a1/22_irregular_verbs.json'),
  'de_a1_22': require('../../assets/grammar/german/a1/25_adjectives.json'),
  'de_a1_23': require('../../assets/grammar/german/a1/26_adjective_endings.json'),
  'de_a1_24': require('../../assets/grammar/german/a1/23_acc_prepositions.json'),
  'de_a1_25': require('../../assets/grammar/german/a1/24_dat_prepositions.json'),
  'de_a1_26': require('../../assets/grammar/german/a1/01_numbers_time.json'),
  'de_a1_27': require('../../assets/grammar/german/a1/00_greetings.json'),
  'de_a1_28': require('../../assets/grammar/german/a1/28_phrases.json'),
};

export const getLessonById = (id: string): GrammarLessonType | null => {
  return GRAMMAR_REGISTRY[id] || null;
};
