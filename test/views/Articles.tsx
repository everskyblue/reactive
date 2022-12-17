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
    const [articles, setArticles] = useState([{
        "userId": 1,
        "id": 5,
        "title": "nesciunt quas odio",
        "body": "repudiandae veniam quaerat sunt sed\nalias aut fugiat sit autem sed est\nvoluptatem omnis possimus esse voluptatibus quis\nest aut tenetur dolor neque"
      }], this);
   
    return (
        <section class="articles">
            <button type='button' onClick={() => {
                fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
                .then(res => res.json())
                .then(result => setArticles(result))
            }}>cargar datos</button>
            <div class="posts">
                {
                    articles.length === 0? 'no hay post cargados' : articles.map(post => <Article body={post.body} title={post.title} id={post.id}></Article>)
                }
            </div>
        </section>
    );
}

export default Articles;
