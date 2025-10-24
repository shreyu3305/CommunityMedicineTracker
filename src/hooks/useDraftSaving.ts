import { useState, useEffect, useCallback } from 'react';

export interface DraftData {
  id: string;
  timestamp: number;
  data: any;
  type: 'report' | 'search' | 'form';
  title?: string;
}

export interface UseDraftSavingOptions {
  key: string;
  autoSave?: boolean;
  autoSaveInterval?: number; // in milliseconds
  maxDrafts?: number;
}

export const useDraftSaving = (options: UseDraftSavingOptions) => {
  const {
    key,
    autoSave = true,
    autoSaveInterval = 30000, // 30 seconds
    maxDrafts = 5
  } = options;

  const [drafts, setDrafts] = useState<DraftData[]>([]);
  const [currentDraft, setCurrentDraft] = useState<DraftData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load drafts from localStorage on mount
  useEffect(() => {
    try {
      const storedDrafts = localStorage.getItem(`drafts_${key}`);
      if (storedDrafts) {
        const parsedDrafts = JSON.parse(storedDrafts);
        setDrafts(parsedDrafts);
      }
    } catch (error) {
      console.error('Failed to load drafts from localStorage:', error);
    }
  }, [key]);

  // Save drafts to localStorage whenever drafts change
  useEffect(() => {
    try {
      localStorage.setItem(`drafts_${key}`, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to save drafts to localStorage:', error);
    }
  }, [drafts, key]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !currentDraft) return;

    const interval = setInterval(() => {
      if (currentDraft) {
        saveDraft(currentDraft.data, currentDraft.type, currentDraft.title);
      }
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, currentDraft]);

  const saveDraft = useCallback((data: any, type: 'report' | 'search' | 'form' = 'form', title?: string) => {
    setIsSaving(true);
    
    try {
      const newDraft: DraftData = {
        id: `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        data,
        type,
        title: title || `${type.charAt(0).toUpperCase() + type.slice(1)} Draft`
      };

      setDrafts(prevDrafts => {
        // Remove old drafts if we exceed maxDrafts
        const updatedDrafts = [newDraft, ...prevDrafts].slice(0, maxDrafts);
        return updatedDrafts;
      });

      setCurrentDraft(newDraft);
      setLastSaved(new Date());
      
      return newDraft.id;
    } catch (error) {
      console.error('Failed to save draft:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [maxDrafts]);

  const loadDraft = useCallback((draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setCurrentDraft(draft);
      return draft.data;
    }
    return null;
  }, [drafts]);

  const deleteDraft = useCallback((draftId: string) => {
    setDrafts(prevDrafts => prevDrafts.filter(d => d.id !== draftId));
    
    if (currentDraft?.id === draftId) {
      setCurrentDraft(null);
    }
  }, [currentDraft]);

  const clearAllDrafts = useCallback(() => {
    setDrafts([]);
    setCurrentDraft(null);
  }, []);

  const updateCurrentDraft = useCallback((data: any) => {
    if (currentDraft) {
      const updatedDraft = {
        ...currentDraft,
        data,
        timestamp: Date.now()
      };
      setCurrentDraft(updatedDraft);
      
      // Update in drafts array
      setDrafts(prevDrafts => 
        prevDrafts.map(d => d.id === currentDraft.id ? updatedDraft : d)
      );
    }
  }, [currentDraft]);

  const getDraftById = useCallback((draftId: string) => {
    return drafts.find(d => d.id === draftId);
  }, [drafts]);

  const getDraftsByType = useCallback((type: 'report' | 'search' | 'form') => {
    return drafts.filter(d => d.type === type);
  }, [drafts]);

  const getRecentDrafts = useCallback((limit: number = 5) => {
    return drafts
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }, [drafts]);

  const exportDrafts = useCallback(() => {
    try {
      const dataStr = JSON.stringify(drafts, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `drafts_${key}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to export drafts:', error);
      return false;
    }
  }, [drafts, key]);

  const importDrafts = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importedDrafts = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedDrafts)) {
            setDrafts(importedDrafts);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Failed to import drafts:', error);
          resolve(false);
        }
      };
      
      reader.onerror = () => resolve(false);
      reader.readAsText(file);
    });
  }, []);

  const getStorageInfo = useCallback(() => {
    try {
      const storedDrafts = localStorage.getItem(`drafts_${key}`);
      const size = storedDrafts ? new Blob([storedDrafts]).size : 0;
      
      return {
        count: drafts.length,
        size: size,
        sizeFormatted: `${(size / 1024).toFixed(2)} KB`,
        lastSaved: lastSaved,
        oldestDraft: drafts.length > 0 ? new Date(Math.min(...drafts.map(d => d.timestamp))) : null,
        newestDraft: drafts.length > 0 ? new Date(Math.max(...drafts.map(d => d.timestamp))) : null
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return {
        count: 0,
        size: 0,
        sizeFormatted: '0 KB',
        lastSaved: null,
        oldestDraft: null,
        newestDraft: null
      };
    }
  }, [drafts, lastSaved, key]);

  return {
    // State
    drafts,
    currentDraft,
    isSaving,
    lastSaved,
    
    // Actions
    saveDraft,
    loadDraft,
    deleteDraft,
    clearAllDrafts,
    updateCurrentDraft,
    
    // Getters
    getDraftById,
    getDraftsByType,
    getRecentDrafts,
    
    // Import/Export
    exportDrafts,
    importDrafts,
    
    // Info
    getStorageInfo
  };
};
