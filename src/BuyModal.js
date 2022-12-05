import React, {useEffect, useState} from 'react';
import { Button, Tabs, Tab, Container, Nav, Navbar, Form, Modal, ModalDialog } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import './App.css';
import B2BABI from './abi/b2barticles.json'

const BuyModal = () => {

    const [currentAccount, setAccount] = useState();
    const [currentAccountBalance, setAccountBalance] = useState();
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [articleName, setArticleName] = useState();
    const [articleCost, setArticleCost] = useState();
    const [articleDescription, setArticleDescription] = useState();
    const [b2baritclesaddress, setb2barticlesaddress] = useState("0xA7eF103777Fb776b9b877B5D475E14Bb1f315914");
}