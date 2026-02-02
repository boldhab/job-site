import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { 
  Cog6ToothIcon, 
  EnvelopeIcon, 
  LockClosedIcon, 
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  PhoneIcon,
  DocumentTextIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'Ethio-Career',
    supportEmail: 'support@ethiocareer.et',
    contactNumber: '+251 XXX XX XX XX',
    paginationLimit: 20,
    maintenanceMode: false
  });

  const tabs = [
    { id: 'general', name: 'General Settings', icon: Cog6ToothIcon, description: 'Platform configuration' },
    { id: 'email', name: 'Email Templates', icon: EnvelopeIcon, description: 'Email communications' },
    { id: 'security', name: 'Password Policy', icon: LockClosedIcon, description: 'Security settings' },
    { id: 'maintenance', name: 'System Maintenance', icon: WrenchScrewdriverIcon, description: 'System controls' },
  ];

  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  const handleMaintenanceToggle = () => {
    if (!settings.maintenanceMode && !window.confirm('Are you sure you want to enable maintenance mode? This will restrict platform access.')) {
      return;
    }
    setSettings(prev => ({
      ...prev,
      maintenanceMode: !prev.maintenanceMode
    }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
            <GlobeAltIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-amber-800">Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label=" Name"
            value={settings.siteName}
            onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
            placeholder="Ethio-Career"
            icon={<GlobeAltIcon className="w-5 h-5" />}
          />
          
          <Input
            label="Support Email"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings(prev => ({ ...prev, supportEmail: e.target.value }))}
            placeholder="support@ethiocareer.et"
            icon={<EnvelopeIcon className="w-5 h-5" />}
          />
          
          <Input
            label="Contact Number"
            value={settings.contactNumber}
            onChange={(e) => setSettings(prev => ({ ...prev, contactNumber: e.target.value }))}
            placeholder="+251 XXX XX XX XX"
            icon={<PhoneIcon className="w-5 h-5" />}
          />
          
         
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl p-6 border-2 border-amber-100">
        <div className="flex items-center gap-3 mb-4">
          <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
          <h4 className="font-bold text-amber-800">Platform Information</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-amber-700 font-medium">Version</p>
            <p className="text-neutral-900 font-semibold">2.1.0</p>
          </div>
          <div>
            <p className="text-amber-700 font-medium">Environment</p>
            <p className="text-neutral-900 font-semibold">Production</p>
          </div>
          <div>
            <p className="text-amber-700 font-medium">Last Updated</p>
            <p className="text-neutral-900 font-semibold">Jan 15, 2024</p>
          </div>
          <div>
            <p className="text-amber-700 font-medium">Uptime</p>
            <p className="text-neutral-900 font-semibold">99.8%</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end pt-6 border-t-2 border-amber-100">
        <Button 
          variant="primary"
          loading={saving}
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-600 to-amber-700"
        >
          Save Platform Settings
        </Button>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
            <EnvelopeIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-amber-800">Email Templates</h3>
        </div>
        
        <div className="space-y-4">
          {[
            
            { name: 'Opportunity Application Received', description: 'Confirmation for job applications' },
            { name: 'Interview Invitation', description: 'Invitation for interview scheduling' },
            { name: 'Password Reset', description: 'Password reset instructions' },
            { name: 'Employer Approval', description: 'Notification for employer approval' }
          ].map((template) => (
            <Card key={template.name} hover className="border-amber-100">
              <div className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl">
                    <EnvelopeIcon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">{template.name}</h4>
                    <p className="text-sm text-amber-700">{template.description}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="small"
                  className="border-amber-200 text-amber-800 hover:border-amber-300"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Edit Template
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
            <LockClosedIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-amber-800">Password Policy</h3>
        </div>
        
        <div className="space-y-6 max-w-2xl">
          <div className="p-5 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-neutral-900">Minimum Password Length</p>
                <p className="text-sm text-amber-700">Require passwords to be at least 8 characters long</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-amber-800">8</span>
                <span className="text-amber-700">characters</span>
              </div>
            </div>
            <input 
              type="range" 
              min="6" 
              max="16" 
              defaultValue="8"
              className="w-full h-2 bg-amber-100 rounded-lg appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-amber-600 [&::-webkit-slider-thumb]:to-amber-700 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
            />
          </div>
          
          {[
            { 
              label: 'Require Special Characters', 
              description: 'Password must contain at least one special character (!@#$%^&*)',
              defaultChecked: true 
            },
            { 
              label: 'Require Uppercase Letters', 
              description: 'Password must contain at least one uppercase letter (A-Z)',
              defaultChecked: true 
            },
            { 
              label: 'Require Numbers', 
              description: 'Password must contain at least one number (0-9)',
              defaultChecked: true 
            }
            
           
          ].map((policy, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50/50 to-orange-50/30 rounded-2xl border-2 border-amber-100 hover:border-amber-200 transition-colors">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <input 
                    type="checkbox" 
                    defaultChecked={policy.defaultChecked}
                    className="w-5 h-5 rounded-xl border-2 border-amber-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0"
                  />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{policy.label}</p>
                  <p className="text-sm text-amber-700 mt-1">{policy.description}</p>
                </div>
              </div>
              <KeyIcon className="w-5 h-5 text-amber-600" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end pt-6 border-t-2 border-amber-100">
        <Button 
          variant="primary"
          loading={saving}
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-600 to-amber-700"
        >
          Update Security Policy
        </Button>
      </div>
    </div>
  );

  const renderMaintenanceSettings = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl">
            <WrenchScrewdriverIcon className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-xl font-bold text-amber-800">System Maintenance</h3>
        </div>
        
        <Card variant="gradient" className="border-2 border-red-200 bg-gradient-to-r from-red-50/80 to-red-100/50">
          <div className="flex items-start gap-4 p-6">
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-50 rounded-xl">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-red-900">Maintenance Mode</h4>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-bold rounded-xl ${settings.maintenanceMode ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {settings.maintenanceMode ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
              <p className="text-red-800 mb-6 leading-relaxed">
                Enabling maintenance mode will restrict access to the platform. Only administrators will be able to log in 
                and access the dashboard. This is useful for system updates, maintenance, or emergency situations.
              </p>
              <div className="flex items-center gap-4">
                <Button 
                  variant={settings.maintenanceMode ? "outline" : "primary"}
                  className={settings.maintenanceMode ? "border-red-300 text-red-700 hover:bg-red-50" : "bg-gradient-to-r from-red-600 to-red-700"}
                  onClick={handleMaintenanceToggle}
                >
                  {settings.maintenanceMode ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      Disable Maintenance Mode
                    </>
                  ) : (
                    <>
                      <WrenchScrewdriverIcon className="w-4 h-4 mr-2" />
                      Enable Maintenance Mode
                    </>
                  )}
                </Button>
                {settings.maintenanceMode && (
                  <Button variant="outline" className="border-amber-200 text-amber-800">
                    Set Maintenance Message
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
      
     
              </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-amber-800 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-neutral-600 mt-2">
                Configure platform preferences, security policies, and system behavior for Ethio-Career.
              </p>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
              <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">
                Administrator Access
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:w-72">
            <Card variant="gradient" padding="medium" className="border-amber-100 sticky top-8">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center p-4 text-sm font-semibold rounded-2xl transition-all duration-300 group ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-amber-50/90 to-orange-50/60 text-amber-800 border-2 border-amber-200 shadow-sm'
                          : 'text-neutral-700 hover:text-amber-800 hover:bg-amber-50/50 border-2 border-transparent hover:border-amber-100'
                      }`}
                    >
                      <div className={`p-3 rounded-xl mr-4 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-600 group-hover:scale-110'
                          : 'bg-neutral-100 text-neutral-400 group-hover:text-amber-500 group-hover:bg-amber-50'
                      } transition-all duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold">{tab.name}</div>
                        <div className="text-xs text-neutral-500 group-hover:text-amber-600 transition-colors">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <Card variant="elevated" padding="large" className="border-amber-100 min-h-[600px]">
              {activeTab === 'general' && renderGeneralSettings()}
              {activeTab === 'email' && renderEmailSettings()}
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'maintenance' && renderMaintenanceSettings()}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;