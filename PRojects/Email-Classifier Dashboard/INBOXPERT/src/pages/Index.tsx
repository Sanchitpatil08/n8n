import { 
  Mail, 
  RefreshCw,
  Tag,
  TrendingUp,
  FileText,
  AlertCircle
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { SimpleCategoryChart } from "@/components/dashboard/SimpleCategoryChart";
import { SheetEmailList } from "@/components/dashboard/SheetEmailList";
import { useEmailData } from "@/hooks/useEmailData";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const { emails, stats, loading, error, refetch } = useEmailData();
  
  const chartData = Object.entries(stats.categories).map(([name, value]) => ({
    name,
    value,
    color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`
  }));

  const classificationAccuracy = stats.total > 0 ? ((stats.labeled / stats.total) * 100).toFixed(1) : '0';

  if (error) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refetch} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-dashboard-primary">Email Classification Dashboard</h1>
            <p className="text-muted-foreground">
              📧 Analyzing <strong>{stats.total}</strong> emails from Google Sheets. 
              <strong> {stats.labeled}</strong> are classified, 
              <strong> {stats.unlabeled}</strong> need attention.
            </p>
          </div>
          <Button 
            onClick={refetch} 
            disabled={loading}
            variant="outline" 
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>

        {/* Simplified Stats Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Stats Column */}
          <div className="space-y-4">
            <StatCard
              title="Total Emails"
              value={stats.total}
              change="From Google Sheets"
              changeType="neutral"
              icon={<Mail className="w-5 h-5 text-dashboard-accent" />}
            />
            <StatCard
              title="Classified"
              value={stats.labeled}
              change={`${classificationAccuracy}% accuracy`}
              changeType="positive"
              icon={<Tag className="w-5 h-5 text-dashboard-success" />}
            />
          </div>
          
          {/* Right: Email Distribution Chart */}
          <div className="lg:col-span-2">
            <div className="bg-dashboard-surface-elevated rounded-lg border border-border/50 p-4 shadow-dashboard-sm h-full">
              <h3 className="text-sm font-semibold text-dashboard-primary mb-4 text-center">Email Distribution</h3>
              <div className="h-48 w-full">
                <SimpleCategoryChart data={chartData} />
              </div>
            </div>
          </div>
        </div>

        {/* Email Classification Section - Maximum Space */}
        <div className="w-full min-h-[800px]">
          <SheetEmailList emails={emails || []} />
        </div>

        {/* Google Sheets Integration Info */}
        <div className="text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>
            🔄 Auto-syncing with Google Sheets every 30 seconds • 
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;