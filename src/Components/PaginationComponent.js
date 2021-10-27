import {Pagination} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import ImageListComponent from "./ImageListComponent";

const PaginationComponent = () => {

    const [currentPage, setCurrentPage] = useState(1)
    const [pagesCount, setPagesCount] = useState(1)

    const pageHandler = (event, value) => {
        setCurrentPage(value)
    }

    useEffect(() => {
        axios
            .get('https://jsonplaceholder.typicode.com/albums')
            .then(response => {
                setPagesCount(response.data.length)
            })

    })

    const style = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }

    return (
        <div style={style}>
            <p>Click on a thumbnail to open a modal window with a full-size image or remove an image from the list</p>
            <ImageListComponent loadPage={currentPage}/>
            <Pagination count={pagesCount} shape="rounded" onChange={pageHandler}/>
        </div>
    );
};

export default PaginationComponent;