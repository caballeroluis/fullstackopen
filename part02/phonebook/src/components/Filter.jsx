const Filter = ({ filterName, handleFilterNameChange }) => (
  <div>
    filter shown with name <input type="text" value={filterName} onChange={handleFilterNameChange} />
  </div>
)

export default Filter