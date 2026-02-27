'use client';

import { useCallback } from 'react';
import { useSoundPreference } from '@/stores/useUIPreferencesStore';

// Simple Web Audio API synthesizer for UI sounds
class UISoundSynthesizer {
  private ctx: AudioContext | null = null;
  private volume: GainNode | null = null;

  private init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.volume = this.ctx.createGain();
        this.volume.connect(this.ctx.destination);
        this.volume.gain.value = 0.2; // Default global volume for UI sounds
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    this.init();
    if (!this.ctx || !this.volume) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Frequency sweep for a nice pop
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.1);

    // Amplitude envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(1, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    osc.connect(gain);
    gain.connect(this.volume);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  playClick() {
    this.init();
    if (!this.ctx || !this.volume) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // High frequency short click
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

    osc.connect(gain);
    gain.connect(this.volume);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  playSwoosh() {
    this.init();
    if (!this.ctx || !this.volume) return;

    const t = this.ctx.currentTime;

    // Create noise by using a buffer
    const bufferSize = this.ctx.sampleRate * 0.3; // 300ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Add a bandpass filter to give it a "whoosh" character
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(3000, t + 0.15);
    filter.frequency.exponentialRampToValueAtTime(400, t + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.15);
    gain.gain.linearRampToValueAtTime(0.01, t + 0.3);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.volume);

    noiseSource.start(t);
    noiseSource.stop(t + 0.3);
  }
}

// Singleton instances
let synth: UISoundSynthesizer | null = null;
if (typeof window !== 'undefined') {
  synth = new UISoundSynthesizer();
}

/**
 * Hook to play UI sounds using Web Audio API if sound preferences are enabled
 */
export function useAppSounds() {
  const { soundEnabled } = useSoundPreference();

  const playPop = useCallback(() => {
    if (soundEnabled && synth) synth.playPop();
  }, [soundEnabled]);

  const playClick = useCallback(() => {
    if (soundEnabled && synth) synth.playClick();
  }, [soundEnabled]);

  const playSwoosh = useCallback(() => {
    if (soundEnabled && synth) synth.playSwoosh();
  }, [soundEnabled]);

  return { playPop, playClick, playSwoosh };
}
