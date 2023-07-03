import React, { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

type Props ={
  onChange: (value: string) => void;
  value: string;
};

const Editor = ({onChange, value}: Props) => {
  const quillRef = useRef<ReactQuill>(null);

  const handleEmojiClick = (emoji: any) => {
    const range = quillRef.current?.getEditor()?.getSelection();
    if (range) {
      quillRef.current?.getEditor()?.insertText(range.index, emoji.native);
    }
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              [{ emoji: 'emoji-mart' }],
            ],
            handlers: {
              'emoji-mart': () => {
                const pickerEl: HTMLElement | null = document.querySelector('.emoji-mart-picker');
                if (pickerEl) {
                  pickerEl.style.display = pickerEl.style.display === 'none' ? 'block' : 'none';
                }
              },
            },
          },
        }}
      />
      <Picker
        style={{ display: 'none' }}
        onSelect={handleEmojiClick}
        data={data}
      />
    </div>
  );
};

export default Editor;
