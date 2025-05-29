// Function to display the modal
function showModal() {
    document.getElementById("successModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
    document.getElementById("successModal").style.display = "none";
}

// Handle form submission
document.getElementById("payment-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent the default form submission
    showModal(); // Show the success modal

    // Simulate a delay before redirecting to another page
    setTimeout(function() {
        // Redirect to the "Thank You" page after payment is successful
        window.location.href = "/Users/srinadhreddy/Documents/E- commerce/views/order-confirmation.ejs"; // Change this to your actual page
    }, 2000); // 2 seconds delay before redirection
});
