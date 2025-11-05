// Handle onboarding button clicks
document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-button');
  const collectionButton = document.getElementById('collection-button');
  
  startButton.addEventListener('click', function() {
    // Redirect to main app
    window.location.href = 'app.html';
  });
  
  collectionButton.addEventListener('click', function() {
    // Redirect to collection page
    window.location.href = 'stats.html';
  });
});

