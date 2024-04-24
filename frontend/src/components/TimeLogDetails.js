import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext"

const TimeLogDetails = () => {
    const[timeEntries, setTimeEntries] = useState([])
    const[timeLogID, setTimeLogID] = useState('')

    const[editedTimeIn, setEditedTimeIn] = useState('')
    const[editedTimeOut, setEditedTimeOut] = useState('')
    const[editedDateIn, setEditedDateIn] = useState('')
    const[editedDateOut, setEditedDateOut] = useState('')

    const[editedtimeEntries, setEditedTimeEntries] = useState([])
    const[editedtimeLogID, setEditedTimeLogID] = useState('')

    const { user } = useAuthContext()
    const[error, setError] = useState(null)


    useEffect(() => {
     fetchTimeEntries()
     fetchEditedTimeEntries()
    }, [])

    const fetchTimeEntries = async () =>{
        const response = await fetch('/api/time')
        if(response.ok){
            const json = await response.json()
            setTimeEntries(json)
            console.log(json)
        }
        else{
            console.log("Failed to retrieve Time Entries")
        }
    }

    const fetchEditedTimeEntries = async () =>{
        const response = await fetch('/api/editedtime', 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`,
            }
        } )
        if(response.ok){
            const json = await response.json()
            setEditedTimeEntries(json)
            console.log(json)
        }
        else{
            console.log("Failed to retrieve Edited Time Entries")
        }
    }

    const handleEntryClick=(id)=>{
        setTimeLogID(id)
        console.log("You selected id:", id)
    }

    const handleEditedEntryClick=(id)=>{
        setEditedTimeLogID(id)
        console.log("You selected edited id:", id)
    }
    const handleSubmit = async (e)=>{
        e.preventDefault()
        const editedtimelog = {timeLogID, editedTimeIn, editedTimeOut, editedDateIn, editedDateOut}
        const response = await fetch('/api/time/edit', {
            method: 'POST',
            body: JSON.stringify(editedtimelog),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if(!response.ok) {
            setError(json.error)
        }
        if(response.ok)
        console.log("Submitted", json)
        setTimeLogID('')
        setEditedTimeIn('')
        setEditedTimeOut('')
        setEditedDateIn('')
        setEditedDateOut('')
        setError(null)

        fetchTimeEntries()
        fetchEditedTimeEntries()
    }

    const confirmEdit = async ()=>{
        for (let i = 0; i < editedtimeEntries.length; i++) {
            const entry = editedtimeEntries[i];

            if ( entry[["_id"]] == editedtimeLogID ) {
                const response = await fetch(`/api/time/${ entry["timeLogID"] }`, {
                method: 'PATCH',
                body: JSON.stringify( entry ),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                }
                })
                const json = await response.json()
                if(!response.ok) {
                    setError(json.error)
                }

                const resp = await fetch(`/api/editedTime/${ entry["_id"] }`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
                })
                const json2 = await resp.json()
                if(!resp.ok) {
                    setError(json2.error)
                }


            }
        }
        fetchTimeEntries()
        fetchEditedTimeEntries()      
    }

    const denyEdit = async ()=>{

        const resp = await fetch(`/api/editedTime/${ editedtimeLogID }`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        const json2 = await resp.json()
        if(!resp.ok) {
            setError(json2.error)
        }


        fetchTimeEntries()
        fetchEditedTimeEntries()      
    }


    return (
    <div>
        <h3>Time Entries: </h3>
        <ul className="edit-requests">
        {timeEntries.map((entry) => (
        <div className="time-entry-card" key={entry._id}>
            <li
            onClick={() => handleEntryClick(entry._id)}
            className={`time-entry ${timeLogID === entry._id ? 'selected' : ''}`}
            >
            <h4>Time Entry: {entry._id}</h4>
        <p><strong>Project: </strong>{entry.projectTitle}</p>
        <p className="employee-info"><strong>Employee: </strong>{entry.selectedEmployee}</p>
        <p className="manager-info"><strong>Manager: </strong>{entry.selectedManager}</p>
        <p><strong>Time In: </strong>{entry.timeIn}</p>
        <p><strong>Date In: </strong>{entry.fateIn}</p>
        <p><strong>Time Out: </strong>{entry.timeOut}</p>
        <p><strong>Date Out: </strong>{entry.dateOut}</p>
            </li>
        </div>
        ))}
        </ul>
        {timeLogID && (
        <form onSubmit={handleSubmit} className="project-form">
            <h3>Please Enter Fields to be Changed:</h3>
            <p>You selected Time Entry ID: {timeLogID}</p>

            <div className="form-group">
                <label htmlFor="editedTimeIn">Edit Time In (Format: hh:mm:ss AM/PM)</label>
                <input
                type="text"
                id="editedTimeIn"
                onChange={(e) => setEditedTimeIn(e.target.value)}
                value={editedTimeIn}
                placeholder="Enter new time in"
                />
            </div>

            <div className="form-group">
                <label htmlFor="editedTimeOut">Edit Time Out (Format: hh:mm:ss AM/PM)</label>
                <input
                type="text"
                id="editedTimeOut"
                onChange={(e) => setEditedTimeOut(e.target.value)}
                value={editedTimeOut}
                placeholder="Enter new time out"
                />
            </div>

            <div className="form-group">
                <label htmlFor="editedDateIn">Edit Date In:</label>
                <input
                type="date"
                id="editedDateIn"
                onChange={(e) => setEditedDateIn(e.target.value)}
                value={editedDateIn}
                />
            </div>

            <div className="form-group">
                <label htmlFor="editedDateOut">Edit Date Out:</label>
                <input
                type="date"
                id="editedDateOut"
                onChange={(e) => setEditedDateOut(e.target.value)}
                value={editedDateOut}
                />
            </div>

            <button type="submit" className="button">Submit</button>
            </form>
            )}

    {user?.privilege !== "employee" &&
    <div>
        <h3>Edit Requests: </h3>
    <ul className="edit-requests">
  {editedtimeEntries.map((entry) => (
    <div className="time-entry-card" key={entry._id}>
      <li
        onClick={() => handleEditedEntryClick(entry._id)}
        className={`time-entry ${editedtimeLogID === entry._id ? 'selected' : ''}`}
      >
        <h4>Edit Request: {entry.timeLogID}</h4>
        <p><strong>Project: </strong>{entry.projectTitle}</p>
        <p className="employee-info"><strong>Employee: </strong>{entry.selectedEmployee}</p>
        <p className="manager-info"><strong>Manager: </strong>{entry.selectedManager}</p>
        <p><strong>Time In: </strong>{entry.editedTimeIn}</p>
        <p><strong>Date In: </strong>{entry.editedDateIn}</p>
        <p><strong>Time Out: </strong>{entry.editedTimeOut}</p>
        <p><strong>Date Out: </strong>{entry.editedDateOut}</p>
      </li>
    </div>
  ))}
</ul>
    {editedtimeLogID && (
    <div className="edited-time-entry">
        <p className="time-entry-info">You selected Edited Time Entry ID: {editedtimeLogID}</p>
        <div className="button-container">
        <button className="button accept-button" type="submit" onClick={confirmEdit}>Accept</button>
        <button className="button deny-button" type="submit" onClick={denyEdit}>Deny</button>
        </div>
    </div>
    )}
    </div>
    }
    </div>
  )
}

export default TimeLogDetails

