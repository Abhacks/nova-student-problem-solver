let tasks = JSON.parse(
    localStorage.getItem("novaTasks")
) || [];

let selectedMode = "auto";

let currentActions = [];


/* -----------------------------
   MODE SYSTEM
------------------------------ */

const modeNames = {
    auto: "AUTO",
    study: "STUDY",
    build: "BUILD",
    goals: "GOALS",
    focus: "FOCUS"
};


function setMode(mode) {

    selectedMode = mode;

    document.querySelectorAll(".mode-button")
        .forEach(button => {
            button.classList.remove("active");
        });

    const buttons =
        document.querySelectorAll(".mode-button");

    const modes =
        ["study", "build", "goals", "focus", "auto"];

    const index =
        modes.indexOf(mode);

    if (index >= 0 && buttons[index]) {
        buttons[index].classList.add("active");
    }

    document.getElementById("activeMode")
        .textContent = modeNames[mode];
}


/* -----------------------------
   PROBLEM ANALYSIS
------------------------------ */

function solveProblem() {

    const input =
        document.getElementById("problem");

    const problem =
        input.value.trim();

    if (!problem) {
        alert(
            "Tell NOVA what's challenging you first."
        );

        return;
    }


    const text =
        problem.toLowerCase();


    let mode =
        selectedMode === "auto"
            ? detectMode(text)
            : selectedMode;


    const analysis =
        generateAnalysis(mode);


    currentActions =
        analysis.actions;


    document.getElementById("activeMode")
        .textContent = modeNames[mode];


    document.getElementById("detectedMode")
        .textContent =
        modeNames[mode] +
        " CHALLENGE";


    document.getElementById("definition")
        .textContent = problem;


    document.getElementById("firstMove")
        .textContent =
        analysis.priority;


    document.getElementById("actions")
        .innerHTML =
        currentActions
            .map((action, index) => `
                <div class="action-line">
                    <strong>${index + 1}.</strong>
                    ${escapeHTML(action)}
                </div>
            `)
            .join("");


    document.getElementById("result")
        .classList.add("show");


    document.getElementById("result")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* -----------------------------
   MODE DETECTION
------------------------------ */

function detectMode(text) {

    if (
        text.includes("exam") ||
        text.includes("study") ||
        text.includes("course") ||
        text.includes("assignment") ||
        text.includes("school") ||
        text.includes("test") ||
        text.includes("lecture")
    ) {
        return "study";
    }


    if (
        text.includes("app") ||
        text.includes("website") ||
        text.includes("coding") ||
        text.includes("code") ||
        text.includes("programming") ||
        text.includes("project") ||
        text.includes("build") ||
        text.includes("startup")
    ) {
        return "build";
    }


    if (
        text.includes("goal") ||
        text.includes("achieve") ||
        text.includes("future") ||
        text.includes("career") ||
        text.includes("habit") ||
        text.includes("improve myself")
    ) {
        return "goals";
    }


    if (
        text.includes("procrastinat") ||
        text.includes("distract") ||
        text.includes("busy") ||
        text.includes("deadline") ||
        text.includes("time") ||
        text.includes("focus")
    ) {
        return "focus";
    }


    return "goals";
}


/* -----------------------------
   ANALYSIS ENGINE
------------------------------ */

function generateAnalysis(mode) {

    if (mode === "study") {

        return {
            priority:
                "Identify what you need to learn, when you need to know it, and which topics deserve the most attention.",

            actions: [
                "List your courses, topics and deadlines.",
                "Rank each subject by difficulty and urgency.",
                "Create a realistic study schedule.",
                "Start with one high-priority topic today."
            ]
        };
    }


    if (mode === "build") {

        return {
            priority:
                "Turn the idea into a clearly defined problem and build the smallest useful version first.",

            actions: [
                "Describe the problem your project is solving.",
                "Identify the people who would use it.",
                "Define the smallest useful version of the product.",
                "Build and test one feature at a time."
            ]
        };
    }


    if (mode === "goals") {

        return {
            priority:
                "Define the outcome you want and convert it into a measurable goal.",

            actions: [
                "Write down the exact result you want.",
                "Choose a realistic deadline.",
                "Break the goal into smaller milestones.",
                "Complete one measurable action today."
            ]
        };
    }


    if (mode === "focus") {

        return {
            priority:
                "Remove distractions and identify the single task that will create the most progress.",

            actions: [
                "Write down everything competing for your attention.",
                "Choose your most important task.",
                "Set a focused time block for it.",
                "Remove one major distraction and begin."
            ]
        };
    }


    return {
        priority:
            "Define the desired outcome before deciding how to solve the problem.",

        actions: [
            "Clearly describe the problem.",
            "Identify what is within your control.",
            "Break the problem into smaller pieces.",
            "Take the smallest useful action."
        ]
    };
}


/* -----------------------------
   ACTION BOARD
------------------------------ */

function addPlanToTasks() {

    if (
        !currentActions ||
        currentActions.length === 0
    ) {
        alert(
            "Create a NOVA plan first."
        );

        return;
    }


    currentActions.forEach(action => {

        const alreadyExists =
            tasks.some(
                task => task.text === action
            );


        if (!alreadyExists) {

            tasks.push({
                text: action,
                completed: false
            });

        }

    });


    saveTasks();

    renderTasks();


    document.getElementById("tasks")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* -----------------------------
   TASK MANAGER
------------------------------ */

function addTask() {

    const input =
        document.getElementById("taskInput");

    const text =
        input.value.trim();


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

    if (!tasks[index]) {
        return;
    }


    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();

    renderTasks();
}


function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();

    renderTasks();
}


/* -----------------------------
   PROGRESS
------------------------------ */

function updateProgress() {

    const progressBar =
        document.getElementById("progressBar");

    const progressText =
        document.getElementById("progressText");

    const progressStatus =
        document.getElementById("progressStatus");

    const taskCount =
        document.getElementById("taskCount");


    if (!progressBar) {
        return;
    }


    if (tasks.length === 0) {

        progressBar.style.width =
            "0%";

        progressText.textContent =
            "0% complete";

        progressStatus.textContent =
            "Ready to begin.";

        taskCount.textContent =
            "0 / 0 tasks completed";

        return;
    }


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const percentage =
        Math.round(
            completed /
            tasks.length *
            100
        );


    progressBar.style.width =
        percentage + "%";


    progressText.textContent =
        percentage + "% complete";


    taskCount.textContent =
        completed +
        " / " +
        tasks.length +
        " tasks completed";


    if (percentage === 0) {

        progressStatus.textContent =
            "Ready to begin.";

    } else if (percentage < 50) {

        progressStatus.textContent =
            "Building momentum.";

    } else if (percentage < 100) {

        progressStatus.textContent =
            "Almost there. Keep going.";

    } else {

        progressStatus.textContent =
            "Mission complete! 🎯";
    }
}


/* -----------------------------
   RENDER TASKS
------------------------------ */

function renderTasks() {

    const container =
        document.getElementById("tasks");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    tasks.forEach((task, index) => {

        const element =
            document.createElement("div");


        element.className =
            "task";


        element.innerHTML = `
            <span
                onclick="toggleTask(${index})"
                class="${task.completed ? "completed" : ""}"
            >
                ${escapeHTML(task.text)}
            </span>

            <button
                onclick="deleteTask(${index})"
            >
                Delete
            </button>
        `;


        container.appendChild(element);
    });


    updateProgress();
}


/* -----------------------------
   RESET
------------------------------ */

function resetProgress() {

    if (tasks.length === 0) {
        return;
    }


    const confirmed =
        confirm(
            "Reset all NOVA tasks and progress?"
        );


    if (!confirmed) {
        return;
    }


    tasks = [];


    saveTasks();

    renderTasks();
}


/* -----------------------------
   CLEAR PROBLEM
------------------------------ */

function clearProblem() {

    document.getElementById("problem")
        .value = "";


    document.getElementById("result")
        .classList.remove("show");
}


/* -----------------------------
   SECURITY
------------------------------ */

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* -----------------------------
   STORAGE
------------------------------ */

function saveTasks() {

    localStorage.setItem(
        "novaTasks",
        JSON.stringify(tasks)
    );
}


/* -----------------------------
   STARTUP
------------------------------ */

renderTasks();
setMode("auto");
