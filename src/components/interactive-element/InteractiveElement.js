import React, { Component } from 'react';
import './interactive-element.css';

// Redux
import { connect } from 'react-redux';
import { setElement, elementInMovement } from '../../actions/index';

function mapDispatchToProps(dispatch) {
    return {
        setElement: (data) => dispatch(setElement(data)),
        elementInMovement: (data) => dispatch(elementInMovement(data)),
    };
}

const marginLeft = 200; // Represents the error to left of the canvas: 200px

class ConnectedInteractiveElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            focused: 0,
            style: {
                position: 'absolute',
                display: 'flex',
                justifyContent: 'center',
                textAlign: this.props.textAlign || 'center',
                border: this.props.border || 'none',
                background: this.props.background || '#fff',
                color: '#666',
                outline: 'none',
                width: '100px',
                height: '80px',
                top: '50px',
                left: '250px',
                alignItems: 'center',
            },
            text: this.props.text
        };

        this.interactive = React.createRef();
        this.rightResizer = React.createRef();
        this.leftResizer = React.createRef();
        this.topResizer = React.createRef();
        this.bottomResizer = React.createRef();
        this.currentResizer = null;

        this.originalElementWidth = 0;
        this.originalElementHeight = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.posX = 0;
        this.posY = 0;

        this.mininumSize = 20;

        this.resize = this.resize.bind(this);
        this.stopResize = this.stopResize.bind(this);
        this.drag = this.drag.bind(this);
        this.showInput = this.showInput.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.setElementAsSelected = this.setElementAsSelected.bind(this);
        this.generateHTML = this.generateHTML.bind(this);
        this.moveWithKeypad = this.moveWithKeypad.bind(this);
    }

    setElementAsSelected(action) {
        const data = {element: this, action};
        this.props.setElement(data);
    }

    componentDidMount() {
        this.setElementAsSelected('add');
        this.showBorders();
        this.showInput();

        const resizers = this.interactive.current.querySelectorAll('.resizer');
        for (let i = 0; i < resizers.length; i++) {
            const current = resizers[i];
            current.addEventListener('mousedown', function(e){
                e.preventDefault();

                this.currentResizer = current;

                this.mouseX =  e.pageX;
                this.mouseY = e.pageY;
                this.posX = this.interactive.current.getBoundingClientRect().left - marginLeft;
                this.posY = this.interactive.current.getBoundingClientRect().top;

                this.originalElementWidth = parseFloat(getComputedStyle(this.interactive.current, null)
                    .getPropertyValue('width').replace('px', ''));
                this.originalElementHeight = parseFloat(getComputedStyle(this.interactive.current, null)
                    .getPropertyValue('height').replace('px', ''));

                window.addEventListener('mousemove', this.resize);
                window.addEventListener('mouseup', this.stopResize);
            }.bind(this));
        }

        const draggableRegion = this.interactive.current.querySelector('.draggable-region');
        draggableRegion.onmousedown = this.drag;
    }

    componentDidUpdate(prevProps, prevState) {}

    resize(e){
        if(this.currentResizer.classList.contains('right-resizer')){
            const width = this.originalElementWidth + (e.pageX - this.mouseX);
            if (width > this.mininumSize) {
                this.setState({
                    style: {
                        ...this.state.style,
                        width: `${width}px`
                    }
                });
            }
        }else if(this.currentResizer.classList.contains('top-resizer')){
            const height = this.originalElementHeight - (e.pageY - this.mouseY);
            if (height > this.mininumSize) {
                this.setState({
                    style: {
                        ...this.state.style,
                        height: `${height}px`,
                        top: `${this.posY + (e.pageY - this.mouseY)}px`
                    }
                });
            }
        }else if(this.currentResizer.classList.contains('bottom-resizer')){
            const height = this.originalElementHeight + (e.pageY - this.mouseY);
            if (height > this.mininumSize) {
                this.setState({
                    style: {
                        ...this.state.style,
                        height: `${height}px`
                    }
                });
            }
        }else{ // left resizer
            const width = this.originalElementWidth - (e.pageX - this.mouseX);
            if (width > this.mininumSize) {
                this.setState({
                    style: {
                        ...this.state.style,
                        width: `${width}px`,
                        left: `${this.posX + (e.pageX - this.mouseX)}px`
                    }
                });
            }
        }
    };

    stopResize(){
        window.removeEventListener('mousemove', this.resize);
    }

    handleBlur(e){
        const element = this.interactive.current;
        if(element) {
            if ((e.target.classList.contains('draggable-region') && !element.contains(e.target)) || e.target.id === 'canvas') {
                const resizerContainer = element.getElementsByClassName('resizers')[0];
                resizerContainer.style.display = 'none';
                element.removeAttribute('tabindex');
                this.setElementAsSelected('remove');

                document.removeEventListener('click', this.handleBlur);
                this.setState({ focused: 0 });
            }
        }
    }

    showBorders(){
        const self = this;
        const element = this.interactive.current;
        const resizerContainer = element.getElementsByClassName('resizers')[0];

        element.onfocus = function(){
            resizerContainer.style.display = 'block';
            if(self.state.focused === 0){
                self.setState({focused: 1});
                document.addEventListener('click', self.handleBlur);
            }

            document.addEventListener('keydown', self.moveWithKeypad);
        };

        element.onblur = function(){
            document.removeEventListener('keydown', self.moveWithKeypad);
        };

        // When element appears, set focus immediately
        element.tabIndex = 0;
        element.focus();

        element.addEventListener('mouseover', function(){
            resizerContainer.style.display = 'block';
        });
        element.addEventListener('mouseout', function(){
            if(!this.getAttribute('tabindex')){
                resizerContainer.style.display = 'none';
            }
        });

        element.addEventListener('click', function(){
            this.tabIndex = 0;
            this.focus();
            self.setElementAsSelected('add');
        });
    }

    drag(e){
        e.preventDefault();

        this.posX = e.pageX - marginLeft;
        this.posY = e.pageY;
        window.onmousemove = function(e){
            e.preventDefault();
            const posX = e.pageX - this.posX - marginLeft;
            const posY = e.pageY - this.posY;

            this.posX = e.pageX - marginLeft;
            this.posY = e.pageY;

            this.setState({
                style: {...this.state.style,
                    top: `${parseInt(this.state.style.top.replace('px', '')) + posY}px`,
                    left: `${parseInt(this.state.style.left.replace('px', '')) + posX}px`
                }
            }, this.emitMovement);

        }.bind(this);
        window.onmouseup = function(){
            window.onmouseup = null;
            window.onmousemove = null;
        }
    }

    showInput(){
        const element = this.interactive.current;
        const self = this;
        element.ondblclick = function(){
            if(element.querySelectorAll('.text-input').length === 0){
                const input = document.createElement('input');
                input.value = self.state.text || '';
                input.classList.add('text-input');
                element.appendChild(input);
                input.focus();

                input.onblur = function(){
                    self.setState({
                        text: this.value.toString().trim()
                    });
                    input.remove();
                };
            }
        };
    }

    emitMovement(){
        const right = parseInt(this.state.style.left.replace('px', '')) + parseInt(this.state.style.width.replace('px', ''));
        const bottom = parseInt(this.state.style.top.replace('px', '')) + parseInt(this.state.style.height.replace('px', ''));

        const data = Object.assign({ right, bottom }, this.state.style, {
            left: parseInt(this.state.style.left.replace('px', '')),
            top: parseInt(this.state.style.top.replace('px', '')),
            width: parseInt(this.state.style.width.replace('px', '')),
            height: parseInt(this.state.style.height.replace('px', '')),
            key: this.props.unique,
        });

        this.props.elementInMovement(data);
    }

    moveWithKeypad(e){
        e.preventDefault();
        switch(e.key) {
            case 'ArrowUp':
                this.setState({
                    style: {...this.state.style,
                        top: `${parseInt(this.state.style.top.replace('px', '')) - 1}px`,
                    }
                }, this.emitMovement);
                break;
            case 'ArrowRight':
                this.setState({
                    style: {...this.state.style,
                        left: `${parseInt(this.state.style.left.replace('px', '')) + 1}px`,
                    }
                }, this.emitMovement);
                break;
            case 'ArrowDown':
                this.setState({
                    style: {...this.state.style,
                        top: `${parseInt(this.state.style.top.replace('px', '')) + 1}px`,
                    }
                }, this.emitMovement);
                break;
            case 'ArrowLeft':
                this.setState({
                    style: {...this.state.style,
                        left: `${parseInt(this.state.style.left.replace('px', '')) - 1}px`,
                    }
                }, this.emitMovement);
                break;
            default:
                break;
        }
    }

    generateHTML(){
        const containerWidth = document.getElementById('canvas').offsetWidth;
        const left = `${(this.interactive.current.style.left.replace('px', '') / containerWidth) * 100}%`;

        let container = document.createElement('div');
        Object.assign(container.style, this.state.style);
        container.style.left = left;

        return {
            element: 'div',
            style: this.state.style,
            left: left,
            text: this.state.text
        }
    }

    render(){
        return(
            <div className='resizable' ref={this.interactive} style={ this.state.style } data-generate="true">
                <span className='inner-text' style={{ 'textAlign': this.state.style.textAlign }} data-generate="true">
                    {this.state.text}
                </span>

                <div className='draggable-region'></div>
                <div className='resizers'>
                    <div className='resizer top-resizer' ref={this.topResizer}></div>
                    <div className='resizer right-resizer' ref={this.rightResizer}></div>
                    <div className='resizer bottom-resizer' ref={this.bottomResizer}></div>
                    <div className='resizer left-resizer' ref={this.leftResizer}></div>
                </div>
            </div>
        )
    }
}

const InteractiveElement = connect(null, mapDispatchToProps, null, {forwardRef: true})(ConnectedInteractiveElement);

export default InteractiveElement;