import { useState, useEffect, useCallback } from "react";
import { SheetEmail, EmailStats, GoogleSheetsService } from "@/services/GoogleSheetsService";
import { useToast } from "@/hooks/use-toast";

export function useEmailData() {
  const [emails, setEmails] = useState<SheetEmail[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    labeled: 0,
    unlabeled: 0,
    categories: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const emailData = await GoogleSheetsService.fetchEmailData();
      const emailStats = GoogleSheetsService.calculateStats(emailData);
      
      setEmails(emailData);
      setStats(emailStats);
      
      toast({
        title: "Data Synced",
        description: `Updated ${emailData.length} emails from Google Sheets`,
        duration: 3000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch email data';
      setError(errorMessage);
      toast({
        title: "Sync Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    fetchEmails();
  }, [fetchEmails]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchEmails, 30000);
    return () => clearInterval(interval);
  }, [fetchEmails]);

  return {
    emails,
    stats,
    loading,
    error,
    refetch: fetchEmails
  };
}