import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing } from '../theme/colors';

const TermsScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.date}>Last updated: {new Date().toLocaleDateString()}</Text>
        
        <Text style={styles.h2}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.
        </Text>

        <Text style={styles.h2}>2. User Accounts</Text>
        <Text style={styles.text}>
          You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your account and password.
        </Text>

        <Text style={styles.h2}>3. Use License</Text>
        <Text style={styles.text}>
          Permission is granted to temporarily download one copy of the materials on Lingua Pro for personal, non-commercial transitory viewing only.
        </Text>

        <Text style={styles.h2}>4. Disclaimer</Text>
        <Text style={styles.text}>
          The materials on Lingua Pro are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties or conditions of merchantability.
        </Text>

        <Text style={styles.h2}>5. Limitations</Text>
        <Text style={styles.text}>
          In no event shall Lingua Pro or its suppliers be liable for any damages arising out of the use or inability to use the materials on the platform.
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

export default TermsScreen;
