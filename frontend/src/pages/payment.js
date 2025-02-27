import React, { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

const PaymentPage = () => {
  const [selectedPackage, setSelectedPackage] = useState('');

  const handlePackageSelect = (packageName) => {
    setSelectedPackage(packageName);
  };

  const handleSubmitPayment = () => {
    // Add your logic to handle the payment and room listing
    alert(`You have selected the ${selectedPackage} package. Proceeding with payment...`);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center">Choose Your Room Listing Package</h3>
      <Row className="justify-content-center">
        {/* Standard Package */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Standard Package</Card.Title>
              <Card.Text>Price: Rs. 500</Card.Text>
              <Card.Text>Basic listing with standard visibility.</Card.Text>
              <Button
                variant="primary"
                onClick={() => handlePackageSelect('Standard')}
                disabled={selectedPackage === 'Standard'}
              >
                Select
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Premium Package 1 */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Premium Package 1</Card.Title>
              <Card.Text>Price: Rs. 1,000</Card.Text>
              <Card.Text>Increased visibility and priority placement for your room listing.</Card.Text>
              <Button
                variant="primary"
                onClick={() => handlePackageSelect('Premium 1')}
                disabled={selectedPackage === 'Premium 1'}
              >
                Select
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Premium Package 2 */}
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Premium Package 2</Card.Title>
              <Card.Text>Price: Rs. 1,500</Card.Text>
              <Card.Text>Maximized visibility with special promotions and extra features.</Card.Text>
              <Button
                variant="primary"
                onClick={() => handlePackageSelect('Premium 2')}
                disabled={selectedPackage === 'Premium 2'}
              >
                Select
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {selectedPackage && (
        <div className="text-center mt-4">
          <h4>You have selected the {selectedPackage} package.</h4>
          <Button variant="success" onClick={handleSubmitPayment}>Proceed to Payment</Button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
