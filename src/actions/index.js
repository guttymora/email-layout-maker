import React from 'react';
import InteractiveElement from "../components/interactive-element/InteractiveElement";

export function setBorder(payload) {
    return { type: 'SET_BORDER', payload };
}

export function setElement(payload) {
    return { type: 'SET_ELEMENT', payload };
}

export function generateElement(payload) {
    const ref = React.createRef();
    switch(payload.shape){
        case 'square':
            payload.element = <InteractiveElement key={payload.id} unique={payload.id} ref={ref}/>;
            break;
        case 'text':
            payload.element = <InteractiveElement key={payload.id} unique={payload.id} text='texto' background='none' />;
            break;
        default:
            break;
    }
    return { type: 'GENERATE_ELEMENT', payload };
}

export function deleteElement(payload) {
    return { type: 'DELETE_ELEMENT', payload };
}

export function generateTemplate(){
    return { type: 'GENERATE_TEMPLATE' };
}

export function setBackground(payload){
    return { type: 'SET_BACKGROUND', payload };
}

export function setFontColor(payload){
    return { type: 'SET_FONT_COLOR', payload };
}

export function elementInMovement(payload){
    return { type: 'ELEMENT_IN_MOVEMENT', payload };
}