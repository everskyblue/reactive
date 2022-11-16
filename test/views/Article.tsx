import { TUseProp } from 'jsx/contracts';
import Reactive from 'jsx/index';
import { useEffect, useState } from "jsx/state";
import type {ArticleProps} from './types'

let uuid = 0;

function Article({title, body, id}: ArticleProps & TUseProp) {
    const [$title, setTitle] = useState(title)
    
    return ( 
        <div class='article' 
            style='padding: 10px; background:green;line-height:20px;margin-bottom:5px'
            onClick={(e)=> {
                console.log(e, this);
                setTitle('hello')
            }}
            data-key={(id + (uuid++))}
        >
            <h5>{$title}</h5>
            <article>{body}</article>
        </div>
    );
}

export default Article;