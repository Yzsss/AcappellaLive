var socket = io.connect();
var mediaRecorder;
var clipNum = 0;

			
socket.on('connect', function() {
		console.log("Connected" + socket.id);
});


// These help with cross-browser functionality (shim)
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;



// if we have the method
function startCamera(){

    console.log("Start Camera!");

    // The video element on the page to display the webcam
    var video = document.getElementById('thecapture');
    let constraints = { audio: true, video: true }
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

        video.srcObject = stream;

        document.getElementById("record").disabled = false;
    
        
        video.onloadedmetadata = function(e) {
            video.play();
        };

    })
    .catch(function(err) {
        /* Handle the error */
        alert(err);
    });
}

function startRecording(){

    console.log("Start Recording!");
    var canvasStream = document.getElementById("thecapture").captureStream();

    mediaRecorder = new MediaRecorder(canvasStream);
    var chunks = [];

	mediaRecorder.onstop = function(e) {
		console.log("stop");

		var video = document.getElementById('recorded');

        video.controls = true;

        var blob = new Blob(chunks, { 'type' : 'video/webm' });
        
		var videoURL = window.URL.createObjectURL(blob);
		console.log(videoURL);
		video.src = videoURL;
		//document.body.appendChild(video);
	};

		mediaRecorder.ondataavailable = function(e) {
			console.log("data");
			chunks.push(e.data);
		};

        var mySound = document.getElementById("beats");
        mediaRecorder.start();
        mySound.play();
        

		setTimeout(function() {
            mediaRecorder.stop();
            document.getElementById("record").innerHTML = "Record Again"
            document.getElementById("submit").disabled = false;
            document.getElementById("add").disabled = false;
        }, 4001);	    
}

function submitRecording(){

    console.log("Submit Recording!");
    //Send to the server
	socket.emit('video',blob);

}

function addRecording(){

    console.log("Add Recording!");

    if (clipNum < 10){

        var clip = document.createElement('video');
        clip.id = "" + clipNum;
        clip.controls = true;
    
        document.body.appendChild(clip);
    
        var videoURL = document.getElementById('recorded').src;
        document.getElementById("" + clipNum).src = videoURL;

        clipNum++;

    } 

    document.getElementById("play").disabled = false;
}

function playRecording(){

    console.log("Play Recording!");

    document.getElementById("start").disabled = true;
    document.getElementById("record").disabled = true;
    document.getElementById("submit").disabled = true;
    document.getElementById("add").disabled = true;
    document.getElementById("play").disabled = true;
    document.getElementById("stop").disabled = false;

    for(let i = 0; i < clipNum; i++){
        document.getElementById(""+i).play();
        document.getElementById(""+i).loop = true;
    }

}

function stopPlaying(){

    console.log("Stop Playing!");

    document.getElementById("start").disabled = false;
    document.getElementById("record").disabled = false;
    document.getElementById("submit").disabled = false;
    document.getElementById("add").disabled = false;
    document.getElementById("play").disabled = false;
    document.getElementById("stop").disabled = true;

    for(let i = 0; i < clipNum; i++){
        document.getElementById(""+i).loop = false;
        document.getElementById(""+i).stop();
    }


}

