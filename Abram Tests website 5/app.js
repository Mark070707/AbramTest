import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAj4qpSMBsvrAjpm1JPgWnIr9ZCSa1ItxM",
    authDomain: "abram-test-c9117.firebaseapp.com",
    projectId: "abram-test-c9117",
    storageBucket: "abram-test-c9117.appspot.com",
    messagingSenderId: "229044923470",
    appId: "1:229044923470:web:e329b9522ffb4e6362e71f",
    measurementId: "G-MXRZ43ZZP2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

document.getElementById('test-select').addEventListener('change', function() {
    const folderName = this.value; // Get selected folder name
    const pdfSelect = document.getElementById('pdf-select');
    pdfSelect.innerHTML = '<option value="" disabled selected>Select</option>'; // Reset second dropdown

    console.log(`Selected folder: ${folderName}`);

    // Map the folder names to their respective paths in Firebase Storage
    const folderPaths = {
        "AI Mark Failed": "AI Mark Failed",
        "AI Mark Passed": "AI Mark Passed",
        "Human Mark Identified as AI Mark": "Human Mark Identified as AI Mark",
        "Human Mark Identified as Human": "Human Mark Identified as Human"
    };

    // Reference to the selected folder
    const folderPath = folderPaths[folderName];
    const listRef = ref(storage, folderPath);

    console.log(`Listing files in folder: ${folderPath}`);

    // List all files in the selected folder
    listAll(listRef).then((result) => {
        if (result.items.length === 0) {
            console.log('No files found in this folder.');
        }
        result.items.forEach((itemRef) => {
            console.log(`Found file: ${itemRef.name}`);
            getDownloadURL(itemRef).then((url) => {
                const option = document.createElement('option');
                option.value = url;
                option.textContent = itemRef.name;
                pdfSelect.appendChild(option);
            }).catch((error) => {
                console.error('Error fetching file URL:', error);
            });
        });
    }).catch((error) => {
        console.error('Error listing files:', error);
    });
});

document.getElementById('view-pdf-button').addEventListener('click', function() {
    const pdfSelect = document.getElementById('pdf-select');
    const selectedPdfUrl = pdfSelect.value;
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfContainer = document.getElementById('pdf-container');

    if (selectedPdfUrl) {
        pdfViewer.innerHTML = `<iframe src="${selectedPdfUrl}" width="100%" height="600px"></iframe>`;
        pdfContainer.style.display = 'block';
        pdfContainer.classList.add('active'); // Add active class to pdf-container
    } else {
        pdfViewer.innerHTML = 'Please select a PDF file to view.';
        pdfContainer.style.display = 'none';
        pdfContainer.classList.remove('active'); // Remove active class if no PDF is selected
    }
});
