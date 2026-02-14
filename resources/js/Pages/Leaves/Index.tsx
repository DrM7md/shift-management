import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import MainLayout from '@/Components/Layout/MainLayout';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Alert,
    Snackbar,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add as AddIcon,
    Check as CheckIcon,
    Close as CloseIcon,
    EventBusy as LeaveIcon,
} from '@mui/icons-material';
import { LeaveRequest, Employee } from '@/types/models';
import { formatDate } from '@/utils/dateFormat';

interface Props {
    leaves: LeaveRequest[];
    employees: Employee[];
    pendingCount: number;
    currentStatus: string;
}

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    'معلق': 'warning',
    'موافق': 'success',
    'مرفوض': 'error',
};

const typeColors: Record<string, 'primary' | 'secondary' | 'error' | 'warning' | 'info'> = {
    'رصيد سبت': 'primary',
    'رصيد جمعة': 'info',
    'مرضية': 'error',
    'سنوية': 'warning',
    'طارئة': 'secondary',
};

export default function LeavesIndex({ leaves, employees, pendingCount, currentStatus }: Props) {
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);
    const [tabValue, setTabValue] = useState(currentStatus || 'معلق');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const addForm = useForm({
        employee_id: '',
        leave_date: new Date().toISOString().split('T')[0],
        type: 'سنوية' as LeaveRequest['type'],
        notes: '',
    });

    const returnForm = useForm({
        employee_id: '',
        return_date: new Date().toISOString().split('T')[0],
        return_type: 'مناوبة' as 'مناوبة' | 'سنوية',
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
        router.get('/leaves', { status: newValue === 'الكل' ? '' : newValue }, { preserveState: true });
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/leaves', {
            onSuccess: () => {
                setAddDialogOpen(false);
                addForm.reset();
                setSnackbar({ open: true, message: 'تم تقديم طلب الإجازة بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ', severity: 'error' });
            },
        });
    };

    const handleReturnSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        returnForm.post('/leaves/return', {
            onSuccess: () => {
                setReturnDialogOpen(false);
                returnForm.reset();
                setSnackbar({ open: true, message: 'تم تسجيل العودة بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ', severity: 'error' });
            },
        });
    };

    const handleApprove = (leave: LeaveRequest) => {
        router.post(`/leaves/${leave.id}/approve`, {}, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'تمت الموافقة على الطلب', severity: 'success' });
            },
        });
    };

    const handleReject = (leave: LeaveRequest) => {
        router.post(`/leaves/${leave.id}/reject`, {}, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'تم رفض الطلب', severity: 'success' });
            },
        });
    };

    return (
        <MainLayout title="الإجازات">
            <Head title="الإجازات" />

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h5" fontWeight={600}>سجل الإجازات</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => setReturnDialogOpen(true)}
                    >
                        تسجيل عودة
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setAddDialogOpen(true)}
                    >
                        طلب إجازة
                    </Button>
                </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                معلقة
                                {pendingCount > 0 && (
                                    <Chip label={pendingCount} size="small" color="warning" />
                                )}
                            </Box>
                        } 
                        value="معلق" 
                    />
                    <Tab label="موافق عليها" value="موافق" />
                    <Tab label="مرفوضة" value="مرفوض" />
                    <Tab label="الكل" value="الكل" />
                </Tabs>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>الموظف</TableCell>
                                    <TableCell>تاريخ الإجازة</TableCell>
                                    <TableCell>النوع</TableCell>
                                    <TableCell>الحالة</TableCell>
                                    <TableCell>تاريخ الطلب</TableCell>
                                    <TableCell>الإجراءات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leaves.map((leave) => (
                                    <TableRow key={leave.id} hover>
                                        <TableCell>
                                            <Typography fontWeight={500}>
                                                {leave.employee?.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(leave.leave_date)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={leave.type}
                                                color={typeColors[leave.type]}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={leave.status}
                                                color={statusColors[leave.status]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(leave.created_at)}
                                        </TableCell>
                                        <TableCell>
                                            {leave.status === 'معلق' && (
                                                <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                    <Tooltip title="موافقة">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleApprove(leave)}
                                                        >
                                                            <CheckIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="رفض">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => handleReject(leave)}
                                                        >
                                                            <CloseIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {leaves.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            <Box sx={{ py: 4 }}>
                                                <LeaveIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                                <Typography color="text.secondary">
                                                    لا توجد طلبات إجازة
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

            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleAddSubmit}>
                    <DialogTitle>طلب إجازة جديدة</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <FormControl fullWidth required>
                                <InputLabel>الموظف</InputLabel>
                                <Select
                                    value={addForm.data.employee_id}
                                    label="الموظف"
                                    onChange={(e) => addForm.setData('employee_id', e.target.value)}
                                >
                                    {employees.map((emp) => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            {emp.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                type="date"
                                label="تاريخ الإجازة"
                                value={addForm.data.leave_date}
                                onChange={(e) => addForm.setData('leave_date', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <FormControl fullWidth required>
                                <InputLabel>نوع الإجازة</InputLabel>
                                <Select
                                    value={addForm.data.type}
                                    label="نوع الإجازة"
                                    onChange={(e) => addForm.setData('type', e.target.value as LeaveRequest['type'])}
                                >
                                    <MenuItem value="رصيد سبت">من رصيد السبت</MenuItem>
                                    <MenuItem value="رصيد جمعة">من رصيد الجمعة</MenuItem>
                                    <MenuItem value="مرضية">إجازة مرضية</MenuItem>
                                    <MenuItem value="سنوية">إجازة سنوية</MenuItem>
                                    <MenuItem value="طارئة">إجازة طارئة</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                label="ملاحظات"
                                value={addForm.data.notes}
                                onChange={(e) => addForm.setData('notes', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained" disabled={addForm.processing}>
                            تقديم الطلب
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleReturnSubmit}>
                    <DialogTitle>تسجيل عودة من إجازة</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <FormControl fullWidth required>
                                <InputLabel>الموظف</InputLabel>
                                <Select
                                    value={returnForm.data.employee_id}
                                    label="الموظف"
                                    onChange={(e) => returnForm.setData('employee_id', e.target.value)}
                                >
                                    {employees
                                        .filter(emp => emp.status !== 'متاح')
                                        .map((emp) => (
                                            <MenuItem key={emp.id} value={emp.id}>
                                                {emp.name} - {emp.status}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <TextField
                                type="date"
                                label="تاريخ العودة"
                                value={returnForm.data.return_date}
                                onChange={(e) => returnForm.setData('return_date', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <FormControl fullWidth required>
                                <InputLabel>نوع العودة</InputLabel>
                                <Select
                                    value={returnForm.data.return_type}
                                    label="نوع العودة"
                                    onChange={(e) => returnForm.setData('return_type', e.target.value as 'مناوبة' | 'سنوية')}
                                >
                                    <MenuItem value="مناوبة">عودة من إجازة مناوبة (حسب الترتيب)</MenuItem>
                                    <MenuItem value="سنوية">عودة من إجازة سنوية (أولوية)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setReturnDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained" disabled={returnForm.processing}>
                            تسجيل العودة
                        </Button>
                    </DialogActions>
                </form>
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
