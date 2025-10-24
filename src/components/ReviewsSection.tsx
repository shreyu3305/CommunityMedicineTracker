import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, Flag, MoreHorizontal, Filter, Search, ChevronDown } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { Input } from './Input';

export interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    date: string;
    responder: string;
  };
}

export interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onAddReview?: () => void;
  onReportReview?: (reviewId: string) => void;
  onHelpful?: (reviewId: string) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  style?: React.CSSProperties;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  averageRating,
  totalReviews,
  onAddReview,
  onReportReview,
  onHelpful,
  showFilters = true,
  showSearch = true,
  style
}) => {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Filter and search reviews
  React.useEffect(() => {
    let filtered = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(review =>
        review.title.toLowerCase().includes(query) ||
        review.comment.toLowerCase().includes(query) ||
        review.userName.toLowerCase().includes(query)
      );
    }

    // Rating filter
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, searchQuery, ratingFilter, sortBy]);

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const starSize = size === 'sm' ? 12 : size === 'md' ? 16 : 20;
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={starSize}
            fill={star <= rating ? colors.warning : 'none'}
            color={star <= rating ? colors.warning : colors.neutral[300]}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const distribution = getRatingDistribution();
  const displayedReviews = showAllReviews ? filteredReviews : filteredReviews.slice(0, 5);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    ...style
  };

  const headerStyles: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md
  };

  const ratingSummaryStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg
  };

  const ratingNumberStyles: React.CSSProperties = {
    fontSize: '48px',
    fontWeight: 700,
    color: colors.neutral[800],
    lineHeight: 1
  };

  const ratingMetaStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs
  };

  const distributionStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    flex: 1
  };

  const distributionBarStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const barStyles: React.CSSProperties = {
    flex: 1,
    height: '8px',
    background: colors.neutral[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden'
  };

  const barFillStyles = (percentage: number): React.CSSProperties => ({
    height: '100%',
    background: colors.warning,
    borderRadius: borderRadius.full,
    width: `${percentage}%`,
    transition: 'width 0.3s ease'
  });

  const reviewItemStyles: React.CSSProperties = {
    padding: spacing.lg,
    background: 'white',
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm
  };

  const reviewHeaderStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.md
  };

  const avatarStyles: React.CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: borderRadius.full,
    background: colors.primary + '20',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 600,
    color: colors.primary,
    flexShrink: 0
  };

  const reviewContentStyles: React.CSSProperties = {
    flex: 1
  };

  const reviewTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[800],
    margin: 0,
    marginBottom: spacing.xs
  };

  const reviewMetaStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
    fontSize: '12px',
    color: colors.neutral[600]
  };

  const reviewCommentStyles: React.CSSProperties = {
    fontSize: '14px',
    lineHeight: 1.6,
    color: colors.neutral[700],
    margin: 0,
    marginBottom: spacing.md
  };

  const reviewActionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.md,
    borderTop: `1px solid ${colors.neutral[100]}`
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.neutral[800], margin: 0 }}>
          Reviews & Ratings
        </h2>
        {onAddReview && (
          <Button
            variant="primary"
            size="md"
            onClick={onAddReview}
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Rating Summary */}
      <div style={ratingSummaryStyles}>
        <div>
          <div style={ratingNumberStyles}>
            {averageRating.toFixed(1)}
          </div>
          <div style={ratingMetaStyles}>
            {renderStars(Math.round(averageRating), 'lg')}
            <p style={{ fontSize: '14px', color: colors.neutral[600], margin: 0 }}>
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={distributionStyles}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            
            return (
              <div key={rating} style={distributionBarStyles}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: colors.neutral[600], minWidth: '20px' }}>
                  {rating}
                </span>
                <Star size={12} fill={colors.warning} color={colors.warning} />
                <div style={barStyles}>
                  <div style={barFillStyles(percentage)} />
                </div>
                <span style={{ fontSize: '12px', color: colors.neutral[500], minWidth: '30px' }}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      {(showSearch || showFilters) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing.md,
          padding: spacing.md,
          background: colors.neutral[50],
          borderRadius: borderRadius.lg,
          border: `1px solid ${colors.neutral[200]}`
        }}>
          {showSearch && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={16} />}
                style={{ width: '100%' }}
              />
            </div>
          )}
          
          {showFilters && (
            <>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </>
          )}
        </div>
      )}

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review) => (
            <Card key={review.id} style={reviewItemStyles}>
              <div style={reviewHeaderStyles}>
                <div style={avatarStyles}>
                  {review.userAvatar ? (
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: borderRadius.full,
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    review.userName.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div style={reviewContentStyles}>
                  <h4 style={reviewTitleStyles}>{review.title}</h4>
                  <div style={reviewMetaStyles}>
                    <span style={{ fontWeight: 600 }}>{review.userName}</span>
                    {review.verified && (
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    )}
                    <span>•</span>
                    {renderStars(review.rating, 'sm')}
                    <span>•</span>
                    <span>{formatDate(review.date)}</span>
                  </div>
                  <p style={reviewCommentStyles}>{review.comment}</p>
                  
                  {review.response && (
                    <div style={{
                      background: colors.neutral[50],
                      padding: spacing.md,
                      borderRadius: borderRadius.md,
                      border: `1px solid ${colors.neutral[200]}`,
                      marginTop: spacing.md
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing.sm,
                        marginBottom: spacing.xs
                      }}>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: colors.primary
                        }}>
                          Response from {review.response.responder}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          color: colors.neutral[500]
                        }}>
                          {formatDate(review.response.date)}
                        </span>
                      </div>
                      <p style={{
                        fontSize: '13px',
                        color: colors.neutral[700],
                        margin: 0,
                        lineHeight: 1.5
                      }}>
                        {review.response.text}
                      </p>
                    </div>
                  )}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<MoreHorizontal size={16} />}
                  onClick={() => onReportReview?.(review.id)}
                />
              </div>
              
              <div style={reviewActionsStyles}>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<ThumbsUp size={14} />}
                  onClick={() => onHelpful?.(review.id)}
                  style={{ color: colors.neutral[600] }}
                >
                  Helpful ({review.helpful})
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Flag size={14} />}
                  onClick={() => onReportReview?.(review.id)}
                  style={{ color: colors.error }}
                >
                  Report
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: spacing.xl,
            color: colors.neutral[500]
          }}>
            <Star size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, marginBottom: spacing.sm }}>
              No reviews found
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              {searchQuery || ratingFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Be the first to write a review!'}
            </p>
          </div>
        )}
        
        {filteredReviews.length > 5 && (
          <div style={{ textAlign: 'center', marginTop: spacing.md }}>
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowAllReviews(!showAllReviews)}
              icon={<ChevronDown size={16} style={{
                transform: showAllReviews ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} />}
            >
              {showAllReviews ? 'Show Less' : `Show All ${filteredReviews.length} Reviews`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactReviewsSection: React.FC<ReviewsSectionProps> = (props) => (
  <ReviewsSection
    {...props}
    showFilters={false}
    showSearch={false}
    style={{
      ...props.style,
      gap: spacing.sm
    }}
  />
);

// Review summary card
export const ReviewSummary: React.FC<{
  averageRating: number;
  totalReviews: number;
  style?: React.CSSProperties;
}> = ({ averageRating, totalReviews, style }) => {
  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? colors.warning : 'none'}
            color={star <= rating ? colors.warning : colors.neutral[300]}
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      background: 'white',
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.sm,
      ...style
    }}>
      <div style={{
        fontSize: '32px',
        fontWeight: 700,
        color: colors.neutral[800],
        lineHeight: 1
      }}>
        {averageRating.toFixed(1)}
      </div>
      
      <div style={{ flex: 1 }}>
        {renderStars(Math.round(averageRating))}
        <p style={{
          fontSize: '12px',
          color: colors.neutral[600],
          margin: 0,
          marginTop: spacing.xs
        }}>
          {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};
