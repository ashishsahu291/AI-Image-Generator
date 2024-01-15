const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");
const URL = "https://api.openai.com/v1/images/generations";
const OPENAI_API_KEY = "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";

const handleFormSubmit = (e) => {
  e.preventDefault();

  const userPrompt = e.srcElement[0].value;
  const userImageQuantity = e.srcElement[1].value;

  const imageCardMarkup = Array.from(
    { length: userImageQuantity },
    () =>
      `<div class="img-card loading">
        <img src="./assets/images/loader.svg" alt="image">
        <a href="#" class="download-btn">
            <img src="./assets/images/download.svg" alt="download icon">
        </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imageCardMarkup;

  generateAiImages(userPrompt, userImageQuantity);
};

const generateAiImages = async (userPrompt, userImageQuantity) => {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-2",
        prompt: userPrompt,
        n: parseInt(userImageQuantity),
        size: "1024x1024",
        response_format: "b64_json",
      }),
    });

    if (!response.ok)
      throw new Error("Failed to generate images! Please try again!");

    const { data } = await response.json();
    updateImageCard([...data]);
  } catch (error) {
    alert(error.message);
  }
};

const updateImageCard = (imgDataArray) => {
  imgDataArray.array.forEach((imgObject, index) => {
    const imgCard = document.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
    };
  });
};

generateForm && generateForm.addEventListener("submit", handleFormSubmit);
