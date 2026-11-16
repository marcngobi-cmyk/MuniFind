const STORAGE_KEY = "munifind-reports-v1";
const today = new Date();
const dateInput = document.getElementById("reportDate");
dateInput.max = today.toISOString().slice(0, 10);
dateInput.value = today.toISOString().slice(0, 10);
document.getElementById("todayLabel").textContent = today.toLocaleDateString("en-UG", {day:"numeric",month:"short",year:"numeric"});

const seedItems = [
 {id:"MF-2026-001",name:"Black HP laptop",type:"Found",category:"Electronics",location:"ICT Laboratory",date:"2026-11-14",colour:"Black",description:"Black HP laptop found on a desk after the afternoon practical session.",status:"Found",daysHeld:1,icon:"💻",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-002",name:"Blue water bottle",type:"Lost",category:"Accessories",location:"Sports Grounds",date:"2026-11-13",colour:"Blue",description:"Reusable blue bottle with a silver cap. May have been left near the football pitch.",status:"Lost",daysHeld:0,icon:"🧴",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-003",name:"Student notebook",type:"Found",category:"Documents",location:"Main Library",date:"2026-11-12",colour:"Green cover",description:"Green-covered ruled notebook found on a reading table. Owner should identify the contents.",status:"Found",daysHeld:3,icon:"📓",image:"https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-004",name:"Silver wristwatch",type:"Lost",category:"Accessories",location:"Lecture Block",date:"2026-11-12",colour:"Silver",description:"Silver wristwatch with a dark face. Possibly misplaced between lecture rooms.",status:"Lost",daysHeld:0,icon:"⌚",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-005",name:"Set of keys",type:"Found",category:"Keys",location:"Students' Hostel",date:"2026-11-10",colour:"Two keys, red tag",description:"Two metal keys attached to a small red key tag, handed in for safe keeping.",status:"Found",daysHeld:5,icon:"🔑",image:"https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-006",name:"Black hoodie",type:"Lost",category:"Clothing",location:"Dining Hall",date:"2026-11-09",colour:"Black",description:"Plain black hoodie possibly left on a chair near the dining hall entrance.",status:"Lost",daysHeld:0,icon:"🧥",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-007",name:"USB flash drive",type:"Found",category:"Electronics",location:"Administration Block",date:"2026-11-08",colour:"Red and black",description:"Small red-and-black USB flash drive found outside the administration offices.",status:"Returned",daysHeld:0,icon:"💾",image:"https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=700&q=80"},
 {id:"MF-2026-008",name:"National ID holder",type:"Found",category:"Documents",location:"Lecture Block",date:"2026-11-07",colour:"Brown leather",description:"Brown card holder found near the lecture block. Sensitive details are not displayed.",status:"Returned",daysHeld:0,icon:"🪪",image:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80"}
];

let userReports = loadReports();
let allItems = [...userReports, ...seedItems];
let selectedImage = "";
let toastTimer;

function loadReports() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch (error) { return []; }
}
function saveReports() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userReports));
}
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function formatDate(value) {
  if (!value) return "Date not set";
  return new Date(value + "T00:00:00").toLocaleDateString("en-UG",{day:"numeric",month:"short",year:"numeric"});
}
function daysSince(dateValue) {
  const start = new Date(dateValue + "T00:00:00");
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.max(0, Math.floor((now - start) / 86400000));
}
function updateStats() {
  document.getElementById("totalCount").textContent = allItems.length;
  document.getElementById("waitingCount").textContent = allItems.filter(item => item.status === "Found").length;
  document.getElementById("returnedCount").textContent = allItems.filter(item => item.status === "Returned").length;
}
function renderItems() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const category = document.getElementById("categoryFilter").value;
  const location = document.getElementById("locationFilter").value;
  const status = document.getElementById("statusFilter").value;
  const sort = document.getElementById("sortSelect").value;
  let filtered = allItems.filter(item => {
    const searchable = [item.name,item.description,item.id,item.colour,item.category,item.location].join(" ").toLowerCase();
    return (!keyword || searchable.includes(keyword)) && (!category || item.category === category) && (!location || item.location === location) && (!status || item.status === status);
  });
  filtered.sort((a,b) => sort === "az" ? a.name.localeCompare(b.name) : sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  document.getElementById("resultCount").textContent = `Showing ${filtered.length} of ${allItems.length} items`;
  document.getElementById("itemsGrid").innerHTML = filtered.map(item => {
    const statusClass = item.status.toLowerCase();
    const photo = item.image ? `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=&quot;photo-placeholder&quot;>${escapeHTML(item.icon || "📦")}</div>'">` : `<div class="photo-placeholder">${escapeHTML(item.icon || "📦")}</div>`;
    return `<article class="item-card"><div class="item-photo">${photo}<span class="status-pill ${statusClass}">${escapeHTML(item.status)}</span></div><div class="item-body"><div class="item-category">${escapeHTML(item.category)}</div><h3 title="${escapeHTML(item.name)}">${escapeHTML(item.name)}</h3><p class="item-desc">${escapeHTML(item.description)}</p><div class="item-meta"><span>⌖ ${escapeHTML(item.location)}</span><span>${formatDate(item.date)}</span></div><div class="item-actions"><button class="small-action" data-details="${escapeHTML(item.id)}">View details</button>${item.status === "Found" ? `<button class="small-action" data-claim="${escapeHTML(item.id)}">Claim item</button>` : ""}</div></div></article>`;
  }).join("");
  document.getElementById("emptyState").classList.toggle("hidden", filtered.length !== 0);
  document.getElementById("itemsGrid").classList.toggle("hidden", filtered.length === 0);
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}
function setView(view) {
  document.querySelectorAll(".view").forEach(section => section.classList.remove("active-view"));
  document.getElementById(`${view}View`).classList.add("active-view");
  document.querySelectorAll(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.view === view));
  document.getElementById("breadcrumbCurrent").textContent = view === "home" ? "Home" : view === "report" ? "Report an item" : "Claim tracker";
  document.getElementById("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
function generateReference() {
  const year = new Date().getFullYear();
  const existingNumbers = allItems.map(item => Number((item.id.match(/(\d+)$/) || [0,0])[1]));
  const next = Math.max(0,...existingNumbers) + 1;
  return `MF-${year}-${String(next).padStart(3,"0")}`;
}
function showFormMessage(element, message, kind) {
  element.textContent = message; element.className = `form-message ${kind}`;
}
function suggestMatches(newItem) {
  return allItems.filter(item => item.status !== "Returned" && item.id !== newItem.id &&
    (item.category === newItem.category || item.location === newItem.location) &&
    (item.type !== newItem.type || item.status !== newItem.status)).slice(0,3);
}
function renderClaim(item) {
  const container = document.getElementById("claimResult");
  const statusClass = item.status.toLowerCase();
  const held = item.status === "Found" ? daysSince(item.date) : 0;
  const possible = suggestMatches(item);
  container.innerHTML = `<div class="result-header"><div><span class="result-ref">REFERENCE ${escapeHTML(item.id)}</span><h3>${escapeHTML(item.name)}</h3><span class="detail-label">${escapeHTML(item.category)} • ${escapeHTML(item.location)}</span></div><span class="result-status ${statusClass}">${escapeHTML(item.status)}</span></div><div class="result-details"><div><span class="detail-label">Report date</span><span class="detail-value">${formatDate(item.date)}</span></div><div><span class="detail-label">Days held</span><span class="detail-value">${held} day${held===1?"":"s"}</span></div><div><span class="detail-label">Item type</span><span class="detail-value">${escapeHTML(item.type)}</span></div><div><span class="detail-label">Identifying feature</span><span class="detail-value">${escapeHTML(item.colour || "Not provided")}</span></div></div><div class="match-note"><strong>Next step:</strong> ${item.status === "Found" ? "Contact the front desk or security office in person and be ready to describe a detail that is not shown in this public listing." : item.status === "Returned" ? "This report is marked as returned. Thank you for helping reunite the item with its owner." : "Keep checking the board. If you find a possible match, use its reference number when speaking to the front desk."}${possible.length ? `<br><br><strong>Possible related records:</strong> ${possible.map(match=>escapeHTML(match.id)).join(", ")}. These are suggestions based on shared category or location, not confirmed matches.` : ""}</div>`;
}
function renderRecentReports() {
  const target = document.getElementById("recentReports");
  if (!userReports.length) { target.innerHTML = '<div class="recent-empty">No new reports submitted in this session yet.</div>'; return; }
  target.innerHTML = userReports.slice().reverse().slice(0,5).map(item => `<div class="recent-row"><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.id)} • ${formatDate(item.date)}</small></div><button class="small-action" data-track="${escapeHTML(item.id)}">Track report</button></div>`).join("");
}
function updateAll() { allItems = [...userReports,...seedItems]; updateStats(); renderItems(); renderRecentReports(); }

document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
["searchInput","categoryFilter","locationFilter","statusFilter","sortSelect"].forEach(id => document.getElementById(id).addEventListener(id === "searchInput" ? "input" : "change", renderItems));
document.getElementById("clearFilters").addEventListener("click", () => {
  ["searchInput","categoryFilter","locationFilter","statusFilter"].forEach(id => document.getElementById(id).value = "");
  document.getElementById("sortSelect").value = "newest"; renderItems();
});
document.querySelectorAll('input[name="reportType"]').forEach(input => input.addEventListener("change", () => {
  document.querySelectorAll(".choice-card").forEach(card => card.classList.toggle("selected", card.querySelector("input").checked));
}));
document.getElementById("itemPhoto").addEventListener("change", event => {
  const file = event.target.files[0]; if (!file) return;
  const message = document.getElementById("reportMessage");
  if (!["image/jpeg","image/png","image/webp"].includes(file.type) || file.size > 5*1024*1024) {
    showFormMessage(message,"Please choose a JPG, PNG or WEBP image smaller than 5 MB.","error"); event.target.value=""; return;
  }
  const reader = new FileReader();
  reader.onload = () => { selectedImage = reader.result; document.getElementById("previewImage").src = selectedImage; document.getElementById("previewName").textContent = file.name; document.getElementById("uploadPreview").classList.remove("hidden"); message.classList.add("hidden"); };
  reader.readAsDataURL(file);
});
document.getElementById("removePhoto").addEventListener("click", () => {
  selectedImage = ""; document.getElementById("itemPhoto").value = ""; document.getElementById("uploadPreview").classList.add("hidden");
});
document.getElementById("reportForm").addEventListener("reset", () => {
  setTimeout(() => { selectedImage=""; document.getElementById("uploadPreview").classList.add("hidden"); document.getElementById("reportMessage").classList.add("hidden"); document.querySelectorAll(".choice-card").forEach(card => card.classList.toggle("selected",card.querySelector("input").checked)); },0);
});
document.getElementById("reportForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) { showFormMessage(document.getElementById("reportMessage"),"Please complete all required fields and confirm that the report is accurate.","error"); return; }
  const data = new FormData(form);
  const report = {
    id:generateReference(),name:data.get("name").trim(),type:data.get("reportType"),category:data.get("category"),
    location:data.get("location"),date:data.get("date"),colour:data.get("colour").trim(),
    description:data.get("description").trim(),status:data.get("reportType"),daysHeld:0,
    image:selectedImage,icon:"📦"
  };
  userReports.push(report); saveReports(); updateAll();
  showFormMessage(document.getElementById("reportMessage"),`Report submitted successfully. Your reference number is ${report.id}. Save it to track this report.`,"success");
  form.reset(); document.getElementById("reportDate").value = today.toISOString().slice(0,10);
  showToast(`Report created: ${report.id}`);
});
document.getElementById("claimForm").addEventListener("submit", event => {
  event.preventDefault();
  const ref = document.getElementById("referenceInput").value.trim().toUpperCase();
  const item = allItems.find(record => record.id.toUpperCase() === ref);
  const message = document.getElementById("claimMessage");
  if (!item) { showFormMessage(message,"We couldn't find that reference. Check the characters and try again.","error"); document.getElementById("claimResult").innerHTML='<div class="result-placeholder"><div>?</div><h3>Report not found</h3><p>Check the reference number or return to the community board.</p></div>'; return; }
  message.classList.add("hidden"); renderClaim(item);
});
document.addEventListener("click", event => {
  const details = event.target.closest("[data-details]");
  const claim = event.target.closest("[data-claim]");
  const track = event.target.closest("[data-track]");
  const sample = event.target.closest("[data-ref]");
  if (details) {
    const item = allItems.find(record => record.id === details.dataset.details);
    renderClaim(item); document.getElementById("referenceInput").value = item.id; setView("claims");
  }
  if (claim) {
    const item = allItems.find(record => record.id === claim.dataset.claim);
    document.getElementById("referenceInput").value = item.id; renderClaim(item); setView("claims");
    showToast("Reference loaded. Follow the next-step guidance.");
  }
  if (track) {
    const item = allItems.find(record => record.id === track.dataset.track);
    document.getElementById("referenceInput").value = item.id; renderClaim(item); setView("claims");
  }
  if (sample) {
    const item = allItems.find(record => record.id === sample.dataset.ref);
    document.getElementById("referenceInput").value = item.id; renderClaim(item);
  }
});

updateAll();
