const Filter = ({ handleSearch }) => {
  return (
    <div>
      filter shown with
      <input placeholder="Search a name" onChange={handleSearch} />
    </div>
  );
};

export default Filter;
