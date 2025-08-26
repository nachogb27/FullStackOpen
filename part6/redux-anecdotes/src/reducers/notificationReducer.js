import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification(state, action) {
      return null
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

let timeoutId

export const createNotification = (message, timeInSeconds = 5) => {
  return dispatch => {
    dispatch(setNotification(message))
    
    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    // Set a new timeout
    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, timeInSeconds * 1000)
  }
}

export default notificationSlice.reducer