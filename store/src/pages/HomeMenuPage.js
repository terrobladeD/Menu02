import React, { useContext, useRef, useEffect } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppContext from '../context/AppContext';
import LeftSidebar from '../components/LeftSidebar.component';
import RightMainbar from '../components/RightMainbar.component';
import StickyFooter from '../components/StickyFooter.component';
import '../App.css';

function HomeMenuPage() {
    const { storeInfo } = useContext(AppContext);
    const homeSectionRef = useRef();
    const menuSectionRef = useRef();
    const scrollToTypeRef = useRef();


    const windowHeight = window.innerHeight;

    const handleTouchStart = (event) => {
        const startY = event.touches[0].clientY;

        const handleTouchMove = (event) => {
            const endY = event.touches[0].clientY;

            if (startY - endY > 0) {
                // Swiping up
                homeSectionRef.current.style.transform = `translateY(-${windowHeight}px)`;
                menuSectionRef.current.style.transform = `translateY(-${windowHeight}px)`;
              } else {
                // Swiping down
                homeSectionRef.current.style.transform = `translateY(0)`;
                menuSectionRef.current.style.transform = `translateY(0)`;
              }

            document.body.removeEventListener('touchmove', handleTouchMove);
        };

        document.body.addEventListener('touchmove', handleTouchMove);
    };

    useEffect(() => {
        document.body.style.overflowY = 'hidden';
        document.body.addEventListener('touchstart', handleTouchStart);

        return () => {
            document.body.style.overflowY = 'auto';
            document.body.removeEventListener('touchstart', handleTouchStart);
        };
    }, []);

    if (!storeInfo) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div
                ref={homeSectionRef}
                className="home-page"
                style={{ height: windowHeight, position: 'absolute', width: '100%', transition: 'transform 0.5s ease-in-out' }}
            >
                <div className="image-container">
                    <img
                        src={storeInfo.top_pict_link}
                        alt="restaurant img"
                        className="w-100"
                    />
                </div>
                <div>
                    <div className="mt-4">
                        <Button as={Link} to="/menu" variant="primary">
                            Explore Menu
                        </Button>
                    </div>
                    <div className="mt-4">
                        <p>
                            {storeInfo.description}
                            <br />
                            Contact us: <br />
                            Email: example@example.com <br />
                            Phone: +1 (123) 456-7890
                        </p>
                    </div>
                    <div className="mt-4">
                        <small>
                            &copy; {new Date().getFullYear()} Uptop Eats Pty.Ltd. All rights
                            reserved.
                        </small>
                    </div>
                </div>
            </div>
            <div ref={menuSectionRef}
                style={{ height: windowHeight, position: 'absolute', width: '100%', top: windowHeight + window.innerHeight * 0.08, transition: 'transform 0.5s ease-in-out' }}

            >
                <Container fluid>
                    <div style={{ position: 'sticky', top: '8vh', zIndex: 100 }}>
                        <LeftSidebar scrollToTypeRef={scrollToTypeRef} />
                    </div>
                    <Row className="h-100">
                        <RightMainbar scrollToTypeRef={scrollToTypeRef} />
                    </Row>
                </Container>
                <StickyFooter />
            </div>
        </>
    );

}

export default HomeMenuPage;
