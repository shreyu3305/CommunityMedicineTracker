import React from 'react';

export interface AriaLabelsProps {
  children: React.ReactNode;
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  hidden?: boolean;
  role?: string;
  level?: number;
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: string;
  busy?: boolean;
  current?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  orientation?: 'horizontal' | 'vertical';
  valueNow?: number;
  valueMin?: number;
  valueMax?: number;
  valueText?: string;
  controls?: string;
  owns?: string;
  flowTo?: string;
  posInSet?: number;
  setSize?: number;
  sort?: 'ascending' | 'descending' | 'none' | 'other';
  colIndex?: number;
  rowIndex?: number;
  colSpan?: number;
  rowSpan?: number;
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  autocomplete?: string;
  checked?: boolean | 'mixed';
  pressed?: boolean | 'mixed';
  readOnly?: boolean;
  multiline?: boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  placeholder?: string;
  autoComplete?: string;
  autoCorrect?: string;
  autoCapitalize?: string;
  autoSave?: string;
  inputMode?: string;
  enterKeyHint?: string;
  style?: React.CSSProperties;
}

export const AriaLabels: React.FC<AriaLabelsProps> = ({
  children,
  label,
  labelledBy,
  describedBy,
  hidden = false,
  role,
  level,
  expanded,
  selected,
  disabled = false,
  required = false,
  invalid = false,
  live = 'off',
  atomic = false,
  relevant,
  busy = false,
  current,
  orientation,
  valueNow,
  valueMin,
  valueMax,
  valueText,
  controls,
  owns,
  flowTo,
  posInSet,
  setSize,
  sort,
  colIndex,
  rowIndex,
  colSpan,
  rowSpan,
  hasPopup,
  autocomplete,
  checked,
  pressed,
  readOnly = false,
  multiline = false,
  maxLength,
  minLength,
  pattern,
  placeholder,
  autoComplete,
  autoCorrect,
  autoCapitalize,
  autoSave,
  inputMode,
  enterKeyHint,
  style
}) => {
  const ariaProps: React.HTMLAttributes<HTMLElement> = {
    'aria-label': label,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    'aria-hidden': hidden,
    'aria-role': role,
    'aria-level': level,
    'aria-expanded': expanded,
    'aria-selected': selected,
    'aria-disabled': disabled,
    'aria-required': required,
    'aria-invalid': invalid,
    'aria-live': live,
    'aria-atomic': atomic,
    'aria-relevant': relevant,
    'aria-busy': busy,
    'aria-current': current,
    'aria-orientation': orientation,
    'aria-valuenow': valueNow,
    'aria-valuemin': valueMin,
    'aria-valuemax': valueMax,
    'aria-valuetext': valueText,
    'aria-controls': controls,
    'aria-owns': owns,
    'aria-flowto': flowTo,
    'aria-posinset': posInSet,
    'aria-setsize': setSize,
    'aria-sort': sort,
    'aria-colindex': colIndex,
    'aria-rowindex': rowIndex,
    'aria-colspan': colSpan,
    'aria-rowspan': rowSpan,
    'aria-haspopup': hasPopup,
    'aria-autocomplete': autocomplete,
    'aria-checked': checked,
    'aria-pressed': pressed,
    'aria-readonly': readOnly,
    'aria-multiline': multiline,
    'aria-maxlength': maxLength,
    'aria-minlength': minLength,
    'aria-pattern': pattern,
    'aria-placeholder': placeholder,
    'aria-autocomplete': autoComplete,
    'aria-autocorrect': autoCorrect,
    'aria-autocapitalize': autoCapitalize,
    'aria-autosave': autoSave,
    'aria-inputmode': inputMode,
    'aria-enterkeyhint': enterKeyHint
  };

  // Remove undefined values
  const cleanAriaProps = Object.fromEntries(
    Object.entries(ariaProps).filter(([_, value]) => value !== undefined)
  );

  return (
    <div {...cleanAriaProps} style={style}>
      {children}
    </div>
  );
};

// Button with ARIA labels
export const AriaButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  controls?: string;
  describedBy?: string;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, onClick, disabled, pressed, expanded, controls, describedBy, label, style }) => (
  <AriaLabels
    role="button"
    pressed={pressed}
    expanded={expanded}
    controls={controls}
    describedBy={describedBy}
    label={label}
    disabled={disabled}
    style={{
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }}
    onClick={disabled ? undefined : onClick}
  >
    {children}
  </AriaLabels>
);

// Input with ARIA labels
export const AriaInput: React.FC<{
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  describedBy?: string;
  required?: boolean;
  invalid?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  style?: React.CSSProperties;
}> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  describedBy,
  required,
  invalid,
  disabled,
  readOnly,
  autoComplete,
  style
}) => (
  <AriaLabels
    role="textbox"
    label={label}
    describedBy={describedBy}
    required={required}
    invalid={invalid}
    disabled={disabled}
    readOnly={readOnly}
    autocomplete={autoComplete}
    placeholder={placeholder}
    style={style}
  >
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
      style={{
        width: '100%',
        padding: '8px 12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        ...style
      }}
    />
  </AriaLabels>
);

// List with ARIA labels
export const AriaList: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, orientation = 'vertical', style }) => (
  <AriaLabels
    role="list"
    label={label}
    describedBy={describedBy}
    orientation={orientation}
    style={style}
  >
    {children}
  </AriaLabels>
);

// List item with ARIA labels
export const AriaListItem: React.FC<{
  children: React.ReactNode;
  selected?: boolean;
  posInSet?: number;
  setSize?: number;
  style?: React.CSSProperties;
}> = ({ children, selected, posInSet, setSize, style }) => (
  <AriaLabels
    role="listitem"
    selected={selected}
    posInSet={posInSet}
    setSize={setSize}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Heading with ARIA labels
export const AriaHeading: React.FC<{
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, level, label, style }) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <AriaLabels
      role="heading"
      level={level}
      label={label}
      style={style}
    >
      <HeadingTag>{children}</HeadingTag>
    </AriaLabels>
  );
};

// Region with ARIA labels
export const AriaRegion: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, live, atomic, style }) => (
  <AriaLabels
    role="region"
    label={label}
    describedBy={describedBy}
    live={live}
    atomic={atomic}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Navigation with ARIA labels
export const AriaNavigation: React.FC<{
  children: React.ReactNode;
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}> = ({ children, label, orientation = 'horizontal', style }) => (
  <AriaLabels
    role="navigation"
    label={label}
    orientation={orientation}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Main content with ARIA labels
export const AriaMain: React.FC<{
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, label, style }) => (
  <AriaLabels
    role="main"
    label={label}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Complementary content with ARIA labels
export const AriaComplementary: React.FC<{
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, label, style }) => (
  <AriaLabels
    role="complementary"
    label={label}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Content info with ARIA labels
export const AriaContentInfo: React.FC<{
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, label, style }) => (
  <AriaLabels
    role="contentinfo"
    label={label}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Banner with ARIA labels
export const AriaBanner: React.FC<{
  children: React.ReactNode;
  label?: string;
  style?: React.CSSProperties;
}> = ({ children, label, style }) => (
  <AriaLabels
    role="banner"
    label={label}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Form with ARIA labels
export const AriaForm: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, style }) => (
  <AriaLabels
    role="form"
    label={label}
    describedBy={describedBy}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Group with ARIA labels
export const AriaGroup: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  orientation?: 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, orientation, style }) => (
  <AriaLabels
    role="group"
    label={label}
    describedBy={describedBy}
    orientation={orientation}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Table with ARIA labels
export const AriaTable: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, style }) => (
  <AriaLabels
    role="table"
    label={label}
    describedBy={describedBy}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Table row with ARIA labels
export const AriaTableRow: React.FC<{
  children: React.ReactNode;
  selected?: boolean;
  rowIndex?: number;
  style?: React.CSSProperties;
}> = ({ children, selected, rowIndex, style }) => (
  <AriaLabels
    role="row"
    selected={selected}
    rowIndex={rowIndex}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Table cell with ARIA labels
export const AriaTableCell: React.FC<{
  children: React.ReactNode;
  selected?: boolean;
  colIndex?: number;
  rowIndex?: number;
  colSpan?: number;
  rowSpan?: number;
  style?: React.CSSProperties;
}> = ({ children, selected, colIndex, rowIndex, colSpan, rowSpan, style }) => (
  <AriaLabels
    role="gridcell"
    selected={selected}
    colIndex={colIndex}
    rowIndex={rowIndex}
    colSpan={colSpan}
    rowSpan={rowSpan}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Progress bar with ARIA labels
export const AriaProgressBar: React.FC<{
  value: number;
  max?: number;
  label?: string;
  describedBy?: string;
  style?: React.CSSProperties;
}> = ({ value, max = 100, label, describedBy, style }) => (
  <AriaLabels
    role="progressbar"
    valueNow={value}
    valueMax={max}
    label={label}
    describedBy={describedBy}
    style={style}
  >
    <div
      style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: `${(value / max) * 100}%`,
          height: '100%',
          backgroundColor: '#3b82f6',
          transition: 'width 0.3s ease'
        }}
      />
    </div>
  </AriaLabels>
);

// Status with ARIA labels
export const AriaStatus: React.FC<{
  children: React.ReactNode;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  style?: React.CSSProperties;
}> = ({ children, live = 'polite', atomic = true, style }) => (
  <AriaLabels
    role="status"
    live={live}
    atomic={atomic}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Alert with ARIA labels
export const AriaAlert: React.FC<{
  children: React.ReactNode;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  style?: React.CSSProperties;
}> = ({ children, live = 'assertive', atomic = true, style }) => (
  <AriaLabels
    role="alert"
    live={live}
    atomic={atomic}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Dialog with ARIA labels
export const AriaDialog: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  modal?: boolean;
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, modal = true, style }) => (
  <AriaLabels
    role={modal ? 'dialog' : 'alertdialog'}
    label={label}
    describedBy={describedBy}
    style={style}
  >
    {children}
  </AriaLabels>
);

// Tooltip with ARIA labels
export const AriaTooltip: React.FC<{
  children: React.ReactNode;
  label?: string;
  describedBy?: string;
  style?: React.CSSProperties;
}> = ({ children, label, describedBy, style }) => (
  <AriaLabels
    role="tooltip"
    label={label}
    describedBy={describedBy}
    style={style}
  >
    {children}
  </AriaLabels>
);
