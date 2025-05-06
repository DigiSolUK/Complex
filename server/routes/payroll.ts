import { Request, Response } from 'express';
import { auth } from '../auth';

// Sample timesheet data
const timesheets = [
  {
    id: 'ts-001',
    careProfessionalName: 'Sarah Johnson',
    careProfessionalId: 'CP-1001',
    period: 'May 1-31, 2025',
    hours: 160.5,
    regularHours: 152.0,
    overtimeHours: 8.5,
    rate: 18.50,
    totalAmount: 3034.25,
    status: 'pending'
  },
  {
    id: 'ts-002',
    careProfessionalName: 'Michael Chen',
    careProfessionalId: 'CP-1002',
    period: 'May 1-31, 2025',
    hours: 142.0,
    regularHours: 142.0,
    overtimeHours: 0.0,
    rate: 19.75,
    totalAmount: 2804.50,
    status: 'pending'
  },
  {
    id: 'ts-003',
    careProfessionalName: 'Emma Davis',
    careProfessionalId: 'CP-1003',
    period: 'May 1-31, 2025',
    hours: 168.0,
    regularHours: 152.0,
    overtimeHours: 16.0,
    rate: 20.00,
    totalAmount: 3520.00,
    status: 'approved',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-05-02T14:30:00Z'
  },
  {
    id: 'ts-004',
    careProfessionalName: 'Robert Taylor',
    careProfessionalId: 'CP-1004',
    period: 'May 1-31, 2025',
    hours: 120.0,
    regularHours: 120.0,
    overtimeHours: 0.0,
    rate: 17.25,
    totalAmount: 2070.00,
    status: 'rejected',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-05-03T09:15:00Z',
    notes: 'Duplicate entry. Staff member submitted twice for same period.'
  },
  {
    id: 'ts-005',
    careProfessionalName: 'Olivia Thompson',
    careProfessionalId: 'CP-1005',
    period: 'May 1-31, 2025',
    hours: 155.5,
    regularHours: 152.0,
    overtimeHours: 3.5,
    rate: 21.50,
    totalAmount: 3405.75,
    status: 'approved',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-05-02T16:45:00Z'
  },
  {
    id: 'ts-006',
    careProfessionalName: 'Sarah Johnson',
    careProfessionalId: 'CP-1001',
    period: 'April 1-30, 2025',
    hours: 157.0,
    regularHours: 152.0,
    overtimeHours: 5.0,
    rate: 18.50,
    totalAmount: 2959.25,
    status: 'approved',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-04-02T11:20:00Z'
  },
  {
    id: 'ts-007',
    careProfessionalName: 'Michael Chen',
    careProfessionalId: 'CP-1002',
    period: 'April 1-30, 2025',
    hours: 160.0,
    regularHours: 152.0,
    overtimeHours: 8.0,
    rate: 19.75,
    totalAmount: 3234.00,
    status: 'approved',
    approvedBy: 'Dr. James Wilson',
    approvedAt: '2025-04-02T13:10:00Z'
  },
];

export function registerPayrollRoutes(app: any) {
  // Get all timesheets
  app.get('/api/payroll/timesheets', auth.isAuthenticated, (req: Request, res: Response) => {
    // In a real app, filter by tenant and period
    // Could add pagination here too
    res.json(timesheets);
  });

  // Approve timesheets
  app.post('/api/payroll/timesheets/approve', auth.isAuthenticated, (req: Request, res: Response) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid request. Timesheet IDs array is required.' });
    }
    
    // In a real app, update database records
    // Here we just return success
    res.json({ 
      success: true, 
      message: `Approved ${ids.length} timesheet(s)`,
      ids
    });
  });

  // Reject timesheets
  app.post('/api/payroll/timesheets/reject', auth.isAuthenticated, (req: Request, res: Response) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid request. Timesheet IDs array is required.' });
    }
    
    // In a real app, update database records
    // Here we just return success
    res.json({ 
      success: true, 
      message: `Rejected ${ids.length} timesheet(s)`,
      ids
    });
  });

  // Export routes
  app.post('/api/payroll/export/:format', auth.isAuthenticated, (req: Request, res: Response) => {
    const { ids } = req.body;
    const format = req.params.format;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid request. Timesheet IDs array is required.' });
    }
    
    if (!['xls', 'csv', 'json', 'api'].includes(format)) {
      return res.status(400).json({ message: 'Invalid export format.' });
    }
    
    // Filter timesheets by requested IDs
    const selectedTimesheets = timesheets.filter(ts => ids.includes(ts.id));
    
    if (format === 'api') {
      // For API format, just return success message
      return res.json({
        success: true,
        message: `Successfully exported ${selectedTimesheets.length} timesheet(s) to payroll system`,
        count: selectedTimesheets.length
      });
    }
    
    // For file formats (in a real app, we'd generate actual files)
    // Here we just return JSON data with different content types
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="payroll-export-${new Date().toISOString().split('T')[0]}.json"`);
      return res.send(JSON.stringify(selectedTimesheets, null, 2));
    }
    
    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="payroll-export-${new Date().toISOString().split('T')[0]}.csv"`);
      
      // Simple CSV creation (in a real app, use a CSV library)
      const headers = ['id', 'careProfessionalName', 'careProfessionalId', 'period', 'hours', 'regularHours', 'overtimeHours', 'rate', 'totalAmount', 'status'];
      const csvContent = [
        headers.join(','),
        ...selectedTimesheets.map(ts => headers.map(key => JSON.stringify(ts[key as keyof typeof ts] || '')).join(','))
      ].join('\n');
      
      return res.send(csvContent);
    }
    
    if (format === 'xls') {
      // In a real app, we'd generate an actual Excel file
      // Here we just send a JSON blob with Excel content type
      res.setHeader('Content-Type', 'application/vnd.ms-excel');
      res.setHeader('Content-Disposition', `attachment; filename="payroll-export-${new Date().toISOString().split('T')[0]}.xls"`);
      return res.send(JSON.stringify(selectedTimesheets, null, 2));
    }
  });
}
