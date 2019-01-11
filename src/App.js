import React, {Component} from 'react';
import './App.css';
import Canvas from "./components/canvas/Canvas";
import ToolsMenu from "./components/tools-menu/ToolsMenu";

class App extends Component {
    render() {
        return (
            <div className="app">
                <Canvas/>
                <ToolsMenu/>
            </div>
        );
    }
}

export default App;
