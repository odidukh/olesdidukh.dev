import { Container } from '@/components/ui/Container';
import { Grid, GridItem } from '@/components/ui/Grid';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function LayoutDemo() {
  return (
    <div className="min-h-screen py-12">
      {/* Navigation */}
      <Container size="wide" padding="lg" className="mb-8">
        <div className="flex gap-4 p-4 bg-muted rounded-lg">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/">Button Components</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/layout-demo">Layout Components</Link>
          </Button>
        </div>
      </Container>
      {/* Hero Section */}
      <Container size="wide" padding="lg" paddingY="xl">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Layout System Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional Container and Grid components with responsive variants
          </p>
        </div>
      </Container>

      {/* Container Sizes Section */}
      <Container size="wide" padding="lg" paddingY="lg">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Container Sizes</h2>
            <p className="text-muted-foreground">
              Nine container size variants for different content types
            </p>
          </div>

          <div className="space-y-4">
            <Container
              size="narrow"
              padding="md"
              className="bg-mocha-100 border border-mocha-300 py-4"
            >
              <p className="text-center">
                <strong>Narrow</strong> (672px) - Perfect for text-heavy content
              </p>
            </Container>

            <Container
              size="content"
              padding="md"
              className="bg-mocha-100 border border-mocha-300 py-4"
            >
              <p className="text-center">
                <strong>Content</strong> (896px) - Optimized for reading
              </p>
            </Container>

            <Container
              size="md"
              padding="md"
              className="bg-mocha-100 border border-mocha-300 py-4"
            >
              <p className="text-center">
                <strong>Medium</strong> (768px) - Tablet-friendly
              </p>
            </Container>

            <Container
              size="lg"
              padding="md"
              className="bg-mocha-100 border border-mocha-300 py-4"
            >
              <p className="text-center">
                <strong>Large</strong> (1024px) - Desktop standard
              </p>
            </Container>

            <Container
              size="xl"
              padding="md"
              className="bg-mocha-100 border border-mocha-300 py-4"
            >
              <p className="text-center">
                <strong>Extra Large</strong> (1280px) - Default size
              </p>
            </Container>

            <Container
              size="wide"
              padding="md"
              className="bg-mocha-100 border border-mocha-300 py-4"
            >
              <p className="text-center">
                <strong>Wide</strong> (1280px) - Dashboard layouts
              </p>
            </Container>
          </div>
        </div>
      </Container>

      {/* Container Padding Section */}
      <Container size="xl" padding="lg" paddingY="lg">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Container Padding</h2>
            <p className="text-muted-foreground">
              Responsive padding variants with mobile-first approach
            </p>
          </div>

          <div className="space-y-4">
            <Container
              size="lg"
              padding="sm"
              className="bg-navy-100 border border-navy-300 py-4"
            >
              <p className="text-center">
                <strong>Small Padding</strong> - Compact spacing
              </p>
            </Container>

            <Container
              size="lg"
              padding="md"
              className="bg-navy-100 border border-navy-300 py-4"
            >
              <p className="text-center">
                <strong>Medium Padding</strong> - Default spacing
              </p>
            </Container>

            <Container
              size="lg"
              padding="lg"
              className="bg-navy-100 border border-navy-300 py-4"
            >
              <p className="text-center">
                <strong>Large Padding</strong> - Generous spacing
              </p>
            </Container>

            <Container
              size="lg"
              padding="xl"
              className="bg-navy-100 border border-navy-300 py-4"
            >
              <p className="text-center">
                <strong>Extra Large Padding</strong> - Maximum spacing
              </p>
            </Container>
          </div>
        </div>
      </Container>

      {/* Grid Columns Section */}
      <Container size="wide" padding="lg" paddingY="lg">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Grid Column Systems</h2>
            <p className="text-muted-foreground">
              Flexible grid layouts with responsive breakpoints
            </p>
          </div>

          {/* 2 Columns */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Two Columns</h3>
            <Grid cols={2} gap={4}>
              <div className="bg-success-100 border border-success-300 p-6 rounded-lg">
                <p className="text-center font-medium">Column 1</p>
              </div>
              <div className="bg-success-100 border border-success-300 p-6 rounded-lg">
                <p className="text-center font-medium">Column 2</p>
              </div>
            </Grid>
          </div>

          {/* 3 Columns */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Three Columns</h3>
            <Grid cols={3} gap={4}>
              <div className="bg-info-100 border border-info-300 p-6 rounded-lg">
                <p className="text-center font-medium">Column 1</p>
              </div>
              <div className="bg-info-100 border border-info-300 p-6 rounded-lg">
                <p className="text-center font-medium">Column 2</p>
              </div>
              <div className="bg-info-100 border border-info-300 p-6 rounded-lg">
                <p className="text-center font-medium">Column 3</p>
              </div>
            </Grid>
          </div>

          {/* 4 Columns */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Four Columns</h3>
            <Grid cols={4} gap={4}>
              <div className="bg-warning-100 border border-warning-300 p-6 rounded-lg">
                <p className="text-center font-medium">1</p>
              </div>
              <div className="bg-warning-100 border border-warning-300 p-6 rounded-lg">
                <p className="text-center font-medium">2</p>
              </div>
              <div className="bg-warning-100 border border-warning-300 p-6 rounded-lg">
                <p className="text-center font-medium">3</p>
              </div>
              <div className="bg-warning-100 border border-warning-300 p-6 rounded-lg">
                <p className="text-center font-medium">4</p>
              </div>
            </Grid>
          </div>
        </div>
      </Container>

      {/* Responsive Grid Section */}
      <Container size="wide" padding="lg" paddingY="lg">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Responsive Grid Layouts</h2>
            <p className="text-muted-foreground">
              Automatically adapts columns based on screen size
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Responsive (1 → 2 → 3 → 4 columns)
            </h3>
            <Grid cols="responsive" gap={6}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-mocha-200 border border-mocha-400 p-8 rounded-lg"
                >
                  <p className="text-center font-medium">Item {i + 1}</p>
                </div>
              ))}
            </Grid>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">
              Auto-fit Grid (minimum 250px)
            </h3>
            <p className="text-sm text-muted-foreground">
              Automatically fits as many columns as possible
            </p>
            <Grid cols="auto" gap={6}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-navy-200 border border-navy-400 p-8 rounded-lg"
                >
                  <p className="text-center font-medium">Auto {i + 1}</p>
                </div>
              ))}
            </Grid>
          </div>
        </div>
      </Container>

      {/* GridItem Span Section */}
      <Container size="wide" padding="lg" paddingY="lg">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Grid Item Spanning</h2>
            <p className="text-muted-foreground">
              Control how many columns an item spans
            </p>
          </div>

          <Grid cols={12} gap={4}>
            <GridItem
              span={12}
              className="bg-success-200 border border-success-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">Full Width (span 12)</p>
            </GridItem>

            <GridItem
              span={6}
              className="bg-info-200 border border-info-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">Half (span 6)</p>
            </GridItem>
            <GridItem
              span={6}
              className="bg-info-200 border border-info-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">Half (span 6)</p>
            </GridItem>

            <GridItem
              span={4}
              className="bg-warning-200 border border-warning-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/3 (span 4)</p>
            </GridItem>
            <GridItem
              span={4}
              className="bg-warning-200 border border-warning-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/3 (span 4)</p>
            </GridItem>
            <GridItem
              span={4}
              className="bg-warning-200 border border-warning-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/3 (span 4)</p>
            </GridItem>

            <GridItem
              span={3}
              className="bg-error-200 border border-error-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/4</p>
            </GridItem>
            <GridItem
              span={3}
              className="bg-error-200 border border-error-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/4</p>
            </GridItem>
            <GridItem
              span={3}
              className="bg-error-200 border border-error-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/4</p>
            </GridItem>
            <GridItem
              span={3}
              className="bg-error-200 border border-error-400 p-6 rounded-lg"
            >
              <p className="text-center font-medium">1/4</p>
            </GridItem>
          </Grid>
        </div>
      </Container>

      {/* Real-World Example */}
      <Container size="xl" padding="lg" paddingY="xl">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">
              Real-World Example: Project Gallery
            </h2>
            <p className="text-muted-foreground">
              How you might use these components in your portfolio
            </p>
          </div>

          <Grid cols="responsive-3" gap={6}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="border rounded-lg overflow-hidden bg-card"
              >
                <div className="h-48 bg-gradient-to-br from-mocha-400 to-mocha-600" />
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold">Project {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    A brief description of this amazing project and what it
                    accomplishes.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                    <Button size="sm" variant="ghost">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </div>
      </Container>
    </div>
  );
}
