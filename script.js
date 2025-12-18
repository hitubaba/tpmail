const genBtn = document.getElementById("genBtn");
const checkBtn = document.getElementById("checkBtn");
const emailSection = document.getElementById("emailSection");
const tempEmailEl = document.getElementById("tempEmail");
const inboxEl = document.getElementById("inbox");

let currentEmail = "";

genBtn.addEventListener("click", () => {
  fetch("https://www.1secmail.com/api/v1/?action=genRandomMailbox&count=1")
    .then(res => res.json())
    .then(data => {
      currentEmail = data[0];
      tempEmailEl.textContent = currentEmail;
      emailSection.classList.remove("hidden");
      inboxEl.innerHTML = "";
    })
    .catch(err => {
      alert("Error generating email. Try again!");
      console.error(err);
    });
});

checkBtn.addEventListener("click", () => {
  if (!currentEmail) return;

  const [login, domain] = currentEmail.split("@");
  const url = `https://www.1secmail.com/api/v1/?action=getMessages&login=${login}&domain=${domain}`;

  fetch(url)
    .then(res => res.json())
    .then(showEmails)
    .catch(err => {
      inboxEl.innerHTML = "Error loading inbox.";
      console.error(err);
    });
});

function showEmails(emails) {
  if (emails.length === 0) {
    inboxEl.innerHTML = "<p>No messages yet.</p>";
    return;
  }

  inboxEl.innerHTML = "";
  emails.forEach(msg => {
    const msgEl = document.createElement("div");
    msgEl.classList.add("email");
    msgEl.innerHTML = `
      <p><strong>From:</strong> ${msg.from}</p>
      <p><strong>Subject:</strong> ${msg.subject}</p>
      <p><small>${msg.date}</small></p>
      <hr>
    `;
    inboxEl.appendChild(msgEl);
  });
}
