import { jpholderPost } from "./jholder.service";
import { TUseStateComponent } from "jsx/contracts";


function useEffectArticle(): TUseStateComponent {
    const [value, setState] = this.useState([]);
    
    jpholderPost('?userId=2').then(data => {
         setState(data);
    })
    
    return [
        value,
        setState
    ]
/*
    return (
        <div class='articles use-effect'>
            {data.map(post => <Article title={post.title} body={post.body} />)}
            estado de useEffect {value}
        </div>
     );*/
}

export default useEffectArticle;