import React, { useState } from 'react';
import { Camera, X, Download, Share2, Heart, Eye, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';

export interface Photo {
  id: string;
  url: string;
  title?: string;
  description?: string;
  uploadedAt: string;
  uploadedBy?: string;
  likes?: number;
  isLiked?: boolean;
  tags?: string[];
}

export interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  onLike?: (photoId: string) => void;
  onDownload?: (photo: Photo) => void;
  onShare?: (photo: Photo) => void;
  onDelete?: (photoId: string) => void;
  showControls?: boolean;
  showLikes?: boolean;
  viewMode?: 'grid' | 'list' | 'masonry';
  maxPhotos?: number;
  style?: React.CSSProperties;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onPhotoClick,
  onLike,
  onDownload,
  onShare,
  onDelete,
  showControls = true,
  showLikes = true,
  viewMode: initialViewMode = 'grid',
  maxPhotos = 12,
  style
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'masonry'>(initialViewMode);
  const [showLightbox, setShowLightbox] = useState(false);

  const displayedPhotos = photos.slice(0, maxPhotos);
  const hasMorePhotos = photos.length > maxPhotos;

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    setShowLightbox(true);
    onPhotoClick?.(photo);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? (currentIndex - 1 + displayedPhotos.length) % displayedPhotos.length
      : (currentIndex + 1) % displayedPhotos.length;
    
    setCurrentIndex(newIndex);
    setSelectedPhoto(displayedPhotos[newIndex]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderGridPhoto = (photo: Photo, index: number) => {
    const photoStyles: React.CSSProperties = {
      position: 'relative',
      aspectRatio: '1',
      borderRadius: borderRadius.lg,
      overflow: 'hidden',
      cursor: 'pointer',
      background: colors.neutral[100],
      transition: 'all 0.2s ease'
    };

    const imageStyles: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.2s ease'
    };

    const overlayStyles: React.CSSProperties = {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
      opacity: 0,
      transition: 'opacity 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm
    };

    const infoStyles: React.CSSProperties = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
      padding: spacing.md,
      color: 'white'
    };

    return (
      <div
        key={photo.id}
        style={photoStyles}
        onClick={() => openLightbox(photo, index)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = shadows.lg;
          const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
          if (overlay) overlay.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          const overlay = e.currentTarget.querySelector('[data-overlay]') as HTMLElement;
          if (overlay) overlay.style.opacity = '0';
        }}
      >
        <img
          src={photo.url}
          alt={photo.title || 'Pharmacy photo'}
          style={imageStyles}
          loading="lazy"
        />
        
        <div data-overlay style={overlayStyles}>
          <Button
            variant="ghost"
            size="sm"
            icon={<Eye size={16} />}
            style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(photo, index);
            }}
          />
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={16} />}
              style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo);
              }}
            />
          )}
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Share2 size={16} />}
              style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
              onClick={(e) => {
                e.stopPropagation();
                onShare(photo);
              }}
            />
          )}
        </div>
        
        <div style={infoStyles}>
          {photo.title && (
            <h4 style={{
              fontSize: '14px',
              fontWeight: 600,
              margin: 0,
              marginBottom: spacing.xs
            }}>
              {photo.title}
            </h4>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            fontSize: '12px',
            opacity: 0.9
          }}>
            <span>{formatDate(photo.uploadedAt)}</span>
            {showLikes && photo.likes !== undefined && (
              <>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <Heart size={12} fill={photo.isLiked ? 'currentColor' : 'none'} />
                  <span>{photo.likes}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderListPhoto = (photo: Photo, index: number) => {
    const itemStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      background: 'white',
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.sm,
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    };

    const imageStyles: React.CSSProperties = {
      width: '80px',
      height: '80px',
      borderRadius: borderRadius.md,
      objectFit: 'cover',
      background: colors.neutral[100],
      flexShrink: 0
    };

    return (
      <Card
        key={photo.id}
        style={itemStyles}
        onClick={() => openLightbox(photo, index)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadows.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <img
          src={photo.url}
          alt={photo.title || 'Pharmacy photo'}
          style={imageStyles}
        />
        
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: 600,
            color: colors.neutral[800],
            margin: 0,
            marginBottom: spacing.xs
          }}>
            {photo.title || 'Pharmacy Photo'}
          </h4>
          
          {photo.description && (
            <p style={{
              fontSize: '14px',
              color: colors.neutral[600],
              margin: 0,
              marginBottom: spacing.sm,
              lineHeight: 1.4
            }}>
              {photo.description}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.sm,
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', color: colors.neutral[500] }}>
              {formatDate(photo.uploadedAt)}
            </span>
            {photo.uploadedBy && (
              <>
                <span style={{ fontSize: '12px', color: colors.neutral[400] }}>•</span>
                <span style={{ fontSize: '12px', color: colors.neutral[500] }}>
                  by {photo.uploadedBy}
                </span>
              </>
            )}
            {showLikes && photo.likes !== undefined && (
              <>
                <span style={{ fontSize: '12px', color: colors.neutral[400] }}>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                  <Heart size={12} fill={photo.isLiked ? colors.error : 'none'} color={photo.isLiked ? colors.error : colors.neutral[400]} />
                  <span style={{ fontSize: '12px', color: colors.neutral[500] }}>
                    {photo.likes}
                  </span>
                </div>
              </>
            )}
            {photo.tags && photo.tags.length > 0 && (
              <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
                {photo.tags.slice(0, 3).map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="neutral" size="sm">
                    {tag}
                  </Badge>
                ))}
                {photo.tags.length > 3 && (
                  <Badge variant="neutral" size="sm">
                    +{photo.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
          {onLike && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Heart size={16} fill={photo.isLiked ? colors.error : 'none'} color={photo.isLiked ? colors.error : colors.neutral[400]} />}
              onClick={(e) => {
                e.stopPropagation();
                onLike(photo.id);
              }}
            />
          )}
          {onDownload && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Download size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo);
              }}
            />
          )}
          {onShare && (
            <Button
              variant="ghost"
              size="sm"
              icon={<Share2 size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onShare(photo);
              }}
            />
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              icon={<X size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(photo.id);
              }}
              style={{ color: colors.error }}
            />
          )}
        </div>
      </Card>
    );
  };

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    ...style
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  };

  const lightboxStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: spacing.lg
  };

  const lightboxImageStyles: React.CSSProperties = {
    maxWidth: '90%',
    maxHeight: '90%',
    objectFit: 'contain',
    borderRadius: borderRadius.lg
  };

  const lightboxControlsStyles: React.CSSProperties = {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    display: 'flex',
    gap: spacing.sm
  };

  const lightboxNavStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: borderRadius.full,
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'white',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.neutral[800], margin: 0 }}>
          Photo Gallery
        </h2>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'outline'}
            size="sm"
            icon={<Grid size={16} />}
            onClick={() => setViewMode('grid')}
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'outline'}
            size="sm"
            icon={<List size={16} />}
            onClick={() => setViewMode('list')}
          />
        </div>
      </div>

      {/* Photos Display */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(250px, 1fr))' : 'none',
        flexDirection: viewMode === 'list' ? 'column' : 'row',
        gap: spacing.md
      }}>
        {displayedPhotos.map((photo, index) =>
          viewMode === 'grid' ? renderGridPhoto(photo, index) : renderListPhoto(photo, index)
        )}
      </div>

      {/* Show More Button */}
      {hasMorePhotos && (
        <div style={{ textAlign: 'center' }}>
          <Button
            variant="outline"
            size="md"
            onClick={() => {/* Handle show more */}}
          >
            Show {photos.length - maxPhotos} More Photos
          </Button>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: spacing.xl,
          color: colors.neutral[500]
        }}>
          <Camera size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, marginBottom: spacing.sm }}>
            No photos yet
          </h3>
          <p style={{ fontSize: '14px', margin: 0 }}>
            Photos will appear here when they're uploaded.
          </p>
        </div>
      )}

      {/* Lightbox */}
      {showLightbox && selectedPhoto && (
        <div style={lightboxStyles} onClick={closeLightbox}>
          <div style={lightboxControlsStyles}>
            {onDownload && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Download size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(selectedPhoto);
                }}
                style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
              />
            )}
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                icon={<Share2 size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  onShare(selectedPhoto);
                }}
                style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
              />
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={<X size={16} />}
              onClick={closeLightbox}
              style={{ color: 'white', background: 'rgba(255,255,255,0.2)' }}
            />
          </div>
          
          <button
            style={{ ...lightboxNavStyles, left: spacing.lg }}
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto('prev');
            }}
          >
            <ChevronLeft size={24} />
          </button>
          
          <img
            src={selectedPhoto.url}
            alt={selectedPhoto.title || 'Pharmacy photo'}
            style={lightboxImageStyles}
            onClick={(e) => e.stopPropagation()}
          />
          
          <button
            style={{ ...lightboxNavStyles, right: spacing.lg }}
            onClick={(e) => {
              e.stopPropagation();
              navigatePhoto('next');
            }}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactPhotoGallery: React.FC<PhotoGalleryProps> = (props) => (
  <PhotoGallery
    {...props}
    viewMode="grid"
    maxPhotos={6}
    showControls={false}
    style={{
      ...props.style,
      gap: spacing.sm
    }}
  />
);

// Photo upload component
export const PhotoUpload: React.FC<{
  onPhotoUpload: (file: File) => void;
  maxPhotos?: number;
  currentCount?: number;
  style?: React.CSSProperties;
}> = ({ onPhotoUpload, maxPhotos = 10, currentCount = 0, style }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      onPhotoUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => handleFileSelect(file));
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => handleFileSelect(file));
  };

  const isMaxReached = currentCount >= maxPhotos;

  return (
    <div
      style={{
        border: `2px dashed ${isDragOver ? colors.primary : colors.neutral[300]}`,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        textAlign: 'center',
        background: isDragOver ? colors.primary + '10' : colors.neutral[50],
        transition: 'all 0.2s ease',
        cursor: isMaxReached ? 'not-allowed' : 'pointer',
        opacity: isMaxReached ? 0.5 : 1,
        ...style
      }}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isMaxReached) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onClick={() => {
        if (!isMaxReached) {
          document.getElementById('photo-upload-input')?.click();
        }
      }}
    >
      <input
        id="photo-upload-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInput}
        style={{ display: 'none' }}
        disabled={isMaxReached}
      />
      
      <Camera size={48} color={isMaxReached ? colors.neutral[400] : colors.primary} style={{ marginBottom: spacing.md }} />
      
      <h3 style={{
        fontSize: '18px',
        fontWeight: 600,
        color: isMaxReached ? colors.neutral[400] : colors.neutral[800],
        margin: 0,
        marginBottom: spacing.sm
      }}>
        {isMaxReached ? 'Maximum photos reached' : 'Upload Photos'}
      </h3>
      
      <p style={{
        fontSize: '14px',
        color: isMaxReached ? colors.neutral[400] : colors.neutral[600],
        margin: 0,
        marginBottom: spacing.md
      }}>
        {isMaxReached 
          ? `You've reached the maximum of ${maxPhotos} photos.`
          : 'Drag and drop images here or click to browse'
        }
      </p>
      
      {!isMaxReached && (
        <Button
          variant="primary"
          size="md"
          icon={<Camera size={16} />}
        >
          Choose Photos
        </Button>
      )}
      
      <p style={{
        fontSize: '12px',
        color: colors.neutral[500],
        margin: 0,
        marginTop: spacing.sm
      }}>
        {currentCount} of {maxPhotos} photos uploaded
      </p>
    </div>
  );
};
