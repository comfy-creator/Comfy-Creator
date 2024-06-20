async function fetchData() {
   try {
      const response = await fetch('http://localhost:8080/checkpoints', { method: 'GET' });
      if (response.ok) {
         const data = await response.json();
         //  Object.values(data).forEach((item: any) => {
         //     console.log(item.components);
         //  });
         console.log(data);
      } else {
         console.error('Failed to fetch data:', response.status, response.statusText);
      }
   } catch (error) {
      console.error('Error fetching data:', error);
   }
}

async function generateImages() {
   const requestBody = {
      models: { citron_anime_treasure_v10: 4 },
      positive_prompt: 'beautiful anime woman',
      negative_prompt: 'watermark, low quality, worst quality, ugly',
      random_seed: 44,
      aspect_ratio: [512, 512]
   };

   try {
      const response = await fetch('http://localhost:8080/generate', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
         throw new Error('No body in response');
      }

      const reader = response.body.getReader();

      // eslint-disable-next-line no-constant-condition
      while (true) {
         const { done, value } = await reader.read();
         if (done) break;
         console.log(new TextDecoder().decode(value));
      }
   } catch (error) {
      console.error('Failed to generate images:', error);
   }
}

generateImages();

// fetchData();

//   const response = await fetch(API_Routes.REQUEST_JOB, {
//      method: 'POST',
//      headers: { 'Content-Type': 'application/json', authorization: `Bearer ${idToken}` },
//      body: JSON.stringify(request)
//   });
