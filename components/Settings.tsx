import React, { useState, useEffect } from 'react';
import Card from './shared/Card';
import Button from './shared/Button';

const Settings: React.FC = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'system');

    useEffect(() => {
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        if (newTheme === 'system') {
            localStorage.removeItem('theme');
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                 document.documentElement.classList.add('dark');
            } else {
                 document.documentElement.classList.remove('dark');
            }
        } else {
            localStorage.setItem('theme', newTheme);
        }
    }


  return (
    <Card className="animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        {/* Appearance Settings */}
        <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Appearance</h3>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Theme:</span>
                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    <Button variant={theme === 'light' ? 'primary': 'secondary'} onClick={() => handleThemeChange('light')} className="text-sm !px-3 !py-1">Light</Button>
                    <Button variant={theme === 'dark' ? 'primary': 'secondary'} onClick={() => handleThemeChange('dark')} className="text-sm !px-3 !py-1">Dark</Button>
                </div>
            </div>
        </div>

        {/* Account Settings */}
        <div>
            <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Account</h3>
            <p className="text-muted-foreground text-sm">Profile and notification settings will be available here soon.</p>
        </div>
      </div>
    </Card>
  );
};

export default Settings;
