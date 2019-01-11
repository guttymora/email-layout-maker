import React from 'react';
import './select.css'

const Select = (props) => {
    const container = React.createRef();
    const box = React.createRef();
    const icon = React.createRef();
    const selectionButton = React.createRef();

    let className = null;
    switch(props.type){
        case 'button':
            className = 'select-button';
            break;
        default:
            className = 'normal';
            break;
    }

    const selectionStyle = {
        backgroundColor: props.bgColor || 'none',
        color: props.fontColor || '#666',
    };

    const wrapperStyle = {
        position: 'relative',
        height: props.height || 'auto',
        width: props.width || 'auto'
    };

    const handleShow = () => {
        if(props.onOpen) { props.onOpen() }

        if(box.current.scrollLeft < 40){
            box.current.style.left = `${box.current.offsetWidth / 2}px`;
        }

        if(!box.current.classList.contains('fade-select-box')){
            if(className === 'normal'){
                icon.current.textContent = 'arrow_drop_up';
            }
            box.current.classList.add('fade-select-box');

            let parent = Object.assign({}, container);
            handleBlur(parent);
        }else{
            box.current.classList.remove('fade-select-box');

            if(className === 'normal'){
                icon.current.textContent = 'arrow_drop_down';
            }
        }
    };

    const handleBlur = (parent) => {
        document.addEventListener('click', function(e){
            if(!parent.current.contains(e.target)){
                parent.current.querySelector('.select-box').classList.remove('fade-select-box');
            }
        });
    };

    return (
        <div className='select-wrapper' style={wrapperStyle} ref={container}>
            <div className={`${className} selection`} ref={selectionButton} style={Object.assign(selectionStyle, props.style)} onClick={handleShow}>
                { props.text &&
                    <span>{props.text}</span>
                }
                { props.icon &&
                    <i className='material-icons custom-icon'>{ props.icon}</i>
                }
                {
                    className === 'normal' &&
                    <i className='material-icons' ref={icon}>{ props.icon || 'arrow_drop_down'}</i>
                }
            </div>
            <div className={`select-box ${(!props.close) ? 'fade-select-box' : ''}`} ref={box}>
                {props.children}
            </div>
        </div>
    )
};

export default Select;