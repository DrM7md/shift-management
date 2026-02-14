import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Checkbox,
    FormControlLabel,
    Alert,
    InputAdornment,
    IconButton,
    CircularProgress,
} from '@mui/material';
import {
    Email as EmailIcon,
    Lock as LockIcon,
    Visibility,
    VisibilityOff,
    Schedule as ScheduleIcon,
} from '@mui/icons-material';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="تسجيل الدخول" />
            
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                        top: '-100px',
                        right: '-100px',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                        bottom: '-50px',
                        left: '-50px',
                    }}
                />
                
                <Card
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        mx: 2,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        position: 'relative',
                        zIndex: 1,
                        bgcolor: '#1e293b',
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    width: 70,
                                    height: 70,
                                    borderRadius: '16px',
                                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mx: 'auto',
                                    mb: 2,
                                    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                                }}
                            >
                                <ScheduleIcon sx={{ fontSize: 36, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" fontWeight={700} gutterBottom color="white">
                                نظام إدارة المناوبات
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                قم بتسجيل الدخول للوصول إلى لوحة التحكم
                            </Typography>
                        </Box>

                        {status && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                {status}
                            </Alert>
                        )}

                        <form onSubmit={submit}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                <TextField
                                    label="البريد الإلكتروني"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    autoFocus
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                
                                <TextField
                                    label="كلمة المرور"
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon color="action" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="تذكرني"
                                    sx={{ color: 'white' }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    disabled={processing}
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.5)',
                                        },
                                    }}
                                >
                                    {processing ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        'تسجيل الدخول'
                                    )}
                                </Button>
                            </Box>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}
