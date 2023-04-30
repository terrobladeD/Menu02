import React, { useRef } from 'react';
import { Container, Row} from 'react-bootstrap';
import LeftSidebar from "../components/LeftSidebar.component";
import RightMainbar from "../components/RightMainbar.component";
import StickyFooter from '../components/StickyFooter.component';
import '../App.css'

function MenuPage() {
  const scrollToTypeRef = useRef();

  return (
    <>
      <Container fluid>
        <div style={{ position: 'sticky', top: '8vh', zIndex: 100 }}>
            <LeftSidebar scrollToTypeRef={scrollToTypeRef} />
        </div>
        <Row className="h-100">
            <RightMainbar scrollToTypeRef={scrollToTypeRef} />
        </Row>
      </Container>
      <StickyFooter />
    </>
  );
}

export default MenuPage;
