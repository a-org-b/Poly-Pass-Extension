import { CurrentParams, LOGIN_SUCCESS, Message, PARAMS_UPDATED } from "./types";

const v = "1.0";
console.log("Starting Poly Pass", v);
const success_save = document.createElement("div");
success_save.innerHTML = `
<div style="
position:fixed;
top:4%;
left:4%;
border-radius:12px;
padding:8px;
color:black;
background-color:white;
-webkit-box-shadow: 10px 10px 88px -8px rgba(0,0,0,1);
-moz-box-shadow: 10px 10px 88px -8px rgba(0,0,0,1);
box-shadow: 10px 10px 88px -8px rgba(0,0,0,1);
">
 Save to passwords? </div>`;
chrome.runtime.onMessage.addListener((m:Message<any>,sender)=>{
  if(m.key==LOGIN_SUCCESS){
  document.getElementsByTagName("body")[0].appendChild(success_save)
  }
})

const on_load = () => {
  
  
  const username_element: HTMLInputElement | null =
    document.querySelector('input[id="email"]') ||
    document.querySelector('input[name="email"]') ||
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[name="username"]') ||
    document.querySelector('input[name="userid"]') ||
    document.querySelector('input[name="login"]') ||
    document.querySelector('input[id="username"]') ||
    document.querySelector('input[id="userid"]') ||
    document.querySelector('input[autocomplete="username"]');

    const password_element: HTMLInputElement | null =
    document.querySelector('input[id="password"]') ||
    document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]') ||
    document.querySelector('input[autocomplete="password"]');
    let username_value = "";
    let password_value = "";

    const update_inputs = (e:Event)=>{
      username_value = username_element?.value ?? "";
      password_value = password_element?.value ?? "";
      const new_msg :Message<CurrentParams> = {
        key:PARAMS_UPDATED,
        body:{
          username:username_value,
          password:password_value,
          website:location.href
        }
      }
      
      chrome.runtime.sendMessage(new_msg)
    }
    password_element?.addEventListener("change", update_inputs);
    password_element?.addEventListener("focus", update_inputs);
    password_element?.addEventListener("keypress", update_inputs);
  username_element?.addEventListener("change", update_inputs);
  username_element?.addEventListener("focus", update_inputs);
  username_element?.addEventListener("keypress", update_inputs);
  if (!username_element) return;
  const input_height = username_element?.clientHeight;

  const drop_down_element = document.createElement("div");
  drop_down_element.innerHTML = `
    <div style="
    display:none;
    position:fixed;
    top:12%;
    left:4%;
    ">
     1. Facebook </div>`;
  if (!input_height) return;
  const drop_down_btn_element = document.createElement("div");
  drop_down_btn_element.innerHTML = `
    <div style="
    display:inline;
    position:fixed;
    top:4%;
    left:4%;
    background-color:white;
    -webkit-box-shadow: 10px 10px 88px -8px rgba(0,0,0,1);
    -moz-box-shadow: 10px 10px 88px -8px rgba(0,0,0,1);
    box-shadow: 10px 10px 88px -8px rgba(0,0,0,1);
     border-radius:12px;
     padding:8px;
     ">View login</div>`;
  username_element?.parentElement?.appendChild(drop_down_btn_element);
  username_element?.parentElement?.appendChild(drop_down_element);

  drop_down_btn_element.onclick = () => {
    const _ele = drop_down_element.firstElementChild as HTMLElement
    if ((_ele)?.style.display == "none")
    _ele.style.display = "block";
    else _ele.style.display = "none";
  };


};

window.onpopstate = function (event) {
    console.log("URL changed: " + document.location.href);
  };
window.onload = () => {
  setTimeout(on_load, 2000);
};