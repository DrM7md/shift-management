import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Components/Layout/MainLayout';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Snackbar,
    Grid,
} from '@mui/material';
import {
    AccountBalanceWallet as WalletIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { Balance, BalanceStats } from '@/types/models';
import { formatDate } from '@/utils/dateFormat';

interface Props {
    balances: Balance[];
    stats: BalanceStats;
}

const statusColors: Record<string, 'success' | 'warning' | 'error'> = {
    'متاح': 'success',
    'مستخدم': 'warning',
    'منتهي': 'error',
};

export default function BalancesIndex({ balances, stats }: Props) {
    const [useDialogOpen, setUseDialogOpen] = useState(false);
    const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
    const [useDate, setUseDate] = useState(new Date().toISOString().split('T')[0]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const handleUseOpen = (balance: Balance) => {
        setSelectedBalance(balance);
        setUseDialogOpen(true);
    };

    const handleUseSubmit = () => {
        if (!selectedBalance) return;

        router.post(`/balances/${selectedBalance.id}/use`, { used_date: useDate }, {
            onSuccess: () => {
                setUseDialogOpen(false);
                setSnackbar({ open: true, message: 'تم استخدام الرصيد بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ', severity: 'error' });
            },
        });
    };

    const handleExpireOld = () => {
        router.post('/balances/expire-old', {}, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'تم تحديث الأرصدة المنتهية', severity: 'success' });
            },
        });
    };

    const isExpiringSoon = (balance: Balance) => {
        const expiryDate = new Date(balance.expiry_date);
        const today = new Date();
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays >= 0 && balance.status === 'متاح';
    };

    return (
        <MainLayout title="الأرصدة">
            <Head title="الأرصدة" />

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <CheckIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                            <Typography variant="h3" fontWeight={700} color="success.main">
                                {stats.available}
                            </Typography>
                            <Typography color="text.secondary">أرصدة متاحة</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <WarningIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                            <Typography variant="h3" fontWeight={700} color="warning.main">
                                {stats.expiring}
                            </Typography>
                            <Typography color="text.secondary">قريبة من الانتهاء</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <CancelIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                            <Typography variant="h3" fontWeight={700} color="error.main">
                                {stats.expired}
                            </Typography>
                            <Typography color="text.secondary">منتهية</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
                <Button variant="outlined" color="warning" onClick={handleExpireOld}>
                    تحديث الأرصدة المنتهية
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>الموظف</TableCell>
                                    <TableCell>تاريخ الاكتساب</TableCell>
                                    <TableCell>تاريخ الانتهاء</TableCell>
                                    <TableCell>النوع</TableCell>
                                    <TableCell>الحالة</TableCell>
                                    <TableCell>تاريخ الاستخدام</TableCell>
                                    <TableCell>الإجراءات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {balances.map((balance) => (
                                    <TableRow 
                                        key={balance.id} 
                                        hover
                                        sx={isExpiringSoon(balance) ? { bgcolor: 'warning.dark', '&:hover': { bgcolor: 'warning.main' } } : {}}
                                    >
                                        <TableCell>
                                            <Typography fontWeight={500}>
                                                {balance.employee?.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(balance.earned_date)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(balance.expiry_date)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={balance.type} size="small" color="primary" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={balance.status}
                                                color={statusColors[balance.status]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {balance.used_date 
                                                ? formatDate(balance.used_date)
                                                : '-'
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {balance.status === 'متاح' && (
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleUseOpen(balance)}
                                                >
                                                    استخدام
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {balances.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Box sx={{ py: 4 }}>
                                                <WalletIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                                <Typography color="text.secondary">
                                                    لا توجد أرصدة
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Dialog open={useDialogOpen} onClose={() => setUseDialogOpen(false)}>
                <DialogTitle>استخدام الرصيد</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>
                        الموظف: {selectedBalance?.employee?.name}
                    </Typography>
                    <TextField
                        type="date"
                        label="تاريخ الاستخدام"
                        value={useDate}
                        onChange={(e) => setUseDate(e.target.value)}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUseDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleUseSubmit} variant="contained">
                        تأكيد
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
}
