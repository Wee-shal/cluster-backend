import {useState, useEffect} from 'react';

const TableComponent = () => {
    const [data, setData] = useState([]);

  useEffect(() => {
    //  API
    fetch('/api/data')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <div style={{textAlign:'center'}}>
    <table style={{margin: '0 auto'}}>
      <thead>
        <tr>
          <th style={thStyle}>ID</th>
          <th style={thStyle}>TimeStamp</th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Call duration</th>
          <th style={thStyle}>Rate/min</th>
          <th style={thStyle}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {/*Dynamic table rows*/}
        {data.map(item => (
            <tr key={item._id}>
              <td style={tdStyle}>{item.transactid ? item.transactid : item._id}</td>
              <td style={tdStyle}>{item.timeStamp}</td>
              <td style={tdStyle}>{item.helper}</td>
              <td style={tdStyle}>{item.duration}</td>
              <td style={tdStyle}>{item.rate}</td>
              <td style={tdStyle}>{item.amount}</td>
             
            </tr>
          ))}
      </tbody>
    </table>
    </div>
  );
};
const tableStyle = {
    borderCollapse: 'collapse',
    width: '100%',
  };
  
  const thStyle = {
    border: '1px solid #dddddd', // Border for table header cells
    padding: '8px',
    textAlign: 'left',
  };
  
  const tdStyle = {
    border: '1px solid #dddddd', // Border for table data cells
    padding: '8px',
    textAlign: 'left',
  };
  


export default TableComponent;
