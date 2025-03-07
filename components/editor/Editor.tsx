"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditorType } from "tinymce";
import { editorKey } from "@/constant/env";

type TinyMCEEditorProps = {
  initialValue: string;
  placeholder?: string;
  height: number;
  onChange: (content: string, editor: TinyMCEEditorType) => void;
};

export const TextEditor = ({
  initialValue,
  placeholder,
  height,
  onChange,
}: TinyMCEEditorProps): JSX.Element => {
  const editorRef = useRef<TinyMCEEditorType | null>(null);

  return (
    <>
      <Editor
        apiKey={editorKey}
        onInit={(_, editor) => (editorRef.current = editor)}
        value={initialValue}
        init={{
          placeholder: placeholder,
          height,
          menubar: false,
          directionality: "ltr",
          plugins: [
            "directionality",
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | ltr rtl | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; direction: ltr; text-align: left; unicode-bidi: normal; }",
        }}
        onEditorChange={onChange}
      />
    </>
  );
};
