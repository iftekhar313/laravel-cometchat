import './bootstrap';
import Alpine from 'alpinejs';
window.Alpine = Alpine;
Alpine.start();

import { CometChat } from "@cometchat-pro/chat";


const appID = import.meta.env.VITE_COMETCHAT_APP_ID;
const region = import.meta.env.VITE_COMETCHAT_REGION;
const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;


const appSetting = new CometChat.AppSettingsBuilder()
    .subscribePresenceForAllUsers()
    .setRegion(region)
    .build();

CometChat.init(appID, appSetting).then(() => {
    console.log("CometChat initialized");

    if (window.Laravel?.user?.id) {
        CometChat.login(
            window.Laravel.user.id.toString(),
            authKey
        ).then(
            user => console.log("Logged into CometChat", user),
            error => console.error("CometChat login failed", error)
        );
    }
}, error => {
    console.log("CometChat initialization failed", error);
});

window.startChat = function(receiverId, receiverName) {
    window.currentChatUser = receiverId;
    const chatWith = document.getElementById('chat-with');
    const chatBox = document.getElementById('chat-box');
    
    if (chatWith) chatWith.innerText = `Chat with ${receiverName}`;
    if (chatBox) chatBox.innerHTML = '';

    window.loadMessages(receiverId);
};

window.loadMessages = function(receiverId) {
    const messageRequest = new CometChat.MessagesRequestBuilder()
        .setUID(receiverId)
        .setLimit(30)
        .build();

    messageRequest.fetchPrevious().then(messages => {
        const chatBox = document.getElementById("chat-box");
        messages.forEach(msg => {
            const div = document.createElement("div");
            div.innerText = msg.sender.name + ": " + msg.text;
            if (chatBox) chatBox.appendChild(div);
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && window.currentChatUser) {
                const text = e.target.value;
                const message = new CometChat.TextMessage(
                    window.currentChatUser,
                    text,
                    CometChat.RECEIVER_TYPE.USER
                );

                CometChat.sendMessage(message).then(msg => {
                    const div = document.createElement("div");
                    div.innerText = "You: " + msg.text;
                    const chatBox = document.getElementById("chat-box");
                    if (chatBox) chatBox.appendChild(div);
                    e.target.value = '';
                });
            }
        });
    }
});

CometChat.addMessageListener(
    "msg-listener",
    new CometChat.MessageListener({
        onTextMessageReceived: message => {
            if (message.sender.uid === window.currentChatUser) {
                const div = document.createElement("div");
                div.innerText = message.sender.name + ": " + message.text;
                const chatBox = document.getElementById("chat-box");
                if (chatBox) chatBox.appendChild(div);
            }
        }
    })
);
