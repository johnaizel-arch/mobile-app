import React, { useState, useMemo } from 'react';
import { 
  User, Lock, FileText, DollarSign, 
  PieChart, Settings, Plus, CreditCard, 
  Activity, ScanLine, LogOut, FileSpreadsheet,
  TrendingUp, TrendingDown, CheckCircle,
  Briefcase, Receipt, ChevronRight,
  LayoutDashboard, Wallet, Grid, ArrowLeft,
  Search, Filter, Clock, Calendar
} from 'lucide-react';

// --- Type Definitions ---
interface CurrentUser {
  name: string;
  role: string;
  id?: string;
  username?: string;
}

interface Invoice {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
}

interface CashFlowEntry {
  id: number;
  desc: string;
  type: string;
  amount: number;
  date: string;
  liquidated: boolean;
}

interface Expense {
  id: number;
  category: string;
  desc: string;
  amount: number;
  date: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  status: string;
  timeIn: string | null;
  timeOut: string | null;
  silCredits: number;
  payProcessed: boolean;
  daysWorked: number;
  overtimeHours: number;
}

interface AttendanceLog {
  date: string;
  timeIn: string | null;
  timeOut: string | null;
  status: string;
  overTime: number;
}

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface SystemUser {
  id: string;
  name: string;
  username: string;
  role: string;
  status: string;
}

export default function Welcome() {
  const [currentView, setCurrentView] = useState<string>('login');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null); 
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<string | null>(null); 
  const [hrTab, setHrTab] = useState<string>('directory');
  const [toast, setToast] = useState<string | null>(null);

  // --- Feature States ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [cashFilter, setCashFilter] = useState<string>('all');

  // --- Toast Notification System ---
  const showToastMessage = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // --- Dynamic Application State ---
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-1001', client: 'Acme Corp', amount: 1500.00, status: 'Paid', date: '2026-04-20' },
    { id: 'INV-1002', client: 'Global Tech', amount: 3200.00, status: 'Pending', date: '2026-04-25' },
    { id: 'INV-1003', client: 'StartUp Inc', amount: 850.00, status: 'Pending', date: '2026-04-26' },
  ]);

  const [cashFlow, setCashFlow] = useState<CashFlowEntry[]>([
    { id: 1, desc: 'Client Payment', type: 'in', amount: 1500.00, date: '2026-04-27', liquidated: false },
    { id: 2, desc: 'Office Supplies', type: 'out', amount: 120.00, date: '2026-04-27', liquidated: true },
    { id: 3, desc: 'Utility Bill', type: 'out', amount: 350.00, date: '2026-04-26', liquidated: true },
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, category: 'Utilities', desc: 'Electricity Bill', amount: 350.00, date: '2026-04-26' },
    { id: 2, category: 'Software', desc: 'Cloud Hosting', amount: 85.00, date: '2026-04-25' },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP-01', name: 'John Aizel Carrera', role: 'System Admin', status: 'Present', timeIn: '08:00 AM', timeOut: null, silCredits: 5, payProcessed: false, daysWorked: 14, overtimeHours: 10 },
    { id: 'EMP-02', name: 'Jane Smith', role: 'Accountant', status: 'Shift Ended', timeIn: '08:00 AM', timeOut: '05:00 PM', silCredits: 3, payProcessed: false, daysWorked: 14, overtimeHours: 2 },
    { id: 'EMP-03', name: 'Mike Johnson', role: 'Sales Agent', status: 'Absent', timeIn: null, timeOut: null, silCredits: 1.5, payProcessed: false, daysWorked: 12, overtimeHours: 5 },
  ]);

  const [myAttendance, setMyAttendance] = useState<AttendanceLog[]>([
    { date: 'Apr 27, 2026', timeIn: '08:00 AM', timeOut: '05:30 PM', status: 'Present', overTime: 0.5 },
    { date: 'Apr 26, 2026', timeIn: '08:15 AM', timeOut: '05:00 PM', status: 'Late', overTime: 0 },
    { date: 'Apr 25, 2026', timeIn: '07:55 AM', timeOut: '07:00 PM', status: 'Present', overTime: 2 },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    { id: 'LR-101', type: 'Service Incentive Leave (SIL)', startDate: '2026-04-10', endDate: '2026-04-11', status: 'Approved' }
  ]);

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    { id: 'U-001', name: 'John Aizel Carrera', username: 'admin', role: 'Administrator', status: 'Active' },
    { id: 'U-002', name: 'Jane Smith', username: 'jsmith', role: 'Employee', status: 'Active' },
  ]);

  // --- Calculated Dashboard Stats ---
  const dashboardStats = useMemo(() => {
    const cashIn = cashFlow.filter(c => c.type === 'in').reduce((sum, c) => sum + c.amount, 0);
    const cashOut = cashFlow.filter(c => c.type === 'out').reduce((sum, c) => sum + c.amount, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const cashBalance = 24500.00 + cashIn - cashOut; 
    const netProfit = 8250.00 + cashIn - totalExpenses; 

    return { cashBalance, netProfit, activeEmployees: employees.filter(e => e.status === 'Present').length };
  }, [cashFlow, expenses, employees]);

  // --- Navigation & Actions Handlers ---
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = (formData.get('username') as string).toLowerCase();
    
    if (username === 'admin') {
      setCurrentUser({ name: 'John Aizel', role: 'Administrator' });
      setCurrentView('dashboard');
      showToastMessage('Welcome back, Admin!');
    } else {
      setCurrentUser({ name: 'Jane Smith', role: 'Employee', id: 'EMP-02', username: 'jsmith' });
      setCurrentView('employee_dashboard');
      showToastMessage('Welcome back, Jane!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    showToastMessage('Logged out securely');
  };

  const navigateTo = (view: string) => setCurrentView(view);

  const liquidateTransaction = (id: number) => {
    setCashFlow(cashFlow.map(c => c.id === id ? { ...c, liquidated: true } : c));
    showToastMessage('Transaction Liquidated');
  };

  const processPayroll = (emp: Employee) => {
    const basePay = emp.daysWorked * 505;
    const overtimePay = (emp.overtimeHours || 0) * 80;
    const netPay = basePay + overtimePay;
    const today = new Date().toISOString().split('T')[0];
    
    setCashFlow(prev => [{ id: Date.now(), desc: `Payroll: ${emp.name}`, type: 'out', amount: netPay, date: today, liquidated: true }, ...prev]);
    setExpenses(prev => [{ id: Date.now(), category: 'Payroll', desc: `Salary: ${emp.name}`, amount: netPay, date: today }, ...prev]);
    setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, payProcessed: true } : e));
    
    showToastMessage(`Payroll processed for ${emp.name}`);
  };

  const handleSimulateScan = () => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const currentDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (currentUser?.role === 'Employee') {
      const existingLog = myAttendance.find(a => a.date === currentDate);
      
      if (!existingLog) {
        setMyAttendance([{ date: currentDate, timeIn: currentTime, timeOut: null, status: 'Present', overTime: 0 }, ...myAttendance]);
        setEmployees(prev => prev.map(emp => emp.id === currentUser.id ? { ...emp, status: 'Present', timeIn: currentTime, timeOut: null } : emp));
        showToastMessage(`Timed In successfully (${currentTime})`);
      } else if (!existingLog.timeOut) {
        let otHours = 0;
        if (now.getHours() >= 17) {
          otHours = now.getHours() - 17 + (now.getMinutes() / 60);
        }
        const roundedOt = parseFloat(otHours.toFixed(1));
        
        setMyAttendance(prev => prev.map(a => a.date === currentDate ? { ...a, timeOut: currentTime, status: 'Shift Ended', overTime: roundedOt } : a));
        setEmployees(prev => prev.map(emp => emp.id === currentUser.id ? { 
          ...emp, 
          status: 'Shift Ended', 
          timeOut: currentTime,
          daysWorked: emp.daysWorked + 1,
          overtimeHours: emp.overtimeHours + roundedOt
        } : emp));
        showToastMessage(`Timed Out successfully (${currentTime})`);
      } else {
        showToastMessage('Shift already completed for today.');
      }
    } 
    else {
      let msg = 'All shifts completed today';
      setEmployees(prev => {
        const updated = prev.map(emp => ({...emp}));
        const targetIdx = updated.findIndex(e => e.status === 'Absent' || e.status === 'Present');
        
        if (targetIdx >= 0) {
          const emp = updated[targetIdx];
          if (emp.status === 'Absent') {
            emp.status = 'Present';
            emp.timeIn = currentTime;
            msg = `${emp.name} Timed In (${currentTime})`;
          } else if (emp.status === 'Present') {
            emp.status = 'Shift Ended';
            emp.timeOut = currentTime;
            emp.daysWorked += 1;
            
            let otHours = 0;
            if (now.getHours() >= 17) {
              otHours = now.getHours() - 17 + (now.getMinutes() / 60);
            }
            const roundedOt = parseFloat(otHours.toFixed(1));
            emp.overtimeHours += roundedOt;
            msg = `${emp.name} Timed Out (+1 Day${roundedOt > 0 ? `, +${roundedOt}h OT` : ''})`;
          }
        }
        return updated;
      });
      showToastMessage(msg);
    }
    setIsScanning(false);
  };

  const handleCashFilterClick = () => {
    const nextFilter = cashFilter === 'all' ? 'in' : cashFilter === 'in' ? 'out' : 'all';
    setCashFilter(nextFilter);
    const filterNames: Record<string, string> = { 'all': 'All Transactions', 'in': 'Cash In Only', 'out': 'Cash Out Only' };
    showToastMessage(`Filtered by: ${filterNames[nextFilter]}`);
  };

  const handleDownloadPDF = () => {
    showToastMessage('Generating PDF Report...');
    setTimeout(() => showToastMessage('Report Downloaded Successfully'), 2000);
  };

  // --- Reusable UI Components Props & Implementation ---
  interface HeaderProps {
    title: string;
    showBack?: boolean;
    onBackClick?: () => void;
    rightIcon?: React.ElementType;
    onRightIconClick?: () => void;
  }
  const Header: React.FC<HeaderProps> = ({ title, showBack = false, onBackClick, rightIcon: RightIcon, onRightIconClick }) => (
    <div className="bg-[#FFFFFF] px-6 pt-12 pb-4 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center">
        {showBack && (
          <button onClick={onBackClick || (() => navigateTo(currentUser?.role === 'Administrator' ? 'menu' : 'employee_menu'))} className="mr-4 p-2 -ml-2 rounded-full hover:bg-[#F2F2F2] text-[#4D4D4D] transition">
            <ArrowLeft size={24} />
          </button>
        )}
        <h1 className="text-3xl font-black text-[#4D4D4D] tracking-tight">{title}</h1>
      </div>
      {RightIcon && (
        <button onClick={onRightIconClick || (() => showToastMessage('Feature coming soon'))} className="p-2 bg-[#F2F2F2] rounded-full text-[#4D4D4D] hover:bg-[#D9D9D9]/50 transition">
          <RightIcon size={20} />
        </button>
      )}
    </div>
  );

  const ToastNotification = () => {
    if (!toast) return null;
    return (
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-50 bg-[#4D4D4D] text-[#FFFFFF] px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center animate-in fade-in slide-in-from-top-5 w-max max-w-[90%]">
        <CheckCircle size={16} className="mr-2 text-[#0BA84A] shrink-0" />
        <span className="truncate">{toast}</span>
      </div>
    );
  };

  // --- Shared Screens ---
  const LoginScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF] justify-center px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2EA7FF]/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F4A62A]/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

      <div className="relative z-10 flex flex-col h-full justify-center">
        <div className="mb-12">
          <div className="w-16 h-16 bg-[#2EA7FF] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#2EA7FF]/30">
            <Activity className="text-[#FFFFFF]" size={32} />
          </div>
          <h1 className="text-4xl font-black text-[#4D4D4D] tracking-tighter leading-tight mb-2">A3 Digital<br/>Tax System</h1>
          <p className="text-[#4D4D4D]/50 font-medium">Secure Workspace</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Username</label>
            <input name="username" type="text" defaultValue="user" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none transition text-[#4D4D4D] font-bold text-lg" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Password</label>
            <input name="password" type="password" defaultValue="password" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none transition text-[#4D4D4D] font-bold text-lg" required />
          </div>
          <button type="submit" className="w-full box-border bg-[#4D4D4D] text-[#FFFFFF] font-bold py-4 rounded-full hover:opacity-90 transition mt-8 text-lg flex justify-center items-center">
            Sign In <ChevronRight size={20} className="ml-2"/>
          </button>
          <p className="text-center text-xs font-bold text-[#4D4D4D]/40 mt-4">Use 'admin' for Administrator, or 'user' for Employee</p>
        </form>
      </div>
    </div>
  );

  // ==========================================
  // --- EMPLOYEE-SPECIFIC SCREENS & LAYOUT ---
  // ==========================================
  const EmployeeDashboardScreen = () => {
    // Fallback to avoid crashes if EMP-02 is accidentally removed
    const myProfile = employees.find(e => e.id === 'EMP-02') || employees[0];
    const estNetPay = (myProfile.daysWorked * 505) + (myProfile.overtimeHours * 80);

    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const todayLog = myAttendance.find(a => a.date === todayStr);
    const isTimedIn = todayLog && !todayLog.timeOut;
    const isShiftEnded = todayLog && todayLog.timeOut;
    
    const headerDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

    return (
      <div className="flex flex-col pb-32 bg-[#FFFFFF] h-full overflow-y-auto">
        <div className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-[#FFFFFF]/90 backdrop-blur-md z-20">
          <div>
            <p className="text-[#4D4D4D]/50 text-sm font-bold tracking-wide">{headerDate}</p>
            <h2 className="text-[#4D4D4D] text-3xl font-black tracking-tight">My Overview</h2>
          </div>
          <div className="w-12 h-12 bg-[#F2F2F2] rounded-full flex items-center justify-center relative overflow-hidden">
            <UserCircle />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#0BA84A] rounded-full border-2 border-[#F2F2F2]"></div>
          </div>
        </div>

        <div className="mx-6 bg-[#2EA7FF] rounded-[2rem] p-6 shadow-xl shadow-[#2EA7FF]/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FFFFFF]/10 rounded-full"></div>
          <p className="text-[#FFFFFF]/80 font-medium text-sm mb-1 relative z-10">Est. Net Pay (Next Cycle)</p>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-6 relative z-10 text-[#FFFFFF]">
            ₱{estNetPay.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </h3>
          
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#FFFFFF]/60 uppercase tracking-widest mb-1">Days Worked</p>
              <p className="text-lg font-bold text-[#FFFFFF]">{myProfile.daysWorked} Days</p>
            </div>
            <div className="w-px h-8 bg-[#FFFFFF]/20 shrink-0 mx-1"></div>
            <div className="flex-1 pl-2">
              <p className="text-[10px] font-bold text-[#FFFFFF]/60 uppercase tracking-widest mb-1">SIL Credits</p>
              <p className="text-lg font-bold text-[#FFFFFF]">{myProfile.silCredits} Remaining</p>
            </div>
          </div>
        </div>

        {/* Action Pills - Forced horizontal scroll */}
        <div className="px-6 mt-8 flex flex-nowrap gap-3 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="snap-start shrink-0">
            <ActionPill 
              icon={Clock} 
              label={isShiftEnded ? "Shift Ended" : isTimedIn ? "Time Out" : "Time In"} 
              onClick={() => {
                if (isShiftEnded) showToastMessage('Shift already completed for today.');
                else handleSimulateScan(); 
              }} 
            />
          </div>
          <div className="snap-start shrink-0"><ActionPill icon={Calendar} label="Request Leave" onClick={() => navigateTo('employee_leave')} /></div>
          <div className="snap-start shrink-0"><ActionPill icon={Receipt} label="Payslips" onClick={() => navigateTo('employee_payslips')} /></div>
          <div className="snap-start shrink-0"><ActionPill icon={Briefcase} label="Directory" onClick={() => showToastMessage('Directory opening soon')} /></div>
          <div className="snap-start shrink-0"><ActionPill icon={FileText} label="Policies" onClick={() => showToastMessage('Company policies opening soon')} /></div>
        </div>

        <div className="px-6 mt-10">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-black text-[#4D4D4D]">My Attendance</h3>
            <button onClick={() => navigateTo('employee_attendance')} className="text-[#2EA7FF] font-bold text-sm">View All</button>
          </div>
          <div className="space-y-0">
            {myAttendance.slice(0, 3).map((log, idx) => (
              <div key={idx} className={`py-4 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
                <div className="flex items-center">
                  <div className={`p-3 rounded-2xl mr-4 ${log.status === 'Present' ? 'bg-[#0BA84A]/10 text-[#0BA84A]' : 'bg-[#F4A62A]/10 text-[#F4A62A]'}`}>
                    {log.status === 'Present' ? <CheckCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <p className="font-bold text-[#4D4D4D] text-base">{log.date}</p>
                    <p className="text-xs text-[#4D4D4D]/50 font-medium">IN: {log.timeIn || '--'} • OUT: {log.timeOut || '--'}</p>
                  </div>
                </div>
                {log.overTime > 0 && (
                  <p className="font-black text-sm text-[#F4A62A]">+{log.overTime}h OT</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const EmployeeMenuScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Menu" />
      <div className="px-6 py-4 pb-32 overflow-y-auto">
        <p className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest mb-4 ml-2">My Account</p>
        <div className="bg-[#F2F2F2] rounded-[2rem] p-2 mb-8">
          <MenuRow icon={User} title="Edit Profile" onClick={() => navigateTo('employee_profile')} />
          <MenuRow icon={Receipt} title="My Payslips" onClick={() => navigateTo('employee_payslips')} isLast />
        </div>
        
        <p className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest mb-4 ml-2">System</p>
        <div className="bg-[#F2F2F2] rounded-[2rem] p-2">
          <MenuRow icon={LogOut} title="Sign Out" onClick={handleLogout} isDestructive isLast />
        </div>
      </div>
    </div>
  );

  const EmployeeLeaveScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Leave Requests" showBack onBackClick={() => navigateTo('employee_dashboard')} />
      <div className="px-6 py-4 pb-32 overflow-y-auto">
        <button onClick={() => setShowAddModal('leave')} className="w-full mb-6 py-4 border-2 border-dashed border-[#D9D9D9] text-[#4D4D4D]/50 rounded-2xl font-bold hover:bg-[#F2F2F2] transition flex justify-center items-center">
          <Plus size={18} className="mr-2"/> Submit New Leave Request
        </button>
        {leaveRequests.map((lr, idx) => (
          <div key={lr.id} className={`py-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
            <div>
              <p className="font-black text-[#4D4D4D] text-lg">{lr.type}</p>
              <p className="text-xs text-[#4D4D4D]/60 font-medium">{lr.startDate} to {lr.endDate}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-md tracking-wider ${lr.status === 'Approved' ? 'bg-[#0BA84A]/10 text-[#0BA84A]' : lr.status === 'Pending' ? 'bg-[#F4A62A]/10 text-[#F4A62A]' : 'bg-[#D9D9D9]/50 text-[#4D4D4D]/50'}`}>
              {lr.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const EmployeePayslipScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="My Payslips" showBack onBackClick={() => navigateTo('employee_dashboard')} />
      <div className="px-6 py-4 pb-32 overflow-y-auto">
        {[
          { date: 'Apr 15, 2026', amount: 7575.00, status: 'Paid' },
          { date: 'Mar 30, 2026', amount: 7575.00, status: 'Paid' },
          { date: 'Mar 15, 2026', amount: 7575.00, status: 'Paid' }
        ].map((ps, idx) => (
          <div key={idx} className={`py-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
            <div className="flex items-center">
              <div className="p-3 bg-[#F2F2F2] rounded-2xl mr-4 text-[#4D4D4D]">
                <Receipt size={24} />
              </div>
              <div>
                <p className="font-black text-[#4D4D4D] text-lg">Period Ending</p>
                <p className="text-sm text-[#4D4D4D]/50 font-medium mt-0.5">{ps.date}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-xl text-[#4D4D4D]">₱{ps.amount.toFixed(2)}</p>
              <button onClick={handleDownloadPDF} className="text-[10px] font-bold text-[#2EA7FF] hover:underline mt-1">DOWNLOAD PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const EmployeeAttendanceScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Attendance Log" showBack onBackClick={() => navigateTo('employee_dashboard')} />
      <div className="px-6 py-4 pb-32 overflow-y-auto">
        {myAttendance.map((log, idx) => (
          <div key={idx} className={`py-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-2xl mr-4 ${log.status === 'Present' ? 'bg-[#0BA84A]/10 text-[#0BA84A]' : 'bg-[#F4A62A]/10 text-[#F4A62A]'}`}>
                {log.status === 'Present' ? <CheckCircle size={20} /> : <Clock size={20} />}
              </div>
              <div>
                <p className="font-bold text-[#4D4D4D] text-lg">{log.date}</p>
                <p className="text-xs text-[#4D4D4D]/50 font-medium mt-0.5">IN: {log.timeIn || '--'} • OUT: {log.timeOut || '--'}</p>
              </div>
            </div>
            {log.overTime > 0 && (
              <p className="font-black text-sm text-[#F4A62A]">+{log.overTime}h OT</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const EmployeeProfileScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Edit Profile" showBack onBackClick={() => navigateTo('employee_menu')} />
      <div className="px-6 py-4 pb-32 overflow-y-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 bg-[#F2F2F2] text-[#4D4D4D] rounded-full flex items-center justify-center font-black text-3xl mb-4 shadow-sm border border-[#D9D9D9]/50">
            {currentUser?.name.charAt(0)}
          </div>
          <h2 className="text-xl font-black text-[#4D4D4D]">{currentUser?.name}</h2>
          <p className="text-sm text-[#4D4D4D]/60 font-medium">{currentUser?.role}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
            <input type="text" defaultValue={currentUser?.name} className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none transition text-[#4D4D4D] font-bold text-base sm:text-lg" />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Username / Email</label>
            <input type="text" defaultValue={currentUser?.username} className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none transition text-[#4D4D4D] font-bold text-base sm:text-lg" />
          </div>
          <div>
            <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none transition text-[#4D4D4D] font-bold text-base sm:text-lg" />
          </div>
          <button onClick={() => { showToastMessage('Profile updated successfully'); navigateTo('employee_menu'); }} className="w-full box-border bg-[#4D4D4D] text-[#FFFFFF] font-bold py-4 rounded-full hover:bg-[#2EA7FF] transition mt-4 text-lg">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  // =======================================
  // --- ADMIN-SPECIFIC SCREENS & LAYOUT ---
  // =======================================
  const AdminDashboardScreen = () => {
    const headerDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();
    
    return (
      <div className="flex flex-col pb-32 bg-[#FFFFFF] h-full overflow-y-auto">
        <div className="px-6 pt-12 pb-6 flex justify-between items-center sticky top-0 bg-[#FFFFFF]/90 backdrop-blur-md z-20">
          <div>
            <p className="text-[#4D4D4D]/50 text-sm font-bold tracking-wide">{headerDate}</p>
            <h2 className="text-[#4D4D4D] text-3xl font-black tracking-tight">Overview</h2>
          </div>
          <div className="w-12 h-12 bg-[#F2F2F2] rounded-full flex items-center justify-center relative overflow-hidden">
            <User size={24} className="text-[#4D4D4D]" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#F4A62A] rounded-full border-2 border-[#F2F2F2]"></div>
          </div>
        </div>

        <div className="mx-6 bg-[#2EA7FF] rounded-[2rem] p-6 shadow-xl shadow-[#2EA7FF]/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#FFFFFF]/10 rounded-full"></div>
          <p className="text-[#FFFFFF]/80 font-medium text-sm mb-1 relative z-10">Total Balance</p>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tighter mb-6 relative z-10 text-[#FFFFFF]">
            ₱{dashboardStats.cashBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}
          </h3>
          
          <div className="flex items-center justify-between gap-2 relative z-10">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#FFFFFF]/60 uppercase tracking-widest mb-1">Net Profit</p>
              <p className="text-lg font-bold text-[#FFFFFF]">+₱{dashboardStats.netProfit.toLocaleString()}</p>
            </div>
            <div className="w-px h-8 bg-[#FFFFFF]/20 shrink-0 mx-1"></div>
            <div className="flex-1 pl-2">
              <p className="text-[10px] font-bold text-[#FFFFFF]/60 uppercase tracking-widest mb-1">Active Staff</p>
              <p className="text-lg font-bold text-[#FFFFFF]">{dashboardStats.activeEmployees}</p>
            </div>
          </div>
        </div>

        <div className="px-6 mt-8 flex flex-nowrap gap-3 overflow-x-auto pb-4 snap-x [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#D9D9D9] [&::-webkit-scrollbar-thumb]:rounded-full">
          <div className="snap-start shrink-0"><ActionPill icon={FileText} label="Invoice" onClick={() => setShowAddModal('invoice')} /></div>
          <div className="snap-start shrink-0"><ActionPill icon={DollarSign} label="Cash" onClick={() => setShowAddModal('cash')} /></div>
          <div className="snap-start shrink-0"><ActionPill icon={CreditCard} label="Expense" onClick={() => setShowAddModal('expense')} /></div>
          <div className="snap-start shrink-0"><ActionPill icon={ScanLine} label="Scan" onClick={() => { navigateTo('hr'); setIsScanning(true); }} /></div>
        </div>

        <div className="px-6 mt-10">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-xl font-black text-[#4D4D4D]">Recent Activity</h3>
            <button onClick={() => navigateTo('cash')} className="text-[#2EA7FF] font-bold text-sm">See All</button>
          </div>
          <div className="space-y-0">
            {cashFlow.slice(0, 4).map((flow, idx) => (
              <div key={flow.id} className={`py-4 flex items-center ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
                <div className={`p-3 rounded-2xl mr-4 ${flow.type === 'in' ? 'bg-[#0BA84A]/10 text-[#0BA84A]' : 'bg-[#F2F2F2] text-[#4D4D4D]'}`}>
                  {flow.type === 'in' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#4D4D4D] text-base">{flow.desc}</p>
                  <p className="text-xs text-[#4D4D4D]/50 font-medium">{flow.date}</p>
                </div>
                <p className={`font-black text-lg ${flow.type === 'in' ? 'text-[#0BA84A]' : 'text-[#4D4D4D]'}`}>
                  {flow.type === 'in' ? '+' : '-'}₱{flow.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const BillingScreen = () => {
    const filteredInvoices = invoices.filter(inv => 
      inv.client.toLowerCase().includes(searchQuery.toLowerCase()) || 
      inv.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col h-full bg-[#FFFFFF]">
        <Header title="Invoices" rightIcon={Search} onRightIconClick={() => setIsSearchActive(!isSearchActive)} />
        {isSearchActive && (
          <div className="px-6 pb-2 pt-2 sticky top-[88px] bg-[#FFFFFF] z-10 border-b border-[#F2F2F2]">
            <input 
              type="text" 
              placeholder="Search clients or IDs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full box-border pb-2 bg-transparent border-b-2 border-[#2EA7FF] outline-none text-[#4D4D4D] font-bold text-sm"
              autoFocus
            />
          </div>
        )}
        <div className="px-6 pb-32 overflow-y-auto">
          {filteredInvoices.map((inv, idx) => (
            <div key={inv.id} className={`py-6 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
              <div>
                <p className="text-[10px] font-bold text-[#4D4D4D]/40 uppercase tracking-widest mb-1">{inv.id}</p>
                <h3 className="font-black text-[#4D4D4D] text-lg mb-1">{inv.client}</h3>
                <p className="text-xs text-[#4D4D4D]/60 font-medium">Due: {inv.date}</p>
              </div>
              <div className="text-right">
                <p className="font-black text-2xl text-[#4D4D4D] mb-2">₱{inv.amount.toFixed(2)}</p>
                <span className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-md tracking-wider ${inv.status === 'Paid' ? 'bg-[#0BA84A] text-[#FFFFFF]' : 'bg-[#F2F2F2] text-[#4D4D4D]'}`}>
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
          {filteredInvoices.length === 0 && (
            <p className="text-center text-[#4D4D4D]/50 mt-10 font-bold">No invoices found.</p>
          )}
        </div>
      </div>
    );
  };

  const CashScreen = () => {
    const filteredCashFlow = cashFlow.filter(flow => cashFilter === 'all' || flow.type === cashFilter);

    return (
      <div className="flex flex-col h-full bg-[#FFFFFF]">
        <Header title="Cash Flow" rightIcon={Filter} showBack onRightIconClick={handleCashFilterClick} />
        <div className="px-6 pb-32 overflow-y-auto">
          {filteredCashFlow.map((flow, idx) => (
            <div key={flow.id} className={`py-5 ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
              <div className="flex items-center">
                <div className={`p-4 rounded-[1.25rem] mr-4 ${flow.type === 'in' ? 'bg-[#0BA84A]/10 text-[#0BA84A]' : 'bg-[#F2F2F2] text-[#4D4D4D]'}`}>
                  {flow.type === 'in' ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                </div>
                <div className="flex-1">
                  <p className="font-black text-[#4D4D4D] text-lg">{flow.desc}</p>
                  <p className="text-sm text-[#4D4D4D]/50 font-medium mt-0.5">{flow.date}</p>
                </div>
                <p className={`font-black text-xl tracking-tight ${flow.type === 'in' ? 'text-[#0BA84A]' : 'text-[#4D4D4D]'}`}>
                  {flow.type === 'in' ? '+' : '-'}₱{flow.amount.toFixed(2)}
                </p>
              </div>
              {flow.type === 'out' && !flow.liquidated && (
                <div className="ml-[4.5rem] mt-3">
                  <button onClick={() => liquidateTransaction(flow.id)} className="px-4 py-2 bg-[#F4A62A]/10 text-[#F4A62A] text-xs font-bold rounded-lg hover:bg-[#F4A62A]/20 transition inline-flex items-center">
                    <Receipt size={14} className="mr-1.5"/> Liquidate
                  </button>
                </div>
              )}
            </div>
          ))}
          {filteredCashFlow.length === 0 && (
            <p className="text-center text-[#4D4D4D]/50 mt-10 font-bold">No transactions found.</p>
          )}
        </div>
      </div>
    );
  };

  const HRScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Team" />
      <div className="px-6 mb-6">
        <div className="flex bg-[#F2F2F2] p-1.5 rounded-2xl">
          {['directory', 'payroll', 'leaves'].map(tab => (
            <button 
              key={tab}
              onClick={() => setHrTab(tab)} 
              className={`flex-1 py-2.5 text-xs font-bold capitalize rounded-xl transition-all ${hrTab === tab ? 'bg-[#FFFFFF] text-[#4D4D4D] shadow-sm' : 'text-[#4D4D4D]/50 hover:text-[#4D4D4D]'}`}
            >
              {tab === 'leaves' ? 'SIL' : tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 flex-1 overflow-y-auto pb-32">
        {employees.map((emp, idx) => (
          <div key={emp.id} className={`py-4 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-[#F2F2F2] text-[#4D4D4D] rounded-2xl flex items-center justify-center font-black text-lg mr-4">
                {emp.name.charAt(0)}
              </div>
              <div>
                <p className="font-black text-[#4D4D4D] text-lg">{emp.name}</p>
                <p className="text-sm text-[#4D4D4D]/60 font-medium mt-0.5">
                  {hrTab === 'leaves' ? `SIL Credits: ${emp.silCredits}` : hrTab === 'payroll' ? `15-Day Period` : emp.role}
                </p>
              </div>
            </div>
            
            {hrTab === 'directory' && (
              <div className="text-right">
                {emp.status === 'Absent' && <span className="text-[10px] font-bold text-[#4D4D4D]/40 uppercase tracking-widest bg-[#F2F2F2] px-3 py-1.5 rounded-md">Absent</span>}
                {emp.status === 'Present' && (
                  <div>
                    <p className="text-xs font-black text-[#0BA84A]">IN: {emp.timeIn}</p>
                    <p className="text-[10px] font-bold text-[#2EA7FF] uppercase tracking-widest mt-0.5 animate-pulse">Active Now</p>
                  </div>
                )}
                {emp.status === 'Shift Ended' && (
                  <div>
                    <p className="text-xs font-black text-[#4D4D4D]/60 mb-0.5">IN: {emp.timeIn}</p>
                    <p className="text-xs font-black text-[#F4A62A]">OUT: {emp.timeOut}</p>
                  </div>
                )}
              </div>
            )}
            {hrTab === 'payroll' && (
              <div className="text-right flex flex-col items-end">
                <p className="text-sm font-black text-[#4D4D4D]">₱{((emp.daysWorked * 505) + ((emp.overtimeHours || 0) * 80)).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                <p className="text-[10px] font-bold text-[#4D4D4D]/40 uppercase tracking-widest mb-1.5">
                  {emp.daysWorked}D @ ₱505 {emp.overtimeHours > 0 ? `+ ${emp.overtimeHours}h OT` : ''}
                </p>
                {emp.payProcessed ? (
                  <span className="text-[10px] font-bold uppercase px-3 py-1 rounded-md tracking-wider bg-[#0BA84A]/10 text-[#0BA84A]">Paid</span>
                ) : (
                  <button onClick={() => processPayroll(emp)} className="bg-[#4D4D4D] text-[#FFFFFF] text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-[#2EA7FF] transition">Process Pay</button>
                )}
              </div>
            )}
            {hrTab === 'leaves' && (
              <div className="text-right">
                <p className="font-black text-2xl text-[#2EA7FF] leading-none">{emp.silCredits}</p>
                <p className="text-[10px] font-bold text-[#4D4D4D]/40 uppercase tracking-widest mt-1">Days</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const MenuScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Menu" />
      <div className="px-6 py-4 pb-32 overflow-y-auto">
        <p className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest mb-4 ml-2">Financials</p>
        <div className="bg-[#F2F2F2] rounded-[2rem] p-2 mb-8">
          <MenuRow icon={Wallet} title="Cash Flow" onClick={() => navigateTo('cash')} />
          <MenuRow icon={CreditCard} title="Expenses Tracker" onClick={() => navigateTo('expenses')} isLast />
        </div>

        <p className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest mb-4 ml-2">Reporting</p>
        <div className="bg-[#F2F2F2] rounded-[2rem] p-2 mb-8">
          <MenuRow icon={FileSpreadsheet} title="Balance Sheet" onClick={() => navigateTo('balance_sheet')} />
          <MenuRow icon={PieChart} title="Income Statement" onClick={() => navigateTo('income_statement')} isLast />
        </div>
        
        <p className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest mb-4 ml-2">System</p>
        <div className="bg-[#F2F2F2] rounded-[2rem] p-2">
          <MenuRow icon={Settings} title="Access Control" onClick={() => navigateTo('admin')} />
          <MenuRow icon={LogOut} title="Sign Out" onClick={handleLogout} isDestructive isLast />
        </div>
      </div>
    </div>
  );

  interface ActionPillProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
  }
  const ActionPill: React.FC<ActionPillProps> = ({ icon: Icon, label, onClick }) => (
    <button onClick={onClick} className="flex items-center bg-[#F2F2F2] hover:bg-[#D9D9D9]/50 px-5 py-3 rounded-full transition shrink-0">
      <Icon size={18} className="text-[#4D4D4D] mr-2" />
      <span className="font-bold text-[#4D4D4D] text-sm whitespace-nowrap">{label}</span>
    </button>
  );

  interface MenuRowProps {
    icon: React.ElementType;
    title: string;
    onClick: () => void;
    isDestructive?: boolean;
    isLast?: boolean;
  }
  const MenuRow: React.FC<MenuRowProps> = ({ icon: Icon, title, onClick, isDestructive, isLast }) => (
    <button onClick={onClick} className={`w-full box-border flex items-center p-4 bg-transparent hover:bg-[#FFFFFF]/50 transition rounded-2xl ${!isLast ? 'mb-1' : ''}`}>
      <div className={`p-3 rounded-xl mr-4 ${isDestructive ? 'bg-[#F4A62A]/10 text-[#F4A62A]' : 'bg-[#FFFFFF] text-[#4D4D4D]'}`}>
        <Icon size={20} />
      </div>
      <span className={`font-bold text-lg ${isDestructive ? 'text-[#F4A62A]' : 'text-[#4D4D4D]'}`}>{title}</span>
      <ChevronRight size={20} className="ml-auto text-[#4D4D4D]/30" />
    </button>
  );

  const ExpensesScreen = () => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title="Expenses" showBack />
      <div className="px-6 pb-32 overflow-y-auto">
        {expenses.map((exp, idx) => (
          <div key={exp.id} className={`py-5 flex items-center ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
            <div className="p-4 bg-[#F2F2F2] rounded-[1.25rem] mr-4 text-[#4D4D4D]">
              <CreditCard size={24} />
            </div>
            <div className="flex-1">
              <p className="font-black text-[#4D4D4D] text-lg">{exp.desc}</p>
              <p className="text-sm text-[#4D4D4D]/50 font-medium mt-0.5">{exp.category}</p>
            </div>
            <p className="font-black text-xl text-[#4D4D4D]">₱{exp.amount.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const AdminScreen = () => {
    const [adminTab, setAdminTab] = useState<string>('users');
    return (
      <div className="flex flex-col h-full bg-[#FFFFFF]">
        <Header title="Access Control" showBack />
        <div className="px-6 mb-6">
          <div className="flex bg-[#F2F2F2] p-1.5 rounded-2xl">
            {['users', 'roles', 'settings'].map(tab => (
              <button 
                key={tab}
                onClick={() => setAdminTab(tab)} 
                className={`flex-1 py-2.5 text-xs font-bold capitalize rounded-xl transition-all ${adminTab === tab ? 'bg-[#FFFFFF] text-[#4D4D4D] shadow-sm' : 'text-[#4D4D4D]/50 hover:text-[#4D4D4D]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 flex-1 overflow-y-auto pb-32">
          {adminTab === 'users' && (
            <div className="space-y-0">
              {systemUsers.map((user, idx) => (
                <div key={user.id} className={`py-5 flex items-center justify-between ${idx !== 0 ? 'border-t border-[#F2F2F2]' : ''}`}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#F2F2F2] text-[#4D4D4D] rounded-2xl flex items-center justify-center font-black text-lg mr-4">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-[#4D4D4D] text-lg">{user.name}</p>
                      <p className="text-xs text-[#4D4D4D]/60 font-medium mt-0.5">{user.role}</p>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setShowAddModal('user')} className="w-full box-border mt-4 py-4 border-2 border-dashed border-[#D9D9D9] text-[#4D4D4D]/50 rounded-2xl font-bold hover:bg-[#F2F2F2] transition flex justify-center items-center">
                <Plus size={18} className="mr-2"/> Add New User
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  interface ReportScreenProps {
    title: string;
    type: 'balance' | 'income';
  }
  const ReportScreen: React.FC<ReportScreenProps> = ({ title, type }) => (
    <div className="flex flex-col h-full bg-[#FFFFFF]">
      <Header title={title} showBack />
      <div className="px-6 py-8">
        <div className="bg-[#F2F2F2] p-10 rounded-[2.5rem] text-center border border-[#D9D9D9]/30">
          <div className="w-20 h-20 bg-[#FFFFFF] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <FileSpreadsheet size={32} className="text-[#2EA7FF]" />
          </div>
          <h2 className="text-2xl font-black text-[#4D4D4D] mb-3">Report Ready</h2>
          <button onClick={handleDownloadPDF} className="w-full box-border py-4 mt-8 bg-[#F2F2F2] text-[#4D4D4D] border-2 border-[#D9D9D9]/30 rounded-2xl font-bold hover:bg-[#D9D9D9]/50 transition flex justify-center items-center">
            <FileText size={18} className="mr-2" /> Download PDF Report
          </button>
        </div>
      </div>
    </div>
  );

  // --- Utility Icon for user profile ---
  const UserCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#4D4D4D]">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
    </svg>
  );

  // --- Centered Clean Dialog Overlay ---
  const CenteredAddModal = () => {
    if (!showAddModal) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const today = new Date().toISOString().split('T')[0];

      if (showAddModal === 'invoice') {
        const client = formData.get('client') as string;
        const amount = parseFloat(formData.get('amount') as string);
        setInvoices([{ id: `INV-${1000 + invoices.length + 1}`, client, amount, status: 'Pending', date: today }, ...invoices]);
        showToastMessage('Invoice created successfully');
      } else if (showAddModal === 'cash') {
        const desc = formData.get('desc') as string;
        const type = formData.get('type') as string;
        const amount = parseFloat(formData.get('amount') as string);
        setCashFlow([{ id: Date.now(), desc, type, amount, date: today, liquidated: type === 'in' }, ...cashFlow]);
        showToastMessage('Cash flow recorded');
      } else if (showAddModal === 'expense') {
        const category = formData.get('category') as string;
        const desc = formData.get('desc') as string;
        const amount = parseFloat(formData.get('amount') as string);
        setExpenses([{ id: Date.now(), category, desc, amount, date: today }, ...expenses]);
        showToastMessage('Expense tracked');
      } else if (showAddModal === 'user') {
        const name = formData.get('name') as string;
        const username = formData.get('username') as string;
        const role = formData.get('role') as string;
        setSystemUsers([{ id: `U-${Date.now().toString().slice(-4)}`, name, username, role, status: 'Active' }, ...systemUsers]);
        showToastMessage('New user added');
      } else if (showAddModal === 'leave') {
        const type = formData.get('type') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;
        setLeaveRequests([{ id: `LR-${Date.now().toString().slice(-4)}`, type, startDate, endDate, status: 'Pending' }, ...leaveRequests]);
        showToastMessage('Leave request submitted successfully');
      }
      setShowAddModal(null);
    };

    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[#4D4D4D]/40 backdrop-blur-sm" onClick={() => setShowAddModal(null)}></div>
        
        <div className="bg-[#FFFFFF] w-full box-border rounded-[2.5rem] p-6 relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[85vh]">
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-[#FFFFFF] z-20">
            <h2 className="text-2xl font-black text-[#4D4D4D] capitalize tracking-tight">
              {showAddModal === 'leave' ? 'Request Leave' : `Add ${showAddModal}`}
            </h2>
            <button onClick={() => setShowAddModal(null)} className="p-2 bg-[#F2F2F2] rounded-full text-[#4D4D4D]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {showAddModal === 'invoice' && (
              <>
                <CleanInput name="client" label="Client Name" />
                <CleanInput name="amount" label="Amount (₱)" type="number" step="0.01" />
              </>
            )}
            
            {showAddModal === 'cash' && (
              <>
                <CleanInput name="desc" label="Description" />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <CleanInput name="amount" label="Amount" type="number" step="0.01" className="w-full" />
                  <div className="w-full">
                    <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Type</label>
                    <select name="type" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none text-[#4D4D4D] font-bold text-base sm:text-lg appearance-none rounded-none">
                      <option value="in">Cash In</option>
                      <option value="out">Cash Out</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {showAddModal === 'expense' && (
              <>
                <CleanInput name="desc" label="Description" />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <CleanInput name="amount" label="Amount" type="number" step="0.01" className="w-full" />
                  <div className="w-full">
                    <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Category</label>
                    <select name="category" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none text-[#4D4D4D] font-bold text-base sm:text-lg appearance-none rounded-none">
                      <option>Utilities</option><option>Payroll</option><option>Supplies</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {showAddModal === 'user' && (
              <>
                <CleanInput name="name" label="Full Name" />
                <div className="flex flex-col gap-4 sm:flex-row">
                  <CleanInput name="username" label="Username" className="w-full" />
                  <div className="w-full">
                    <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Role</label>
                    <select name="role" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none text-[#4D4D4D] font-bold text-base sm:text-lg appearance-none rounded-none">
                      <option>Employee</option><option>HR Manager</option><option>Administrator</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {showAddModal === 'leave' && (
              <>
                <CleanInput name="startDate" label="Start Date" type="date" />
                <CleanInput name="endDate" label="End Date" type="date" />
                <div className="w-full">
                  <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">Leave Type</label>
                  <select name="type" className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none text-[#4D4D4D] font-bold text-base sm:text-lg appearance-none rounded-none">
                    <option>Service Incentive Leave (SIL)</option>
                    <option>Sick Leave</option>
                    <option>Unpaid Leave</option>
                  </select>
                </div>
              </>
            )}

            <button type="submit" className="w-full box-border bg-[#4D4D4D] text-[#FFFFFF] font-bold py-4 rounded-full hover:bg-[#2EA7FF] transition mt-4 text-lg">
              Save {showAddModal === 'leave' ? 'Request' : 'Record'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  interface CleanInputProps {
    name: string;
    label: string;
    type?: string;
    step?: string;
    className?: string;
    defaultValue?: string;
  }
  const CleanInput: React.FC<CleanInputProps> = ({ name, label, type = "text", step, className = "", defaultValue }) => (
    <div className={`w-full min-w-0 ${className}`}>
      <label className="text-[10px] font-black text-[#4D4D4D]/40 uppercase tracking-widest ml-1 mb-2 block">{label}</label>
      <input name={name} type={type} step={step} defaultValue={defaultValue} required className="w-full box-border pb-3 bg-transparent border-b-2 border-[#D9D9D9] focus:border-[#2EA7FF] outline-none transition text-[#4D4D4D] font-bold text-base sm:text-lg rounded-none" />
    </div>
  );

  const ScannerOverlay = () => {
    if (!isScanning) return null;
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-[#FFFFFF]/95 backdrop-blur-md animate-in fade-in">
        <div className="text-center w-full">
          <div className="w-32 h-32 bg-[#F2F2F2] rounded-full flex items-center justify-center mx-auto mb-8 relative">
            <div className="absolute inset-0 border-4 border-[#2EA7FF] rounded-full animate-ping opacity-20"></div>
            <ScanLine size={48} className="text-[#2EA7FF]" />
          </div>
          <h2 className="text-3xl font-black text-[#4D4D4D] mb-2 tracking-tight">Ready to Scan</h2>
          <p className="text-[#4D4D4D]/50 font-medium mb-12">
            {currentUser?.role === 'Employee' ? "Hold your ID card near device" : "Hold employee ID card near device"}
          </p>
          
          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <button onClick={() => setIsScanning(false)} className="bg-[#F2F2F2] text-[#4D4D4D] px-10 py-4 rounded-full font-bold hover:bg-[#D9D9D9]/50 transition">
              Cancel
            </button>
            <button onClick={handleSimulateScan} className="text-[#2EA7FF] text-sm font-bold underline mt-4">
              Simulate Scan Success
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Main Structure ---
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#D9D9D9] font-sans sm:p-4">
      {/* Phone Frame */}
      <div className="w-full h-screen sm:h-[844px] max-w-[400px] bg-[#FFFFFF] sm:rounded-[3.5rem] overflow-hidden relative shadow-2xl flex flex-col sm:border-[10px] border-[#F2F2F2]">
        
        {/* Screens */}
        <div className="flex-1 overflow-hidden relative bg-[#FFFFFF]">
          {currentView === 'login' && <LoginScreen />}
          
          {/* Admin Routes */}
          {currentView === 'dashboard' && <AdminDashboardScreen />}
          {currentView === 'billing' && <BillingScreen />}
          {currentView === 'cash' && <CashScreen />}
          {currentView === 'hr' && <HRScreen />}
          {currentView === 'menu' && <MenuScreen />}
          {currentView === 'expenses' && <ExpensesScreen />}
          {currentView === 'balance_sheet' && <ReportScreen title="Balance Sheet" type="balance" />}
          {currentView === 'income_statement' && <ReportScreen title="Income Statement" type="income" />}
          {currentView === 'admin' && <AdminScreen />}
          
          {/* Employee Routes */}
          {currentView === 'employee_dashboard' && <EmployeeDashboardScreen />}
          {currentView === 'employee_menu' && <EmployeeMenuScreen />}
          {currentView === 'employee_leave' && <EmployeeLeaveScreen />}
          {currentView === 'employee_payslips' && <EmployeePayslipScreen />}
          {currentView === 'employee_attendance' && <EmployeeAttendanceScreen />}
          {currentView === 'employee_profile' && <EmployeeProfileScreen />}
        </div>

        <ToastNotification />

        {/* Floating Dark Nav Pill (Role Based) */}
        {currentView !== 'login' && (
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <div className="bg-[#4D4D4D] rounded-[2rem] flex justify-around items-center p-2 shadow-2xl shadow-[#4D4D4D]/30 backdrop-blur-md">
              
              {/* ADMIN BOTTOM NAV */}
              {currentUser?.role === 'Administrator' && (
                <>
                  <NavIcon icon={LayoutDashboard} isActive={currentView === 'dashboard'} onClick={() => navigateTo('dashboard')} />
                  <NavIcon icon={FileText} isActive={currentView === 'billing'} onClick={() => navigateTo('billing')} />
                  
                  {/* Center Action Button inside the nav pill */}
                  <button 
                    onClick={() => {
                      if (currentView === 'hr') setIsScanning(true);
                      else if (currentView === 'billing') setShowAddModal('invoice');
                      else if (currentView === 'expenses') setShowAddModal('expense');
                      else if (currentView === 'admin' && hrTab === 'users') setShowAddModal('user'); 
                      else setShowAddModal('cash'); // default action for Dashboard/Cash Flow
                    }}
                    className="w-12 h-12 bg-[#2EA7FF] rounded-full flex items-center justify-center text-[#FFFFFF] shadow-lg shadow-[#2EA7FF]/40 transform -translate-y-4 border-[4px] border-[#FFFFFF] hover:scale-105 transition shrink-0"
                  >
                    {currentView === 'hr' ? <ScanLine size={20} /> : <Plus size={24} strokeWidth={3} />}
                  </button>

                  <NavIcon icon={Briefcase} isActive={currentView === 'hr'} onClick={() => navigateTo('hr')} />
                  <NavIcon icon={Grid} isActive={['menu', 'cash', 'expenses', 'balance_sheet', 'income_statement', 'admin'].includes(currentView)} onClick={() => navigateTo('menu')} />
                </>
              )}

              {/* EMPLOYEE BOTTOM NAV */}
              {currentUser?.role !== 'Administrator' && (
                <>
                  <NavIcon icon={LayoutDashboard} isActive={['employee_dashboard', 'employee_attendance'].includes(currentView)} onClick={() => navigateTo('employee_dashboard')} />
                  <NavIcon icon={Calendar} isActive={currentView === 'employee_leave'} onClick={() => navigateTo('employee_leave')} />
                  
                  {/* Center Action Button for Employees (Always Scanner) */}
                  <button 
                    onClick={() => setIsScanning(true)}
                    className="w-12 h-12 bg-[#2EA7FF] rounded-full flex items-center justify-center text-[#FFFFFF] shadow-lg shadow-[#2EA7FF]/40 transform -translate-y-4 border-[4px] border-[#FFFFFF] hover:scale-105 transition shrink-0"
                  >
                    <ScanLine size={20} />
                  </button>

                  <NavIcon icon={Receipt} isActive={currentView === 'employee_payslips'} onClick={() => navigateTo('employee_payslips')} />
                  <NavIcon icon={Grid} isActive={['employee_menu', 'employee_profile'].includes(currentView)} onClick={() => navigateTo('employee_menu')} />
                </>
              )}

            </div>
          </div>
        )}

        {/* Overlays */}
        <CenteredAddModal />
        <ScannerOverlay />
      </div>
    </div>
  );
}

interface NavIconProps {
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}
const NavIcon: React.FC<NavIconProps> = ({ icon: Icon, isActive, onClick }) => (
  <button onClick={onClick} className="p-3 relative">
    <Icon size={24} className={`transition-colors ${isActive ? 'text-[#FFFFFF]' : 'text-[#FFFFFF]/40 hover:text-[#FFFFFF]/70'}`} strokeWidth={isActive ? 2.5 : 2} />
    {isActive && (
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#F4A62A] rounded-full"></div>
    )}
  </button>
);