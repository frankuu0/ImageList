import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {ImageListItem, ImageList, Modal, Box, Tooltip, Button, Slider} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const ImageListComponent = (props) => {
    const [imageArray, setImageArray] = useState([])
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [elemUrl, setElemUrl] = useState(null)
    const [elemId, setElemId] = useState(null)
    const [albumId, setAlbumId] = useState(1)
    const [elemSpice, setElemSplice] = useState(1)

    const CloseModalHandler = () => {
        setIsOpenModal(false)
    }

    const albumSearch = () => {
        axios
            .get(`https://jsonplaceholder.typicode.com/albums/${albumId}/photos`)
            .then(response => {
                setImageArray(response.data)
                setElemSplice(1)
                console.log(imageArray)
            })
            .catch(() => console.log('Server is not responding'))
    }

    const style = {
        padding: '10px 20px 20px 20px',
        width: '600px',
        height: '650px',
        backgroundColor: '#F8F8FF',
        borderRadius: '10px',
    }

    const ModalStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const flex = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    }

    const DeletePicture = useCallback((elem) => {
      axios
          .delete(`https://jsonplaceholder.typicode.com/photos/${elem}`)
          .then(() => {console.log(`Picture with id:${elem} removed`, )})
          .catch((error) => {console.log(error)})
    }, [])

    const SortHandler = () => {
      axios
          .get(`http://jsonplaceholder.typicode.com/albums?id=${albumId}/photos`)
          .then(() => albumSearch())
          .catch(() => console.log('error'))
    }

    useEffect(() => {
        axios
            .get(`https://jsonplaceholder.typicode.com/albums/${props.loadPage}/photos`)
            .then(response => {
                setImageArray(response.data)
            })
            .catch(() => console.log('Server not responding'))
        setElemSplice(1)
    },[props.loadPage])

    const handleRangeChange = (event, newVal) => {
        setAlbumId(newVal)
    }

    return (
        <div>
            <Box sx={flex}>
                <h4>Sort by Album Id</h4>
                <Slider
                    sx={{width: '50%'}}
                    min={1}
                    max={100}
                    value={albumId}
                    onChange={handleRangeChange}
                    valueLabelDisplay="auto"
                />
                <Button variant='contained' color='success' onClick={SortHandler}><SearchIcon /></Button>
            </Box>
            <ImageList sx={{width: 750, height: 600}} cols={5} rowHeight={150}>
                {
                    imageArray.map((item) => (
                        <Tooltip title={`TITLE: ${item.title} // ALBUM ID: ${item.albumId} // ID: ${item.id}`} arrow key={item.id} placement="top">
                            <ImageListItem style={{cursor: 'pointer'}}>
                                <img
                                    src={`${item.thumbnailUrl}?w=150&h=150&fit=crop&auto=format`}
                                    srcSet={`${item.thumbnailUrl}?w=150&h=150&fit=crop&auto=format&dpr=2 2x`}
                                    alt={item.title}
                                    loading="lazy"
                                    data-elemurl={item.url}
                                    data-elemid={item.id}
                                    onClick={(e) => {
                                        setElemUrl(e.target.dataset.elemurl)
                                        setElemId(e.target.dataset.elemid)
                                        setIsOpenModal(true)
                                    }}
                                />
                            </ImageListItem>
                        </Tooltip>
                    ))
                }
            </ImageList>
            <Modal open={isOpenModal} onClose={CloseModalHandler} style={ModalStyle}>
                <Box sx={style}>
                    <Box sx={flex}>
                        <Button variant='contained' color='error' sx={{marginBottom: '10px'}} onClick={() =>
                        {
                            imageArray.splice(elemId - elemSpice,1)
                            setElemSplice(prev => prev + 1)
                            DeletePicture(elemId)
                            CloseModalHandler()
                        }
                        }><DeleteIcon /></Button>
                        <Button variant='contained' color='primary' sx={{marginBottom: '10px'}} onClick={CloseModalHandler}><CloseIcon /></Button>
                    </Box>
                    <img src={elemUrl} alt={elemUrl} style={{borderRadius: '8px'}}/>
                </Box>
            </Modal>
        </div>
    );
};

export default ImageListComponent;