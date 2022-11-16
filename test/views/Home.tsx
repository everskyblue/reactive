import Reactive from "jsx/index";
import Article from "./Article";
import Articles from "./Articles";
import Footer from "./partial/Footer";
import Header from "./partial/Header";
import useEffectArticle from "./services/useArticle";

function Home() {
    return ( 
        <>
        hola
            <Header />
            <main>
                <h1>Home</h1>
                <Articles useEffect={useEffectArticle} childComponent={Article} />
            </main>
            <Footer />
        </>
     );
}


export default Articles;