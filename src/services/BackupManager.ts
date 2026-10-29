import { Transaction, Account, Budget, Rule, FinancialGoal } from '../types';

export interface BackupData {
  version: string;
  timestamp: string;
  appName: string;
  data: {
    transactions: Transaction[];
    accounts: Account[];
    budget: Budget;
    rules: Rule[];
    goals: FinancialGoal[];
    activeArchetypeId: string;
    primaryCurrency: string;
  };
  checksum: string;
}

export class BackupManager {
  private static APP_VERSION = '2.0.0';

  private static generateChecksum(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  public static exportState(state: BackupData['data']): string {
    const backup: BackupData = {
      version: this.APP_VERSION,
      timestamp: new Date().toISOString(),
      appName: 'BudFit Cockpit',
      data: state,
      checksum: this.generateChecksum(state)
    };
    return JSON.stringify(backup, null, 2);
  }

  public static downloadBackupFile(state: BackupData['data'], filename = 'budfit_cockpit_backup.json') {
    const jsonStr = this.exportState(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  public static validateAndImport(jsonString: string): BackupData['data'] {
    try {
      const parsed: BackupData = JSON.parse(jsonString);
      if (!parsed.data || !parsed.checksum) {
        throw new Error('Invalid backup file structure.');
      }
      const calculatedChecksum = this.generateChecksum(parsed.data);
      if (calculatedChecksum !== parsed.checksum) {
        console.warn('Checksum mismatch in backup file. Importing anyway with caution.');
      }
      return parsed.data;
    } catch (err: any) {
      throw new Error(`Failed to import backup: ${err.message}`);
    }
  }
}
