import { useState } from "react"

const TimeLogForm = () => {
  return (

   <form>

    <h3>Time Logging Form</h3>

    <label>Clock In Time: </label>
    <input type='number'/>

    <label>Clock Out Time: </label>
    <input type='number'/>

    <button type ='submit'>Submit Time</button>
   </form>
  )
}

export default TimeLogForm

