const problemInput = document.getElementById("problem");
const result = document.getElementById("result");

function solveProblem() {

    const problem = problemInput.value.trim();

    if (!problem) {
        alert("Tell NOVA what's challenging you first.");
        return;
    }

    const text = problem.toLowerCase();

    let category = "GENERAL CHALLENGE";
    let priority = "";
    let actions = [];

    /* Detect academic problems */

    if (
        text.includes("exam") ||
        text.includes("study") ||
        text.includes("course") ||
        text.includes("school") ||
        text.includes("assignment") ||
        text.includes("test")
    ) {

        category = "ACADEMIC CHALLENGE";

        priority =
            "Identify your courses, deadlines and the topics that need the most attention.";

        actions = [
            "List all your courses and upcoming deadlines.",
            "Rank the subjects from most difficult to easiest.",
            "Create a realistic study schedule.",
            "Start with one high-priority topic today."
        ];
    }

    /* Detect learning problems */

    else if (
        text.includes("learn") ||
        text.includes("learning") ||
        text.includes("programming") ||
        text.includes("coding") ||
        text.includes("skill")
    ) {

        category = "LEARNING CHALLENGE";

        priority =
            "Choose one specific skill and define what you want to be able to do with it.";

        actions = [
            "Choose one technology or skill to focus on.",
            "Learn the fundamentals before jumping into advanced topics.",
            "Build a small project using what you learn.",
            "Practice consistently and document your progress."
        ];
    }

    /* Detect project problems */

    else if (
        text.includes("app") ||
        text.includes("website") ||
        text.includes("project") ||
        text.includes("startup") ||
        text.includes("business")
    ) {

        category = "PROJECT CHALLENGE";

        priority =
            "Turn the idea into a clearly defined problem and a small first version.";

        actions = [
            "Describe the problem your project is solving.",
            "Identify the people who would use it.",
            "Define the smallest useful version of the product.",
            "Build and test one feature at a time."
        ];
    }

    /* Detect time-management problems */

    else if (
        text.includes("time") ||
        text.includes("busy") ||
        text.includes("schedule") ||
        text.includes("procrastinat") ||
        text.includes("deadline")
    ) {

        category = "TIME MANAGEMENT CHALLENGE";

        priority =
            "Identify what matters most and remove unnecessary tasks.";

        actions = [
            "Write down everything you need to accomplish.",
            "Separate urgent tasks from less important ones.",
            "Choose your three most important tasks.",
            "Give each task a specific time block."
        ];
    }

    /* General problem */

    else {

        category = "GENERAL CHALLENGE";

        priority =
            "Define the desired outcome before deciding how to solve the problem.";

        actions = [
            "Clearly describe the problem.",
            "Identify what is within your control.",
            "Break the problem into smaller pieces.",
            "Take the smallest useful action."
        ];
    }


    document.getElementById("definition").innerHTML =
        "<strong>" + category + "</strong><br><br>" +
        escapeHTML(problem);


    document.getElementById("firstMove").textContent =
        priority;


    document.getElementById("actions").innerHTML =
        actions
            .map((action, index) =>
                (index + 1) + ". " + escapeHTML(action)
            )
            .join("<br><br>");


    result.classList.add("show");

    result.scrollIntoView({
        behavior: "smooth"
    });
}


/* -----------------------------
   TASK MANAGER
------------------------------ */

let tasks = JSON.parse(
    localStorage.getItem("novaTasks")
) || [];


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


function saveTasks() {

    localStorage.setItem(
        "novaTasks",
        JSON.stringify(tasks)
    );
}


function renderTasks() {

    const container =
        document.getElementById("tasks");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    tasks.forEach((task, index) => {

        const taskElement =
            document.createElement("div");

        taskElement.className = "task";

        taskElement.innerHTML = `
            <span
                onclick="toggleTask(${index})"
                class="${task.completed ? "completed" : ""}"
                style="cursor:pointer"
            >
                ${escapeHTML(task.text)}
            </span>

            <button
                onclick="deleteTask(${index})"
            >
                Delete
            </button>
        `;

        container.appendChild(taskElement);
    });

    updateProgress();
}


function updateProgress() {

    const progressBar =
        document.getElementById("progressBar");

    const progressText =
        document.getElementById("progressText");

    const progressStatus =
        document.getElementById("progressStatus");

    const taskCount =
        document.getElementById("taskCount");


    if (
        !progressBar ||
        !progressText ||
        !progressStatus ||
        !taskCount
    ) {
        return;
    }


    /* No tasks */

    if (tasks.length === 0) {

        progressBar.style.width = "0%";

        progressText.textContent =
            "0% complete";

        progressStatus.textContent =
            "Ready to begin.";

        taskCount.textContent =
            "0 / 0 tasks completed";

        return;
    }


    /* Calculate progress */

    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const total =
        tasks.length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    /* Update progress bar */

    progressBar.style.width =
        percentage + "%";


    /* Update percentage */

    progressText.textContent =
        percentage + "% complete";


    /* Update task counter */

    taskCount.textContent =
        completed + " / " +
        total +
        " tasks completed";


    /* Update NOVA status */

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


/* Reset all progress */

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


/* Security helper */

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
function addPlanToTasks() {

    const actionText = document
        .getElementById("actions")
        .innerText
        .trim();

    if (!actionText) {
        alert("Create a NOVA plan first.");
        return;
    }

    const actionLines = actionText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0);

    actionLines.forEach(line => {

        const cleanTask = line
            .replace(/^\d+\.\s*/, "")
            .trim();

        if (cleanTask) {
            tasks.push({
                text: cleanTask,
                completed: false
            });
        }
    });

    saveTasks();
    renderTasks();

    alert("Your NOVA action plan has been added to your Action Board.");

    document
        .getElementById("tasks")
        .scrollIntoView({
            behavior: "smooth"
        });
}
