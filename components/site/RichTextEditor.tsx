import React, { forwardRef, useImperativeHandle, useRef } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const RichTextEditor = forwardRef<any, RichTextEditorProps>(({ value, onChange, placeholder }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => ({
        get selectionStart() { return textareaRef.current?.selectionStart || 0; },
        get selectionEnd() { return textareaRef.current?.selectionEnd || 0; },
        setSelectionRange(start: number, end: number) {
            textareaRef.current?.focus();
            textareaRef.current?.setSelectionRange(start, end);
        },
        focus() { textareaRef.current?.focus(); }
    }));

    return (
        <div className="relative min-h-[400px] w-full bg-white rounded-2xl border border-gray-100 shadow-inner overflow-hidden focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full min-h-[400px] p-6 text-gray-700 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed"
                spellCheck={false}
            />
        </div>
    );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;