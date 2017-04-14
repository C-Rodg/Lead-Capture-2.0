import { Injectable } from '@angular/core';

@Injectable()
export class SoundService {

    private firstPlay : boolean = false;

    private grantedAudioContext : any;
    private grantedSource : any;
    private grantedBuffer : any;
    private grantedGainNode : any;

    private deniedAudioContext : any;
    private deniedSource : any;
    private deniedBuffer : any;
    private deniedGainNode : any;

    constructor() {
        if ('AudioContext' in window) {
            this.grantedAudioContext = new AudioContext();
            this.deniedAudioContext = new AudioContext();                       
        } else if ('webkitAudioContext' in window) {
            this.grantedAudioContext = new webkitAudioContext();
            this.deniedAudioContext = new webkitAudioContext();                        
        }
        if ('createGain' in this.grantedAudioContext) {
            this.grantedGainNode = this.grantedAudioContext.createGain();
            this.deniedGainNode = this.deniedAudioContext.createGain();
        } else {
            this.grantedGainNode = this.grantedAudioContext.createGainNode();
            this.deniedGainNode = this.deniedAudioContext.createGainNode();
        }

       let grantedArrayBuff = this.decodeBase64ToArrayBuffer(accessGranted);
       let deniedArrayBuff = this.decodeBase64ToArrayBuffer(accessDenied);

       this.grantedAudioContext.decodeAudioData(grantedArrayBuff, (audioData) => {
           this.grantedBuffer = audioData;
       });
       this.deniedAudioContext.decodeAudioData(deniedArrayBuff, (audioData) => {
           this.deniedBuffer = audioData;
       });
    }

    private play(sound) {
        if ('start' in sound) {
            sound.start(0);
        } else {
            sound.noteOn(0);
        }
    }

    playGranted() {
        this.grantedSource = this.grantedAudioContext.createBufferSource();
        this.grantedSource.buffer = this.grantedBuffer;
        this.grantedSource.connect(this.grantedGainNode);
        this.grantedGainNode.connect(this.grantedAudioContext.destination);

        this.play(this.grantedSource);
    }

    playDenied() {
        this.deniedSource = this.deniedAudioContext.createBufferSource();
        this.deniedSource.buffer = this.deniedBuffer;
        this.deniedSource.connect(this.deniedGainNode);
        this.deniedGainNode.connect(this.deniedAudioContext.destination);
    }

    playSilent() {
        if (this.firstPlay) {
            this.firstPlay = false;

            this.grantedSource = this.grantedAudioContext.createBufferSource();
            this.grantedSource.buffer = this.grantedBuffer;
            this.grantedSource.connect(this.grantedGainNode);
            this.grantedGainNode.connect(this.grantedAudioContext.destination);

            this.deniedSource = this.deniedAudioContext.createBufferSource();
            this.deniedSource.buffer = this.deniedBuffer;
            this.deniedSource.connect(this.deniedGainNode);
            this.deniedGainNode.connect(this.deniedAudioContext.destination);

            this.grantedGainNode.gain.value = 0;
            this.deniedGainNode.gain.value = 0;

            this.play(this.grantedSource);
            this.play(this.deniedSource);

            setTimeout(() => {
                this.grantedGainNode.gain.value = 1.0;
                this.deniedGainNode.gain.value = 1.0;
            }, 2000);
        }
    }

    private decodeBase64ToArrayBuffer(base64str) {
        let l = (base64str.length/4) * 3,
            s = atob(base64str),
            a = new ArrayBuffer(l),
            b = new Uint8Array(a),
            i;
        for (i = 0; i < l; i++) {
            b[i] = s.charCodeAt(i);
        }
        return a;
    }    
}

const accessGranted = "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";

const accessDenied = "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";