const Finder = ({ filter, onFilterChange }) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input
        type="text"
        id="search"
        value={filter}
        onChange={onFilterChange}
      />
    </div>
  )
}

export default Finder
