import { useState, useEffect } from "react";
import EditDish from "../components/EditDish.component";
import AddDish from "../components/AddDish.component";
import { Tooltip, OverlayTrigger } from "react-bootstrap";


function DishPage() {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [sort, setSort] = useState({ field: 'name', order: 'asc' });
  const [showAddDishModal, setShowAddDishModal] = useState(false);
  // const [dishTypeMap, setDishTypeMap] = useState({});



  useEffect(() => {
    async function fetchData() {
      try {
        const storeId = JSON.parse(localStorage.getItem('storeId'));
        const authData = JSON.parse(localStorage.getItem('authData'));
        const token = authData && authData.token;

        const dishResponse = fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/dish/all?store_id=${storeId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });

        const dishTypeResponse = fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishtype?store_id=${storeId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });

        const [dishesRes, dishTypesRes] = await Promise.all([dishResponse, dishTypeResponse]);

        if (!dishesRes.ok || !dishTypesRes.ok) {
          throw new Error('Error fetching data');
        }

        const dishesData = await dishesRes.json();
        const dishTypesData = await dishTypesRes.json();

        const dishTypeMap = dishTypesData.reduce((map, dishType) => {
          map[dishType.id] = dishType.type;
          return map;
        }, {});

        const updatedDishes = dishesData.map(dish => ({
          ...dish,
          type: dishTypeMap[dish.dishtypeId],
        }));

        setDishes(updatedDishes);
      } catch (error) {
        console.error('Error fetching data:', error);
        setDishes([]);
      }
    }

    fetchData();
  }, []);




  const InStockTooltip = (props) => (
    <Tooltip id="sold-out-tooltip" {...props}>
      It makes a dish sold out or in stock.
    </Tooltip>
  );

  const validTooltip = (props) => (
    <Tooltip id="valid-tooltip" {...props}>
      It makes a dish invalid or valid. Invalid items will be invisible to customers.
    </Tooltip>
  );

  const handleSoldOutToggle = async (dish) => {
    try {
      const storeId = JSON.parse(localStorage.getItem('storeId'));
      const authData = JSON.parse(localStorage.getItem('authData'));
      const token = authData && authData.token;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/dish/instock/${dish.id}?store_id=${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
      });

      if (response.ok) {
        const updatedDishes = dishes.map((d) => {
          if (d.id === dish.id) {
            return { ...d, is_instock: !d.is_instock };
          }
          return d;
        });
        if (dish.is_instock) {
          alert(`${dish.name} was put sold out`);
        } else {
          alert(`${dish.name} was put in stock`);
        }
        setDishes(updatedDishes);
      } else {
        throw new Error('Failed to update sold out status');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the sold out status. Please try again.');
    }
  };

  const handleValidToggle = async (dish) => {
    try {
      const storeId = JSON.parse(localStorage.getItem('storeId'));
      const authData = JSON.parse(localStorage.getItem('authData'));
      const token = authData && authData.token;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/dish/valid/${dish.id}?store_id=${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
      });

      if (response.ok) {
        const updatedDishes = dishes.map((d) => {
          if (d.id === dish.id) {
            return { ...d, is_valid: !d.is_valid };
          }
          return d;
        });
        if (dish.is_valid) {
          alert(`${dish.name} was put Invalid`);
        } else {
          alert(`${dish.name} was put Valid`);
        }
        setDishes(updatedDishes);
      } else {
        throw new Error('Failed to update valid status');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while updating the valid status. Please try again.');
    }
  };


  const handleEditClick = (dish) => {
    setSelectedDish(dish);
  };

  const handleDeleteClick = async (dish) => {
    if (window.confirm(`Are you sure you want to delete ${dish.name}?`)) {
      try {
        const storeId = JSON.parse(localStorage.getItem('storeId'));
        const authData = JSON.parse(localStorage.getItem('authData'));
        const token = authData && authData.token;

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/dish/delete/${dish.id}?store_id=${storeId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });

        if (response.ok) {
          const updatedDishes = dishes.filter((d) => d.id !== dish.id);
          setDishes(updatedDishes);
          setSelectedDish(null);
          alert("Delete successful!");
        } else {
          throw new Error('Failed to delete dish');
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the dish. Please try again.');
      }
    }
  };


  const handleEditSubmit = () => {
    alert("Edit successful!");
  };

  const handleSort = (field) => {
    const newOrder = sort.field === field && sort.order === 'asc' ? 'desc' : 'asc';
    setSort({ field, order: newOrder });
  };

  const sortedDishes = () => {
    const compare = (a, b) => {
      if (a[sort.field] < b[sort.field]) return sort.order === 'asc' ? -1 : 1;
      if (a[sort.field] > b[sort.field]) return sort.order === 'asc' ? 1 : -1;
      return 0;
    };

    return dishes.slice().sort(compare);
  };

  const openAddDishModal = () => {
    setShowAddDishModal(true);
  };

  const closeAddDishModal = () => {
    setShowAddDishModal(false);
  };

  return (
    <div className="container mt-5">
      <h1>Dish List</h1>
      <button onClick={openAddDishModal} className="btn btn-primary">
        Add Dish
      </button>

      {showAddDishModal && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Dish</h5>
                <button type="button" className="btn-close" onClick={closeAddDishModal}></button>
              </div>
              <div className="modal-body">
                <AddDish />
              </div>
            </div>
          </div>
        </div>
      )}

      <table className="table mt-3">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name
              {sort.field === 'name' && (sort.order === 'asc' ? '▲' : '▼')}</th>
            <th onClick={() => handleSort('type')}>Type
              {sort.field === 'type' && (sort.order === 'asc' ? '▲' : '▼')}</th>
            <th>Price (Original)</th>
            <th>Price (Current)</th>
            <th>
              In Stock{" "}
              <OverlayTrigger placement="top" overlay={InStockTooltip}>
                <button className="btn btn-sm btn-info" style={{ fontSize: "0.6rem" }}>
                  ?
                </button>
              </OverlayTrigger>
            </th>
            <th>
              Valid{" "}
              <OverlayTrigger placement="top" overlay={validTooltip}>
                <button className="btn btn-sm btn-info" style={{ fontSize: "0.6rem" }}>
                  ?
                </button>
              </OverlayTrigger>
            </th>
            <th >Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedDishes().map((dish) => (
            <tr key={dish.id}>
              <td>{dish.name}</td>
              <td>{dish.type}</td>
              <td>{dish.price_ori}</td>
              <td>{dish.price_cur}</td>
              <td>
                <button
                  className={`btn btn-${!dish.is_instock ? "danger" : "success"}`}
                  onClick={() => handleSoldOutToggle(dish)}
                >
                  {dish.is_instock ? "Yes" : "No"}
                </button>
              </td>
              <td>
                <button
                  className={`btn btn-${dish.is_valid ? "success" : "danger"}`}
                  onClick={() => handleValidToggle(dish)}
                >
                  {dish.is_valid ? "Yes" : "No"}
                </button>
              </td>
              <td >
                <button className="btn btn-primary mx-2" onClick={() => handleEditClick(dish)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteClick(dish)}>
                  Delete
                </button>
              </td>
            </tr>
          ))
          }
        </tbody>
      </table>
      {selectedDish && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show d-block" role="dialog" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Dish</h5>
                  <button type="button" className="close" onClick={() => setSelectedDish(null)}>
                    <span>&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <EditDish dish={selectedDish} onSubmit={handleEditSubmit} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

export default DishPage;
