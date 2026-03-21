import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Modal,
  Switch,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { LANGUAGES } from '../data/constants';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Pure JS translation using free MyMemory API (no API key needed, 5000 chars/day free)
const translateText = async (text: string, from: string, to: string): Promise<string> => {
  // Use MyMemory free translation API — no key, no signup, works everywhere
  try {
    const langPair = `${from}|${to}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    throw new Error('API returned no result');
  } catch (err) {
    // Final fallback: return the original text with a note
    return `${text} → [${to.toUpperCase()}]`;
  }
};

const VocabularyScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [mode, setMode] = useState<'translator' | 'list'>('translator');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [lastInputText, setLastInputText] = useState(''); // Store last input for saving after clear
  const [isTranslating, setIsTranslating] = useState(false);
  const [fromLang, setFromLang] = useState({ name: 'English', code: 'en', flag: '🇺🇸' });
  const [toLang, setToLang] = useState({ name: 'Spanish', code: 'es', flag: '🇪🇸' });
  
  const [savedWords, setSavedWords] = useState<any[]>([]);
  
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState<'from' | 'to'>('from');

  const switchMode = (newMode: 'translator' | 'list') => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMode(newMode);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    
    try {
      const sourceCode = fromLang.code === 'detect' ? 'en' : fromLang.code;
      const result = await translateText(inputText.trim(), sourceCode, toLang.code);
      setTranslatedText(result);
      setLastInputText(inputText.trim()); // Save for future bookmarking
      setInputText(''); // Auto-clear input after translation
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Translation error:', error);
      setTranslatedText(`${inputText} → [${toLang.code.toUpperCase()}]`);
      setLastInputText(inputText);
      setInputText('');
    } finally {
      setIsTranslating(false);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  };

  const handleSaveWord = () => {
    if (!lastInputText || !translatedText) return;
    if (savedWords.some(w => w.word === lastInputText)) return;
    const newWord = {
      id: Date.now().toString(),
      word: lastInputText,
      translation: translatedText,
      from: fromLang.name,
      to: toLang.name,
    };
    setSavedWords([newWord, ...savedWords]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const deleteWord = (id: string) => {
    setSavedWords(savedWords.filter(w => w.id !== id));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Vocabulary</Text>
          <Text style={styles.headerSub}>Learn & Translate</Text>
        </View>
        <View style={styles.countBadge}>
          <Ionicons name="bookmark" size={14} color={Colors.accent} />
          <Text style={styles.countText}>{savedWords.length}</Text>
        </View>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          onPress={() => switchMode('translator')}
          style={[styles.modeBtn, mode === 'translator' && styles.modeBtnActive]}
        >
          <Ionicons name="language" size={16} color={mode === 'translator' ? Colors.textInverse : Colors.textMuted} />
          <Text style={[styles.modeBtnText, mode === 'translator' && styles.modeBtnTextActive]}>Translator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchMode('list')}
          style={[styles.modeBtn, mode === 'list' && styles.modeBtnActive]}
        >
          <Ionicons name="list" size={16} color={mode === 'list' ? Colors.textInverse : Colors.textMuted} />
          <Text style={[styles.modeBtnText, mode === 'list' && styles.modeBtnTextActive]}>My List</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {mode === 'translator' ? (
          <View>
            {/* Language Row */}
            <View style={styles.langRow}>
              <TouchableOpacity style={styles.langPickerBtn} onPress={() => { setPickerType('from'); setIsPickerVisible(true); }}>
                <Text style={styles.langFlag}>{fromLang.flag || '🌐'}</Text>
                <Text style={styles.langName}>{fromLang.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.swapBtn}><Ionicons name="swap-horizontal" size={20} color={Colors.primary} /></TouchableOpacity>
              <TouchableOpacity style={styles.langPickerBtn} onPress={() => { setPickerType('to'); setIsPickerVisible(true); }}>
                <Text style={styles.langFlag}>{toLang.flag || '🌐'}</Text>
                <Text style={styles.langName}>{toLang.name}</Text>
              </TouchableOpacity>
            </View>

            {/* Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter text to translate..."
                  placeholderTextColor={Colors.textMuted}
                  multiline
                  value={inputText}
                  onChangeText={setInputText}
                />
                {inputText.length > 0 && (
                  <TouchableOpacity 
                    style={styles.clearInputBtn} 
                    onPress={() => setInputText('')}
                  >
                    <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputActionRow}>
                <View style={styles.inputLeftActions}>
                  <TouchableOpacity style={styles.iconCircle}><Ionicons name="mic-outline" size={20} color={Colors.textSecondary} /></TouchableOpacity>
                  <TouchableOpacity style={styles.iconCircle}><Ionicons name="volume-medium-outline" size={20} color={Colors.textSecondary} /></TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.translateBtn, !inputText.trim() && styles.translateBtnDisabled]} onPress={handleTranslate} disabled={!inputText.trim() || isTranslating}>
                  <Text style={styles.translateBtnText}>{isTranslating ? '...' : 'Translate'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Output Area */}
            {translatedText && (
              <View style={styles.outputCard}>
                <Text style={styles.targetLangLabel}>{toLang.name}</Text>
                <Text style={styles.translatedValue}>{translatedText}</Text>
                <View style={styles.bottomActions}>
                  <TouchableOpacity style={styles.actionIcon}><Ionicons name="share-outline" size={20} color={Colors.textMuted} /></TouchableOpacity>
                  <TouchableOpacity style={styles.actionIcon} onPress={handleSaveWord}>
                    <Ionicons name={savedWords.some(w => w.word === lastInputText) ? "bookmark" : "bookmark-outline"} size={20} color={savedWords.some(w => w.word === lastInputText) ? Colors.accent : Colors.textMuted} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionIcon}><Ionicons name="copy-outline" size={20} color={Colors.textMuted} /></TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.listSection}>
            {savedWords.length > 0 ? (
              savedWords.map((item) => (
                <View key={item.id} style={styles.vocabItem}>
                  <View style={styles.vocabInfo}>
                    <Text style={styles.vocabWord}>{item.word}</Text>
                    <Text style={styles.vocabTrans}>{item.translation}</Text>
                    <Text style={styles.vocabLangs}>{item.from} → {item.to}</Text>
                  </View>
                  <TouchableOpacity onPress={() => deleteWord(item.id)}>
                    <Ionicons name="trash-outline" size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
               <View style={styles.emptyRecent}>
                  <Ionicons name="time-outline" size={40} color={Colors.border} />
                  <Text style={styles.emptyText}>No saved words yet</Text>
               </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Language Picker Modal code here... (Same logic) */}
      <Modal visible={isPickerVisible} animationType="slide">
          <View style={styles.modalContainer}>
             <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setIsPickerVisible(false)}><Ionicons name="close" size={28} color={Colors.textPrimary} /></TouchableOpacity>
                <Text style={styles.modalTitle}>Select Language</Text>
                <View style={{ width: 28 }} />
             </View>
             <ScrollView style={{ flex: 1 }}>
                {LANGUAGES.map(lang => (
                  <TouchableOpacity key={lang.code} style={styles.langListItem} onPress={() => { pickerType === 'from' ? setFromLang(lang) : setToLang(lang); setIsPickerVisible(false); }}>
                     <Text style={styles.listItemFlag}>{lang.flag}</Text>
                     <Text style={styles.langListItemName}>{lang.name}</Text>
                  </TouchableOpacity>
                ))}
             </ScrollView>
          </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 0, paddingTop: 52, paddingBottom: 16,
  },
  headerTitle: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.accentMuted, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  countText: { fontSize: 14, fontWeight: '800', color: Colors.accent },

  modeToggle: {
    flexDirection: 'row', marginBottom: 20, marginHorizontal: 0,
    backgroundColor: Colors.surface, borderRadius: 12, padding: 4,
    ...Shadows.soft,
  },
  modeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 10, borderRadius: 8,
  },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
  modeBtnTextActive: { color: '#FFFFFF' },

  langRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  langPickerBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 25, ...Shadows.soft,
  },
  langFlag: { fontSize: 20, marginRight: 8 },
  langName: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  swapBtn: { width: 40, alignItems: 'center' },

  inputCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, ...Shadows.medium, minHeight: 180 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  textInput: { flex: 1, fontSize: 18, color: Colors.textPrimary, minHeight: 80, textAlignVertical: 'top' },
  clearInputBtn: { padding: 4, marginLeft: 8 },
  inputActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  inputLeftActions: { flexDirection: 'row', gap: 16 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  translateBtn: { backgroundColor: '#E8963E', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  translateBtnDisabled: { opacity: 0.5 },
  translateBtnText: { color: '#FFFFFF', fontWeight: '800' },

  outputCard: { marginTop: 20, backgroundColor: Colors.surface, borderRadius: 20, padding: 20, ...Shadows.soft },
  targetLangLabel: { fontSize: 12, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  translatedValue: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  bottomActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 12, gap: 16 },
  actionIcon: { padding: 4 },

  listSection: { marginTop: 0 },
  vocabItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 10, ...Shadows.soft,
  },
  vocabInfo: { flex: 1 },
  vocabWord: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  vocabTrans: { fontSize: 15, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  vocabLangs: { fontSize: 10, color: Colors.textMuted, marginTop: 4, textTransform: 'uppercase' },

  emptyRecent: { height: 200, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: Colors.textMuted, marginTop: 12 },

  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  langListItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  listItemFlag: { fontSize: 24, marginRight: 16 },
  langListItemName: { fontSize: 18, fontWeight: '600' },
});

export default VocabularyScreen;
