import PropTypes from 'prop-types'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const successStyle = {
    ...notificationStyle,
    color: 'green',
    borderColor: 'green'
  }

  const errorStyle = {
    ...notificationStyle,
    color: 'red',
    borderColor: 'red'
  }

  const style = type === 'success' ? successStyle : errorStyle

  return (
    <div style={style}>
      {message}
    </div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error'])
}

export default Notification