const defaultSchedule = {
    SEG: {
        label: "Segunda",
        classes: [
            { time: "20:30 – 22:00", subject: "Tópicos Integradores I", tag: "Direito", color: "#7C5CFF" }
        ]
    },
    TER: {
        label: "Terça",
        classes: [
            { time: "19:00 – 20:30", subject: "Direito Eleitoral", tag: "Direito", prof: "Prof. Fernanda Rodrigues", color: "#FF6B6B" },
            { time: "20:30 – 22:00", subject: "Direito das Sucessões", tag: "Direito", prof: "Prof. Roberta", color: "#FF9F43" }
        ]
    },
    QUA: {
        label: "Quarta",
        classes: [
            { time: "19:45 – 22:00", subject: "Estágio Supervisionado I", tag: "Direito", color: "#26C6DA" }
        ]
    },
    QUI: {
        label: "Quinta",
        classes: [
            { time: "18:15 – 20:30", subject: "Prática Forense Civil", tag: "Direito", prof: "Prof. Arthur", color: "#66BB6A" },
            { time: "20:30 – 22:00", subject: "Procedimentos no Âmbito da Administração", tag: "Direito", color: "#AB47BC" }
        ]
    },
    SEX: {
        label: "Sexta",
        classes: [
            { time: "18:15 – 19:00", subject: "Direito Individual e Coletivo do Trabalho", tag: "Direito", color: "#FFA726" },
            { time: "19:00 – 20:30", subject: "Legislação Penal e Processual Penal Especial", tag: "Direito", color: "#EF5350" },
            { time: "20:30 – 22:00", subject: "Direito Individual e Coletivo do Trabalho", tag: "Direito", color: "#FFA726" }
        ]
    }
};

let schedule = JSON.parse(localStorage.getItem('schedule')) || defaultSchedule;

const dayKeys = ["SEG", "TER", "QUA", "QUI", "SEX"];
const jsDayMap = { 1: "SEG", 2: "TER", 3: "QUA", 4: "QUI", 5: "SEX" };
const todayKey = jsDayMap[new Date().getDay()] || "SEG";
let activeKey = todayKey;

function saveSchedule() {
    localStorage.setItem('schedule', JSON.stringify(schedule));
}

function addClass(dayKey) {
    const time = prompt("Horário (ex: 20:30 – 22:00):");
    if (!time) return;
    const subject = prompt("Matéria:");
    if (!subject) return;
    const tag = prompt("Tag (ex: Direito):") || "Direito";
    const prof = prompt("Professor (opcional):");
    const color = prompt("Cor (ex: #7C5CFF):") || "#7C5CFF";

    schedule[dayKey].classes.push({ time, subject, tag, prof: prof || undefined, color });
    saveSchedule();
    render();
}

function removeClass(dayKey, index) {
    if (confirm("Remover esta aula?")) {
        schedule[dayKey].classes.splice(index, 1);
        saveSchedule();
        render();
    }
}

function renderTabs() {
    const container = document.getElementById("tabs");
    container.innerHTML = "";
    dayKeys.forEach(key => {
        const btn = document.createElement("button");
        btn.className = "tab" + (key === activeKey ? " active" : "") + (key === todayKey ? " today" : "");
        btn.innerHTML = `${key}<span class="tab-dot"></span>`;
        btn.onclick = () => { activeKey = key; render(); };
        container.appendChild(btn);
    });
}

function renderDay() {
    const day = schedule[activeKey];
    document.getElementById("dayName").textContent = day.label;
    document.getElementById("todayBadge").style.display = activeKey === todayKey ? "inline-flex" : "none";

    const list = document.getElementById("classList");
    list.innerHTML = "";

    // Botão adicionar
    const addBtn = document.createElement("button");
    addBtn.className = "add-btn";
    addBtn.textContent = "+ Adicionar Aula";
    addBtn.onclick = () => addClass(activeKey);
    list.appendChild(addBtn);

    if (!day.classes.length) {
        list.innerHTML += `<div class="empty"><div class="empty-icon">📭</div>Sem aulas neste dia.</div>`;
        return;
    }

    day.classes.forEach((cls, i) => {
        const card = document.createElement("div");
        card.className = "card";
        card.style.animationDelay = `${i * 80}ms`;
        card.innerHTML = `
      <div class="card-accent" style="background:${cls.color}"></div>
      <div class="card-body">
        <div class="time-badge" style="color:${cls.color};border-color:${cls.color}40;background:${cls.color}15">
          🕐 ${cls.time}
        </div>
        <div class="subject-name">${cls.subject}</div>
        <div class="subject-tag">${cls.tag}</div>
        ${cls.prof ? `<div class="prof">👤 ${cls.prof}</div>` : ""}
        <button class="remove-btn" onclick="removeClass('${activeKey}', ${i})">🗑️ Remover</button>
      </div>
    `;
        list.appendChild(card);
    });
}

function renderFooter() {
    const footer = document.getElementById("footer");
    footer.innerHTML = "";
    dayKeys.forEach(key => {
        const day = schedule[key];
        const pips = day.classes.map(c => `<div class="pip" style="background:${c.color}"></div>`).join("");
        footer.innerHTML += `
      <div class="footer-day">
        <span class="footer-label">${key}</span>
        <div class="footer-pips">${pips}</div>
      </div>
    `;
    });
}

function render() {
    renderTabs();
    renderDay();
    renderFooter();
}

render();