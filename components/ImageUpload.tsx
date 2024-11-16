import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
  setIngredients: (ingredients: string[]) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  errorMessage: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  setIngredients,
  preview,
  setPreview,
  errorMessage,
}) => {
  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setPreview(base64data);
      onImageUpload(base64data);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        p: !preview ? 4 : 1,
        border: '2px solid',
        borderColor: isDragActive ? 'primary.main' : 'grey.400',
        borderRadius: 2,
        textAlign: 'center',
        backgroundColor: isDragActive ? 'grey.100' : 'white',
        cursor: 'pointer',
      }}
      component="section"
    >
      <input {...getInputProps()} />
      {preview ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 2,
            overflow: 'hidden',
            margin: 'auto',
          }}
        >
          <Box
            component="img"
            src={preview}
            alt="Preview"
            sx={{
              width: '100px',
              height: 'auto',
              borderRadius: '8px',
              display: 'block',
              margin: 'auto',
            }}
          />
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setPreview(null);
              setIngredients([]);
            }}
            sx={{ mt: 1 }}
          >
            Upload Another Image
          </Button>
        </Box>
      ) : (
        <Typography variant="h6" color="textSecondary">
          Drag & drop an image here, or click to select!
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;