import { Transaction, CalendarDay } from '../types';

export class CalendarEngine {
  public static generateMonthGrid(
    viewDate: Date,
    transactions: Transaction[],
    startingBalance: number = 50000
  ): CalendarDay[] {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Get starting day index (Monday = 0 ... Sunday = 6)
    let startDayIdx = firstDayOfMonth.getDay() - 1;
    if (startDayIdx === -1) startDayIdx = 6;

    const daysInMonth = lastDayOfMonth.getDate();
    const grid: CalendarDay[] = [];

    // Calculate month running liquidity starting balance
    let runningBalance = startingBalance;

    const todayStr = new Date().toISOString().split('T')[0];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      // Format as YYYY-MM-DD
      const monthStr = String(month + 1).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      const dateString = `${year}-${monthStr}-${dayStr}`;

      const dayTransactions = transactions.filter(t => {
        if (!t.date) return false;
        return t.date.startsWith(dateString);
      });

      const incomeTotal = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenseTotal = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      runningBalance += incomeTotal - expenseTotal;

      const hasBillDue = dayTransactions.some(t => t.isBillDue || t.categoryGroup === 'utilities');
      const isPayday = dayTransactions.some(t => t.isPayday || t.categoryGroup === 'income');
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday & Saturday in Egypt / Weekend

      grid.push({
        date: currentDate,
        dateString,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
        balance: runningBalance,
        transactions: dayTransactions,
        incomeTotal,
        expenseTotal,
        hasBillDue,
        isPayday,
        isWeekend
      });
    }

    return grid;
  }
}
