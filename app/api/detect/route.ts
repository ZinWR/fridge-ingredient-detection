import { NextResponse } from 'next/server';

interface DetectRequestBody {
  image: string;
}

export async function POST(req: Request) {
  const { image } = (await req.json()) as DetectRequestBody;
  const apiKey = process.env.CLARIFAI_API_KEY;

  if (!apiKey) {
    console.error('Clarifai API key is missing');
    return NextResponse.json(
      { error: 'Clarifai API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const clarifaiResponse = await fetch(
      'https://api.clarifai.com/v2/models/food-item-recognition/outputs',
      {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: image.replace(/^data:image\/(png|jpeg);base64,/, ''),
                },
              },
            },
          ],
        }),
      }
    );

    if (!clarifaiResponse.ok) {
      console.error(
        'Clarifai API responded with an error:',
        await clarifaiResponse.text()
      );
      return NextResponse.json(
        { error: 'Failed to fetch data from Clarifai API' },
        { status: clarifaiResponse.status }
      );
    }

    const clarifaiData = await clarifaiResponse.json();

    // Validation
    const outputs = clarifaiData.outputs;
    if (!outputs || !outputs[0]?.data?.concepts) {
      console.error('Invalid Clarifai response:', clarifaiData);
      return NextResponse.json(
        { error: 'Invalid response from Clarifai API' },
        { status: 500 }
      );
    }

    // Filter by confidence score
    const confidenceThreshold = 0.9;
    const ingredients = outputs[0].data.concepts
      .filter((concept: { name: string; value: number }) => concept.value > confidenceThreshold)
      .map((concept: { name: string }) => concept.name);

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error during Clarifai API request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing the image' },
      { status: 500 }
    );
  }
}