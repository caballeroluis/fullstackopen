const Notification = ({ notificationMessage }) => {
  if (notificationMessage === null) {
    return null
  }

  const isError = notificationMessage.toLowerCase().includes('error')
  const additionalClass = isError ? 'notification-error-message' : ''

  return (
    <div className={`notification-message ${additionalClass}`}>
      {notificationMessage}
    </div>
  )
}

export default Notification