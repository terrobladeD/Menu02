import React, { useState, useEffect } from 'react';

function HomePage() {
  const [data, setData] = useState([]);

  const fetchMonthlyOrderSummary = async () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      const storeId = JSON.parse(localStorage.getItem('storeId'));
      const token = authData && authData.token;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/order/monthlysummary?store_id=${storeId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await response.json();
      if (data.daily_summary) {
        const sortedData = data.daily_summary.sort((a, b) => new Date(b.date) - new Date(a.date));
        setData(sortedData);
      } else {
        console.error('data.daily_summary is undefined');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchMonthlyOrderSummary();
  }, []);

  return (
    <div>
      <h1>Order Summary for the Past 30 Days</h1>
      <table style={{ width: '100%', border: '1px solid black', textAlign: 'center' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Date</th>
            <th style={{ border: '1px solid black' }}>Total Orders</th>
            <th style={{ border: '1px solid black' }}>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black' }}>{item.date}</td>
              <td style={{ border: '1px solid black' }}>{item.total_orders}</td>
              <td style={{ border: '1px solid black' }}>{item.total_price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomePage;
