import React, { Component } from 'react' 
import { Dispatcher } from 'flux' 
import { EventEmitter } from 'events' 
import './App.css' 



//Inializing new dispatcher 
var AppDispatcher = new Dispatcher()   

//Create actions
const AppActions = {

    addItem(data) {
        AppDispatcher.dispatch({
            actionType: 'ADD_DATA',
            value: data
        }) 
    },

    removeItem(key)
    {
         AppDispatcher.dispatch({
            actionType: 'REMOVE_DATA',
            value: key
        }) 
    }
}

//Stores created
const StoreNumberOne = [] 
const StoreNumberTwo = [] 

//Create Store class
class AppStore extends EventEmitter {
  constructor() {
    super() 
    this.dispatchToken = AppDispatcher.register(this.dispatcherCallback.bind(this))
  }

  emitChange(eventName) {
    this.emit(eventName) 
  }

  getAllOne() {
    return StoreNumberOne 
  }

  getAllTwo() {
    return StoreNumberTwo 
  }

  addItem(data) {
    StoreNumberOne.push(data) 
    StoreNumberTwo.push(data) 
  }

  removeItem(key) {
    //StoreNumberOne.splice(key, 1)
    StoreNumberTwo.splice(key, 1)
  }

  subscribe(eventName, callback) {
    this.on(eventName, callback)//use default method of eventEmmiter
  }


  unsubscribe(eventName, callback) {
    this.removeListener(eventName, callback)
  }

  

  dispatcherCallback(action) {
    switch (action.actionType) {

      case 'ADD_DATA':
        this.addItem(action.value)
        this.emitChange(action.actionType)
        console.log(this.getAllOne())                           //for testing
        console.log(this.getAllTwo())
        break 

      case 'REMOVE_DATA':
        this.removeItem(action.value)
        this.emitChange(action.actionType)
        console.log(this.getAllOne())                           //for testing
        console.log(this.getAllTwo())
        break 
      
      default:
        console.log('something wrong')
    }

    

    return true 
  }
}


//Initializing AppStore
const Store = new AppStore() 


//Initializing View component
class App extends Component {
  constructor() {
    super()
    this.state = {} 
  }
  
  update = () => {
    this.setState({}) 
  }

  componentDidMount() {
    Store.subscribe('ADD_DATA', this.update) //remove actionType, stayed just a this.update method
    Store.subscribe('REMOVE_DATA', this.update) 
  }

  componentWillUnmount() {
    Store.unsubscribe('ADD_DATA', this.update) 
    Store.unsubscribe('REMOVE_DATA', this.update) 
  }

  handleClickAdd = (event) => {
    AppActions.addItem(document.getElementById('inputText').value) 
    document.getElementById('inputText').value = '' 
  }

  handleClickDel = (key) => {
    AppActions.removeItem(key)
  }
  
  render() {
      return (
        <div className="App">
          <header className="header">
            <input type="text" id='inputText'/>
            <input type="button" value="add" onClick={this.handleClickAdd} />
            <div className="intro up">
              {StoreNumberOne.map((item, i) => <div key={i}>{item}</div>)}
            </div>
          </header>
         <div className="intro">
            {StoreNumberTwo.map((item, i) => 
            <div key={i}>{item}
                <input type="button" value="X" onClick={() => this.handleClickDel(i)} />
            </div>)}  
          </div>          
        </div>
      ) 
    }
  }

export default App 
