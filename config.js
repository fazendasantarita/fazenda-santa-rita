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
    // { nome: 'FAZENDA SANTA RITA', cidade: 'Cidade - GO' },
  ],

  // Contas bancárias (usadas na baixa, conciliação e receitas)
  CONTAS: [
    // 'BB 12345-6',
  ],

  // Quem solicita as despesas
  SOLICITANTES: [
    // 'FULANO',
  ],

  // Titulares dos contratos de endividamento
  TITULARES: [
    // 'Fulano',
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
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', preencher);
  else preencher();
})();
