import { db } from "../db.js";

export const getNotes = async(req, res) =>{

    const sql = `
    SELECT * FROM note
    `
    try{
        const [notes] = await db.execute(sql)

        res.status(200).json({
            success : true,
            message : "Fetch Success",
            notes : notes
        })
    
    }catch(error){

        if(res.status(500)){
             return res.status(500).json({
            success : false,
            message : `Fetch Failed : ${error}`
        })
        }
    }
}

export const addNote = async(req, res) =>{
    const {title, details , tasks} = req.body;

    if(!title || title.length < 0 || !details || details.length < 0){
        console.log("Invalid Title Length")
        return res.status(400).json({message : "Please fill all necessary Inputs"})
    }


    try {
        const sql = "INSERT INTO note (noteTitle,noteDetails) VALUES (?,?)";
        
        
        const [result] = await db.execute(sql,[title,details])

        const noteId = result.insertId;

        for(const task of tasks){
            const sql2 = 
            `
            INSERT INTO note_tasks (taskName, taskDetails, note_id) VALUES (?,?,?)
            `;

            await db.execute(sql2, [
                task.taskTitle,
                task.taskDetail,
                noteId
            ]);
        }


        res.status(201).json({
        success : true,
        message : "Note and Task Saved",
        note : {
            id : noteId,
            title : title,
            details : details,
            tasks : tasks
        }
        });
    } 
    catch (error) {
        console.log("Error :",error)
        return res.status(500).json({
            success : false,
            message : "Failed to save Note"
        })
    }
}

export const getNote = async(req, res) =>{
    const {id} = req.params;

    const sql = 
    `
    SELECT * FROM note WHERE note_id = ?
    `;

    const taskql = 
    `
    SELECT * FROM note_tasks WHERE note_id = ? AND isFinished = 0
    `

    try{
        const [note] = await db.execute(sql,[id])
        const [tasks]  = await db.execute(taskql,[id])

        // ALTERNATIVELY you can do a rows call
        // declare a rows array that fetches the result then insert it into a variable
        // const [rows] = await db.execute(sql,[id])
        // const note = rows[0]

        if(!note){
            return res.status(404).json({
            success : false,
            message : "Note not found"
        })
        }


        return res.status(200).json({
            success : true,
            message : `Fetch Success`,
            note : note[0], //VERY IMPORTANT SO THAT ONLY THE SPECIFIC GETS FETCHED 
            // SINCE note is an array
            tasks : tasks
        })
    }catch(error){
        console.error("Failed Fetching: ",error)
        return res.status(400).json({
            success : false,
            message : `Failed fetch : ${error}`,
        })
    }
}

export const getCheckedTasks = async (req, res) => {
    const { id } = req.params

    const sql = `
        SELECT * 
        FROM note 
        WHERE note_id = ?
    `

    const taskSql = `
        SELECT * 
        FROM note_tasks 
        WHERE note_id = ? 
        AND isFinished = 1
    `

    try {
        const [note] = await db.execute(sql, [id])
        const [tasks] = await db.execute(taskSql, [id])

        if (note.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Finished tasks fetched successfully",
            note: note[0],
            tasks: tasks
        })

    } catch (error) {
        console.error("Failed Fetching Finished Tasks: ", error)

        return res.status(400).json({
            success: false,
            message: `Failed fetch: ${error}`
        })
    }
}

export const deleteNote = async(req,res) =>{
    const {id} = req.params;

    const sql = 
    `
    DELETE FROM note WHERE note_id = ?
    `
    try{
        const [response] = await db.execute(sql,[id])

        if(response.affectedRows === 0){
            return res.status(500).json({
                success : true,
                message : "Note not Found (error in route probably)"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Note Deleted Succesfully",
            id : id
        })
    }catch(error){
        console.error("An error occured in delete controller: ", error)
        return res.status(500).json({
            success : false,
            message : "Note Deletion Error"
        })
    }
}

// FROM NOTE DETAILS FUNCTIO
export const addTask = async(req,res) =>{
    const {id} = req.params;
    const {taskTitle, taskDetails} = req.body;

    const sql = 
    `
    INSERT INTO note_tasks (note_id, taskName, taskDetails) VALUES (?,?,?) 
    `

    try{
        const [result] = await db.execute(sql,[
        id,
        taskTitle,
        taskDetails
        ]);

        return res.status(201).json({
            success : true,
            message : "Task Added Successfully",
            task_id : result.insertId
        });
        
        console.log(result)

    }catch(error){
        console.error("Failed Adding Task: ",error)

        return res.status(500).json({
            success : false,
            message : "Failed to Create Task"
        });
    }
}

export const deleteTask = async(req,res) =>{
    const {id} = req.params;

    const sql = 
    `
    DELETE FROM note_tasks WHERE task_id = ?
    `

    try{
        const response = await db.execute(sql,[id])

        return res.status(200).json({
            success : true,
            message : "Task Deleted Successfully",
            data : response
        })
    }catch(error){
        console.error("Deletion Failed: ", error)
        return res.status(400).json({
            success : false,
            message : "Deletion"
        })
    }
}

export const editTask = async(req,res) =>{
    const { id } = req.params
    const { title, details} = req.body

    const sql = 
    `
    UPDATE note_tasks
    SET taskName = ?, taskDetails = ?
    WHERE task_id = ?
    `
    

    try{
        const [response] = await db.execute(sql, [title, details, id])
        const updatedTask = JSON.stringify(response)

        if(response.affectedRows === 0){
            return res.status(404).json({
                success : false,
                message : "Task not found"
            })
        }

        if(response.changedRows === 0){
            return res.status(204).json({
                success : true,
                message : "No changes implemented"
            })
        }

        return res.status(200).json({
            success : true,
            message : "Task Edited Successfully",
            task : updatedTask
        })

        }catch(error){
        console.error("Edit Failed: ", error)
        return res.status(400).json({
            success : false,
            message : "Task Edit Failed",
            error : error
        })
    }
}

export const checkTask = async(req,res) =>{
    const {id} = req.params

    const sql = 
    `
    UPDATE note_tasks 
    SET isFinished = 1
    WHERE task_id = ?
    `
    try{
        const [response] = await db.execute(sql, [id])

        if(response.affectedRows === 0){
            return res.status(404).json({
                success : false,
                message : 'Note Not Found'
            })
        }

        return res.status(200).json({
            success : true,
            message : 'Task Finish update successfully',
            id : id
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success : false,
            message : 'There was an error updating finish tasks'
        })
    }
}



