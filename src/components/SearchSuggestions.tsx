import React, { useState, useEffect, useRef, useCallback } from 'react';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/tokens';
import { apiClient } from '../services/api';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'medicine' | 'pharmacy' | 'category' | 'recent' | 'popular';
  confidence?: number;
  description?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

export interface SearchSuggestionsProps {
  query: string;
  suggestions: SearchSuggestion[];
  onSelect?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
  maxSuggestions?: number;
  showTypes?: boolean;
  showConfidence?: boolean;
  showDescription?: boolean;
  style?: React.CSSProperties;
}

export interface SearchSuggestionsDropdownProps {
  query: string;
  suggestions: SearchSuggestion[];
  onSelect?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
  maxSuggestions?: number;
  showTypes?: boolean;
  showConfidence?: boolean;
  showDescription?: boolean;
  position?: 'top' | 'bottom';
  style?: React.CSSProperties;
}

export interface SearchSuggestionsInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  onClear?: () => void;
  suggestions: SearchSuggestion[];
  maxSuggestions?: number;
  showTypes?: boolean;
  showConfidence?: boolean;
  showDescription?: boolean;
  placeholder?: string;
  style?: React.CSSProperties;
}

// Search Suggestions component
export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  onSelect,
  onClear,
  maxSuggestions = 10,
  showTypes = true,
  showConfidence = false,
  showDescription = true,
  style
}) => {
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSuggestions(suggestions.slice(0, maxSuggestions));
      return;
    }

    const filtered = suggestions
      .filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.description?.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by confidence if available
        if (showConfidence && a.confidence && b.confidence) {
          return b.confidence - a.confidence;
        }
        // Sort by type priority
        const typePriority = { medicine: 1, pharmacy: 2, category: 3, recent: 4, popular: 5 };
        return typePriority[a.type] - typePriority[b.type];
      })
      .slice(0, maxSuggestions);

    setFilteredSuggestions(filtered);
  }, [query, suggestions, maxSuggestions, showConfidence]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredSuggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          onSelect?.(filteredSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClear?.();
        break;
    }
  }, [selectedIndex, filteredSuggestions, onSelect, onClear]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredSuggestions]);

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'medicine':
        return '💊';
      case 'pharmacy':
        return '🏥';
      case 'category':
        return '📂';
      case 'recent':
        return '🕒';
      case 'popular':
        return '⭐';
      default:
        return '🔍';
    }
  };

  const getTypeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'medicine':
        return colors.primary;
      case 'pharmacy':
        return colors.success;
      case 'category':
        return colors.warning;
      case 'recent':
        return colors.neutral[600];
      case 'popular':
        return colors.accent;
      default:
        return colors.text;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return colors.neutral[400];
    if (confidence >= 0.8) return colors.success;
    if (confidence >= 0.6) return colors.warning;
    return colors.error;
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    ...style
  };

  const suggestionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent'
  };

  const selectedSuggestionStyles: React.CSSProperties = {
    ...suggestionStyles,
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary
  };

  const typeIconStyles: React.CSSProperties = {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center'
  };

  const textStyles: React.CSSProperties = {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    marginTop: spacing.xs
  };

  const confidenceStyles: React.CSSProperties = {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral[100],
    color: colors.text
  };

  const typeStyles: React.CSSProperties = {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    color: colors.white
  };

  if (filteredSuggestions.length === 0) {
    return (
      <div style={containerStyles}>
        <div style={{
          padding: spacing.md,
          textAlign: 'center',
          color: colors.neutral[600],
          fontSize: typography.sizes.sm
        }}>
          No suggestions found for "{query}"
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyles} onKeyDown={handleKeyDown}>
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={suggestion.id}
          onClick={() => onSelect?.(suggestion)}
          style={index === selectedIndex ? selectedSuggestionStyles : suggestionStyles}
        >
          <div style={typeIconStyles}>{getTypeIcon(suggestion.type)}</div>
          
          <div style={{ flex: 1 }}>
            <div style={textStyles}>{suggestion.text}</div>
            {showDescription && suggestion.description && (
              <div style={descriptionStyles}>{suggestion.description}</div>
            )}
          </div>
          
          {showTypes && (
            <div
              style={{
                ...typeStyles,
                backgroundColor: getTypeColor(suggestion.type)
              }}
            >
              {suggestion.type}
            </div>
          )}
          
          {showConfidence && suggestion.confidence && (
            <div
              style={{
                ...confidenceStyles,
                backgroundColor: getConfidenceColor(suggestion.confidence) + '20',
                color: getConfidenceColor(suggestion.confidence)
              }}
            >
              {Math.round(suggestion.confidence * 100)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Search Suggestions Dropdown component
export const SearchSuggestionsDropdown: React.FC<SearchSuggestionsDropdownProps> = ({
  query,
  suggestions,
  onSelect,
  onClear,
  maxSuggestions = 10,
  showTypes = true,
  showConfidence = false,
  showDescription = true,
  position = 'bottom',
  style
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSuggestions(suggestions.slice(0, maxSuggestions));
      return;
    }

    const filtered = suggestions
      .filter(suggestion => 
        suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.description?.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        if (showConfidence && a.confidence && b.confidence) {
          return b.confidence - a.confidence;
        }
        const typePriority = { medicine: 1, pharmacy: 2, category: 3, recent: 4, popular: 5 };
        return typePriority[a.type] - typePriority[b.type];
      })
      .slice(0, maxSuggestions);

    setFilteredSuggestions(filtered);
    setIsVisible(filtered.length > 0);
  }, [query, suggestions, maxSuggestions, showConfidence]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isVisible) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredSuggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          onSelect?.(filteredSuggestions[selectedIndex]);
          setIsVisible(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsVisible(false);
        onClear?.();
        break;
    }
  }, [isVisible, selectedIndex, filteredSuggestions, onSelect, onClear]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [filteredSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'medicine':
        return '💊';
      case 'pharmacy':
        return '🏥';
      case 'category':
        return '📂';
      case 'recent':
        return '🕒';
      case 'popular':
        return '⭐';
      default:
        return '🔍';
    }
  };

  const getTypeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'medicine':
        return colors.primary;
      case 'pharmacy':
        return colors.success;
      case 'category':
        return colors.warning;
      case 'recent':
        return colors.neutral[600];
      case 'popular':
        return colors.accent;
      default:
        return colors.text;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return colors.neutral[400];
    if (confidence >= 0.8) return colors.success;
    if (confidence >= 0.6) return colors.warning;
    return colors.error;
  };

  const dropdownStyles: React.CSSProperties = {
    position: 'absolute',
    [position]: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    boxShadow: shadows.lg,
    zIndex: 1000,
    maxHeight: '300px',
    overflowY: 'auto',
    ...style
  };

  const suggestionStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid transparent'
  };

  const selectedSuggestionStyles: React.CSSProperties = {
    ...suggestionStyles,
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary
  };

  const typeIconStyles: React.CSSProperties = {
    fontSize: '16px',
    width: '20px',
    textAlign: 'center'
  };

  const textStyles: React.CSSProperties = {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.text
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: typography.sizes.sm,
    color: colors.neutral[600],
    marginTop: spacing.xs
  };

  const confidenceStyles: React.CSSProperties = {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.neutral[100],
    color: colors.text
  };

  const typeStyles: React.CSSProperties = {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borderRadius.sm,
    color: colors.white
  };

  if (!isVisible || filteredSuggestions.length === 0) {
    return null;
  }

  return (
    <div ref={dropdownRef} style={dropdownStyles} onKeyDown={handleKeyDown}>
      {filteredSuggestions.map((suggestion, index) => (
        <div
          key={suggestion.id}
          onClick={() => {
            onSelect?.(suggestion);
            setIsVisible(false);
          }}
          style={index === selectedIndex ? selectedSuggestionStyles : suggestionStyles}
        >
          <div style={typeIconStyles}>{getTypeIcon(suggestion.type)}</div>
          
          <div style={{ flex: 1 }}>
            <div style={textStyles}>{suggestion.text}</div>
            {showDescription && suggestion.description && (
              <div style={descriptionStyles}>{suggestion.description}</div>
            )}
          </div>
          
          {showTypes && (
            <div
              style={{
                ...typeStyles,
                backgroundColor: getTypeColor(suggestion.type)
              }}
            >
              {suggestion.type}
            </div>
          )}
          
          {showConfidence && suggestion.confidence && (
            <div
              style={{
                ...confidenceStyles,
                backgroundColor: getConfidenceColor(suggestion.confidence) + '20',
                color: getConfidenceColor(suggestion.confidence)
              }}
            >
              {Math.round(suggestion.confidence * 100)}%
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Search Suggestions Input component
export const SearchSuggestionsInput: React.FC<SearchSuggestionsInputProps> = ({
  value,
  onChange,
  onSelect,
  onClear,
  suggestions,
  maxSuggestions = 10,
  showTypes = true,
  showConfidence = false,
  showDescription = true,
  placeholder = 'Search medicines or pharmacies...',
  style
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          onSelect?.(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsFocused(false);
        onClear?.();
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    onSelect?.(suggestion);
    setIsFocused(false);
  };

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    ...style
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.md,
    fontSize: typography.sizes.md,
    outline: 'none',
    transition: 'all 0.2s ease'
  };

  const focusedInputStyles: React.CSSProperties = {
    ...inputStyles,
    borderColor: colors.primary,
    boxShadow: `0 0 0 2px ${colors.primary}20`
  };

  return (
    <div ref={containerRef} style={containerStyles}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        style={isFocused ? focusedInputStyles : inputStyles}
      />
      
      {isFocused && suggestions.length > 0 && (
        <SearchSuggestionsDropdown
          query={value}
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          onClear={onClear}
          maxSuggestions={maxSuggestions}
          showTypes={showTypes}
          showConfidence={showConfidence}
          showDescription={showDescription}
          position="bottom"
        />
      )}
    </div>
  );
};

// Search suggestions hook
export const useSearchSuggestions = (query: string) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    // Fetch suggestions from API
    const fetchSuggestions = async () => {
      try {
        const searchTerm = query.toLowerCase();
        const suggestionsList: SearchSuggestion[] = [];

        // Fetch medicines
        const medicinesResponse = await apiClient.getMedicines();
        if (medicinesResponse.ok && medicinesResponse.data) {
          medicinesResponse.data
            .filter((med: any) => med.name.toLowerCase().includes(searchTerm))
            .slice(0, 5)
            .forEach((med: any) => {
              suggestionsList.push({
                id: med._id || med.id,
                text: med.name,
                type: 'medicine',
                confidence: 0.9,
                description: `Medicine - ${med.quantity || 0} in stock`,
                icon: '💊'
              });
            });
        }

        // Fetch pharmacies
        const pharmaciesResponse = await apiClient.getPharmacies();
        if (pharmaciesResponse.ok && pharmaciesResponse.data) {
          pharmaciesResponse.data
            .filter((pharm: any) => pharm.name.toLowerCase().includes(searchTerm))
            .slice(0, 3)
            .forEach((pharm: any) => {
              suggestionsList.push({
                id: pharm._id || pharm.id,
                text: pharm.name,
                type: 'pharmacy',
                confidence: 0.85,
                description: pharm.address || 'Pharmacy',
                icon: '🏥'
              });
            });
        }

        setSuggestions(suggestionsList.slice(0, 8)); // Limit to 8 suggestions
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce API calls
    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  return { suggestions, isLoading };
};
