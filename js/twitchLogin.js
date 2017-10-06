function tryLogin(){
  if(location.search != "") {
    let searchParams = location.search.split("&");
    let code = searchParams[0].replace("?code=", "");
    getTwitchTokens(code);
  }
}

async function getTwitchTokens(code){
  let response = await fetch(location.origin + "/login/" + code);
  tokens = await response.json();
  twitchLogin(tokens.access_token);
}

async function twitchLogin(token){
  let oauthHeader = new Headers(twitchHeaders);
  oauthHeader.append('Authorization', 'OAuth ' + token);
  console.log(oauthHeader);
  let response = await fetch("https://api.twitch.tv/kraken/user", { headers: oauthHeader });
  let data = await response.json();
  user =  await data.display_name;
  document.getElementById("nameInput").value = user;
  document.getElementById("nameInput").disabled = true;
  document.getElementById("setNameBtn").disabled = true;
}

tryLogin();
