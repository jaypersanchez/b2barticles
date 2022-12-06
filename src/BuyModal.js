import React, {useEffect, useState} from 'react';
import { Button, Tabs, Tab, Container, Nav, Navbar, Form, Modal, ModalDialog } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import './App.css';
import B2BABI from './abi/b2barticles.json'

const BuyModal = ({param}) => {

    const [currentAccount, setAccount] = useState();
    const [currentAccountBalance, setAccountBalance] = useState();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [articleName, setArticleName] = useState();
    const [articleCost, setArticleCost] = useState();
    const [articleDescription, setArticleDescription] = useState();
    const [b2baritclesaddress, setb2barticlesaddress] = useState("0xA7eF103777Fb776b9b877B5D475E14Bb1f315914");

    useEffect = () => {
        handleShow();
    }

    return(
        <div style={{backgroundColor:'lightskyblue', padding:"20px"}}>
          <h1>There are {numberOfArticlesForSale} Articles for Sale</h1>
          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Buy An Article</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form.Group className='mb-3' id="balance">
                <Form.Control placeholder='Name of Article' />
                <Form.Control placeholder='Cost in ETH' />
                <Form.Control placeholder='Description' />
              </Form.Group>
              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary">Buy</Button>
                <Button variant="secondary">Close</Button>
              </Modal.Footer>
            </Modal>
        </div>
    )
}
export default BuyModal;