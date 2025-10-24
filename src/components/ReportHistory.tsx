import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Pill, CheckCircle, XCircle, AlertTriangle, Eye, Trash2, Download, Filter, Search } from 'lucide-react';
import { colors, spacing, borderRadius, shadows } from '../styles/tokens';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { Input } from './Input';

export interface ReportHistoryItem {
  id: string;
  timestamp: number;
  pharmacyName: string;
  medicineName: string;
  status: 'available' | 'unavailable' | 'pending' | 'verified' | 'rejected';
  location?: string;
  notes?: string;
  photos?: string[];
  verifiedBy?: string;
  verifiedAt?: number;
  response?: string;
}

export interface ReportHistoryProps {
  reports: ReportHistoryItem[];
  onViewReport?: (report: ReportHistoryItem) => void;
  onDeleteReport?: (reportId: string) => void;
  onExportReports?: (reports: ReportHistoryItem[]) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  style?: React.CSSProperties;
}

export const ReportHistory: React.FC<ReportHistoryProps> = ({
  reports,
  onViewReport,
  onDeleteReport,
  onExportReports,
  showFilters = true,
  showSearch = true,
  style
}) => {
  const [filteredReports, setFilteredReports] = useState<ReportHistoryItem[]>(reports);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'pharmacy' | 'medicine'>('newest');

  // Filter and search reports
  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(report =>
        report.pharmacyName.toLowerCase().includes(query) ||
        report.medicineName.toLowerCase().includes(query) ||
        report.location?.toLowerCase().includes(query) ||
        report.notes?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Date filter
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter(report => (now - report.timestamp) < oneDay);
        break;
      case 'week':
        filtered = filtered.filter(report => (now - report.timestamp) < oneWeek);
        break;
      case 'month':
        filtered = filtered.filter(report => (now - report.timestamp) < oneMonth);
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp;
        case 'oldest':
          return a.timestamp - b.timestamp;
        case 'pharmacy':
          return a.pharmacyName.localeCompare(b.pharmacyName);
        case 'medicine':
          return a.medicineName.localeCompare(b.medicineName);
        default:
          return 0;
      }
    });

    setFilteredReports(filtered);
  }, [reports, searchQuery, statusFilter, dateFilter, sortBy]);

  const getStatusInfo = (status: string) => {
    const statusMap = {
      available: {
        label: 'Available',
        icon: <CheckCircle size={16} />,
        color: colors.success,
        background: colors.success + '15'
      },
      unavailable: {
        label: 'Unavailable',
        icon: <XCircle size={16} />,
        color: colors.error,
        background: colors.error + '15'
      },
      pending: {
        label: 'Pending',
        icon: <Clock size={16} />,
        color: colors.warning,
        background: colors.warning + '15'
      },
      verified: {
        label: 'Verified',
        icon: <CheckCircle size={16} />,
        color: colors.primary,
        background: colors.primary + '15'
      },
      rejected: {
        label: 'Rejected',
        icon: <XCircle size={16} />,
        color: colors.error,
        background: colors.error + '15'
      }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.pending;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
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

  const filtersStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.md,
    background: colors.neutral[50],
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.neutral[200]}`
  };

  const reportItemStyles: React.CSSProperties = {
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

  const reportInfoStyles: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs
  };

  const reportTitleStyles: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 600,
    color: colors.neutral[800],
    margin: 0
  };

  const reportSubtitleStyles: React.CSSProperties = {
    fontSize: '14px',
    color: colors.neutral[600],
    margin: 0
  };

  const reportMetaStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.neutral[500],
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const actionsStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  return (
    <div style={containerStyles}>
      <div style={headerStyles}>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: colors.neutral[800], margin: 0 }}>
          Report History
        </h2>
        <div style={{ display: 'flex', gap: spacing.sm }}>
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={16} />}
            onClick={() => onExportReports?.(filteredReports)}
          >
            Export
          </Button>
        </div>
      </div>

      {(showSearch || showFilters) && (
        <div style={filtersStyles}>
          {showSearch && (
            <div style={{ flex: 1, minWidth: '200px' }}>
              <Input
                placeholder="Search reports..."
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
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  padding: `${spacing.sm} ${spacing.md}`,
                  border: `1px solid ${colors.neutral[300]}`,
                  borderRadius: borderRadius.md,
                  background: 'white',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
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
                <option value="pharmacy">By Pharmacy</option>
                <option value="medicine">By Medicine</option>
              </select>
            </>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const statusInfo = getStatusInfo(report.status);
            
            return (
              <Card
                key={report.id}
                style={reportItemStyles}
                onClick={() => onViewReport?.(report)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = shadows.md;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = shadows.sm;
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ color: statusInfo.color }}>
                  {statusInfo.icon}
                </div>
                
                <div style={reportInfoStyles}>
                  <h3 style={reportTitleStyles}>
                    {report.medicineName} at {report.pharmacyName}
                  </h3>
                  <p style={reportSubtitleStyles}>
                    {report.location && (
                      <>
                        <MapPin size={12} style={{ marginRight: spacing.xs }} />
                        {report.location}
                      </>
                    )}
                  </p>
                  <div style={reportMetaStyles}>
                    <span>
                      <Clock size={12} style={{ marginRight: spacing.xs }} />
                      {formatTimestamp(report.timestamp)}
                    </span>
                    {report.photos && report.photos.length > 0 && (
                      <span>
                        📷 {report.photos.length} photo{report.photos.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={actionsStyles}>
                  <Badge
                    variant={report.status === 'available' || report.status === 'verified' ? 'success' : 
                           report.status === 'unavailable' || report.status === 'rejected' ? 'error' : 'warning'}
                    style={{
                      background: statusInfo.background,
                      color: statusInfo.color,
                      border: `1px solid ${statusInfo.color}40`
                    }}
                  >
                    {statusInfo.label}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewReport?.(report);
                    }}
                  />
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 size={16} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteReport?.(report.id);
                    }}
                    style={{ color: colors.error }}
                  />
                </div>
              </Card>
            );
          })
        ) : (
          <div style={{
            textAlign: 'center',
            padding: spacing.xl,
            color: colors.neutral[500]
          }}>
            <Pill size={48} style={{ marginBottom: spacing.md, opacity: 0.5 }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, marginBottom: spacing.sm }}>
              No reports found
            </h3>
            <p style={{ fontSize: '14px', margin: 0 }}>
              {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'You haven\'t submitted any reports yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Compact version for smaller spaces
export const CompactReportHistory: React.FC<ReportHistoryProps> = (props) => (
  <ReportHistory
    {...props}
    showFilters={false}
    showSearch={false}
    style={{
      ...props.style,
      gap: spacing.sm
    }}
  />
);

// Report statistics component
export const ReportStatistics: React.FC<{
  reports: ReportHistoryItem[];
  style?: React.CSSProperties;
}> = ({ reports, style }) => {
  const stats = {
    total: reports.length,
    available: reports.filter(r => r.status === 'available').length,
    unavailable: reports.filter(r => r.status === 'unavailable').length,
    pending: reports.filter(r => r.status === 'pending').length,
    verified: reports.filter(r => r.status === 'verified').length,
    rejected: reports.filter(r => r.status === 'rejected').length
  };

  const containerStyles: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: spacing.md,
    ...style
  };

  const statCardStyles: React.CSSProperties = {
    background: 'white',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    textAlign: 'center',
    border: `1px solid ${colors.neutral[200]}`,
    boxShadow: shadows.sm
  };

  const statValueStyles: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 700,
    color: colors.neutral[800],
    margin: 0
  };

  const statLabelStyles: React.CSSProperties = {
    fontSize: '12px',
    color: colors.neutral[600],
    margin: 0,
    marginTop: spacing.xs
  };

  return (
    <div style={containerStyles}>
      <div style={statCardStyles}>
        <h3 style={statValueStyles}>{stats.total}</h3>
        <p style={statLabelStyles}>Total Reports</p>
      </div>
      
      <div style={statCardStyles}>
        <h3 style={{ ...statValueStyles, color: colors.success }}>{stats.available}</h3>
        <p style={statLabelStyles}>Available</p>
      </div>
      
      <div style={statCardStyles}>
        <h3 style={{ ...statValueStyles, color: colors.error }}>{stats.unavailable}</h3>
        <p style={statLabelStyles}>Unavailable</p>
      </div>
      
      <div style={statCardStyles}>
        <h3 style={{ ...statValueStyles, color: colors.warning }}>{stats.pending}</h3>
        <p style={statLabelStyles}>Pending</p>
      </div>
      
      <div style={statCardStyles}>
        <h3 style={{ ...statValueStyles, color: colors.primary }}>{stats.verified}</h3>
        <p style={statLabelStyles}>Verified</p>
      </div>
      
      <div style={statCardStyles}>
        <h3 style={{ ...statValueStyles, color: colors.error }}>{stats.rejected}</h3>
        <p style={statLabelStyles}>Rejected</p>
      </div>
    </div>
  );
};
