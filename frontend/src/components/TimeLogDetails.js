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
        const response = await fetch('/api/editedtime', {
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
    <ul className="time-entries-list">
      <h3>Time Entries: </h3>
      {timeEntries.map((entry) => (<li key={entry._id} onClick={() => handleEntryClick(entry._id)} className={`time-entry 
      ${timeLogID === entry._id? 'selected' : ''}`}> 
      ID: {entry._id}, Project: {entry.projectTitle} Employee: {entry.selectedEmployee} Manager: {entry.selectedManager} 
      Time In: {entry.timeIn} Date In: {entry.dateIn} Time Out: {entry.timeOut} Date Out: {entry.dateOut}</li>))}
    </ul>
    <form onSubmit={handleSubmit}>
        <h3>Please Enter Fields to be Changed: </h3>
        <p>You selected Time Entry ID: {timeLogID}</p>
        <label>Edit Time In (Please Enter In Format: hr:min:sec AM/PM): </label>
            <input
            type="text"
            onChange={(e) => setEditedTimeIn(e.target.value)}
            value={editedTimeIn}
            />
        <p>You selected {editedTimeIn}</p>

        <label>Edit Time Out (Please Enter In Format: hr:min:sec AM/PM): </label>
            <input
            type="text"
            onChange={(e) => setEditedTimeOut(e.target.value)}
            value={editedTimeOut}
            />
        <p>You selected {editedTimeOut}</p>

        <label>Edit Date In: </label>
            <input
            type="date"
            onChange={(e) => setEditedDateIn(e.target.value)}
            value={editedDateIn}
            />
        <p>You selected {editedDateIn}</p>

        <label>Edit Date Out: </label>
            <input
            type="date"
            onChange={(e) => setEditedDateOut(e.target.value)}
            value={editedDateOut}
            />
        <p>You selected {editedDateOut}</p>

        <button type="submit">Submit</button>
    </form>
    <ul className="time-entries-list">
      <h3>Edit Requests: </h3>
      {editedtimeEntries.map(( entry ) => (<li key={entry._id} onClick={() => handleEditedEntryClick(entry._id)} className={`time-entry 
      ${editedtimeLogID === entry._id ? 'selected' : ''}`}> 
      ID: {entry.timeLogID}, Project: {entry.projectTitle} Employee: {entry.selectedEmployee} Manager: {entry.selectedManager} 
      Time In: {entry.editedTimeIn} Date In: {entry.editedDateIn} Time Out: {entry.editedTimeOut} Date Out: {entry.editedDateOut}</li>))}
    </ul>
    <p>You selected Edited Time Entry ID: {editedtimeLogID}</p>
    <button type="submit" onClick={confirmEdit}> Confirm</button>
    <p></p>
    <button type="submit" onClick={denyEdit}> Deny</button>
    </div>
  )
}

export default TimeLogDetails

