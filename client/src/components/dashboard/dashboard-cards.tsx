import React from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Users, ClipboardList, Calendar, User } from "lucide-react";

type MetricCardProps = {
  title: string;
  value: number;
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
  iconBgColor: string;
  iconColor: string;
};

function MetricCard({
  title,
  value,
  icon,
  linkText,
  linkHref,
  iconBgColor,
  iconColor,
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center">
          <div
            className={`flex-shrink-0 rounded-md p-3 ${iconBgColor}`}
          >
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-neutral-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-neutral-50 px-5 py-3">
        <div className="text-sm">
          <Link href={linkHref}>
            <div className="font-medium text-primary-600 hover:text-primary-800 cursor-pointer">
              {linkText}
            </div>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

export function DashboardCards({
  totalPatients = 0,
  activePlans = 0,
  todayAppointments = 0,
  staffOnDuty = 0,
}: {
  totalPatients?: number;
  activePlans?: number;
  todayAppointments?: number;
  staffOnDuty?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Patients"
        value={totalPatients}
        icon={<Users className="h-6 w-6 text-primary-600" />}
        linkText="View all patients"
        linkHref="/patients"
        iconBgColor="bg-primary-100"
        iconColor="text-primary-600"
      />

      <MetricCard
        title="Active Care Plans"
        value={activePlans}
        icon={<ClipboardList className="h-6 w-6 text-secondary-600" />}
        linkText="View care plans"
        linkHref="/care-plans"
        iconBgColor="bg-secondary-100"
        iconColor="text-secondary-600"
      />

      <MetricCard
        title="Today's Appointments"
        value={todayAppointments}
        icon={<Calendar className="h-6 w-6 text-yellow-600" />}
        linkText="View schedule"
        linkHref="/appointments"
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />

      <MetricCard
        title="Staff On Duty"
        value={staffOnDuty}
        icon={<User className="h-6 w-6 text-green-600" />}
        linkText="View staff"
        linkHref="/staff"
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
    </div>
  );
}
