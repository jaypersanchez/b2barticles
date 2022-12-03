import React, {useEffect, useState} from 'react';
import { Button, Tabs, Tab, Container, Nav, Navbar, Form, Modal, ModalDialog } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import logo from './logo.svg';
import './App.css';
import B2BABI from './abi/b2barticles.json'


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
  const [articleid, setarticleid] = useState();
  const [articlename, setarticlename] = useState();
  const [listofarticles, setListOfArticles] = useState([]) 
  let arrayArticles=[];

  //array reference for getArticles returned result.
  const SELLER_ADDRESS = 0;
  const BUYER_ADDRESS = 1;
  const ARTICLE_NAME = 2;
  const ARTICLE_DESC = 3;
  const ARTICLE_PRICE = 4;

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
    //get list of articles owned by current wallet address
    getNumberOfArticles();
    getArticles();
  },[])

  const addArticleDetails = async(e) => {
    var web3 = new Web3(Web3.givenProvider);
    var _b2bInstance = new web3.eth.Contract(B2BABI, b2baritclesaddress)
    _b2bInstance.methods.sellArticle(articleName, articleDescription, articleCost).send({from: currentAccount});
    handleShow();
  } 

  const getArticles = async() => {
    var web3 = new Web3(Web3.givenProvider);
    var _b2bInstance = new web3.eth.Contract(B2BABI, b2baritclesaddress)
    //let _articles = await _b2bInstance.methods.getArticle().call();
    _b2bInstance.methods.getArticlesForSale().call()
    .then(articles => {
      
      articles.forEach(element => {
        //get article by the id
        _b2bInstance.methods.articles(element).call()
        .then(anArtical => {
            //setarticleid(anArtical[0]);
            //setarticlename(anArtical[1])
            //setListOfArticles(...anArtical.listofarticles,{articleid: articleid, ariclename: //articlename});
            arrayArticles.push({articleid: anArtical[0], articlename: anArtical[3]});
            console.log(`Article ${anArtical[0]} ${anArtical[3]}`)  
          })
      });
      
    })
    //console.log(`Articles for sale ${_articles}`)
  }

  //returns the number of articles for sale
  const getNumberOfArticles = async() => {
    var web3 = new Web3(Web3.givenProvider);
    var _b2bInstance = new web3.eth.Contract(B2BABI, b2baritclesaddress)
    //let _articles = await _b2bInstance.methods.getArticle().call();
    _b2bInstance.methods.getNumberOfArticles().call()
    .then(numArticles => {
      setNumberOfArticlesForSale(numArticles)
      //console.log(`There are ${numArticles} Articles available for sale`);
    })
    //console.log(`Articles for sale ${_articles}`)
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
        <div style={{backgroundColor:'white', padding:"20px"}}>
           <ol>
            {
                arrayArticles.forEach(element => {
                  console.log(`element ${element}`)
                  return <li>element.articleid</li>;
                })  
            }
           </ol>
        </div>
        </Tab>
        <Tab eventKey="B2BBuy" title="Bought Articles">

        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
