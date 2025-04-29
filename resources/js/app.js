// // resources/js/app.js

// import './bootstrap';
// import Alpine from 'alpinejs';
// window.Alpine = Alpine;
// Alpine.start();

// import { CometChat } from "@cometchat-pro/chat";


// const appID = import.meta.env.VITE_COMETCHAT_APP_ID;
// const region = import.meta.env.VITE_COMETCHAT_REGION;
// const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;


// const appSetting = new CometChat.AppSettingsBuilder()
//     .subscribePresenceForAllUsers()
//     .setRegion(region)
//     .build();

// CometChat.init(appID, appSetting).then(() => {
//     console.log("CometChat initialized");

//     if (window.Laravel?.user?.id) {
//         CometChat.login(window.Laravel.user.id.toString(), authKey).then(
//             user => {
//                 console.log("Logged into CometChat", user);

//                 const lastChatUser = localStorage.getItem('lastChatUser');
//                 if (lastChatUser) {
//                     const chatUser = JSON.parse(lastChatUser);
//                     startChat(chatUser.id, chatUser.name);
//                 }

//                 CometChat.getConversationList().then(conversations => {
//                     conversations.forEach(convo => {
//                         const userElement = document.querySelector(`[data-user-id='${convo.conversationWith.uid}']`);
//                         if (userElement && convo.unreadMessageCount > 0) {
//                             const badge = document.createElement("span");
//                             badge.className = "bg-red-500 text-white text-xs rounded-full px-2 ml-2";
//                             badge.innerText = convo.unreadMessageCount;
//                             userElement.appendChild(badge);
//                         }
//                     });
//                 });
                
//             },
//             error => console.error("CometChat login failed", error)
//         );
//     }
// }, error => {
//     console.log("CometChat initialization failed", error);
// });

// function formatTime(timestamp) {
//     const date = new Date(timestamp * 1000);
//     return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }

// window.startChat = function(receiverId, receiverName) {
//     window.currentChatUser = receiverId;
//     localStorage.setItem('lastChatUser', JSON.stringify({ id: receiverId, name: receiverName }));

//     const chatWith = document.getElementById('chat-with');
//     const chatBox = document.getElementById('chat-box');
//     if (chatWith) chatWith.innerText = `Chat with ${receiverName}`;
//     if (chatBox) chatBox.innerHTML = '';

//     window.loadMessages(receiverId);
// };

// window.loadMessages = function(receiverId) {
//     const messageRequest = new CometChat.MessagesRequestBuilder()
//         .setUID(receiverId)
//         .setLimit(30)
//         .build();

//     messageRequest.fetchPrevious().then(messages => {
//         const chatBox = document.getElementById("chat-box");
//         messages.forEach(msg => {
//             const div = document.createElement("div");
//             div.innerText = `${msg.sender.name} (${formatTime(msg.sentAt)}): ${msg.text}`;
//             if (chatBox) chatBox.appendChild(div);
//         });
//     });
// };

// document.addEventListener('DOMContentLoaded', function () {
//     const input = document.getElementById('chat-input');
//     if (input) {
//         input.addEventListener('keypress', function (e) {
//             if (e.key === 'Enter' && window.currentChatUser) {
//                 const text = e.target.value;
//                 const message = new CometChat.TextMessage(
//                     window.currentChatUser,
//                     text,
//                     CometChat.RECEIVER_TYPE.USER
//                 );

//                 CometChat.sendMessage(message).then(msg => {
//                     const div = document.createElement("div");
//                     div.innerText = `You (${formatTime(msg.sentAt)}): ${msg.text}`;
//                     const chatBox = document.getElementById("chat-box");
//                     if (chatBox) chatBox.appendChild(div);
//                     e.target.value = '';
//                 });
//             }
//         });
//     }
// });

// CometChat.addMessageListener(
//     "msg-listener",
//     new CometChat.MessageListener({
//         onTextMessageReceived: message => {
//             if (message.sender.uid === window.currentChatUser) {
//                 const div = document.createElement("div");
//                 div.innerText = `${message.sender.name} (${formatTime(message.sentAt)}): ${message.text}`;
//                 const chatBox = document.getElementById("chat-box");
//                 if (chatBox) chatBox.appendChild(div);
//             } else {
//                 const notify = document.getElementById('chat-notification');
//                 if (notify) notify.classList.remove('hidden');
//             }
//         }
//     })
// );
