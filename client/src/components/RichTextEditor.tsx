import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Bold,
    Italic,
    Underline,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Quote,
} from "lucide-react";

interface RichTextEditorProps {
    label: string;
    value: string;
    onChange: (content: string) => void;
    id?: string;
    placeholder?: string;
}

export default function RichTextEditor({
    label,
    value,
    onChange,
    id = "content",
    placeholder = "İçeriği buraya yazın...",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Sync incoming value with contentEditable
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            if (!isFocused) {
                editorRef.current.innerHTML = value || "";
            }
        }
    }, [value, isFocused]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
            handleInput();
        }
    };

    const ToolbarButton = ({ icon: Icon, command, commandValue, title }: any) => (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-1"
            onClick={() => execCommand(command, commandValue)}
            title={title}
        >
            <Icon className="h-4 w-4" />
        </Button>
    );

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="border border-input rounded-md overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 border-b border-input p-1 bg-muted/50">
                    <ToolbarButton icon={Bold} command="bold" title="Kalın" />
                    <ToolbarButton icon={Italic} command="italic" title="İtalik" />
                    <ToolbarButton icon={Underline} command="underline" title="Altı Çizili" />
                    <div className="w-px h-5 bg-border mx-1" />
                    <ToolbarButton icon={Heading1} command="formatBlock" commandValue="H1" title="Başlık 1" />
                    <ToolbarButton icon={Heading2} command="formatBlock" commandValue="H2" title="Başlık 2" />
                    <div className="w-px h-5 bg-border mx-1" />
                    <ToolbarButton icon={List} command="insertUnorderedList" title="Madde İşaretli Liste" />
                    <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numaralandırılmış Liste" />
                    <ToolbarButton icon={Quote} command="formatBlock" commandValue="BLOCKQUOTE" title="Alıntı" />
                </div>

                {/* Editor Area */}
                <div
                    ref={editorRef}
                    contentEditable
                    className="min-h-[300px] p-4 outline-none prose prose-sm max-w-none"
                    onInput={handleInput}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false);
                        handleInput();
                    }}
                    data-placeholder={placeholder}
                    id={id}
                />
                {/* Placeholder styling for empty editor */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          [contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            cursor: text;
          }
        `}} />
            </div>
        </div>
    );
}
