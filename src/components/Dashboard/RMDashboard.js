import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BuildingOfficeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  DocumentTextIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

function RMDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Mock applications data for RM review
  useEffect(() => {
    const loadApplications = () => {
      setTimeout(() => {
        const mockApplications = [
          {
            id: 'APP-2024-001',
            customerName: 'John Smith',
            businessName: 'Tech Solutions Ltd',
            email: 'john@techsolutions.ie',
            phone: '+353-87-123-4567',
            products: ['Business Loan', 'Business Account'],
            totalAmount: 75000,
            status: 'PENDING_REVIEW',
            priority: 'HIGH',
            submittedAt: new Date('2024-01-15'),
            lastUpdated: new Date('2024-01-16'),
            assignedRM: user?.id,
            estimatedDecision: new Date('2024-01-20'),
            riskScore: 'MEDIUM',
            completionPercentage: 100,
            notes: 'Established tech company, strong financials'
          },
          {
            id: 'APP-2024-002',
            customerName: 'Sarah O\'Connor',
            businessName: 'Green Energy Solutions',
            email: 'sarah@greenenergy.ie',
            phone: '+353-87-234-5678',
            products: ['Business Loan'],
            totalAmount: 150000,
            status: 'UNDER_REVIEW',
            priority: 'HIGH',
            submittedAt: new Date('2024-01-14'),
            lastUpdated: new Date('2024-01-18'),
            assignedRM: user?.id,
            estimatedDecision: new Date('2024-01-25'),
            riskScore: 'LOW',
            completionPercentage: 100,
            notes: 'Renewable energy sector, government incentives available'
          },
          {
            id: 'APP-2024-003',
            customerName: 'Michael Murphy',
            businessName: 'Dublin Retail Ltd',
            email: 'michael@dublinretail.ie',
            phone: '+353-87-345-6789',
            products: ['Credit Line', 'Merchant Services'],
            totalAmount: 35000,
            status: 'PENDING_REVIEW',
            priority: 'MEDIUM',
            submittedAt: new Date('2024-01-16'),
            lastUpdated: new Date('2024-01-17'),
            assignedRM: user?.id,
            estimatedDecision: new Date('2024-01-22'),
            riskScore: 'MEDIUM',
            completionPercentage: 100,
            notes: 'Retail business, seasonal variations in revenue'
          },
          {
            id: 'APP-2024-004',
            customerName: 'Emma Wilson',
            businessName: 'Digital Marketing Pro',
            email: 'emma@digitalmarketing.ie',
            phone: '+353-87-456-7890',
            products: ['Business Account'],
            totalAmount: 0,
            status: 'APPROVED',
            priority: 'LOW',
            submittedAt: new Date('2024-01-12'),
            lastUpdated: new Date('2024-01-13'),
            assignedRM: user?.id,
            estimatedDecision: null,
            riskScore: 'LOW',
            completionPercentage: 100,
            notes: 'Service-based business, low risk profile'
          }
        ];
        setApplications(mockApplications);
        setFilteredApplications(mockApplications);
        setIsLoading(false);
      }, 800);
    };

    loadApplications();
  }, [user]);

  // Filter and search applications
  useEffect(() => {
    let filtered = applications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'totalAmount') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (aValue instanceof Date) {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, sortField, sortDirection]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'REJECTED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'PENDING_REVIEW':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'UNDER_REVIEW':
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING_REVIEW':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleReviewApplication = (application) => {
    navigate(`/rm/review/${application.id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatCurrency = (amount) => {
    if (amount === 0) return 'Service-based';
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-IE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="h-4 w-4" /> : 
      <ArrowDownIcon className="h-4 w-4" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RM Dashboard</h1>
                <p className="text-sm text-gray-600">Application Review Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Relationship Manager</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Applications
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {applications.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Review
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {applications.filter(app => app.status === 'PENDING_REVIEW').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Under Review
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {applications.filter(app => app.status === 'UNDER_REVIEW').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyEuroIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Value
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {formatCurrency(applications.reduce((sum, app) => sum + app.totalAmount, 0))}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {filteredApplications.length} of {applications.length} applications
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="px-4 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Applications for Review
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Manage and review customer applications assigned to you
              </p>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('id')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Application ID</span>
                          {getSortIcon('id')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('customerName')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Customer</span>
                          {getSortIcon('customerName')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Products
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('totalAmount')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Amount</span>
                          {getSortIcon('totalAmount')}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Priority
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort('submittedAt')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Submitted</span>
                          {getSortIcon('submittedAt')}
                        </div>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplications.map((application) => (
                      <tr key={application.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {application.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <UserGroupIcon className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.customerName}
                              </div>
                              <div className="text-sm text-gray-500">
                                {application.businessName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="space-y-1">
                            {application.products.map((product) => (
                              <div key={product} className="text-xs bg-gray-100 rounded px-2 py-1 inline-block mr-1">
                                {product}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(application.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getStatusIcon(application.status)}
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {application.status.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(application.priority)}`}>
                            {application.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(application.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleReviewApplication(application)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <EyeIcon className="h-3 w-3 mr-1" />
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 sm:px-0 mt-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <ClockIcon className="h-6 w-6 text-yellow-500 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Pending Reviews</p>
                  <p className="text-xs text-gray-500">
                    {applications.filter(app => app.status === 'PENDING_REVIEW').length} applications
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
              </button>

              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-500 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">High Priority</p>
                  <p className="text-xs text-gray-500">
                    {applications.filter(app => app.priority === 'HIGH').length} applications
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
              </button>

              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <CalendarDaysIcon className="h-6 w-6 text-blue-500 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Due Today</p>
                  <p className="text-xs text-gray-500">
                    {applications.filter(app => 
                      app.estimatedDecision && 
                      app.estimatedDecision.toDateString() === new Date().toDateString()
                    ).length} applications
                  </p>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RMDashboard;
