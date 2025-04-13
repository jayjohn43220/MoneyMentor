fetch('https://api.marketaux.com/v1/news/all?language=en&filter_entities=true&categories=business,finance&limit=5&api_token=WF4sueCr8Iu7D23oylvk4rAMAycXylftvUOYKqG0')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('news-container');
    data.data.forEach(article => {
      const card = document.createElement('div');
      card.className = 'news-card';
      card.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read more</a>
      `;
      container.appendChild(card);
    });
  });
 