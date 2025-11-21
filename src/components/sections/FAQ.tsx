'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What types of projects do you work on?',
    answer:
      'I specialize in web applications, SaaS platforms, e-commerce sites, and UI/UX design. I work with startups, established businesses, and agencies on projects ranging from MVPs to enterprise-scale applications. My expertise is particularly strong in React-based applications with complex state management and real-time features.',
  },
  {
    question: 'What is your typical project timeline?',
    answer:
      'Project timelines vary based on scope and complexity. A typical small website takes 2-4 weeks, while a complex web application might take 2-6 months. I provide detailed timeline estimates after understanding your specific requirements. I also offer expedited delivery for urgent projects.',
  },
  {
    question: 'Do you work with international clients?',
    answer:
      "Yes! I work with clients globally and have experience collaborating across different time zones. I'm fluent in English and can adjust my working hours to overlap with US, EU, or other time zones as needed.All my contracts and communications are conducted professionally in English.",
  },
  {
    question: 'What is your development process?',
    answer:
      'I follow an agile development process with regular communication and updates. This includes: 1) Initial consultation and requirements gathering, 2) Project proposal and timeline, 3) Design and prototyping (if needed), 4) Development in sprints with regular demos, 5) Testing and quality assurance, 6) Deployment and handover, 7) Post-launch support.',
  },
  {
    question: 'How do you handle project communication?',
    answer:
      "I believe in transparent and frequent communication. I provide regular updates via your preferred channel (Slack, email, Teams, etc.), share progress through staging environments, and schedule weekly or bi-weekly calls for larger projects. You'll always know the status of your project.",
  },
  {
    question: 'Do you provide ongoing support after project completion?',
    answer:
      'Yes, I offer various support packages after project delivery. This includes bug fixes, minor updates, performance optimization, and feature additions. I also provide documentation and knowledge transfer to ensure your team can maintain the project independently if preferred.',
  },
  {
    question: 'What technologies do you specialize in?',
    answer:
      "My primary stack includes React, TypeScript, Next.js, and Node.js. I'm also experienced with state management(Redux, Zustand), styling(Tailwind CSS, Styled Components), testing(Jest, Cypress), and cloud services(AWS, Vercel).I stay current with the latest web technologies and best practices.",
  },
  {
    question: 'How do you ensure code quality?',
    answer:
      'I maintain high code standards through comprehensive testing (unit, integration, e2e), code reviews, TypeScript for type safety, ESLint and Prettier for consistency, performance monitoring, and accessibility compliance. All code is well-documented and follows industry best practices.',
  },
  {
    question: 'What are your payment terms?',
    answer:
      'I typically work with a 30-50% upfront deposit, with the remainder due upon project completion. For larger projects, I offer milestone-based payments. I accept bank transfers, PayPal, and cryptocurrency. All terms are clearly outlined in the project contract.',
  },
  {
    question: 'Can you work with existing codebases?',
    answer:
      'Absolutely! I have extensive experience working with legacy code, refactoring existing applications, and integrating new features into established systems. I can perform code audits, improve performance, update dependencies, and modernize tech stacks while maintaining backward compatibility.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {faqData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            className="cursor-pointer hover:shadow-md transition-all duration-300"
            onClick={() => toggleQuestion(index)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{item.question}</h4>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-muted-foreground mt-3">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
