import React, {useState, useEffect} from 'react'
import SearchUser from "../../element/search/User"
import SearchGroup from "../../element/search/Group"
import SearchVideo from "../../element/search/Video"
import SearchArticle from "../../element/search/Article";
//import SearchTopic from "../element/SearchTopic";
//import SearchPost from "../element/SearchPost";


export default function ({}) {
    let [search, setSearch] = useState('')
    let [q, setQ] = useState('')

    function onChangeText(e) {
        let name = e.target.id;
        let value = e.target.value;

        setSearch(value)
    }

    async function onFormSubmit (e) {
        e.preventDefault() // Stop form submit

        setQ(search)
    }

    return (
        <div className="search">
            <div className="row block">
                <div className="col-lg-12">

                    <form className="row g-3" onSubmit={onFormSubmit}>

                        <div className="mb-3">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="q" placeholder="Поиск" aria-label="Recipient's username" aria-describedby="button-addon2" value={search} onChange={onChangeText}/>
                                <button className="btn btn-outline-primary" type="submit" id="">Найти</button>
                            </div>
                        </div>


                    </form>

                    <SearchUser q={q}/>
                    <hr/>

                    <SearchGroup q={q}/>
                    <hr/>

                    <SearchVideo q={q}/>
                    <hr/>

                    <SearchArticle q={q}/>
                    <hr/>

                    {/*<SearchTopic q={q}/>
                <hr/>
                <SearchPost q={q}/>*/}

                </div>
            </div>
        </div>
    );
}