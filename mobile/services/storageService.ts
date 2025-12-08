/**
 * @file storageService.ts
 * @description Wrapper around AsyncStorage for local data persistence.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (k: string, v: string) =>
  AsyncStorage.setItem(k, v);

export const getItem = async (k: string) => AsyncStorage.getItem(k);

export const removeItem = async (k: string) => AsyncStorage.removeItem(k);
