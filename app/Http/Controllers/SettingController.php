<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    private $defaultShiftSettings = [
        'السبت' => ['start_time' => '13:00', 'end_time' => '06:00', 'has_extra_day' => true, 'enabled' => true],
        'الأحد' => ['start_time' => '13:00', 'end_time' => '06:00', 'has_extra_day' => false, 'enabled' => true],
        'الإثنين' => ['start_time' => '13:00', 'end_time' => '06:00', 'has_extra_day' => false, 'enabled' => true],
        'الثلاثاء' => ['start_time' => '13:00', 'end_time' => '06:00', 'has_extra_day' => false, 'enabled' => true],
        'الأربعاء' => ['start_time' => '13:00', 'end_time' => '06:00', 'has_extra_day' => false, 'enabled' => true],
        'الخميس' => ['start_time' => '13:00', 'end_time' => '08:00', 'has_extra_day' => false, 'enabled' => true],
        'الجمعة' => ['start_time' => '13:00', 'end_time' => '08:00', 'has_extra_day' => true, 'enabled' => true],
    ];

    public function index()
    {
        $shiftSettings = Setting::get('shift_settings');
        $shiftSettings = $shiftSettings ? json_decode($shiftSettings, true) : $this->defaultShiftSettings;
        
        $settings = [
            'notifications_enabled' => Setting::get('notifications_enabled', 'false') === 'true',
            'shift_settings' => $shiftSettings,
            'balance_expiry_days' => (int) Setting::get('balance_expiry_days', '7'),
        ];

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'value' => 'required',
        ]);

        Setting::set($validated['key'], $validated['value']);
        ActivityLog::log('update_setting', "تم تحديث الإعداد: {$validated['key']}");

        return back()->with('success', 'تم تحديث الإعدادات بنجاح');
    }

    public function updateShiftSettings(Request $request)
    {
        $validated = $request->validate([
            'shift_settings' => 'required|array',
        ]);

        Setting::set('shift_settings', json_encode($validated['shift_settings']));
        ActivityLog::log('update_shift_settings', 'تم تحديث إعدادات المناوبات');

        return back()->with('success', 'تم تحديث إعدادات المناوبات بنجاح');
    }
}
