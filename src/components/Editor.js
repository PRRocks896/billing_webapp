import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({
    value,
    readOnly = false,
    onChange,
    onBlur,
}) => {
    return (
        <ReactQuill 
            theme="snow" 
            value={value} 
            onChange={onChange}
            onBlur={onBlur}
            readOnly={readOnly}
            style={{ height: '50vh' }}
            modules={{
                toolbar: [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, 
                    {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image'],
                    ['clean']
                ],

            }}
        />
    )
}

export default Editor;