const noteTitle = document.getElementById("noteTitle")
const detailsText = document.getElementById("detailsText")
const editDetailsButton = document.getElementById("editDetailsButton")
const taskTableBody = document.getElementById("taskTableBody")
const backButton = document.querySelector(".backButton")


// Delete Note Button
const deleteNoteButton = document.getElementById("deleteNoteButton")

// Add task modal
const addTaskModal = document.getElementById("addTaskModal");
const openModalButton = document.getElementById("openModalButton");
const closeTaskModal = document.getElementById("closeTaskModal");

// Edit Task Modal
const editTaskModal = document.getElementById("editTaskModal")
const closeEditTaskModal = document.getElementById("closeEditTaskModal")
const editTaskModalInput = document.getElementById("editTaskModalInput")
const editTaskModalDetails = document.getElementById("editTaskModalDetails")
const submitTaskEdit = document.getElementById("submitTaskEdit")
// // Add Task values
// const addTasktitle = document.getElementById("addTaskTitle").value
// const addTaskDetails = document.getElementById("addTaskDetails").value

// Finish Tasks
const finishTasks = document.getElementById("finishTasks")

// Finished Tasks Table
const finishedTaskTableBody = document.getElementById("finishedTaskTableBody")
const finishedCount = document.getElementById("finishedCount")


const BASE_URL = "http://localhost:3000"

let textReadonly = true

const checkedRowId = []

backButton.addEventListener('click', () =>{
    history.back()
    console.log("add")
})

openModalButton.addEventListener('click', () =>{
    addTaskModal.showModal()
})

closeTaskModal.addEventListener('click', () =>{
    addTaskModal.close()
})

// ADD TASK BUTTON
addTaskButton.addEventListener('click', async ()=>{
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    // Add Task values
    const addTasktitle = document.getElementById("addTaskTitle").value
    const addTaskDetails = document.getElementById("addTaskDetails").value

    if(!addTaskDetails || !addTasktitle){
        alert("Please fill in necessary inputs")
    }


    try{
        const response = await fetch(`${BASE_URL}/api/notes/${id}/tasks`,{
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                taskTitle : addTasktitle,
                taskDetails : addTaskDetails,
                note_id : id
            })
        })
        const data = await response.json()

        console.log(data)
        console.log(response.body)
        
        alert("Task Added Successfully")

        location.reload()
        
    }catch(error){
        console.log(error)
    }
})

async function getNote () {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    
    try{
        const response = await fetch(`${BASE_URL}/api/notes/${id}`)
        const data = await response.json()
        
        console.log(data)

        noteTitle.innerHTML = data.note.noteTitle
        detailsText.innerText = data.note.noteDetails

        data.tasks.forEach(task => {
            const row = document.createElement("tr")
            row.dataset.id = task.task_id

            row.innerHTML = 
            `
                <td class="taskName">${task.taskName}</td>
                <td class="taskDetails">${task.taskDetails}</td>
                <td><input type="checkbox" class="tableCheckbox"></td>
                <td id="buttonArea">
                <button class="editTaskButton">Edit Task</button>
                <button class="deleteTaskButton">Delete Task</button>
                </td>
            `
            taskTableBody.appendChild(row)

        });        

    }
    catch(error){
        console.error(error)
    }
}

async function getCheckedTasks() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    try {
        const response = await fetch(`${BASE_URL}/api/notes/${id}/tasks`)
        const data = await response.json()

        console.log(data)

        noteTitle.innerHTML = data.note.noteTitle
        detailsText.innerText = data.note.noteDetails

        finishedTaskTableBody.innerHTML = ""

        data.tasks.forEach(task => {
            const row = document.createElement("tr")
            row.dataset.id = task.task_id

            row.innerHTML = `
                <td class="taskName">${task.taskName}</td>
                <td class="taskDetails">${task.taskDetails}</td>
                <td>
                    <input type="checkbox" checked disabled>
                </td>
                <td id="buttonArea">
                    <button class="deleteTaskButton">Delete Task</button>
                </td>
            `

            finishedTaskTableBody.appendChild(row)
        })

        finishedCount.innerText = data.tasks.length

    } catch (error) {
        console.error(error)
    }
}

getNote()
getCheckedTasks()


editDetailsButton.addEventListener('click', () =>{
    textReadonly = !textReadonly
    detailsText.readOnly = textReadonly;
    console.log(textReadonly)

    editDetailsButton.textContent = editDetailsButton.textContent === "Allow Edits" ? "Editing" : "Allow Edits";
    editDetailsButton.classList.toggle("allowed", !textReadonly)
    editDetailsButton.classList.toggle("notAllowed", textReadonly)
})



taskTableBody.addEventListener('click', async (event) => {
    const deleteTaskButton = event.target.closest('.deleteTaskButton'); 
    
    if (!deleteTaskButton) return; 

    const row = deleteTaskButton.closest("tr");
    const id = row.dataset.id;

    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
        const response = await fetch(`${BASE_URL}/api/notes/${id}/tasks`, {
            method: 'DELETE'
        });

        if (response.ok) {
            row.remove();
        } else {
            alert("Failed to delete the task.");
        }
    } catch (error) {
        console.error(error);
    }
});

taskTableBody.addEventListener('click', (event) => {
    const editTaskButton = event.target.closest(".editTaskButton");

    if (!editTaskButton) return;

    const row = editTaskButton.closest("tr");

    const id = row.dataset.id;
    const taskName = row.querySelector(".taskName");
    const taskDetails = row.querySelector(".taskDetails");

    document.getElementById("editTaskModalInput").value = taskName.textContent;
    document.getElementById("editTaskModalDetails").value = taskDetails.textContent;

    editTaskModal.dataset.id = id;
    editTaskModal.dataset.taskName = taskName;
    editTaskModal.dataset.taskDetails = taskDetails;

    editTaskModal.showModal();
});

closeEditTaskModal.addEventListener('click', () =>{
    editTaskModal.close()
})


submitTaskEdit.addEventListener('click', async () =>{
    const id = editTaskModal.dataset.id;
    const taskName = document.getElementById("editTaskModalInput").value
    const taskDetails = document.getElementById("editTaskModalDetails").value

    console.log(id)
    console.log(taskName)
    console.log(taskDetails)

    try{
        const response = await fetch(`${BASE_URL}/api/notes/${id}/tasks`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                title : taskName,
                details : taskDetails
            })

        })

        console.log(response.body)

        if(!response.ok){
            console.log("Failed to update Task")
            return
        }

        const updatedTask = await response.json()
        console.log(updatedTask)
        editTaskModal.close()

        location.reload()

    }catch(error){
        console.error(error)
    }
})


taskTableBody.addEventListener('click', (event) => {
    const tableCheckbox = event.target.closest(".tableCheckbox");

    if (!tableCheckbox) return;

    const row = tableCheckbox.closest("tr");
    const id = row.dataset.id;

    if (tableCheckbox.checked) {
        row.classList.add("checked");
        checkedRowId.push(id)
    } else {
        row.classList.remove("checked");
    }
});


deleteNoteButton.addEventListener('click', async() =>{
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")

    console.log(id)

    try{
        const deleteNote = await fetch(`${BASE_URL}/api/notes/${id}`,{
            method : "DELETE"
        })
        alert("Note Delete Successfully")
        window.history.back()

    }catch(error){
        console.error("An error Occurred", error)
    }
 

})

finishTasks.addEventListener('click', async () => {
    try {
        await Promise.all(
            checkedRowId.map(async (id) => {
                const response = await fetch(
                    `${BASE_URL}/api/notes/${id}/tasks`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error(`Failed to finish task ${id}`);
                }
            })
        );

        console.log("Tasks successfully finished");

    } catch (error) {
        console.log(error);
    }
});



