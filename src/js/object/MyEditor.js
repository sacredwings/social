import React, {useState, useEffect, useRef} from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js';
import 'draft-js/dist/Draft.css';

export default function MyEditor() {
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const onBoldClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    }

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            console.log("обработано")
            return "обработано";
        }
        console.log("не обработано")
        return "не обработано";
    }

    return <>
        <button type="button" onClick={onBoldClick}>Bold</button>
        <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleKeyCommand={handleKeyCommand}
        />
    </>
}