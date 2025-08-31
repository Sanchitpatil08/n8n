import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SheetEmail } from "@/services/GoogleSheetsService";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Mail, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SheetEmailListProps {
  emails: SheetEmail[];
  title?: string;
  showFilters?: boolean;
}

const LABEL_COLORS: Record<string, string> = {
  'Customer Support': 'bg-blue-500',
  'Spam': 'bg-red-500',
  'Promotional': 'bg-purple-500',
  'Newsletter': 'bg-green-500',
  'Social': 'bg-yellow-500',
  'Updates': 'bg-orange-500',
  'Unlabeled': 'bg-gray-400'
};

export function SheetEmailList({ emails, title = "Email Classification", showFilters = true }: SheetEmailListProps) {
  const [selectedLabel, setSelectedLabel] = useState<string>("All");

  // Sort emails by newest first (assuming higher ID means more recent)
  const sortedEmails = [...emails].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  
  // Get all unique labels
  const labels = Array.from(new Set(sortedEmails.map(e => e.label || 'Unlabeled')));
  
  // Dynamic grid class based on number of categories
  const getGridClass = (categoryCount: number) => {
    if (categoryCount === 1) return "grid-cols-1";
    if (categoryCount === 2) return "grid-cols-1 md:grid-cols-2";
    if (categoryCount === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    if (categoryCount === 4) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
    if (categoryCount === 5) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";
    if (categoryCount === 6) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6";
    // For 7+ categories, use smaller columns
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6";
  };

  // Filter emails based on selected label
  const filteredEmails = selectedLabel === "All" 
    ? sortedEmails 
    : sortedEmails.filter(email => (email.label || 'Unlabeled') === selectedLabel);

  // Group emails by category and sort within each category by newest first
  const emailsByCategory = filteredEmails.reduce((acc, email) => {
    const category = email.label || 'Unlabeled';
    if (!acc[category]) acc[category] = [];
    acc[category].push(email);
    return acc;
  }, {} as Record<string, typeof emails>);

  // Sort emails within each category by newest first
  Object.keys(emailsByCategory).forEach(category => {
    emailsByCategory[category].sort((a, b) => parseInt(b.id) - parseInt(a.id));
  });

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const getLabelColor = (label: string) => {
    return LABEL_COLORS[label] || LABEL_COLORS['Unlabeled'];
  };

  const EmailCard = ({ email }: { email: SheetEmail }) => (
    <div
      key={email.id}
      onClick={() => window.open(`https://mail.google.com/mail/u/0/#inbox/${email.id}`, '_blank')}
      className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-dashboard-surface hover:bg-dashboard-surface-elevated transition-all duration-200 cursor-pointer hover:shadow-md group mb-3"
    >
      <Avatar className="w-12 h-12 flex-shrink-0">
        <AvatarFallback className="text-sm bg-dashboard-accent/10 group-hover:bg-dashboard-accent/20 transition-colors">
          {getInitials(email.senderEmail)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-2">
          <p className="text-sm font-medium text-dashboard-primary truncate pr-2">
            {email.senderEmail}
          </p>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs px-2 py-1 h-5 border-0 text-white flex-shrink-0",
              getLabelColor(email.label || 'Unlabeled')
            )}
          >
            {email.label || 'Unlabeled'}
          </Badge>
        </div>
        
        <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2 group-hover:text-dashboard-accent transition-colors">
          {email.subject || 'No Subject'}
        </h4>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>ID: {email.id}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="bg-dashboard-surface-elevated shadow-dashboard-sm border-border/50 h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-dashboard-primary">
            {title}
          </CardTitle>
          {showFilters && (
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedLabel}
                onChange={(e) => setSelectedLabel(e.target.value)}
                className="h-9 px-3 rounded-md border border-border/50 bg-dashboard-surface text-sm min-w-[140px]"
              >
                <option value="All">All Categories</option>
                {labels.map(label => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0 h-full">
        {filteredEmails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No emails found</p>
          </div>
        ) : selectedLabel === "All" ? (
          // Show emails grouped by category when "All" is selected - DYNAMIC COLUMNS
          <div className={`grid gap-6 ${getGridClass(labels.length)}`}>
            {labels.map((category) => {
              const categoryEmails = emailsByCategory[category] || [];
              if (categoryEmails.length === 0) return null;
              
              return (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 pb-3 border-b border-border/50 sticky top-0 bg-dashboard-surface-elevated z-10">
                    <div className={cn(
                      "w-4 h-4 rounded-full",
                      getLabelColor(category)
                    )}></div>
                    <h3 className="text-base font-semibold text-dashboard-primary truncate">
                      {category}
                    </h3>
                    <Badge variant="outline" className="text-sm ml-auto">
                      {categoryEmails.length}
                    </Badge>
                  </div>
                  
                  {/* Category Emails */}
                  <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    {categoryEmails.map((email) => (
                      <EmailCard key={email.id} email={email} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Show emails in a simple list when a specific category is selected
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredEmails.map((email) => (
              <EmailCard key={email.id} email={email} />
            ))}
          </div>
        )}
        
        {/* Enhanced Summary Stats */}
        {filteredEmails.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-dashboard-surface rounded-lg p-3">
                <div className="text-2xl font-bold text-dashboard-primary">{filteredEmails.length}</div>
                <div className="text-xs text-muted-foreground">Total Emails</div>
              </div>
              <div className="bg-dashboard-surface rounded-lg p-3">
                <div className="text-2xl font-bold text-dashboard-primary">{Object.keys(emailsByCategory).length}</div>
                <div className="text-xs text-muted-foreground">Categories</div>
              </div>
              <div className="bg-dashboard-surface rounded-lg p-3">
                <div className="text-2xl font-bold text-dashboard-primary">
                  {Math.max(...Object.values(emailsByCategory).map(arr => arr.length))}
                </div>
                <div className="text-xs text-muted-foreground">Largest Category</div>
              </div>
              <div className="bg-dashboard-surface rounded-lg p-3">
                <div className="text-2xl font-bold text-dashboard-primary">
                  {sortedEmails.length > 0 ? sortedEmails[0].id : '—'}
                </div>
                <div className="text-xs text-muted-foreground">Latest Email ID</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SheetEmailList;