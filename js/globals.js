/*
	This contains all of the constants, settings, various objects used to in multiple parts of the code.
	I'm currently treating this like globals to sit on the top level of the program.
*/

const emoteURL = 'http://static-cdn.jtvnw.net/emoticons/v1/{image_id}/1.0';
const twitchEmoteAPI = 'https://twitchemotes.com/api_cache/v3/global.json';
const socket = io();

let list = document.getElementById("messages");
let user = "Joe";
let userColor = "blue";
let date;
let hasText = false;
let iconValue = "";
let iconColor = "white";
let message = {
	user: "",
	text: "",
	time: ""
}
let messageColor = "black";
let liveEmotes;
let timeStamp = false;
let subscriberEmotes;
let localEmotes;
