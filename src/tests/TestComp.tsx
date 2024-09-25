type TestCompProps = {
  number: number
}

const TestComp: React.FC<TestCompProps> = ({ number }) => {
  return <h1>{number} Big</h1>
}

export default TestComp
