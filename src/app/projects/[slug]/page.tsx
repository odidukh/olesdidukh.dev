import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { JsonLd } from '@/components/JsonLd';
import { TrackPageView, TrackedExternalLink } from '@/components/analytics';
import {
  getProjectBySlug,
  getAllProjectSlugs,
  getRelatedProjects,
  projectsData,
} from '@/data/projects';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Users,
  Building,
  CheckCircle2,
  Lightbulb,
  Target,
  Quote,
  Play,
} from 'lucide-react';
import { VideoPlayer } from '@/components/ui/VideoPlayer';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllProjectSlugs().map(slug => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Oles Didukh`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `https://olesdidukh.dev/projects/${project.id}`,
      type: 'article',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.category)}&type=project`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [
        `/api/og?title=${encodeURIComponent(project.title)}&subtitle=${encodeURIComponent(project.category)}&type=project`,
      ],
    },
    alternates: {
      canonical: `https://olesdidukh.dev/projects/${project.id}`,
    },
  };
}

function getAdjacentProjects(currentId: string) {
  const currentIndex = projectsData.findIndex(p => p.id === currentId);
  const prevProject = currentIndex > 0 ? projectsData[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projectsData.length - 1
      ? projectsData[currentIndex + 1]
      : null;
  return { prevProject, nextProject };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = getRelatedProjects(project.id, 3);
  const { prevProject, nextProject } = getAdjacentProjects(project.id);

  const projectSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.longDescription,
    author: {
      '@type': 'Person',
      name: 'Oles Didukh',
      url: 'https://olesdidukh.dev',
    },
    dateCreated: `${project.year}`,
    genre: project.category,
    keywords: project.technologies.join(', '),
    url: `https://olesdidukh.dev/projects/${project.id}`,
    ...(project.liveUrl && { mainEntityOfPage: project.liveUrl }),
  };

  return (
    <>
      <TrackPageView
        eventName="project_view"
        properties={{
          projectId: project.id,
          projectTitle: project.title,
          category: project.category,
        }}
      />
      <BreadcrumbSchema
        page="projects"
        projectTitle={project.title}
        projectSlug={project.id}
      />
      <JsonLd data={projectSchema} />
      <Navigation />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 py-16 dark:from-gray-900 dark:to-gray-800 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Link */}
            <Link
              href="/projects"
              className="mb-8 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-mocha-600 dark:text-gray-400 dark:hover:text-mocha-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </Link>

            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Project Info */}
              <div>
                <Badge variant="mocha" className="mb-4">
                  {project.category}
                </Badge>
                <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white lg:text-5xl">
                  {project.title}
                </h1>
                <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                  {project.longDescription}
                </p>

                {/* Project Meta */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 text-mocha-500" />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 text-mocha-500" />
                    <span>{project.duration}</span>
                  </div>
                  {project.team && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 text-mocha-500" />
                      <span>{project.team}</span>
                    </div>
                  )}
                  {project.client && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Building className="h-4 w-4 text-mocha-500" />
                      <span>{project.client}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {project.liveUrl && (
                    <Button asChild>
                      <TrackedExternalLink
                        href={project.liveUrl}
                        linkType="project_live_site"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Live Site
                      </TrackedExternalLink>
                    </Button>
                  )}
                  {project.demoUrl && (
                    <Button variant="outline" asChild>
                      <TrackedExternalLink
                        href={project.demoUrl}
                        linkType="project_demo"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Demo
                      </TrackedExternalLink>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button variant="outline" asChild>
                      <TrackedExternalLink
                        href={project.githubUrl}
                        linkType="project_github"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Source Code
                      </TrackedExternalLink>
                    </Button>
                  )}
                </div>
              </div>

              {/* Project Image */}
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-gray-100 shadow-2xl dark:bg-gray-700">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Technologies Used
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {project.technologies.map(tech => (
                <Badge key={tech} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Video Demo Section */}
        {project.video && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mocha-100 dark:bg-mocha-900/30">
                    <Play className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Project Demo
                  </h2>
                </div>
                <VideoPlayer video={project.video} className="shadow-2xl" />
                {project.video.title && (
                  <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {project.video.title}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Challenges & Solutions Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Challenges */}
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                    <Target className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Challenges
                  </h2>
                </div>
                <ul className="space-y-4">
                  {project.challenges.map((challenge, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {index + 1}
                      </span>
                      <p className="text-gray-600 dark:text-gray-300">
                        {challenge}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Solutions
                  </h2>
                </div>
                <ul className="space-y-4">
                  {project.solutions.map((solution, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400" />
                      <p className="text-gray-600 dark:text-gray-300">
                        {solution}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="bg-gradient-to-br from-mocha-50 to-cream-100 py-16 dark:from-mocha-900/20 dark:to-gray-800 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Results & Impact
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {project.results.map((result, index) => (
                <div
                  key={index}
                  className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
                >
                  <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {result.metric}
                  </p>
                  <p className="text-2xl font-bold text-mocha-600 dark:text-mocha-400 lg:text-3xl">
                    {result.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        {project.testimonial && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-3xl text-center">
                <Quote className="mx-auto mb-6 h-12 w-12 text-mocha-300 dark:text-mocha-600" />
                <blockquote className="mb-6 text-xl text-gray-700 dark:text-gray-300 lg:text-2xl">
                  &ldquo;{project.testimonial.text}&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {project.testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* My Role Section */}
        <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                My Role
              </h2>
              <p className="text-lg text-mocha-600 dark:text-mocha-400">
                {project.role}
              </p>
            </div>
          </div>
        </section>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
                Related Projects
              </h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {relatedProjects.map(relatedProject => (
                  <Link
                    key={relatedProject.id}
                    href={`/projects/${relatedProject.id}`}
                    className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800"
                  >
                    <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <Image
                        src={relatedProject.image}
                        alt={relatedProject.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="outline" className="mb-3">
                        {relatedProject.category}
                      </Badge>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-mocha-600 dark:text-white dark:group-hover:text-mocha-400">
                        {relatedProject.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                        {relatedProject.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Project Navigation */}
        <section className="border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.id}`}
                  className="group flex items-center gap-3 text-gray-600 transition-colors hover:text-mocha-600 dark:text-gray-400 dark:hover:text-mocha-400"
                >
                  <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500">
                      Previous
                    </p>
                    <p className="font-medium">{prevProject.title}</p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.id}`}
                  className="group flex items-center gap-3 text-gray-600 transition-colors hover:text-mocha-600 dark:text-gray-400 dark:hover:text-mocha-400"
                >
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-500">
                      Next
                    </p>
                    <p className="font-medium">{nextProject.title}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
