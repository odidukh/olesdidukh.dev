import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Load fonts from Google Fonts CDN to avoid bundling ~600KB of font files
const interRegular = fetch(
  'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2'
).then(res => res.arrayBuffer());

const interBold = fetch(
  'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiA.woff2'
).then(res => res.arrayBuffer());

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL
    const title = searchParams.get('title') ?? 'Oles Didukh';
    const subtitle =
      searchParams.get('subtitle') ?? 'Senior Front-End Engineer';
    const description = searchParams.get('description') ?? '';
    const type = searchParams.get('type') ?? 'default'; // default, blog, project

    const fontRegular = await interRegular;
    const fontBold = await interBold;

    // Background gradients based on type
    const backgroundGradient = {
      default:
        'linear-gradient(135deg, rgba(139, 115, 85, 0.1) 0%, rgba(30, 41, 59, 0.1) 100%)',
      blog: 'linear-gradient(to right bottom, #1e293b, #0f172a)',
      project: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)',
    };

    // Theme colors based on type
    const textPrimary = type === 'blog' ? '#f8fafc' : '#0f172a';
    const textSecondary = type === 'blog' ? '#cbd5e1' : '#475569';
    const accent = type === 'blog' ? '#38bdf8' : '#8B7355';

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: type === 'blog' ? '#0f172a' : '#faf8f5',
          position: 'relative',
          fontFamily: 'Inter',
        }}
      >
        {/* Background overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              backgroundGradient[type as keyof typeof backgroundGradient] ||
              backgroundGradient.default,
          }}
        />

        {/* Abstract background shapes */}
        {type === 'blog' ? (
          <div
            style={{
              position: 'absolute',
              top: -150,
              right: -100,
              width: 600,
              height: 600,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(56, 189, 248, 0.1) 0%, rgba(56, 189, 248, 0) 70%)',
            }}
          />
        ) : (
          <>
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
          </>
        )}

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
            padding: '80px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Top section with type badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {type !== 'default' && (
              <div
                style={{
                  backgroundColor:
                    type === 'blog' ? 'rgba(56, 189, 248, 0.15)' : '#8B7355',
                  color: type === 'blog' ? '#38bdf8' : 'white',
                  padding: '8px 24px',
                  borderRadius: '24px',
                  fontSize: '20px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  border:
                    type === 'blog'
                      ? '1px solid rgba(56, 189, 248, 0.3)'
                      : 'none',
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
                fontSize: title.length > 50 ? '60px' : '72px',
                fontWeight: 700,
                color: textPrimary,
                lineHeight: 1.1,
                maxWidth: '900px',
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </div>

            {subtitle && type === 'default' && (
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 500,
                  color: accent,
                }}
              >
                {subtitle}
              </div>
            )}

            {description && (
              <div
                style={{
                  fontSize: '28px',
                  color: textSecondary,
                  maxWidth: '850px',
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
              paddingTop: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background:
                    type === 'blog'
                      ? 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)'
                      : 'linear-gradient(135deg, #8B7355 0%, #6B5744 100%)',
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
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 700,
                    color: textPrimary,
                  }}
                >
                  Oles Didukh
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    color: textSecondary,
                    fontWeight: 500,
                  }}
                >
                  olesdidukh.dev
                </div>
              </div>
            </div>

            {/* Tech stack icons representation, only for default or projects */}
            {type !== 'blog' && (
              <div style={{ display: 'flex', gap: '16px' }}>
                {['React', 'TypeScript', 'Next.js'].map(tech => (
                  <div
                    key={tech}
                    style={{
                      backgroundColor: 'rgba(139, 115, 85, 0.1)',
                      color: accent,
                      padding: '10px 20px',
                      borderRadius: '12px',
                      fontSize: '18px',
                      fontWeight: 600,
                    }}
                  >
                    {tech}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: fontRegular,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Inter',
            data: fontBold,
            weight: 700,
            style: 'normal',
          },
        ],
      }
    );
  } catch (e: unknown) {
    console.error('Failed to generate OG image:', e);
    return new Response('Failed to generate image', { status: 500 });
  }
}
