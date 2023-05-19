import { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import CustomiseForm from './CustomiseForm.component';


function EditDish(props) {
  const [name, setName] = useState(props.dish.name);
  const [short_name, setShortName] = useState(props.dish.short_name);
  const [description, setDescription] = useState(props.dish.description);
  const [full_description, setFullDescription] = useState(props.dish.full_description);
  const [price_ori, setPriceOri] = useState(props.dish.price_ori);
  const [price_cur, setPriceCur] = useState(props.dish.price_cur);
  const [dishtypeId, setDishtypeId] = useState(props.dish.dishtypeId);
  const [pict_url, setPictUrl] = useState(props.dish.pict_url);

  const [imageFile, setImageFile] = useState(null);
  const [dishTypes, setDishTypes] = useState([]);
  const [customises, setCustomises] = useState(props.dish.customises || []);



  useEffect(() => {
    const fetchDishTypes = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('authData'));
        const token = authData && authData.token;

        const response = await fetch(`http://localhost:8080/api/dishtype?store_id=store1`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching dish types');
        }

        const data = await response.json();
        setDishTypes(data);
      } catch (error) {
        console.error('Error fetching dish types:', error);
      }
    };

    fetchDishTypes();
  }, []);

  useEffect(() => {
    const formatCustomises = (customises) => {
      // Create an empty Map
      const customiseMap = new Map();

      customises.forEach((customise) => {
        const { meta_name, meta_seq, meta_min_tk, meta_max_tk, name, price } = customise;
        const key = `${meta_name}-${meta_seq}-${meta_min_tk}-${meta_max_tk}`;

        // If the key exists in the map update the choices array
        if (customiseMap.has(key)) {
          const oldCustomise = customiseMap.get(key);
          oldCustomise.choices.push({ name, priceChange: price });
          customiseMap.set(key, oldCustomise);
        }
        // If the key doesn't exist in the map, create a new object
        else {
          customiseMap.set(key, {
            name: meta_name,
            minChoice: Number(meta_min_tk),
            maxChoice: Number(meta_max_tk),
            choices: [{ name, priceChange: price }]
          });
        }
      });

      // Convert the Map values to an array and return
      return Array.from(customiseMap.values());
    };

    // Call the function to format the customises
    const formattedCustomises = formatCustomises(props.dish.customises);

    // Set the formatted customises to the state
    setCustomises(formattedCustomises);
  }, [props.dish.customises]);


  const handleEditClick = async (e) => {
    e.preventDefault();

    if (imageFile) {
      alert("Please upload image at first");
      return;
    }

    // Prepare the updated dish data
    const updatedDish = {
      name,
      short_name,
      description,
      full_description,
      price_ori,
      price_cur,
      dishtypeId,
      pict_url,
      customises
    };

    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      const token = authData && authData.token;
      const response = await fetch(`http://localhost:8080/api/dish/edit/${props.dish.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(updatedDish),
      });

      if (response.ok) {
        alert("Edit successful");
        window.location.reload();
      } else {
        console.error("Error updating dish:", response.statusText);
        alert("Error updating dish. Please try again.");
      }
    } catch (error) {
      console.error("Error updating dish:", error);
      alert("Error updating dish. Please try again.");
    }

  };

  // Function to handle file input change
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setPictUrl(URL.createObjectURL(e.target.files[0]));
  };

  // Function to call the backend API for image upload (left empty)
  const handleImageUpload = async () => {
    if (!imageFile) {
      alert("Please select an image to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("name", name);

      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData && authData.token;

      const response = await fetch("http://localhost:8080/images/upload", {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const imageUrl = `http://localhost:8080/images/${data.imageName}`;
        setPictUrl(imageUrl);
        alert("Picture update successful");
        setImageFile(null);
      } else {
        console.error("Error uploading image:", response.statusText);
        alert("Error uploading image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    }
  };

  return (
    <Container>
      <Row>
        <Col xs={7}>
          <div>
            <form>
              <div className="form-row">
                <div className="input-group d-flex align-items-center">
                  <label htmlFor="name" className="col-3">Name</label>
                  <input
                    type="text"
                    className="form-control col-9"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="input-group d-flex align-items-center">
                  <label htmlFor="short_name" className="col-3">Short Name</label>
                  <input
                    type="text"
                    className="form-control col-9"
                    id="short_name"
                    value={short_name}
                    onChange={(e) => setShortName(e.target.value)}
                  />
                </div>

                <div className="input-group d-flex align-items-center">
                  <label htmlFor="price_ori" className="col-3">Original Price</label>
                  <input
                    type="number"
                    step="any"
                    className="form-control col-9"
                    id="price_ori"
                    value={price_ori}
                    onChange={(e) => setPriceOri(e.target.value)}
                  />
                </div>

                <div className="input-group d-flex align-items-center">
                  <label htmlFor="price_cur" className="col-3">Current Price</label>
                  <input
                    type="number"
                    className="form-control col-9"
                    id="price_cur"
                    value={price_cur}
                    onChange={(e) => setPriceCur(e.target.value)}
                  />
                </div>

                <div className="input-group d-flex align-items-center">
                  <label htmlFor="type" className="col-3">Type</label>
                  <select
                    className="form-control col-9"
                    id="type"
                    value={dishtypeId}
                    onChange={(e) => setDishtypeId(e.target.value)}
                  >
                    {dishTypes.map(dishType => (
                      <option key={dishType.id} value={dishType.id}>
                        {dishType.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="input-group d-flex align-items-center my-3">
                <label htmlFor="description" className="col-3">Description</label>
                <textarea
                  className="form-control col-9"
                  id="description"
                  rows="1"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="input-group d-flex align-items-center my-3">
                <label htmlFor="full_description" className="col-3">Full Description</label>
                <textarea
                  className="form-control col-9"
                  id="full_description"
                  rows="3"
                  value={full_description}
                  onChange={(e) => setFullDescription(e.target.value)}
                />
              </div>

              <div className="input-group d-flex align-items-center my-3">
                <div className="d-flex">
                  <div className="col-6">
                    <label htmlFor="preview" className="d-block mb-2">Picture Preview</label>
                    <img
                      id="preview"
                      src={pict_url}
                      alt="Dish"
                      style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "20px" }}
                    />
                  </div>
                  <div className="d-flex flex-column col-6">
                    <label htmlFor="upload" className="mb-2">Upload New Picture</label>
                    <input
                      type="file"
                      className="form-control-file mb-2"
                      id="upload"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button
                      type="button"
                      className="btn btn-primary mt-auto"
                      onClick={handleImageUpload}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary col-12"
                onClick={handleEditClick}
              >          Submit
              </button>
            </form>
          </div>
        </Col>
        <Col xs={5}>
          <CustomiseForm customises={customises} setCustomises={setCustomises} />
        </Col>
      </Row>
    </Container>
  );
}



export default EditDish;

