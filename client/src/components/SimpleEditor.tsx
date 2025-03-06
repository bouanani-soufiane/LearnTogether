import React, { useState } from 'react';

interface SimpleEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    minHeight?: string;
}

const SimpleEditor: React.FC<SimpleEditorProps> = ({
                                                       value = '',
                                                       onChange,
                                                       placeholder = 'Write your content here...',
                                                       minHeight = '200px',
                                                   }) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className="border border-gray-300 rounded-md">
      <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          style={{ minHeight, width: '100%' }}
          className="p-3 rounded-md w-full outline-none resize-y"
      />
        </div>
    );
};

export default SimpleEditor;