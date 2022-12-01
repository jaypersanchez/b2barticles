import React, {useEffect, useState} from 'react';
import { Button, Tabs, Tab, Container, Nav, Navbar, Form, Modal, ModalDialog } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import logo from './logo.svg';
import './App.css';


function App() {

  const [currentAccount, setAccount] = useState();
  const [currentAccountBalance, setAccountBalance] = useState();
  const [networkId, setNetworkId] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loadWeb3 = async() => {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();
    }
    else if(window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Please install metamask')
    }
  }

  const loadWalletData = async() => {
    const web3 = window.web3
    let _networkid = await web3.eth.net.getId();
    setNetworkId(_networkid)
    const account = await web3.eth.getAccounts();
    setAccount(account[0]);
    let _balance = await web3.eth.getBalance(currentAccount)
    //convert balance from wei to ether
    let balance = await web3.utils.fromWei(_balance, "ether");
    setAccountBalance(balance);
  }

  useEffect(() => {
    //setup to connect to Metamask wallet or other wallet provider
    loadWeb3();
    //by calling getAccounts, we will know if we are connected to metamask
    loadWalletData();
  })

  const addArticleDetails = async(e) => {
    handleShow();
  } 

  return (
    <div className="App">
      <header className="App-header">
      <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Wallet Address: {currentAccount}</Navbar.Brand>
            <Navbar.Brand>Wallet ETH Balance: {currentAccountBalance}</Navbar.Brand>
          </Container>
        </Navbar>
      </header>
      <Tabs
        defaultActiveKey="B2BSell"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="B2BSell" title="Articles for Sale">
        <div style={{backgroundColor:'lightskyblue', padding:"20px"}}>
          <h1>Articles for Sale</h1>
          <Button variant="primary" onClick={(e) => addArticleDetails(e)}>Add Article to Sell</Button>
          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Article to Sell</Modal.Title>
              </Modal.Header>
              <Modal.Body>

              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={(e) => addArticleDetails(e)}>Add</Button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
        </div>
        </Tab>
        <Tab eventKey="B2BBuy" title="Bought Articles">

        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
