import React, { useState } from 'react';
import { Pill, Search, Filter, Grid, List, Star, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { Input } from './Input';
import { StatusIcon } from './StatusIcon';
import { PriceDisplay } from './PriceDisplay';
import type { Medicine } from '../types';

export interface MedicineInventoryProps {
  medicines: Medicine[];
  onMedicineClick?: (medicine: Medicine) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  viewMode?: 'grid' | 'list';
  style?: React.CSSProperties;
}

export const MedicineInventory: React.FC<MedicineInventoryProps> = ({
  medicines,
  onMedicineClick,
  showFilters = true,
  showSearch = true,
  viewMode: initialViewMode = 'grid',
  style
}) => {
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>(medicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode);

  // Filter and search medicines
  React.useEffect(() => {
    let filtered = [...medicines];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(query) ||
        medicine.genericName?.toLowerCase().includes(query) ||
        medicine.manufacturer?.toLowerCase().includes(query) ||
        medicine.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(medicine => medicine.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(medicine => medicine.availability === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return (a.price || 0) - (b.price || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'newest':
          return new Date(b.id).getTime() - new Date(a.id).getTime();
        default:
          return 0;
      }
    });

    setFilteredMedicines(filtered);
  }, [medicines, searchQuery, categoryFilter, statusFilter, sortBy]);

  const getCategories = () => {
    const categories = [...new Set(medicines.map(medicine => medicine.category).filter(Boolean))];
    return categories;
  };

  const getStatusCounts = () => {
    const counts = {
      in_stock: 0,
      low_stock: 0,
      out_of_stock: 0,
      unknown: 0
    };
    
    medicines.forEach(medicine => {
      if (medicine.availability) {
        counts[medicine.availability as keyof typeof counts]++;
      }
    });
    
    return counts;
  };

  const renderMedicineCard = (medicine: Medicine) => {
    const cardStyles: React.CSSProperties = {
      padding: spacing.md,
      background: 'white',
      borderRadius: borderRadius.lg,
      border: `1px solid ${colors.neutral[200]}`,
      boxShadow: shadows.sm,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    };

    const headerStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: spacing.sm
    };

    const titleStyles: React.CSSProperties = {
      fontSize: '16px',
      fontWeight: 600,
      color: colors.neutral[800],
      margin: 0,
      marginBottom: spacing.xs,
      lineHeight: 1.3
    };

    const subtitleStyles: React.CSSProperties = {
      fontSize: '13px',
      color: colors.neutral[600],
      margin: 0
    };

    const metaStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
      flexWrap: 'wrap'
    };

    const footerStyles: React.CSSProperties = {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: spacing.sm,
      borderTop: `1px solid ${colors.neutral[100]}`
    };

    return (
      <Card
        key={medicine.id}
        style={cardStyles}
        onClick={() => onMedicineClick?.(medicine)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadows.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={headerStyles}>
          <div style={{ flex: 1 }}>
            <h3 style={titleStyles}>{medicine.name}</h3>
            {medicine.genericName && (
              <p style={subtitleStyles}>{medicine.genericName}</p>
            )}
          </div>
          <StatusIcon
            status={medicine.availability || 'unknown'}
            size="sm"
            showLabel={false}
          />
        </div>

        <div style={metaStyles}>
          {medicine.category && (
            <Badge variant="info" size="sm">
              {medicine.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          )}
          {medicine.form && (
            <Badge variant="neutral" size="sm">
              {medicine.form}
            </Badge>
          )}
          {medicine.strength && (
            <Badge variant="outline" size="sm">
              {medicine.strength}
            </Badge>
          )}
        </div>

        {medicine.description && (
          <p style={{
            fontSize: '13px',
            color: colors.neutral[600],
            margin: 0,
            marginBottom: spacing.sm,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {medicine.description}
          </p>
        )}

        <div style={footerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {medicine.price && (
              <PriceDisplay
                price={medicine.price}
                originalPrice={medicine.originalPrice}
                currency={medicine.currency}
                size="sm"
                compact={true}
              />
            )}
            {medicine.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
                <Star size={12} fill={colors.warning} color={colors.warning} />
                <span style={{ fontSize: '12px', color: colors.neutral[600] }}>
                  {medicine.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          
        </div>
      </Card>
    );
  };

  const renderMedicineListItem = (medicine: Medicine) => {
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

    return (
      <Card
        key={medicine.id}
        style={itemStyles}
        onClick={() => onMedicineClick?.(medicine)}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = shadows.md;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = shadows.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <div style={{ color: colors.primary }}>
          <Pill size={24} />
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 600,
              color: colors.neutral[800],
              margin: 0
            }}>
              {medicine.name}
            </h3>
            <StatusIcon
              status={medicine.availability || 'unknown'}
              size="sm"
              showLabel={true}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' }}>
            {medicine.genericName && (
              <span style={{ fontSize: '13px', color: colors.neutral[600] }}>
                {medicine.genericName}
              </span>
            )}
            {medicine.strength && (
              <Badge variant="outline" size="sm">
                {medicine.strength}
              </Badge>
            )}
            {medicine.form && (
              <Badge variant="neutral" size="sm">
                {medicine.form}
              </Badge>
            )}
            {medicine.category && (
              <Badge variant="info" size="sm">
                {medicine.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md }}>
          {medicine.price && (
            <PriceDisplay
              price={medicine.price}
              originalPrice={medicine.originalPrice}
              currency={medicine.currency}
              size="sm"
              compact={true}
            />
          )}
          
          {medicine.rating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>
              <Star size={14} fill={colors.warning} color={colors.warning} />
              <span style={{ fontSize: '13px', color: colors.neutral[600] }}>
                {medicine.rating.toFixed(1)}
              </span>
            </div>
          )}
          
        </div>
      </Card>
    );
  };

  const categories = getCategories();
  const statusCounts = getStatusCounts();

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

  const statsStyles: React.CSSProperties = {
    display: 'flex',
    gap: spacing.md,
    marginBottom: spacing.lg,
    flexWrap: 'wrap'
  };

  const statCardStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    background: 'white',
    borderRadius: borderRadius.md,
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.neutral[800], margin: 0 }}>
          Medicine Inventory
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

      {/* Statistics */}
      <div style={statsStyles}>
        <div style={statCardStyles}>
          <Package size={16} color={colors.primary} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.neutral[800] }}>
            {medicines.length} Total
          </span>
        </div>
        
        <div style={statCardStyles}>
          <CheckCircle size={16} color={colors.success} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.neutral[800] }}>
            {statusCounts.in_stock} In Stock
          </span>
        </div>
        
        <div style={statCardStyles}>
          <AlertTriangle size={16} color={colors.warning} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.neutral[800] }}>
            {statusCounts.low_stock} Low Stock
          </span>
        </div>
        
        <div style={statCardStyles}>
          <XCircle size={16} color={colors.error} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.neutral[800] }}>
            {statusCounts.out_of_stock} Out of Stock
          </span>
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
                placeholder="Search medicines..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
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
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="rating">Sort by Rating</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </>
          )}
        </div>
      )}

      {/* Medicines Display */}
      <div style={{
        display: viewMode === 'grid' ? 'grid' : 'flex',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none',
        flexDirection: viewMode === 'list' ? 'column' : 'row',
        gap: spacing.md
      }}>
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map(medicine =>
            viewMode === 'grid' ? renderMedicineCard(medicine) : renderMedicineListItem(medicine)
          )
        ) : (
          <div style={{
            textAlign: 'center',
            padding: spacing.xl,
            color: colors.neutral[500],
            gridColumn: viewMode === 'grid' ? '1 / -1' : 'auto'
          }}>
            <Pill size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, marginBottom: spacing.sm }}>
              No medicines found
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No medicines available in this pharmacy.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactMedicineInventory: React.FC<MedicineInventoryProps> = (props) => (
  <MedicineInventory
    {...props}
    showFilters={false}
    showSearch={false}
    viewMode="list"
    style={{
      ...props.style,
      gap: spacing.sm
    }}
  />
);
