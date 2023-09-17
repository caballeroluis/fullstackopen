const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const Header = (props) => {
    return (
      <h1>{props.course}</h1>
    )
  }

  const Content = (props) => {
    return (
      <div>
        <Part part={props.part1} exercises={props.part1} />
        <Part part={props.part2} exercises={props.part2} />
        <Part part={props.part3} exercises={props.part3} />
      </div>
    )
  }

  const Total = (props) => {
    return (
      <p>Number of exercises {props.part1.exercises + props.part2.exercises + props.part3.exercises}</p>
    )
  }

  const Part = (props) => {
    return (
      <div>
        <p>
          {props.part} {props.exercises}
        </p>
      </div>
    );
  };

  return (
    <div>
      <Header course={course} />
      <Content
        part1={part1.name} exercises1={part1.exercises}
        part2={part2.name} exercises2={part2.exercises}
        part3={part3.name} exercises3={part3.exercises}
      />
      <Total part1={part1} part2={part2} part3={part3} />
    </div>
  )
}

export default App