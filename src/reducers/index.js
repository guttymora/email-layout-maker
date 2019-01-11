const initialState = {
    selectedElement: null,
    generatedElements: [],
    generateHTML: false,
    elementInMovement: {},
};

let parentContainer = document.createElement('div');
let container = null;

const buildFileContainer = function () {
    if(!container){
        let globalStyle = document.createElement('style');
        globalStyle.textContent = `
            body {
                margin: 0;
                padding: 0;
            }
            * {
                box-sizing: border-box;
            }
        `;

        parentContainer.style.display = 'flex';
        parentContainer.style.width = '100%';
        parentContainer.style.height = '100vh';
        parentContainer.style.justifyContent = 'center';
        parentContainer.style.alignItems = 'center';
        parentContainer.style.background = '#eee';

        container = document.createElement('div');

        parentContainer.appendChild(globalStyle);
        parentContainer.appendChild(container);

        container.id = 'container';
        container.style.width = '100%';
        container.style.maxWidth = '960px';
        container.style.height = '100vh';
        container.style.display = 'flex';
        container.style.position = 'relative';
        container.style.background = '#fff';
    }

    container.innerHTML = null;

    return parentContainer;
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_BORDER':
            if(state.selectedElement){
                state.selectedElement.setState({
                    style: {...state.selectedElement.state.style, border: action.payload}
                });
            }

            return state;

        case 'SET_BACKGROUND':
            if(state.selectedElement){
                state.selectedElement.setState({
                    style: {...state.selectedElement.state.style, background: action.payload}
                });
            }
            return state;

        case 'SET_FONT_COLOR':
            if(state.selectedElement){
                state.selectedElement.setState({
                    style: {...state.selectedElement.state.style, color: action.payload}
                });
            }
            return state;

        case 'SET_ELEMENT':
            if(action.payload.action === 'add'){
                return Object.assign({}, state, {
                    selectedElement: action.payload.element
                });
            }else if(action.payload.action === 'remove' && state.selectedElement === action.payload.element){
                return Object.assign({}, state, {
                    selectedElement: null
                });
            }else{
                return state;
            }

        case 'GENERATE_ELEMENT':
            return Object.assign({}, state, {
                generatedElements: [...state.generatedElements, action.payload.element]
            });

        case 'DELETE_ELEMENT':
            // Set selected element to null
            return Object.assign({}, state, {
                selectedElement: null,
                generatedElements: state.generatedElements.filter((x) => x.props.unique !== action.payload)
            });

        case 'GENERATE_TEMPLATE':
            parentContainer = buildFileContainer();

            state.generatedElements.forEach(el => {
                const data = el.ref.current.generateHTML();
                let element = document.createElement(data.element);
                Object.assign(element.style, data.style);
                element.style.left = data.left;
                if(data.text){
                    const span = document.createElement('span');
                    span.textContent = data.text;
                    element.appendChild(span);
                }

                parentContainer.querySelector('#container').appendChild(element);
            });

            let blobParts = [parentContainer.outerHTML];
            const downloadLink = document.createElement('a');
            downloadLink.download = 'text.html';
            let blob = new Blob(blobParts, {type : 'text/html'});

            downloadLink.href = URL.createObjectURL(blob);

            downloadLink.click();

            return state;

        case 'ELEMENT_IN_MOVEMENT':
            return Object.assign({}, state, {
                elementInMovement: action.payload,
            });

        default:
            return state;
    }
}

export default rootReducer;