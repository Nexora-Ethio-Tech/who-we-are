const CHAT_COPY = {
  en: {
    toggle: "Nexora Help",
    title: "Nexora Help Desk",
    welcome:
      "Hi! I am the Nexora Help Desk. Ask about services, sectors, timeline, or how to start your project.",
    placeholder: "Ask about services, sectors, or timeline...",
    ariaOpen: "Open Nexora help",
    ariaClose: "Close help panel",
    ariaType: "Type your question",
    ariaSend: "Send message",
    typing: "Typing",
    quickBuild: "What can you build?",
    quickSectors: "What sectors do you serve?",
    quickPricing: "How much does it cost?",
    quickStart: "How do I start a project?",
    fallback:
      "I may have missed that. You can ask about capabilities, sectors, roadmap, governance, team, pricing, or timeline.",
    handoffPrefix: "Need a direct answer now?",
    handoffTelegram: "Chat on Telegram",
    handoffCall: "Call Us",
  },
  am: {
    toggle: "የNexora እገዛ",
    title: "የNexora እገዛ ማዕከል",
    welcome:
      "ሰላም! ይህ የNexora እገዛ ማዕከል ነው። ስለ አገልግሎት፣ ዘርፎች፣ ጊዜ ሰሌዳ ወይም ፕሮጀክት መጀመር ይጠይቁ።",
    placeholder: "ስለ አገልግሎት፣ ዘርፎች ወይም ጊዜ ሰሌዳ ይጠይቁ...",
    ariaOpen: "የNexora እገዛ ክፈት",
    ariaClose: "የእገዛ ፓነል ዝጋ",
    ariaType: "ጥያቄዎን ያስገቡ",
    ariaSend: "መልእክት ላክ",
    typing: "በመተየብ ላይ",
    quickBuild: "ምን ልትገነቡ ትችላላችሁ?",
    quickSectors: "የምትሰሩበት ዘርፍ ምንድን ነው?",
    quickPricing: "ዋጋው ስንት ነው?",
    quickStart: "ፕሮጀክት እንዴት እጀምር?",
    fallback:
      "ጥያቄዎን አልያዝኩትም። ስለ አቅም፣ ዘርፎች፣ እቅድ፣ አስተዳደር፣ ቡድን፣ ዋጋ ወይም ጊዜ ሰሌዳ ይጠይቁ።",
    handoffPrefix: "ፈጣን ምላሽ ይፈልጋሉ?",
    handoffTelegram: "በቴሌግራም ያነጋግሩ",
    handoffCall: "ይደውሉ",
  },
  om: {
    toggle: "Gargaarsa Nexora",
    title: "Teessoo Gargaarsa Nexora",
    welcome:
      "Akkam! Kun Teessoo Gargaarsa Nexora dha. Tajaajila, damee hojii, yeroon geessitootaa, yookiin pirojektii akkamitti jalqabnu gaafadhaa.",
    placeholder: "Tajaajila, damee hojii yookiin yeroo geessitootaa gaafadhaa...",
    ariaOpen: "Gargaarsa Nexora banuu",
    ariaClose: "Paanaalii gargaarsaa cufi",
    ariaType: "Gaaffii kee barreessi",
    ariaSend: "Ergi",
    typing: "Barreessaa jira",
    quickBuild: "Maal ijaaru dandeessu?",
    quickSectors: "Damee hojii kami tajaajiltu?",
    quickPricing: "Gatiin meeqa?",
    quickStart: "Pirojektii akkamitti jalqabna?",
    fallback:
      "Gaaffii kana sirriitti hin qabne. Dandeettii, damee hojii, karoora, bulchiinsa, garee, gatii yookiin yeroo geessitootaa gaafadhu.",
    handoffPrefix: "Deebii kallattiin barbaadda?",
    handoffTelegram: "Telegram irratti haasa'i",
    handoffCall: "Bilbili",
  },
};

function getChatCopy(language) {
  return CHAT_COPY[language] || CHAT_COPY.en;
}

const CHAT_LOG_STORAGE_KEY = "nexora-help-log";

function readChatLog() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHAT_LOG_STORAGE_KEY) || "{}");
    return {
      totalQuestions: Number(parsed.totalQuestions || 0),
      unknownQuestions: Number(parsed.unknownQuestions || 0),
      intents: parsed.intents && typeof parsed.intents === "object" ? parsed.intents : {},
      topUnknown: Array.isArray(parsed.topUnknown) ? parsed.topUnknown : [],
      lastSyncAt: parsed.lastSyncAt || "",
    };
  } catch {
    return {
      totalQuestions: 0,
      unknownQuestions: 0,
      intents: {},
      topUnknown: [],
      lastSyncAt: "",
    };
  }
}

function writeChatLog(log) {
  localStorage.setItem(CHAT_LOG_STORAGE_KEY, JSON.stringify(log));
}

function recordChatLog({ language, intent, input }) {
  const log = readChatLog();
  const key = `${language}:${intent}`;

  log.totalQuestions += 1;
  log.intents[key] = Number(log.intents[key] || 0) + 1;

  if (intent === "unknown") {
    log.unknownQuestions += 1;
    log.topUnknown.unshift({
      input: String(input || "").slice(0, 200),
      language,
      at: new Date().toISOString(),
    });
    log.topUnknown = log.topUnknown.slice(0, 20);
  }

  writeChatLog(log);
  return log;
}

function syncChatLog(profile, payload) {
  const endpoint = String(profile?.contact?.inquiryEndpoint || "").trim();
  if (!endpoint) {
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Non-blocking: local log still persists even if remote sync fails.
  });
}

function toPhoneHref(phone) {
  return `tel:${String(phone || "").replace(/\s+/g, "")}`;
}

function toTelegramHref(handle) {
  const clean = String(handle || "").replace(/^@/, "");
  return clean ? `https://t.me/${clean}` : "#";
}

function formatHandoff(phrase, profile, copy) {
  const primary = profile?.contact?.primary || {};
  const telegram = toTelegramHref(primary.telegram);
  const phone = toPhoneHref(primary.phone);

  return `${phrase} ${copy.handoffPrefix} <a href="${telegram}" target="_blank" rel="noopener noreferrer">${copy.handoffTelegram}</a> · <a href="${phone}">${copy.handoffCall}</a>`;
}

export function initAIChatWidget(profile = {}) {
  // Check if already initialized
  if (document.querySelector(".ai-chat-widget")) {
    return;
  }

  const language = profile.language || "en";
  const copy = getChatCopy(language);

  const widgetHTML = `
    <div class="ai-chat-widget">
      <button class="ai-chat-toggle" aria-label="${copy.ariaOpen}">
        <span class="chat-icon">💬</span>
        <span class="chat-label">${copy.toggle}</span>
      </button>

      <div class="ai-chat-panel">
        <div class="ai-chat-header">
          <h3>${copy.title}</h3>
          <button class="ai-chat-close" aria-label="${copy.ariaClose}">×</button>
        </div>

        <div class="ai-chat-messages">
          <div class="ai-message bot-message">
            <p>${copy.welcome}</p>
          </div>
        </div>

        <div class="ai-quick-prompts">
          <button class="quick-prompt" data-intent="capabilities">${copy.quickBuild}</button>
          <button class="quick-prompt" data-intent="sectors">${copy.quickSectors}</button>
          <button class="quick-prompt" data-intent="pricing">${copy.quickPricing}</button>
          <button class="quick-prompt" data-intent="contact">${copy.quickStart}</button>
        </div>

        <div class="ai-chat-input-wrap">
          <input 
            type="text" 
            class="ai-chat-input" 
            placeholder="${copy.placeholder}"
            aria-label="${copy.ariaType}"
          />
          <button class="ai-chat-send" aria-label="${copy.ariaSend}">
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
    typingMsg.innerHTML = `<p>${copy.typing}<span>.</span><span>.</span><span>.</span></p>`;
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

  const getIntent = (raw) => {
    const text = raw.toLowerCase().trim();

    const intentKeywords = {
      capabilities: [
        "capabil",
        "build",
        "service",
        "solution",
        "አቅም",
        "አገልግሎት",
        "dandeetti",
        "tajaajila",
      ],
      sectors: [
        "sector",
        "industry",
        "domain",
        "field",
        "ዘርፍ",
        "ዘርፎች",
        "damee",
      ],
      roadmap: [
        "roadmap",
        "phase",
        "timeline",
        "plan",
        "እቅድ",
        "ጊዜ",
        "karoora",
        "yeroo",
      ],
      governance: [
        "govern",
        "lead",
        "manager",
        "ownership",
        "አስተዳደር",
        "መሪ",
        "bulchi",
        "hoggan",
      ],
      team: ["team", "who", "office", "location", "ቡድን", "waajjira", "garee"],
      pricing: ["price", "cost", "budget", "quote", "ዋጋ", "በጀት", "gatii"],
      contact: [
        "contact",
        "project",
        "reach",
        "call",
        "telegram",
        "አግኙ",
        "ፕሮጀክት",
        "qunnam",
        "pirojek",
        "bilbil",
      ],
    };

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some((keyword) => text.includes(keyword))) {
        return intent;
      }
    }

    return "unknown";
  };

  const generateIntentResponse = (intent) => {
    const caps = (profile.capabilities || [])
      .map((item) => item.title)
      .filter(Boolean)
      .slice(0, 3)
      .join(", ");
    const sectors = Array.from(
      new Set((profile.caseStudies || []).map((item) => item.sector).filter(Boolean))
    ).join(", ");
    const roadmap = (profile.roadmap || [])
      .map((item) => `${item.phase}: ${item.title}`)
      .join(" | ");
    const office = profile.office || "Addis Ababa, Ethiopia";
    const gm = profile?.governance?.generalManager || "Nexora leadership";
    const dm = profile?.governance?.deputyManager || "";
    const leadership = dm ? `${gm} / ${dm}` : gm;

    const pricingRanges = {
      en: "Typical ranges: Starter MVP ($3k-$8k), Growth Platform ($8k-$25k), Enterprise Program (custom quote).",
      am: "መደበኛ የዋጋ ክልሎች፦ Starter MVP ($3k-$8k)፣ Growth Platform ($8k-$25k)፣ Enterprise Program (በልዩ ኮቴሽን)።",
      om: "Daangaa gatii idilee: Starter MVP ($3k-$8k), Growth Platform ($8k-$25k), Enterprise Program (quote addaa).",
    };

    const languageFallback = {
      en: {
        capabilities: `Our core services include: ${caps}.`,
        sectors: `We actively serve these sectors: ${sectors}.`,
        roadmap: `Our delivery path is: ${roadmap}.`,
        governance: `Leadership and governance are handled by ${leadership} with clear reporting and audit discipline.`,
        team: `Our team is based in ${office} and focused on enterprise-grade delivery.`,
        pricing:
          `Pricing depends on scope and timeline. ${pricingRanges.en} We usually begin with a short discovery call.`,
        contact: "Great, let us start your project.",
      },
      am: {
        capabilities: `ዋና አገልግሎቶቻችን፦ ${caps}።`,
        sectors: `በዚህ ዘርፎች በተለይ እንሰራለን፦ ${sectors}።`,
        roadmap: `የአቅርቦት መንገዳችን፦ ${roadmap}።`,
        governance: `መሪነት እና አስተዳደር በ ${leadership} በግልጽ ሪፖርት እና ኦዲት መርህ ይካሄዳል።`,
        team: `ቡድናችን በ${office} ይገኛል እና የኢንተርፕራይዝ ደረጃ መፍትሔ ላይ ይሰራል።`,
        pricing: `ዋጋ እንደ ስፋት እና ጊዜ ይለያያል። ${pricingRanges.am} አጭር የፍላጎት ውይይት በኋላ ግልጽ ኮቴሽን እናቀርባለን።`,
        contact: "ጥሩ፣ ፕሮጀክትዎን እንጀምር።",
      },
      om: {
        capabilities: `Tajaajilli keenya ijoo: ${caps}.`,
        sectors: `Damee hojii kana keessatti ni hojjenna: ${sectors}.`,
        roadmap: `Daandii geessitootaa keenya: ${roadmap}.`,
        governance: `Hoggansi fi bulchiinsi ${leadership} jalatti gabaasa ifaa fi oditii waliin geggeeffama.`,
        team: `Gareen keenya ${office} keessatti argama; geessitoota sadarkaa enterprise irratti hojjetu.`,
        pricing:
          `Gatiin akka bal'ina hojii fi yeroo irratti hundaa'a. ${pricingRanges.om} Walgahii gabaabaa erga taasifnee booda quote ifaa ni kennina.`,
        contact: "Gaarii, pirojektii keessan haa jalqabnu.",
      },
    };

    const langText = languageFallback[language] || languageFallback.en;

    if (intent === "contact") {
      return formatHandoff(langText.contact, profile, copy);
    }

    if (intent === "unknown") {
      return formatHandoff(copy.fallback, profile, copy);
    }

    return langText[intent] || formatHandoff(copy.fallback, profile, copy);
  };

  const generateResponse = (input) => {
    const intent = getIntent(input);
    const response = generateIntentResponse(intent);
    const latestLog = recordChatLog({ language, intent, input });

    syncChatLog(profile, {
      source: "nexora-help-widget",
      language,
      intent,
      input: String(input || "").slice(0, 400),
      totalQuestions: latestLog.totalQuestions,
      unknownQuestions: latestLog.unknownQuestions,
      timestamp: new Date().toISOString(),
    });

    return response;
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
      const intent = e.currentTarget.dataset.intent || "unknown";
      const botMsg = document.createElement("div");
      botMsg.className = "ai-message bot-message";
      botMsg.innerHTML = `<p>${generateIntentResponse(intent)}</p>`;
      messagesContainer.appendChild(botMsg);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      input.focus();
    });
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      toggleChat();
    }
  });
}
