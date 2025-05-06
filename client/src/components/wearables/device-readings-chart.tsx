import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ComfortMessage } from '@/components/ui';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from 'recharts';
import { Loader2, ArrowDownUp, BarChart2, Activity, AlertCircle } from 'lucide-react';

type DeviceReadingsChartProps = {
  deviceId: number;
  patientId: number;
};

type ReadingType = 'heart_rate' | 'steps' | 'blood_glucose' | 'blood_pressure' | 'oxygen_saturation' | 'temperature';

type Reading = {
  id: number;
  deviceId: number;
  patientId: number;
  readingType: ReadingType;
  value: string;
  unit: string;
  timestamp: string;
  readingStatus: 'normal' | 'abnormal' | 'critical';
  metricGroup?: string;
  verified: boolean;
  createdAt: string;
};

type ChartTimeRange = '24h' | '7d' | '30d' | '90d';

const formatReadingValue = (value: string, unit: string) => {
  // Handle decimal values
  const formattedValue = isNaN(parseFloat(value)) ? value : parseFloat(value);
  return `${formattedValue} ${unit}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'abnormal':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'critical':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getReadingTypeLabel = (type: ReadingType): string => {
  switch (type) {
    case 'heart_rate':
      return 'Heart Rate';
    case 'steps':
      return 'Steps';
    case 'blood_glucose':
      return 'Blood Glucose';
    case 'blood_pressure':
      return 'Blood Pressure';
    case 'oxygen_saturation':
      return 'Oxygen Saturation';
    case 'temperature':
      return 'Temperature';
    default:
      return type.replace('_', ' ');
  }
};

const getReadingTypeColor = (type: ReadingType): string => {
  switch (type) {
    case 'heart_rate':
      return '#f44336'; // Red
    case 'steps':
      return '#2196f3'; // Blue
    case 'blood_glucose':
      return '#9c27b0'; // Purple
    case 'blood_pressure':
      return '#ff9800'; // Orange
    case 'oxygen_saturation':
      return '#4caf50'; // Green
    case 'temperature':
      return '#e91e63'; // Pink
    default:
      return '#607d8b'; // Blue Grey
  }
};

interface CustomTooltipProps extends TooltipProps<any, any> {}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const reading = payload[0].payload;
    const value = reading.value;
    const unit = reading.unit;
    const time = new Date(reading.timestamp).toLocaleTimeString();
    const date = new Date(reading.timestamp).toLocaleDateString();
    const status = reading.readingStatus;
    const type = reading.readingType;
    const metricGroup = reading.metricGroup;

    return (
      <div className="bg-white p-4 shadow-md rounded-md border border-gray-200 min-w-[200px]">
        <p className="text-sm text-gray-500">{date} {time}</p>
        <p className="font-bold text-lg mt-1">
          {metricGroup ? `${metricGroup}: ` : ''}
          {formatReadingValue(value, unit)}
        </p>
        <p className="text-primary">{getReadingTypeLabel(type)}</p>
        <Badge className={`mt-2 ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </div>
    );
  }

  return null;
};

const DeviceReadingsChart: React.FC<DeviceReadingsChartProps> = ({ deviceId, patientId }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<ChartTimeRange>('24h');
  const [selectedReadingType, setSelectedReadingType] = useState<ReadingType | 'all'>('all');
  
  // Fetch device data
  const { data: device, isLoading: isLoadingDevice } = useQuery({
    queryKey: [`/api/wearables/${deviceId}`],
    enabled: !!deviceId,
  });
  
  // Fetch device readings
  const { data: readings, isLoading: isLoadingReadings } = useQuery({
    queryKey: [
      `/api/patients/${patientId}/wearables/${deviceId}/readings`, 
      selectedTimeRange,
      selectedReadingType !== 'all' ? selectedReadingType : undefined
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('timeRange', selectedTimeRange);
      if (selectedReadingType !== 'all') {
        params.append('type', selectedReadingType);
      }
      
      const response = await fetch(
        `/api/patients/${patientId}/wearables/${deviceId}/readings?${params.toString()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch device readings');
      }
      
      return response.json();
    },
  });

  const isLoading = isLoadingDevice || isLoadingReadings;

  // Get unique reading types from the data
  const readingTypes = useMemo(() => {
    if (!readings || !Array.isArray(readings)) return [];
    
    const types = [...new Set(readings.map((r: Reading) => r.readingType))];
    return types;
  }, [readings]);

  // Format the data for the chart
  const chartData = useMemo(() => {
    if (!readings || !Array.isArray(readings)) return [];
    
    // If showing only one reading type, we'll just format the timestamps
    if (selectedReadingType !== 'all') {
      // Filter readings by selected type
      const filteredReadings = readings.filter((r: Reading) => 
        r.readingType === selectedReadingType
      );

      // For blood pressure, group systolic and diastolic together by timestamp
      if (selectedReadingType === 'blood_pressure') {
        const groupedByTimestamp: Record<string, any> = {};
        
        filteredReadings.forEach((reading: Reading) => {
          const timestamp = new Date(reading.timestamp).getTime();
          
          if (!groupedByTimestamp[timestamp]) {
            groupedByTimestamp[timestamp] = {
              timestamp: reading.timestamp,
              formattedTime: formatTimestamp(reading.timestamp, selectedTimeRange),
              readingType: reading.readingType,
              unit: reading.unit,
              readingStatus: reading.readingStatus,
            };
          }
          
          if (reading.metricGroup === 'systolic') {
            groupedByTimestamp[timestamp].systolic = parseFloat(reading.value);
          } else if (reading.metricGroup === 'diastolic') {
            groupedByTimestamp[timestamp].diastolic = parseFloat(reading.value);
          }
        });
        
        return Object.values(groupedByTimestamp);
      }
      
      // For other reading types, just format the data
      return filteredReadings.map((reading: Reading) => ({
        ...reading,
        value: parseFloat(reading.value),
        formattedTime: formatTimestamp(reading.timestamp, selectedTimeRange),
      }));
    }
    
    // If showing all types, we need to create a multi-series dataset
    // Group by timestamp
    const groupedData: Record<string, any> = {};
    
    readings.forEach((reading: Reading) => {
      const timestamp = new Date(reading.timestamp).getTime();
      const formattedTime = formatTimestamp(reading.timestamp, selectedTimeRange);
      
      if (!groupedData[timestamp]) {
        groupedData[timestamp] = {
          timestamp: reading.timestamp,
          formattedTime,
        };
      }
      
      // For blood pressure, handle systolic and diastolic
      if (reading.readingType === 'blood_pressure' && reading.metricGroup) {
        groupedData[timestamp][`${reading.readingType}_${reading.metricGroup}`] = parseFloat(reading.value);
        // Also store metadata for tooltips
        groupedData[timestamp][`${reading.readingType}_${reading.metricGroup}_unit`] = reading.unit;
        groupedData[timestamp][`${reading.readingType}_${reading.metricGroup}_status`] = reading.readingStatus;
      } else {
        groupedData[timestamp][reading.readingType] = parseFloat(reading.value);
        // Also store metadata for tooltips
        groupedData[timestamp][`${reading.readingType}_unit`] = reading.unit;
        groupedData[timestamp][`${reading.readingType}_status`] = reading.readingStatus;
      }
    });
    
    // Convert to array and sort by timestamp
    return Object.values(groupedData).sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [readings, selectedReadingType, selectedTimeRange]);

  const formatTimestamp = useCallback((timestamp: string, timeRange: ChartTimeRange) => {
    const date = new Date(timestamp);
    
    switch (timeRange) {
      case '24h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return `${date.getMonth() + 1}/${date.getDate()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      case '30d':
      case '90d':
        return `${date.getMonth() + 1}/${date.getDate()}`;
      default:
        return date.toLocaleString();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!readings || !Array.isArray(readings) || readings.length === 0) {
    return (
      <ComfortMessage
        icon={<AlertCircle className="h-10 w-10 text-blue-400" />}
        title="No readings available"
        description="There are no readings available for this device in the selected time period. Try selecting a different time range or check back later when more data has been synced."
        type="info"
        action={{
          actionLabel: "Sync Now",
          onClick: () => {
            // Add sync functionality here
            console.log("Syncing device...");
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">Device Readings</h3>
          <p className="text-sm text-muted-foreground">
            Viewing {getReadingTypeLabel(selectedReadingType as ReadingType) || 'All Readings'} for the past {selectedTimeRange === '24h' ? '24 hours' : selectedTimeRange === '7d' ? '7 days' : selectedTimeRange === '30d' ? '30 days' : '90 days'}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedReadingType}
            onValueChange={value => setSelectedReadingType(value as ReadingType | 'all')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select reading type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {readingTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getReadingTypeLabel(type as ReadingType)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={selectedTimeRange}
            onValueChange={value => setSelectedTimeRange(value as ChartTimeRange)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="h-96 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="formattedTime" stroke="#6b7280" />
            
            {selectedReadingType === 'all' ? (
              // Render lines for all reading types
              readingTypes.map((type) => {
                if (type === 'blood_pressure') {
                  // For blood pressure, render both systolic and diastolic
                  return [
                    <Line
                      key={`${type}_systolic`}
                      type="monotone"
                      dataKey="blood_pressure_systolic"
                      name="Systolic"
                      stroke="#ff9800"
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />,
                    <Line
                      key={`${type}_diastolic`}
                      type="monotone"
                      dataKey="blood_pressure_diastolic"
                      name="Diastolic"
                      stroke="#ff5722"
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ];
                } else {
                  // For other types, render a single line
                  return (
                    <Line
                      key={type}
                      type="monotone"
                      dataKey={type}
                      name={getReadingTypeLabel(type as ReadingType)}
                      stroke={getReadingTypeColor(type as ReadingType)}
                      dot={{ strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  );
                }
              })
            ) : selectedReadingType === 'blood_pressure' ? (
              // For blood pressure, render both systolic and diastolic
              [
                <Line
                  key="systolic"
                  type="monotone"
                  dataKey="systolic"
                  name="Systolic"
                  stroke="#ff9800"
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />,
                <Line
                  key="diastolic"
                  type="monotone"
                  dataKey="diastolic"
                  name="Diastolic"
                  stroke="#ff5722"
                  dot={{ strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              ]
            ) : (
              // For other types, render a single line
              <Line
                type="monotone"
                dataKey="value"
                name={getReadingTypeLabel(selectedReadingType as ReadingType)}
                stroke={getReadingTypeColor(selectedReadingType as ReadingType)}
                dot={{ strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            )}
            
            <YAxis stroke="#6b7280" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <div>
          <h3 className="text-base font-medium mb-3">Latest Readings</h3>
          <div className="space-y-2">
            {readings.length > 0 ? (
              readings
                .sort((a: Reading, b: Reading) => {
                  return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                })
                .slice(0, 5)
                .map((reading: Reading) => (
                  <div 
                    key={reading.id} 
                    className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary bg-opacity-10 rounded-full p-2">
                        <Activity className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {reading.metricGroup ? `${reading.metricGroup} ` : ''}
                          {formatReadingValue(reading.value, reading.unit)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {getReadingTypeLabel(reading.readingType as ReadingType)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className={getStatusColor(reading.readingStatus)}>
                        {reading.readingStatus.charAt(0).toUpperCase() + reading.readingStatus.slice(1)}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(reading.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center p-4 border rounded-lg">
                <p className="text-muted-foreground">No readings available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceReadingsChart;