console.log("TONY SCRIPT LOADED");


import { Conversation } from "@elevenlabs/client";

const talkButton = document.getElementById("talkButton");
const buttonText = document.getElementById("buttonText");
const helper = document.getElementById("helper");
const voiceIcon = document.getElementById("voiceIcon");

let conversation = null;
let connecting = false;

async function startTony() {
  if (connecting) return;

  // If Tony is already connected, tapping again ends the call.
  if (conversation) {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error(error);
    }

    conversation = null;
    resetButton();
    return;
  }

  try {
    connecting = true;

    buttonText.textContent = "Connecting...";
    helper.textContent = "Allow microphone access if prompted";
    talkButton.classList.add("active");

    // Ask for microphone permission.
    await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    conversation = await Conversation.startSession({
      agentId: "agent_4501k7xa0jn2fgkrvnrtfwwst6hq",

      onConnect: () => {
        connecting = false;

        buttonText.textContent = "Tony is listening";
        helper.textContent = "Tap again to end conversation";

        talkButton.classList.add("connected");
      },

      onDisconnect: () => {
        connecting = false;
        conversation = null;
        resetButton();
      },

      onModeChange: (mode) => {
        if (!conversation) return;

        if (mode.mode === "speaking") {
          buttonText.textContent = "Tony is speaking";
          voiceIcon.textContent = "◉";

          talkButton.classList.add("speaking");
        } else {
          buttonText.textContent = "Tony is listening";
          voiceIcon.textContent = "●";

          talkButton.classList.remove("speaking");
        }
      },

      onError: (error) => {
        console.error("Tony error:", error);

        connecting = false;
        conversation = null;

        buttonText.textContent = "Try again";
        helper.textContent = "Couldn't connect to Tony";

        talkButton.classList.remove(
          "active",
          "connected",
          "speaking"
        );
      },
    });
  } catch (error) {
    console.error("Failed to start Tony:", error);

    connecting = false;
    conversation = null;

    buttonText.textContent = "Talk to Tony";
    helper.textContent =
      "Microphone access is required to talk to Tony";

    talkButton.classList.remove(
      "active",
      "connected",
      "speaking"
    );
  }
}

function resetButton() {
  buttonText.textContent = "Talk to Tony";
  voiceIcon.textContent = "☎";
  helper.textContent = "Tap to start a voice conversation";

  talkButton.classList.remove(
    "active",
    "connected",
    "speaking"
  );
}

talkButton.addEventListener("click", startTony);