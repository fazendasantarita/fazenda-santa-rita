# Fazenda Santa Rita — Sistema Financeiro

Lançamentos (contas a pagar), painel, conciliação, receitas, endividamento,
relatórios e configurações. PWA hospedado no GitHub Pages, banco no Supabase.

## Implantação

**1. Supabase**
- New project → região *South America (São Paulo)*.
- SQL Editor → New query → cole o `schema.sql` inteiro → Run.
  No fim aparece a lista com as 5 tabelas. Pode rodar de novo sem erro.
- Project Settings → API → copie **Project URL** e a chave **anon public**.

**2. `config.js`** (único arquivo a editar)
- Cole `SB_URL` e `SB_KEY`.
- Preencha os cadastros: `FAZENDAS` (com cidade, usada no recibo),
  `CONTAS`, `SOLICITANTES`, `TITULARES`. Eles aparecem sozinhos em todos os módulos.

**3. GitHub**
- Repositório com o nome **`fazenda-santa-rita`** (o PWA já está configurado
  para esse caminho em `sw.js` e `manifest.json`; se usar outro nome, troque
  `/fazenda-santa-rita/` nesses dois arquivos).
- Add file → Upload files → arraste todo o conteúdo (incluindo a pasta `icons/`).
- Settings → Pages → Deploy from a branch → `main` / `(root)`.
- Endereço: `https://SEU-USUARIO.github.io/fazenda-santa-rita/`

**4. Primeiro acesso**
- Login `admin` / `trocar123` → Config → troque a senha.
- Usuários e permissões ficam no navegador (localStorage) de cada máquina.

**5. Atualizações futuras**
- Ao subir nova versão, aumente `CACHE_NAME` no `sw.js` (`santa-rita-v2`…)
  e dê Cmd+Shift+R no Safari.

## Segurança
As policies RLS estão abertas (o login é feito no navegador, não no Supabase):
quem tiver a URL + chave anon consegue ler/gravar. Antes de uso comercial,
migrar o login para Supabase Auth e restringir as policies.
