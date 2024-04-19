import { useState, useEffect } from "react"

const TimeLogDetails = () => {
    const[timeEntries, setTimeEntries] = useState([])
    const[selectedID, setSelectedID] = useState([])

    useEffect(() => {
     fetchTimeEntries()
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

    const handleEntryClick=(id)=>{
        setSelectedID(id)
        console.log("You selected id:", id)
    }
    return (
    <div>
    <ul className="time-entries-list">
      <h3>Time Entries: </h3>
      {timeEntries.map((entry) => (<li key={entry._id} onClick={() => handleEntryClick(entry._id)} className={`time-entry 
      ${selectedID === entry._id? 'selected' : ''}`}> 
      ID: {entry._id}, Project: {entry.projectTitle} Employee: {entry.selectedEmployee} Manager: {entry.selectedManager} 
      Time In: {entry.timeIn} Date In: {entry.dateIn} Time Out: {entry.timeOut} Date Out: {entry.dateOut}</li>))}
    </ul>
    <p>You selected {selectedID}</p>
    </div>
  )
}

export default TimeLogDetails

