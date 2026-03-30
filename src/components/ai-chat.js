export function initAIChatWidget() {
  // Check if already initialized
  if (document.querySelector(".ai-chat-widget")) {
    return;
  }

  const widgetHTML = `
    <div class="ai-chat-widget">
      <button class="ai-chat-toggle" aria-label="Open AI chat assistant">
        <span class="chat-icon">💬</span>
        <span class="chat-label">Ask Nexora</span>
      </button>

      <div class="ai-chat-panel">
        <div class="ai-chat-header">
          <h3>Nexora Assistant</h3>
          <button class="ai-chat-close" aria-label="Close chat">×</button>
        </div>

        <div class="ai-chat-messages">
          <div class="ai-message bot-message">
            <p>Hello! I'm the Nexora Assistant. Ask me about our services, capabilities, or how we can help your organization. 👋</p>
          </div>
        </div>

        <div class="ai-quick-prompts">
          <button class="quick-prompt" data-prompt="Tell me about your capabilities">What can you build?</button>
          <button class="quick-prompt" data-prompt="What sectors do you serve?">What sectors?</button>
          <button class="quick-prompt" data-prompt="How can I contact you for a project?">Start a project</button>
        </div>

        <div class="ai-chat-input-wrap">
          <input 
            type="text" 
            class="ai-chat-input" 
            placeholder="Ask anything..."
            aria-label="Type your message"
          />
          <button class="ai-chat-send" aria-label="Send message">
            <span>⚡</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", widgetHTML);

  // Initialize widget interactions
  const toggle = document.querySelector(".ai-chat-toggle");
  const panel = document.querySelector(".ai-chat-panel");
  const closeBtn = document.querySelector(".ai-chat-close");
  const input = document.querySelector(".ai-chat-input");
  const sendBtn = document.querySelector(".ai-chat-send");
  const quickPrompts = document.querySelectorAll(".quick-prompt");
  const messagesContainer = document.querySelector(".ai-chat-messages");

  let isOpen = false;

  const toggleChat = () => {
    isOpen = !isOpen;
    toggle.classList.toggle("is-active");
    panel.classList.toggle("is-open");
    if (isOpen) {
      input.focus();
    }
  };

  const sendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    // Add user message
    const userMsg = document.createElement("div");
    userMsg.className = "ai-message user-message";
    userMsg.innerHTML = `<p>${escapeHtml(userInput)}</p>`;
    messagesContainer.appendChild(userMsg);

    // Clear input
    input.value = "";

    // Show typing indicator
    const typingMsg = document.createElement("div");
    typingMsg.className = "ai-message bot-message typing";
    typingMsg.innerHTML = `<p>Typing<span>.</span><span>.</span><span>.</span></p>`;
    messagesContainer.appendChild(typingMsg);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate API call (replace with real API)
    setTimeout(() => {
      typingMsg.remove();

      const botResponse = generateResponse(userInput);
      const botMsg = document.createElement("div");
      botMsg.className = "ai-message bot-message";
      botMsg.innerHTML = `<p>${botResponse}</p>`;
      messagesContainer.appendChild(botMsg);

      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200 + Math.random() * 800);
  };

  const generateResponse = (input) => {
    const lowerInput = input.toLowerCase();

    const responses = {
      capabilities: "We specialize in **Product Engineering** (mobile, web, cloud), **AI & Data Systems** (ML models, analytics), and **Digital Transformation** (consulting, architecture). What sector interests you?",
      sectors: "We serve **Healthcare** (patient platforms), **Banking** (compliance systems), **Education** (learning management), and **Startups** (MVP to enterprise). Which one is relevant?",
      contact: "Great! You can reach us via **Telegram** (@JYAT6200 or @valerioE), call (+251900011767 or +251965758511), or visit our **Contact** section. Let's build something amazing!",
      governance: "Nexora is led by **Ato Haile Debele Baysa** (GM) and **Ato Yonas Ayele Tola** (Deputy). We operate with transparent governance and certified audits.",
      roadmap: "Our journey: **Phase 1** - Build foundation & flagship services | **Phase 2** - Scale AI/data & partnerships | **Phase 3** - Regional impact & expansion.",
      team: "We're a team of experienced engineers and strategists based in **Addis Ababa, Ethiopia**, dedicated to building enterprise-grade software.",
    };

    // Check keywords
    if (lowerInput.includes("capabilit") || lowerInput.includes("build")) {
      return responses.capabilities;
    } else if (lowerInput.includes("sector") || lowerInput.includes("industry")) {
      return responses.sectors;
    } else if (lowerInput.includes("contact") || lowerInput.includes("project") || lowerInput.includes("reach")) {
      return responses.contact;
    } else if (lowerInput.includes("governance") || lowerInput.includes("leadership") || lowerInput.includes("manager")) {
      return responses.governance;
    } else if (lowerInput.includes("roadmap") || lowerInput.includes("phase") || lowerInput.includes("plan")) {
      return responses.roadmap;
    } else if (lowerInput.includes("team") || lowerInput.includes("who")) {
      return responses.team;
    } else {
      return "Good question! Feel free to ask about our **capabilities**, **sectors**, **team**, **governance**, **roadmap**, or how to **contact us**. What would you like to know?";
    }
  };

  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  // Event listeners
  toggle.addEventListener("click", toggleChat);
  closeBtn.addEventListener("click", toggleChat);

  sendBtn.addEventListener("click", () => {
    sendMessage(input.value);
  });

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  quickPrompts.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const prompt = e.target.dataset.prompt;
      input.value = prompt;
      input.focus();
      // Optionally auto-send
      // sendMessage(prompt);
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      toggleChat();
    }
  });
}
