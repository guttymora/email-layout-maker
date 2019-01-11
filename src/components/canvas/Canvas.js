import React, { Component } from 'react';
import './canvas.css';

// Redux
import { connect } from 'react-redux';
import { deleteElement } from "../../actions";

function mapStateToProps(state){
    return {
        selected: state.selectedElement,
        elements: state.generatedElements,
        elementInMovement: state.elementInMovement,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteElement: (uniqueId) => dispatch(deleteElement(uniqueId))
    };
}

const differential = 15; // Differential constant to show show guide lines

class Canvas extends Component {
    constructor(props){
        super(props);

        this.deleteSelectedElement = this.deleteSelectedElement.bind(this);
        this.showGuideLines = this.showGuideLines.bind(this);
        this.compareVertical = this.compareVertical.bind(this);
        this.compareHorizontal = this.compareHorizontal.bind(this);
        this.createGuideLine = this.createGuideLine.bind(this);
        this.removeGuideLine = this.removeGuideLine.bind(this);

        this.state = {
            zIndex: []
        };

        this.canvas = React.createRef();
        this.nearElementFoundInVeritcal = false;
        this.nearElementFoundInHorizontal = false;
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.selected !== null){
            document.addEventListener('keydown', this.deleteSelectedElement);
        }else{
            document.removeEventListener('keydown', this.deleteSelectedElement);
            this.removeGuideLine('ver');
            this.removeGuideLine('hor');
        }

        if(nextProps.elementInMovement !== this.props.elementInMovement){
            this.showGuideLines(nextProps.elementInMovement);
        }
    }

    deleteSelectedElement(e){
        if(e.key === 'Delete'){
            this.props.deleteElement(this.props.selected.props.unique);
        }
    }

    showGuideLines(elementInMovement){
        const self = this;
        const middleVerLine = this.canvas.current.offsetWidth / 2;
        const maxVerLim = middleVerLine + differential;
        const minVerLim = middleVerLine - differential;

        const middleHozLine = this.canvas.current.offsetHeight / 2;
        const maxHozLim = middleHozLine + differential;
        const minHozLim = middleHozLine - differential;

        for(let i=0; i<this.props.elements.length; i++){
            if(this.props.elements[i].key !== elementInMovement.key){
                const elementData = this.props.elements[i].ref.current.state.style;
                self.compareHorizontal(elementInMovement, elementData);
                self.compareVertical(elementInMovement, elementData);

                if(this.nearElementFoundInVeritcal || this.nearElementFoundInHorizontal){
                    break;
                }
            }
        }

        if(!this.nearElementFoundInVeritcal){
            if((elementInMovement.right >= minVerLim && elementInMovement.right <= maxVerLim) ||
                (elementInMovement.left >= minVerLim && elementInMovement.left <= maxVerLim)){
                this.createGuideLine({ver: true, left: middleVerLine});
            }else{
                this.removeGuideLine('ver');
            }
        }
        if(!this.nearElementFoundInHorizontal){
            if((elementInMovement.top >= minHozLim && elementInMovement.top <= maxHozLim) ||
                (elementInMovement.bottom >= minHozLim && elementInMovement.bottom <= maxHozLim)){
                this.createGuideLine({ver: false, hor: true, top: middleHozLine});
            }else{
                this.removeGuideLine('hor');
            }
        }
    }

    compareVertical(dynamicElement, staticElement){
        const leftLim = parseInt(staticElement.left.replace('px', ''));
        const rightLim = parseInt(staticElement.left.replace('px', '')) + parseInt(staticElement.width.replace('px', ''));

        if((dynamicElement.left >= leftLim - differential && dynamicElement.left <= leftLim + differential) ||
            (dynamicElement.right >= leftLim - differential && dynamicElement.right <= leftLim + differential)){
            this.createGuideLine({ver: true, left: leftLim});
            this.nearElementFoundInVeritcal = true;
        }else if((dynamicElement.right >= rightLim - differential && dynamicElement.right <= rightLim + differential) ||
            (dynamicElement.left >= rightLim - differential && dynamicElement.left <= rightLim + differential)){
            this.createGuideLine({ver: true, left: rightLim});
            this.nearElementFoundInVeritcal = true;
        }else{
            this.nearElementFoundInVeritcal = false;
            this.removeGuideLine('ver');
        }
    }

    compareHorizontal(dynamicElement, staticElement){
        const topLim = parseInt(staticElement.top.replace('px', ''));
        const bottomLim = parseInt(staticElement.top.replace('px', '')) + parseInt(staticElement.height.replace('px', ''));

        if((dynamicElement.top >= topLim - differential && dynamicElement.top <= topLim + differential) ||
            (dynamicElement.bottom >= topLim - differential && dynamicElement.bottom <= topLim + differential)){
            this.createGuideLine({hor: true, top: topLim});
            this.nearElementFoundInHorizontal = true;
        }else if((dynamicElement.bottom >= bottomLim - differential && dynamicElement.bottom <= bottomLim + differential) ||
            (dynamicElement.top >= bottomLim - differential && dynamicElement.top <= bottomLim + differential)){
            this.createGuideLine({hor: true, top: bottomLim});
            this.nearElementFoundInHorizontal = true;
        }else{
            this.nearElementFoundInHorizontal = false;
            this.removeGuideLine('hor');
        }
    }

    createGuideLine(attr){
        let line = null;
        if(attr.hor){
            if(!this.canvas.current.querySelector('#horizontal-guide-line')){
                line = document.createElement('div');
                line.id = 'horizontal-guide-line';
            }else{
                line = this.canvas.current.querySelector('#horizontal-guide-line');
            }
            line.style.position = 'absolute';
            line.style.background = '#51acec';
            line.style.height = '1px';
            line.style.width = '100%';
            line.style.left = '0';
            line.style.top = `${attr.top}px`;

            this.canvas.current.appendChild(line);
        }

        if(attr.ver){
            if(!this.canvas.current.querySelector('#vertical-guide-line')){
                line = document.createElement('div');
                line.id = 'vertical-guide-line';
            }else{
                line = this.canvas.current.querySelector('#vertical-guide-line');
            }
            line.style.position = 'absolute';
            line.style.background = '#51acec';
            line.style.width = '1px';
            line.style.height = '100%';
            line.style.top = '0';
            line.style.left = `${attr.left}px`;

            this.canvas.current.appendChild(line);
        }
    }

    removeGuideLine(orientation){
        if(orientation === 'hor' && this.canvas.current.querySelector('#horizontal-guide-line')){
            this.canvas.current.querySelector('#horizontal-guide-line').remove();
        }else if(orientation === 'ver' && this.canvas.current.querySelector('#vertical-guide-line')){
            this.canvas.current.querySelector('#vertical-guide-line').remove();
        }
    }

    render(){
        return(
            <div id='canvas-container'>
                <div id='canvas' ref={this.canvas}>
                    {this.props.elements}
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas)
