var dv;
var rawWaveData = new Array();
var audioCtx;
var reader;
var wave;
Array.prototype.getLength = function() {return this.length;};
Array.prototype.getByte = function(index) {return this[index].charCodeAt(0)&255;};
var rawWaveData;
var stream;
var streamURL;

function readTzx() {
    if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    dv = new DataView(reader.result);
    wave = wav.create(1, (audioCtx.sampleRate)?audioCtx.sampleRate:44100, wav.SampleSize.EIGHT);
    var details = tzx.convertTzxToAudio(tzx.MachineSettings.ZXSpectrum48, {
        getLength: function() { return dv.buffer.byteLength; },
        getByte: function(index) {
            // throw away high-order byte (f7)
            return dv.getUint8(index);
        }
    }, wave);
    rawWaveData.splice(0,rawWaveData.length);
    rawWaveData = wave.toByteArray();

    stream = new Blob([new Uint8Array(rawWaveData)],{type : 'application/octet-binary'});
    streamURL = URL.createObjectURL(stream);
    document.getElementById("stream").src = streamURL;
    
}

function readFile(input) {
    var file = input.files[0];
    reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = readTzx;
    reader.onerror = function() {
    };
}
