import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Animated, Easing, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { useAuth } from '../hooks/useAuth';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const { width } = Dimensions.get('window');

const LESSONS = [
  { id: 'de_a1_01', level: 'A1', title: 'Personal Pronouns', isMock: false },
  { id: 'de_a1_02', level: 'A1', title: 'The Verb "sein"', isMock: false },
  { id: 'de_a1_03', level: 'A1', title: 'The Verb "haben"', isMock: false },
  { id: 'de_a1_04', level: 'A1', title: 'Regular Verb Conjugation', isMock: false },
  { id: 'de_a1_05', level: 'A1', title: 'Definite Articles', isMock: false },
  { id: 'de_a1_06', level: 'A1', title: 'Indefinite Articles', isMock: false },
  { id: 'de_a1_07', level: 'A1', title: 'Plural Forms', isMock: false },
  { id: 'de_a1_08', level: 'A1', title: 'Nominativ', isMock: false },
  { id: 'de_a1_09', level: 'A1', title: 'Akkusativ', isMock: false },
  { id: 'de_a1_10', level: 'A1', title: 'Dativ', isMock: false },
  { id: 'de_a1_11', level: 'A1', title: 'Cases Comparison', isMock: true },
  { id: 'de_a1_12', level: 'A1', title: 'Basic Sentence Structure', isMock: true },
  { id: 'de_a1_13', level: 'A1', title: 'Negation', isMock: true },
  { id: 'de_a1_14', level: 'A1', title: 'Question Formation', isMock: true },
  { id: 'de_a1_15', level: 'A1', title: 'Modal Verbs', isMock: true },
  { id: 'de_a1_16', level: 'A1', title: 'Separable Verbs', isMock: true },
  { id: 'de_a1_17', level: 'A1', title: 'Irregular Verbs', isMock: true },
  { id: 'de_a1_18', level: 'A1', title: 'Basic Adjectives', isMock: true },
  { id: 'de_a1_19', level: 'A1', title: 'Adjective Endings', isMock: true },
  { id: 'de_a1_20', level: 'A1', title: 'Accusative Prepositions', isMock: true },
  { id: 'de_a1_21', level: 'A1', title: 'Dative Prepositions', isMock: true },
  { id: 'de_a1_22', level: 'A1', title: 'Numbers & Time', isMock: true },
  { id: 'de_a1_23', level: 'A1', title: 'Telling Time', isMock: true },
  { id: 'de_a1_24', level: 'A1', title: 'Greetings', isMock: true },
  { id: 'de_a1_25', level: 'A1', title: 'Practical Language', isMock: true },
];

const HILLS = [
  { id: 'h1', width: 800, height: 600, top: -50, left: -200, color: '#AEE896' },
  { id: 'h2', width: 900, height: 700, top: 250, right: -300, color: '#A0E386' },
  { id: 'h3', width: 1000, height: 800, top: 600, left: -400, color: '#97DB7D' },
  { id: 'h4', width: 800, height: 600, top: 1000, right: -250, color: '#AEE896' },
];

const GrammarMapScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { userProfile } = useAuth();
  
  const reversedLessons = useMemo(() => [...LESSONS].reverse(), []);
  const totalLessonsCount = LESSONS.length;

  const progress = useMemo(() => userProfile?.grammarProgress || {
    currentLesson: 'de_a1_01',
    lastLessonTitle: 'Personal Pronouns',
    lastActiveDate: new Date().toISOString(),
    firstTime: true,
    completedLessons: [] as string[],
  }, [userProfile]);

  const justCompleted = route.params?.justCompleted;
  const currentLessonIndex = LESSONS.findIndex(l => l.id === progress.currentLesson) || 0;
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pathAnim = useRef(new Animated.Value(0)).current; 
  const barAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);

  const totalA1 = LESSONS.filter(l => l.level === 'A1').length;
  const completedA1 = progress.completedLessons.length;
  const targetProgress = (completedA1 / totalA1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    Animated.timing(barAnim, {
      toValue: targetProgress,
      duration: 1500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false
    }).start();

    if (justCompleted) {
       pathAnim.setValue(0);
       Animated.timing(pathAnim, {
         toValue: 1, duration: 2500, easing: Easing.out(Easing.cubic), useNativeDriver: false
       }).start();
    }
  }, [justCompleted, targetProgress]);

  const handleNodePress = (lesson: any, status: 'completed' | 'current' | 'locked') => {
    if (status === 'locked' && !isDemoMode) {
      Alert.alert('Locked', 'Complete the previous lesson to unlock this one!');
    } else {
      if (lesson.isMock) {
        Alert.alert('Coming Soon', 'This lesson is being built right now!');
        return;
      }
      navigation.navigate('GrammarLesson', { lessonId: lesson.id });
    }
  };

  const handleBannerPress = () => {
    const current = LESSONS.find(l => l.id === progress.currentLesson);
    if (!current?.isMock) {
      navigation.navigate('GrammarLesson', { lessonId: progress.currentLesson });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBannerWrap}>
        <View style={styles.headerRow}>
           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
             <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
           </TouchableOpacity>
           <Text 
             style={styles.headerTitle} 
             onLongPress={() => {
               setIsDemoMode(!isDemoMode);
               Alert.alert('Demo Mode', !isDemoMode ? 'Enabled! All built lessons are now unlocked.' : 'Disabled.');
             }}
           >
             Grammar Journey {isDemoMode ? '🛠️' : ''}
           </Text>
           <View style={{width: 44}} />
        </View>

        <TouchableOpacity style={styles.bannerCard} activeOpacity={0.9} onPress={handleBannerPress}>
           <View style={styles.bannerInfo}>
             <View style={styles.bannerLabelRow}>
               <Text style={styles.bannerLevelText}>{LESSONS[currentLessonIndex]?.level || 'A1'}</Text>
               <Animated.Text style={styles.bannerProgressText}>
                 {Math.round(completedA1 / totalA1 * 100)}% COMPLETE
               </Animated.Text>
             </View>
             <Text style={styles.bannerLessonText}>Lesson {currentLessonIndex + 1} — {LESSONS[currentLessonIndex]?.title}</Text>
             
             <View style={styles.overallProgressRail}>
               <Animated.View style={[styles.overallProgressFill, { 
                 width: barAnim.interpolate({
                   inputRange: [0, 1],
                   outputRange: ['0%', '100%']
                 })
               }]} />
             </View>
           </View>
           <View style={styles.bannerPlayBtn}>
             <Ionicons name="play" size={20} color={Colors.primary} />
           </View>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView 
        ref={scrollRef as any}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        <View style={styles.mapContainer}>
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
             {HILLS.map((hill) => (
               <View key={hill.id} style={{
                 position: 'absolute',
                 top: hill.top,
                 left: hill.left,
                 right: hill.right,
                 width: hill.width,
                 height: hill.height,
                 borderRadius: hill.width / 2,
                 backgroundColor: hill.color,
               }} />
             ))}
          </View>

          {reversedLessons.map((lesson, index) => {
              const realIdx = totalLessonsCount - 1 - index;
              let status: 'completed' | 'current' | 'locked' = 'locked';
              if (progress.completedLessons.includes(lesson.id)) status = 'completed';
              else if (lesson.id === progress.currentLesson) status = 'current';

              const isLeft = realIdx % 2 === 0;
              const isPathToFinished = justCompleted && reversedLessons[index + 1]?.id === justCompleted;

              const xLeft = width * 0.15 + 35;
              const xRight = width - (width * 0.15 + 35);
              const currentX = isLeft ? xLeft : xRight;
              const prevX = isLeft ? xRight : xLeft;

              const wOffset = Math.abs(prevX - currentX);
              const hOffset = 140;
              const chord = Math.sqrt(wOffset * wOffset + hOffset * hOffset);
              const pathLen = (hOffset + wOffset + chord) / 2;

              return (
                <View key={lesson.id} style={styles.nodeRow}>
                  {realIdx > 0 && (
                    <View style={{ position: 'absolute', top: 70, left: 0, width: width, height: 140, zIndex: 1 }}>
                      <Svg width="100%" height="100%">
                        <Path 
                          d={`M ${prevX} 140 C ${prevX} 70, ${currentX} 70, ${currentX} 0`}
                          fill="none"
                          stroke={status === 'completed' ? '#81C965' : '#C3EBAF'}
                          strokeWidth={16}
                          strokeLinecap="round"
                        />
                        {isPathToFinished && (
                          <AnimatedPath
                            d={`M ${prevX} 140 C ${prevX} 70, ${currentX} 70, ${currentX} 0`}
                            fill="none"
                            stroke="#F4B76B"
                            strokeWidth={16}
                            strokeLinecap="round"
                            strokeDasharray={pathLen}
                            strokeDashoffset={pathAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [pathLen, 0]
                            })}
                          />
                        )}
                      </Svg>
                    </View>
                  )}

                 <Text style={[styles.natureEmoji, { top: 10, [isLeft ? 'right' : 'left']: width * 0.1 }]}>
                   {['🌲', '🌳', '🍄', '🌿', '🌲', '🪴'][realIdx % 6]}
                 </Text>
                 <Text style={[styles.natureEmoji, { bottom: -10, [isLeft ? 'left' : 'right']: width * 0.05, opacity: 0.9 }]}>
                   {['🍄', '🌲', '🌳', '🌿', '🌳', '🪴'][realIdx % 6]}
                 </Text>

                 <View style={[styles.nodeWrapper, isLeft ? styles.nodeLeft : styles.nodeRight]}>
                    {status === 'current' && (
                      <View style={styles.currentLabelBubble}>
                        <Text style={styles.currentLabelText}>Start here 🚀</Text>
                        <View style={styles.currentLabelTail} />
                      </View>
                    )}

                    {status === 'current' && (
                      <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
                    )}

                    <TouchableOpacity 
                      activeOpacity={0.8}
                      onPress={() => handleNodePress(lesson, status)}
                      style={[
                        styles.nodeCircle,
                        status === 'completed' && styles.nodeCompleted,
                        status === 'current' && styles.nodeCurrent,
                        status === 'locked' && styles.nodeLocked,
                        status === 'current' ? { transform: [{ scale: 1.1 }] } : {}
                      ]}
                    >
                      {status === 'completed' && <Ionicons name="checkmark-sharp" size={32} color="#FFF" />}
                      {status === 'current' && <Ionicons name="star" size={30} color="#FFF" />}
                      {status === 'locked' && <Ionicons name="lock-closed" size={24} color={Colors.textMuted} />}
                    </TouchableOpacity>

                    <View style={styles.nodeTextWrap}>
                      <Text style={[
                        styles.nodeLevelLabel,
                        status === 'current' && { color: Colors.accent }
                      ]}>Unit {realIdx + 1}</Text>
                      <Text style={[styles.nodeTitle, status === 'locked' && { color: Colors.textMuted }]}>
                        {lesson.title}
                      </Text>
                    </View>
                 </View>
                </View>
              )
          })}
          
          <View style={styles.startBase}>
             <Ionicons name="flag" size={24} color={Colors.primary} />
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#B5ED9F' },
  topBannerWrap: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  bannerCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...Shadows.medium },
  bannerInfo: { flex: 1 },
  bannerLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  bannerLevelText: { fontSize: 13, fontWeight: '800', color: Colors.accent, textTransform: 'uppercase', letterSpacing: 1 },
  bannerProgressText: { fontSize: 11, fontWeight: '800', color: Colors.textMuted },
  bannerLessonText: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  overallProgressRail: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4, overflow: 'hidden' },
  overallProgressFill: { height: '100%', backgroundColor: Colors.accent, borderRadius: 4 },
  bannerPlayBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF0DE', alignItems: 'center', justifyContent: 'center', marginLeft: 16 },
  scrollContent: { paddingVertical: 40, alignItems: 'center' },
  mapContainer: { width: '100%', alignItems: 'center', paddingBottom: 60 },
  nodeRow: { height: 140, width: '100%', justifyContent: 'center' },
  nodeWrapper: { position: 'absolute', alignItems: 'center', width: 140, zIndex: 10 },
  nodeLeft: { left: width * 0.15 },
  nodeRight: { right: width * 0.15 },
  nodeCircle: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFFFFF', zIndex: 10, ...Shadows.glow },
  nodeCompleted: { backgroundColor: '#FFB800' },
  nodeCurrent: { backgroundColor: Colors.accent },
  nodeLocked: { backgroundColor: '#FFFFFF', borderColor: '#E8E8E8', elevation: 0 },
  pulseRing: { position: 'absolute', top: -10, left: -10, right: -10, bottom: -10, borderRadius: 50, backgroundColor: 'rgba(232, 150, 62, 0.4)', zIndex: 5 },
  nodeTextWrap: { alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, ...Shadows.soft },
  nodeLevelLabel: { fontSize: 11, fontWeight: '800', color: Colors.primaryDark },
  nodeTitle: { fontSize: 12, fontWeight: '600', color: Colors.textPrimary, textAlign: 'center' },
  currentLabelBubble: { position: 'absolute', top: -45, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, ...Shadows.soft, zIndex: 20 },
  currentLabelText: { fontSize: 13, fontWeight: '800', color: Colors.primary },
  currentLabelTail: { position: 'absolute', bottom: -6, left: '50%', marginLeft: -6, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderStyle: 'solid', backgroundColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#FFFFFF' },
  startBase: { marginTop: 40, width: 60, height: 60, borderRadius: 30, backgroundColor: '#8DBE74', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#FFFFFF', ...Shadows.medium },
  natureEmoji: { position: 'absolute', fontSize: 32, zIndex: 0, textShadowColor: 'rgba(0,0,0,0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 2 }
});

export default GrammarMapScreen;
