/**
 * Antigravity Agent - Voice Handler & Visualizer
 * Handles the Web Audio API for frequency-reactive animations
 */

class VoiceHandler {
    constructor() {
        this.orb = document.querySelector('.gravity-well');
        this.aura = document.querySelector('.orb-aura');
        this.vibeText = document.getElementById('vibe-text');
        this.startButton = document.getElementById('start-session');
        this.isRecording = false;

        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.animationId = null;

        this.init();
    }

    init() {
        this.startButton.addEventListener('click', () => this.toggleSession());
    }

    async toggleSession() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            source.connect(this.analyser);

            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);

            this.isRecording = true;
            this.startButton.textContent = 'STOP RESOLUTION';
            this.startButton.classList.add('active');
            this.vibeText.textContent = 'Listening to your frequency...';
            
            this.animate();
        } catch (err) {
            console.error('Error accessing microphone:', err);
            this.vibeText.textContent = 'Microphone access denied.';
        }
    }

    stopRecording() {
        this.isRecording = false;
        this.startButton.textContent = 'INITIATE RESOLUTION';
        this.startButton.classList.remove('active');
        this.vibeText.textContent = 'Session paused.';
        
        if (this.animationId) cancelAnimationFrame(this.animationId);
        if (this.audioContext) this.audioContext.close();

        // Reset Orb
        this.aura.style.transform = 'scale(1)';
        this.aura.style.opacity = '0.5';
    }

    animate() {
        if (!this.isRecording) return;

        this.animationId = requestAnimationFrame(() => this.animate());
        this.analyser.getByteFrequencyData(this.dataArray);

        // Calculate average volume/frequency
        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            sum += this.dataArray[i];
        }
        const average = sum / this.dataArray.length;

        // Map frequency to Orb scale and opacity
        const scale = 1 + (average / 128); // Max scale ~2
        const opacity = 0.5 + (average / 255);

        this.aura.style.transform = `scale(${scale})`;
        this.aura.style.opacity = opacity;
        
        // Dynamic Glow based on frequency
        const glowIntensity = average / 2;
        this.orb.style.filter = `drop-shadow(0 0 ${glowIntensity}px var(--accent-glow))`;
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.antigravity = new VoiceHandler();
});
