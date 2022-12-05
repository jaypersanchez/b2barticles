import React, {useEffect, useState} from 'react';
import { Button, Tabs, Tab, Container, Nav, Navbar, Form, Modal, ModalDialog } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import logo from './logo.svg';
import './App.css';
import B2BABI from './abi/b2barticles.json'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';



function App() {

  const [currentAccount, setAccount] = useState();
  const [currentAccountBalance, setAccountBalance] = useState();
  const [networkId, setNetworkId] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [articleName, setArticleName] = useState();
  const [articleCost, setArticleCost] = useState();
  const [articleDescription, setArticleDescription] = useState();
  const [b2baritclesaddress, setb2barticlesaddress] = useState("0xf287fc132B1E1717c1Bf1ffaF45dB753368a4c0d");
  const [numberOfArticlesForSale, setNumberOfArticlesForSale] = useState(0);
  const columns = [
    { field: 'id', header: 'ID', width: 10},
    { field: 'articleName', headerName: 'Article', width: 130 },
    { field: 'articleDesc', headerName: 'Description', width: 130 },
    { field: 'articlePrice', headerName: 'Price', width: 10 }
  ];
  const [datarows, setdatarows] = useState([])
  const [datarowsloading, setdatarowsloading] = useState(false);
  
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
    getNumberOfArticles();
    
    console.log(`num articles ${numberOfArticlesForSale}`)
  })


  useEffect(() => {
    var web3 = new Web3(Web3.givenProvider);
    let counter = 0
    var _b2bInstance = new web3.eth.Contract(B2BABI, b2baritclesaddress)
    _b2bInstance.methods.getArticlesForSale().call()
    .then(articles => {
      articles.forEach(element => {
        //get article by the id
        _b2bInstance.methods.articles(element).call()
        .then(anArtical => {
          
            setdatarowsloading(true);
              console.log(`{id: ${anArtical[0]}, articleName: ${anArtical[3]}, articleDesc: ${anArtical[4]}, articlePrice: ${anArtical[5]} `)
              /*if(datarows.indexOf({id: anArtical[0], articleName: anArtical[3], articleDesc: anArtical[4], articlePrice: anArtical[5]} !== -1)) {*/
                setdatarows(datarows => [...datarows, {id: anArtical[0], articleName: anArtical[3], articleDesc: anArtical[4], articlePrice: anArtical[5]} ])
                
              //}
            //}
            //counter++;
        })
      });
      setdatarowsloading(false); 
    }) 
    // eslint-disable-next-line
  },[])

  const addArticleDetails = async(e) => {
    var web3 = new Web3(Web3.givenProvider);
    var _b2bInstance = new web3.eth.Contract(B2BABI, b2baritclesaddress)
    _b2bInstance.methods.sellArticle(articleName, articleDescription, articleCost).send({from: currentAccount});
    handleShow();
  } 

  //returns the number of articles for sale
  const getNumberOfArticles = async() => {
    var web3 = new Web3(Web3.givenProvider);
    var _b2bInstance = new web3.eth.Contract(B2BABI, b2baritclesaddress)
    _b2bInstance.methods.getNumberOfArticles().call()
    .then(numArticles => {
      setNumberOfArticlesForSale(numArticles)
    })
  }

  const onRowsSelectionHandler = async(ids) => {
    console.log(ids)
    const selectedRowsData = ids.map((id) => datarows.find((row) => row.id === id));
    console.log(selectedRowsData);
  };

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
          <h1>There are {numberOfArticlesForSale} Articles for Sale</h1>
          <Button variant="primary" onClick={(e) => handleShow()}>Add Article to Sell</Button>
          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Article to Sell</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              <Form.Group className='mb-3' id="balance">
                <Form.Control placeholder='Name of Article' onChange={(e) => {setArticleName(e.target.value)}}/>
                <Form.Control placeholder='Cost in ETH' onChange={(e) => {setArticleCost(e.target.value)}}/>
                <Form.Control placeholder='Description' onChange={(e) => {setArticleDescription(e.target.value)}}/>
              </Form.Group>
              </Modal.Body>
              <Modal.Footer>
              <Button variant="secondary" onClick={(e) => addArticleDetails(e)}>Add</Button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
              </Modal.Footer>
            </Modal>
        </div>
        
          
        <div style={{ backgroundColor:'lightgrey', height: 400, width: '100%' }}>
          <DataGrid
            rows={datarows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5]}
            checkboxSelection={true}
            onSortModelChange={(ids) => onRowsSelectionHandler(ids)}
          />
        </div>

        
        </Tab>
        <Tab eventKey="B2BBuy" title="Bought Articles">

        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
