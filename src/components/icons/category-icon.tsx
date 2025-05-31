import type { ReportCategory } from '@/types';
import {
  Wrench, Building, AlertTriangle, CarCrash, Droplets, CloudFog, Dog, ShieldAlert, TriangleAlert, Info, HelpCircle, Siren, Zap, TrafficCone, Trash2, SprayCan
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  category: ReportCategory;
}

export function CategoryIcon({ category, ...props }: CategoryIconProps) {
  switch (category) {
    case 'Infrastructure':
      return <Wrench {...props} />;
    case 'Obstacles':
      return <TrafficCone {...props} />;
    case 'Abandoned Vehicles':
      return <CarCrash {...props} />;
    case 'Drainage Issues':
      return <Droplets {...props} />;
    case 'Pollution':
      return <Trash2 {...props} />;
    case 'Abandoned Animals':
      return <Dog {...props} />;
    case 'Insecurity':
      return <ShieldAlert {...props} />;
    case 'Violence':
      return <Siren {...props} />;
    case 'Accidents':
      return <TriangleAlert {...props} />;
    case 'Other':
      return <HelpCircle {...props} />;
    default:
      return <Info {...props} />;
  }
}
