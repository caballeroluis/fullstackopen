import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({ comments }) => {
  const averageScore = () => {
    if (comments.length === 0) {
      return 0
    }
    const totalScore = comments.reduce((acc, score) => acc + score, 0)
    return totalScore / comments.length
  }

  const positivePercentage = () => {
    if (comments.length === 0) {
      return 0
    }
    const positiveCount = comments.filter((score) => score === 1).length
    return (positiveCount / comments.length) * 100
  }

  return (
    <div>
      <p>average {averageScore()}</p>
      <p>positive {positivePercentage()}%</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [comments, setComments] = useState([])

  const handleGoodClick = () => {
    setGood(good + 1)
    setComments([...comments, 1])
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setComments([...comments, 0])
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setComments([...comments, -1])
  }

  return (
    <div>
      <h1>give feedback</h1>

      <button onClick={handleGoodClick}>good</button>
      <button onClick={handleNeutralClick}>neutral</button>
      <button onClick={handleBadClick}>bad</button>

      <h1>statistics</h1>
      
      <p>good {good}</p>
      <p>neutral {neutral}</p>
      <p>bad {bad}</p>
      <p>all {comments.length}</p>

      {comments.length > 0 ? (
        <div>
          <Statistics comments={comments} />
        </div>
      ) : (
        <p>No feedback given yet.</p>
      )}
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App