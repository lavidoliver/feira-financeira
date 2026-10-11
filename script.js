const SUPABASE_URL = "https://celgectqwcsdoczkfnin.supabase.co";
const SUPABASE_KEY = "sb_publishable_kKyXJsshfC40IaLh-FFhCQ_TIoeupXn";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

alert("SCRIPT CARREGADO!")

let comandas = {};
let valorTotal = 0;
let saldoAtual = 3000;
let numeroComandaAtual = null;

// ELEMENTOS DA TELA INICIAL

const telaInicio = document.querySelector("#inicio");
const botaoSala1 = document.querySelector("#sala1");
const botaoSala2 = document.querySelector("#sala2");

// ELEMENTOS DA SALA 1

const telaComanda = document.querySelector("#comanda");
const botaoContinuar = document.querySelector("#continuar");
const campoNumero = document.querySelector("#numero");
const areaProdutos = document.querySelector("#produtos");
const numeroComanda = document.querySelector("#numeroComanda");
const saldo = document.querySelector("#saldo");
const total = document.querySelector("#total");
const campoAtividade = document.querySelector("#atividade");
const campoValor = document.querySelector("#valor");
const campoQuantidade = document.querySelector("#quantidade");
const listaItens = document.querySelector("#listaItens");
const botaoAdicionar = document.querySelector("#adicionar");
const botaoSalvarComanda = document.querySelector("#salvarComanda");

// ELEMENTOS DA SALA 2

const telaSala2 = document.querySelector("#sala2Tela");
const botaoBuscarSala2 = document.querySelector("#buscarComandaSala2");
const campoNumeroSala2 = document.querySelector("#numeroComandaSala2");
const numeroExibidoSala2 = document.querySelector("#numeroExibidoSala2");
const itensSala2 = document.querySelector("#itensSala2");
const mensagemSala2 = document.querySelector("#mensagemSala2");
const campoAtividadeSala2 = document.querySelector("#atividadeSala2");
const campoValorSala2 = document.querySelector("#valorSala2");
const campoQuantidadeSala2 = document.querySelector("#quantidadeSala2");
const botaoAdicionarSala2 = document.querySelector("#adicionarSala2");
const botaoSalvarSala2 = document.querySelector("#salvarSala2");

// FUNÇÕES AUXILIARES

function obterSaldoInicial(numero) {
  if (numero >= 1 && numero <= 10) return 32000;
  if (numero >= 11 && numero <= 20) return 16000;
  if (numero >= 21 && numero <= 30) return 8000;
  if (numero >= 31 && numero <= 40) return 5000;
  if (numero >= 41 && numero <= 50) return 3000;

  return null;
}

function formatarValor(valor) {
  return Number(valor).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function exibirItensSala1() {
  listaItens.innerHTML = "";

  comandas[numeroComandaAtual].itens.forEach(function (item) {
    const linha = document.createElement("p");

    linha.textContent =
      ${item.atividade} - ${item.quantidade}x - R$ ${formatarValor(item.subtotal)};

    listaItens.appendChild(linha);
  });
}

function exibirItensSala2() {
  const numero = campoNumeroSala2.value;
  const listaSala2 = document.querySelector("#listaItensSala2");

  listaSala2.innerHTML = "";

  if (!comandas[numero].itens.length) {
    listaSala2.innerHTML = "<p>Nenhum item adicionado.</p>";
    return;
  }

  comandas[numero].itens.forEach(function (item) {
    const linha = document.createElement("p");

    linha.textContent =
      ${item.atividade} - ${item.quantidade}x - R$ ${formatarValor(item.subtotal)};

    listaSala2.appendChild(linha);
  });
}

async function salvarNoSupabase(numero) {
  const comanda = comandas[numero];

  const { error } = await supabaseClient
    .from("comandas")
    .update({
      saldo: comanda.saldo,
      total: comanda.total,
      ganhos: comanda.ganhos,
      itens: comanda.itens
    })
    .eq("numero", Number(numero));

  if (error) {
    alert("Erro ao salvar no Supabase: " + error.message);
    return false;
  }

  return true;
}

// TESTE DE CONEXÃO

async function testarSupabase() {
  const { error } = await supabaseClient
    .from("comandas")
    .select("numero")
    .limit(1);

  if (error) {
    alert("ERRO SUPABASE: " + error.message);
    return;
  }

  alert("SUPABASE FUNCIONANDO!");
}

testarSupabase();

// NAVEGAÇÃO

botaoSala1.onclick = function () {
  telaInicio.style.display = "none";
  telaSala2.style.display = "none";
  telaComanda.style.display = "block";
};

botaoSala2.onclick = function () {
  telaInicio.style.display = "none";
  telaComanda.style.display = "none";
  telaSala2.style.display = "block";
};

// SALA 1: ABRIR COMANDA

botaoContinuar.onclick = async function () {
  const numero = campoNumero.value.trim();

  if (numero === "") {
    alert("Digite o número da comanda.");
    return;
  }

  const numeroConvertido = Number(numero);
  const saldoInicial = obterSaldoInicial(numeroConvertido);

  if (saldoInicial === null) {
    alert("Número de comanda inválido. Use um número de 1 a 50.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("comandas")
    .select("*")
    .eq("numero", numeroConvertido)
    .maybeSingle();

  if (error) {
    alert("Erro ao consultar a comanda: " + error.message);
    return;
  }

  if (data) {
    alert("Essa comanda já existe. Para acessá-la, entre pela sala correspondente.");
    return;
  }

  const novaComanda = {
    numero: numeroConvertido,
    saldo: saldoInicial,
    total: 0,
    ganhos: 0,
    itens: []
  };

  const { error: erroInsercao } = await supabaseClient
    .from("comandas")
    .insert(novaComanda);

  if (erroInsercao) {
    alert("ERRO AO CRIAR COMANDA: " + erroInsercao.message);
    return;
  }

  comandas[numero] = {
    saldo: saldoInicial,
    total: 0,
    ganhos: 0,
    itens: []
  };

  numeroComandaAtual = numero;

  saldoAtual = saldoInicial;
  valorTotal = 0;

  numeroComanda.textContent = numero;
  saldo.textContent = formatarValor(saldoAtual);
  total.textContent = formatarValor(valorTotal);

  listaItens.innerHTML = "";
  areaProdutos.style.display = "block";

  campoNumero.disabled = true;
};

// SALA 1: ADICIONAR GASTO

botaoAdicionar.onclick = function () {
  const atividade = campoAtividade.value.trim();
  const valor = Number(campoValor.value);
  const quantidade = Number(campoQuantidade.value);

  if (!atividade) {
    alert("Digite o nome da atividade.");
    return;
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    alert("Digite um valor válido.");
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    alert("Digite uma quantidade inteira válida.");
    return;
  }

  const subtotal = valor * quantidade;

  if (subtotal > saldoAtual) {
    alert("Saldo insuficiente para essa compra.");
    return;
  }

  saldoAtual -= subtotal;
  valorTotal += subtotal;

  comandas[numeroComandaAtual].saldo = saldoAtual;
  comandas[numeroComandaAtual].total = valorTotal;

  comandas[numeroComandaAtual].itens.push({
    atividade: atividade,
    quantidade: quantidade,
    subtotal: subtotal,
    tipo: "gasto"
  });

  saldo.textContent = formatarValor(saldoAtual);
  total.textContent = formatarValor(valorTotal);

  exibirItensSala1();

  campoAtividade.value = "";
  campoValor.value = "";
  campoQuantidade.value = "1";
};

// SALA 1: SALVAR E SAIR

botaoSalvarComanda.onclick = async function () {
  if (numeroComandaAtual === null) {
    alert("Nenhuma comanda está aberta.");
    return;
  }

  const salvou = await salvarNoSupabase(numeroComandaAtual);

  if (!salvou) return;

  alert("Comanda " + numeroComandaAtual + " salva com sucesso!");

  telaComanda.style.display = "none";
  telaInicio.style.display = "block";

  campoNumero.value = "";
  campoNumero.disabled = false;
  campoAtividade.value = "";
  campoValor.value = "";
  campoQuantidade.value = "1";

  areaProdutos.style.display = "none";
  listaItens.innerHTML = "";

  total.textContent = "0,00";
  saldo.textContent = "0,00";

  numeroComandaAtual = null;
  valorTotal = 0;
  saldoAtual = 3000;
};

// SALA 2: BUSCAR COMANDA EXISTENTE

botaoBuscarSala2.onclick = async function () {
  const numero = campoNumeroSala2.value.trim();

  mensagemSala2.textContent = "";

  if (numero === "") {
    mensagemSala2.textContent = "Digite o número da comanda.";
    return;
  }

  const { data, error } = await supabaseClient
    .from("comandas")
    .select("*")
    .eq("numero", Number(numero))
    .maybeSingle();

  if (error) {
    mensagemSala2.textContent = "Erro ao consultar: " + error.message;
    return;
  }

  if (!data) {
    mensagemSala2.textContent = "Essa comanda não existe.";
    return;
  }

  comandas[numero] = {
    saldo: Number(data.saldo ?? 0),
    total: Number(data.total ?? 0),
    ganhos: Number(data.ganhos ?? 0),
    itens: Array.isArray(data.itens) ? data.itens : []
  };

  numeroExibidoSala2.textContent = numero;

  document.querySelector("#saldoSala2").textContent =
    formatarValor(comandas[numero].saldo);

  document.querySelector("#totalSala2").textContent =
    formatarValor(comandas[numero].ganhos);

  exibirItensSala2();

  itensSala2.style.display = "block";
};

// SALA 2: REGISTRAR GANHO

botaoAdicionarSala2.onclick = function () {
  const numero = campoNumeroSala2.value.trim();
  const atividade = campoAtividadeSala2.value.trim();
  const valor = Number(campoValorSala2.value);
  const quantidade = Number(campoQuantidadeSala2.value);

  if (!comandas[numero]) {
    alert("Busque uma comanda existente primeiro.");
    return;
  }

  if (!atividade) {
    alert("Digite como você ganhou esse dinheiro.");
    return;
  }

  if (!Number.isFinite(valor) || valor <= 0) {
    alert("Digite um valor válido.");
    return;
  }

  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    alert("Digite uma quantidade inteira válida.");
    return;
  }

  const subtotal = valor * quantidade;

  comandas[numero].saldo += subtotal;
  comandas[numero].ganhos += subtotal;

  comandas[numero].itens.push({
    atividade: atividade,
    quantidade: quantidade,
    subtotal: subtotal,
    tipo: "ganho"
  });

  document.querySelector("#saldoSala2").textContent =
    formatarValor(comandas[numero].saldo);

  document.querySelector("#totalSala2").textContent =
    formatarValor(comandas[numero].ganhos);

  exibirItensSala2();

  campoAtividadeSala2.value = "";
  campoValorSala2.value = "";
  campoQuantidadeSala2.value = "1";
};

// SALA 2: SALVAR E SAIR

botaoSalvarSala2.onclick = async function () {
  const numero = campoNumeroSala2.value.trim();

  if (!comandas[numero]) {
    alert("Busque uma comanda existente primeiro.");
    return;
  }

  const salvou = await salvarNoSupabase(numero);

  if (!salvou) return;

  alert("Comanda " + numero + " salva com sucesso!");

  telaSala2.style.display = "none";
  telaInicio.style.display = "block";

  campoNumeroSala2.value = "";
  mensagemSala2.textContent = "";

  itensSala2.style.display = "none";

  document.querySelector("#listaItensSala2").innerHTML =
    "<p>Nenhum item adicionado.</p>";

  document.querySelector("#saldoSala2").textContent = "0,00";
  document.querySelector("#totalSala2").textContent = "0,00";

  campoAtividadeSala2.value = "";
  campoValorSala2.value = "";
  campoQuantidadeSala2.value = "1";
};
