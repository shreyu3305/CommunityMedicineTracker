import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, ExternalLink } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';

interface ContactActionsProps {
  phone?: string;
  email?: string;
  address?: string;
  pharmacyName?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical' | 'compact';
  showLabels?: boolean;
  style?: React.CSSProperties;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  phone,
  email,
  address,
  pharmacyName = 'Pharmacy',
  size = 'md',
  layout = 'horizontal',
  showLabels = true,
  style
}) => {
  const handleCall = () => {
    if (phone) {
      window.open(`tel:${phone}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (phone) {
      const message = `Hi, I'm looking for medicine availability at ${pharmacyName}. Can you help me?`;
      const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleEmail = () => {
    if (email) {
      const subject = `Medicine Availability Inquiry - ${pharmacyName}`;
      const body = `Hello,\n\nI'm looking for medicine availability at your pharmacy. Could you please help me with the following:\n\n1. Medicine name:\n2. Required quantity:\n3. Preferred timing:\n\nThank you for your assistance.`;
      const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl, '_self');
    }
  };

  const handleDirections = () => {
    if (address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  const sizeMap = {
    sm: { iconSize: 14, fontSize: '12px', padding: spacing.xs, gap: spacing.xs },
    md: { iconSize: 16, fontSize: '14px', padding: spacing.sm, gap: spacing.sm },
    lg: { iconSize: 18, fontSize: '16px', padding: spacing.md, gap: spacing.md }
  };

  const currentSize = sizeMap[size];

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    gap: currentSize.gap,
    alignItems: layout === 'vertical' ? 'stretch' : 'center',
    ...style
  };

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: currentSize.padding,
    borderRadius: borderRadius.md,
    fontSize: currentSize.fontSize,
    fontWeight: 500,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    border: 'none',
    textDecoration: 'none'
  };

  const callButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: colors.success,
    color: 'white',
    '&:hover': {
      background: colors.successDark,
      transform: 'translateY(-1px)',
      boxShadow: shadows.md
    }
  };

  const whatsappButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: '#25D366',
    color: 'white',
    '&:hover': {
      background: '#128C7E',
      transform: 'translateY(-1px)',
      boxShadow: shadows.md
    }
  };

  const emailButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: colors.primary,
    color: 'white',
    '&:hover': {
      background: colors.primaryDark,
      transform: 'translateY(-1px)',
      boxShadow: shadows.md
    }
  };

  const directionsButtonStyles: React.CSSProperties = {
    ...buttonStyles,
    background: colors.info,
    color: 'white',
    '&:hover': {
      background: colors.infoDark,
      transform: 'translateY(-1px)',
      boxShadow: shadows.md
    }
  };

  const labelStyles: React.CSSProperties = {
    fontSize: currentSize.fontSize,
    fontWeight: 500,
    margin: 0
  };

  const iconStyles: React.CSSProperties = {
    flexShrink: 0
  };

  if (layout === 'compact') {
    return (
      <div style={containerStyles}>
        {phone && (
          <Button
            variant="outline"
            size={size}
            onClick={handleCall}
            icon={<Phone size={currentSize.iconSize} />}
            style={{
              background: colors.success,
              borderColor: colors.success,
              color: 'white',
              minWidth: 'auto'
            }}
          >
            {showLabels ? 'Call' : ''}
          </Button>
        )}
        {phone && (
          <Button
            variant="outline"
            size={size}
            onClick={handleWhatsApp}
            icon={<MessageCircle size={currentSize.iconSize} />}
            style={{
              background: '#25D366',
              borderColor: '#25D366',
              color: 'white',
              minWidth: 'auto'
            }}
          >
            {showLabels ? 'WhatsApp' : ''}
          </Button>
        )}
        {email && (
          <Button
            variant="outline"
            size={size}
            onClick={handleEmail}
            icon={<Mail size={currentSize.iconSize} />}
            style={{
              background: colors.primary,
              borderColor: colors.primary,
              color: 'white',
              minWidth: 'auto'
            }}
          >
            {showLabels ? 'Email' : ''}
          </Button>
        )}
        {address && (
          <Button
            variant="outline"
            size={size}
            onClick={handleDirections}
            icon={<MapPin size={currentSize.iconSize} />}
            style={{
              background: colors.info,
              borderColor: colors.info,
              color: 'white',
              minWidth: 'auto'
            }}
          >
            {showLabels ? 'Directions' : ''}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div style={containerStyles}>
      {phone && (
        <button
          style={callButtonStyles}
          onClick={handleCall}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.successDark;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.success;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Phone size={currentSize.iconSize} style={iconStyles} />
          {showLabels && <span style={labelStyles}>Call</span>}
        </button>
      )}
      
      {phone && (
        <button
          style={whatsappButtonStyles}
          onClick={handleWhatsApp}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#128C7E';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#25D366';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <MessageCircle size={currentSize.iconSize} style={iconStyles} />
          {showLabels && <span style={labelStyles}>WhatsApp</span>}
        </button>
      )}
      
      {email && (
        <button
          style={emailButtonStyles}
          onClick={handleEmail}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.primaryDark;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.primary;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <Mail size={currentSize.iconSize} style={iconStyles} />
          {showLabels && <span style={labelStyles}>Email</span>}
        </button>
      )}
      
      {address && (
        <button
          style={directionsButtonStyles}
          onClick={handleDirections}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = colors.infoDark;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = shadows.md;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.info;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <MapPin size={currentSize.iconSize} style={iconStyles} />
          {showLabels && <span style={labelStyles}>Directions</span>}
        </button>
      )}
    </div>
  );
};

// Compact contact info component for cards
export const ContactInfo: React.FC<{
  phone?: string;
  email?: string;
  address?: string;
  style?: React.CSSProperties;
}> = ({ phone, email, address, style }) => {
  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
    ...style
  };

  const infoItemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    fontSize: '13px',
    color: colors.neutral[600],
    textDecoration: 'none'
  };

  const iconStyles: React.CSSProperties = {
    color: colors.neutral[500],
    flexShrink: 0
  };

  return (
    <div style={containerStyles}>
      {phone && (
        <a href={`tel:${phone}`} style={infoItemStyles}>
          <Phone size={14} style={iconStyles} />
          <span>{phone}</span>
        </a>
      )}
      {email && (
        <a href={`mailto:${email}`} style={infoItemStyles}>
          <Mail size={14} style={iconStyles} />
          <span>{email}</span>
        </a>
      )}
      {address && (
        <div style={infoItemStyles}>
          <MapPin size={14} style={iconStyles} />
          <span>{address}</span>
        </div>
      )}
    </div>
  );
};

// Quick contact button for mobile
export const QuickContact: React.FC<{
  phone?: string;
  pharmacyName?: string;
  style?: React.CSSProperties;
}> = ({ phone, pharmacyName = 'Pharmacy', style }) => {
  const handleQuickContact = () => {
    if (phone) {
      const message = `Hi, I'm looking for medicine availability at ${pharmacyName}. Can you help me?`;
      const whatsappUrl = `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const buttonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    background: '#25D366',
    color: 'white',
    borderRadius: borderRadius.full,
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: shadows.sm,
    ...style
  };

  return (
    <button style={buttonStyles} onClick={handleQuickContact}>
      <MessageCircle size={16} />
      <span>Quick Contact</span>
    </button>
  );
};
