'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
} from '@/components/ui/Card';
import { FormInput, FormTextarea } from '@/components/ui/FormField';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import Link from 'next/link';
import {
  Mail,
  User,
  Phone,
  Send,
  Check,
  AlertCircle,
  Star,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';

export default function ComponentShowcase() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({
    email: '',
    phone: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });

    // Simple validation example
    if (field === 'email' && value && !value.includes('@')) {
      setFormErrors({ ...formErrors, email: 'Please enter a valid email' });
    } else if (field === 'email') {
      setFormErrors({ ...formErrors, email: '' });
    }
  };

  const skills = [
    'React',
    'TypeScript',
    'Next.js',
    'Tailwind CSS',
    'Node.js',
    'GraphQL',
    'PostgreSQL',
    'Docker',
    'AWS',
    'Jest',
  ];

  const projectStatuses = [
    { label: 'In Progress', variant: 'warning' as const },
    { label: 'Completed', variant: 'success' as const },
    { label: 'On Hold', variant: 'secondary' as const },
    { label: 'Planning', variant: 'info' as const },
  ];

  return (
    <>
      <Navigation />

      <div className="min-h-screen pt-20">
        {/* Hero */}
        <Container size="wide" padding="lg" paddingY="xl" className="mb-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Component Library Showcase
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All new UI components built with CVA, TypeScript, and Tailwind CSS
            </p>

            {/* Quick Navigation */}
            <div className="flex flex-wrap gap-2 justify-center pt-4">
              <Button variant="secondary" size="sm" asChild>
                <Link href="/">Buttons</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/layout-demo">Layouts</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/design-system">Design System</Link>
              </Button>
            </div>
          </div>
        </Container>

        {/* Badge Section */}
        <Container size="lg" padding="lg" className="mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Badge Component</h2>

            {/* Badge Variants */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="mocha">Mocha</Badge>
                <Badge variant="navy">Navy</Badge>
                <Badge variant="ghost">Ghost</Badge>
              </div>
            </div>

            {/* Badge Sizes */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Sizes</h3>
              <div className="flex items-center gap-3">
                <Badge size="sm">Small</Badge>
                <Badge size="md">Medium</Badge>
                <Badge size="lg">Large</Badge>
              </div>
            </div>

            {/* Badge with Icons */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">With Icons & Remove</h3>
              <div className="flex flex-wrap gap-3">
                <Badge icon={<Star className="h-3 w-3" />} variant="warning">
                  Featured
                </Badge>
                <Badge icon={<Check className="h-3 w-3" />} variant="success">
                  Verified
                </Badge>
                <Badge
                  variant="outline"
                  onRemove={() => console.log('Remove clicked')}
                >
                  Removable
                </Badge>
              </div>
            </div>

            {/* Skills Example */}
            <div className="space-y-4">
              <h3 className="text-xl font-medium">
                Real-world Example: Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Container>

        {/* Card Section */}
        <Container size="lg" padding="lg" className="mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Card Component</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Card</CardTitle>
                  <CardDescription>
                    This is a simple card with header and content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Card content goes here. You can add any content you want.
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button size="sm">Action</Button>
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                </CardFooter>
              </Card>

              {/* Interactive Card */}
              <Card variant="interactive">
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>
                    Hover me for elevation effect
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {projectStatuses.map(status => (
                      <Badge
                        key={status.label}
                        variant={status.variant}
                        size="sm"
                      >
                        {status.label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Card with Image */}
              <Card padding="none" variant="elevated">
                <CardImage
                  src="https://via.placeholder.com/400x300/A47864/ffffff?text=Project"
                  alt="Project thumbnail"
                  aspectRatio="video"
                />
                <div className="p-6">
                  <CardHeader className="p-0">
                    <CardTitle>Project Card</CardTitle>
                    <CardDescription>With image and metadata</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        2024
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />3 months
                      </span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>

            {/* Full Width Card Example */}
            <Card variant="bordered" className="mt-6">
              <CardHeader>
                <CardTitle>Experience Card Example</CardTitle>
                <CardDescription>
                  Senior Front-End Engineer • 2021 - Present
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Remote • Vinnytsia, Ukraine</span>
                </div>
                <p className="text-sm">
                  Led the development of enterprise-scale web applications using
                  React, TypeScript, and Next.js. Improved performance metrics
                  by 40% and reduced bundle size by 35%.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" size="sm">
                    React
                  </Badge>
                  <Badge variant="outline" size="sm">
                    TypeScript
                  </Badge>
                  <Badge variant="outline" size="sm">
                    Next.js
                  </Badge>
                  <Badge variant="outline" size="sm">
                    Team Lead
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>

        {/* Form Components Section */}
        <Container size="lg" padding="lg" className="mb-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold">Form Components</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form Example */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Form Example</CardTitle>
                  <CardDescription>
                    Complete form with validation states
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormInput
                    label="Full Name"
                    placeholder="John Doe"
                    required
                    leftIcon={<User className="h-4 w-4" />}
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                  />

                  <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    required
                    leftIcon={<Mail className="h-4 w-4" />}
                    error={formErrors.email}
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                  />

                  <FormInput
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    optional
                    leftIcon={<Phone className="h-4 w-4" />}
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                  />

                  <FormTextarea
                    label="Message"
                    placeholder="Tell me about your project..."
                    required
                    hint="Minimum 50 characters"
                    autoResize
                    value={formData.message}
                    onChange={e => handleInputChange('message', e.target.value)}
                  />

                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Form States */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Input States</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormInput
                      label="Default Input"
                      placeholder="Enter text..."
                    />

                    <FormInput
                      label="Success State"
                      value="Valid input"
                      success="Great! This looks good."
                      leftIcon={<Check className="h-4 w-4" />}
                    />

                    <FormInput
                      label="Error State"
                      value="Invalid input"
                      error="This field is required"
                      leftIcon={<AlertCircle className="h-4 w-4" />}
                    />

                    <FormInput
                      label="Disabled State"
                      value="Disabled"
                      disabled
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Input Sizes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormInput inputSize="sm" placeholder="Small input" />
                    <FormInput
                      inputSize="md"
                      placeholder="Medium input (default)"
                    />
                    <FormInput inputSize="lg" placeholder="Large input" />
                    <FormInput inputSize="xl" placeholder="Extra large input" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>

        {/* Technical Features */}
        <Container size="lg" padding="lg" paddingY="xl">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Technical Highlights</CardTitle>
              <CardDescription>
                What makes these components production-ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">Type Safety</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Full TypeScript support with proper types and generics
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">Accessibility</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ARIA labels, keyboard navigation, and screen reader support
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="h-5 w-5" />
                    <span className="font-semibold">Flexibility</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    CVA variants, composable architecture, and customizable
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>

      <Footer />
    </>
  );
}
