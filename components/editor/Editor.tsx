"use client";

import { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditorType } from "tinymce";

type TinyMCEEditorProps = {
  initialValue: string;
  height: number;
  onChange: (content: string, editor: TinyMCEEditorType) => void;
};

export const TextEditor = ({
  initialValue,
  height,
  onChange,
}: TinyMCEEditorProps): JSX.Element => {
  const editorRef = useRef<TinyMCEEditorType | null>(null);

  return (
    <>
      <Editor
        apiKey='fsbnr3zlo2q5fwqpmqb4jdwe24d8to5v8jtu00dbh87piwca'
        onInit={(_, editor) => (editorRef.current = editor)}
        value={initialValue}
        init={{
          height,
          menubar: false,
          directionality: "ltr", // Ensure left-to-right typing
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
