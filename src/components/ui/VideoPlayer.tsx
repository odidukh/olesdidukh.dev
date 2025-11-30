'use client';

import * as React from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VIDEO_PLAYER_CONFIG } from '@/config/animations';
import type { ProjectVideo } from '@/data/projects';

interface VideoPlayerProps {
  video: ProjectVideo;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  aspectRatio?: '16/9' | '4/3' | '1/1';
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match?.[1] ?? null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
  return match?.[1] ?? null;
}

function YouTubeEmbed({
  videoId,
  thumbnail,
  title,
}: {
  videoId: string;
  thumbnail?: string;
  title?: string;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const thumbnailUrl =
    thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="relative w-full h-full group cursor-pointer"
        aria-label={`Play video: ${title || 'YouTube video'}`}
      >
        <Image
          src={thumbnailUrl}
          alt={title || 'Video thumbnail'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play
              className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
              fill="white"
            />
          </div>
        </div>
      </button>
    );
  }

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
      title={title || 'YouTube video'}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  );
}

function VimeoEmbed({
  videoId,
  thumbnail,
  title,
}: {
  videoId: string;
  thumbnail?: string;
  title?: string;
}) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  if (!isLoaded) {
    return (
      <button
        onClick={() => setIsLoaded(true)}
        className="relative w-full h-full group cursor-pointer"
        aria-label={`Play video: ${title || 'Vimeo video'}`}
      >
        {thumbnail ? (
          <Image
            src={thumbnail}
            alt={title || 'Video thumbnail'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-600" />
        )}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#1ab7ea] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
            <Play
              className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
              fill="white"
            />
          </div>
        </div>
      </button>
    );
  }

  return (
    <iframe
      src={`https://player.vimeo.com/video/${videoId}?autoplay=1`}
      title={title || 'Vimeo video'}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
    />
  );
}

function LocalVideo({
  url,
  thumbnail,
  title,
  autoPlay,
  muted: initialMuted,
  loop,
}: {
  url: string;
  thumbnail?: string;
  title?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = React.useState(autoPlay ?? false);
  const [isMuted, setIsMuted] = React.useState(initialMuted ?? true);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showControls, setShowControls] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  return (
    <div
      className="relative w-full h-full group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Thumbnail overlay before play */}
      {!isPlaying && thumbnail && (
        <div className="absolute inset-0 z-10">
          <Image
            src={thumbnail}
            alt={title || 'Video thumbnail'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      )}

      {/* Play button overlay */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
          aria-label={`Play video: ${title || 'Video'}`}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-mocha-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
            <Play
              className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
              fill="white"
            />
          </div>
        </button>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        src={url}
        className="w-full h-full object-cover"
        playsInline
        muted={isMuted}
        loop={loop}
        onLoadedData={() => setIsLoading(false)}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        aria-label={title || 'Video'}
      />

      {/* Custom controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent transition-opacity',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress bar */}
        <div
          className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-mocha-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="text-white hover:text-mocha-300 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={toggleMute}
            className="text-white hover:text-mocha-300 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>

          <div className="flex-1" />

          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-mocha-300 transition-colors"
            aria-label="Toggle fullscreen"
          >
            <Maximize className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoPlayer({
  video,
  className,
  autoPlay = false,
  muted = true,
  loop = false,
  aspectRatio = '16/9',
}: VideoPlayerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  // Lazy loading with Intersection Observer
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: VIDEO_PLAYER_CONFIG.INTERSECTION_ROOT_MARGIN,
        threshold: VIDEO_PLAYER_CONFIG.INTERSECTION_THRESHOLD,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const aspectRatioClass = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    '1/1': 'aspect-square',
  }[aspectRatio];

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted',
        aspectRatioClass,
        className
      )}
    >
      {isVisible ? (
        <>
          {video.type === 'youtube' && (
            <YouTubeEmbed
              videoId={getYouTubeId(video.url) || ''}
              {...(video.thumbnail !== undefined && {
                thumbnail: video.thumbnail,
              })}
              {...(video.title !== undefined && { title: video.title })}
            />
          )}
          {video.type === 'vimeo' && (
            <VimeoEmbed
              videoId={getVimeoId(video.url) || ''}
              {...(video.thumbnail !== undefined && {
                thumbnail: video.thumbnail,
              })}
              {...(video.title !== undefined && { title: video.title })}
            />
          )}
          {video.type === 'local' && (
            <LocalVideo
              url={video.url}
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              {...(video.thumbnail !== undefined && {
                thumbnail: video.thumbnail,
              })}
              {...(video.title !== undefined && { title: video.title })}
            />
          )}
        </>
      ) : (
        // Placeholder while lazy loading
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
        </div>
      )}

      {/* Duration badge */}
      {video.duration && (
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-xs text-white font-medium">
          {video.duration}
        </div>
      )}
    </div>
  );
}

export { getYouTubeId, getVimeoId };
