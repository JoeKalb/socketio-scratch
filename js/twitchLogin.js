function tryLogin(){
  if(location.search != "") {
    let searchParams = location.search.split("&");
    let code = searchParams[0].replace("?code=", "");
    loginIntoTwitch(code);
  }
}

async function loginIntoTwitch(code){
  let response = await fetch(location.origin + "/login/" + code);
  let tokens = await response.json();
  console.log(tokens);
}

tryLogin();
