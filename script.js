document.addEventListener('DOMContentLoaded', function () {
  // Abas da história
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  function activateTab(tabId) {
    tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    tabContents.forEach(content => content.classList.toggle('active', content.id === tabId));
  }
  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      activateTab(this.dataset.tab);
    });
  });

  // Linha do tempo interativa
  document.querySelectorAll('.timeline-event').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });

  // Comentários
  function addComment(nome, mensagem, publicado) {
    const commentDiv = document.createElement('div');
    commentDiv.classList.add('comentario-exibido');
    commentDiv.innerHTML = `
      <strong>${nome}</strong>
      <p>${mensagem}</p>
      <small>Publicado em: ${publicado}</small>
    `;
    document.getElementById('commentsContainer').appendChild(commentDiv);
  }

  function loadComments() {
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      const comments = JSON.parse(storedComments);
      comments.forEach(comment => {
        addComment(comment.nome, comment.mensagem, comment.publicado);
      });
    }
  }

  function saveComment(nome, mensagem, publicado) {
    let comments = [];
    const storedComments = localStorage.getItem('comments');
    if (storedComments) {
      comments = JSON.parse(storedComments);
    }
    comments.push({ nome, mensagem, publicado });
    localStorage.setItem('comments', JSON.stringify(comments));
  }

  const commentForm = document.querySelector('.comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value.trim();
      const mensagem = document.getElementById('mensagem').value.trim();
      if (nome === "" || mensagem === "") {
        alert("Por favor, preencha todos os campos.");
        return;
      }
      const now = new Date();
      const data = now.toLocaleDateString('pt-BR');
      const hora = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const publicado = `${data} às ${hora}`;
      addComment(nome, mensagem, publicado);
      saveComment(nome, mensagem, publicado);
      this.reset();
    });
  }

  // Carregar comentários ao iniciar
  loadComments();

  // Toggle Abas Menu
  const btn = document.getElementById('toggleAbas');
  const menu = document.getElementById('abasMenu');
  let aberto = false;
  if (btn && menu) {
    btn.addEventListener('click', function() {
      aberto = !aberto;
      menu.style.display = aberto ? 'flex' : 'none';
      btn.textContent = aberto ? 'Fechar Todas as Abas' : 'Abrir Todas as Abas';
    });
  }
});