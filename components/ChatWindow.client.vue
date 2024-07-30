<script setup lang="ts">
// TODO check if prod then use wss
const isSecure = location.protocol === "https:";
const url = (isSecure ? "wss://" : "ws://") + location.host + "/api/chat";
const { status, data, send, open, close } = useWebSocket(url, {
  autoReconnect: true,
});

const userId = crypto.randomUUID();
const messages = ref<any[]>([]);

const message = ref("");
function sendMessage() {
  const messageObject = { user: userId, text: message.value };
  send(JSON.stringify(messageObject));
  messages.value.push(messageObject);
  message.value = "";
  scrollToLatestMessage();
}

watch(data, (newValue) => {
  console.log(newValue);
  if (newValue) {
    messages.value.push(JSON.parse(newValue));
    scrollToLatestMessage();
  }
  // Clear so sending the same message again will work
  data.value = undefined;
});

function keydownHandler(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    sendMessage();
    event.preventDefault();
  }
}

function scrollToLatestMessage() {
  nextTick(() => {
    const latestMessage = document.querySelector(".message:last-child");
    latestMessage?.scrollIntoView({ behavior: "smooth" });
  });
}
</script>

<template>
  <div class="flex flex-col items-stretch gap-3">
    <div class="flex-1 relative">
      <div class="h-full w-full absolute overflow-y-auto">
        <template v-for="(message, index) in messages" :key="index">
          <div
            class="message flex"
            :class="{ 'justify-end': message.user === userId }"
          >
            <div
              class="p-2 m-2 rounded-lg bg-primary whitespace-pre-wrap"
              :class="{
                'bg-secondary': message.user !== userId,
                'rounded-bl-none': message.user !== userId,
                'rounded-br-none': message.user === userId,
              }"
            >
              {{ message.text }}
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <Textarea
        v-model="message"
        auto-resize
        rows="1"
        class="flex-1"
        @keydown="keydownHandler"
      ></Textarea>
      <Button @click="sendMessage">
        <FontAwesomeIcon icon="fa-solid fa-paper-plane" size="lg" />
      </Button>
    </div>
  </div>
</template>

<style scoped></style>
