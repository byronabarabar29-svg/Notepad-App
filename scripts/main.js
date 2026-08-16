const openTaskButton = document.getElementById("openTaskButton");
const addTaskModal = document.getElementById("addTaskModal");
const closeTaskModal = document.getElementById("closeTaskModal");
const addTaskButton = document.getElementById("addTaskButton");
const taskContainer = document.getElementById("taskContainer");

// Notes
const allNotes = document.getElementById("allNotes");
const notes = document.getElementById("notesContainer");

// Submit note
const submitNoteButton = document.getElementById("submitNoteButton");

// CONSTANTS
const tasks = [];
const BASE_URL = "http://localhost:3000";


// =========================
// FETCH NOTES
// =========================

async function fetchNotes() {
    try {
        const response = await fetch(`${BASE_URL}/api/notes/`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("Notes response:", data);

        // Check if there are no notes
        if (!data.notes || data.notes.length === 0) {

            notes.innerHTML = `
                <h3 id="noNotes">No Notes Yet</h3>
            `;

            return;
        }

        // Clear "No Notes Yet"
        notes.innerHTML = "";

        // Display all notes
        data.notes.forEach(note => {

            notes.innerHTML += `
                <a href="pages/notes.html?id=${note.note_id}">
                    ${note.noteTitle}
                </a>
            `;

        });

        console.log("All notes:", data.notes);

    } catch (error) {

        console.error("FETCH FAILED:", error);

    }
}

// Fetch notes from database
fetchNotes();
// =========================
// INITIAL DISPLAY
// =========================

// Show No Tasks Yet initially
taskContainer.innerHTML = `
    <h3 id="noTasks">No Tasks Yet</h3>
`;

// =========================
// ADD TASK
// =========================

addTaskButton.addEventListener("click", () => {

    const taskTitleInput = document.getElementById("addTaskTitle");
    const taskDetailInput = document.getElementById("addTaskDetails");

    const taskTitle = taskTitleInput.value.trim();
    const taskDetail = taskDetailInput.value.trim();

    // Check inputs
    if (!taskTitle || !taskDetail) {
        alert("Please fill in the task title and details.");
        return;
    }

    const task = {
        taskTitle: taskTitle,
        taskDetail: taskDetail
    };
    const taskId = `task-${Date.now()}`;
    // Remove "No Tasks Yet"
    const noTasks = document.getElementById("noTasks");
    if (noTasks) {
        noTasks.remove();
    }
    // Add task to HTML
    taskContainer.innerHTML += `
        <div class="task">
            <div class="indiTask">
                <label for="${taskId}">
                    ${task.taskTitle}
                </label>
                <textarea
                    id="${taskId}"
                    rows="3"
                >${task.taskDetail}</textarea>
            </div>
        </div>
    `;
    // Save task to array
    tasks.push(task);
    console.log("Added task:", task);
    console.log("All tasks:", tasks);
    // Clear inputs
    taskTitleInput.value = "";
    taskDetailInput.value = "";
    // Close modal
    addTaskModal.close();
});


// =========================
// OPEN TASK MODAL
// =========================

openTaskButton.addEventListener("click", () => {
    addTaskModal.showModal();

});


// =========================
// CLOSE TASK MODAL
// =========================

closeTaskModal.addEventListener("click", () => {
    addTaskModal.close();
});

// =========================
// SUBMIT NOTE
// =========================

submitNoteButton.addEventListener("click", async () => {
    const titleInput =
        document.getElementById("titleInput").value.trim();
    const textInput =
        document.getElementById("textInput").value.trim();
    // Validate inputs
    if (!titleInput || !textInput) {
        alert("Please fill all necessary inputs");
        return;  
    }


    try {
        const response = await fetch(`${BASE_URL}/api/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleInput,
                details: textInput,
                tasks: tasks
            })
        });
        if (!response.ok) {
            throw new Error(
                `HTTP error! Status: ${response.status}`
            );

        }

        const data = await response.json();
        console.log("Note saved:", data);
        // Refresh notes
        fetchNotes();
        // Optional: clear note inputs
        document.getElementById("titleInput").value = "";
        document.getElementById("textInput").value = "";
        // Reset tasks
        tasks.length = 0;

        taskContainer.innerHTML = `
            <h3 id="noTasks">No Tasks Yet</h3>
        `;

        alert("Note submitted Succesfully")

    } catch (error) {

        console.error("Error:", error);

    }

});