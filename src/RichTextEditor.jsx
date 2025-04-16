// In your RichTextEditor.jsx file

import React, { useState, useEffect, useRef } from 'react';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const RichTextEditor = ({ initialContent, onChange }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const lastSelection = useRef(null);

    // Custom block type dropdown component
    const BlockTypeCustomComponent = (props) => {
        const { expanded, onExpandEvent, onChange, currentState } = props;

        // Map the technical terms to user-friendly labels
        const labels = {
            'Normal': 'Default',
            'H2': 'Heading',
            'H3': 'Subhead'
        };

        // Get the current block type or default to 'Normal'
        const currentBlockType = currentState?.blockType || 'Normal';

        return (
            <div className="custom-block-dropdown">
                <div className="dropdown-selector" onClick={onExpandEvent}>
                    <span>{labels[currentBlockType]}</span>
                    <span className="dropdown-arrow">â–¼</span>
                </div>

                {expanded && (
                    <div className="dropdown-options">
                        {['Normal', 'H2', 'H3'].map(option => (
                            <div
                                key={option}
                                className={`dropdown-option ${currentBlockType === option ? 'active' : ''}`}
                                onClick={() => {
                                    onChange(option);
                                }}
                            >
                                {labels[option]}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Configure toolbar with custom dropdown component
    const toolbarConfig = {
        options: ['inline', 'blockType', 'list', 'textAlign', 'link', 'image', 'history'],
        blockType: {
            inDropdown: true,
            options: ['Normal', 'H2', 'H3'],
            component: BlockTypeCustomComponent
        },
        inline: {
            options: ['bold', 'italic', 'underline', 'strikethrough']
        }
    };

    const handleEditorChange = (newState) => {
        const content = newState.getCurrentContent();
        setEditorState(newState);
        onChange(draftToHtml(convertToRaw(content)));
    };

    // Rest of your component code...

    return (
        <div className="editor-wrapper">
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                toolbar={toolbarConfig}
            // Other props...
            />
        </div>
    );
};

export default RichTextEditor;