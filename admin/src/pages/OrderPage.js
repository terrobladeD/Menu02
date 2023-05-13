import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Row, Col } from 'react-bootstrap';
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://localhost:8080';

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [dishNames, setDishNames] = useState({});
    const [dishShortNames, setDishShortNames] = useState({});
    const [showShortName, setShowShortName] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: (event) => {
            const newMessage = event.data;
            console.log('WebSocket received a new message:', newMessage);
            alert('New order has arrived!');
            fetchOrdersByDate(selectedDate);
        },
    });

    useEffect(() => {
        fetchDishNames();
        fetchOrdersByDate(selectedDate);
    }, [selectedDate]);

    const fetchDishNames = async () => {
        try {
            const authData = JSON.parse(localStorage.getItem('authData'));
            const token = authData && authData.token;
            const response = await fetch('http://localhost:8080/api/dish/all',{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            const dishNameMap = data.reduce((map, dish) => {
                map[dish.id] = dish.name;
                return map;
            }, {});
            setDishNames(dishNameMap);
            const dishShortNames = data.reduce((map, dish) => {
                map[dish.id] = dish.short_name;
                return map;
            }, {});
            setDishShortNames(dishShortNames);
        } catch (error) {
            console.error('Error fetching dish names:', error);
        }
    };

    const fetchOrdersByDate = async (date) => {
        try {
            const authData = JSON.parse(localStorage.getItem('authData'));
            const token = authData && authData.token;
            const response = await fetch(`http://localhost:8080/api/order/bydate/${date}`, {
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
        const token = authData && authData.token;
        if (!order.status) {
            fetch(`http://localhost:8080/api/order/status/${orderId}`, {
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
                            <th>Dish Name
                                <Button variant="link" style={{ fontSize: '0.8em' }} onClick={() => setShowShortName(!showShortName)}>
                                    {showShortName ? 'Short' : 'Full'}
                                </Button>
                            </th>
                            <th>Quantity</th>
                            <th style={{ width: '15vw' }}>Additional Info</th>
                            <th>Total Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                                {order.detail.map((detail, index) => (
                                    <tr key={detail.id}>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={order.detail.length}>{order.table_num}</td>
                                                <td rowSpan={order.detail.length}>{new Date(order.date).toLocaleTimeString()}</td>
                                            </>
                                        )}
                                        <td>{showShortName ? dishShortNames[detail.dishId] : dishNames[detail.dishId]}</td>
                                        <td>{detail.quantity}</td>
                                        {index === 0 && (
                                            <>
                                                <td rowSpan={order.detail.length}>{order.additional_info}</td>
                                                <td rowSpan={order.detail.length}>${order.total_price}</td>
                                                <td rowSpan={order.detail.length}>
                                                    <Button
                                                        variant={order.status ? "success" : "danger"}
                                                        onClick={() => handleFinishStatus(order)}
                                                    >
                                                        {order.status ? 'Finished' : 'Unfinished'}
                                                    </Button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </Table>
            )}
            {orders.length === 0 && <h1>You have No order so far</h1>}
        </div>
    );
}

export default OrderPage;