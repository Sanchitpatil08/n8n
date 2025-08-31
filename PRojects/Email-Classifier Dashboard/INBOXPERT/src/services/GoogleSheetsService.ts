export interface SheetEmail {
  id: string;
  senderEmail: string;
  subject: string;
  label: string;
  timestamp?: string;
}

export interface EmailStats {
  total: number;
  labeled: number;
  unlabeled: number;
  categories: Record<string, number>;
}

export class GoogleSheetsService {
  private static readonly SHEET_URL = 'https://docs.google.com/spreadsheets/d/1UEnXQ_PPfAZj9qq3MSf0p2DlOICMCCmfqCoTAq66MsU/export?format=csv';
  
  static async fetchEmailData(): Promise<SheetEmail[]> {
    try {
      console.log('Fetching data from Google Sheets...');
      const response = await fetch(this.SHEET_URL);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const csvText = await response.text();
      return this.parseCSV(csvText);
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      throw new Error('Failed to fetch email data from Google Sheets');
    }
  }
  
  private static parseCSV(csvText: string): SheetEmail[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const emails: SheetEmail[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCSVLine(lines[i]);
      
      if (values.length >= 4) {
        const email: SheetEmail = {
          id: values[0]?.trim() || '',
          senderEmail: values[1]?.trim() || '',
          subject: values[2]?.trim() || '',
          label: values[3]?.trim() || 'Unlabeled',
          timestamp: new Date().toISOString() // Default timestamp since not in sheet
        };
        
        // Only add if we have at least an ID
        if (email.id) {
          emails.push(email);
        }
      }
    }
    
    console.log(`Parsed ${emails.length} emails from sheet`);
    return emails;
  }
  
  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }
  
  static calculateStats(emails: SheetEmail[]): EmailStats {
    const labeled = emails.filter(e => e.label && e.label !== 'Unlabeled').length;
    const categories = emails.reduce((acc, email) => {
      const label = email.label || 'Unlabeled';
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: emails.length,
      labeled,
      unlabeled: emails.length - labeled,
      categories
    };
  }
  
  static getEmailsByLabel(emails: SheetEmail[], label?: string): SheetEmail[] {
    if (!label || label === 'All') return emails;
    return emails.filter(email => email.label === label);
  }
}