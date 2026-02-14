import { useState } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Components/Layout/MainLayout';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    CircularProgress,
    Grid,
} from '@mui/material';
import {
    CalendarMonth as CalendarIcon,
    Person as PersonIcon,
    AccountBalanceWallet as WalletIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { formatDate, formatDateTime } from '@/utils/dateFormat';

interface ReportCard {
    title: string;
    description: string;
    icon: React.ReactNode;
    type: string;
}

export default function ReportsIndex() {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [reportType, setReportType] = useState('');
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

    const reportCards: ReportCard[] = [
        { title: 'التقرير الشهري', description: 'ملخص المناوبات الشهرية', icon: <CalendarIcon />, type: 'monthly' },
        { title: 'تقرير الموظفين', description: 'إحصائيات كل موظف', icon: <PersonIcon />, type: 'employees' },
        { title: 'تقرير الأرصدة', description: 'حالة الأرصدة والاستخدام', icon: <WalletIcon />, type: 'balances' },
        { title: 'سجل العمليات', description: 'آخر العمليات في النظام', icon: <HistoryIcon />, type: 'logs' },
    ];

    const fetchReport = async (type: string) => {
        setLoading(true);
        setReportType(type);
        try {
            const params = type === 'monthly' ? { month } : {};
            const response = await axios.get(`/reports/${type}`, { params });
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching report:', error);
        }
        setLoading(false);
    };

    const renderReportContent = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (!reportData) return null;

        switch (reportType) {
            case 'monthly':
                return (
                    <Box>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4">{reportData.stats.total}</Typography>
                                        <Typography color="text.secondary">إجمالي المناوبات</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="success.main">{reportData.stats.completed}</Typography>
                                        <Typography color="text.secondary">مكتملة</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="warning.main">{reportData.stats.substituted}</Typography>
                                        <Typography color="text.secondary">تم تبديلها</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                                <Card variant="outlined">
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Typography variant="h4" color="error.main">{reportData.stats.absent}</Typography>
                                        <Typography color="text.secondary">غياب</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>التاريخ</TableCell>
                                        <TableCell>اليوم</TableCell>
                                        <TableCell>الموظف</TableCell>
                                        <TableCell>الحالة</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportData.shifts.map((shift: any) => (
                                        <TableRow key={shift.id}>
                                            <TableCell>{formatDate(shift.shift_date)}</TableCell>
                                            <TableCell>{shift.day_name}</TableCell>
                                            <TableCell>{shift.employee?.name}</TableCell>
                                            <TableCell>{shift.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );

            case 'employees':
                return (
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>الموظف</TableCell>
                                    <TableCell>إجمالي المناوبات</TableCell>
                                    <TableCell>المكتملة</TableCell>
                                    <TableCell>الأرصدة المتاحة</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.employees.map((emp: any) => (
                                    <TableRow key={emp.id}>
                                        <TableCell>{emp.name}</TableCell>
                                        <TableCell>{emp.shifts_count}</TableCell>
                                        <TableCell>{emp.completed_shifts_count}</TableCell>
                                        <TableCell>{emp.available_balances_count}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );

            case 'balances':
                return (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>ملخص الأرصدة</Typography>
                        <TableContainer component={Paper} elevation={0}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>الموظف</TableCell>
                                        <TableCell>متاح</TableCell>
                                        <TableCell>مستخدم</TableCell>
                                        <TableCell>منتهي</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {reportData.byEmployee.map((emp: any) => (
                                        <TableRow key={emp.id}>
                                            <TableCell>{emp.name}</TableCell>
                                            <TableCell>{emp.available_count}</TableCell>
                                            <TableCell>{emp.used_count}</TableCell>
                                            <TableCell>{emp.expired_count}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                );

            case 'logs':
                return (
                    <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>التاريخ</TableCell>
                                    <TableCell>العملية</TableCell>
                                    <TableCell>الوصف</TableCell>
                                    <TableCell>المستخدم</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData.logs.map((log: any) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{formatDateTime(log.created_at)}</TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.description}</TableCell>
                                        <TableCell>{log.user?.name || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                );

            default:
                return null;
        }
    };

    return (
        <MainLayout title="التقارير">
            <Head title="التقارير" />

            <Grid container spacing={3} sx={{ mb: 3 }}>
                {reportCards.map((card) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.type}>
                        <Card 
                            sx={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                },
                                border: reportType === card.type ? 2 : 1,
                                borderColor: reportType === card.type ? 'primary.main' : 'divider',
                            }}
                            onClick={() => fetchReport(card.type)}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Box sx={{ color: 'primary.main', mb: 1 }}>
                                    {card.icon}
                                </Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {card.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {card.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {reportType === 'monthly' && (
                <Box sx={{ mb: 2 }}>
                    <TextField
                        type="month"
                        label="الشهر"
                        value={month}
                        onChange={(e) => {
                            setMonth(e.target.value);
                            fetchReport('monthly');
                        }}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            )}

            {reportData && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {reportCards.find(r => r.type === reportType)?.title}
                        </Typography>
                        {renderReportContent()}
                    </CardContent>
                </Card>
            )}
        </MainLayout>
    );
}
