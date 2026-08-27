const problemInput = document.getElementById("problem");
const result = document.getElementById("result");

function solveProblem() {
    const problem = problemInput.value.trim();

    if (!problem) {
        alert("Tell NOVA what's challenging you first.");
        return;
    }

    document.getElementById("definition").textContent =
        "Your challenge is: " + problem;

    document.getElementById("firstMove").textContent =
        "Start by identifying the single most important outcome you want.";

    document.getElementById("actions").textContent =
        "Break the challenge into smaller tasks, choose the easiest useful step, and give yourself a realistic deadline.";

    result.classList.add("show");

    result.scrollIntoView({
        behavior: "smooth"
    });
}


/* -----------------------------
   TASK MANAGER
------------------------------ */

let tasks = JSON.parse(localStorage.getItem("novaTasks")) || [];

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (!text) {
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    input.value = "";

    saveTasks();
    renderTasks();
}


function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    renderTasks();
}


function deleteTask(index) {
    tasks.splice(index, 1);

    saveTasks();
    renderTasks();
}


function saveTasks() {
    localStorage.setItem("novaTasks", JSON.stringify(tasks));
}


function renderTasks() {
    const container = document.getElementById("tasks");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <span
                onclick="toggleTask(${index})"
                class="${task.completed ? "completed" : ""}"
                style="cursor:pointer"
            >
                ${escapeHTML(task.text)}
            </span>

            <button onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        container.appendChild(taskElement);
    });

    updateProgress();
}


function updateProgress() {

    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");

    if (!progressBar || !progressText) {
        return;
    }

    if (tasks.length === 0) {
        progressBar.style.width = "0%";
        progressText.textContent = "0% complete";
        return;
    }

    const completed = tasks.filter(task => task.completed).length;

    const percentage = Math.round(
        (completed / tasks.length) * 100
    );

    progressBar.style.width = percentage + "%";

    progressText.textContent =
        percentage + "% complete";
}


/* Prevent HTML injection inside tasks */

function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* Load saved tasks */

renderTasks();
