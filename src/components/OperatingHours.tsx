import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { colors, spacing } from '../styles/tokens';
import type { OpenHours } from '../types';

interface OperatingHoursProps {
  hours: OpenHours;
  showStatus?: boolean;
  compact?: boolean;
}

export const OperatingHours: React.FC<OperatingHoursProps> = ({
  hours,
  showStatus = true,
  compact = false
}) => {
  const getCurrentDay = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  };

  const isCurrentlyOpen = () => {
    const currentDay = getCurrentDay();
    const todayHours = hours[currentDay];
    
    if (!todayHours || todayHours.closed) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [openHour, openMinute] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMinute;
    const closeTime = closeHour * 60 + closeMinute;
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const getNextOpenTime = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = new Date().getDay();
    
    for (let i = 0; i < 7; i++) {
      const dayIndex = (currentDayIndex + i) % 7;
      const day = days[dayIndex];
      const dayHours = hours[day];
      
      if (dayHours && !dayHours.closed) {
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        if (i === 0) {
          // Today - check if it opens later today
          const now = new Date();
          const currentTime = now.getHours() * 60 + now.getMinutes();
          const [openHour, openMinute] = dayHours.open.split(':').map(Number);
          const openTime = openHour * 60 + openMinute;
          
          if (currentTime < openTime) {
            return { day: 'Today', time: dayHours.open };
          }
        } else {
          return { day: dayName, time: dayHours.open };
        }
      }
    }
    
    return null;
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const isOpen = isCurrentlyOpen();
  const nextOpen = getNextOpenTime();

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? spacing.xs : spacing.sm
  };

  const statusStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: compact ? '12px' : '14px',
    fontWeight: 600,
    color: isOpen ? colors.success : colors.error
  };

  const hoursListStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? '2px' : spacing.xs
  };

  const dayRowStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: compact ? '12px' : '14px',
    color: colors.neutral[600]
  };

  const todayRowStyles: React.CSSProperties = {
    ...dayRowStyles,
    fontWeight: 600,
    color: colors.neutral[900],
    background: colors.neutral[50],
    padding: compact ? '4px 8px' : '6px 12px',
    borderRadius: '6px',
    margin: compact ? '2px 0' : '4px 0'
  };

  const closedStyles: React.CSSProperties = {
    color: colors.neutral[400],
    fontStyle: 'italic'
  };

  const nextOpenStyles: React.CSSProperties = {
    fontSize: compact ? '11px' : '12px',
    color: colors.neutral[500],
    marginTop: spacing.xs,
    padding: compact ? '4px 8px' : '6px 12px',
    background: colors.neutral[50],
    borderRadius: '6px',
    border: `1px solid ${colors.neutral[200]}`
  };

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  const currentDay = getCurrentDay();

  return (
    <div style={containerStyles}>
      {showStatus && (
        <div style={statusStyles}>
          {isOpen ? (
            <>
              <CheckCircle size={compact ? 12 : 16} />
              <span>Open Now</span>
            </>
          ) : (
            <>
              <XCircle size={compact ? 12 : 16} />
              <span>Closed</span>
            </>
          )}
        </div>
      )}

      {!compact && (
        <div style={hoursListStyles}>
          {days.map(({ key, label }) => {
            const dayHours = hours[key];
            const isToday = key === currentDay;
            const rowStyle = isToday ? todayRowStyles : dayRowStyles;

            return (
              <div key={key} style={rowStyle}>
                <span>{label}</span>
                <span style={dayHours?.closed ? closedStyles : {}}>
                  {dayHours?.closed 
                    ? 'Closed' 
                    : `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`
                  }
                </span>
              </div>
            );
          })}
        </div>
      )}

      {!isOpen && nextOpen && (
        <div style={nextOpenStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
            <Clock size={12} />
            <span>Opens {nextOpen.day} at {formatTime(nextOpen.time)}</span>
          </div>
        </div>
      )}

      {compact && (
        <div style={{ fontSize: '12px', color: colors.neutral[500] }}>
          {(() => {
            const todayHours = hours[currentDay];
            if (todayHours?.closed) {
              return 'Closed today';
            }
            return `${formatTime(todayHours.open)} - ${formatTime(todayHours.close)}`;
          })()}
        </div>
      )}
    </div>
  );
};
