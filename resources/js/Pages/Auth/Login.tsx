import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

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
        // حل مشكلة آيفون: إزالة المسافات وتحويل الحروف لصغيرة
        data.email = data.email.trim().toLowerCase();
        data.password = data.password.trim();
        post('/login');
    };

    return (
        <>
            <Head title="تسجيل الدخول" />

            <div
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                }}
            >
                {/* الدوائر الخلفية للزينة */}
                <div
                    className="absolute w-[400px] h-[400px] rounded-full -top-[100px] -right-[100px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute w-[300px] h-[300px] rounded-full -bottom-[50px] -left-[50px]"
                    style={{
                        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                    }}
                />

                {/* كرت تسجيل الدخول */}
                <div
                    className="w-full max-w-[420px] mx-2 relative z-10 rounded-xl p-8"
                    style={{
                        backgroundColor: '#1e293b',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}
                >
                    {/* الهيدر - الأيقونة والعنوان */}
                    <div className="text-center mb-8">
                        <div
                            className="w-[70px] h-[70px] rounded-2xl flex items-center justify-center mx-auto mb-3"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.3)',
                            }}
                        >
                            {/* أيقونة الساعة */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-9 h-9 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-1">
                            نظام إدارة المناوبات
                        </h1>
                        <p className="text-sm text-slate-400">
                            قم بتسجيل الدخول للوصول إلى لوحة التحكم
                        </p>
                    </div>

                    {/* رسالة النجاح */}
                    {status && (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center">
                            {status}
                        </div>
                    )}

                    {/* الفورم */}
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        {/* حقل البريد الإلكتروني */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                البريد الإلكتروني
                            </label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoFocus
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    autoComplete="email"
                                    inputMode="email"
                                    className={`w-full pr-10 pl-4 py-3 rounded-lg bg-slate-800/50 border text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                                        errors.email
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-slate-600 focus:border-indigo-500'
                                    }`}
                                    placeholder="example@email.com"
                                    dir="ltr"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* حقل كلمة المرور */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                    </svg>
                                </span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="current-password"
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                    className={`w-full pr-10 pl-12 py-3 rounded-lg bg-slate-800/50 border text-white placeholder-slate-500 text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 ${
                                        errors.password
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-slate-600 focus:border-indigo-500'
                                    }`}
                                    placeholder="••••••••"
                                    dir="ltr"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
                            )}
                        </div>

                        {/* تذكرني */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                            />
                            <span className="text-sm text-slate-300">تذكرني</span>
                        </label>

                        {/* زر تسجيل الدخول */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg active:scale-[0.98]"
                            style={{
                                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                            }}
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                'تسجيل الدخول'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}