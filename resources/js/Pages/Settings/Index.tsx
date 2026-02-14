import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Components/Layout/MainLayout';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Switch,
    FormControlLabel,
    Divider,
    Alert,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
} from '@mui/material';
import {
    Schedule as ScheduleIcon,
    Notifications as NotificationIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface ShiftSetting {
    start_time: string;
    end_time: string;
    has_extra_day: boolean;
    enabled: boolean;
}

interface Props {
    settings: {
        notifications_enabled: boolean;
        shift_settings: Record<string, ShiftSetting>;
        balance_expiry_days: number;
    };
}

const dayOrder = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

export default function SettingsIndex({ settings }: Props) {
    const [notificationsEnabled, setNotificationsEnabled] = useState(settings.notifications_enabled);
    const [shiftSettings, setShiftSettings] = useState<Record<string, ShiftSetting>>(settings.shift_settings);
    const [balanceExpiryDays, setBalanceExpiryDays] = useState(settings.balance_expiry_days);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [saving, setSaving] = useState(false);

    const handleShiftSettingChange = (day: string, field: keyof ShiftSetting, value: string | boolean) => {
        setShiftSettings(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [field]: value,
            }
        }));
    };

    const handleSaveShiftSettings = async () => {
        setSaving(true);
        try {
            await axios.post('/settings/shifts', { shift_settings: shiftSettings });
            setSnackbar({ open: true, message: 'تم حفظ إعدادات المناوبات بنجاح', severity: 'success' });
        } catch {
            setSnackbar({ open: true, message: 'حدث خطأ أثناء حفظ الإعدادات', severity: 'error' });
        }
        setSaving(false);
    };

    const handleSaveGeneralSettings = () => {
        router.post('/settings/update', { 
            key: 'balance_expiry_days', 
            value: balanceExpiryDays.toString() 
        }, {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'تم حفظ الإعدادات بنجاح', severity: 'success' });
            },
        });
    };

    return (
        <MainLayout title="الإعدادات">
            <Head title="الإعدادات" />

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ScheduleIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            إعدادات أوقات المناوبات
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <TableContainer component={Paper} elevation={0}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>اليوم</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>مفعل</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>وقت البداية</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>وقت النهاية</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>يوم إضافي</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dayOrder.map((day) => (
                                    <TableRow key={day} hover>
                                        <TableCell>
                                            <Typography fontWeight={500}>{day}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={shiftSettings[day]?.enabled ?? true}
                                                onChange={(e) => handleShiftSettingChange(day, 'enabled', e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="time"
                                                size="small"
                                                value={shiftSettings[day]?.start_time || '13:00'}
                                                onChange={(e) => handleShiftSettingChange(day, 'start_time', e.target.value)}
                                                disabled={!shiftSettings[day]?.enabled}
                                                sx={{ width: 130 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                type="time"
                                                size="small"
                                                value={shiftSettings[day]?.end_time || '06:00'}
                                                onChange={(e) => handleShiftSettingChange(day, 'end_time', e.target.value)}
                                                disabled={!shiftSettings[day]?.enabled}
                                                sx={{ width: 130 }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Checkbox
                                                checked={shiftSettings[day]?.has_extra_day ?? false}
                                                onChange={(e) => handleShiftSettingChange(day, 'has_extra_day', e.target.checked)}
                                                disabled={!shiftSettings[day]?.enabled}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSaveShiftSettings}
                            disabled={saving}
                        >
                            {saving ? 'جاري الحفظ...' : 'حفظ إعدادات المناوبات'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <NotificationIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            إعدادات عامة
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography fontWeight={500}>إشعارات البريد الإلكتروني</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    إرسال تنبيهات المناوبات والأرصدة عبر البريد
                                </Typography>
                            </Box>
                            <Switch
                                checked={notificationsEnabled}
                                onChange={(e) => {
                                    setNotificationsEnabled(e.target.checked);
                                    router.post('/settings/update', {
                                        key: 'notifications_enabled',
                                        value: e.target.checked ? 'true' : 'false'
                                    });
                                }}
                            />
                        </Box>
                        
                        <Divider />
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography fontWeight={500}>مدة صلاحية الرصيد (بالأيام)</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    عدد الأيام قبل انتهاء صلاحية رصيد اليوم الإضافي
                                </Typography>
                            </Box>
                            <TextField
                                type="number"
                                size="small"
                                value={balanceExpiryDays}
                                onChange={(e) => setBalanceExpiryDays(parseInt(e.target.value) || 7)}
                                sx={{ width: 100 }}
                                inputProps={{ min: 1, max: 30 }}
                            />
                            <Button variant="outlined" size="small" onClick={handleSaveGeneralSettings}>
                                حفظ
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

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
