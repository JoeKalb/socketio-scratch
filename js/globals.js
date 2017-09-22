/*
	This contains all of the constants, settings, various objects used to in multiple parts of the code.
	I'm currently treating this like globals to sit on the top level of the program.
*/
const emoteURL = 'http://static-cdn.jtvnw.net/emoticons/v1/{image_id}/1.0';
const twitchEmoteAPI = 'https://twitchemotes.com/api_cache/v3/global.json';
const twitchUsersURL = 'https://api.twitch.tv/kraken/users?login={name}';
const twitchHeaders = new Headers({
	'Accept': 'application/vnd.twitchtv.v5+json',
	'Client-ID': 'swy6o3hxxnevxwuwu0vrlah2dm1io9'
});

let list = document.getElementById("messages");
let user = "Default Name";
let userColor = "red";
let date;
let hasText = false;
let iconValue = "";
let iconColor = "white";
let message = {
	user: "",
	nameColor: "",
	text: "",
	time: ""
}
let messageColor = "black";
let liveEmotes;
let timeStamp = false;
let localEmotes;
let addedStreamers = [];


// Stop any IMG downloading, shoutout to forestmist.org
function context_menu(e){
	if(!e)var e=window.event;var eTarget=window.event?e.srcElement:e.target;return"IMG"==eTarget.tagName?(console.log("Image cannot be downloaded here."),!1):void 0
}document.oncontextmenu=context_menu
