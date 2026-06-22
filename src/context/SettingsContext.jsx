import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSettings as fetchSettingsApi, putSettings as updateSettingsApi } from '../services/about';

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [pendingLanguageChange, setPendingLanguageChange] = useState(null);

  const normalizeLang = (lang) => {
    if (!lang) return 'ur';
    const l = lang.toString().toLowerCase();
    return (l === 'ur' || l === 'urdu') ? 'ur' : 'en';
  };

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSettingsApi();
      const localLang = normalizeLang(localStorage.getItem('site_language') || 'ur');
      setSettings({
        ...data,
        language: localLang,
        englishFont: localStorage.getItem('site_english_font') || data?.englishFont || 'Inter',
        urduFont: localStorage.getItem('site_urdu_font') || data?.urduFont || 'Noto Nastaliq Urdu',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const changeLanguage = (newLang) => {
    const normalized = normalizeLang(newLang);
    localStorage.setItem('site_language', normalized);
    setSettings((prev) => {
      if (!prev) return { language: normalized };
      return {
        ...prev,
        language: normalized,
      };
    });
  };

  const updateSettings = async (payload) => {
    try {
      setLoading(true);
      setError(null);
      setUpdateSuccess(false);
      const data = await updateSettingsApi(payload);
      const localLang = normalizeLang(localStorage.getItem('site_language') || 'ur');
      setSettings({
        ...data,
        language: localLang,
        englishFont: localStorage.getItem('site_english_font') || data?.englishFont || 'Inter',
        urduFont: localStorage.getItem('site_urdu_font') || data?.urduFont || 'Noto Nastaliq Urdu',
      });
      setUpdateSuccess(true);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update settings');
      setUpdateSuccess(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setError(null);
    setUpdateSuccess(false);
  };

  const requestLanguageChange = (lang) => {
    setPendingLanguageChange(normalizeLang(lang));
  };

  const clearLanguageChangeRequest = () => {
    setPendingLanguageChange(null);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        updateSuccess,
        pendingLanguageChange,
        changeLanguage,
        updateSettings,
        clearErrors,
        requestLanguageChange,
        clearLanguageChangeRequest,
        refreshSettings: loadSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
