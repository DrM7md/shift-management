import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Components/Layout/MainLayout';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    TextField,
    Avatar,
    Divider,
    Alert,
    Snackbar,
    Grid,
} from '@mui/material';
import {
    Person as PersonIcon,
    Email as EmailIcon,
    Lock as LockIcon,
    Save as SaveIcon,
} from '@mui/icons-material';

interface Props {
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function Profile({ user }: Props) {
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const profileForm = useForm({
        name: user.name,
        email: user.email,
    });

    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.patch('/profile', {
            onSuccess: () => {
                setSnackbar({ open: true, message: 'تم تحديث الملف الشخصي بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء التحديث', severity: 'error' });
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/password', {
            onSuccess: () => {
                passwordForm.reset();
                setSnackbar({ open: true, message: 'تم تغيير كلمة المرور بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء تغيير كلمة المرور', severity: 'error' });
            },
        });
    };

    return (
        <MainLayout title="الملف الشخصي">
            <Head title="الملف الشخصي" />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center', py: 4 }}>
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    mx: 'auto',
                                    mb: 2,
                                    fontSize: '3rem',
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                                }}
                            >
                                {user.name.charAt(0)}
                            </Avatar>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                {user.name}
                            </Typography>
                            <Typography color="text.secondary">
                                {user.email}
                            </Typography>
                            <Divider sx={{ my: 3 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <Box sx={{ textAlign: 'center', px: 2 }}>
                                    <Typography variant="h6" fontWeight={700} color="primary">
                                        مدير
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        الصلاحية
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    معلومات الحساب
                                </Typography>
                            </Box>
                            
                            <form onSubmit={handleProfileSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        label="الاسم"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        error={!!profileForm.errors.name}
                                        helperText={profileForm.errors.name}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                                        }}
                                    />
                                    <TextField
                                        label="البريد الإلكتروني"
                                        type="email"
                                        value={profileForm.data.email}
                                        onChange={(e) => profileForm.setData('email', e.target.value)}
                                        error={!!profileForm.errors.email}
                                        helperText={profileForm.errors.email}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                                        }}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        disabled={profileForm.processing}
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        حفظ التغييرات
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                <LockIcon color="primary" />
                                <Typography variant="h6" fontWeight={600}>
                                    تغيير كلمة المرور
                                </Typography>
                            </Box>
                            
                            <form onSubmit={handlePasswordSubmit}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                    <TextField
                                        type="password"
                                        label="كلمة المرور الحالية"
                                        value={passwordForm.data.current_password}
                                        onChange={(e) => passwordForm.setData('current_password', e.target.value)}
                                        error={!!passwordForm.errors.current_password}
                                        helperText={passwordForm.errors.current_password}
                                        fullWidth
                                    />
                                    <TextField
                                        type="password"
                                        label="كلمة المرور الجديدة"
                                        value={passwordForm.data.password}
                                        onChange={(e) => passwordForm.setData('password', e.target.value)}
                                        error={!!passwordForm.errors.password}
                                        helperText={passwordForm.errors.password}
                                        fullWidth
                                    />
                                    <TextField
                                        type="password"
                                        label="تأكيد كلمة المرور"
                                        value={passwordForm.data.password_confirmation}
                                        onChange={(e) => passwordForm.setData('password_confirmation', e.target.value)}
                                        fullWidth
                                    />
                                    <Button
                                        type="submit"
                                        variant="outlined"
                                        color="warning"
                                        startIcon={<LockIcon />}
                                        disabled={passwordForm.processing}
                                        sx={{ alignSelf: 'flex-start' }}
                                    >
                                        تغيير كلمة المرور
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

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
