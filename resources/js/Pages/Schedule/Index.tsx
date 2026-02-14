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
    Grid,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    AutoAwesome as GenerateIcon,
    CalendarMonth as CalendarIcon,
} from '@mui/icons-material';
import { Shift, Employee } from '@/types/models';
import { formatDate } from '@/utils/dateFormat';

interface Props {
    shifts: Shift[];
    employees: Employee[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'info' | 'default'> = {
    'مجدول': 'info',
    'أتم': 'success',
    'غائب': 'error',
    'بديل': 'warning',
};

export default function ScheduleIndex({ shifts, employees, filters }: Props) {
    const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [dateFilters, setDateFilters] = useState(filters);

    const generateForm = useForm({
        start_date: new Date().toISOString().split('T')[0],
        days: 30,
    });

    const editForm = useForm({
        status: 'مجدول' as Shift['status'],
        substitute_id: null as number | null,
        notes: '',
    });

    const handleFilterChange = (key: 'start_date' | 'end_date', value: string) => {
        setDateFilters({ ...dateFilters, [key]: value });
        router.get('/schedule', { ...dateFilters, [key]: value }, { preserveState: true });
    };

    const handleGenerateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        generateForm.post('/schedule/generate', {
            onSuccess: () => {
                setGenerateDialogOpen(false);
                setSnackbar({ open: true, message: 'تم توليد الجدول بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء توليد الجدول', severity: 'error' });
            },
        });
    };

    const handleEditOpen = (shift: Shift) => {
        setSelectedShift(shift);
        editForm.setData({
            status: shift.status,
            substitute_id: shift.substitute_id,
            notes: shift.notes || '',
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedShift) return;

        editForm.put(`/schedule/${selectedShift.id}`, {
            onSuccess: () => {
                setEditDialogOpen(false);
                setSnackbar({ open: true, message: 'تم تحديث المناوبة بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء التحديث', severity: 'error' });
            },
        });
    };

    const handleDelete = (shift: Shift) => {
        if (confirm('هل أنت متأكد من حذف هذه المناوبة؟')) {
            router.delete(`/schedule/${shift.id}`, {
                onSuccess: () => {
                    setSnackbar({ open: true, message: 'تم حذف المناوبة بنجاح', severity: 'success' });
                },
            });
        }
    };

    const getDayStyle = (dayName: string) => {
        if (dayName === 'السبت' || dayName === 'الجمعة') {
            return { bgcolor: 'primary.main', color: 'white' };
        }
        return {};
    };

    return (
        <MainLayout title="جدول المناوبات">
            <Head title="جدول المناوبات" />

            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        type="date"
                        label="من تاريخ"
                        value={dateFilters.start_date}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Typography color="text.secondary">إلى</Typography>
                    <TextField
                        type="date"
                        label="إلى تاريخ"
                        value={dateFilters.end_date}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
                <Button
                    variant="contained"
                    startIcon={<GenerateIcon />}
                    onClick={() => setGenerateDialogOpen(true)}
                >
                    توليد جدول
                </Button>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>التاريخ</TableCell>
                                    <TableCell>اليوم</TableCell>
                                    <TableCell>الموظف</TableCell>
                                    <TableCell>الحالة</TableCell>
                                    <TableCell>البديل</TableCell>
                                    <TableCell>يوم إضافي</TableCell>
                                    <TableCell>الإجراءات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {shifts.map((shift) => (
                                    <TableRow key={shift.id} hover>
                                        <TableCell>
                                            {formatDate(shift.shift_date)}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={shift.day_name}
                                                size="small"
                                                sx={getDayStyle(shift.day_name)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography fontWeight={500}>
                                                {shift.employee?.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={shift.status}
                                                color={statusColors[shift.status]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {shift.substitute?.name || '-'}
                                        </TableCell>
                                        <TableCell>
                                            {shift.has_extra_day ? (
                                                <Chip label="نعم" color="success" size="small" variant="outlined" />
                                            ) : (
                                                <Chip label="لا" size="small" variant="outlined" />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Tooltip title="تعديل">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditOpen(shift)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="حذف">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDelete(shift)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {shifts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Box sx={{ py: 4 }}>
                                                <CalendarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                                                <Typography color="text.secondary">
                                                    لا توجد مناوبات في هذه الفترة
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

            <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleGenerateSubmit}>
                    <DialogTitle>توليد جدول المناوبات</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                type="date"
                                label="تاريخ البداية"
                                value={generateForm.data.start_date}
                                onChange={(e) => generateForm.setData('start_date', e.target.value)}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                type="number"
                                label="عدد الأيام"
                                value={generateForm.data.days}
                                onChange={(e) => generateForm.setData('days', parseInt(e.target.value))}
                                fullWidth
                                required
                                inputProps={{ min: 1, max: 365 }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setGenerateDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained" disabled={generateForm.processing}>
                            توليد
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle>تحديث حالة المناوبة</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <FormControl fullWidth>
                                <InputLabel>الحالة</InputLabel>
                                <Select
                                    value={editForm.data.status}
                                    label="الحالة"
                                    onChange={(e) => editForm.setData('status', e.target.value as Shift['status'])}
                                >
                                    <MenuItem value="مجدول">مجدول</MenuItem>
                                    <MenuItem value="أتم">أتم المناوبة</MenuItem>
                                    <MenuItem value="غائب">غائب</MenuItem>
                                    <MenuItem value="بديل">تم التبديل</MenuItem>
                                </Select>
                            </FormControl>
                            
                            {editForm.data.status === 'بديل' && (
                                <FormControl fullWidth>
                                    <InputLabel>البديل</InputLabel>
                                    <Select
                                        value={editForm.data.substitute_id || ''}
                                        label="البديل"
                                        onChange={(e) => editForm.setData('substitute_id', e.target.value as number)}
                                    >
                                        {employees
                                            .filter(emp => emp.id !== selectedShift?.employee_id && emp.status === 'متاح')
                                            .map((emp) => (
                                                <MenuItem key={emp.id} value={emp.id}>
                                                    {emp.name}
                                                </MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            )}
                            
                            <TextField
                                label="ملاحظات"
                                value={editForm.data.notes}
                                onChange={(e) => editForm.setData('notes', e.target.value)}
                                fullWidth
                                multiline
                                rows={3}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained" disabled={editForm.processing}>
                            حفظ
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
