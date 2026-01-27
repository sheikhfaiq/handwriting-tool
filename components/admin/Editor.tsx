"use client";

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
}

const Editor = ({ value, onChange, placeholder }: EditorProps) => {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    return (
        <div className="bg-white ql-custom-container">
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
