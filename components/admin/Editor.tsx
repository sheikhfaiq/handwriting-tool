"use client";

import { useMemo } from "react";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

// Fix for React Quill dynamic import typing
const ReactQuill = dynamic(
    async () => {
        const { default: RQ } = await import("react-quill-new");
        return ({ forwardedRef, ...props }: any) => <RQ ref={forwardedRef} {...props} />;
    },
    { ssr: false }
);

interface EditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    className?: string;
}

const Editor = ({ value, onChange, placeholder, className = "" }: EditorProps) => {
    const modules = useMemo(
        () => ({
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ font: [] }],
                [{ size: ["small", false, "large", "huge"] }],
                ["bold", "italic", "underline", "strike", "blockquote"],
                [{ color: [] }, { background: [] }],
                [{ script: "sub" }, { script: "super" }],
                [{ align: [] }],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                ["link", "image", "video"],
                ["clean"],
            ],
            keyboard: {
                bindings: {
                    // Disable auto-bullet list on hyphen ONLY
                    "list autofill": {
                        prefix: /^\s*(-)$/,
                        key: " ",
                        handler: function (range: any, context: any) {
                            // Just insert the space, preventing the list formatting
                            // @ts-ignore - 'this' context refers to the keyboard module
                            this.quill.insertText(range.index, " ");
                            return false; // Stop propagation/default behavior
                        },
                    },
                },
            },
        }),
        []
    );

    return (
        <div className={`bg-white ql-custom-container ${className}`}>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder}
                className="h-64 mb-12"
            />
            <style jsx global>{`
                .ql-custom-container .ql-editor {
                    color: #000000 !important;
                    font-size: 16px;
                }
                .ql-custom-container .ql-editor.ql-blank::before {
                    color: #000000 !important;
                    font-style: normal;
                }
            `}</style>
        </div>
    );
};

export default Editor;
