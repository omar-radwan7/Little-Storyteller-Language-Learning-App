// ==========================================
// App Navigation — Stack + Bottom Tabs
// ==========================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, TouchableOpacity, Text, LayoutAnimation, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../theme/colors';
import { RootStackParamList, MainTabParamList } from '../types';

// Screens
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import VocabularyScreen from '../screens/VocabularyScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import StoryReaderScreen from '../screens/StoryReaderScreen';
import PreferencePickerScreen from '../screens/PreferencePickerScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<string, { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Library: { focused: 'library', default: 'library-outline' },
  Vocabulary: { focused: 'language', default: 'language-outline' },
  Progress: { focused: 'stats-chart', default: 'stats-chart-outline' },
  Profile: { focused: 'person', default: 'person-outline' },
};

const TabItem = ({ route, isFocused, descriptors, navigation, index }: any) => {
  const { options } = descriptors[route.key];
  const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
  
  // Animation values
  const scale = React.useRef(new Animated.Value(isFocused ? 1.2 : 1)).current;
  const translateY = React.useRef(new Animated.Value(isFocused ? -5 : 0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isFocused ? 1.2 : 1,
        useNativeDriver: true,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: isFocused ? -8 : 0,
        useNativeDriver: true,
        friction: 8,
      }),
    ]).start();
  }, [isFocused]);

  const onPress = () => {
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    
    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      navigation.navigate({ name: route.name, merge: true });
    }
  };

  const icons = TAB_ICONS[route.name];
  const iconName = isFocused ? icons.focused : icons.default;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.tabItem}
      activeOpacity={0.8}
    >
      {isFocused && <View style={styles.activeCircle} />}
      <Animated.View style={[
        styles.iconContainer, 
        isFocused && styles.activeIconContainer,
        { transform: [{ scale }, { translateY }] }
      ]}>
        <Ionicons 
          name={iconName} 
          size={24} 
          color={isFocused ? '#FFFFFF' : Colors.textMuted} 
        />
      </Animated.View>
      {!isFocused && (
        <Text style={[styles.tabLabel, isFocused && styles.activeTabLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          return (
            <TabItem 
              key={index}
              route={route}
              isFocused={isFocused}
              descriptors={descriptors}
              navigation={navigation}
              index={index}
            />
          );
        })}
      </View>
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{ headerShown: false }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Library" component={LibraryScreen} />
    <Tab.Screen name="Vocabulary" component={VocabularyScreen} />
    <Tab.Screen name="Progress" component={ProgressScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

import { useAuth } from '../hooks/useAuth';

const AppNavigator = () => {
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        {isLoading ? (
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : !isAuthenticated ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            {!hasCompletedOnboarding && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="StoryReader"
              component={StoryReaderScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="PreferencePicker"
              component={PreferencePickerScreen as any}
              options={{ animation: 'slide_from_bottom' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 70,
    marginHorizontal: 10,
    ...Shadows.medium,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: Colors.primary,
    marginTop: -40,
    ...Shadows.medium,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  activeCircle: {
     position: 'absolute',
     top: -30,
     width: 64,
     height: 64,
     borderRadius: 32,
     backgroundColor: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeTabLabel: {
    color: Colors.primary,
    fontWeight: '800',
  },
});

export default AppNavigator;
