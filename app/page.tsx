'use client'
import React, { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import { Container, Typography, Box, Chip, CircularProgress } from '@mui/material';

interface IngredientResponse {
  ingredients: string[];
  error?: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageUpload = async (imageData: string) => {
    try {
      setErrorMessage('');
      const response = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
      });
      const data: IngredientResponse = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
        setIngredients([]);
        return;
      }

      if (!data.ingredients || data.ingredients.length === 0) {
        setErrorMessage('No food detected in the image.');
        setIngredients([]);
        return;
      }

      setIngredients(data.ingredients);
    } catch (error) {
      console.error('Error detecting ingredients:', error);
      setErrorMessage('Failed to process the image. Please try again.');
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        mt: 4, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        textAlign: 'center' 
      }}
    >
      <Typography variant="h4" gutterBottom className='m-2'>
        Fridge Ingredient Detection
      </Typography>

      <ImageUpload 
        onImageUpload={handleImageUpload}
        setIngredients={setIngredients}
        preview={preview}
        setPreview={setPreview}
        errorMessage={errorMessage}
      />
      <small className="mt-2 text-amber-300">
        Built with ClarifAI
      </small>

      {preview && !ingredients.length && !errorMessage && (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
          <Typography variant="h6" gutterBottom className='m-2'>
            Analyzing Image ...
          </Typography>
        </Box>
      )}

      {ingredients.length > 0 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Detected Ingredients:</Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1, 
              mt: 1, 
              justifyContent: 'center' 
            }}
          >
            {ingredients.map((ingredient, index) => (
              <Chip 
                key={index} 
                label={ingredient} 
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}