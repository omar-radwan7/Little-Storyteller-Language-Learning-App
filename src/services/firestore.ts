// ==========================================
// Firestore Service — CRUD operations
// ==========================================

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
  limit,
} from 'firebase/firestore';
import { db } from './firebase';
import { Story, SavedWord, CompletedStory, User } from '../types';

// ------------------- User Profile -------------------

export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<void> => {
  const ref = doc(db, 'users', userId);
  await setDoc(ref, data, { merge: true });
};

// ------------------- Stories -------------------

export const getStories = async (
  language: string,
  level: string
): Promise<Story[]> => {
  const q = query(
    collection(db, 'stories'),
    where('language', '==', language),
    where('level', '==', level)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Story[];
};

export const getStoryById = async (storyId: string): Promise<Story | null> => {
  const docRef = doc(db, 'stories', storyId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Story;
  }
  return null;
};

export const getStoriesByTopic = async (
  language: string,
  level: string,
  topic: string
): Promise<Story[]> => {
  const q = query(
    collection(db, 'stories'),
    where('language', '==', language),
    where('level', '==', level),
    where('topic', '==', topic)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Story[];
};

// ------------------- Saved Words -------------------

export const saveWord = async (
  userId: string,
  word: SavedWord
): Promise<void> => {
  const wordRef = doc(db, 'users', userId, 'savedWords', word.id);
  await setDoc(wordRef, {
    word: word.word,
    translation: word.translation,
    definition: word.definition,
    partOfSpeech: word.partOfSpeech,
    example: word.example,
    sourceStory: word.sourceStory,
    sourceStoryId: word.sourceStoryId,
    savedAt: serverTimestamp(),
  });
};

export const getSavedWords = async (userId: string): Promise<SavedWord[]> => {
  const q = query(
    collection(db, 'users', userId, 'savedWords'),
    orderBy('savedAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    savedAt: doc.data().savedAt?.toDate() || new Date(),
  })) as SavedWord[];
};

export const deleteSavedWord = async (
  userId: string,
  wordId: string
): Promise<void> => {
  await deleteDoc(doc(db, 'users', userId, 'savedWords', wordId));
};

// ------------------- Completed Stories -------------------

export const markStoryComplete = async (
  userId: string,
  storyId: string
): Promise<void> => {
  const ref = doc(db, 'users', userId, 'completedStories', storyId);
  await setDoc(ref, {
    completedAt: serverTimestamp(),
  });
};

export const getCompletedStories = async (
  userId: string
): Promise<CompletedStory[]> => {
  const snapshot = await getDocs(
    collection(db, 'users', userId, 'completedStories')
  );
  return snapshot.docs.map((doc) => ({
    storyId: doc.id,
    completedAt: doc.data().completedAt?.toDate() || new Date(),
  }));
};

export const isStoryCompleted = async (
  userId: string,
  storyId: string
): Promise<boolean> => {
  const ref = doc(db, 'users', userId, 'completedStories', storyId);
  const docSnap = await getDoc(ref);
  return docSnap.exists();
};
