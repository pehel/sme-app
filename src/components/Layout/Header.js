import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import {
  UserIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const navigate = useNavigate();
  const {
    user,
    role,
    selectedEntity,
    entities,
    isAuthenticated,
    setRole,
    selectEntity,
    logout,
    demoMode,
    toggleDemoMode,
    approvalStatus,
    pendingApprovals,
    digitalSigningSession
  } = useAppStore();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleEntityChange = (entityId) => {
    selectEntity(entityId);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleColor = (currentRole) => {
    switch (currentRole) {
      case 'DIRECTOR':
        return 'bg-blue-100 text-blue-800';
      case 'STAFF':
        return 'bg-green-100 text-green-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'PREPARER':
        return 'bg-green-100 text-green-800';
      case 'FLU':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolePermissions = (currentRole) => {
    switch (currentRole) {
      case 'DIRECTOR':
        return 'Can approve applications & digitally sign';
      case 'STAFF':
        return 'Can prepare applications, requires Director approval';
      case 'ADMIN':
        return 'System administration & oversight';
      case 'PREPARER':
        return 'Can edit, requires Director approval to submit';
      case 'FLU':
        return 'Can manage RTL tasks and approve to credit';
      default:
        return 'Unknown permissions';
    }
  };

  const getApprovalStatusBadge = () => {
    if (!approvalStatus || approvalStatus === 'DRAFT') return null;
    
    const statusConfig = {
      'PENDING_DIRECTOR': { color: 'bg-yellow-100 text-yellow-800', text: 'Awaiting Director Approval' },
      'APPROVED': { color: 'bg-green-100 text-green-800', text: 'Director Approved' },
      'EXPIRED': { color: 'bg-red-100 text-red-800', text: 'Approval Expired' },
      'REJECTED': { color: 'bg-red-100 text-red-800', text: 'Director Rejected' }
    };
    
    const config = statusConfig[approvalStatus];
    if (!config) return null;
    
    return (
      <div className={`${config.color} px-3 py-1 rounded-full text-sm font-medium`}>
        {config.text}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">SME Banking Portal</h1>
            </div>
            {demoMode && (
              <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                Demo Mode
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">SME Banking Portal</h1>
          </div>

          {/* Center - Entity and Role Info */}
          <div className="flex items-center space-x-6">
            {/* Entity Selector */}
            {selectedEntity && (
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedEntity.id}
                  onChange={(e) => handleEntityChange(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
                >
                  {entities.map((entity) => (
                    <option key={entity.id} value={entity.id}>
                      {entity.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            )}

            {/* Role Switcher */}
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Role:</span>
              <div className="flex space-x-1">
                {['DIRECTOR', 'STAFF', 'ADMIN'].map((roleOption) => (
                  <button
                    key={roleOption}
                    onClick={() => handleRoleChange(roleOption)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      role === roleOption
                        ? getRoleColor(roleOption)
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={getRolePermissions(roleOption)}
                  >
                    {roleOption}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Approval Status */}
            {getApprovalStatusBadge()}
            
            {/* Director Notifications */}
            {role === 'DIRECTOR' && pendingApprovals.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => navigate('/director/approvals')}
                  className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                >
                  <span>{pendingApprovals.length} Approval{pendingApprovals.length !== 1 ? 's' : ''} Pending</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Side - User Info and Controls */}
          <div className="flex items-center space-x-4">
            {/* Demo Mode Toggle */}
            <button
              onClick={toggleDemoMode}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                demoMode
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {demoMode ? 'Demo Mode ON' : 'Demo Mode OFF'}
            </button>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/status')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Status
              </button>
              <button
                onClick={() => navigate('/email-notifications')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Email Workflow
              </button>
              <button
                onClick={() => navigate('/day2')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Facilities
              </button>
              {role === 'FLU' && (
                <button
                  onClick={() => navigate('/staff/rtl')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  RTL Tasks
                </button>
              )}
              {role === 'DIRECTOR' && (
                <button
                  onClick={() => navigate('/director/dashboard')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Director Portal
                </button>
              )}
              {role === 'STAFF' && (
                <button
                  onClick={() => navigate('/staff/dashboard')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Staff Dashboard
                </button>
              )}
            </nav>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                {user?.name || 'Demo User'}
              </span>
            </div>

            {/* Settings and Logout */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/settings')}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Settings"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleLogout}
                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Role Permissions Info */}
        <div className="mt-2 flex justify-center">
          <div className="bg-gray-50 px-4 py-2 rounded-lg">
            <span className="text-xs text-gray-600">
              Current permissions: {getRolePermissions(role)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
