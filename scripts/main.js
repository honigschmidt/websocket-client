const connectButton = document.querySelector("#btn_connect");
const sendButton = document.querySelector("#btn_send");
const disconnectButton = document.querySelector("#btn_disconnect");
const urlInput = document.querySelector("#input_url");
const messageInput = document.querySelector("#input_message");
const messageBox = document.querySelector("#messagebox");
const defaultUrl = "ws://localhost:8080";
var connection = null;

function main() {
    sendButton.disabled = true;
    disconnectButton.disabled = true;
    urlInput.setAttribute("placeholder", defaultUrl)
    connectButton.addEventListener("click", () => {
        if (urlInput.value == "") {
            connect(defaultUrl);
        } else {
            connect(urlInput.value);
        }
    })
    sendButton.addEventListener("click", () => {
        send();
    })
    disconnectButton.addEventListener("click", () => {
        disconnect();
    })
}

function connect(url) {
    let wsError = false;
    try {
        writeMessageBox(`[STATUS] Trying to connect to ${url}`);
        connection = new WebSocket(url);
    } catch (error) {
        console.log(error);
        writeMessageBox("[ERROR] Connection error, check console for details.")
    }

    connection.onopen = () => {
        connectButton.disabled = true;
        sendButton.disabled = false;
        disconnectButton.disabled = false; 
        writeMessageBox("[STATUS] Connection opened.");
    }

    connection.onmessage = (msg) => {
        writeMessageBox(`[RECEIVED] ${msg.data}`);
    }

    connection.onclose = () => {
        connectButton.disabled = false;
        sendButton.disabled = true;
        disconnectButton.disabled = true;
        if (!wsError) {
            writeMessageBox("[STATUS] Connection closed.");
        }
    }

    connection.onerror = () => {
        wsError = true;
        writeMessageBox("[ERROR] Connection error, check console for details.")
    }
}

function send() {
    connection.send(messageInput.value);
    writeMessageBox(`[SENT] ${messageInput.value}`)
}

function disconnect() {
    disconnectButton.disabled = true;
    connection.close();
}

function writeMessageBox(messageText) {
    messageBox.innerHTML += messageText + "<br />";
    messageBox.scrollTop = messageBox.scrollHeight;
}

window.addEventListener("DOMContentLoaded", main);