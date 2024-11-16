# Fridge Indredient Detection
Deployed Application: [Live Link](https://fridge-ingredient-detection-ei1gsluh5.vercel.app/)

### Demo:
<div align="center">
    <img alt="Gameplay" src="public\demo.gif" width="75%" height="auto">
</div>

### Requirements:
- **Tech Stack**: The core of the project should be built using **Next.js** and **React**, with **Tailwind CSS** for styling. The choice of AI/ML model and any other supporting technologies is up to the candidate.
- **AI/ML Component**: Incorporate some level of AI to recognize ingredients and potentially estimate quantities. We well consideration in choosing the right models.
- **Image Upload**: Provide a simple interface where users can upload an image.
- **Ingredient Recognition**: Process the uploaded image to extract ingredient information (item name, and if possible, quantity).
- **UI/UX**: While accuracy is important, we also want to see **creativity and design** in the UI/UX of the application. Consider how you can make the user experience intuitive and delightful.

## Tech Stack Used
- NextJS
- React
- MaterialUI
- TailwindCSS
- ClarifAI
- Jest (testing)

## Documentation
I chose ClarifAI as the primary AI service for image recognition:
- It has `Food Recognition Model` that is highly tailored for itentifying food-related items.
- The API is well-documented so setting up and integrating was fast.
- Currently working correctly to identifying food & send errors for blurry images/drinks/non-food images
- Also added 1 simple test for route/API key.

Initially, I experimented with `Google Cloud Vision AI`, another powerful and versatile tool. However, there are some challenges:
- Frequently over-detect non-food-related objects (text, logos, unrelated software) and often times very vague.
- Need additional configurations for food-focus.

## Challenges
The main challenge was determining the suitable AI model for the application as setting up the backend would highly depended on it. (Estimating/predicting the quantity is possible, but time was limited)

Another challenge was the UI/UX design! (Given more time, I will tweak it some more) 

I opted in for the badge feature for listed ingredients as it is intuitive for the user to instantly recognize rather than just listing them out in bullets points or tables. 