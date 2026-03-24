import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { speak } from '../services/tts';

interface SpeakerButtonProps {
  text: string;
  language?: string;
  size?: number;
  rate?: number;
  color?: string;
}

const SpeakerButton: React.FC<SpeakerButtonProps> = ({ 
  text, 
  language = 'german', 
  size = 24, 
  rate = 0.45,
  color = Colors.primary
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const anim = useState(new Animated.Value(0))[0];

  const handlePress = () => {
    setIsPlaying(true);
    speak(text, language, rate);
    
    // Simple animation for sound waves
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true })
      ]),
      { iterations: 3 }
    ).start(() => setIsPlaying(false));
  };

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.button, { width: size + 10, height: size + 10 }]}>
      <Ionicons 
        name={isPlaying ? "volume-high" : "volume-medium-outline"} 
        size={size} 
        color={color} 
      />
      {isPlaying && (
        <Animated.View 
          style={[
            styles.wave, 
            { 
              opacity: anim,
              transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.5] }) }]
            }
          ]} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    backgroundColor: 'rgba(58, 175, 169, 0.05)',
  },
  wave: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 200,
    borderWidth: 1,
    borderColor: Colors.primary,
  }
});

export default SpeakerButton;
