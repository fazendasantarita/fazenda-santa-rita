// ============================================================
// CONFIG — FAZENDA SANTA RITA
// ÚNICO arquivo que você precisa editar para credenciais e cadastros.
// Todos os módulos leem daqui.
// ============================================================
window.APP_CONFIG = {
  // ── 1) SUPABASE (Project Settings → API) ─────────────────
  SB_URL: 'https://vjpuzocomhwehdbaaqcm.supabase.co',   // Project URL
  SB_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqcHV6b2NvbWh3ZWhkYmFhcWNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1ODA3MzksImV4cCI6MjEwNjE1NjczOX0.bh9UursozjRhqAugI1sr8Zt3vNcYVj5kn2tRokC_Wtg',            // chave "anon / public"

  CLIENTE_NOME: 'Fazenda Santa Rita',

  // ── 2) CADASTROS ─────────────────────────────────────────
  // Escreva em MAIÚSCULAS, como devem aparecer nos lançamentos.

  // Fazendas + cidade (a cidade vai no rodapé do recibo: "Cidade, data.")
  FAZENDAS: [
    { nome: 'FAZENDA SANTA RITA', cidade: 'Edealina - GO' },
  ],

  // Contas bancárias (usadas na baixa, conciliação e receitas)
  CONTAS: [
    'BB MARIO',
    'SICOOB MARIO',
  ],

  // Quem solicita as despesas
  SOLICITANTES: [
    'JOSE ADRIANO',
    'JULIANA',
    'MARCOS AURELIO',
    'MARIO',
  ],

  // Titulares dos contratos de endividamento
  TITULARES: [
    'JOSE ADRIANO',
    'JULIANA',
    'MARCOS AURELIO',
    'MARIO',
    'VANDERLEIA',
  ],
};
// Se SB_URL/SB_KEY não forem preenchidos, os módulos NÃO conectam (falha segura).


// ============================================================
// Daqui para baixo NÃO precisa editar — preenche os campos de
// seleção de cada tela com os cadastros acima.
// ============================================================
(function () {
  var C = window.APP_CONFIG;
  var faz = (C.FAZENDAS || []).map(function (f) { return typeof f === 'string' ? { nome: f } : f; });

  window.CAD = {
    fazendas:     faz.map(function (f) { return f.nome; }),
    contas:       C.CONTAS || [],
    solicitantes: C.SOLICITANTES || [],
    titulares:    C.TITULARES || [],
    fazCidade:    faz.reduce(function (m, f) { if (f.cidade) m[String(f.nome).toUpperCase().trim()] = f.cidade; return m; }, {})
  };

  var ALVOS = {
    fazendas:     ['f_fazenda', 'filter-fazenda', 'filtro-fazenda'],
    contas:       ['f_conta', 'modalBaixarConta', 'baixaConta', 'concil-conta', 'baixa-conta', 'baixa-ind-conta'],
    solicitantes: ['f_solicitante'],
    titulares:    ['f-titular-c', 'fc-titular', 'f-titular-l', 'edit-lanc-titular']
  };

  function preencher() {
    Object.keys(ALVOS).forEach(function (k) {
      ALVOS[k].forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        var ja = {};
        for (var i = 0; i < el.options.length; i++) ja[el.options[i].value] = 1;
        window.CAD[k].forEach(function (v) {
          if (ja[v]) return;
          var o = document.createElement('option'); o.value = v; o.textContent = v; el.appendChild(o);
        });
      });
    });
  }
  window.CAD_preencher = preencher;

  // Chamada às funções de usuário no Supabase (usuarios.sql). Sempre retorna {ok:..., erro:...}
  window.APP_RPC = function (fn, args) {
    return fetch(C.SB_URL + '/rest/v1/rpc/' + fn, {
      method: 'POST',
      headers: { 'apikey': C.SB_KEY, 'Authorization': 'Bearer ' + C.SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args || {})
    }).then(function (r) {
      return r.text().then(function (t) {
        if (!r.ok) return { ok: false, erro: 'Falha no servidor (' + r.status + '). Verifique se o usuarios.sql foi executado.' };
        try { return JSON.parse(t); } catch (e) { return { ok: false, erro: 'Resposta inválida do servidor' }; }
      });
    }).catch(function () { return { ok: false, erro: 'Sem conexão com o servidor' }; });
  };

  // Guarda a sessão após login. Perfil/permissões ficam no formato que o app.html já lê.
  window.APP_ENTRAR = function (res) {
    var u = res.usuario, nome = u.login.charAt(0).toUpperCase() + u.login.slice(1);
    sessionStorage.setItem('gf_user', nome);
    sessionStorage.setItem('gf_role', u.perfil);
    sessionStorage.setItem('gf_token', res.token);
    var cache = {}; cache[u.login] = { login: u.login, nome: u.nome, role: u.perfil, ativo: u.ativo, perms: u.perms || {} };
    localStorage.setItem('gf_users_v2', JSON.stringify(cache));   // substitui o cache antigo (que guardava senhas)
    localStorage.removeItem('gf_roles');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preencher);
  else preencher();
})();
