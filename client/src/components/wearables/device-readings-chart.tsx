import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComfortMessage, PatientInfoTransition } from '@/components/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceReading } from '@shared/schema';
import { Loader2, AlertTriangle } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, BarChart, Bar
} from 'recharts';

type ReadingType = {
  id: string;
  label: string;
  unit: string;
  chartType: 'line' | 'area' | 'bar';
  color: string;
  criticalRange?: [number, number];
  normalRange?: [number, number];
};

const readingTypes: Record<string, ReadingType> = {
  heart_rate: {
    id: 'heart_rate',
    label: 'Heart Rate',
    unit: 'bpm',
    chartType: 'line',
    color: '#ef4444',
    normalRange: [60, 100],
  },
  blood_glucose: {
    id: 'blood_glucose',
    label: 'Blood Glucose',
    unit: 'mg/dL',
    chartType: 'line',
    color: '#0ea5e9',
    normalRange: [70, 140],
    criticalRange: [40, 300],
  },
  blood_pressure: {
    id: 'blood_pressure',
    label: 'Blood Pressure',
    unit: 'mmHg',
    chartType: 'line',
    color: '#8b5cf6',
  },
  oxygen_saturation: {
    id: 'oxygen_saturation',
    label: 'Oxygen Saturation',
    unit: '%',
    chartType: 'line',
    color: '#22c55e',
    normalRange: [95, 100],
    criticalRange: [90, 100],
  },
  steps: {
    id: 'steps',
    label: 'Steps',
    unit: 'steps',
    chartType: 'bar',
    color: '#f59e0b',
  },
  temperature: {
    id: 'temperature',
    label: 'Temperature',
    unit: '°C',
    chartType: 'line',
    color: '#ec4899',
    normalRange: [36.1, 37.2],
    criticalRange: [35, 39],
  },
  respiratory_rate: {
    id: 'respiratory_rate',
    label: 'Respiratory Rate',
    unit: 'bpm',
    chartType: 'line',
    color: '#0d9488',
    normalRange: [12, 20],
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep',
    unit: 'hrs',
    chartType: 'bar',
    color: '#6366f1',
  },
};

// Time formats for grouping data
const timeFormats = {
  hour: { format: 'HH:00', label: 'Hourly' },
  day: { format: 'MMM DD', label: 'Daily' },
  week: { format: 'MMM DD', label: 'Weekly' },
  month: { format: 'MMM YYYY', label: 'Monthly' },
};

export default function DeviceReadingsChart({
  deviceId,
  patientId,
}: {
  deviceId: number;
  patientId: number;
}) {
  const [selectedReadingType, setSelectedReadingType] = React.useState<string>('heart_rate');
  const [timeRange, setTimeRange] = React.useState<string>('24h');
  const [groupBy, setGroupBy] = React.useState<string>('hour');
  
  // Fetch readings for this device
  const { data: readings, isLoading, isError } = useQuery({
    queryKey: [
      `/api/patients/${patientId}/wearables/${deviceId}/readings`,
      { type: selectedReadingType, timeRange }
    ],
    enabled: !!deviceId && !!patientId,
  });

  // Process data for charts based on selected options
  const processedData = useMemo(() => {
    if (!readings) return [];

    const typedReadings = readings as DeviceReading[];
    
    // Sort by timestamp
    const sortedReadings = [...typedReadings].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    // Format timestamp and convert value to number if possible
    return sortedReadings.map(reading => ({
      ...reading,
      formattedTime: new Date(reading.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      formattedDate: new Date(reading.timestamp).toLocaleDateString(),
      numericValue: isNaN(parseFloat(reading.value)) ? null : parseFloat(reading.value),
      timestamp: new Date(reading.timestamp),
    }));
  }, [readings]);

  const chartData = useMemo(() => {
    if (!processedData.length) return [];
    
    // For readings that might have multiple components (like blood pressure),
    // we would need a more complex processing here
    if (selectedReadingType === 'blood_pressure') {
      // Group readings by timestamp and extract systolic/diastolic values
      const groupedData = processedData.reduce((acc, reading) => {
        const timeKey = reading.formattedTime;
        const group = reading.metricGroup;
        
        if (!acc[timeKey]) {
          acc[timeKey] = { 
            time: timeKey, 
            date: reading.formattedDate,
            timestamp: reading.timestamp,
          };
        }
        
        if (group === 'systolic') {
          acc[timeKey].systolic = reading.numericValue;
        } else if (group === 'diastolic') {
          acc[timeKey].diastolic = reading.numericValue;
        }
        
        return acc;
      }, {});
      
      return Object.values(groupedData);
    }
    
    // For single value readings
    return processedData.map(reading => ({
      time: reading.formattedTime,
      date: reading.formattedDate,
      timestamp: reading.timestamp,
      value: reading.numericValue,
    }));
  }, [processedData, selectedReadingType]);

  const readingTypeOptions = useMemo(() => {
    return Object.values(readingTypes);
  }, []);

  const selectedReadingTypeInfo = readingTypes[selectedReadingType];

  const renderChart = () => {
    if (!selectedReadingTypeInfo || !chartData.length) {
      return (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      );
    }

    const { chartType, color, label, unit } = selectedReadingTypeInfo;
    
    // Custom tooltip formatter
    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-white border p-3 shadow-md">
            <p className="font-medium text-sm">{`${payload[0].payload.date} ${label}`}</p>
            {selectedReadingType === 'blood_pressure' ? (
              <>
                <p className="text-sm">{`Systolic: ${payload[0].value} mmHg`}</p>
                <p className="text-sm">{`Diastolic: ${payload[1].value} mmHg`}</p>
              </>
            ) : (
              <p className="text-sm">{`${payload[0].value} ${unit}`}</p>
            )}
          </div>
        );
      }
      return null;
    };

    // Determine Y axis domain based on reading type
    const getYAxisDomain = () => {
      const { normalRange, criticalRange } = selectedReadingTypeInfo;
      
      // If we have normal or critical ranges, use them to set the domain
      if (normalRange || criticalRange) {
        const min = Math.min(
          ...(normalRange ? [normalRange[0]] : []),
          ...(criticalRange ? [criticalRange[0]] : []),
          ...chartData.map(d => selectedReadingType === 'blood_pressure' ? 
            Math.min(d.systolic || Infinity, d.diastolic || Infinity) : 
            d.value || Infinity)
        );
        
        const max = Math.max(
          ...(normalRange ? [normalRange[1]] : []),
          ...(criticalRange ? [criticalRange[1]] : []),
          ...chartData.map(d => selectedReadingType === 'blood_pressure' ? 
            Math.max(d.systolic || 0, d.diastolic || 0) : 
            d.value || 0)
        );
        
        // Add some padding
        return [Math.max(0, min * 0.9), max * 1.1];
      }
      
      // Otherwise, let the chart determine automatically
      return undefined;
    };

    if (selectedReadingType === 'blood_pressure') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="time" />
            <YAxis domain={getYAxisDomain()} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="systolic" 
              stroke="#ef4444" 
              strokeWidth={2} 
              dot={{ strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 6 }} 
              name="Systolic" 
            />
            <Line 
              type="monotone" 
              dataKey="diastolic" 
              stroke="#3b82f6" 
              strokeWidth={2} 
              dot={{ strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 6 }} 
              name="Diastolic" 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="time" />
            <YAxis domain={getYAxisDomain()} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
              dot={{ strokeWidth: 2, r: 4 }} 
              activeDot={{ r: 6 }} 
              name={`${label} (${unit})`} 
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="time" />
            <YAxis domain={getYAxisDomain()} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="value" 
              fill={`${color}40`} 
              stroke={color} 
              strokeWidth={2} 
              name={`${label} (${unit})`} 
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="time" />
            <YAxis domain={getYAxisDomain()} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="value" 
              fill={color} 
              barSize={20} 
              name={`${label} (${unit})`} 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  const renderAlerts = () => {
    const { normalRange, criticalRange } = selectedReadingTypeInfo || {};
    
    if (!processedData.length || !normalRange) return null;
    
    // Find readings outside normal range
    const abnormalReadings = processedData.filter(reading => {
      const value = reading.numericValue;
      if (value === null) return false;
      
      return value < normalRange[0] || value > normalRange[1];
    });
    
    if (!abnormalReadings.length) return null;
    
    // Check if any are in critical range
    const criticalReadings = criticalRange ? abnormalReadings.filter(reading => {
      const value = reading.numericValue;
      if (value === null) return false;
      
      return value < criticalRange[0] || value > criticalRange[1];
    }) : [];
    
    return (
      <div className="mt-4">
        {criticalReadings.length > 0 && (
          <ComfortMessage
            type="urgent"
            message={`There are ${criticalReadings.length} readings outside the critical range that may require immediate attention.`}
          />
        )}
        {criticalReadings.length === 0 && abnormalReadings.length > 0 && (
          <ComfortMessage
            type="empathy"
            message={`There are ${abnormalReadings.length} readings outside the normal range, but none require immediate attention.`}
          />
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading readings</h3>
            <p className="text-sm text-red-700 mt-1">
              There was a problem fetching data from this device. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reading Type</label>
          <Select
            value={selectedReadingType}
            onValueChange={setSelectedReadingType}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {readingTypeOptions.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-1/3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Group By</label>
          <Select
            value={groupBy}
            onValueChange={setGroupBy}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(timeFormats).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="chart">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="space-y-4">
          <PatientInfoTransition id="chart" isVisible={true}>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>
                  {selectedReadingTypeInfo?.label || 'Readings'} {selectedReadingTypeInfo?.unit ? `(${selectedReadingTypeInfo.unit})` : ''}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderChart()}
                {renderAlerts()}
              </CardContent>
            </Card>
          </PatientInfoTransition>
        </TabsContent>
        
        <TabsContent value="table" className="space-y-4">
          <PatientInfoTransition id="table" isVisible={true}>
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>
                  {selectedReadingTypeInfo?.label || 'Readings'} Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                {processedData.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No data available</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse table-auto">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium text-sm">Date</th>
                          <th className="text-left py-2 px-3 font-medium text-sm">Time</th>
                          <th className="text-left py-2 px-3 font-medium text-sm">Value</th>
                          <th className="text-left py-2 px-3 font-medium text-sm">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {processedData.map((reading, index) => {
                          const value = reading.numericValue;
                          const isOutOfRange = value !== null && 
                            selectedReadingTypeInfo?.normalRange && 
                            (value < selectedReadingTypeInfo.normalRange[0] || 
                             value > selectedReadingTypeInfo.normalRange[1]);
                          
                          const isCritical = value !== null && 
                            selectedReadingTypeInfo?.criticalRange && 
                            (value < selectedReadingTypeInfo.criticalRange[0] || 
                             value > selectedReadingTypeInfo.criticalRange[1]);
                          
                          return (
                            <tr key={index} className="border-b hover:bg-muted/20">
                              <td className="py-2 px-3 text-sm">{reading.formattedDate}</td>
                              <td className="py-2 px-3 text-sm">{reading.formattedTime}</td>
                              <td className="py-2 px-3 text-sm">
                                {reading.value} {selectedReadingTypeInfo?.unit}
                              </td>
                              <td className="py-2 px-3 text-sm">
                                {isCritical ? (
                                  <span className="text-red-600 font-medium">Critical</span>
                                ) : isOutOfRange ? (
                                  <span className="text-yellow-600 font-medium">Abnormal</span>
                                ) : (
                                  <span className="text-green-600">Normal</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </PatientInfoTransition>
        </TabsContent>
      </Tabs>
    </div>
  );
}