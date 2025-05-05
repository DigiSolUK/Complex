import React from "react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Calendar,
  UserPlus,
  FileText,
  AlertCircle,
} from "lucide-react";

export type ActivityItem = {
  id: string;
  type: "care_plan_update" | "appointment_scheduled" | "new_patient" | "notes_added" | "appointment_cancelled";
  patientName: string;
  patientId: number;
  performedBy: string;
  timestamp: string;
};

const getActivityIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "care_plan_update":
      return <CheckCircle className="h-5 w-5 text-primary-500" />;
    case "appointment_scheduled":
      return <Calendar className="h-5 w-5 text-secondary-500" />;
    case "new_patient":
      return <UserPlus className="h-5 w-5 text-green-500" />;
    case "notes_added":
      return <FileText className="h-5 w-5 text-yellow-500" />;
    case "appointment_cancelled":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
  }
};

const getActivityTitle = (item: ActivityItem) => {
  switch (item.type) {
    case "care_plan_update":
      return (
        <>
          <span className="font-medium">Care plan updated</span> for{" "}
          <Link href={`/patients/${item.patientId}`} className="font-medium text-primary-600">
            {item.patientName}
          </Link>
        </>
      );
    case "appointment_scheduled":
      return (
        <>
          <span className="font-medium">New appointment scheduled</span> with{" "}
          <Link href={`/patients/${item.patientId}`} className="font-medium text-primary-600">
            {item.patientName}
          </Link>
        </>
      );
    case "new_patient":
      return (
        <>
          <span className="font-medium">New patient registered:</span>{" "}
          <Link href={`/patients/${item.patientId}`} className="font-medium text-primary-600">
            {item.patientName}
          </Link>
        </>
      );
    case "notes_added":
      return (
        <>
          <span className="font-medium">Medical notes added</span> for{" "}
          <Link href={`/patients/${item.patientId}`} className="font-medium text-primary-600">
            {item.patientName}
          </Link>
        </>
      );
    case "appointment_cancelled":
      return (
        <>
          <span className="font-medium">Appointment cancelled</span> for{" "}
          <Link href={`/patients/${item.patientId}`} className="font-medium text-primary-600">
            {item.patientName}
          </Link>
        </>
      );
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMinutes = Math.floor(
    (now.getTime() - activityTime.getTime()) / (1000 * 60)
  );

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hours ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days ago`;
};

export function RecentActivity({ activities = [] }: { activities: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader className="px-4 py-5 sm:px-6 border-b border-neutral-200">
        <CardTitle className="text-lg leading-6 font-medium text-neutral-900">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 overflow-y-auto h-80">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-neutral-500">No recent activities</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="px-4 py-3 bg-neutral-50 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-neutral-800">
                      {getActivityTitle(activity)}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      By {activity.performedBy} · {formatTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="border-t border-neutral-200 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-center w-full">
          <Button variant="outline">View all activity</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
