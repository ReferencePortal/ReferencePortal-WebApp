import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import ReferenceERC20Token from '../build/contracts/ReferenceToken.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      refTokenContractInstance: null,
      address: null,
      privateKey: null,
      contractAddress: "0xd03e8b9844ebc6e66fa0744a2cb0d2ef5d68f739",
      addressBal: "0x84BF26F6546cDfB615b11Ca624C39A006A1BC242"
    }
    this.showBalance = this.showBalance.bind(this);
    this.handleChange = this.handleChange.bind(this);


    
  }

  handleChange({ target }) {
    this.setState({
      addressBal: target.value
    });
  }
  
  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        })

        // Instantiate contract once web3 provided.
        this.instantiateContract()
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    // const simpleStorage = contract(SimpleStorageContract)
    //simpleStorage.setProvider(this.state.web3.currentProvider)

    const refTokenContract = contract(ReferenceERC20Token)
    refTokenContract.setProvider(this.state.web3.currentProvider)

    console.log(refTokenContract)

    var contractAddress = "0xd03e8b9844ebc6e66fa0744a2cb0d2ef5d68f739"

    // Declaring this for later so we can chain functions on SimpleStorage.
    var refTokenContractInstance
    /*
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
          simpleStorage.deployed().then((instance) => {
            simpleStorageInstance = instance
    
            // Stores a given value, 5 by default.
            return simpleStorageInstance.set(5, {from: accounts[0]})
          }).then((result) => {
            // Get the value from the contract to prove it worked.
            return simpleStorageInstance.get.call(accounts[0])
          }).then((result) => {
            // Update state with the result.
            return this.setState({ storageValue: result.c[0] })
          })
        })
    
        */
    var accountOutside
    var accountAddress
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log("Address: " + accounts[0])
      accountAddress = accounts[0]
    }).then(() => {

      refTokenContract.at(contractAddress).then((instance) => {
        refTokenContractInstance = instance
        this.state.web3.eth.defaultAccount = accountAddress
        console.log(instance.address)
        this.setState({
          refTokenContractInstance: refTokenContractInstance
        })

        return refTokenContractInstance.balanceOf(accountAddress)
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      })


    })
  }

  showBalance() {


    this.state.refTokenContractInstance.balanceOf(this.state.addressBal).then((result) => {
      // Update state with the result.
      return this.setState({ storageValue: result.c[0] })
    })


  }

  createAccount = () => {
    var address
    var privateKey

    var createObj = this.state.web3.eth.accounts.create()


    address = createObj.address
    privateKey = createObj.privateKey

    this.setState({
      address: address,
      privateKey: privateKey
    })
  }

  claimToken = () => {
    var address = this.state.address
    var refConIns = this.state.refTokenContractInstance

    if (refConIns == null)
      return

    var callData = refConIns.transfer.request(address, 10);
    console.log(callData.params[0].data)
    var data = callData.params[0].data

    var transaction = {
      from: "0x84BF26F6546cDfB615b11Ca624C39A006A1BC242",
      gasPrice: "20000000000",
      gas: "21000",
      to: this.state.contractAddress,
      value: "0x0",
      data: data,
      "nonce": "0x3d"

    }
    this.state.web3.eth.accounts.signTransaction(transaction, 'a3e05c972f2fb0e738b08d19030a3c27133da717a062eb30574815c7bff42849').then((tx) => {
      console.log(tx)
    }).then((result) => {
      console.log("refConIns" + address)
      return refConIns.balanceOf(address)
      return this.setState({ storageValue: result.c[0] })
    })

  }



  render() {
    return (
      <div className="App" >
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Reference Token</a>
        </nav>


        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <button onClick={this.createAccount}>
                Create Account
              </button>
              <p> Address: {this.state.address}</p>
              <p> Private Key: {this.state.privateKey}</p>
              <p>The stored value is: {this.state.storageValue}</p>

              <button onClick={this.claimToken}>
                Claim Tokens
              </button>

              <input
                type="text"
                name="Address"
                placeholder="Enter Address here..."
                value={ this.state.addressBal }
                onChange={ this.handleChange } 
              />
              <button onClick={this.showBalance}>
                Show Balance
              </button>

                <p>Balance Is: {this.state.addressBal}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
