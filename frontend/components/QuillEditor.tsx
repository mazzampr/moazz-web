'use client';

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import QuillResize from 'quill-resize-module';
import 'quill-resize-module/dist/resize.css';
import Cookies from 'js-cookie';
import { compressImage } from '../lib/utils/imageCompression';

Quill.register('modules/resize', QuillResize);

interface QuillEditorProps {
  value?: string;
  onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {    
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const previousContentsRef = useRef<any>(null);

  // Helper to extract image URLs from Quill Delta
  const extractImages = (contents: any): string[] => {
    const images: string[] = [];
    if (contents && contents.ops) {
      contents.ops.forEach((op: any) => {
        if (op.insert && op.insert.image) {
          images.push(op.insert.image);
        }
      });
    }
    return images;
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    if (!quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: 'snow',
        modules: {
          resize: {
            modules: ['DisplaySize', 'Toolbar', 'Resize', 'Keyboard'],
          },
          toolbar: {
            container: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ align: [] }],
              ['link', 'image', 'blockquote', 'code-block'],
              ['clean'],
            ],
            handlers: {
              image: () => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();

                input.onchange = async () => {
                  if (input.files && input.files[0]) {
                    let file = input.files[0];
                    
                    // Compress the image using our reusable utility
                    file = await compressImage(file);

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const adminSecret = Cookies.get('ADMIN_SECRET') || '';
                      // Assuming your backend API is at http://localhost:4000
                      // You might want to use process.env.NEXT_PUBLIC_API_URL here if available.
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
                      
                      const response = await fetch(`${apiUrl}/upload/image`, {
                        method: 'POST',
                        headers: {
                          'x-api-key': adminSecret
                        },
                        body: formData
                      });

                      if (!response.ok) {
                        throw new Error('Image upload failed');
                      }

                      const data = await response.json();
                      const range = quill.getSelection(true);
                      quill.insertEmbed(range.index, 'image', data.url);
                      quill.setSelection(range.index + 1, 0);
                    } catch (error) {
                      console.error('Error uploading image:', error);
                      alert('Failed to upload image. Make sure your Supabase environment variables are set in the backend .env file and you have a bucket named "images".');
                    }
                  }
                };
              }
            }
          }
        },
        placeholder: 'Write your article content here...',
      });
      
      quillRef.current = quill;
      previousContentsRef.current = quill.getContents();

      quillRef.current.on('text-change', () => {
        const contents = quill.getContents();
        const html = quill.root.innerHTML;
        
        // Check for deleted images
        if (previousContentsRef.current) {
          const oldImages = extractImages(previousContentsRef.current);
          const newImages = extractImages(contents);
          
          const deletedImages = oldImages.filter(
            oldImg => !newImages.includes(oldImg)
          );
          
          if (deletedImages.length > 0) {
            deletedImages.forEach(async (deletedUrl) => {
              // Only delete if it's a Supabase storage URL (meaning we uploaded it)
              if (deletedUrl.includes('supabase.co/storage')) {
                try {
                  const adminSecret = Cookies.get('ADMIN_SECRET') || '';
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
                  await fetch(`${apiUrl}/upload/image/delete`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': adminSecret
                    },
                    body: JSON.stringify({ url: deletedUrl })
                  });
                  console.log('Successfully deleted image from storage:', deletedUrl);
                } catch (e) {
                  console.error('Failed to notify backend of image deletion:', e);
                }
              }
            });
          }
        }
        
        previousContentsRef.current = contents;
        onChange(html);
      });
    }
  }, [onChange]);

  useEffect(() => {
    if (quillRef.current && value) {
      const currentHtml = quillRef.current.root.innerHTML;
      if (value !== currentHtml && value !== '<p><br></p>') {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return <div ref={containerRef} />;
}
