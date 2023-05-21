import React from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';

const newCustomiseTemplate = { name: "", minChoice: 0, maxChoice: 1, choices: [{ name: "", priceChange: 0 }] };
const newChoiceTemplate = { name: "", priceChange: 0 };

const CustomiseForm = ({ customises, setCustomises }) => {
  const handleChoiceChange = (customiseIndex, choiceIndex, event, property) => {
    let customisesCopy = JSON.parse(JSON.stringify(customises));
    let value = event.target.value;
    // ensure priceChange is not less than 0
    if (property === 'priceChange') {
      value = Math.max(0, value);
    } else if (property === 'name') {
      value = value.trim();  // remove leading and trailing white spaces
      if (value === '') return;  // do not update if name is empty
    }
    customisesCopy[customiseIndex].choices[choiceIndex][property] = value;
    setCustomises(customisesCopy);
  };

  const handleCustomiseChange = (index, event, property) => {
    let customisesCopy = JSON.parse(JSON.stringify(customises));
    let value = event.target.value;
    // apply restrictions on minChoice and maxChoice
    if (property === 'minChoice') {
      value = Math.max(0, Math.min(customisesCopy[index].maxChoice, value));
    } else if (property === 'maxChoice') {
      value = Math.max(1, Math.min(customisesCopy[index].choices.length, value));
    } else if (property === 'name') {
      value = value.trim();  // remove leading and trailing white spaces
      if (value === '') return;  // do not update if name is empty
    }
    customisesCopy[index][property] = value;
    setCustomises(customisesCopy);
  };

  const handleAddCustomise = () => {
    let customisesCopy = JSON.parse(JSON.stringify(customises));
    customisesCopy.push(JSON.parse(JSON.stringify(newCustomiseTemplate)));
    setCustomises(customisesCopy);
  };

  const handleAddChoice = (customiseIndex) => {
    let customisesCopy = JSON.parse(JSON.stringify(customises));
    customisesCopy[customiseIndex].choices.push(JSON.parse(JSON.stringify(newChoiceTemplate)));
    // ensure maxChoice is at least the number of choices
    customisesCopy[customiseIndex].maxChoice = Math.max(customisesCopy[customiseIndex].maxChoice, customisesCopy[customiseIndex].choices.length);
    setCustomises(customisesCopy);
  };

  const handleRemoveChoice = (customiseIndex, choiceIndex) => {
    let customisesCopy = JSON.parse(JSON.stringify(customises));
    // prevent removing the last choice
    if (customisesCopy[customiseIndex].choices.length > 1) {
      customisesCopy[customiseIndex].choices.splice(choiceIndex, 1);
      // ensure maxChoice is at most the number of choices
      customisesCopy[customiseIndex].maxChoice = Math.min(customisesCopy[customiseIndex].maxChoice, customisesCopy[customiseIndex].choices.length);
      // ensure minChoice is at most maxChoice
      customisesCopy[customiseIndex].minChoice = Math.min(customisesCopy[customiseIndex].minChoice, customisesCopy[customiseIndex].maxChoice);
    }
    setCustomises(customisesCopy);
  };

  const handleRemoveCustomise = (index) => {
    let newCustomises = JSON.parse(JSON.stringify(customises));
    newCustomises.splice(index, 1);
    setCustomises(newCustomises);
  };


  return (
    <Container>
      {customises.map((customise, index) => (
        <div key={index}>
          <Row>
            <Col xs="auto" style={{ paddingLeft: 0 }}>
              <Button variant="danger" onClick={() => handleRemoveCustomise(index)}>-</Button>
            </Col>
            <Col xs={5} style={{ padding: 0 }}><Form.Control type="text" value={customise.name} onChange={event => handleCustomiseChange(index, event, 'name')} /></Col>
            <Col xs={2} style={{ padding: 0 }}><Form.Control type="number" value={customise.minChoice} onChange={event => handleCustomiseChange(index, event, 'minChoice')} /></Col>
            <Col xs={2} style={{ padding: 0 }}><Form.Control type="number" value={customise.maxChoice} onChange={event => handleCustomiseChange(index, event, 'maxChoice')} /></Col>
          </Row>
          {customise.choices && customise.choices.map((choice, choiceIndex) => (
            <Row className="pl-5" key={choiceIndex} style={{ paddingLeft: '8px' }}>
              <Col xs="auto">
                <Button variant="danger" onClick={() => handleRemoveChoice(index, choiceIndex)}>-</Button>
              </Col>
              <Col xs={5}><Form.Control type="text" value={choice.name} onChange={event => handleChoiceChange(index, choiceIndex, event, 'name')} /></Col>
              <Col xs={3}><Form.Control type="number" value={choice.priceChange} onChange={event => handleChoiceChange(index, choiceIndex, event, 'priceChange')} /></Col>

              {choiceIndex === customise.choices.length - 1 && <Col xs={1}><Button variant="primary" onClick={() => handleAddChoice(index)}>+</Button></Col>}

            </Row>
          ))}
          {index === customises.length - 1 && <Row><Button variant="success" className="mt-2" onClick={handleAddCustomise}>Add Customise +</Button></Row>}
        </div>
      ))}
      {customises.length === 0 && <Button variant="success" className="mt-2" onClick={handleAddCustomise}>Add Customise +</Button>}
    </Container>
  );
};

export default CustomiseForm;
