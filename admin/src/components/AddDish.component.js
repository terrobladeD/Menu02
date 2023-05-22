import { useState, useEffect } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import CustomiseForm from './CustomiseForm.component';


function AddDish() {
  const [name, setName] = useState();
  const [short_name, setShortName] = useState();
  const [description, setDescription] = useState();
  const [full_description, setFullDescription] = useState();
  const [price_ori, setPriceOri] = useState();
  const [price_cur, setPriceCur] = useState();
  const [dishtypeId, setDishtypeId] = useState();
  const [pict_url, setPictUrl] = useState();

  const [imageFile, setImageFile] = useState(null);
  const [dishTypes, setDishTypes] = useState([]);
  const [customises, setCustomises] = useState([]);



  useEffect(() => {
    const fetchDishTypes = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem('authData'));
        const storeId = JSON.parse(localStorage.getItem('storeId'));
        const token = authData && authData.token;

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishtype?store_id=${storeId}`, {
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

  //format the custmoise into the way that database known
  const unformatCustomises = (formattedCustomises) => {
    const unformattedCustomises = [];
    const metaSeqMap = {};

    formattedCustomises.forEach((customise) => {
      const { name: meta_name, minChoice, maxChoice, choices } = customise;

      if (!metaSeqMap[meta_name]) {
        // if this meta_name does not exist in the map, add it with initial seq as 1
        metaSeqMap[meta_name] = 1;
      } else {
        // if this meta_name exists in the map, increase its seq
        metaSeqMap[meta_name] += 1;
      }

      choices.forEach((choice) => {
        unformattedCustomises.push({
          meta_name,
          meta_seq: metaSeqMap[meta_name].toString(),
          meta_min_tk: minChoice,
          meta_max_tk: maxChoice,
          name: choice.name,
          price: choice.priceChange,
        });
      });
    });

    return unformattedCustomises;
  };



  const handleEditClick = async (e) => {
    e.preventDefault();

    if (imageFile) {
      alert("Please upload image at first");
      return;
    }

    const unformattedCustomises = unformatCustomises(customises);

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
      customises: unformattedCustomises
    };

    try {
      const authData = JSON.parse(localStorage.getItem('authData'));
      const storeId = JSON.parse(localStorage.getItem('storeId'));
      const token = authData && authData.token;
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/papi/dish/add?store_id=${storeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(updatedDish),
      });

      if (response.ok) {
        alert("Add successful");
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

    // Revoke the old URL if it exists
    if (pict_url) {
      URL.revokeObjectURL(pict_url);
    }

    // Create a new URL
    const newUrl = URL.createObjectURL(e.target.files[0]);

    setPictUrl(newUrl);
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

      const authData = JSON.parse(localStorage.getItem("authData"));
      const token = authData && authData.token;

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/images/upload`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      if (response.ok) {
        if (pict_url) {
          URL.revokeObjectURL(pict_url);
        }
        const data = await response.json();
        const imageUrl = `${process.env.REACT_APP_API_BASE_URL}/images/${data.imagePath}`;
        setPictUrl(imageUrl);
        alert("Picture upload successful");
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
                    onChange={(e) => setPriceOri(Number(e.target.value))}
                  />
                </div>

                <div className="input-group d-flex align-items-center">
                  <label htmlFor="price_cur" className="col-3">Current Price</label>
                  <input
                    type="number"
                    className="form-control col-9"
                    id="price_cur"
                    value={price_cur}
                    onChange={(e) => setPriceCur(Number(e.target.value))}
                  />
                </div>

                <div className="input-group d-flex align-items-center">
                  <label htmlFor="type" className="col-3">Type</label>
                  <select
                    className="form-control col-9"
                    id="type"
                    value={dishtypeId}
                    onChange={(e) => setDishtypeId(Number(e.target.value))}
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



export default AddDish;

