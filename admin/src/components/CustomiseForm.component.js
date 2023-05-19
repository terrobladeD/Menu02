import React, { useState } from 'react';
import { Button, Form, Row, Col, Container } from 'react-bootstrap';

const CustomiseForm = ({ customises, setCustomises }) => {
  const [newCustomise, setNewCustomise] = useState({ name: "", minChoice: 0, maxChoice: 0, choices: [{ name: "", priceChange: 0 }] });

  const handleNewChoiceChange = (index, event, property) => {
    let choices = [...newCustomise.choices];
    choices[index][property] = event.target.value;
    setNewCustomise({ ...newCustomise, choices: choices });
  };

  const handleCustomiseChange = (index, event, property) => {
    let customisesCopy = [...customises];
    customisesCopy[index][property] = event.target.value;
    setCustomises(customisesCopy);
  };

  const handleAddCustomise = () => {
    setCustomises([...customises, newCustomise]);
    setNewCustomise({ name: "", minChoice: 0, maxChoice: 0, choices: [{ name: "", priceChange: 0 }] });
  };

  const handleAddChoice = () => {
    setNewCustomise(prevState => ({ ...prevState, choices: [...prevState.choices, { name: "", priceChange: 0 }] }));
  };

  const handleRemoveChoice = (index) => {
    let choices = [...newCustomise.choices];
    choices.splice(index, 1);
    setNewCustomise({ ...newCustomise, choices: choices });
  };

  const handleRemoveCustomise = (index) => {
    let newCustomises = [...customises];
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
            <Row className="pl-5" key={choiceIndex}>
              <Col xs="auto">
                <Button variant="danger" onClick={() => handleRemoveChoice(choiceIndex)}>-</Button>
              </Col>
              <Col xs={5}><Form.Control type="text" value={choice.name} onChange={event => handleNewChoiceChange(choiceIndex, event, 'name')} /></Col>
              <Col xs={3}><Form.Control type="number" value={choice.priceChange} onChange={event => handleNewChoiceChange(choiceIndex, event, 'priceChange')} /></Col>
              {choiceIndex === customise.choices.length - 1 && <Col xs={2}><Button variant="primary" onClick={handleAddChoice}>+</Button></Col>}
            </Row>
          ))}
          {index === customises.length - 1 && <Row><Button variant="success" className="mt-2" onClick={handleAddCustomise}>Add Customise +</Button></Row>}
        </div>
      ))}
    </Container>
  );
};

export default CustomiseForm;
