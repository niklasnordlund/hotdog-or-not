import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.6.0';

env.allowLocalModels = false;

const status = document.getElementById('status');
const hotdogStatus = document.getElementById('hotdog');
const noHotdogStatus = document.getElementById('not-hotdog');
const fileUpload = document.getElementById('file-upload');
const imageContainer = document.getElementById('image-container');
const fileUploadHint = document.getElementById('file-upload-hint');
const imageOverlay = document.getElementById('image-overlay');

// Object detection pipeline
status.textContent = 'Loading model...';
const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
status.textContent = 'Ready';

fileUpload.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (readerEvent) {
            imageContainer.innerHTML = '';
            fileUploadHint.innerText = '';
            imageOverlay.classList.add('show');
            hotdogStatus.classList.remove('show');
            noHotdogStatus.classList.remove('show');

            const image = document.createElement('img');
            image.src = readerEvent.target.result;
            imageContainer.appendChild(image);

            detectHotdog(image);
        };
        reader.readAsDataURL(file);
    }
});

const isHotDog = item => item.label === 'hot dog';

async function detectHotdog(img) {
    const detectedObjects = await detector(img.src, {
        threshold: 0.5,
        percentage: true,
    });
    imageOverlay.classList.remove('show');

    if (detectedObjects.some(isHotDog)) {
        hotdogStatus.classList.add('show');
    } else {
        noHotdogStatus.classList.add('show');
    }
}

