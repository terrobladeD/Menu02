import React, { useState} from 'react';
import { Form } from 'react-bootstrap';

function Customise({ metaName, customises, onCustomiseChange, minSelection, maxSelection }) {
    const [selectedItems, setSelectedItems] = useState([]);

    const handleCheckboxChange = (event, customise) => {
        const isChecked = event.target.checked;
        let updatedSelectedItems = [];
    
        if (isChecked) {
          if (selectedItems.length >= maxSelection) {
            return;
          }
    
          updatedSelectedItems = [...selectedItems, customise];
          setSelectedItems(updatedSelectedItems);
        } else {
          updatedSelectedItems = selectedItems.filter(item => item.id !== customise.id);
          setSelectedItems(updatedSelectedItems);
        }
    
        const isSelected = updatedSelectedItems.some(item => item.id === customise.id);
        onCustomiseChange(customise, isSelected);
      };

    return (
        <div>
            <h5>{metaName}</h5>
            {(minSelection === maxSelection) && (
                <p>
                    <b>Mandatory</b> please choose {minSelection} below
                </p>
            )}
            {(minSelection !== maxSelection) && (
                <p>
                    please choose {minSelection} to {maxSelection} below
                </p>
            )}
            <Form>
                {customises.map(customise => (
                    <Form.Check
                        key={customise.id}
                        type="checkbox"
                        label={`${customise.name} (+${customise.price.toFixed(2)})`}
                        checked={selectedItems.some(item => item.id === customise.id)}
                        onChange={event => handleCheckboxChange(event, customise)}
                    />
                ))}
            </Form>
        </div>
    );
}

export default Customise;
