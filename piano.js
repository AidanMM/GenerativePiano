var audioCtx = new AudioContext();
var waveType = 'square';

var KeyboardKey = function(note){
	Object.assign(this, {
	playing: false,
	note: null,
	duration: .1,
	keyNumber: null,
	playNote: function() {
		var osc = audioCtx.createOscillator();
			osc.type = waveType;
			osc.frequency.value = this.note;
			
			var gainNode = audioCtx.createGain()
			gainNode.gain.setValueAtTime( 0, audioCtx.currentTime )
			gainNode.gain.linearRampToValueAtTime( .3, audioCtx.currentTime + this.duration )
			gainNode.gain.linearRampToValueAtTime( 0, audioCtx.currentTime + this.duration + this.duration / 5.0 )
			
			osc.connect(gainNode);
			gainNode.connect(audioCtx.destination);
			
			osc.start();
			this.playing = true;
			var playing = this.playing;
			osc.stop(audioCtx.currentTime + this.duration + this.duration / 5.0);
			osc.owner = this;
			osc.onended = function(){ 
				osc.owner.playing = false;
			};
	}
	});
	
	this.note = note;
}

var Piano = function(ctx, xPos, yPos, width, height){
	Object.assign(this, {
		key: null,
		chords: [],
		allowedNotes: [],
		whiteKeys: 52,
		blackKeys: 36,
		drawData: {
			width: 0,
			height: 0,
			xPos: 0,
			yPos: 0,
			ctx: null,
		},
		draw: function() {
			var whiteKeyWidth = this.drawData.width / this.whiteKeys;
			var blackKeyWidth = whiteKeyWidth / 1.5;
			var blackKeyHeight = this.drawData.height / 3.0 * 2.0;
			var keyIter = this.whiteKeys - 1;
			for(var i = 0; i < this.keyboardKeys.length; i++) {
				
				//Check if a black key or white key
				var baseKey = i % 12;
				if(baseKey == 2 || baseKey == 4 || baseKey == 6 || baseKey == 9 || baseKey == 11 ) {
					continue;
				}
				if(this.keyboardKeys[i].playing == true) {
					this.drawData.ctx.fillStyle = "rgb(255, 100, 100)";
				} else {
					this.drawData.ctx.fillStyle = "rgb(255,255,255)";
				}
				this.drawData.ctx.fillRect(this.drawData.xPos + whiteKeyWidth * keyIter, this.drawData.yPos, whiteKeyWidth, this.drawData.height);
				this.drawData.ctx.strokeRect(this.drawData.xPos + whiteKeyWidth * keyIter, this.drawData.yPos, whiteKeyWidth, this.drawData.height);
				
				keyIter--;
			}
			
			keyIter = this.whiteKeys - 1;
			for(i = 0; i < this.keyboardKeys.length; i++) {
				
				//Check if a black key or white key
				var baseKey = i % 12;
				if(baseKey == 2 || baseKey == 4 || baseKey == 6 || baseKey == 9 || baseKey == 11 ) {
					if(this.keyboardKeys[i].playing == true) {
						this.drawData.ctx.fillStyle = "rgb(255, 50, 50)";
					} else {
						this.drawData.ctx.fillStyle = "rgb(0,0,0)";
					}
					this.drawData.ctx.fillRect(this.drawData.xPos + whiteKeyWidth * keyIter + whiteKeyWidth / 3 * 2, this.drawData.yPos, blackKeyWidth, blackKeyHeight);
					continue;
				}
				
				keyIter--;
			}
		},
		playNote: function(keyboardKey) {
			keyboardKey.playNote();
		},
		playTriad: function(triad) {
			this.playNote(triad.n1);
			this.playNote(triad.n2);
			this.playNote(triad.n3);
		},
		play7th: function(chord) {
			this.playNote(chord.n1);
			this.playNote(chord.n2);
			this.playNote(chord.n3);
			this.playNote(chord.n4);
		},
		playScale: function(scale, delay) {
			var piano = this;
			setTimeout(function(){piano.playNote(scale.n1)}, 0);
			setTimeout(function(){piano.playNote(scale.n2)}, delay * 1);
			setTimeout(function(){piano.playNote(scale.n3)}, delay * 2);
			setTimeout(function(){piano.playNote(scale.n4)}, delay * 3);
			setTimeout(function(){piano.playNote(scale.n5)}, delay * 4);
			setTimeout(function(){piano.playNote(scale.n6)}, delay * 5);
			setTimeout(function(){piano.playNote(scale.n7)}, delay * 6);
			setTimeout(function(){piano.playNote(scale.n8)}, delay * 7);
		},
		playChords: function(delay) {
			if(this.chords.length != 0) {
				var piano = this;
				setTimeout(function(){piano.play7th(piano.chords[0])}, 0);
				setTimeout(function(){piano.play7th(piano.chords[1])}, delay * 1);
				setTimeout(function(){piano.play7th(piano.chords[2])}, delay * 2);
				setTimeout(function(){piano.play7th(piano.chords[3])}, delay * 3);
				setTimeout(function(){piano.play7th(piano.chords[4])}, delay * 4);
				setTimeout(function(){piano.play7th(piano.chords[5])}, delay * 5);
				setTimeout(function(){piano.play7th(piano.chords[6])}, delay * 6);
				setTimeout(function(){piano.play7th(piano.chords[7])}, delay * 7);
			}
		},
		arpeggio: function(chord, delay, duration) {
			if(chord.n1 != null)chord.n1.duration = duration;
			if(chord.n2 != null)chord.n2.duration = duration;
			if(chord.n3 != null)chord.n3.duration = duration;
			if(chord.n4 != null)chord.n4.duration = duration;
			
			var piano = this;
			setTimeout(function(){piano.playNote(chord.n1)}, delay * 0);
			setTimeout(function(){piano.playNote(chord.n2)}, delay * 1);
			setTimeout(function(){piano.playNote(chord.n3)}, delay * 2);
			setTimeout(function(){piano.playNote(chord.n4)}, delay * 3);
			return delay * 3;
		},			
		reverseArpeggio: function(chord, delay, duration) {
			if(chord.n1 != null)chord.n1.duration = duration ;
			if(chord.n2 != null)chord.n2.duration = duration;
			if(chord.n3 != null)chord.n3.duration = duration;
			if(chord.n4 != null)chord.n4.duration = duration;
			
			var piano = this;
			setTimeout(function(){piano.playNote(chord.n4)}, delay * 0);
			setTimeout(function(){piano.playNote(chord.n3)}, delay * 1);
			setTimeout(function(){piano.playNote(chord.n2)}, delay * 2);
			setTimeout(function(){piano.playNote(chord.n1)}, delay * 3);
			return delay * 3;
		},
		setChordDuration: function(chord, duration) {
			chord.n1.duration = duration;
			chord.n2.duration = duration;
			chord.n3.duration = duration;
			chord.n4.duration = duration;
		},
		genChords: function(keyboardKey) {
			var s = this.genScale(keyboardKey);
			this.allowedNotesInKey(s);
			
			for(var i = 0; i < this.allowedNotes.length; i++) {
				this.chords[i] = this.gen7thInCurrentKey(this.keyboardKeys[this.allowedNotes[i]]);
			}
			
			/*this.chords[0] = this.gen7thInCurrentKey(s.n1);
			this.chords[1] = this.gen7thInCurrentKey(s.n2);
			this.chords[2] = this.gen7thInCurrentKey(s.n3);
			this.chords[3] = this.gen7thInCurrentKey(s.n4);
			this.chords[4] = this.gen7thInCurrentKey(s.n5);
			this.chords[5] = this.gen7thInCurrentKey(s.n6);
			this.chords[6] = this.gen7thInCurrentKey(s.n7);
			this.chords[7] = this.gen7thInCurrentKey(s.n8);*/
			
			return this.chords;
		},
		
		gen7thInCurrentKey: function(keyboardKey){
			var chord = this.genMajor7th(keyboardKey);
			if(this.validateChordInCurrentKey(chord)) return chord; else chord = this.genMinor7th(keyboardKey);
			if(this.validateChordInCurrentKey(chord)) return chord; else chord = this.genDominant7th(keyboardKey);
			if(this.validateChordInCurrentKey(chord)) return chord; else chord = this.genMinMaj7th(keyboardKey);
			if(this.validateChordInCurrentKey(chord)) return chord; else chord = this.genHalfDiminished7th(keyboardKey);
			return chord;		
		},
		genMajorTriad: function(keyboardKey) {
			return this.genTriad(keyboardKey, 
							this.keyboardKeys[keyboardKey.keyNumber - 4], 
							this.keyboardKeys[keyboardKey.keyNumber - 7]);
		},
		genMinorTriad: function(keyboardKey) {		
			return this.genTriad(keyboardKey, 
							this.keyboardKeys[keyboardKey.keyNumber - 3], 
							this.keyboardKeys[keyboardKey.keyNumber - 7]);
		},
		genDiminishedTriad: function(keyboardKey) {
			return this.genTriad(keyboardKey, 
							this.keyboardKeys[keyboardKey.keyNumber - 3], 
							this.keyboardKeys[keyboardKey.keyNumber - 6]);
		},
		genMajor7th: function(keyboardKey) {
			var t = this.genMajorTriad(keyboardKey);
			return this.gen7thChord(t.n1, t.n2, t.n3, 
							this.keyboardKeys[keyboardKey.keyNumber - 11]);
		},
		
		genMinor7th: function(keyboardKey) {
			var t = this.genMinorTriad(keyboardKey);
			return this.gen7thChord(t.n1, t.n2, t.n3, 
							this.keyboardKeys[keyboardKey.keyNumber - 10]);
		},
		
		genDominant7th: function(keyboardKey) {
			var t = this.genMajorTriad(keyboardKey);
			return this.gen7thChord(t.n1, t.n2, t.n3, 
							this.keyboardKeys[keyboardKey.keyNumber - 10]);
		},
		
		genMinMaj7th: function(keyboardKey) {
			var t = this.genMinorTriad(keyboardKey);
			return this.gen7thChord(t.n1, t.n2, t.n3, 
							this.keyboardKeys[keyboardKey.keyNumber - 11]);
		},
		genHalfDiminished7th: function(keyboardKey) {
			var t = this.genDiminishedTriad(keyboardKey);
			return this.gen7thChord(t.n1, t.n2, t.n3, 
							this.keyboardKeys[keyboardKey.keyNumber - 10]);
		},
		
		validateNoteInCurrentKey: function(keyboardKey) {
			if(keyboardKey == null) {
				return true;
			}
			for(var i = 0; i < 12; i++) {
				if(this.allowedNotes[i] == keyboardKey.keyNumber % 12) {
					return true;
				}
			}
			return false;
		},
		
		validateChordInCurrentKey: function(chord) {
			return (this.validateNoteInCurrentKey(chord.n1) && this.validateNoteInCurrentKey(chord.n2) &&
						this.validateNoteInCurrentKey(chord.n3) && this.validateNoteInCurrentKey(chord.n4));
		},
		
		gen7thChord: function(n1, n2, n3, n4) {
			var c = {};
			c.n1 = n1;
			c.n2 = n2;
			c.n3 = n3;
			c.n4 = n4;
			return c;
		},
		genScale: function(keyboardKey) {
			var s = {};
			s.n1 = keyboardKey;
			s.n2 = this.keyboardKeys[keyboardKey.keyNumber - 2];
			s.n3 = this.keyboardKeys[keyboardKey.keyNumber - 4];
			s.n4 = this.keyboardKeys[keyboardKey.keyNumber - 5];
			s.n5 = this.keyboardKeys[keyboardKey.keyNumber - 7];
			s.n6 = this.keyboardKeys[keyboardKey.keyNumber - 9];
			s.n7 = this.keyboardKeys[keyboardKey.keyNumber - 11];
			s.n8 = this.keyboardKeys[keyboardKey.keyNumber - 12];
			return s;
		},
		allowedNotesInKey: function(scale) {
			var allowed = [];
			allowed [0] = scale.n1.keyNumber % 12;
			allowed [1] = scale.n2.keyNumber % 12;
			allowed [2] = scale.n3.keyNumber % 12;
			allowed [3] = scale.n4.keyNumber % 12;
			allowed [4] = scale.n5.keyNumber % 12;
			allowed [5] = scale.n6.keyNumber % 12;
			allowed [6] = scale.n7.keyNumber % 12;
			
			var value = allowed[0];
			var iter = 0;
			var index = 7;
			
			while(value + 12 < 88) {
				allowed[index] = value + 12;
				index++;
				iter++;
				value = allowed[iter];
			}
			function sortNumber(a,b) {
				return a - b;
			}
			
			allowed.sort(sortNumber);
			
			this.allowedNotes = allowed;
			this.key = scale.n1;
			return allowed;
		},
		
		genTriad: function(n1, n2, n3) {
			var t = {};
			t.n1 = n1;
			t.n2 = n2;
			t.n3 = n3;
			return t;
		},
		doMouseDown: function(e) {
			var mouse = getMouse(e);
			var whiteKeyWidth = this.drawData.width / this.whiteKeys;
			var blackKeyWidth = whiteKeyWidth / 1.5;
			var blackKeyHeight = this.drawData.height / 3.0 * 2.0;
			var keyIter = this.whiteKeys - 1;
			for(i = 0; i < this.keyboardKeys.length; i++) {
				var baseKey = i % 12;
				if(baseKey == 2 || baseKey == 4 || baseKey == 6 || baseKey == 9 || baseKey == 11 ) {
					if(withinRectangle(mouse.x, mouse.y, this.drawData.xPos + whiteKeyWidth * keyIter + whiteKeyWidth / 3 * 2, this.drawData.yPos, blackKeyWidth, blackKeyHeight)){
						//this.keyboardKeys[i].playNote();
						//this.genChords(this.keyboardKeys[i]);
						this.arpeggio(this.genMajor7th(this.keyboardKeys[i]), 100, .1);
						return;
					}
					continue;
				}
				keyIter--;
			}
			
			keyIter = this.whiteKeys - 1;
			for(var i = 0; i < this.keyboardKeys.length; i++) {
				var baseKey = i % 12;
				if(baseKey == 2 || baseKey == 4 || baseKey == 6 || baseKey == 9 || baseKey == 11 ) {
					continue;
				}
				if(withinRectangle(mouse.x, mouse.y, this.drawData.xPos + whiteKeyWidth * keyIter, this.drawData.yPos, whiteKeyWidth, this.drawData.height)){
					this.arpeggio(this.genMajor7th(this.keyboardKeys[i]), 100, .1);
					return;
				}
				keyIter--;
			}
			
		},
		note: {
			//Organized from high to low
			c8: 4168.01,
			
			b7: 3951.07,
			as7: 3729.31,
			a7: 3520.00,
			gs7: 3322.00,
			g7: 3135.96,
			fs7: 2959.96,
			f7: 2793.02,
			e7: 2637.02,
			ds7: 2489.02,
			d7: 2349.32,
			cs7: 2217.46,
			c7: 2093.00,
			
			b6: 1975.53,
			as6: 1864.66,
			a6: 1760.00,
			gs6: 1661.22,
			g6: 1567.98,
			fs6: 1479.98,
			f6: 1396.91,
			e6: 1318.51,
			ds6: 1244.51,
			d6: 1174.66,
			cs6: 1108.73,
			c6: 1046.50,
			
			b5: 987.767,
			as5: 932.328,
			a5: 880.000,
			gs5: 830.609,
			g5: 783.991,
			fs5: 739.989,
			f5: 698.456,
			e5: 659.255,
			ds5: 622.254,
			d5: 587.330,
			cs5: 554.365,
			c5: 523.251,
			
			b4: 493.883,
			as4: 466.164,
			a4: 440.000,
			gs4: 415.305,
			g4: 391.995,
			fs4: 369.994,
			f4: 349.228,
			e4: 329.628,
			ds4: 311.127,
			d4: 293.665,
			cs4: 277.183,
			c4: 261.626,
			
			b3: 246.942,
			as3: 233.082,
			a3: 220.000,
			gs3: 207.652,
			g3: 195.998,
			f3: 174.614,
			fs3: 184.997,
			e3: 164.814,
			ds3: 155.563,
			d3: 146.832,
			cs3: 138.591,
			c3: 130.813,
			
			b2: 123.471,
			as2: 116.541,
			a2: 110.000,
			gs2: 103.826,
			g2: 97.9989,
			fs2: 92.4986,
			f2: 87.3071,
			e2: 82.4069,
			ds2: 77.7817,
			d2: 73.4162,
			cs2: 69.2957,
			c2: 65.4064,
			
			b1: 61.7354,
			as1: 58.2705,
			a1: 55.0000,
			gs1: 51.9130,
			g1: 48.9995,
			fs1: 46.2493,
			f1: 43.6536,
			e1: 41.2035,
			ds1: 38.8909,
			d1: 36.7081,
			cs1: 34.6479,
			c1: 32.7032,
			
			b0: 30.8677,
			as0: 29.1353,
			a0: 27.5000
			
		},
		keyboardKeys: [],
	});
	
	this.keyboardKeys = [
			new KeyboardKey(this.note.c8),
			
			new KeyboardKey(this.note.b7),
			new KeyboardKey(this.note.as7),
			new KeyboardKey(this.note.a7),
            new KeyboardKey(this.note.gs7),
            new KeyboardKey(this.note.g7),
            new KeyboardKey(this.note.fs7),
            new KeyboardKey(this.note.f7),
            new KeyboardKey(this.note.e7),
            new KeyboardKey(this.note.ds7),
            new KeyboardKey(this.note.d7),
            new KeyboardKey(this.note.cs7),
            new KeyboardKey(this.note.c7),
            
            new KeyboardKey(this.note.b6),
            new KeyboardKey(this.note.as6),
            new KeyboardKey(this.note.a6),
            new KeyboardKey(this.note.gs6),
            new KeyboardKey(this.note.g6),
            new KeyboardKey(this.note.fs6),
            new KeyboardKey(this.note.f6),
            new KeyboardKey(this.note.e6),
            new KeyboardKey(this.note.ds6),
            new KeyboardKey(this.note.d6),
            new KeyboardKey(this.note.cs6),
            new KeyboardKey(this.note.c6),
            
            new KeyboardKey(this.note.b5),
            new KeyboardKey(this.note.as5),
            new KeyboardKey(this.note.a5),
            new KeyboardKey(this.note.gs5),
            new KeyboardKey(this.note.g5),
            new KeyboardKey(this.note.fs5),
            new KeyboardKey(this.note.f5),
            new KeyboardKey(this.note.e5),
            new KeyboardKey(this.note.ds5),
            new KeyboardKey(this.note.d5),
            new KeyboardKey(this.note.cs5),
            new KeyboardKey(this.note.c5),
            
            new KeyboardKey(this.note.b4),
            new KeyboardKey(this.note.as4),
            new KeyboardKey(this.note.a4),
            new KeyboardKey(this.note.gs4),
            new KeyboardKey(this.note.g4),
            new KeyboardKey(this.note.fs4),
            new KeyboardKey(this.note.f4),
            new KeyboardKey(this.note.e4),
            new KeyboardKey(this.note.ds4),
            new KeyboardKey(this.note.d4),
            new KeyboardKey(this.note.cs4),
            new KeyboardKey(this.note.c4),
            
            new KeyboardKey(this.note.b3),
            new KeyboardKey(this.note.as3),
            new KeyboardKey(this.note.a3),
            new KeyboardKey(this.note.gs3),
            new KeyboardKey(this.note.g3),
            new KeyboardKey(this.note.f3),
            new KeyboardKey(this.note.fs3),
            new KeyboardKey(this.note.e3),
            new KeyboardKey(this.note.ds3),
            new KeyboardKey(this.note.d3),
            new KeyboardKey(this.note.cs3),
            new KeyboardKey(this.note.c3),
            
            new KeyboardKey(this.note.b2),
            new KeyboardKey(this.note.as2),
            new KeyboardKey(this.note.a2),
            new KeyboardKey(this.note.gs2),
            new KeyboardKey(this.note.g2),
            new KeyboardKey(this.note.fs2),
            new KeyboardKey(this.note.f2),
            new KeyboardKey(this.note.e2),
            new KeyboardKey(this.note.ds2),
            new KeyboardKey(this.note.d2),
            new KeyboardKey(this.note.cs2),
            new KeyboardKey(this.note.c2),
            
            new KeyboardKey(this.note.b1),
            new KeyboardKey(this.note.as1),
            new KeyboardKey(this.note.a1),
            new KeyboardKey(this.note.gs1),
            new KeyboardKey(this.note.g1),
            new KeyboardKey(this.note.fs1),
            new KeyboardKey(this.note.f1),
            new KeyboardKey(this.note.e1),
            new KeyboardKey(this.note.ds1),
            new KeyboardKey(this.note.d1),
            new KeyboardKey(this.note.cs1),
            new KeyboardKey(this.note.c1),
            
            new KeyboardKey(this.note.b0),
            new KeyboardKey(this.note.as0),
            new KeyboardKey(this.note.a0)
	];
	
	this.note.c8  = this.keyboardKeys[0];
	
    this.note.b7  = this.keyboardKeys[1];
    this.note.as7 = this.keyboardKeys[2];
    this.note.a7  = this.keyboardKeys[3];
    this.note.gs7 = this.keyboardKeys[4];
    this.note.g7  = this.keyboardKeys[5];
    this.note.fs7 = this.keyboardKeys[6];
    this.note.f7  = this.keyboardKeys[7];
    this.note.e7  = this.keyboardKeys[8];
    this.note.ds7 = this.keyboardKeys[9];
    this.note.d7  = this.keyboardKeys[10];
    this.note.cs7 = this.keyboardKeys[11];
    this.note.c7  = this.keyboardKeys[12];

    this.note.b6  = this.keyboardKeys[13];
    this.note.as6 = this.keyboardKeys[14];
    this.note.a6  = this.keyboardKeys[15];
    this.note.gs6 = this.keyboardKeys[16];
    this.note.g6  = this.keyboardKeys[17];
    this.note.fs6 = this.keyboardKeys[18];
    this.note.f6  = this.keyboardKeys[19];
    this.note.e6  = this.keyboardKeys[20];
    this.note.ds6 = this.keyboardKeys[21];
    this.note.d6  = this.keyboardKeys[22];
    this.note.cs6 = this.keyboardKeys[23];
    this.note.c6  = this.keyboardKeys[24];
    
    this.note.b5  = this.keyboardKeys[25];
    this.note.as5 = this.keyboardKeys[26];
    this.note.a5  = this.keyboardKeys[27];
    this.note.gs5 = this.keyboardKeys[28];
    this.note.g5  = this.keyboardKeys[29];
    this.note.fs5 = this.keyboardKeys[30];
    this.note.f5  = this.keyboardKeys[31];
    this.note.e5  = this.keyboardKeys[32];
    this.note.ds5 = this.keyboardKeys[33];
    this.note.d5  = this.keyboardKeys[34];
    this.note.cs5 = this.keyboardKeys[35];
    this.note.c5  = this.keyboardKeys[36];
     
    this.note.b4  = this.keyboardKeys[37];
    this.note.as4 = this.keyboardKeys[38];
    this.note.a4  = this.keyboardKeys[39];
    this.note.gs4 = this.keyboardKeys[40];
    this.note.g4  = this.keyboardKeys[41];
    this.note.fs4 = this.keyboardKeys[42];
    this.note.f4  = this.keyboardKeys[43];
    this.note.e4  = this.keyboardKeys[44];
    this.note.ds4 = this.keyboardKeys[45];
    this.note.d4  = this.keyboardKeys[46];
    this.note.cs4 = this.keyboardKeys[47];
    this.note.c4  = this.keyboardKeys[48];
    
    this.note.b3  = this.keyboardKeys[49];
    this.note.as3 = this.keyboardKeys[50];
    this.note.a3  = this.keyboardKeys[51];
    this.note.gs3 = this.keyboardKeys[52];
    this.note.g3  = this.keyboardKeys[53];
    this.note.f3  = this.keyboardKeys[54];
    this.note.fs3 = this.keyboardKeys[55];
    this.note.e3  = this.keyboardKeys[56];
    this.note.ds3 = this.keyboardKeys[57];
    this.note.d3  = this.keyboardKeys[58];
    this.note.cs3 = this.keyboardKeys[59];
    this.note.c3  = this.keyboardKeys[60];
    
    this.note.b2  = this.keyboardKeys[61];
    this.note.as2 = this.keyboardKeys[62];
    this.note.a2  = this.keyboardKeys[63];
    this.note.gs2 = this.keyboardKeys[64];
    this.note.g2  = this.keyboardKeys[65];
    this.note.fs2 = this.keyboardKeys[66];
    this.note.f2  = this.keyboardKeys[67];
    this.note.e2  = this.keyboardKeys[68];
    this.note.ds2 = this.keyboardKeys[69];
    this.note.d2  = this.keyboardKeys[70];
    this.note.cs2 = this.keyboardKeys[71];
    this.note.c2  = this.keyboardKeys[72];
    
    this.note.b1  = this.keyboardKeys[73];
    this.note.as1 = this.keyboardKeys[74];
    this.note.a1  = this.keyboardKeys[75];
    this.note.gs1 = this.keyboardKeys[76];
    this.note.g1  = this.keyboardKeys[77];
    this.note.fs1 = this.keyboardKeys[78];
    this.note.f1  = this.keyboardKeys[79];
    this.note.e1  = this.keyboardKeys[80];
    this.note.ds1 = this.keyboardKeys[81];
    this.note.d1  = this.keyboardKeys[82];
    this.note.cs1 = this.keyboardKeys[83];
    this.note.c1  = this.keyboardKeys[84];
    
    this.note.b0  = this.keyboardKeys[85];
    this.note.as0 = this.keyboardKeys[86];
	this.note.a0  = this.keyboardKeys[87];
	
	for(var i = 0; i < this.keyboardKeys.length; i++) {
		this.keyboardKeys[i].keyNumber = i;
	}
	this.drawData.ctx = ctx;
	this.drawData.xPos = xPos;
	this.drawData.yPos = yPos;
	this.drawData.width = width;
	this.drawData.height = height;
}

function getMouse(e){
	var mouse = {};
	mouse.x = e.pageX - e.target.offsetLeft;
	mouse.y = e.pageY - e.target.offsetTop;
	return mouse;
}

function withinRectangle(mouseX,mouseY,x,y,width,height){
	if(mouseY > y && mouseY < y + height) {
		if(mouseX > x && mouseX < x + width) {
			return true
		} else {
			return false;
		}
	} else {
		return false
	}
}