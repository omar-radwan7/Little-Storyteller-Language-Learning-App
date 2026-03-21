import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { LANGUAGES, LEVELS, DAILY_GOALS } from '../data/constants';
import { useAuth } from '../hooks/useAuth';

const APP_GREEN = Colors.primary;
const APP_LIME = '#D4E157';

const PreferencePickerScreen: React.FC<any> = ({ navigation, route }) => {
  const { type } = route.params; // 'language' | 'level' | 'dailyGoal'
  const { userProfile, updateProfile } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [pendingVal, setPendingVal] = React.useState<any>(null);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const isLanguage = type === 'language';
  const isGoal = type === 'dailyGoal';
  
  const data = isLanguage ? LANGUAGES : isGoal ? DAILY_GOALS : LEVELS;
  const currentVal = isLanguage ? userProfile?.targetLanguage : isGoal ? userProfile?.dailyGoal : userProfile?.level;

  const getTitle = () => {
    if (isLanguage) return 'I want to learn';
    if (isGoal) return 'My daily goal';
    return 'My current level';
  };

  const handleSelect = async (val: any): Promise<void> => {
    if (isLanguage) {
      await updateProfile({ targetLanguage: val });
    } else if (isGoal) {
      await updateProfile({ dailyGoal: val });
    } else {
      // Level change - show warning
      if (val === userProfile?.level) {
        navigation.goBack();
        return;
      }

      setPendingVal(val);
      setModalVisible(true);
      return;
    }
    navigation.goBack();
  };

  const confirmLevelChange = async () => {
    if (!pendingVal) return;
    setIsUpdating(true);
    try {
      await updateProfile({ level: pendingVal });
      setModalVisible(false);
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to update level.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{getTitle()}</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.progressRail}>
           <View style={[styles.progressFill, { width: '80%' }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.list}>
            {data.map((item: any) => {
              const code = isLanguage ? item.code : isGoal ? item.count : item.code;
              const selected = currentVal === code;
              
              return (
                <TouchableOpacity
                  key={code.toString()}
                  onPress={() => handleSelect(code)}
                  style={[styles.pill, selected && styles.pillSelected]}
                  activeOpacity={0.8}
                >
                  <View style={styles.pillInner}>
                    <View style={styles.iconCircle}>
                      {isLanguage ? (
                        <Text style={styles.flag}>{item.flag}</Text>
                      ) : isGoal ? (
                        <Text style={styles.flag}>🎯</Text>
                      ) : (
                        <Text style={styles.levelCode}>{item.code}</Text>
                      )}
                    </View>
                    <View style={styles.textGroup}>
                      <Text style={styles.name}>{isGoal ? item.label : item.name}</Text>
                      {!isLanguage && (
                         <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                      )}
                    </View>
                  </View>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={24} color={APP_LIME} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Custom Confirmation Modal */}
      {modalVisible && (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalIconWrap}>
                 <Ionicons name="alert-circle" size={40} color={Colors.warning} />
              </View>
              <Text style={styles.modalTitle}>Change Level?</Text>
              <Text style={styles.modalDesc}>
                You haven't finished your current level yet. Are you sure you want to move on?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalCancel} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalCancelText}>Go Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirm} 
                  onPress={confirmLevelChange}
                  disabled={isUpdating}
                >
                  <Text style={styles.modalConfirmText}>
                    {isUpdating ? 'Updating...' : 'Yes, Change'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: APP_GREEN },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  
  progressRail: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 24, borderRadius: 3, marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: APP_LIME },

  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 60 },
  list: { gap: 14 },

  pill: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 35, paddingVertical: 12, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'transparent',
  },
  pillSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
  },
  pillInner: { flexDirection: 'row', alignItems: 'center', gap: 16, flex: 1 },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.05)',
  },
  flag: { fontSize: 22 },
  levelCode: { fontSize: 18, fontWeight: '900', color: '#FFFFFF' },
  textGroup: { flex: 1 },
  name: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  desc: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },

  // Custom Modal Styles
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    ...Shadows.medium,
  },
  modalIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.accentMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  modalDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  modalConfirm: {
    flex: 2,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.glow,
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default PreferencePickerScreen;
