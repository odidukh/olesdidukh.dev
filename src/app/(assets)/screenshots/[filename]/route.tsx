import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Determine dimensions
  let size = 180;
  if (filename.includes('192')) size = 192;
  else if (filename.includes('512')) size = 512;
  else if (filename.includes('96')) size = 96;
  else if (filename.includes('desktop')) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0a0a',
        }}
      >
        <div style={{ margin: 'auto', color: '#8b7355', fontSize: 64 }}>
          Desktop View
        </div>
      </div>,
      { width: 1920, height: 1080 }
    );
  } else if (filename.includes('mobile')) {
    return new ImageResponse(
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0a0a0a',
        }}
      >
        <div style={{ margin: 'auto', color: '#8b7355', fontSize: 48 }}>
          Mobile View
        </div>
      </div>,
      { width: 750, height: 1334 }
    );
  }

  // Common icon properties
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        color: 'white',
        fontSize: size * 0.45,
        fontWeight: 'bold',
        fontFamily: 'sans-serif',
        borderRadius: filename.includes('apple') ? Math.round(size * 0.22) : 0,
      }}
    >
      OD
    </div>,
    { width: size, height: size }
  );
}
