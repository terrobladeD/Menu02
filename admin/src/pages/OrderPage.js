import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl, Row, Col, Pagination } from 'react-bootstrap';
import './OrderPage.css';
import useWebSocket from 'react-use-websocket';
const WS_URL = 'ws://localhost:8080';

function OrderPage() {
    const [orders, setOrders] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

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
        fetchTotalOrdersByDate(selectedDate);
        fetchOrdersByDate(selectedDate, page, limit);
    }, [selectedDate, page, limit]);

    const fetchTotalOrdersByDate = async (date) => {
        try {
            const authData = JSON.parse(localStorage.getItem('authData'));
            const storeId = JSON.parse(localStorage.getItem('storeId'));
            const token = authData && authData.token;
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/order/bydate/total/${date}?store_id=${storeId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            const data = await response.json();
            if (data && data.count) {
                setTotalOrders(data.count);
            } else {
                setTotalOrders(0);
            }
        } catch (error) {
            console.error('Error fetching total orders:', error);
            setTotalOrders(0);
        }
    };


    const fetchOrdersByDate = async (date, page, limit) => {
        try {
            const authData = JSON.parse(localStorage.getItem('authData'));
            const storeId = JSON.parse(localStorage.getItem('storeId'));
            const token = authData && authData.token;
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/order/bydate/${date}?store_id=${storeId}&page=${page}&limit=${limit}`, {
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

    const handleLimitChange = (e) => {
        setLimit(parseInt(e.target.value));
        setPage(1);
    };

    const handlePageChange = (selectedPage) => {
        // Prevent pagination going beyond the total number of pages
        if (selectedPage <= Math.ceil(totalOrders / limit)) {
            setPage(selectedPage);
        }
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
                <Row className="justify-content-between">
                    <Col md="auto">
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Select Date</InputGroup.Text>
                            <FormControl type="date" value={selectedDate} onChange={handleDateChange} style={{ maxWidth: '200px' }} />
                        </InputGroup>
                    </Col>
                    <Col md="auto" className="d-flex align-items-center">
                        <Pagination>
                            <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                            <Pagination.Item>{page}</Pagination.Item>
                            <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page >= Math.ceil(totalOrders / limit)} />
                        </Pagination>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <InputGroup className="mb-3">
                            <InputGroup.Text>Limit</InputGroup.Text>
                            <FormControl as="select" value={limit} onChange={handleLimitChange} style={{ maxWidth: '100px' }}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </FormControl>
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
                            <th className="statusColumn">Status</th>
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

                                        {index === 0 && (
                                            <React.Fragment>
                                                <td rowSpan={order.details.length}>{order.additional_info}</td>
                                                <td rowSpan={order.details.length}>{order.total_price}</td>
                                                <td rowSpan={order.details.length}>
                                                    {order.status ? (
                                                        <Button variant="success" disabled>
                                                            Finished
                                                        </Button>
                                                    ) : (
                                                        <Button variant="warning" onClick={() => handleFinishStatus(order)}>
                                                            Not Finished
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

