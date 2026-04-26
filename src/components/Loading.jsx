import { Loader2 } from "lucide-react";

export const Spinner = ({ size = 24, color = "var(--primary)" }) => (
  <div className="spinner-box" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
    <Loader2 className="animate-spin" size={size} color={color} />
  </div>
);

export const Skeleton = ({ height, width, circle, className = "" }) => (
  <div 
    className={`skeleton ${className}`} 
    style={{ 
      height: height || '20px', 
      width: width || '100%', 
      borderRadius: circle ? '50%' : '12px',
      marginBottom: '10px'
    }} 
  />
);

export const SkeletonCard = () => (
  <div className="card skeleton-card">
    <Skeleton height="24px" width="60%" />
    <Skeleton height="16px" width="100%" />
    <Skeleton height="16px" width="80%" />
  </div>
);
