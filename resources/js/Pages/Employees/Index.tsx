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
    InputAdornment,
    Tooltip,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Divider,
    Avatar,
    Grid,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    PersonAdd as PersonAddIcon,
    Visibility as ViewIcon,
    ArrowUpward as UpIcon,
    ArrowDownward as DownIcon,
    SwapVert as ReorderIcon,
} from '@mui/icons-material';
import { Employee, Shift, Balance, LeaveRequest } from '@/types/models';
import { formatDate } from '@/utils/dateFormat';

interface Props {
    employees: Employee[];
}

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
    'متاح': 'success',
    'إجازة مرضية': 'error',
    'إجازة سنوية': 'warning',
    'غير متاح': 'default',
};

export default function EmployeesIndex({ employees }: Props) {
    const [search, setSearch] = useState('');
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [employeeDetails, setEmployeeDetails] = useState<{shifts: Shift[], balances: Balance[], leaves: LeaveRequest[]} | null>(null);
    const [detailsTab, setDetailsTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [reorderList, setReorderList] = useState<Employee[]>([]);
    const [reorderType, setReorderType] = useState<'saturday' | 'thursday'>('saturday');

    const addForm = useForm({
        name: '',
        email: '',
        saturday_order: employees.length + 1,
        thursday_order: employees.length + 1,
    });

    const editForm = useForm({
        name: '',
        email: '',
        status: 'متاح' as Employee['status'],
        saturday_order: 1,
        thursday_order: 1,
    });

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/employees', {
            onSuccess: () => {
                setAddDialogOpen(false);
                addForm.reset();
                setSnackbar({ open: true, message: 'تم إضافة الموظف بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء إضافة الموظف', severity: 'error' });
            },
        });
    };

    const handleEditOpen = (employee: Employee) => {
        setSelectedEmployee(employee);
        editForm.setData({
            name: employee.name,
            email: employee.email,
            status: employee.status,
            saturday_order: employee.saturday_order,
            thursday_order: employee.thursday_order,
        });
        setEditDialogOpen(true);
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedEmployee) return;
        
        editForm.put(`/employees/${selectedEmployee.id}`, {
            onSuccess: () => {
                setEditDialogOpen(false);
                setSnackbar({ open: true, message: 'تم تحديث بيانات الموظف بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء تحديث الموظف', severity: 'error' });
            },
        });
    };

    const handleDeleteOpen = (employee: Employee) => {
        setSelectedEmployee(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (!selectedEmployee) return;
        
        router.delete(`/employees/${selectedEmployee.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setSelectedEmployee(null);
                setSnackbar({ open: true, message: 'تم حذف الموظف بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء الحذف', severity: 'error' });
            },
        });
    };

    const handleViewOpen = async (employee: Employee) => {
        setSelectedEmployee(employee);
        setViewDialogOpen(true);
        try {
            const response = await fetch(`/employees/${employee.id}/details`);
            const data = await response.json();
            setEmployeeDetails(data);
        } catch (error) {
            console.error('Error fetching employee details:', error);
        }
    };

    const handleReorderOpen = (type: 'saturday' | 'thursday') => {
        setReorderType(type);
        const sorted = [...employees].sort((a, b) => 
            type === 'saturday' 
                ? a.saturday_order - b.saturday_order 
                : a.thursday_order - b.thursday_order
        );
        setReorderList(sorted);
        setReorderDialogOpen(true);
    };

    const moveEmployee = (index: number, direction: 'up' | 'down') => {
        const newList = [...reorderList];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newList.length) return;
        [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
        setReorderList(newList);
    };

    const handleReorderSave = () => {
        const orders = reorderList.map((emp, index) => ({
            id: emp.id,
            order: index + 1,
        }));
        
        router.post('/employees/reorder', { 
            type: reorderType,
            orders 
        }, {
            onSuccess: () => {
                setReorderDialogOpen(false);
                setSnackbar({ open: true, message: 'تم حفظ الترتيب بنجاح', severity: 'success' });
            },
            onError: () => {
                setSnackbar({ open: true, message: 'حدث خطأ أثناء حفظ الترتيب', severity: 'error' });
            },
        });
    };

    return (
        <MainLayout title="الموظفين">
            <Head title="الموظفين" />
            
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <TextField
                    placeholder="بحث عن موظف..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ minWidth: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ReorderIcon />}
                        onClick={() => handleReorderOpen('saturday')}
                    >
                        ترتيب السبت
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<ReorderIcon />}
                        onClick={() => handleReorderOpen('thursday')}
                    >
                        ترتيب الخميس
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setAddDialogOpen(true)}
                    >
                        إضافة موظف
                    </Button>
                </Box>
            </Box>

            <Card>
                <CardContent>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>#</TableCell>
                                    <TableCell>الاسم</TableCell>
                                    <TableCell>البريد</TableCell>
                                    <TableCell>الحالة</TableCell>
                                    <TableCell>ترتيب السبت</TableCell>
                                    <TableCell>ترتيب الخميس</TableCell>
                                    <TableCell>الإجراءات</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEmployees.map((employee, index) => (
                                    <TableRow key={employee.id} hover>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography fontWeight={500}>{employee.name}</Typography>
                                        </TableCell>
                                        <TableCell>{employee.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={employee.status}
                                                color={statusColors[employee.status]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{employee.saturday_order}</TableCell>
                                        <TableCell>{employee.thursday_order}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                <Tooltip title="عرض التفاصيل">
                                                    <IconButton
                                                        size="small"
                                                        color="info"
                                                        onClick={() => handleViewOpen(employee)}
                                                    >
                                                        <ViewIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="تعديل">
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => handleEditOpen(employee)}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="حذف">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteOpen(employee)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredEmployees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            <Typography color="text.secondary" sx={{ py: 3 }}>
                                                لا يوجد موظفين
                                            </Typography>
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
                    <DialogTitle>إضافة موظف جديد</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="اسم الموظف"
                                value={addForm.data.name}
                                onChange={(e) => addForm.setData('name', e.target.value)}
                                error={!!addForm.errors.name}
                                helperText={addForm.errors.name}
                                fullWidth
                                required
                            />
                            <TextField
                                label="البريد الإلكتروني"
                                type="email"
                                value={addForm.data.email}
                                onChange={(e) => addForm.setData('email', e.target.value)}
                                error={!!addForm.errors.email}
                                helperText={addForm.errors.email}
                                fullWidth
                                required
                            />
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        label="ترتيب السبت"
                                        type="number"
                                        value={addForm.data.saturday_order}
                                        onChange={(e) => addForm.setData('saturday_order', parseInt(e.target.value))}
                                        fullWidth
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="ترتيب الخميس"
                                        type="number"
                                        value={addForm.data.thursday_order}
                                        onChange={(e) => addForm.setData('thursday_order', parseInt(e.target.value))}
                                        fullWidth
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setAddDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained" disabled={addForm.processing}>
                            إضافة
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
                <form onSubmit={handleEditSubmit}>
                    <DialogTitle>تعديل بيانات الموظف</DialogTitle>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                            <TextField
                                label="اسم الموظف"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.target.value)}
                                error={!!editForm.errors.name}
                                helperText={editForm.errors.name}
                                fullWidth
                                required
                            />
                            <TextField
                                label="البريد الإلكتروني"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                error={!!editForm.errors.email}
                                helperText={editForm.errors.email}
                                fullWidth
                                required
                            />
                            <FormControl fullWidth>
                                <InputLabel>الحالة</InputLabel>
                                <Select
                                    value={editForm.data.status}
                                    label="الحالة"
                                    onChange={(e) => editForm.setData('status', e.target.value as Employee['status'])}
                                >
                                    <MenuItem value="متاح">متاح</MenuItem>
                                    <MenuItem value="إجازة مرضية">إجازة مرضية</MenuItem>
                                    <MenuItem value="إجازة سنوية">إجازة سنوية</MenuItem>
                                    <MenuItem value="غير متاح">غير متاح</MenuItem>
                                </Select>
                            </FormControl>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        label="ترتيب السبت"
                                        type="number"
                                        value={editForm.data.saturday_order}
                                        onChange={(e) => editForm.setData('saturday_order', parseInt(e.target.value))}
                                        fullWidth
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="ترتيب الخميس"
                                        type="number"
                                        value={editForm.data.thursday_order}
                                        onChange={(e) => editForm.setData('thursday_order', parseInt(e.target.value))}
                                        fullWidth
                                        inputProps={{ min: 1 }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>إلغاء</Button>
                        <Button type="submit" variant="contained" disabled={editForm.processing}>
                            حفظ التغييرات
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Dialog open={reorderDialogOpen} onClose={() => setReorderDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    ترتيب مناوبات {reorderType === 'saturday' ? 'السبت' : 'الخميس'}
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        استخدم الأسهم لتغيير ترتيب الموظفين في دورة المناوبات
                    </Typography>
                    <List sx={{ bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider' }}>
                        {reorderList.map((emp, index) => (
                            <Box key={emp.id}>
                                <ListItem
                                    secondaryAction={
                                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => moveEmployee(index, 'up')}
                                                disabled={index === 0}
                                            >
                                                <UpIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() => moveEmployee(index, 'down')}
                                                disabled={index === reorderList.length - 1}
                                            >
                                                <DownIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    }
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip label={index + 1} size="small" color="primary" />
                                        <ListItemText primary={emp.name} />
                                    </Box>
                                </ListItem>
                                {index < reorderList.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReorderDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleReorderSave} variant="contained">
                        حفظ الترتيب
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={viewDialogOpen} onClose={() => { setViewDialogOpen(false); setEmployeeDetails(null); }} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {selectedEmployee?.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6">{selectedEmployee?.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedEmployee?.email}
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Tabs value={detailsTab} onChange={(_, v) => setDetailsTab(v)} sx={{ mb: 2 }}>
                        <Tab label="المناوبات" />
                        <Tab label="الأرصدة" />
                        <Tab label="الإجازات" />
                    </Tabs>
                    
                    {detailsTab === 0 && (
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>التاريخ</TableCell>
                                        <TableCell>اليوم</TableCell>
                                        <TableCell>الحالة</TableCell>
                                        <TableCell>يوم إضافي</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employeeDetails?.shifts?.map((shift) => (
                                        <TableRow key={shift.id}>
                                            <TableCell>{formatDate(shift.shift_date)}</TableCell>
                                            <TableCell>{shift.day_name}</TableCell>
                                            <TableCell>
                                                <Chip label={shift.status} size="small" />
                                            </TableCell>
                                            <TableCell>
                                                {shift.has_extra_day ? 'نعم' : 'لا'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!employeeDetails?.shifts || employeeDetails.shifts.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography color="text.secondary">لا توجد مناوبات</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    
                    {detailsTab === 1 && (
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>تاريخ الاكتساب</TableCell>
                                        <TableCell>تاريخ الانتهاء</TableCell>
                                        <TableCell>النوع</TableCell>
                                        <TableCell>الحالة</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employeeDetails?.balances?.map((balance) => (
                                        <TableRow key={balance.id}>
                                            <TableCell>{formatDate(balance.earned_date)}</TableCell>
                                            <TableCell>{formatDate(balance.expiry_date)}</TableCell>
                                            <TableCell>{balance.type}</TableCell>
                                            <TableCell>
                                                <Chip label={balance.status} size="small" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!employeeDetails?.balances || employeeDetails.balances.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography color="text.secondary">لا توجد أرصدة</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                    
                    {detailsTab === 2 && (
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>التاريخ</TableCell>
                                        <TableCell>النوع</TableCell>
                                        <TableCell>الحالة</TableCell>
                                        <TableCell>السبب</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {employeeDetails?.leaves?.map((leave) => (
                                        <TableRow key={leave.id}>
                                            <TableCell>{formatDate(leave.leave_date)}</TableCell>
                                            <TableCell>{leave.type}</TableCell>
                                            <TableCell>
                                                <Chip label={leave.status} size="small" />
                                            </TableCell>
                                            <TableCell>{leave.notes || '-'}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(!employeeDetails?.leaves || employeeDetails.leaves.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography color="text.secondary">لا توجد إجازات</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setViewDialogOpen(false); setEmployeeDetails(null); }}>
                        إغلاق
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>تأكيد الحذف</DialogTitle>
                <DialogContent>
                    <Typography>
                        هل أنت متأكد من حذف الموظف "{selectedEmployee?.name}"؟
                    </Typography>
                    <Alert severity="warning" sx={{ mt: 2 }}>
                        سيتم حذف جميع بيانات هذا الموظف بشكل نهائي
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>إلغاء</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        تأكيد الحذف
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
