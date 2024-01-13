import React, { useCallback, useState } from 'react';
import Dialog from '@mui/material/Dialog'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import './Visit.css'
import DialogTitle from '@mui/material/DialogTitle';
import { useDropzone } from 'react-dropzone';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Rating from '@mui/material/Rating';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';


export interface VisitProps {
    open: boolean;
    onClose: () => void;
}


const focusedStyle = {
    borderColor: '#2196f3'
};

export function Visit({ open, onClose }: VisitProps) {
    const [rating, setRating] = useState<number>();
    const [paths, setPaths] = useState([]);
    const [listDefaultStr, setListDefaultStr] = useState<string>('');
    const bullet = "\u2022";
    const bulletWithSpace = `${bullet} `;
    const enter = 13;

    const onDrop = useCallback((acceptedFiles: any) => {
        setPaths(acceptedFiles.map((file: Blob | MediaSource) => URL.createObjectURL(file)));
    }, [setPaths]);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleInput = (event: { keyCode: any; target: any; }) => {
        const { keyCode, target } = event;
        const { selectionStart, value } = target;

        if (keyCode === enter) {
            target.value = [...value]
                .map((c, i) => i === selectionStart - 1
                    ? `\n${bulletWithSpace}`
                    : c
                )
                .join('');

            target.selectionStart = selectionStart + bulletWithSpace.length;
            target.selectionEnd = selectionStart + bulletWithSpace.length;
        }

        if (value[0] !== bullet) {
            target.value = `${bulletWithSpace}${value}`;
        }
    }

    return <Dialog PaperProps={{
        sx: {
            minWidth: '600px',
            minHeight: '500px'
        }
    }} onClose={onClose} open={open}>
        <div className="dialogContent"  >
            <Rating
                name="simple-controlled"
                size="large"
                precision={0.5}
                value={rating}
                onChange={(event, newValue) => {
                    setRating(newValue!);
                }}
            />
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                {
                    <p>Add photos</p>
                }
            </div>
            <ImageList
                variant="quilted"
                cols={4}
                rowHeight={121}
            >
                {paths.map((path) => (
                    <ImageListItem key={path} cols={1} rows={1}>
                        <img
                            src={path}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
            <TextareaAutosize className="visitTextarea" minRows={3} placeholder="Your experience" />
            <TextareaAutosize className="visitTextarea listTextarea" onClick={() => { console.log(listDefaultStr); return setListDefaultStr(bulletWithSpace); }} onKeyUp={handleInput} minRows={3} placeholder="Highlights" defaultValue={listDefaultStr} />
        </div>
        <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button>Post</Button>
        </DialogActions>
    </Dialog>
}