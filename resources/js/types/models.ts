export interface Employee {
    id: number;
    name: string;
    email: string;
    status: 'متاح' | 'إجازة مرضية' | 'إجازة سنوية' | 'غير متاح';
    saturday_order: number;
    thursday_order: number;
    is_active: boolean;
    return_from_leave: string | null;
    return_type: 'مناوبة' | 'سنوية' | null;
    created_at: string;
    updated_at: string;
    balances_count?: number;
}

export interface Shift {
    id: number;
    shift_date: string;
    day_name: string;
    employee_id: number;
    substitute_id: number | null;
    status: 'مجدول' | 'أتم' | 'غائب' | 'بديل';
    start_time: string;
    end_time: string;
    has_extra_day: boolean;
    notes: string | null;
    employee?: Employee;
    substitute?: Employee;
    created_at: string;
    updated_at: string;
}

export interface Balance {
    id: number;
    employee_id: number;
    earned_date: string;
    expiry_date: string;
    type: 'سبت' | 'جمعة';
    status: 'متاح' | 'مستخدم' | 'منتهي';
    used_date: string | null;
    employee?: Employee;
    created_at: string;
    updated_at: string;
}

export interface LeaveRequest {
    id: number;
    employee_id: number;
    leave_date: string;
    type: 'رصيد سبت' | 'رصيد جمعة' | 'مرضية' | 'سنوية' | 'طارئة';
    status: 'معلق' | 'موافق' | 'مرفوض';
    balance_id: number | null;
    notes: string | null;
    approved_by: number | null;
    employee?: Employee;
    balance?: Balance;
    approver?: User;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: number;
    user_id: number | null;
    action: string;
    model_type: string | null;
    model_id: number | null;
    old_values: Record<string, any> | null;
    new_values: Record<string, any> | null;
    description: string | null;
    user?: User;
    created_at: string;
    updated_at: string;
}

export interface DashboardStats {
    totalEmployees: number;
    availableEmployees: number;
    availableBalances: number;
    pendingRequests: number;
}

export interface BalanceStats {
    available: number;
    expiring: number;
    expired: number;
}

export interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}
