import React, { Component } from 'react';
import './color-option.css'

class ColorOption extends Component {
    constructor(props){
        super(props);

        this.selectColor = this.selectColor.bind(this);
    }

    selectColor(){
        this.props.onSelect(this.props.color);
    }

    render(){
        if(this.props.color !== 'none'){
            return(
                <div className='color-option' style={{backgroundColor: this.props.color}} onClick={this.selectColor}></div>
            )
        }else{
            return(
                <div className='color-option none' onClick={this.selectColor}>
                    <div className='micro micro-grey'></div>
                    <div className='micro micro-white'></div>
                    <div className='micro micro-grey'></div>
                    <div className='micro micro-white'></div>
                    <div className='micro micro-white'></div>
                    <div className='micro micro-grey'></div>
                    <div className='micro micro-white'></div>
                    <div className='micro micro-grey'></div>
                    <div className='micro micro-grey'></div>
                    <div className='micro micro-white'></div>
                    <div className='micro micro-grey'></div>
                    <div className='micro micro-white'></div>
                </div>
            )
        }
    }
}

export default ColorOption;