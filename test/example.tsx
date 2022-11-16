import Reactive, {setObjectCreateElement} from 'jsx/index';
import element from 'jsx/element';
import Home from './views/Home';

setObjectCreateElement(element)

const result = Reactive.factory(
    <Home />
)

result.then((arr: any[]) => {
    const root = document.getElementById('output');
    if (Array.isArray(arr)) {
        arr.forEach(element => {
            root.append(element)
        });
    } else {
        root.append(arr)
    }
    
})
