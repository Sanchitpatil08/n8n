import { Badge } from "@/components/ui/badge";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface SimpleCategoryChartProps {
  data: CategoryData[];
}

const CATEGORY_COLORS = {
  'Primary': 'bg-blue-500',
  'Promotional': 'bg-purple-500',
  'Spam': 'bg-red-500',
  'Social': 'bg-yellow-500',
  'Updates': 'bg-orange-500',
  'Forums': 'bg-green-500',
  'Customer Support': 'bg-blue-500',
  'Newsletter': 'bg-green-500',
  'Unlabeled': 'bg-gray-400'
};

export function SimpleCategoryChart({ data }: SimpleCategoryChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Visual Bar Chart */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {data.slice(0, 6).map((item) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          const colorClass = CATEGORY_COLORS[item.name as keyof typeof CATEGORY_COLORS] || 'bg-gray-400';
          
          return (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-2 h-2 rounded-full ${colorClass} flex-shrink-0`} />
                  <span className="font-medium text-dashboard-primary truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-muted-foreground">{item.value}</span>
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {percentage.toFixed(0)}%
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${colorClass}`}
                  style={{ width: `${Math.max(percentage, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="pt-3 mt-3 border-t border-border flex-shrink-0">
        <div className="text-center">
          <p className="text-lg font-bold text-dashboard-primary">{total}</p>
          <p className="text-xs text-muted-foreground">Total Emails</p>
        </div>
      </div>
    </div>
  );
}

export default SimpleCategoryChart;