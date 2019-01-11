import React, { Component } from 'react';
import './tools-menu.css';
import Select from "../select/Select";
import uuidv1 from 'uuid';

// Redux
import { connect } from 'react-redux';
import { setBorder, generateElement, generateTemplate, setBackground, setFontColor } from '../../actions/index';
import ColorOption from "../color-option/ColorOption";

function mapDispatchToProps(dispatch) {
    return {
        setBorder: (borderProperties) => dispatch(setBorder(borderProperties)),
        generateElement: (shape) => dispatch(generateElement(shape)),
        generateTemplate: () => dispatch(generateTemplate()),
        setBackground: (background) => dispatch(setBackground(background)),
        setFontColor: (fontColor) => dispatch(setFontColor(fontColor)),
    };
}

const borderWidthSelectStyle = {
    border: '1px solid #999',
    borderRight: 'none',
    borderRadius: '4px 0 0 4px',
    marginLeft: '10px',
    height: '25px',
    fontSize: '14px'
};
const borderColorSelectStyle = {
    height: '25px',
    width: '25px'
};
const backgroundColorSelectStyle = {
    height: '25px',
    width: '25px',
    marginRight: '10px'
};

class ConnectedToolsMenu extends Component {
    constructor(props){
        super(props);
        this.changeElementBorder = this.changeElementBorder.bind(this);
        this.changeBackground = this.changeBackground.bind(this);
        this.changeFontColor = this.changeFontColor.bind(this);
        this.selectBorderColor = this.selectBorderColor.bind(this);
        this.selectBorderWidth = this.selectBorderWidth.bind(this);
        this.selectBorderStyle = this.selectBorderStyle.bind(this);
        this.generateElement = this.generateElement.bind(this);
        this.generateTemplate = this.generateTemplate.bind(this);
        this.setBackgroundColor = this.setBackgroundColor.bind(this);
        this.setFontColor = this.setFontColor.bind(this);

        this.state = {
            borderColor: null,
            borderWidth: null,
            borderStyle: null,
            backgroundColor: null,
            fontColor: null,

            closeBorderColorSelector: true,
            borderColorSelectorFontColor: '#666',
            closeBackgroundColorSelector: true,
            backgroundColorSelectorFontColor: '#666',
            closeFontColorSelector: true,
            fontColorSelectorFontColor: '#666',

            closeBorderStyleSelector: true,
            borderStyleSelectorText: null
        };
    }

    changeElementBorder(){
        if(this.state.borderWidth && this.state.borderStyle && this.state.borderColor){
            const prop = `${this.state.borderWidth}px ${this.state.borderStyle} ${this.state.borderColor}`;
            this.props.setBorder(prop);
        }
    }

    changeBackground(){
        this.props.setBackground(this.state.backgroundColor);
    }

    changeFontColor(){
        this.props.setFontColor(this.state.fontColor);
    }

    selectBorderColor(color){
        this.setState({
            borderColor: color,
            closeBorderColorSelector: true,
            borderColorSelectorFontColor: (color === 'none') ? '#666' : color
        }, this.changeElementBorder);
    }
    selectBorderWidth(ev){
        this.setState({ borderWidth: ev.target.value },this.changeElementBorder);
    }
    selectBorderStyle(ev){
        this.setState({
            borderStyle: ev.target.dataset.value,
            closeBorderStyleSelector: true,
            borderStyleSelectorText: ev.target.value,
        }, this.changeElementBorder);
    }

    setBackgroundColor(color){
        this.setState({
            backgroundColorSelectorFontColor: color,
            closeBackgroundColorSelector: true,
            backgroundColor: color,
        }, this.changeBackground);
    }

    setFontColor(color){
        this.setState({
            fontColorSelectorFontColor: color,
            closeFontColorSelector: true,
            fontColor: color,
        }, this.changeFontColor);
    }

    generateElement(ev){
        const shape = ev.target.dataset.shape;
        const id = uuidv1();

        this.props.generateElement({shape, id});
    }

    generateTemplate(e){
        e.preventDefault();

        this.props.generateTemplate();
    }

    render(){
        return(
            <div id='tools-menu'>
                <ul>
                    <li>
                        <span className='tool-section-title'>Borde</span>
                        <div className='flex'>
                            <Select type='button' icon='border_color'
                                    style={ borderColorSelectStyle }
                                    fontColor={this.state.borderColorSelectorFontColor}
                                    close={this.state.closeBorderColorSelector}
                                    onOpen={() => { this.setState({closeBorderColorSelector: false}) }}>
                                <div className='flex flex-column'>
                                    <div className='flex'>
                                        <ColorOption color='none' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#eee' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ddd' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ccc' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#999' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#666' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#333' onSelect={this.selectBorderColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#e6b3ff' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#fbd0e6' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ffb3b3' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ffd3ad' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#fff1a8' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#c7e8ac' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#c1e4f7' onSelect={this.selectBorderColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#b391b5' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#f5b5c8' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ff8f80' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ffc374' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ffdf71' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#a3d977' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#99d2f2' onSelect={this.selectBorderColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#834187' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#de5f85' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#c92d39' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#ef8d22' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#fcc438' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#7ab648' onSelect={this.selectBorderColor} />
                                        <ColorOption color='#3aa6dd' onSelect={this.selectBorderColor} />
                                    </div>
                                </div>
                            </Select>
                            <div className='flex'>
                                <Select text={ this.state.borderStyleSelectorText || 'Estilo'} width='80px' style={borderWidthSelectStyle}
                                        close={this.state.closeBorderStyleSelector}
                                        onOpen={() => { this.setState({closeBorderStyleSelector: false}) }}>
                                    <div className='flex flex-column'>
                                        <div className='border-style-option'
                                               data-value='solid'
                                             onClick={this.selectBorderStyle}>
                                            <div className='border-style-option-solid'></div>
                                        </div>
                                        <div className='border-style-option'
                                             data-value='dashed'
                                               onClick={this.selectBorderStyle}>
                                            <div className='border-style-option-dashed'></div>
                                        </div>
                                        <div className='border-style-option'
                                             data-value='dotted'
                                               onClick={this.selectBorderStyle}>
                                            <div className='border-style-option-dotted'></div>
                                        </div>
                                    </div>
                                </Select>
                                <input type='number' defaultValue='0' className='border-width-input' onChange={ this.selectBorderWidth } />
                            </div>
                        </div>
                    </li>
                    <li>
                        <span className='tool-section-title'>Color</span>
                        <div className='flex'>
                            <Select type='button' icon='format_color_fill'
                                    style={ backgroundColorSelectStyle }
                                    fontColor={this.state.backgroundColorSelectorFontColor}
                                    close={this.state.closeBackgroundColorSelector}
                                    onOpen={() => { this.setState({closeBackgroundColorSelector: false}) }}>
                                <div className='flex flex-column'>
                                    <div className='flex'>
                                        <ColorOption color='none' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#eee' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ddd' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ccc' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#999' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#666' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#333' onSelect={this.setBackgroundColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#e6b3ff' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#fbd0e6' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ffb3b3' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ffd3ad' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#fff1a8' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#c7e8ac' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#c1e4f7' onSelect={this.setBackgroundColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#b391b5' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#f5b5c8' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ff8f80' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ffc374' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ffdf71' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#a3d977' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#99d2f2' onSelect={this.setBackgroundColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#834187' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#de5f85' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#c92d39' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#ef8d22' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#fcc438' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#7ab648' onSelect={this.setBackgroundColor} />
                                        <ColorOption color='#3aa6dd' onSelect={this.setBackgroundColor} />
                                    </div>
                                </div>
                            </Select>
                            <Select type='button' icon='format_color_text'
                                    style={ borderColorSelectStyle }
                                    fontColor={this.state.fontColorSelectorFontColor}
                                    close={this.state.closeFontColorSelector}
                                    onOpen={() => { this.setState({closeFontColorSelector: false}) }}>
                                <div className='flex flex-column'>
                                    <div className='flex'>
                                        <ColorOption color='none' onSelect={this.setFontColor} />
                                        <ColorOption color='#eee' onSelect={this.setFontColor} />
                                        <ColorOption color='#ddd' onSelect={this.setFontColor} />
                                        <ColorOption color='#ccc' onSelect={this.setFontColor} />
                                        <ColorOption color='#999' onSelect={this.setFontColor} />
                                        <ColorOption color='#666' onSelect={this.setFontColor} />
                                        <ColorOption color='#333' onSelect={this.setFontColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#e6b3ff' onSelect={this.setFontColor} />
                                        <ColorOption color='#fbd0e6' onSelect={this.setFontColor} />
                                        <ColorOption color='#ffb3b3' onSelect={this.setFontColor} />
                                        <ColorOption color='#ffd3ad' onSelect={this.setFontColor} />
                                        <ColorOption color='#fff1a8' onSelect={this.setFontColor} />
                                        <ColorOption color='#c7e8ac' onSelect={this.setFontColor} />
                                        <ColorOption color='#c1e4f7' onSelect={this.setFontColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#b391b5' onSelect={this.setFontColor} />
                                        <ColorOption color='#f5b5c8' onSelect={this.setFontColor} />
                                        <ColorOption color='#ff8f80' onSelect={this.setFontColor} />
                                        <ColorOption color='#ffc374' onSelect={this.setFontColor} />
                                        <ColorOption color='#ffdf71' onSelect={this.setFontColor} />
                                        <ColorOption color='#a3d977' onSelect={this.setFontColor} />
                                        <ColorOption color='#99d2f2' onSelect={this.setFontColor} />
                                    </div>
                                    <div className='flex'>
                                        <ColorOption color='#834187' onSelect={this.setFontColor} />
                                        <ColorOption color='#de5f85' onSelect={this.setFontColor} />
                                        <ColorOption color='#c92d39' onSelect={this.setFontColor} />
                                        <ColorOption color='#ef8d22' onSelect={this.setFontColor} />
                                        <ColorOption color='#fcc438' onSelect={this.setFontColor} />
                                        <ColorOption color='#7ab648' onSelect={this.setFontColor} />
                                        <ColorOption color='#3aa6dd' onSelect={this.setFontColor} />
                                    </div>
                                </div>
                            </Select>
                        </div>
                    </li>
                    <li>
                        <span className='tool-section-title'>Formas</span>
                        <div className='flex space-between'>
                            <div className='shape-option'>
                                <div className='square-shape' data-shape="square" onClick={this.generateElement}></div>
                            </div>
                            <div className='shape-option'>
                                <i className='material-icons' data-shape="text" onClick={this.generateElement}>title</i>
                            </div>
                            <div className='shape-option'></div>
                        </div>
                    </li>
                    <li>
                        <button onClick={this.generateTemplate}>Generar plantilla</button>
                    </li>
                </ul>
            </div>
        )
    }
}

const ToolsMenu = connect(null, mapDispatchToProps)(ConnectedToolsMenu);

export default ToolsMenu;