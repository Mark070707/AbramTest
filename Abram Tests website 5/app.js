import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref as dbRef, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
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
const db = getDatabase(app);

document.getElementById('test-select').addEventListener('change', function() {
    const folderName = this.value; // Get selected folder name
    const linkSelect = document.getElementById('link-select');
    linkSelect.innerHTML = '<option value="" disabled selected>Select</option>'; // Reset second dropdown

    console.log(`Selected test: ${folderName}`);

    // Reference to the selected folder in Firebase Database
    const linksRef = dbRef(db, `chatgpt_links/${folderName}`);
    
    // Fetch the links from Firebase Database
    get(linksRef).then((snapshot) => {
        console.log('Firebase get request complete'); // Debugging statement
        if (snapshot.exists()) {
            const links = snapshot.val();
            console.log('Links fetched from database:', links); // Debugging statement
            Object.keys(links).forEach((key) => {
                const option = document.createElement('option');
                option.value = links[key];
                option.textContent = key; // Use the key name as the text for the dropdown option
                linkSelect.appendChild(option);
            });
        } else {
            console.log('No links found in this folder.');
        }
    }).catch((error) => {
        console.error('Error fetching links:', error);
    });
});

document.getElementById('view-link-button').addEventListener('click', function() {
    const linkSelect = document.getElementById('link-select');
    const selectedLink = linkSelect.value;

    if (selectedLink) {
        window.open(selectedLink, '_blank'); // Open the selected link in a new tab
    } else {
        alert('Please select a conversation link to view.');
    }
});
