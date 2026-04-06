import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../theme/colors';

const PrivacyPolicyScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.h2}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information you provide directly to us when you create an account, update your profile, or use our learning services. This includes your name, email, target learning languages, and your progress data (like saved vocabulary and completed stories).
        </Text>

        <Text style={styles.h2}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          We use your information to provide, maintain, and improve our services. Your progress data is strictly used to customize your learning roadmap and track your app engagement.
        </Text>

        <Text style={styles.h2}>3. Information Sharing</Text>
        <Text style={styles.text}>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent, except as required by law.
        </Text>

        <Text style={styles.h2}>4. Data Security</Text>
        <Text style={styles.text}>
          We implement a variety of security measures to maintain the safety of your personal information. All your data is securely stored on encrypted Firebase databases.
        </Text>

        <Text style={styles.h2}>5. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us at support@linguapro.app.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  content: { padding: Spacing.xl, paddingBottom: 60 },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  date: { fontSize: FontSizes.sm, color: Colors.textMuted, marginBottom: 24 },
  h2: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: 16, marginBottom: 8 },
  text: { fontSize: FontSizes.md, color: Colors.textSecondary, lineHeight: 24, marginBottom: 12 }
});

export default PrivacyPolicyScreen;
