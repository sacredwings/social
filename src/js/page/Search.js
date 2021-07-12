import React, {useState, useEffect} from 'react';
import SearchUser from "../element/SearchUser";
import SearchGroup from "../element/SearchGroup";
import SearchTopic from "../element/SearchTopic";
import SearchArticle from "../element/SearchArticle";
import SearchPost from "../element/SearchPost";
import SearchVideo from "../element/SearchVideo";

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
        <div className="row">
            <div className="col-lg-12">

                <form className="row g-3" onSubmit={onFormSubmit}>
                    <div className="col-9">
                        <input type="text" className="form-control" id="q" placeholder="Поиск" value={search} onChange={onChangeText}/>
                    </div>
                    <div className="col-auto">
                        <button type="submit" className="btn btn-primary mb-3">Найти</button>
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
                <SearchTopic q={q}/>
                <hr/>
                <SearchPost q={q}/>

            </div>
        </div>
    );
}