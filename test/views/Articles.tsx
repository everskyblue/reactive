import Reactive from "jsx/index";
import { useEffect, useState } from "jsx/state";
import { StateComponent } from "jsx/StateComponent";
import { TUseProp } from "jsx/contracts";
import { adapterJsonplaceholder } from "./adapters/frontend";
import Article from "./Article";
/*
function Articles({ data }: TUseProp) {
    const [articles, setArticles] = data;
    const map = () =>
        articles.map<adapterJsonplaceholder.TPost>((val) => (
            <Article title={val.title} body={val.body} id={val.uuid} />
        ));
    console.log(setArticles, articles);

    return (
        <section class="articles">
            <button
                type="button"
                onClick={(e) => {
                    setArticles(articles.value.slice(0, 3));
                }}
            >
                click me
            </button>
            {articles.map<adapterJsonplaceholder.TPost>((val) => (
                <Article title={val.title} body={val.body} id={val.uuid} />
            ))}
        </section>
    );
}
*/
function Articles(params: any) {
    const [articles, setArticles] = useState<adapterJsonplaceholder.TPost[]>([{
        body: 'articulo',
        id: 1,
        title: 'y titlee',
        uuid: 145
    }], this)
    const [text, setText] = useState('presiona', this);
    //console.log(params, articles.toString(), setArticles);
    //console.log(this);
    
    return (
        <section class="articles">
            <button
                type="button"
                onClick={(e) => {
                    //setArticles(articles.slice(0, 3));
                    setText('has hecho click')
                    setArticles([{
                        body: 'articulo',
                        id: 1,
                        title: 'y titlee',
                        uuid: 145
                    }])
                }}
            >
                {text}
            </button>
            {articles.map<adapterJsonplaceholder.TPost>((val) => {
                console.log(val);
                
                return <Article title={val.title} body={val.body} id={val.uuid} />
            }
            )}
        </section>
    );
}

export default Articles;
