import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, CalendarDays, CheckCircle2, Clock, ListTodo, Plus, User, UserCog } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  assignedTo: string;
  category: string;
  createdAt: string;
}

const TaskCard: React.FC<{ task: Task; onStatusChange?: (id: string, status: Task['status']) => void }> = ({
  task,
  onStatusChange,
}) => {
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-base font-medium leading-6">{task.title}</CardTitle>
          <div className="flex space-x-1">
            <Badge className={getPriorityColor(task.priority)} variant="outline">
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge className={getStatusColor(task.status)} variant="outline">
              {task.status === 'todo' ? 'To Do' : 
               task.status === 'in-progress' ? 'In Progress' : 
               task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">{task.description}</p>
          <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <User className="h-3.5 w-3.5 mr-1" />
              <span>{task.assignedTo}</span>
            </div>
            <div className="flex items-center">
              <ListTodo className="h-3.5 w-3.5 mr-1" />
              <span>{task.category}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <div className="px-6 py-2 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800 flex justify-between text-xs">
        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        {task.status !== 'completed' && (
          <button
            onClick={() => handleStatusChange('completed')}
            className="text-green-600 hover:text-green-800 font-medium flex items-center"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            Mark complete
          </button>
        )}
      </div>
    </Card>
  );
};

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Care plan review for James Wilson',
    description: 'Review and update care plan for diabetes management based on latest HbA1c results',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-05-10',
    assignedTo: 'Dr. Emma Thompson',
    category: 'Care Plans',
    createdAt: '2025-05-03',
  },
  {
    id: '2',
    title: 'Medication review for Sarah Johnson',
    description: 'Conduct medication review for hypertension medications after recent hospital admission',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2025-05-07',
    assignedTo: 'Dr. Michael Chen',
    category: 'Medication',
    createdAt: '2025-05-01',
  },
  {
    id: '3',
    title: 'Schedule follow-up appointment for Robert Brown',
    description: 'Schedule 4-week follow-up appointment following knee surgery',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-05-08',
    assignedTo: 'Jane Adams',
    category: 'Appointments',
    createdAt: '2025-05-02',
  },
  {
    id: '4',
    title: 'Complete clinical assessment for Mary Davis',
    description: 'Initial clinical assessment for new patient with respiratory symptoms',
    status: 'completed',
    priority: 'high',
    dueDate: '2025-05-02',
    assignedTo: 'Dr. Emma Thompson',
    category: 'Assessments',
    createdAt: '2025-04-28',
  },
  {
    id: '5',
    title: 'Review test results for Thomas Miller',
    description: 'Review blood work and imaging results from St. Mary\'s Hospital',
    status: 'overdue',
    priority: 'urgent',
    dueDate: '2025-05-01',
    assignedTo: 'Dr. Michael Chen',
    category: 'Lab Results',
    createdAt: '2025-04-25',
  },
  {
    id: '6',
    title: 'Update care staff rota for next week',
    description: 'Finalize home care staff assignments for next week including weekend coverage',
    status: 'todo',
    priority: 'medium',
    dueDate: '2025-05-09',
    assignedTo: 'Susan Williams',
    category: 'Administrative',
    createdAt: '2025-05-03',
  },
  {
    id: '7',
    title: 'Order medical supplies for home care patients',
    description: 'Replenish wound care supplies and mobility aids for home care team',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2025-05-12',
    assignedTo: 'Jane Adams',
    category: 'Inventory',
    createdAt: '2025-05-04',
  },
  {
    id: '8',
    title: 'Complete monthly patient satisfaction surveys',
    description: 'Compile and analyze patient satisfaction data from April',
    status: 'todo',
    priority: 'low',
    dueDate: '2025-05-15',
    assignedTo: 'Susan Williams',
    category: 'Administrative',
    createdAt: '2025-05-01',
  },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeTab, setActiveTab] = useState('all');
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date().toISOString().split('T')[0],
    assignedTo: '',
    category: '',
  });

  const handleStatusChange = (id: string, newStatus: Task['status']) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const handleCreateTask = () => {
    // In a real app, this would call an API to save the task
    const createdTask: Task = {
      id: Date.now().toString(),
      title: newTask.title || '',
      description: newTask.description || '',
      priority: newTask.priority as Task['priority'] || 'medium',
      status: newTask.status as Task['status'] || 'todo',
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0],
      assignedTo: newTask.assignedTo || '',
      category: newTask.category || '',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setTasks([createdTask, ...tasks]);
    setNewTaskDialogOpen(false);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: new Date().toISOString().split('T')[0],
      assignedTo: '',
      category: '',
    });
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'my-tasks') return task.assignedTo === 'Dr. Emma Thompson'; // Would use current user in real app
    if (activeTab === 'today') {
      const today = new Date().toISOString().split('T')[0];
      return task.dueDate === today;
    }
    if (activeTab === 'overdue') {
      return task.status === 'overdue';
    }
    return task.status === activeTab;
  });

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold leading-7 text-neutral-900 sm:text-3xl">Tasks</h2>
        <p className="text-gray-500 mt-2">Manage and track clinical and administrative tasks</p>
      </div>

      <div className="mt-6">
        <div className="mb-6 flex items-center justify-between">
          <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 md:w-auto w-full">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
              <TabsTrigger value="today">Due Today</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3">
            <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create New Task</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new task for assignment and tracking.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter task title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter task description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value as Task['priority'] })}
                      >
                        <SelectTrigger id="priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Select
                        value={newTask.assignedTo}
                        onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
                      >
                        <SelectTrigger id="assignedTo">
                          <SelectValue placeholder="Select staff member" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. Emma Thompson">Dr. Emma Thompson</SelectItem>
                          <SelectItem value="Dr. Michael Chen">Dr. Michael Chen</SelectItem>
                          <SelectItem value="Jane Adams">Jane Adams</SelectItem>
                          <SelectItem value="Susan Williams">Susan Williams</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTask.category}
                        onValueChange={(value) => setNewTask({ ...newTask, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Care Plans">Care Plans</SelectItem>
                          <SelectItem value="Medication">Medication</SelectItem>
                          <SelectItem value="Appointments">Appointments</SelectItem>
                          <SelectItem value="Assessments">Assessments</SelectItem>
                          <SelectItem value="Lab Results">Lab Results</SelectItem>
                          <SelectItem value="Administrative">Administrative</SelectItem>
                          <SelectItem value="Inventory">Inventory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTask} disabled={!newTask.title || !newTask.assignedTo}>
                    Create Task
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              {activeTab === 'all' ? 'All Tasks' : 
               activeTab === 'my-tasks' ? 'My Tasks' : 
               activeTab === 'today' ? 'Tasks Due Today' : 
               activeTab === 'overdue' ? 'Overdue Tasks' : 
               'Completed Tasks'}
            </h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="sort" className="text-sm">Sort by:</Label>
              <Select defaultValue="due-date">
                <SelectTrigger id="sort" className="h-8 w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due-date">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center">
              <CardContent className="pt-6">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'all' ? 'You don\'t have any tasks yet. Create a new task to get started.' : 
                   activeTab === 'my-tasks' ? 'You don\'t have any tasks assigned to you.' : 
                   activeTab === 'today' ? 'You don\'t have any tasks due today.' : 
                   activeTab === 'overdue' ? 'Great job! You don\'t have any overdue tasks.' : 
                   'You don\'t have any completed tasks yet.'}
                </p>
                {activeTab === 'all' && (
                  <Button className="mt-4" onClick={() => setNewTaskDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create Task
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}