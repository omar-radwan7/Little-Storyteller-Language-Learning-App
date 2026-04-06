import * as Speech from 'expo-speech';

const langMap: Record<string, string> = {
  german: 'de-DE',
  french: 'fr-FR',
  spanish: 'es-ES',
  italian: 'it-IT',
  portuguese: 'pt-PT',
  english: 'en-US'
};

// Check available voices on startup
export const checkAvailableVoices = async () => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    console.log('[TTS] Available voices:', JSON.stringify(voices, null, 2));
    console.log('[TTS] Total voices found:', voices.length);
    if (voices.length === 0) {
      console.warn('[TTS] No voices found — TTS engine may not be installed on this device/emulator');
    }
    return voices;
  } catch (error) {
    console.error('[TTS] Error checking voices:', error);
    return [];
  }
};

// Check if TTS is speaking
export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch (error) {
    console.error('[TTS] Error checking speaking state:', error);
    return false;
  }
};

export const speak = async (
  text: string,
  language: string = 'german',
  rate: number = 0.45,
  slow: boolean = false
) => {
  try {
    // Stop any current speech first
    await Speech.stop();

    const code = langMap[language.toLowerCase()] || 'de-DE';
    const finalRate = slow ? 0.3 : rate;

    console.log(`[TTS] Speaking: "${text}" in ${code} at rate ${finalRate}`);

    // First try with full options
    Speech.speak(text, {
      language: code,
      rate: finalRate,
      pitch: 1.0,
      onStart: () => console.log('[TTS] Started speaking'),
      onDone: () => console.log('[TTS] Finished speaking'),
      onStopped: () => console.log('[TTS] Stopped speaking'),
      onError: (error) => {
        console.error('[TTS] Error with full options:', error);
        // Fallback 1 — try without rate and pitch
        console.log('[TTS] Trying fallback 1 — no rate/pitch');
        Speech.speak(text, {
          language: code,
          onError: (err2) => {
            console.error('[TTS] Error with fallback 1:', err2);
            // Fallback 2 — try English
            console.log('[TTS] Trying fallback 2 — English');
            Speech.speak(text, {
              language: 'en-US',
              onError: (err3) => {
                console.error('[TTS] All fallbacks failed:', err3);
              }
            });
          }
        });
      }
    });

  } catch (error) {
    console.error('[TTS] Unexpected error:', error);
  }
};

export const speakSlow = async (text: string, language: string = 'german') => {
  await speak(text, language, 0.3, true);
};

export const stopSpeaking = async () => {
  try {
    await Speech.stop();
    console.log('[TTS] Stopped');
  } catch (error) {
    console.error('[TTS] Error stopping:', error);
  }
};

export const testTTS = async () => {
  console.log('[TTS] Running diagnostics...');
  
  // Step 1 — check voices
  const voices = await checkAvailableVoices();
  
  // Step 2 — test English first
  console.log('[TTS] Testing English...');
  Speech.speak('Hello this is a test', {
    language: 'en-US',
    onStart: () => console.log('[TTS] English test started'),
    onDone: () => {
      console.log('[TTS] English test done');
      // Step 3 — test German
      console.log('[TTS] Testing German...');
      Speech.speak('Hallo das ist ein Test', {
        language: 'de-DE',
        onStart: () => console.log('[TTS] German test started'),
        onDone: () => console.log('[TTS] German test done — TTS fully working'),
        onError: (e) => console.error('[TTS] German failed:', e)
      });
    },
    onError: (e) => console.error('[TTS] English failed — TTS engine not working:', e)
  });
};

export default {
  speak,
  speakSlow,
  stopSpeaking,
  isSpeaking,
  checkAvailableVoices,
  testTTS
};