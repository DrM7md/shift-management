import { Head } from '@inertiajs/react';
import MainLayout from '@/Components/Layout/MainLayout';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Paper,
    Alert,
    Grid,
} from '@mui/material';
import {
    People as PeopleIcon,
    CheckCircle as CheckIcon,
    AccountBalanceWallet as WalletIcon,
    PendingActions as PendingIcon,
    Today as TodayIcon,
    Warning as WarningIcon,
    ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { DashboardStats, Shift, Employee, Balance } from '@/types/models';
import { formatDate, formatTime } from '@/utils/dateFormat';

interface Props {
    stats: DashboardStats;
    todayShift: Shift | null;
    nextSaturdayEmployee: Employee | null;
    expiringBalances: Balance[];
    recentShifts: Shift[];
}

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    'مجدول': 'info',
    'أتم': 'success',
    'غائب': 'error',
    'بديل': 'warning',
};

export default function Dashboard({ stats, todayShift, nextSaturdayEmployee, expiringBalances, recentShifts }: Props) {
    const statCards = [
        { title: 'إجمالي الموظفين', value: stats.totalEmployees, icon: <PeopleIcon />, color: '#6366f1' },
        { title: 'متاحين', value: stats.availableEmployees, icon: <CheckIcon />, color: '#10b981' },
        { title: 'أرصدة متاحة', value: stats.availableBalances, icon: <WalletIcon />, color: '#f59e0b' },
        { title: 'طلبات معلقة', value: stats.pendingRequests, icon: <PendingIcon />, color: '#ef4444' },
    ];

    return (
        <MainLayout title="لوحة التحكم">
            <Head title="لوحة التحكم" />
            
            <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                        <Card sx={{ 
                            transition: 'transform 0.3s, box-shadow 0.3s',
                            '&:hover': { 
                                transform: 'translateY(-4px)',
                                boxShadow: 6,
                            }
                        }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                    sx={{
                                        bgcolor: stat.color,
                                        width: 56,
                                        height: 56,
                                        background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                                    }}
                                >
                                    {stat.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="h4" fontWeight={700}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.title}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid size={12}>
                    <Card sx={{ 
                        border: '1px solid',
                        borderColor: 'primary.main',
                        background: (theme) => theme.palette.mode === 'dark' 
                            ? 'linear-gradient(135deg, rgba(30, 41, 59, 1) 0%, rgba(15, 23, 42, 1) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 100%)',
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <TodayIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    مناوبة اليوم
                                </Typography>
                            </Box>
                            
                            {todayShift ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Avatar
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            bgcolor: 'primary.main',
                                            fontSize: '1.5rem',
                                            fontWeight: 700,
                                        }}
                                    >
                                        {todayShift.employee?.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight={600}>
                                            {todayShift.employee?.name}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            {todayShift.day_name} - من {todayShift.start_time} إلى {todayShift.end_time}
                                        </Typography>
                                    </Box>
                                    <Chip
                                        label={todayShift.status}
                                        color={statusColors[todayShift.status]}
                                        sx={{ mr: 'auto' }}
                                    />
                                </Box>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 3 }}>
                                    <TodayIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                    <Typography color="text.secondary">
                                        لا توجد مناوبة مجدولة لهذا اليوم
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <ArrowIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    القادم في دورة السبت
                                </Typography>
                            </Box>
                            
                            {nextSaturdayEmployee ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        {nextSaturdayEmployee.name.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography fontWeight={600}>
                                            {nextSaturdayEmployee.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            ترتيب السبت: {nextSaturdayEmployee.saturday_order}
                                        </Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <Typography color="text.secondary">
                                    لا يوجد موظفين متاحين
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <WarningIcon color="warning" />
                                <Typography variant="h6" fontWeight={600}>
                                    أرصدة قريبة من الانتهاء
                                </Typography>
                            </Box>
                            
                            {expiringBalances.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {expiringBalances.slice(0, 3).map((balance) => (
                                        <Alert key={balance.id} severity="warning" sx={{ py: 0 }}>
                                            <Typography variant="body2">
                                                {balance.employee?.name} - ينتهي في {formatDate(balance.expiry_date)}
                                            </Typography>
                                        </Alert>
                                    ))}
                                </Box>
                            ) : (
                                <Typography color="text.secondary">
                                    لا توجد أرصدة قريبة من الانتهاء
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <TodayIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    آخر المناوبات
                                </Typography>
                            </Box>
                            
                            <TableContainer component={Paper} elevation={0}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>التاريخ</TableCell>
                                            <TableCell>اليوم</TableCell>
                                            <TableCell>الموظف</TableCell>
                                            <TableCell>الحالة</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentShifts.map((shift) => (
                                            <TableRow key={shift.id} hover>
                                                <TableCell>
                                                    {formatDate(shift.shift_date)}
                                                </TableCell>
                                                <TableCell>{shift.day_name}</TableCell>
                                                <TableCell>{shift.employee?.name}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={shift.status}
                                                        color={statusColors[shift.status]}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {recentShifts.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} align="center">
                                                    <Typography color="text.secondary">
                                                        لا توجد مناوبات
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </MainLayout>
    );
}
