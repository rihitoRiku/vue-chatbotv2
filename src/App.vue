<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { CohereClientV2 } from "cohere-ai"; // Import Cohere SDK
import { ref } from "vue"; // Import Vue's reactive ref
</script>

<template>
  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" /> -->
  <div class="">
    <div
      class="min-h-screen max-w-screen-lg px-4 mx-auto flex flex-col justify-between items-center"
    >
      <!--  -->
      <div class="w-full" id="app">
        <div
          class="max-w-[44rem] w-full mx-auto p-2 lg:p-4 h-screen overflow-hidden relative"
        >
          <!-- Header section with updated description -->
          <div class="text-center mt-6 lg:mt-12">
            <h1 class="text-3xl lg:text-5xl mb-4 lg:mb-6">AI ChatBot</h1>
            <h3 class="text-base lg:text-lg mb-8">
              Developed by RihitoRiku. Built with Vue, Vite, and Tailwind.
              Powered by Cohere's Command-R-08-2024 language model, this
              interactive chatbot allows users to engage in natural
              conversations. The application features a dynamic chat interface,
              with real-time responses from the AI and a simple yet efficient
              design.
            </h3>
          </div>

          <!-- Chat container with scrollable messages -->
          <div
            class="p-4 h-full overflow-y-scroll mb-4 space-y-8 pb-96 scroll-container"
            ref="chatBox"
          >
            <div
              v-for="(message, index) in messages"
              :key="index"
              class="flex items-end"
            >
              <!-- User's message bubble on the right -->
              <div
                v-if="message.sender === 'You'"
                class="ml-auto max-w-xs flex items-start justify-start space-x-2"
              >
                <div
                  class="px-4 py-2 bg-blue-500 text-white rounded-lg rounded-tr-none"
                >
                  <span>{{ message.text }}</span>
                </div>
                <!-- User's avatar -->
                <v-icon name="fa-user" scale="1.6" />
              </div>

              <!-- Bot's message bubble on the left -->
              <div
                v-else
                class="max-w-md flex items-start justify-start space-x-2"
              >
                <!-- Bot's avatar -->
                <img
                  src="/chatgpt.svg"
                  alt="Bot Avatar"
                  class="w-10 h-10 rounded-full"
                />
                <div
                  class="px-4 py-2 bg-gray-300 text-black rounded-lg rounded-tl-none"
                >
                  <span>{{ message.text }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Input field and Send button -->
          <div class="w-full bg-white absolute left-0 bottom-0 pb-6 lg:pb-12">
            <div
              class="bg-white max-w-[44rem] w-full flex p-2 space-x-2 border rounded-xl"
            >
              <input
                v-model="userMessage"
                @keyup.enter="sendMessage"
                class="w-full ps-4 rounded outline-none"
                placeholder="Type a message..."
              />
              <button
                @click="sendMessage"
                class="py-2 px-6 bg-green-400 text-white rounded-full hover:bg-green-500"
              >
                <v-icon name="ri-send-plane-fill" scale="1.2" hover />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      userMessage: "", // User's input message
      messages: [], // Messages array to store conversation
      cohere: null, // Cohere client instance
      loading: false, // Flag to track loading state for response
    };
  },
  created() {
    // Initialize Cohere client when the component is created
    const apiKey = import.meta.env.VITE_COHERE_API_KEY;
    this.cohere = new CohereClientV2({
      token: apiKey, // Replace with your actual Cohere API key
    });
  },
  methods: {
    async sendMessage() {
      if (!this.userMessage.trim()) return; // Prevent sending empty messages

      // Add user message to the chat history
      this.messages.push({ sender: "You", text: this.userMessage });

      // Add the loading bubble for bot's response
      this.messages.push({ sender: "Bot", text: "(bot is thinking...)" });
      this.loading = true; // Set loading state to true

      // Clear the input field
      const userInput = this.userMessage;
      this.userMessage = "";

      try {
        // Send the entire chat history to Cohere's API
        const response = await this.cohere.chat({
          model: "command-r-08-2024",
          messages: this.messages.map((message) => ({
            role: message.sender === "You" ? "user" : "assistant",
            content: message.text,
          })),
        });

        if (response && response.message && response.message.content) {
          const botMessage = response.message.content[0].text.trim();

          // Remove the "bot is thinking..." message and initiate typewriter effect
          this.messages.pop(); // Remove the "bot is thinking..." message
          await this.typeWriterEffect(botMessage);
        } else {
          console.error("Unexpected response format:", response);
        }
      } catch (error) {
        console.error("Error while fetching Cohere response:", error);
      } finally {
        this.loading = false; // Reset loading state
      }
    },

    async typeWriterEffect(text) {
      // Add the bot's response as an empty message (for typing effect)
      const targetMessageIndex = this.messages.length; // Get the index for the new message
      this.messages.push({ sender: "Bot", text: "" }); // Add an empty bot message

      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          this.messages[targetMessageIndex].text += text[i];
          i++;
        } else {
          clearInterval(typingInterval); // Stop typing effect when done
        }
      }, 10); // Adjust typing speed (in ms per character)
    },

    clearChat() {
      this.messages = [];
    },

    logMessage() {
      console.log(this.messages);
    },
  },
};
</script>

<style scoped>
/* Hide scrollbar but keep scrolling functionality */
.scroll-container {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

/* Webkit browsers (Chrome, Safari) */
.scroll-container::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* Hide the scrollbar */
}
.scroll-container::-webkit-scrollbar-thumb {
  background: transparent; /* Invisible scrollbar thumb */
}
</style>
