import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { GrammarLessonType, GrammarExercise } from '../types';
import { getLessonById } from '../data/grammarRegistry';
import { useAuth } from '../hooks/useAuth';

const { width } = Dimensions.get('window');

const GrammarLessonScreen = ({ navigation, route }: any) => {
  const { lessonId } = route.params;
  const lessonData = getLessonById(lessonId);

  if (!lessonData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.learnHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.learnHeaderTitle}>Lesson not found</Text>
          <View style={{width: 44}} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Sorry, this lesson is not available yet.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const [view, setView] = useState<'learn' | 'practice'>('learn');
  const [exIndex, setExIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const { updateProfile, userProfile } = useAuth();
  
  // Exercise State
  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedLeft, setSelectedLeft] = useState<string|null>(null); // For Match exercise

  const currentEx = lessonData.exercises[exIndex];

  // Scramble the right side words so they don't awkwardly align 1:1 on the UI
  const shuffledRights = useMemo(() => {
    if (!currentEx || currentEx.type !== 'match' || !currentEx.pairs) return [];
    let arr = [...currentEx.pairs.map(p => p.right)];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentEx, exIndex]);

  // Scramble the left side words as well to completely randomize the board
  const shuffledLefts = useMemo(() => {
    if (!currentEx || currentEx.type !== 'match' || !currentEx.pairs) return [];
    let arr = [...currentEx.pairs.map(p => p.left)];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentEx, exIndex]);

  // Scramble reorder words so they are presented as a puzzle
  const shuffledReorderWords = useMemo(() => {
    if (!currentEx || currentEx.type !== 'reorder' || !currentEx.words) return [];
    let arr = [...currentEx.words];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [currentEx, exIndex]);

  const handleCheck = () => {
    if (showFeedback) {
      if (exIndex < lessonData.exercises.length - 1) {
        setExIndex(exIndex + 1);
        setUserAnswer(null);
        setShowFeedback(false);
        setIsCorrect(false);
        setSelectedLeft(null);
      } else {
        setShowSummary(true);
      }
      return;
    }

    let correct = false;
    
    switch (currentEx.type) {
      case 'multiple_choice':
      case 'fill_blank':
      case 'write':
        correct = typeof userAnswer === 'string' && 
                 userAnswer.trim().toLowerCase() === (currentEx.correctAnswer as string).trim().toLowerCase();
        break;
      
      case 'reorder':
        correct = Array.isArray(userAnswer) && 
                 userAnswer.join(' ') === currentEx.correctAnswer;
        break;
        
      case 'match':
        correct = true;
        for (let pair of (currentEx.pairs || [])) {
          if (userAnswer?.[pair.left] !== pair.right) {
            correct = false;
            break;
          }
        }
        if (Object.keys(userAnswer || {}).length !== (currentEx.pairs?.length || 0)) {
           correct = false;
        }
        break;
        
      case 'table_fill':
        correct = true;
        const correctAnswers = currentEx.correctAnswers || [];
        for (let i = 0; i < correctAnswers.length; i++) {
          if (!userAnswer || userAnswer[i]?.trim().toLowerCase() !== correctAnswers[i].toLowerCase()) {
            correct = false;
            break;
          }
        }
        break;
    }

    setIsCorrect(correct);
    if (correct) setCorrectCount(prev => prev + 1);
    setShowFeedback(true);
  };

  const handleFinish = async (passed: boolean) => {
    if (passed && userProfile) {
      const currentCompleted = userProfile.grammarProgress?.completedLessons || [];
      const isNewCompletion = !currentCompleted.includes(lessonId);
      
      const allDeA1 = Array.from({length: 25}, (_, i) => `de_a1_${String(i+1).padStart(2, '0')}`);
      const currentIdx = allDeA1.indexOf(lessonId);
      const nextLessonId = allDeA1[currentIdx + 1] || lessonId;
      
      // Update if it's the first time OR if they are caught up to the currentLesson
      if (isNewCompletion || userProfile.grammarProgress?.currentLesson === lessonId) {
        const newCompleted = isNewCompletion ? [...currentCompleted, lessonId] : currentCompleted;
        
        await updateProfile({
          grammarProgress: {
            currentLesson: nextLessonId,
            lastLessonTitle: lessonData.title,
            lastActiveDate: new Date().toISOString(),
            firstTime: false,
            completedLessons: newCompleted
          }
        });
        
        setTimeout(() => {
          navigation.navigate('GrammarMap', { justCompleted: lessonId });
        }, 500);
      } else {
        navigation.navigate('GrammarMap', { justCompleted: lessonId });
      }
    } else {
      navigation.goBack();
    }
  };

  const renderLearnView = () => (
    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.lessonTitle}>{lessonData.title}</Text>
      <Text style={styles.lessonDesc}>{lessonData.description}</Text>
      
      <View style={styles.divider} />
      
      <Text style={styles.explanationText}>{lessonData.explanation}</Text>

      {/* Tables segment */}
      {lessonData.tables.map((table, tIdx) => (
        <View key={tIdx} style={styles.tableCard}>
          <Text style={styles.tableTitle}>{table.title}</Text>
          <View style={styles.tableBox}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              {table.headers.map((h, i) => (
                <Text key={i} style={[styles.tableCell, styles.tableHeaderCell]}>{h}</Text>
              ))}
            </View>
            {table.rows.map((row, rIdx) => (
              <View key={rIdx} style={[styles.tableRow, rIdx % 2 !== 0 && styles.tableRowAlt]}>
                {row.map((cell, cIdx) => (
                  <Text key={cIdx} style={styles.tableCell}>{cell}</Text>
                ))}
              </View>
            ))}
          </View>
          {table.note && <Text style={styles.tableNote}>{table.note}</Text>}
        </View>
      ))}

      {/* Deep Notes */}
      {lessonData.deep_notes.length > 0 && (
        <View style={styles.deepNotesSection}>
          <Text style={styles.sectionHeader}>Deep Dive</Text>
          {lessonData.deep_notes.map((note, nIdx) => (
             <View key={nIdx} style={styles.noteCard}>
               <View style={styles.noteIconCircle}>
                 <Ionicons name="bulb-outline" size={20} color="#E8963E" />
               </View>
               <View style={styles.noteContent}>
                 <Text style={styles.noteTitle}>{note.title}</Text>
                 <Text style={styles.noteText}>{note.text}</Text>
               </View>
             </View>
          ))}
        </View>
      )}

      {/* Examples */}
      <View style={styles.examplesSection}>
        <Text style={styles.sectionHeader}>Examples</Text>
        {lessonData.examples.map((ex, eIdx) => (
           <View key={eIdx} style={styles.exampleRow}>
             <Text style={styles.exampleGerman}>{ex.german}</Text>
             <Text style={styles.exampleEnglish}>{ex.english}</Text>
             {ex.explanation && (
               <Text style={styles.exampleExplanation}>{ex.explanation}</Text>
             )}
           </View>
        ))}
      </View>

      <TouchableOpacity style={styles.startBtn} onPress={() => setView('practice')}>
        <Text style={styles.startBtnText}>Start Practice</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPracticeView = () => {
    if (!currentEx) return null;

    let exerciseContent = null;

    if (currentEx.type === 'multiple_choice') {
      exerciseContent = (
        <View style={styles.optionsGrid}>
          {currentEx.options?.map((opt, i) => (
            <TouchableOpacity 
              key={i} 
              style={[styles.mcOption, userAnswer === opt && styles.mcOptionSelected]}
              onPress={() => !showFeedback && setUserAnswer(opt)}
            >
              <Text style={[styles.mcOptionText, userAnswer === opt && styles.mcOptionSelectedText]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    } 
    else if (currentEx.type === 'fill_blank') {
      const parts = (currentEx.text || currentEx.question || '').split('____');
      exerciseContent = (
        <View>
          <Text style={styles.fillBlankContainer}>
            <Text style={styles.exQuestionBase}>{parts[0]}</Text>
            <View style={[styles.blankBox, userAnswer && styles.blankBoxFilled]}>
               <Text style={styles.blankBoxText}>{userAnswer || '?'}</Text>
            </View>
            <Text style={styles.exQuestionBase}>{parts[1]}</Text>
          </Text>
          <View style={styles.optionsFlex}>
            {currentEx.options?.map((opt, i) => (
              <TouchableOpacity key={i} style={styles.fbOption} onPress={() => !showFeedback && setUserAnswer(opt)}>
                <Text style={styles.fbOptionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    else if (currentEx.type === 'write') {
      exerciseContent = (
        <TextInput 
          style={styles.writeInput}
          placeholder="Type your answer here..."
          value={userAnswer || ''}
          onChangeText={(txt) => !showFeedback && setUserAnswer(txt)}
          autoCapitalize="none"
          editable={!showFeedback}
        />
      );
    }
    else if (currentEx.type === 'reorder') {
      const activeAns: string[] = userAnswer || [];
      const remaining = shuffledReorderWords.filter((w, idx) => {
        // basic check to allow duplicates if they exist, but normally words are unique
        return !activeAns.includes(w) || activeAns.filter(x => x === w).length < shuffledReorderWords.filter(x => x === w).length;
      });

      exerciseContent = (
        <View style={styles.reorderContainer}>
          <View style={styles.reorderTarget}>
            {activeAns.length === 0 && <Text style={styles.reorderPlaceholder}>Tap words to form the sentence</Text>}
            {activeAns.map((w, i) => (
              <TouchableOpacity key={i} style={styles.wordChip} onPress={() => {
                if(showFeedback) return;
                const newAns = [...activeAns];
                newAns.splice(i, 1);
                setUserAnswer(newAns);
              }}>
                <Text style={styles.wordChipText}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.reorderSource}>
            {remaining.map((w, i) => (
              <TouchableOpacity key={i} style={styles.wordChipSource} onPress={() => {
                if(showFeedback) return;
                setUserAnswer([...activeAns, w]);
              }}>
                <Text style={styles.wordChipSourceText}>{w}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }
    else if (currentEx.type === 'match') {
      const ansDict = userAnswer || {};
      const lefts = shuffledLefts;
      const rights = shuffledRights;
      
      const handleLeftPress = (l: string) => { if(!showFeedback) setSelectedLeft(l); };
      const handleRightPress = (r: string) => {
        if (showFeedback || !selectedLeft) return;
        setUserAnswer({ ...ansDict, [selectedLeft]: r });
        setSelectedLeft(null);
      };

      exerciseContent = (
        <View style={styles.matchContainer}>
          <View style={styles.matchCol}>
            {lefts.map((l, i) => (
              <TouchableOpacity key={i} onPress={() => handleLeftPress(l)}
                style={[styles.matchChip, selectedLeft === l && styles.matchChipActive, ansDict[l] && styles.matchChipDone]}>
                <Text style={styles.matchChipText}>{l}</Text>
                {ansDict[l] && <Text style={styles.matchMiniText}>Linked</Text>}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.matchCol}>
            {rights.map((r, i) => {
              const matchedTo = Object.keys(ansDict).find(k => ansDict[k] === r);
              return (
                <TouchableOpacity key={i} onPress={() => handleRightPress(r)}
                  style={[styles.matchChip, matchedTo && styles.matchChipDone]}>
                  <Text style={styles.matchChipText}>{r}</Text>
                  {matchedTo && <Text style={styles.matchMiniText}>{matchedTo}</Text>}
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      );
    }
    else if (currentEx.type === 'table_fill') {
      const fillAns = userAnswer || [];
      const handleCellText = (txt: string, blankIndex: number) => {
        if(showFeedback) return;
        const newAns = [...fillAns];
        newAns[blankIndex] = txt;
        setUserAnswer(newAns);
      };

      let currentBlank = 0;
      
      exerciseContent = (
        <View style={styles.tableBox}>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            {currentEx.headers?.map((h, i) => (
              <Text key={i} style={[styles.tableCell, styles.tableHeaderCell]}>{h}</Text>
            ))}
          </View>
          {currentEx.rows?.map((row, rIdx) => (
            <View key={rIdx} style={[styles.tableRow, rIdx % 2 !== 0 && styles.tableRowAlt]}>
              {row.map((cell, cIdx) => {
                if (cell.includes('{') || cell.includes('[')) {
                  // It's a blank
                  const thisBlank = currentBlank++;
                  return (
                    <View key={cIdx} style={styles.tableCell}>
                      <TextInput 
                        style={styles.tableInput}
                        value={fillAns[thisBlank] || ''}
                        onChangeText={(t) => handleCellText(t, thisBlank)}
                        editable={!showFeedback}
                        placeholder="?"
                      />
                    </View>
                  );
                }
                return <Text key={cIdx} style={styles.tableCell}>{cell}</Text>
              })}
            </View>
          ))}
        </View>
      );
    }

    const canCheck = currentEx.type === 'match' 
      ? Object.keys(userAnswer || {}).length > 0 
      : !!userAnswer && (Array.isArray(userAnswer) ? userAnswer.length > 0 : true);

    return (
      <View style={styles.practiceScreen}>
        {/* Progress Bar */}
        <View style={styles.practiceHeader}>
           <TouchableOpacity onPress={() => setView('learn')} style={styles.backButton}>
             <Ionicons name="close" size={28} color={Colors.textSecondary} />
           </TouchableOpacity>
           <View style={styles.exProgressRail}>
             <View style={[styles.exProgressFill, { width: `${(exIndex / lessonData.exercises.length) * 100}%` }]} />
           </View>
        </View>

        <ScrollView contentContainerStyle={styles.practiceScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.exTypeLabel}>{currentEx.type.replace('_', ' ').toUpperCase()}</Text>
          <Text style={styles.exQuestionLabel}>{currentEx.question}</Text>
          
          <View style={styles.exContentWrap}>
             {exerciseContent}
          </View>

          {currentEx.hint && (
            <View style={styles.hintBox}>
              <Ionicons name="bulb" size={20} color={Colors.accent} />
              <Text style={styles.hintText}>{currentEx.hint}</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.practiceFooter}>
          {showFeedback && (
            <View style={[styles.feedbackBox, isCorrect ? styles.feedbackCorrect : styles.feedbackWrong]}>
              <Text style={[styles.feedbackTitle, isCorrect ? styles.fcText : styles.fwText]}>
                {isCorrect ? 'Correct!' : 'Review your answer:'}
              </Text>
              
              {!isCorrect && currentEx.type === 'match' ? (
                <View style={styles.matchErrorList}>
                  <Text style={styles.matchErrorHeader}>Correct Pairs:</Text>
                  {currentEx.pairs?.map((p, i) => (
                    <Text key={i} style={styles.matchErrorItem}>• {p.left} = {p.right}</Text>
                  ))}
                </View>
              ) : !isCorrect ? (
                <Text style={styles.feedbackAnswerText}>
                  {Array.isArray(currentEx.correctAnswer) ? currentEx.correctAnswer.join(' ') : currentEx.correctAnswer}
                  {currentEx.type === 'table_fill' && currentEx.correctAnswers?.join(', ')}
                </Text>
              ) : null}

              {currentEx.explanation && !currentEx.explanation.toLowerCase().includes('matching') && (
                <Text style={styles.feedbackExplanationText}>
                  {currentEx.explanation}
                </Text>
              )}
              {currentEx.explanation && currentEx.explanation.toLowerCase().includes('matching') && isCorrect && (
                <Text style={styles.feedbackExplanationText}>
                  {currentEx.explanation}
                </Text>
              )}
            </View>
          )}

          <TouchableOpacity 
            style={[styles.checkBtn, !canCheck && styles.checkBtnDisabled, showFeedback && (isCorrect ? styles.checkBtnCorrect : styles.checkBtnWrong)]} 
            disabled={!canCheck && !showFeedback}
            onPress={handleCheck}
          >
            <Text style={[styles.checkBtnText, !canCheck && styles.checkBtnTextDisabled]}>
              {showFeedback ? 'Continue' : 'Check'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderSummaryView = () => {
    const total = lessonData.exercises.length;
    const percent = Math.round((correctCount / total) * 100);
    const passed = percent >= 70;

    return (
      <View style={styles.summaryOverlay}>
        <View style={styles.summaryCard}>
          <View style={[styles.summaryIconCircle, { backgroundColor: passed ? '#EBF9F1' : '#FDECEA' }]}>
            <Ionicons name={passed ? "trophy" : "refresh"} size={44} color={passed ? Colors.accent : Colors.warning} />
          </View>
          
          <Text style={styles.summaryTitle}>{passed ? 'Lesson Passed!' : 'Almost there!'}</Text>
          <Text style={styles.summarySubtitle}>
            {passed ? "You're getting better every day." : "A bit more practice and you'll get it!"}
          </Text>

          <View style={styles.scoreRow}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreValue}>{correctCount}/{total}</Text>
              <Text style={styles.scoreLabel}>Score</Text>
            </View>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreValue}>{percent}%</Text>
              <Text style={styles.scoreLabel}>Accuracy</Text>
            </View>
          </View>

          <View style={styles.miniProgressRail}>
             <View style={[styles.miniProgressFill, { width: `${percent}%`, backgroundColor: passed ? Colors.accent : Colors.warning }]} />
          </View>

          <TouchableOpacity style={[styles.finishBtn, !passed && { backgroundColor: Colors.textMuted }]} onPress={() => handleFinish(passed)}>
            <Text style={styles.finishBtnText}>{passed ? "Finish Lesson" : "Try Again"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {view === 'learn' ? (
        <View style={styles.learnHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.learnHeaderTitle}>Grammar</Text>
          <View style={{width: 44}} />
        </View>
      ) : null}
      
      {showSummary ? renderSummaryView() : (view === 'learn' ? renderLearnView() : renderPracticeView())}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  backButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  learnHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderColor: Colors.border, paddingBottom: 10 },
  learnHeaderTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  scrollContent: { padding: Spacing.xl, paddingBottom: 100 },
  
  lessonTitle: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  lessonDesc: { fontSize: 15, color: Colors.textSecondary, marginBottom: 20 },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  explanationText: { fontSize: 16, color: Colors.textPrimary, lineHeight: 24, marginBottom: 30 },

  // Table styles
  tableCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', padding: 16, marginBottom: 30, ...Shadows.soft },
  tableTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  tableBox: { borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.surfaceLight },
  tableRowAlt: { backgroundColor: Colors.surfaceLight },
  tableHeaderRow: { backgroundColor: '#F0F5F3' },
  tableCell: { flex: 1, padding: 12, fontSize: 14, color: Colors.textPrimary },
  tableHeaderCell: { fontWeight: '700', color: Colors.primaryDark },
  tableNote: { fontSize: 13, color: Colors.textMuted, fontStyle: 'italic', marginTop: 12, lineHeight: 18 },

  // Deep Notes
  deepNotesSection: { marginBottom: 30 },
  sectionHeader: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
  noteCard: { flexDirection: 'row', backgroundColor: '#FFF8E1', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#FFE082' },
  noteIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFECB3', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  noteContent: { flex: 1 },
  noteTitle: { fontSize: 15, fontWeight: '700', color: '#E8963E', marginBottom: 4 },
  noteText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },

  // Examples
  examplesSection: { marginBottom: 40 },
  exampleRow: { borderLeftWidth: 3, borderLeftColor: Colors.primary, paddingLeft: 12, marginBottom: 16 },
  exampleGerman: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  exampleEnglish: { fontSize: 14, color: Colors.textMuted, fontStyle: 'italic', marginBottom: 4 },
  exampleExplanation: { fontSize: 13, color: Colors.textSecondary, backgroundColor: Colors.surfaceLight, padding: 8, borderRadius: 6, marginTop: 4 },

  startBtn: { backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center', ...Shadows.glow },
  startBtnText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },

  // Practice Screen
  practiceScreen: { flex: 1 },
  practiceHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  exProgressRail: { flex: 1, height: 8, backgroundColor: Colors.border, borderRadius: 4, marginHorizontal: 16, overflow: 'hidden' },
  exProgressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 4 },
  practiceScroll: { paddingHorizontal: 24, paddingBottom: 120 },
  exTypeLabel: { fontSize: 13, fontWeight: '800', color: Colors.primary, marginBottom: 16, letterSpacing: 1 },
  exQuestionLabel: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 30 },
  exContentWrap: { flex: 1 },

  // Multiple Choice
  optionsGrid: { gap: 12 },
  mcOption: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, padding: 18 },
  mcOptionSelected: { borderColor: Colors.primary, backgroundColor: '#EFFFF9' },
  mcOptionText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  mcOptionSelectedText: { color: Colors.primary, fontWeight: '700' },

  // Fill Blank
  fillBlankContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 30 },
  exQuestionBase: { fontSize: 20, color: Colors.textPrimary, lineHeight: 30 },
  blankBox: { width: 80, height: 34, borderBottomWidth: 3, borderBottomColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },
  blankBoxFilled: { borderBottomColor: 'transparent', backgroundColor: Colors.primary, borderRadius: 8 },
  blankBoxText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  optionsFlex: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  fbOption: { backgroundColor: Colors.surface, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, ...Shadows.soft },
  fbOptionText: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },

  // Write
  writeInput: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, borderRadius: 16, padding: 20, fontSize: 18, color: Colors.textPrimary },

  // Reorder
  reorderContainer: { gap: 40 },
  reorderTarget: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, minHeight: 60, borderBottomWidth: 2, borderBottomColor: Colors.border, paddingBottom: 10 },
  reorderPlaceholder: { color: Colors.textMuted, fontSize: 16, fontStyle: 'italic' },
  reorderSource: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  wordChip: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  wordChipText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  wordChipSource: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, ...Shadows.soft },
  wordChipSourceText: { color: Colors.textSecondary, fontSize: 16, fontWeight: '600' },

  // Match
  matchContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 20 },
  matchCol: { flex: 1, gap: 12 },
  matchChip: { backgroundColor: Colors.surface, borderWidth: 2, borderColor: Colors.border, borderRadius: 12, padding: 16, alignItems: 'center', minHeight: 60, justifyContent: 'center' },
  matchChipActive: { borderColor: Colors.primary, backgroundColor: '#EFFFF9' },
  matchChipDone: { opacity: 0.5, borderColor: Colors.textMuted },
  matchChipText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, textAlign: 'center' },
  matchMiniText: { fontSize: 10, color: Colors.primary, marginTop: 4 },

  // Table Fill
  tableInput: { height: 30, backgroundColor: '#fff', borderWidth: 1, borderColor: Colors.primary, borderRadius: 4, paddingHorizontal: 8, fontSize: 14, fontWeight: '700', color: Colors.textPrimary },

  practiceFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 40, paddingTop: 20, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.border },
  checkBtn: { backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.full, alignItems: 'center', justifyContent: 'center' },
  checkBtnDisabled: { backgroundColor: Colors.surfaceLight },
  checkBtnText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  checkBtnTextDisabled: { color: Colors.textMuted },
  checkBtnCorrect: { backgroundColor: Colors.accent },
  checkBtnWrong: { backgroundColor: Colors.warning },
  
  feedbackBox: { marginBottom: 20, padding: 16, borderRadius: 12 },
  feedbackCorrect: { backgroundColor: 'rgba(58,175,169,0.1)' },
  feedbackWrong: { backgroundColor: '#FDECEA', borderColor: '#F5B7B1' },
  feedbackTitle: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  fcText: { color: '#27AE60' },
  fwText: { color: '#E74C3C' },
  feedbackAnswerText: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  feedbackExplanationText: { fontSize: 14, color: Colors.textSecondary, marginTop: 8, fontStyle: 'italic', backgroundColor: 'rgba(255,255,255,0.4)', padding: 8, borderRadius: 8, fontWeight: '600' },

  matchErrorList: { marginTop: 8, padding: 8, backgroundColor: 'rgba(217, 99, 128, 0.05)', borderRadius: 10 },
  matchErrorHeader: { fontSize: 13, fontWeight: '800', color: Colors.error, marginBottom: 4, textTransform: 'uppercase' },
  matchErrorItem: { fontSize: 14, fontWeight: '600', color: Colors.error },

  hintBox: { flexDirection: 'row', backgroundColor: '#FFF0DE', padding: 12, borderRadius: 12, marginTop: 20, alignItems: 'center' },
  hintText: { flex: 1, fontSize: 14, color: Colors.textSecondary, marginLeft: 10, fontStyle: 'italic' },

  summaryOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  summaryCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 30, alignItems: 'center', ...Shadows.medium },
  summaryIconCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  summaryTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  summarySubtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  scoreRow: { flexDirection: 'row', gap: 20, marginBottom: 30 },
  scoreBox: { flex: 1, alignItems: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 16 },
  scoreValue: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  scoreLabel: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  miniProgressRail: { width: '100%', height: 12, backgroundColor: '#EEE', borderRadius: 6, marginBottom: 30, overflow: 'hidden' },
  miniProgressFill: { height: '100%', borderRadius: 6 },
  finishBtn: { backgroundColor: Colors.accent, width: '100%', height: 56, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', ...Shadows.soft },
  finishBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});

export default GrammarLessonScreen;
