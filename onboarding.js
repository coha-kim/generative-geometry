// Handle onboarding button click - redirect to main app
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-button');
  
  startButton.addEventListener('click', function() {
    // Redirect to main app
    window.location.href = 'index.html';
  });
});

