const Notification = ({ notificationMessage }) => {
  if (notificationMessage === null) {
    return null
  }

  return (
    <div className='notification-message'>
      {notificationMessage}
    </div>
  )
}

export default Notification