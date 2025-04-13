// Typing animation for subtitle
document.addEventListener("DOMContentLoaded", () => {
  const words = ["Students", "Learners", "Explorers", "Achievers", "Investors"];
  let currentWordIndex = 0;
  const changingWordElement = document.getElementById("subtitle");

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function typeWord(word) {
    for (let i = 1; i <= word.length; i++) {
      changingWordElement.textContent = word.slice(0, i);
      await delay(100);
    }
  }

  async function deleteWord(word) {
    for (let i = word.length; i >= 0; i--) {
      changingWordElement.textContent = word.slice(0, i);
      await delay(80);
    }
  }

  async function animateWords() {
    while (true) {
      const word = words[currentWordIndex];
      await typeWord(word);
      await delay(1000);
      await deleteWord(word);
      await delay(300);
      currentWordIndex = (currentWordIndex + 1) % words.length;
    }
  }

  if (changingWordElement) {
    animateWords();
  } else {
    console.warn("Element with ID 'subtitle' not found.");
  }
});

// Email subscription form with stock info
document.getElementById("email-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  const symbol = "AAPL"; 
  // Replace with your API key - it's better to store this securely
  const apiKey = "AIzaSyBqVv0lwrYXtCTeC8VUlHltoDt6mF504Uc"; 
  
  try {
    // For demonstration purposes - normally you'd fetch from the API
    const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
    //const data = await response.json();
    
    // Simulate API response for demo
    const data = {
      name: "Apple Inc.",
      symbol: "AAPL",
      close: "189.45",
      percent_change: "+1.25"
    };

    const stockInfo = `Stock: ${data.name} (${data.symbol})\nPrice: $${data.close}\nChange: ${data.percent_change}%`;
    
    document.getElementById("email-message").value = stockInfo;
    
    emailjs.sendForm("service_gxva7bi", "template_pl02wv3", this)
      .then(function() {
        // Show success message
        const button = document.querySelector(".subscribe-form button");
        const originalText = button.textContent;
        button.textContent = "Subscribed!";
        button.classList.add("success");
        
        setTimeout(() => {
          button.textContent = originalText;
          button.classList.remove("success");
        }, 3000);
      }, function(error) {
        console.error("Failed:", error);
        alert("Something went wrong. Please try again.");
      });

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to process your request.");
  }
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
  const elements = document.querySelectorAll('.info-box, .info-graphic');
  
  function checkVisibility() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      if (rect.top <= windowHeight * 0.8) {
        el.classList.add('fade-in');
      }
    });
  }
  
  // Initial check
  checkVisibility();
  
  // Check on scroll
  window.addEventListener('scroll', checkVisibility);
});