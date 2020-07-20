import React from "react";
import ReactDOM from "react-dom";
import { SketchPicker } from "react-color";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import './index.css'
import axios from "axios";

class Canvas extends React.Component {
  constructor(props, match) {
    super(props,match);
    this.state = { color: this.props.color, painting: false, dimensions:this.props.dimensions, canvasdata:''};
    this.ctx = "";
    this.lastPt=null;
    this.startdraw = this.startdraw.bind(this);
    this.enddraw = this.enddraw.bind(this);
    this.draw = this.draw.bind(this);
    
    
  }
  componentDidMount() {
    const canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    canvas.height = 800;
    canvas.width = 800;
    canvas.addEventListener('mousedown', this.startdraw)
    canvas.addEventListener('mouseup', this.enddraw)
    canvas.addEventListener('mousemove', this.draw)
    axios.get(`http://localhost:5000/canvases/${this.props.id}`)
    .then(response => {
      this.setState({canvasdata:response.data.canvas})
      let image = new Image();
      image.src=response.data.canvas
      this.ctx.drawImage(image,0,0,canvas.width,canvas.height);
    }).catch(function (error) {
      console.log(error)
    })
  }
  componentDidUpdate() {
    let color =this.props.color
    if (this.state.color !== color) {
      this.setState({color:color})
    }
    let dimensions = this.props.dimensions 
    if (this.state.dimensions  !== dimensions){
      this.setState({dimensions:dimensions})
    }
  }

  startdraw() {
    this.setState({ painting: true });

  }
  enddraw() {
    this.setState({ painting: false });
    this.ctx.beginPath();
  }
  draw(e) {
    if (this.state.painting) {
      this.ctx.lineWidth = this.state.dimensions;
      this.ctx.lineCap = "round";
      this.ctx.lineTo(e.offsetX, e.offsetY );
      this.ctx.strokeStyle = this.state.color;
      this.ctx.stroke();
      this.ctx.beginPath();
      this.ctx.moveTo(e.offsetX, e.offsetY );
    } else {
      return;
    }
  }
  render() {
    return (
      <div className="box">
           <canvas
        id="canvas"
        className="canvas"
      />
      </div>
    );
  }
}
class DimensionSelectorSlider extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.props.onDimensionSelectorChange(event.target.value);
  }
  render() {
    const dimensions = this.props.dimensions
    return (
      <div className="d-flex flex-row" >
        <input type="range" min="1" max="100" value={dimensions} id="myRange" onChange={this.handleChange} />
      </div>
    )
  }
}

class ColorSelector extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      displayColorPicker: false,
    };
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
   
    
  }
  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
    this.setState({ displayColorPicker: false });
  };

  handleChange(event) {
    this.props.onColorSelectorChange(event.hex)
  };
  
  render() {
    const color = this.props.color
    return (
      <div>
          <div className="changlecolorbtn"onClick={this.handleClick}>
          <div style={{background: color}} className="btncolor"/>
          </div>{this.state.displayColorPicker ? (<div className="colormenu"><div className="menucovor" onClick={this.handleClose} /><SketchPicker color={color} onChange={this.handleChange}/></div>) : null}
      </div>
    );
  }
}
class SaveCanvas extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.props.onCanvasSave()
  }
  render() {
    return <button type="button" className="btn btn-secondary" onClick={this.handleClick}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"/></svg></button>
  }
}
class AddCanvas extends React.Component {
  constructor(props) {
    super(props) 
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick(){
    this.props.onAddCanvas()
  }
  render() {
    return <button type="button" className="btn btn-secondary" onClick={this.handleClick}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M352 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm96-160v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-48 346V86c0-3.3-2.7-6-6-6H54c-3.3 0-6 2.7-6 6v340c0 3.3 2.7 6 6 6h340c3.3 0 6-2.7 6-6z"/></svg></button>
  }
}
class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      dimensions: 10,
      color: "#000000",
    }
    this.onDimensionSelectorChange = this.onDimensionSelectorChange.bind(this)
    this.onColorSelectorChange = this.onColorSelectorChange.bind(this)
    this.onCanvasSave = this.onCanvasSave.bind(this)
  }
  onColorSelectorChange(color) {
    this.setState({color:color})
  }
  onDimensionSelectorChange(dimensions) {
    this.setState({dimensions:dimensions})
  }
  onCanvasSave() {
    const getcanvas = document.getElementById("canvas");
    const canvasdata = getcanvas.toDataURL();
    const canvas = {
      canvas:canvasdata
    }
    fetch(`http://localhost:5000/canvases/update/${this.props.match.params.id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(canvas),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  
  render() {
    return (
      <div>
        
      <nav className="navbar navbar-dark bg-dark containinput">
      <ul className="navbar-nav">
        <li className="nav-item nav-link"  >
          <span className="btn badge">
          <SaveCanvas onCanvasSave={this.onCanvasSave}/>
          </span>
      </li>
        <li className="nav-item nav-link"  >
          <span className="btn badge">
          <ColorSelector onColorSelectorChange={this.onColorSelectorChange} color={this.state.color}/>
          </span>
      </li>
        <li className="nav-item ">
            <span className=" badge inputslider">
            <DimensionSelectorSlider onDimensionSelectorChange={this.onDimensionSelectorChange} dimensions={this.state.dimensions} />
            </span>
        </li>
        <li className="nav-item nav-link"  >
            <span className="btn badge">
              <Link to={"/"}><button type="button" className="btn btn-secondary"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M8 256c0 137 111 248 248 248s248-111 248-248S393 8 256 8 8 119 8 256zm448 0c0 110.5-89.5 200-200 200S56 366.5 56 256 145.5 56 256 56s200 89.5 200 200zm-72-20v40c0 6.6-5.4 12-12 12H256v67c0 10.7-12.9 16-20.5 8.5l-99-99c-4.7-4.7-4.7-12.3 0-17l99-99c7.6-7.6 20.5-2.2 20.5 8.5v67h116c6.6 0 12 5.4 12 12z"/></svg></button></Link>
              
            </span>
        </li>
      </ul>
      </nav>
      <Canvas color={this.state.color} dimensions={this.state.dimensions} id={this.props.match.params.id}/>
      </div>
    );
  }
}
class App extends React.Component {
  render() {
    return <Router><Route path="/" exact component={HomePage} /><Route path="/canvas/:id" exact component={Index} /></Router> 
  }
}
class CanvasImage extends React.Component {
  render() {
    return <Link to={`/canvas/${this.props.canvas._id}`} className="canvaslink"><img src={`${this.props.canvas.canvas}`} className="col imageframe" alt="PlaceholderImage"/></Link> 
  }
}

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {canvases:[]}
    this.newcanvas = {canvas: 1 }
    this.onAddCanvas = this.onAddCanvas.bind(this)
  }
  componentDidMount() {
    axios.get('http://localhost:5000/canvases/')
    .then(response => {
        this.setState({canvases:response.data})
        console.log("got data")
    })
    .catch((error) => {
      console.log(error)
    })
  }
  onAddCanvas() {
    
    console.log(this.newcanvas.canvas)
    fetch("http://localhost:5000/canvases/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.newcanvas),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  
    
  }
  displayCanvases() {
    
    return this.state.canvases.map(i => {
     
      return <CanvasImage key={i._id} canvas={i} />
    })
  }
  render() {
    return <div>
      <nav className="navbar navbar-dark bg-dark containinput">
      <ul className="navbar-nav">
        <li className="nav-item nav-link">
        <span className="btn badge">
          <AddCanvas onAddCanvas={this.onAddCanvas}/>
          </span>
        </li>
      </ul>
      </nav>
      <div className="row row-cols-2 box ">{this.displayCanvases()}</div>
      </div>
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
