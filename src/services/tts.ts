import * as Speech from 'expo-speech';

// Language mapping as requested
const langMap: Record<string, string> = {
  german: 'de-DE',
  french: 'fr-FR',
  spanish: 'es-ES',
  italian: 'it-IT',
  portuguese: 'pt-PT',
  english: 'en-US'
};

export const speak = (text: string, language: string = 'german', rate: number = 0.45) => {
  const code = langMap[language.toLowerCase()] || 'de-DE';
  console.log(`[TTS] Speaking: "${text}" in ${code} at rate ${rate}`);
  Speech.speak(text, {
    language: code,
    rate: rate,
    pitch: 1.0,
  });
};

export const stopSpeaking = () => {
  Speech.stop();
};

export default {
  speak,
  stopSpeaking
};
