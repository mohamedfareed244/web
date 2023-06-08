document.getElementById("message-body").scrollTo(0, document.getElementById("message-body").scrollHeight);
const h = document.getElementById("custId").value;
const l = document.getElementById(h);
const s = l.children;
let g = s[1].children;
g[0].className = "ss";
g = s[2].children;
g[0].className = "ss";
var socket = io();
socket.on('connect', () => {
  console.log("socket id " + socket.id);
})

var form = document.getElementById("form");
var input = document.getElementById("input");

socket.on('recieve message', async (msg) => {
  console.log("i recived message with ", msg);
  sou1();
})

socket.on('recieve order', async (msg) => {
  displayalert("You have recieved a new order");
  console.log("recieve", msg);
  sou();

})

socket.on("require signin", () => {
  location.href = '/employees/signin';
})
socket.on("newcustomer", async (msg) => {

  sou1();
  console.log("the recieved one is ", msg.customer);
  let node = document.createElement("li");
  node.id = `${msg.customer._id}`;
  node.addEventListener('click', () => {
    location.href = `/employees/profile/chat/details/${msg.customer._id}`;
  })
  let node1 = document.createElement("img");
  node1.src = "/images/user-chat.png";
  node1.id = "user-chat";
  let node2 = document.createElement("span");
  node2.id = "Name";
  let node3 = document.createElement("strong");
  let tex = msg.customer.Firstname + " " + msg.customer.Middlename;
  node3.innerHTML = `${tex}`;
  let node4 = document.createElement("p");
  node4.id = "phone";
  let node5 = document.createElement("strong");
  node4.innerHTML = msg.customer.Phone;
  node2.appendChild(node3);
  node4.appendChild(node5);
  node.appendChild(node1);
  node.appendChild(node2);
  node.appendChild(node4);
  let par = document.getElementById("chat-list");

  par.appendChild(node);
})
socket.on("getmessage", async (msg) => {
  const tx1 = document.getElementsByClassName("ss")[0].innerHTML;
  const tx2 = document.getElementsByClassName("ss")[1].innerHTML;
  if (msg.from.name === tx1 && msg.from.phone === tx2) {
    console.log("msg from ", msg.from);
    let node = document.createElement("div");
    node.id = "msg1";
    let node1 = document.createElement("p");
    node.innerHTML = msg.body;
    node.appendChild(node1);
    document.getElementById("message-body").appendChild(node);
    document.getElementById("message-body").scrollTo(0, document.getElementById("message-body").scrollHeight);
  }

  sou1();
})

socket.on("cust_disconnect", (async (o) => {
  const eleme = document.getElementById(o.user._id);
  const par = document.getElementById("chat-list");
  if (document.getElementById("chat-list").childElementCount === 1) {
    document.getElementById("msg-box").style.display = "none";
    displayalert("the customer has end the chat this page will automatically change now ");
    setTimeout(chgloc, 3000);
  } else {

    const tx1 = document.getElementsByClassName("ss")[0].innerHTML;
    const tx2 = document.getElementsByClassName("ss")[1].innerHTML;
    const n = o.user.Firstname + " " + o.user.Middlename;
    if (n === tx1 && o.user.Phone === tx2) {
      const collection = document.getElementById("chat-list").children;
      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id !== o.user._id) {
          //event listener 


          document.getElementById("custId").value = `${collection[i].id}`;


          //event listener 
          collection[i].style = "background-color: rgb(90, 84, 84);";
          const search = collection[i].children;
          console.log("the childrens are ", search)

          for (let j = 0; j < search.length; j++) {
            if (search[j].tagName === "SPAN") {
              console.log("here ");
              const child = search[j].children;
              child[0].className = "ss";
            } else if (search[j].tagName === "P") {
              console.log("here ");
              const child = search[j].children;
              child[0].className = "ss";
            }
          }
          let newchat;
          await fetch(`/customers/admin/chat/changeuser/${collection[i].id}`, { method: 'GET' })
            .then((obj) => {
              return obj.json();
            })
            .then((obj) => {
              const e = document.getElementById("message-body");
              while (e.firstChild) {
                e.removeChild(e.lastChild);
              }
              console.log("the response i have recieve is ", obj);
              for (let i = 0; i < obj.length; i++) {
                if (!obj[i].issent) {
                  const t = `<div id="msg2">
<p id ="msg-body">${obj[i].msg}</p>
                </div>`
                  e.innerHTML += t;
                } else {
                  const t = `<div id="msg1">
<p id ="msg-body">${obj[i].msg}</p>
                </div>`
                  e.innerHTML += t;
                }
              }
            })

        }
      }
      displayalert("the previous customer has end the chat .");
    }
    par.removeChild(eleme);
  }
}))
function chgloc() {
  location.href = '/employees/profile';
}
async function sou() {

  let audio = document.getElementById("audio");
  audio.play().catch((err) => {
    console.log(err);
  })

}
async function sou1() {

  let audio = document.getElementById("audio1");
  audio.play().catch((err) => {
    console.log(err);
  })

}
async function sendmessage() {
  console.log("socket must be = ", socket);
  let msg = document.getElementById("msg-text").value;
  document.getElementById("msg-text").value = "";
  let node = document.createElement("div");
  node.id = "msg2";
  let node1 = document.createElement("p");
  node1.innerHTML = msg;
  node1.id = "msg-body";
  node.appendChild(node1);
  document.getElementById("message-body").appendChild(node);
  console.log("the value us ", msg);
  let x = document.getElementById("custId").value;
  socket.emit("sendtocustomer", ({ "body": msg, "id": x }));
  document.getElementById("message-body").scrollTo(0, document.getElementById("message-body").scrollHeight);
}
async function displayalert(text) {
  document.getElementById("almsg").style.display="block";
  document.getElementById("almsg").innerHTML = `${text}`
 setTimeout(hidealert,3000);

}
async function hidealert() {
  document.getElementById("alylert").style.display= "none";

}
//formated
