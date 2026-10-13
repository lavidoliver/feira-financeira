const SUPABASE_URL = "https://celgectqwcsdoczkfnin.supabase.co";

const SUPABASE_KEY = "sb_publishable_kKyXJsshfC40IaLh-FFhCQ_TIoeupXn";

let supabaseClient = null;

if (window.supabase) {
  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );
}

console.log("SCRIPT CARREGADO!");

const inicio = document.getElementById("inicio");
const telaSala1 = document.getElementById("comanda");
const telaSala2 = document.getElementById("sala2Tela");
const telaSala3 = document.getElementById("sala3Tela");
const voltarSala3 = document.getElementById("voltarSala3");
const mensagemSala3 = document.getElementById("mensagemSala3");
const listaComandasSala3 = document.getElementById("listaComandasSala3");
const detalhesComandaSala3 = document.getElementById("detalhesComandaSala3");
const numeroDetalhesSala3 = document.getElementById("numeroDetalhesSala3");
const resumoFinanceiroSala3 = document.getElementById("resumoFinanceiroSala3");
const historicoSala3 = document.getElementById("historicoSala3");

const botaoSala1 = document.getElementById("sala1");
const botaoSala2 = document.getElementById("sala2");
const botaoSala3 = document.getElementById("sala3");

const voltarSala1 = document.getElementById("voltarSala1");
const voltarSala2 = document.getElementById("voltarSala2");

const campoNumero = document.getElementById("numero");
const botaoContinuar = document.getElementById("continuar");
const mensagem = document.getElementById("mensagem");

const produtos = document.getElementById("produtos");
const numeroComanda = document.getElementById("numeroComanda");
const saldoElemento = document.getElementById("saldo");
const totalElemento = document.getElementById("total");
const cartoesCategorias = document.getElementById("cartoesCategorias");
const listaItens = document.getElementById("listaItens");
const botaoSalvar = document.getElementById("salvarComanda");
const mensagemCartoes = document.getElementById("mensagemCartoes");

const campoNumeroSala2 = document.getElementById("numeroComandaSala2");
const botaoBuscarSala2 = document.getElementById("buscarComandaSala2");
const mensagemSala2 = document.getElementById("mensagemSala2");
const itensSala2 = document.getElementById("itensSala2");
const numeroExibidoSala2 = document.getElementById("numeroExibidoSala2");
const saldoSala2Elemento = document.getElementById("saldoSala2");
const totalSala2Elemento = document.getElementById("totalSala2");

const campoAtividadeSala2 = document.getElementById("atividadeSala2");
const campoValorSala2 = document.getElementById("valorSala2");
const campoQuantidadeSala2 = document.getElementById("quantidadeSala2");
const botaoAdicionarSala2 = document.getElementById("adicionarSala2");
const listaItensSala2 = document.getElementById("listaItensSala2");
const botaoSalvarSala2 = document.getElementById("salvarSala2");

let comandaAtual = null;
let numeroAtual = null;

let saldoInicial = 0;
let saldoAtual = 0;
let totalGasto = 0;

let movimentacoes = [];
let selecoes = {};

let comandaSala2Atual = null;
let movimentacoesSala2 = [];

function obterSaldoInicial(numero) {
  if (numero >= 1 && numero <= 10) {
    return 32000;
  }

  if (numero >= 11 && numero <= 20) {
    return 16000;
  }

  if (numero >= 21 && numero <= 30) {
    return 8000;
  }

  if (numero >= 31 && numero <= 40) {
    return 5000;
  }

  if (numero >= 41 && numero <= 50) {
    return 3000;
  }

  return null;
}

function formatarDinheiro(valor) {
  return Number(valor || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function dinheiro(valor) {
  return "R$ " + formatarDinheiro(valor);
}

function escaparHTML(valor) {
  return String(valor ?? "").replace(/[&<>"']/g, function (caractere) {
    const mapa = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return mapa[caractere];
  });
}

function definirMensagem(elemento, texto) {
  if (elemento) {
    elemento.textContent = texto;
  }
}

function mostrarInicio() {
inicio.style.display = "block";
telaSala1.style.display = "none";
telaSala2.style.display = "none";
telaSala3.style.display = "none";
}

function mostrarSala1() {
inicio.style.display = "none";
telaSala1.style.display = "block";
telaSala2.style.display = "none";
telaSala3.style.display = "none";
}

function mostrarSala2() {
inicio.style.display = "none";
telaSala1.style.display = "none";
telaSala2.style.display = "block";
telaSala3.style.display = "none";
}

function mostrarSala3() {
inicio.style.display = "none";
telaSala1.style.display = "none";
telaSala2.style.display = "none";
telaSala3.style.display = "block";

carregarComandasSala3();
}

async function carregarComandasSala3() {
  if (!supabaseClient) {
    definirMensagem(
      mensagemSala3,
      "Não foi possível conectar ao banco de dados."
    );
    return;
  }

  definirMensagem(mensagemSala3, "Carregando comandas...");
  listaComandasSala3.innerHTML = "";
  detalhesComandaSala3.style.display = "none";

  try {
    const resultado = await supabaseClient
      .from("comandas")
      .select("*")
      .order("numero", { ascending: true });

    if (resultado.error) {
      throw resultado.error;
    }

    const comandas = resultado.data || [];

    listaComandasSala3.innerHTML = "";

    if (comandas.length === 0) {
      definirMensagem(
        mensagemSala3,
        "Nenhuma comanda foi aberta ainda."
      );
      return;
    }

    definirMensagem(
      mensagemSala3,
      comandas.length === 1
        ? "1 comanda encontrada."
        : comandas.length + " comandas encontradas."
    );

    comandas.forEach(function (comanda) {
      const cartao = document.createElement("button");

      cartao.type = "button";
      cartao.className = "cardSala";

      const numeroFormatado = String(comanda.numero).padStart(3, "0");

      const titulo = document.createElement("strong");
      titulo.textContent = "Comanda #" + numeroFormatado;

      const saldo = document.createElement("span");
      saldo.textContent = "Saldo atual: " + dinheiro(comanda.saldo);

      cartao.appendChild(titulo);
      cartao.appendChild(document.createElement("br"));
      cartao.appendChild(saldo);

      cartao.addEventListener("click", function () {
        mostrarDetalhesComandaSala3(comanda);
      });

      listaComandasSala3.appendChild(cartao);
    });

  } catch (erro) {
    console.error("Erro ao carregar comandas da Sala 3:", erro);

    definirMensagem(
      mensagemSala3,
      "Não foi possível carregar as comandas. Tente novamente."
    );
  }
}

function mostrarDetalhesComandaSala3(comanda) {
  const itens = Array.isArray(comanda.itens)
    ? comanda.itens
    : [];

  const numero = Number(comanda.numero);
  const saldoInicialComanda = obterSaldoInicial(numero);
  const saldoAtualComanda = Number(comanda.saldo ?? 0);

  const totalGastoComanda = itens
    .filter(function (item) {
      return item.tipo === "gasto";
    })
    .reduce(function (soma, item) {
      return soma + Number(item.total ?? item.valor ?? 0);
    }, 0);

  const totalGanhoComanda = itens
    .filter(function (item) {
      return item.tipo === "ganho";
    })
    .reduce(function (soma, item) {
      return soma + Number(item.total ?? item.valor ?? 0);
    }, 0);

  numeroDetalhesSala3.textContent = String(numero).padStart(3, "0");

  resumoFinanceiroSala3.innerHTML = `
    <div>
      <span>Saldo inicial</span>
      <strong>${dinheiro(saldoInicialComanda)}</strong>
    </div>

    <div>
      <span>Saldo atual</span>
      <strong>${dinheiro(saldoAtualComanda)}</strong>
    </div>

    <div>
      <span>Total gasto</span>
      <strong>${dinheiro(totalGastoComanda)}</strong>
    </div>

    <div>
      <span>Total ganho</span>
      <strong>${dinheiro(totalGanhoComanda)}</strong>
    </div>
  `;

  historicoSala3.innerHTML = "";

  if (itens.length === 0) {
    historicoSala3.textContent =
      "Nenhuma atividade foi registrada nesta comanda.";
  } else {
    itens.forEach(function (item) {
      const linha = document.createElement("div");
      const nome = document.createElement("span");
      const valor = document.createElement("strong");
      const quantidade = Number(item.quantidade ?? 1);

      const tipo = item.tipo === "ganho" ? "Ganho" : "Gasto";
      const sinal = item.tipo === "ganho" ? "+" : "−";

      nome.textContent =
        tipo + ": " +
        (item.atividade || item.categoria || "Movimentação") +
        " | Quantidade: " + quantidade;

      valor.textContent =
        sinal + " " + dinheiro(item.total ?? item.valor ?? 0);

      linha.appendChild(nome);
      linha.appendChild(valor);

      historicoSala3.appendChild(linha);
    });
  }

  detalhesComandaSala3.style.display = "block";

  detalhesComandaSala3.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

botaoSala1.addEventListener("click", mostrarSala1);

botaoSala2.addEventListener("click", mostrarSala2);

botaoSala3.addEventListener("click", mostrarSala3);

voltarSala1.addEventListener("click", mostrarInicio);

voltarSala2.addEventListener("click", mostrarInicio);

voltarSala3.addEventListener("click", mostrarInicio); 

const categorias = [
  {
    id: "casa",
    titulo: "Casa",
    descricao: "Adicione uma unidade ao seu planejamento.",
    icone: "🏠",
    tipo: "moradia",
    valor: 8000
  },
  {
    id: "apartamento",
    titulo: "Apartamento",
    descricao: "Adicione uma unidade ao seu planejamento.",
    icone: "🏬",
    tipo: "moradia",
    valor: 5000
  },
  {
    id: "studio",
    titulo: "Studio",
    descricao: "Adicione uma unidade ao seu planejamento.",
    icone: "🏢",
    tipo: "moradia",
    valor: 2000
  },
  {
    id: "moradiaLocacao",
    titulo: "Moradia de Locação",
    descricao: "Escolha a moradia que deseja alugar.",
    icone: "🏘️",
    tipo: "opcoes",
    opcoes: [
      { nome: "Aluguel de: ", valor: 200 },
      { nome: "Aluguel de: ", valor: 350 },
      { nome: "Aluguel de: ", valor: 500 }
    ]
  },
  {
    id: "seguroMoradia",
    titulo: "Seguro de Moradia",
    descricao: "Escolha uma cobertura.",
    icone: "🏠",
    tipo: "opcoes",
    opcoes: [
      { nome: "Plano básico", valor: 150 },
      { nome: "Plano completo", valor: 300 }
    ]
  },
  {
    id: "veiculo",
    titulo: "Veículo Próprio",
    descricao: "Escolha o veículo que deseja adquirir.",
    icone: "🏍️",
    tipo: "opcoes",
    opcoes: [
      { nome: "Moto", valor: 2000 },
      { nome: "Carro seminovo", valor: 6000 },
      { nome: "Carro novo", valor: 8000 }
    ]
  },
  {
    id: "bicicleta",
    titulo: "Bicicleta",
    descricao: "Escolha uma opção de bicicleta.",
    icone: "🚲",
    tipo: "opcoes",
    opcoes: [
      { nome: "Bicicleta básica", valor: 300 },
      { nome: "Bicicleta intermediária", valor: 600 },
      { nome: "Bicicleta profissional", valor: 1000 }
    ]
  },
  {
    id: "transportePublico",
    titulo: "Transporte Público",
    descricao: "Reserve dinheiro para transporte público.",
    icone: "🚌",
    tipo: "orcamento",
    incremento: 50
  },
  {
    id: "seguroCarro",
    titulo: "Seguro de Carro",
    descricao: "Escolha uma cobertura.",
    icone: "🛡️",
    tipo: "opcoes",
    opcoes: [
      { nome: "Plano básico", valor: 150 },
      { nome: "Plano completo", valor: 300 }
    ]
  },
  {
    id: "alimentacao",
    titulo: "Alimentação",
    descricao: "Planeje seus gastos com alimentos.",
    icone: "🍎",
    tipo: "orcamento",
    incremento: 50
  },
  {
    id: "higiene",
    titulo: "Higiene Pessoal",
    descricao: "Cuide dos produtos essenciais.",
    icone: "🧴",
    tipo: "orcamento",
    incremento: 50
  },
  {
    id: "roupas",
    titulo: "Vestuário",
    descricao: "Defina o quanto deseja gastar com vestuário.",
    icone: "👕",
    tipo: "orcamento",
    incremento: 50
  },
  {
    id: "farmacia",
    titulo: "Medicamentos",
    descricao: "Reserve dinheiro para medicamentos.",
    icone: "💊",
    tipo: "orcamento",
    incremento: 50
  },
  {
    id: "convenio",
    titulo: "Convênio Médico",
    descricao: "Escolha seu plano de saúde.",
    icone: "🏥",
    tipo: "opcoes",
    opcoes: [
      { nome: "Plano básico", valor: 150 },
      { nome: "Plano intermediário", valor: 250 },
      { nome: "Plano completo", valor: 400 }
    ]
  }
];

function criarCartoes() {
  cartoesCategorias.innerHTML = "";

  categorias.forEach(function (categoria) {
    const cartao = document.createElement("article");

    cartao.className = "categoria";
    cartao.dataset.categoria = categoria.id;

    const titulo = document.createElement("h3");
    titulo.textContent = categoria.icone + " " + categoria.titulo;

    const descricao = document.createElement("p");
    descricao.textContent = categoria.descricao;

    cartao.appendChild(titulo);
    cartao.appendChild(descricao);

    if (categoria.tipo === "orcamento") {
      criarControleOrcamento(cartao, categoria);
    } else if (categoria.tipo === "opcoes") {
      criarOpcoes(cartao, categoria);
    } else if (categoria.tipo === "moradia") {
      criarControleMoradia(cartao, categoria);
    }

    cartoesCategorias.appendChild(cartao);
  });
}

function criarControleOrcamento(cartao, categoria) {
  const controles = document.createElement("div");
  controles.className = "controlesQuantidade";

  const botaoMenos = document.createElement("button");
  botaoMenos.type = "button";
  botaoMenos.className = "menos";
  botaoMenos.textContent = "−";
  botaoMenos.setAttribute("aria-label", "Diminuir " + categoria.titulo);

  const valor = document.createElement("span");
  valor.className = "quantidade";
  valor.textContent = "0";

  const botaoMais = document.createElement("button");
  botaoMais.type = "button";
  botaoMais.className = "mais";
  botaoMais.textContent = "+";
  botaoMais.setAttribute("aria-label", "Aumentar " + categoria.titulo);

  botaoMenos.addEventListener("click", function () {
    const atual = selecoes[categoria.id] || 0;

    selecoes[categoria.id] = Math.max(
      0,
      atual - categoria.incremento
    );

    valor.textContent = dinheiro(selecoes[categoria.id]);
    atualizarResumo();
  });

  botaoMais.addEventListener("click", function () {
    const atual = selecoes[categoria.id] || 0;
    const proximo = atual + categoria.incremento;

    if (proximo > saldoInicial) {
      definirMensagem(
        mensagemCartoes,
        "Esse valor ultrapassa o saldo inicial da comanda."
      );
      return;
    }

    selecoes[categoria.id] = proximo;
    valor.textContent = dinheiro(proximo);

    definirMensagem(mensagemCartoes, "");
    atualizarResumo();
  });

  valor.textContent = dinheiro(0);

  controles.appendChild(botaoMenos);
  controles.appendChild(valor);
  controles.appendChild(botaoMais);

  cartao.appendChild(controles);
}

function criarOpcoes(cartao, categoria) {
  const lista = document.createElement("div");
  lista.className = "opcoesPreco";

  categoria.opcoes.forEach(function (opcao, indice) {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "opcaoPreco";
    botao.innerHTML =
      "<span>" + escaparHTML(opcao.nome) + "</span>" +
      "<strong>" + dinheiro(opcao.valor) + "</strong>";

    botao.addEventListener("click", function () {
      const chave = categoria.id + "_" + indice;

      if (selecoes[chave]) {
        delete selecoes[chave];
        botao.classList.remove("selecionado");
      } else {
        if (categoria.id === "veiculo") {
          categoria.opcoes.forEach(function (_, outroIndice) {
            const outraChave = categoria.id + "_" + outroIndice;
            delete selecoes[outraChave];

            const botoes = lista.querySelectorAll("button");
            botoes[outroIndice].classList.remove("selecionado");
          });
        }

        selecoes[chave] = {
          categoria: categoria.id,
          nome: opcao.nome,
          valor: opcao.valor
        };

        botao.classList.add("selecionado");
      }

      atualizarResumo();
    });

    lista.appendChild(botao);
  });

  cartao.appendChild(lista);
}

function criarControleMoradia(cartao, categoria) {
  const preco = document.createElement("p");
  preco.className = "precoItem";
  preco.textContent = "Valor por unidade: " + dinheiro(categoria.valor);

  const controles = document.createElement("div");
  controles.className = "controlesQuantidade";

  const botaoMenos = document.createElement("button");
  botaoMenos.type = "button";
  botaoMenos.className = "menos";
  botaoMenos.textContent = "−";

  const quantidade = document.createElement("span");
  quantidade.className = "quantidade";
  quantidade.textContent = "0";

  const botaoMais = document.createElement("button");
  botaoMais.type = "button";
  botaoMais.className = "mais";
  botaoMais.textContent = "+";

  botaoMenos.addEventListener("click", function () {
    selecoes[categoria.id] = Math.max(
      0,
      (selecoes[categoria.id] || 0) - 1
    );

    quantidade.textContent = selecoes[categoria.id];
    atualizarResumo();
  });

  botaoMais.addEventListener("click", function () {
    const atual = selecoes[categoria.id] || 0;
    const totalAtual = calcularTotalSelecoes();

    if (totalAtual + categoria.valor > saldoInicial) {
      definirMensagem(
        mensagemCartoes,
        "Saldo insuficiente para adicionar essa unidade."
      );
      return;
    }

    selecoes[categoria.id] = atual + 1;
    quantidade.textContent = selecoes[categoria.id];

    definirMensagem(mensagemCartoes, "");
    atualizarResumo();
  });

  controles.appendChild(botaoMenos);
  controles.appendChild(quantidade);
  controles.appendChild(botaoMais);

  cartao.appendChild(preco);
  cartao.appendChild(controles);
}

function calcularTotalSelecoes() {
  let total = 0;

  categorias.forEach(function (categoria) {
    if (categoria.tipo === "orcamento") {
      total += selecoes[categoria.id] || 0;
    }

    if (categoria.tipo === "moradia") {
      total += (selecoes[categoria.id] || 0) * categoria.valor;
    }

    if (categoria.tipo === "opcoes") {
      categoria.opcoes.forEach(function (_, indice) {
        const chave = categoria.id + "_" + indice;

        if (selecoes[chave]) {
          total += selecoes[chave].valor;
        }
      });
    }
  });

  return total;
}

function gerarItensSelecao() {
  const itens = [];

  categorias.forEach(function (categoria) {
    if (categoria.tipo === "orcamento") {
      const valor = selecoes[categoria.id] || 0;

      if (valor > 0) {
        itens.push({
          tipo: "gasto",
          categoria: categoria.id,
          atividade: categoria.titulo,
          quantidade: 1,
          valor: valor,
          total: valor
        });
      }
    }

    if (categoria.tipo === "moradia") {
      const quantidade = selecoes[categoria.id] || 0;

      if (quantidade > 0) {
        itens.push({
          tipo: "gasto",
          categoria: categoria.id,
          atividade: categoria.titulo,
          quantidade: quantidade,
          valor: categoria.valor,
          total: quantidade * categoria.valor
        });
      }
    }

    if (categoria.tipo === "opcoes") {
      categoria.opcoes.forEach(function (_, indice) {
        const chave = categoria.id + "_" + indice;

        if (selecoes[chave]) {
          const item = selecoes[chave];

          itens.push({
            tipo: "gasto",
            categoria: categoria.id,
            atividade: categoria.titulo + " - " + item.nome,
            quantidade: 1,
            valor: item.valor,
            total: item.valor
          });
        }
      });
    }
  });

  return itens;
}

function atualizarResumo() {
  const totalSelecao = calcularTotalSelecoes();

  totalElemento.textContent = formatarDinheiro(totalGasto + totalSelecao);

  saldoElemento.textContent = formatarDinheiro(
    Math.max(0, saldoAtual - totalSelecao)
  );

  renderizarListaItens();
}

function renderizarListaItens() {
  listaItens.innerHTML = "";

  const itensAnteriores = movimentacoes.filter(function (item) {
    return item.tipo === "gasto";
  });

  const itensNovos = gerarItensSelecao();
  const todos = itensAnteriores.concat(itensNovos);

  if (todos.length === 0) {
    const texto = document.createElement("p");
    texto.textContent = "Nenhuma compra registrada nesta comanda.";
    listaItens.appendChild(texto);
    return;
  }

  todos.forEach(function (item) {
    const linha = document.createElement("div");

    const nome = document.createElement("span");
    nome.textContent = item.atividade || "Movimentação";

    const valor = document.createElement("strong");
    valor.textContent = dinheiro(item.total ?? item.valor ?? 0);

    linha.appendChild(nome);
    linha.appendChild(valor);
    listaItens.appendChild(linha);
  });
}

async function abrirComanda() {
  const numero = Number(campoNumero.value);

  if (!Number.isInteger(numero) || numero < 1 || numero > 50) {
    definirMensagem(mensagem, "Digite um número de comanda entre 1 e 50.");
    return;
  }

  if (!supabaseClient) {
    definirMensagem(mensagem, "A conexão com o Supabase não foi carregada.");
    return;
  }

  botaoContinuar.disabled = true;
  definirMensagem(mensagem, "Carregando comanda...");

  try {
    const resultado = await supabaseClient
      .from("comandas")
      .select("*")
      .eq("numero", numero)
      .maybeSingle();

    if (resultado.error) {
      throw resultado.error;
    }

    let registro = resultado.data;

    if (!registro) {
      const saldoNovo = obterSaldoInicial(numero);

      const insercao = await supabaseClient
        .from("comandas")
        .insert({
          numero: numero,
          saldo: saldoNovo,
          total: 0,
          itens: []
        })
        .select("*")
        .single();

      if (insercao.error) {
        throw insercao.error;
      }

      registro = insercao.data;
    }

    comandaAtual = registro;
    numeroAtual = numero;

    saldoInicial = obterSaldoInicial(numero);

    saldoAtual = Number(registro.saldo ?? saldoInicial);
    totalGasto = Number(registro.total ?? 0);

    movimentacoes = Array.isArray(registro.itens)
      ? registro.itens
      : [];

    selecoes = {};

    numeroComanda.textContent = String(numero).padStart(3, "0");

    produtos.style.display = "block";

    definirMensagem(mensagem, "");

    criarCartoes();
    atualizarResumo();

  } catch (erro) {
    console.error("Erro ao abrir comanda:", erro);

    definirMensagem(
      mensagem,
      "Não foi possível abrir a comanda. Confira a conexão e tente novamente."
    );

  } finally {
    botaoContinuar.disabled = false;
  }
}

botaoContinuar.addEventListener("click", abrirComanda);

async function salvarComanda() {
  if (!comandaAtual || numeroAtual === null) {
    definirMensagem(mensagemCartoes, "Abra uma comanda primeiro.");
    return;
  }

  const novosItens = gerarItensSelecao();
  const totalNovos = novosItens.reduce(function (soma, item) {
    return soma + Number(item.total || 0);
  }, 0);

  if (totalNovos > saldoAtual) {
    definirMensagem(mensagemCartoes, "O total das compras ultrapassa o saldo disponível.");
    return;
  }

  const totalAtualizado = totalGasto + totalNovos;
  const saldoAtualizado = saldoAtual - totalNovos;

  const todosItens = movimentacoes.concat(novosItens);

  botaoSalvar.disabled = true;
  definirMensagem(mensagemCartoes, "Salvando comanda...");

  try {
    const atualizacao = await supabaseClient
      .from("comandas")
      .update({
        saldo: saldoAtualizado,
        total: totalAtualizado,
        itens: todosItens
      })
      .eq("numero", numeroAtual)
      .select("*")
      .single();

    if (atualizacao.error) {
      throw atualizacao.error;
    }

    comandaAtual = atualizacao.data;
    saldoAtual = Number(comandaAtual.saldo);
    totalGasto = Number(comandaAtual.total);
    movimentacoes = Array.isArray(comandaAtual.itens)
      ? comandaAtual.itens
      : [];

    selecoes = {};

    definirMensagem(mensagemCartoes, "Comanda salva com sucesso!");

    produtos.style.display = "none";
    campoNumero.value = "";

    setTimeout(function () {
      mostrarInicio();
    }, 900);

  } catch (erro) {
    console.error("Erro ao salvar comanda:", erro);

    definirMensagem(
      mensagemCartoes,
      "Não foi possível salvar. Suas escolhas continuam na tela. Tente novamente."
    );

  } finally {
    botaoSalvar.disabled = false;
  }
}

botaoSalvar.addEventListener("click", salvarComanda);

async function buscarComandaSala2() {
  const numero = Number(campoNumeroSala2.value);

  if (!Number.isInteger(numero) || numero < 1 || numero > 50) {
    definirMensagem(mensagemSala2, "Digite um número entre 1 e 50.");
    return;
  }

  if (!supabaseClient) {
    definirMensagem(mensagemSala2, "A conexão com o Supabase não foi carregada.");
    return;
  }

  botaoBuscarSala2.disabled = true;
  definirMensagem(mensagemSala2, "Buscando comanda...");

  try {
    const resultado = await supabaseClient
      .from("comandas")
      .select("*")
      .eq("numero", numero)
      .maybeSingle();

    if (resultado.error) {
      throw resultado.error;
    }

    if (!resultado.data) {
      definirMensagem(mensagemSala2, "Essa comanda ainda não existe. Abra-a primeiro na Sala 1.");
      return;
    }

    comandaSala2Atual = resultado.data;

    movimentacoesSala2 = Array.isArray(resultado.data.itens)
      ? resultado.data.itens
      : [];

    numeroExibidoSala2.textContent = String(numero).padStart(3, "0");

    itensSala2.style.display = "block";

    definirMensagem(mensagemSala2, "");

    atualizarTelaSala2();

  } catch (erro) {
    console.error("Erro ao buscar comanda da Sala 2:", erro);

    definirMensagem(
      mensagemSala2,
      "Não foi possível buscar a comanda. Tente novamente."
    );

  } finally {
    botaoBuscarSala2.disabled = false;
  }
}

botaoBuscarSala2.addEventListener("click", buscarComandaSala2);

function atualizarTelaSala2() {
  if (!comandaSala2Atual) {
    return;
  }

  const saldo = Number(comandaSala2Atual.saldo || 0);

  const totalGanhos = movimentacoesSala2
    .filter(function (item) {
      return item.tipo === "ganho";
    })
    .reduce(function (soma, item) {
      return soma + Number(item.total || 0);
    }, 0);

  saldoSala2Elemento.textContent = formatarDinheiro(saldo);
  totalSala2Elemento.textContent = formatarDinheiro(totalGanhos);

  listaItensSala2.innerHTML = "";

  if (movimentacoesSala2.length === 0) {
    const texto = document.createElement("p");
    texto.textContent = "Nenhuma movimentação registrada.";
    listaItensSala2.appendChild(texto);
    return;
  }

  movimentacoesSala2.forEach(function (item) {
    const linha = document.createElement("div");

    const nome = document.createElement("span");
    nome.textContent = item.atividade || "Movimentação";

    const valor = document.createElement("strong");
    const sinal = item.tipo === "ganho" ? "+" : "−";

    valor.textContent = sinal + " " + dinheiro(item.total ?? item.valor ?? 0);

    linha.appendChild(nome);
    linha.appendChild(valor);

    listaItensSala2.appendChild(linha);
  });
}

function adicionarGanhoSala2() {
  if (!comandaSala2Atual) {
    definirMensagem(mensagemSala2, "Abra uma comanda primeiro.");
    return;
  }

  const atividade = campoAtividadeSala2.value.trim();
  const valor = Number(campoValorSala2.value);
  const quantidade = Number(campoQuantidadeSala2.value);

  if (!atividade) {
    definirMensagem(mensagemSala2, "Digite a descrição do ganho.");
    return;
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    definirMensagem(mensagemSala2, "Digite um valor válido.");
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade < 1) {
    definirMensagem(mensagemSala2, "Digite uma quantidade válida.");
    return;
  }

  const total = valor * quantidade;

  movimentacoesSala2.push({
    tipo: "ganho",
    atividade: atividade,
    valor: valor,
    quantidade: quantidade,
    total: total
  });

  comandaSala2Atual.saldo =
    Number(comandaSala2Atual.saldo || 0) + total;

  campoAtividadeSala2.value = "";
  campoValorSala2.value = "";
  campoQuantidadeSala2.value = "1";

  definirMensagem(mensagemSala2, "");

  atualizarTelaSala2();
}

botaoAdicionarSala2.addEventListener("click", adicionarGanhoSala2);

async function salvarSala2() {
  if (!comandaSala2Atual) {
    definirMensagem(mensagemSala2, "Abra uma comanda primeiro.");
    return;
  }

  botaoSalvarSala2.disabled = true;
  definirMensagem(mensagemSala2, "Salvando comanda...");

  try {
    const atualizacao = await supabaseClient
      .from("comandas")
      .update({
        saldo: Number(comandaSala2Atual.saldo),
        itens: movimentacoesSala2
      })
      .eq("numero", Number(comandaSala2Atual.numero))
      .select("*")
      .single();

    if (atualizacao.error) {
      throw atualizacao.error;
    }

    comandaSala2Atual = atualizacao.data;

    movimentacoesSala2 = Array.isArray(atualizacao.data.itens)
      ? atualizacao.data.itens
      : [];

    definirMensagem(mensagemSala2, "Comanda salva com sucesso!");

    itensSala2.style.display = "none";
    campoNumeroSala2.value = "";

    setTimeout(function () {
      mostrarInicio();
    }, 900);

  } catch (erro) {
    console.error("Erro ao salvar Sala 2:", erro);

    definirMensagem(
      mensagemSala2,
      "Não foi possível salvar. Confira a conexão e tente novamente."
    );

  } finally {
    botaoSalvarSala2.disabled = false;
  }
}

botaoSalvarSala2.addEventListener("click", salvarSala2);

criarCartoes();

if (supabaseClient) {
  console.log("SUPABASE CONECTADO!");
} else {
  console.error("O Supabase não foi carregado.");
}
