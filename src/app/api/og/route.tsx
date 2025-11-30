import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get parameters from URL
  const title = searchParams.get('title') ?? 'Oles Didukh';
  const subtitle = searchParams.get('subtitle') ?? 'Senior Front-End Engineer';
  const description = searchParams.get('description') ?? '';
  const type = searchParams.get('type') ?? 'default'; // default, blog, project

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#faf8f5',
        position: 'relative',
      }}
    >
      {/* Background gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(135deg, rgba(139, 115, 85, 0.1) 0%, rgba(30, 41, 59, 0.1) 100%)',
        }}
      />

      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'linear-gradient(135deg, rgba(139, 115, 85, 0.2) 0%, rgba(139, 115, 85, 0.05) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'linear-gradient(135deg, rgba(30, 41, 59, 0.1) 0%, rgba(30, 41, 59, 0.02) 100%)',
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          padding: '60px 80px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Top section with type badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {type !== 'default' && (
            <div
              style={{
                backgroundColor: '#8B7355',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '18px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {type === 'blog' ? 'Blog Post' : 'Project'}
            </div>
          )}
        </div>

        {/* Middle section with title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              fontSize: type === 'default' ? '72px' : '56px',
              fontWeight: 700,
              color: '#1e293b',
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {subtitle && (
            <div
              style={{
                fontSize: '32px',
                fontWeight: 500,
                color: '#8B7355',
              }}
            >
              {subtitle}
            </div>
          )}

          {description && (
            <div
              style={{
                fontSize: '24px',
                color: '#64748b',
                maxWidth: '800px',
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          )}
        </div>

        {/* Bottom section with branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Avatar placeholder */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B7355 0%, #6B5744 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              OD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: '#1e293b',
                }}
              >
                Oles Didukh
              </div>
              <div style={{ fontSize: '16px', color: '#64748b' }}>
                olesdidukh.dev
              </div>
            </div>
          </div>

          {/* Tech stack icons representation */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {['React', 'TypeScript', 'Next.js'].map(tech => (
              <div
                key={tech}
                style={{
                  backgroundColor: 'rgba(139, 115, 85, 0.1)',
                  color: '#8B7355',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
