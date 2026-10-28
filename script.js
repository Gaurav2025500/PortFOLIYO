// Reads profile.json and builds the page. Edit profile.json to change content.
const $ = (id) => document.getElementById(id);
const el = (tag, text, cls) => {
  const n = document.createElement(tag);
  if (text) n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
function addLink(parent, label, url, cls) {
  if (!url) return;
  const a = el("a", label, cls);
  a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
  parent.appendChild(a);
}
const list = (items, cls) => {
  const ul = el("ul", null, cls);
  items.forEach((t) => ul.appendChild(el("li", t)));
  return ul;
};

function renderStats(d) {
  const topics = d.skills.reduce((n, s) => n + s.topics.length, 0);
  const data = [[d.projects.length + 1, "Projects"], [d.skills.length, "Skill areas"], [topics, "Topics learned"]];
  $("stats").replaceChildren(...data.flatMap(([n, l]) => {
    const wrap = el("div");
    wrap.append(el("dt", String(n)), el("dd", l));
    return [wrap];
  }));
}

function renderCode(d) {
  const k = (t) => `<span class="k">${t}</span>`, s = (t) => `<span class="s">"${t}"</span>`;
  const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  $("codeBox").innerHTML =
    `<span class="c">// full stack developer</span>\n${k("const")} developer = {\n` +
    `  name: ${s(esc(d.name))},\n  college: ${s(esc(d.education[0].school))},\n  focus: ${s("Full Stack")},\n` +
    `  stack: [${d.skills.slice(1, 5).map((x) => s(esc(x.name))).join(", ")}],\n` +
    `  database: [${s("PostgreSQL")}, ${s("MongoDB")}],\n  building: ${s(esc(d.featured.title))},\n};`;
}

function renderSkills(skills) {
  const tabs = $("tabs");
  const buttons = skills.map((s, i) => {
    const b = el("button", s.name, "tab");
    b.type = "button"; b.setAttribute("role", "tab");
    b.addEventListener("click", () => select(i));
    tabs.appendChild(b);
    return b;
  });
  function select(i) {
    buttons.forEach((b, j) => b.setAttribute("aria-selected", String(i === j)));
    $("panelTitle").textContent = skills[i].name;
    $("panelCount").textContent = skills[i].topics.length + " topics learned";
    const ul = $("panelTopics");
    ul.replaceChildren(...skills[i].topics.map((t, n) => {
      const li = el("li", t); li.style.animationDelay = n * 40 + "ms"; return li;
    }));
  }
  select(0);
}

function renderFeatured(f) {
  const box = $("featuredBox");
  const grid = el("div", null, "feat reveal");
  const left = el("div");
  left.append(el("span", "Featured project", "badge"), el("h2", f.title), el("p", f.subtitle, "sub"),
    el("p", f.description, "d"), list(f.features, "f"), list(f.tech, "tech"));
  const links = el("div", null, "plinks");
  addLink(links, "Live demo", f.link);
  addLink(links, "Source code", f.repo, "o");
  if (links.children.length) left.appendChild(links);
  const right = el("div", null, "flow");
  right.appendChild(el("h4", "How it works. Status: " + f.status));
  const ol = el("ol");
  f.pipeline.forEach((p) => ol.appendChild(el("li", p)));
  right.appendChild(ol);
  grid.append(left, right);
  box.appendChild(grid);
}

function renderProjects(projects) {
  $("projectList").replaceChildren(...projects.map((p) => {
    const card = el("article", null, "project reveal");
    card.append(el("h3", p.title), el("p", p.description), list(p.tech, "tech"));
    const links = el("div", null, "project-links");
    addLink(links, "Live demo", p.link);
    addLink(links, "Source code", p.repo);
    if (links.children.length) card.appendChild(links);
    return card;
  }));
}

function renderEducation(items) {
  $("educationList").replaceChildren(...items.map((e) => {
    const box = el("div", null, "edu reveal");
    box.append(el("h3", e.school), el("p", e.degree), el("p", e.year));
    return box;
  }));
}

function behaviours() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  const links = [...document.querySelectorAll("#nav a")];
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-40% 0px -55% 0px" });
  links.forEach((a) => { const t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });

  const bar = $("progress");
  addEventListener("scroll", () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
  }, { passive: true });
}

fetch("profile.json").then((r) => r.json()).then((d) => {
  document.title = d.name + " | " + d.role;
  $("mark").textContent = d.name.split(" ").filter((_, i, a) => i === 0 || i === a.length - 1).map((w) => w[0]).join("");
  $("brandName").textContent = d.name;
  $("name").textContent = d.name;
  $("role").textContent = d.role;
  $("tagline").textContent = d.tagline;
  const c = $("contactLinks");
  addLink(c, "LinkedIn", d.links.linkedin, "btn primary");
  addLink(c, "GitHub", d.links.github, "btn ghost");
  addLink(c, "Email", d.links.email ? "mailto:" + d.links.email : "", "btn ghost");
  $("copy").textContent = "© " + new Date().getFullYear() + " " + d.name + " · " + d.location;
  renderStats(d); renderCode(d); renderSkills(d.skills);
  renderFeatured(d.featured); renderProjects(d.projects); renderEducation(d.education);
  behaviours();
}).catch(() => { $("name").textContent = "Could not load profile.json"; });
