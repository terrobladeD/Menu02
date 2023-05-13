import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchOrdersByDate(selectedDate);
    }, [selectedDate]);

    const fetchOrdersByDate = async (date) => {
        try {
            const authData = JSON.parse(localStorage.getItem('authData'));
            const storeId = JSON.parse(localStorage.getItem('storeId'));
            const token = authData && authData.token;
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/order/bydate/${date}?store_id=${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            if (Array.isArray(data) && data.length) {
                const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedData);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setOrders([]);
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleFinishStatus = (order) => {
        const orderId = order.id;
        const authData = JSON.parse(localStorage.getItem('authData'));
        const storeId = JSON.parse(localStorage.getItem('storeId'));
        const token = authData && authData.token;
        if (!order.status) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/order/status/${orderId}?store_id=${storeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
                .then(response => response.json())
                .then(data => {
                    // Update the orders list with the updated status
                    const updatedOrders = orders.map(o => {
                        if (o.id === orderId) {
                            return { ...o, status: true };
                        }
                        return o;
                    });
                    setOrders(updatedOrders);
                    alert(`Order from ${order.table_num} finished`)
                })
                .catch(error => {
                    console.error('Error updating order status:', error);
                });
        }
    };

    return (
        <div>
            <h2>Orders by Date</h2>
            <div className="grid-form">
                <Row>
                    <Col>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Select Date</InputGroup.Text>
                            <FormControl type="date" value={selectedDate} onChange={handleDateChange} style={{ maxWidth: '200px' }} />
                        </InputGroup>
                    </Col>
                </Row>
            </div>
            {orders.length !== 0 && (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Table Number</th>
                            <th>Order Time</th>
                            <th>Dish Name</th>
                            <th>Qty</th>
                            <th>Additional Info</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                {order.details.map((detail, index) => (
                                    <tr key={index}>
                                        {index === 0 && (
                                            <React.Fragment>
                                                <td rowSpan={order.details.length}>{order.table_num}</td>
                                                <td rowSpan={order.details.length}>{new Date(order.date).toLocaleTimeString()}</td>
                                            </React.Fragment>
                                        )}
                                        <td>
                                            {detail.dish_name}
                                            <ul style={{ paddingLeft: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                                                {detail.customise_names !== "" && (

                                                    detail.customise_names.split(',').map((customise, i) => (
                                                        <li key={i} style={{ listStyleType: 'disc', margin: '0' }}>
                                                            {customise.trim()}
                                                        </li>
                                                    ))
                                                )
                                                }
                                            </ul>
                                        </td>
                                        <td>{detail.quantity}</td>
                                        <td>{detail.additional_info}</td>
                                        {index === 0 && (
                                            <React.Fragment>
                                                <td rowSpan={order.details.length}>{order.total_price}</td>
                                                <td rowSpan={order.details.length}>
                                                    {order.status ? (
                                                        <Button variant="success" disabled>
                                                            Finished
                                                        </Button>
                                                    ) : (
                                                        <Button variant="warning" onClick={() => handleFinishStatus(order)}>
                                                            Mark as Finished
                                                        </Button>
                                                    )}
                                                </td>
                                            </React.Fragment>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            )}
            {orders.length === 0 && <p>No orders found for the selected date.</p>}
        </div>
    );
}

export default OrderPage;

