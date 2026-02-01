'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ObfuscatedEmail } from '@/components/ObfuscatedEmail';
import { ObfuscatedPhone } from '@/components/ObfuscatedPhone';
import { MapPin, Clock, Globe, Calendar } from 'lucide-react';

export function ContactInfo() {
  const contactDetails = [
    {
      icon: MapPin,
      label: 'Location',
      value: 'Vinnytsia, Ukraine',
      extra: 'Available for remote work worldwide',
    },
    {
      icon: Clock,
      label: 'Time Zone',
      value: 'EET (UTC+2)',
      extra: 'Flexible with US/EU hours',
    },
    {
      icon: Globe,
      label: 'Languages',
      value: 'Ukrainian, English',
      extra: 'Professional proficiency',
    },
  ];

  const workingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EET', available: true },
    { day: 'Saturday', hours: 'Limited availability', available: false },
    { day: 'Sunday', hours: 'Closed', available: false },
  ];

  // Calculate current time in Ukraine
  const getCurrentTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Kiev',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-US', options).format(now);
  };

  const isWorkingHours = () => {
    const now = new Date();
    const ukraineTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Europe/Kiev' })
    );
    const hours = ukraineTime.getHours();
    const day = ukraineTime.getDay();

    // Monday-Friday, 9 AM - 6 PM
    return day >= 1 && day <= 5 && hours >= 9 && hours < 18;
  };

  const [currentTime, setCurrentTime] = React.useState(getCurrentTime());
  const [isAvailable, setIsAvailable] = React.useState(isWorkingHours());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
      setIsAvailable(isWorkingHours());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Current Status</span>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isAvailable
                    ? 'bg-success-500 animate-pulse'
                    : 'bg-muted-foreground'
                }`}
              />
              <span className="text-sm">
                {isAvailable ? 'Available' : 'Away'}
              </span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Local time: {currentTime} EET
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-3">
          {contactDetails.map(detail => {
            const Icon = detail.icon;
            return (
              <div key={detail.label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{detail.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {detail.extra}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Working Hours */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Working Hours
          </h4>
          <div className="space-y-1">
            {workingHours.map(schedule => (
              <div
                key={schedule.day}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{schedule.day}</span>
                <span
                  className={
                    schedule.available ? 'font-medium' : 'text-muted-foreground'
                  }
                >
                  {schedule.hours}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            * Flexible with client time zones. Available for calls outside
            regular hours by appointment.
          </p>
        </div>

        {/* Direct Contact - Protected from scraping */}
        <div className="pt-4 border-t space-y-2" data-protected>
          <ObfuscatedEmail
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            iconClassName="h-4 w-4"
          />
          <ObfuscatedPhone
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
            iconClassName="h-4 w-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}
