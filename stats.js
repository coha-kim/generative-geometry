// Display all saved patterns in a grid
document.addEventListener('DOMContentLoaded', function() {
  const patternsGrid = document.getElementById('patterns-grid');
  const clearBtn = document.getElementById('clear-btn');
  
  // Get all saved patterns from localStorage
  function loadPatterns() {
    const savedPatterns = localStorage.getItem('shapeOfDaysPatterns');
    const patterns = savedPatterns ? JSON.parse(savedPatterns) : [];
    
    if (patterns.length === 0) {
      patternsGrid.innerHTML = '<div class="empty-state">No patterns saved yet. Create your first pattern!</div>';
      return;
    }
    
    // Clear grid
    patternsGrid.innerHTML = '';
    
    // Display each pattern
    patterns.forEach((pattern, index) => {
      const patternItem = document.createElement('div');
      patternItem.className = 'pattern-item';
      
      const img = document.createElement('img');
      img.src = pattern.imageData;
      img.alt = `Pattern from ${pattern.date}`;
      
      patternItem.appendChild(img);
      patternsGrid.appendChild(patternItem);
    });
  }
  
  // Function to clear all saved images
  function clearAllImages() {
    if (confirm('Are you sure you want to delete all saved patterns? This action cannot be undone.')) {
      localStorage.removeItem('shapeOfDaysPatterns');
      loadPatterns();
    }
  }
  
  // Add click event listener to clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllImages);
  }
  
  loadPatterns();
});

