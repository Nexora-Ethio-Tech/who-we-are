import { companyProfile } from "./data/content.js";

const form = document.querySelector("#inquiry-form");
const status = document.querySelector("#inquiry-status");
const loadedAtInput = document.querySelector("#loaded-at");

if (!form || !status) {
  throw new Error("Inquiry form elements not found.");
}

const targetEmail = companyProfile.contact.inboxEmail || "yonasayeletola@gmail.com";
const inquiryEndpoint = String(companyProfile.contact.inquiryEndpoint || "").trim();

if (loadedAtInput) {
  loadedAtInput.value = String(Date.now());
}

function buildMailto(name, email, organization, subject, message) {
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization: ${organization || "N/A"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  return `mailto:${encodeURIComponent(targetEmail)}?subject=${encodeURIComponent(
    `[Website] ${subject}`
  )}&body=${encodeURIComponent(body)}`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const organization = String(data.get("organization") || "").trim();
  const subject = String(data.get("subject") || "Project Inquiry").trim();
  const message = String(data.get("message") || "").trim();
  const honeypot = String(data.get("company_website") || "").trim();
  const loadedAt = Number(data.get("loaded_at") || 0);

  if (honeypot) {
    status.textContent = "Submission blocked.";
    return;
  }

  if (Date.now() - loadedAt < 1800) {
    status.textContent = "Please wait a moment and submit again.";
    return;
  }

  const payload = {
    name,
    email,
    organization,
    subject,
    message,
    source: "website-work-with-us",
  };

  if (inquiryEndpoint) {
    status.textContent = "Sending inquiry...";

    fetch(inquiryEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Submission failed");
        }

        status.textContent = "Inquiry sent successfully. We will get back to you soon.";
        form.reset();
        if (loadedAtInput) {
          loadedAtInput.value = String(Date.now());
        }
      })
      .catch(() => {
        status.textContent = "Direct send failed. Opening your email app instead...";
        window.location.href = buildMailto(name, email, organization, subject, message);
      });

    return;
  }

  window.location.href = buildMailto(name, email, organization, subject, message);
  status.textContent = `If your email app did not open, email us directly at ${targetEmail}.`;
});
